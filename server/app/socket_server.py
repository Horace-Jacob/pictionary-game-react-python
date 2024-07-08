from app import socketio, redis_client
from flask import request, current_app
from flask_socketio import emit
import secrets
import string
from .tasks import process_drawing
import json
from app.schema import History
from app.models import GameHistory
from . import db
from app import app

room_socket_mapping = {}


def save_to_redis(room, room_info):
    with app.app_context():
        redis_client.set(room, json.dumps(room_info))

def generate_room_code():
    # Define the character set for the room code (uppercase letters and digits)
    characters = string.ascii_uppercase + string.digits

    # Generate a 6-character room code using secrets.choice()
    room_code = ''.join(secrets.choice(characters) for _ in range(6))

    return room_code



@socketio.on("disconnect")
def disconnected():
    disconnected_socket_id = request.sid
    room_code = room_socket_mapping.get(disconnected_socket_id)
    if room_code:
        room_info = redis_client.get(room_code)
        if room_info:
            deserialized_data = json.loads(room_info)
            if disconnected_socket_id in deserialized_data.get("players", {}):
                del deserialized_data["players"][disconnected_socket_id]
                del deserialized_data["player_pictures"][disconnected_socket_id]
                deserialized_data["total_players"] -= 1
                if deserialized_data["total_players"] == 0:
                    redis_client.delete(room_code)
                else:
                    redis_client.set(room_code, json.dumps(deserialized_data))
                    emit("playerDisconnected", {"message": "Player Disconnected", "data": json.dumps(deserialized_data)}, broadcast=True)
        room_socket_mapping.pop(disconnected_socket_id, None)



@socketio.on('createRoom')
def handleCreateRoom(data):
    room_code = generate_room_code()
    socket_id = request.sid
    player_name = data.get("name")
    
    serialized_data = json.dumps({
        "players": {
            socket_id: player_name
        },
        "owner": socket_id,
        "roomCode": room_code,
        "total_players": 1,
        "player_pictures": {
            socket_id: data.get("picture")
        },
        "drawing": [],
        **data  # Include all fields from data
    })
    new_history = GameHistory(
        gameType="Pictionary",
        gameName=data.get("gameTitle"),
        activity="Pictionary",
        host=data.get("hostEmail"),
        template=data.get("gameTitle"),
        inviteType="Link",
        timeLimit = data.get("timeLimit"),
        playerCount="1",
        roomCode=room_code
    )
    db.session.add(new_history)
    db.session.commit()
    redis_client.set(room_code, serialized_data)
    room_socket_mapping[socket_id] = room_code
    emit("createRoom", {"message": room_code},broadcast=True)



@socketio.on('joinRoom')
def handleJoinRoom(data):
    room_code = data.get("roomCode")
    owner_name = data.get("name")
    room_info = redis_client.get(room_code)
    deserialized_data = json.loads(room_info)
    player_exists = request.sid in deserialized_data.get("players", {})
    if room_info:
        if player_exists:
            emit("roomCreated", 
                 {"message": f"{owner_name} created with code {room_code}", "data": json.dumps(deserialized_data)}, 
                 broadcast=True)
        else:
            player_name = data.get("name")
            deserialized_data["players"] = deserialized_data.get("players", {})
            deserialized_data["player_pictures"][request.sid] = data.get("picture")
            deserialized_data["players"][request.sid] = player_name
            deserialized_data["total_players"] += 1
            history_entry = GameHistory.query.filter_by(roomCode=room_code).first()
            if history_entry:
                history_entry.playerCount = str(int(deserialized_data["total_players"] + 1))
                db.session.commit()
            redis_client.set(room_code, json.dumps(deserialized_data))
            room_socket_mapping[request.sid] = room_code
            drawing_data = deserialized_data.get('drawing', [])
            emit("newPlayerJoinedRoom", 
                 {"message": f"Player {player_name} joined room {room_code}", "data": json.dumps(deserialized_data)}, broadcast=True)
            emit('load_drawing', drawing_data)
    else:
        emit('roomDoesNotExist', {"message": f"Room does not exist"}, broadcast=True)

@socketio.on("startGame")
def startGame(data):
    room_code = data.get("roomCode")
    room_info = redis_client.get(room_code)
    if room_info:
        deserialized_data = json.loads(room_info)
        deserialized_data['status'] = True
        redis_client.set(room_code, json.dumps(deserialized_data))

@socketio.on("checkPlayerCount")
def checkPlayerCount(data):
    room_code = data.get("roomCode")
    room_info = redis_client.get(room_code)
    if room_info:
        deserialized_data = json.loads(room_info)
        emit("checkPlayerCount", {"data": deserialized_data['total_players']}, broadcast=True)

@socketio.on("draw")
def handleDraw(data):
    room_code = data.get("roomCode")
    drawing_data = data.get("drawingData")
    # room_info = redis_client.get(room_code)
    # deserialized_data = json.loads(room_info)
    
    # redis_client.set(room_code, json.dumps(deserialized_data))
    emit('draw', drawing_data, broadcast=True)

@socketio.on('draw-data')
def draw(data):
    emit('draw-data', data, broadcast=True)

@socketio.on('draw_action')
def handle_draw_action(data):
    roomCode = data['roomCode']
    action = data['action']
    room_info = redis_client.get(roomCode)
    deserialized_data = json.loads(room_info)
    drawing_actions = deserialized_data.get('drawing', [])
    drawing_actions.append(action)
    deserialized_data['drawing'] = drawing_actions
    # redis_client.set(roomCode, json.dumps(deserialized_data))
    socketio.start_background_task(save_to_redis, roomCode, deserialized_data)
    emit('draw_action', action, include_self=False, broadcast=True)

@socketio.on('batch_draw_actions')
def handle_batch_draw_actions(data):
    roomCode = data['roomCode']
    actions = data['actions']
    room_info = redis_client.get(roomCode)
    if room_info:
        deserialized_data = json.loads(room_info)
        drawing_actions = deserialized_data.get('drawing', [])
        drawing_actions.extend(actions)
        deserialized_data['drawing'] = drawing_actions
        socketio.start_background_task(save_to_redis, roomCode, deserialized_data)
    emit('batch_draw_actions', actions, include_self=False, broadcast=True)

@socketio.on('request_more_actions')
def handle_request_more_actions(data):
    pass