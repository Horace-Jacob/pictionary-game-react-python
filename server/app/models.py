from app import db
from datetime import datetime

class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Users(TimestampMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    displayName = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    verified = db.Column(db.Boolean, default=False)
    familyName = db.Column(db.String(255), nullable=True)
    givenName = db.Column(db.String(255), nullable=True)
    picture = db.Column(db.String(255), nullable=True)
    provider = db.Column(db.String(255), nullable=True)

class GameHistory(TimestampMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gameType=db.Column(db.String(255), nullable=True)
    gameName=db.Column(db.String(255), nullable=True)
    activity=db.Column(db.String(255), nullable=True)
    host=db.Column(db.String(255), nullable=True)
    template=db.Column(db.String(255), nullable=True)
    inviteType=db.Column(db.String(255), nullable=True)
    timeLimit=db.Column(db.String(255), nullable=True)
    playerCount=db.Column(db.String(255), nullable=True)
    roomCode=db.Column(db.String(255), nullable=True)