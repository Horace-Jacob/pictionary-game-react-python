from flask_session import Session


def setup_redis(app):
    app.config['SESSION_TYPE'] = 'redis'
    app.config['SESSION_PERMANENT'] = False
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_KEY_PREFIX'] = 'your_prefix'
    app.config['SESSION_REDIS'] = 'redis://127.0.0.1:6379'
    Session(app)