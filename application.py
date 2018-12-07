import os

from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from flask_session import Session

# Import helper Functions
from helpers import *

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


channels = []

users = []

channel_msg_limit = 100

@app.route("/")
def index():

    # If the user has already register his username, redirect him to the /messages route
    if 'username' in session:
        return redirect("/messages", code=200)

    return render_template("index.html")

@app.route("/login", methods = ['POST'])
def login():
    """ Log user with their username """

    username = request.form.get('username-input')

    if not username in users:
        session['username'] = username
        users.append({"username": username, "channel": None})
    else:
        return jsonify({'success': False, 'message': 'That username has already been picked. Choose another one'})

    return redirect("/messages")

@app.route("/logout", methods = ['GET'])
def logout():
    """Log user out"""

    # Forget any username
    session.clear()

    # Redirect user to login form
    return redirect("/")

@app.route("/messages/<string:channel_room>")
@login_required
def chats(channel_room):
    return render_template("chatrooms.html", username = session['username'])

@app.route("/messages")
@login_required
def get_app_view():
    return render_template("chatrooms.html", username = session['username'])

@app.route("/users")
def get_users():
    return jsonify({'success': True, 'message': users })

@app.route("/upload/image", methods = ['POST'])
def upload_image():
    print(request.form)

@socketio.on('connect')
def set_user_settings():
    emit("show channel list", channels, broadcast=True)

    requested_user = get_requested_user(session['username'], users)

    # Set User Room for private chats
    room = requested_user['username']
    join_room(room)

    if requested_user['channel'] is not None:
        emit("get user room", requested_user['channel'], broadcast=False)
    else:
        emit("clean user channel localStorage", broadcast=False)

@socketio.on("set channel list")
def set_channel_list(data):
    channel_name = data["channel_name"]
    url = data["channel_url"]

    if len(channels) == 0:
        channels.append({'channel_name': channel_name, 'channel_url': url, 'channel_msg': []})
        emit("show channel list", channels, broadcast=True)
        return

    for channel in channels:
        if  channel_name in channel['channel_name']:
            emit("show error in chat", ({'success': False, 'message': 'That channel has already been picked. Use another name'}), broadcast= False)
            return False

    # It is not duplicated
    channels.append({'channel_name': channel_name, 'channel_url': url, 'channel_msg': []})
    emit("show channel list", channels, broadcast=True)


@socketio.on("get channel chat")
def get_channel_chat(data):

    requested_channel  = get_requested_channel(data["channel_url"], channels)

    emit("show channel chat", requested_channel, broadcast=False)


@socketio.on("set channel msg")
def set_channel_msgs(data):
    
    requested_channel  = get_requested_channel(data["channel_url"], channels)

    username = session['username']
    message = data["message"]
    timestamp = data["timestamp"]

    if len(requested_channel["channel_msg"]) >= channel_msg_limit:
        # Delete the oldest message on the list
        requested_channel["channel_msg"].pop(0)

    requested_channel['channel_msg'].append({'username': username, 'message': message, 'timestamp': timestamp})
    emit("show channel chat", requested_channel, room = requested_channel["channel_name"])

@socketio.on('join')
def on_join(data):
    username = session['username']  
        
    requested_user = get_requested_user(session['username'], users)
    requested_user["channel"] = data['channel_name']
    
    room = data['channel_name']
    join_room(room)
    
    # Get Chamnel Chat
    requested_channel  = get_requested_channel(data["channel_url"], channels)
    emit("show channel chat", requested_channel)


@socketio.on('leave')
def on_leave(data):
    username = session['username']
    session['channel'] = None
    room = data['channel_name']
    leave_room(room)
    send(username + ' has left the room.', room=room)