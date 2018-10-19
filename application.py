import os

from flask import Flask, render_template
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
    # Redirect user to messages if connected
    if session.get("username"):
        return redirect("/messages")

    return render_template("index.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/login", methods = ['POST'])
def login():
    """ Log user with their username """

    username = request.form.get('username-input')

    session['username'] = username

    print(session)

    return redirect("/messages", code=200)


@app.route("/messages")
@login_required
def chats_global():
    return render_template("chatrooms.html")

"""
@app.route("/chatrooms")
@login_required
def chats():
    return render_template("chatrooms.html")
"""


@socketio.on("channel list")
def vote(data):
    channel = data["channel"]
    channels.append(channel)

    emit("channels", channels, broadcast=True)


@socketio.on("users")
def vote(data):
    channel = data["channel"]
    votes[selection] += 1
    emit("vote totals", votes, broadcast=False)