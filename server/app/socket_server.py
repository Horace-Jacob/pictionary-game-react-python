from app import socketio, redis_client, q
from flask import request
from flask_socketio import emit
import secrets
import string
from .tasks import process_drawing
import json

room_socket_mapping = {}

# def initialize_mapping_from_redis():
#     for room_code in redis_client.keys():
#         room_info = redis_client.get(room_code)
        
#         if room_info:
#             # Attempt to parse the JSON data
#             try:
#                 deserialized_data = json.loads(room_info)
#             except json.JSONDecodeError as e:
#                 # Log the error and continue to the next iteration
#                 continue

#             # Check if deserialized_data is a list
#             if isinstance(deserialized_data, list):
#                 # Handle the case where deserialized_data is a list
#                 continue

#             # Check if "players" is a dictionary
#             if isinstance(deserialized_data.get("players"), dict):
#                 for socket_id in deserialized_data["players"]:
#                     room_socket_mapping[socket_id] = room_code


# initialize_mapping_from_redis()


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
                    print(deserialized_data)
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
        **data  # Include all fields from data
    })
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
            redis_client.set(room_code, json.dumps(deserialized_data))
            room_socket_mapping[request.sid] = room_code
            emit("newPlayerJoinedRoom", 
                 {"message": f"Player {player_name} joined room {room_code}", "data": json.dumps(deserialized_data)}, broadcast=True)
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

@socketio.on("draw")
def handleDraw(data):
    room_code = data.get("roomCode")
    drawing_data = data.get("drawingData")
    # room_info = redis_client.get(room_code)
    # deserialized_data = json.loads(room_info)
    
    # redis_client.set(room_code, json.dumps(deserialized_data))
    emit('draw', drawing_data, broadcast=True)
        
# @socketio.on('draw')
# def handle_draw(data):
#     print(data)
#     emit('draw', data, broadcast=True)

# @socketio.on('clear')
# def handle_clear():
#     emit('clear', broadcast=True)