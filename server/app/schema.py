from marshmallow import Schema, fields

class UserSchema(Schema):
    id = fields.Integer()
    displayName = fields.String()
    email = fields.String()
    picture = fields.String()

class TokenSchema(Schema):
    token = fields.String()
    success = fields.Boolean()

class History(Schema):
    id = fields.Integer()
    gameType = fields.String()
    gameName = fields.String()
    activity = fields.String()
    host = fields.String()
    template = fields.String()
    inviteType = fields.String()
    timeLimit = fields.String()
    playerCount = fields.String()