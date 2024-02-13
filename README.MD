# Pictionary Game

## ** Still Under development **

### Frontend

- ReactJs with TypeScript
- Tailwind CSS
- SocketIO

### Backend

- Python
- Flask
- Flask_SocketIO
- Redis
- PostgreSQL
- SQLAlchemy

### Authentication

- Google OAuth

## ** How to run the project **

1. Clone the project repository

```bash
git clone https://github.com/Horace-Jacob/pictionary-game-react-python.git
```

2. Go to the project directory and install dependencies for both the client and server

```bash
cd client
yarn
```

```bash
cd server
pip install -r requirements.txt
```

3. Create a .env file in both client and server directories and add the environment variables as shown in the .env.examples files.

4. Start the client

```bash
cd client
yarn start
```

5. Start the server

Download google API credentials for OAUTH from Google Console

```bash
cd server
redis-server
python run.py
```
