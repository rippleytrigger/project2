import os

from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit
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
        users.append(username)
    else:
        return jsonify({'success': False, 'message': 'That username has already been picked. Choose another one'})

    return redirect("/messages", code=200)

@app.route("/logout", methods = ['GET'])
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")

@app.route("/messages/<string:channel_room>")
@login_required
def chats(channel_room):
    return render_template("chatrooms.html", username = session['username'])

@app.route("/messages")
@login_required
def chats_room():
    return render_template("chatrooms.html", username = session['username'])

@socketio.on('connect')
def test_connect():
    emit("show channel list", channels, broadcast=True)
    #emit('get channel list', {'data': channels })

@socketio.on("set channel list")
def set_channel_list(data):
    channel_name = data["channel_name"]
    url = data["channel_url"]

    if len(channels) == 0:
        channels.append({'channel_name': channel_name, 'channel_url': url, 'channel_msg': []})
        emit("show channel list", channels, broadcast=True)

    if not channel in channels.channel_name:
        channels.append({'channel_name': channel_name, 'channel_url': url, 'channel_msg': []})
        emit("show channel list", channels, broadcast=True)
    else:
        return jsonify({'success': False, 'message': 'That channel has already been picked. Choose another one'})

@socketio.on("get channel chat")
def get_channel_chat(data):

    requested_channel  = get_requested_channel(data["channel_url"], channels)

    emit("show channel chat", requested_channel, broadcast=True)

@socketio.on("set channel msg")
def set_channel_msgs(data):
    
    requested_channel  = get_requested_channel(data["channel_url"], channels)

    username = session['username']
    message = data["message"]
    timestamp = data["timestamp"]

    requested_channel['channel_msg'].append({'username': username, 'message': message, 'timestamp': timestamp})
    emit("show channel chat", requested_channel, broadcast=True)


