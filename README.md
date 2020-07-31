# Slacker

Mini chat app that uses websockets to provide realtime updates

> Assignment for the course: CS50 Web Programming with Python and JavaScript

![Slacker](https://github.com/RoyVoetman/Slacker/blob/master/.docs/Slacker.jpg?raw=true)

## Getting started
Using a virtual environment (Mac OS):
```bash
python3 -m venv venv
source ./venv/bin/activate
./venv/bin/python3 -m pip install -r requirements.txt
./venv/bin/python3 application.py
```

## Eventlet
Add eventlet to resolve the following warning:

```
WebSocket transport not available. Install eventlet or gevent and gevent-websocket for improved performance.
```

> Source https://github.com/miguelgrinberg/Flask-SocketIO/issues/647

## No use of Flask Run command
To prevent the following warning: 
```
WARNING in __init__: Flask-SocketIO is Running under Werkzeug, WebSocket is not available.
```
I moved from using `flask run` to `python3 application.py`

> Source https://stackoverflow.com/questions/56617773/flask-socketio-is-running-under-werkzeug-websocket-is-not-available-what-does
