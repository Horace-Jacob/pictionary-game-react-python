# from app import redis_client
# import json


# def process_drawing(room_code, socket_id, drawing_data):
#     pass
    # room_info = redis_client.get(room_code)
    # if room_info:
    #     deserialized_data = json.loads(room_info)
    #     if deserialized_data.get("drawings") is None:
    #         deserialized_data["drawings"] = []
    #     deserialized_data["drawings"].append({"socket_id": socket_id, "data": drawing_data})
    #     redis_client.set(room_code, json.dumps(deserialized_data))