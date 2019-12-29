"""
Init file for jasondrive.
"""
import flask

# Referenced from __init__ from EECS 485 to setup Flask.
app = flask.Flask(__name__)
# Read settings from config file.
app.config.from_object('jasondrive.config')
# Overlay settings from environment variable.
app.config.from_envvar('JASONDRIVE_SETTINGS', silent=True)
# Import views, api, and model for database.
import jasondrive.model
import jasondrive.views
import jasondrive.api

