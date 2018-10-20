import re
import os
from flask import redirect, render_template, request, session
from functools import wraps

def login_required(f):
    """
    Decorate routes to require login.

    http://flask.pocoo.org/docs/0.12/patterns/viewdecorators/
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("username") is None:
            return redirect("/")
        return f(*args, **kwargs)
    return decorated_function

def get_requested_channel(url, channels):
    for channel in channels:
        if url == channel['channel_url']:
            requested_channel = channel
            print(requested_channel)
            return requested_channel

    return False