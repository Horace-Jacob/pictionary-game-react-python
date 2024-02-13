import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "pictionarygamekey"
    PORT = os.getenv('PORT', '5000')
    SQLALCHEMY_DATABASE_URI = os.environ.get("PSQL_URL") or 'postgresql://postgres:awesomepassword123@localhost:5432/pictionary_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # redis connection
    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = 'your_prefix'
    SESSION_REDIS = 'redis://localhost:6379'

    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID") or ""
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET") or ""

    OAUTHLIB_INSECURE_TRANSPORT = True
    
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

    @staticmethod
    def init_app(app):
        pass