import json
from rq import get_current_job, Connection
from app import redis_client
from app import socketio

def process_drawing(room_code, offset_x, offset_y, owner_sid):
    print(room_code)
    room_info = redis_client.get(room_code)
    deserialized_data = json.loads(room_info)
    deserialized_data['drawingData'] = {
        "offsetX": offset_x,
        'offsetY': offset_y
    }

    redis_client.set(room_code, json.dumps(deserialized_data))

    if owner_sid != deserialized_data["owner"]:
        socketio.emit('draw', json.dumps(deserialized_data), broadcast=True)