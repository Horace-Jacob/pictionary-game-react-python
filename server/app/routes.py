from . import app, db
from flask_restful import Resource, Api
from app.models import Users
from flask import redirect, request, make_response, jsonify
import os
import pathlib
from google_auth_oauthlib.flow import Flow
from flask_restful import Resource
from .schema import UserSchema
import json
from app import redis_client
from flask_cors import cross_origin

client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(client_secrets_file=client_secrets_file, 
                                     scopes=
                                     ["https://www.googleapis.com/auth/userinfo.profile", 
                                      "openid", 
                                      "https://www.googleapis.com/auth/userinfo.email",],
                                     redirect_uri="http://127.0.0.1:5000/auth/google/callback")


api = Api(app)

class LoginResource(Resource):
    def get(self):
        authorization_url, state = flow.authorization_url()
        print(authorization_url)
        redis_client.set("state", state)
        return redirect(authorization_url)

class CallbackResource(Resource):
    def get(self):
        flow.fetch_token(authorization_response=request.url)
        
        my_session = flow.authorized_session()
        user_info = my_session.get(
                            'https://www.googleapis.com/userinfo/v2/me').json()
        credentials = flow.credentials
        user = Users.query.filter_by(email=user_info.get("email")).first()
        
        if user is None:
            user = Users(
                displayName=user_info.get("name"),
                email=user_info.get("email"),
                verified=user_info.get("email_verified"),
                familyName=user_info.get("family_name"),
                givenName=user_info.get("given_name"),
                picture=user_info.get("picture"),
                provider="Google",
            )
            db.session.add(user)
            db.session.commit()
        response = make_response(redirect("http://localhost:3000?jwt={}".format(credentials._id_token)))
        return response

class UserList(Resource):
    def get(self):
        users = Users.query.all()
        user_schema = UserSchema(many=True)
        serialized_users = user_schema.dump(users)
        redis_client.set('users', json.dumps(serialized_users))
        return jsonify({'users': serialized_users})

class ProfileResource(Resource):
    def get(self):
        
        user = Users.query.filter_by(email="horacejacob121@gmail.com").first()

        if user:
            profile_data = {
                'picture': user.picture
            }

            return jsonify(profile_data)
        # else:
        #     return {"message": "user not found"}

api.add_resource(UserList, '/users')
api.add_resource(LoginResource, "/login")
api.add_resource(CallbackResource, "/auth/google/callback")
api.add_resource(ProfileResource, "/me")
