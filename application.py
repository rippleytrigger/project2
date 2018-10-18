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

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods = ['POST'])
def login():
    """ Log user with their username """

    username = request.form.get('username')

    session['username'] = username

    return redirect("/messages")


@app.route("/messages")
@login_required
def chats_global():
    return render_template("chatrooms-global.html")

"""
@app.route("/chatrooms")
@login_required
def chats():
    return render_template("chatrooms.html")
"""


  