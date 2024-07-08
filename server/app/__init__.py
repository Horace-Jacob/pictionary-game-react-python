# __init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_socketio import SocketIO
import redis
from rq import Queue
from .redis_conn import setup_redis
from flask_session import Session
import json

app = Flask(__name__)
cors = CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['Access-Control-Allow-Origin'] = '*'
app.config["Access-Control-Allow-Headers"]="Content-Type"
app.config.from_object('config.Config')

db = SQLAlchemy(app)
migrate = Migrate(app, db)
setup_redis(app)
redis_client = redis.StrictRedis.from_url(app.config['SESSION_REDIS'])

q = Queue(connection=redis_client)

from app import routes, socket_server



