import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "<secret_key>"
    PORT = os.getenv('PORT', '5000')
    SQLALCHEMY_DATABASE_URI = os.environ.get("PSQL_URL") or 'postgresql://<username>:<password>@<host>/<db>'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # redis connection
    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = 'your_prefix'
    SESSION_REDIS = '<YOUR_REDIS_HOST>'

    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID") or "<YOUR_GOOGLE_CLIENT_ID>"
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET") or "<YOUR_GOOGLE_CLIENT_SECRET>"

    OAUTHLIB_INSECURE_TRANSPORT = True
    
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    @staticmethod
    def init_app(app):
        pass
