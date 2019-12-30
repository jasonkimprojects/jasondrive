"""
API for front-end of jasondrive.
"""
import flask
import jasondrive
import os
import shutil
import tempfile

from werkzeug.utils import secure_filename

# TODO: implement API endpoints.
@jasondrive.app.route('/api/', methods=['GET', 'DELETE', 'PUT'])
def handle_files():
    # If not logged in, deny request.
    if 'username' not in flask.session:
        return flask.abort(403)
    # Args are decoded automatically, yay!
    FILEPATH = flask.request.args.get('p', default='', type=str)
    BASEPATH = jasondrive.app.config["UPLOAD_FOLDER"]
    PATH = os.path.join(BASEPATH, FILEPATH)
    if flask.request.method == 'PUT':
        if 'file' not in flask.request.files:
            # Treat as request to create a new directory.
            if not os.path.exists(PATH):
                try:
                    os.makedirs(PATH)
                except OSError:
                    jasondrive.app.logger.debug('Directory creation failed')
                    return flask.abort(500)
        # Otherwise, treat as request to upload file.
        file = flask.request.files['file']
        if not file.filename:
            jasondrive.app.logger.debug('No selected file!')
            return flask.abort(400)
        if file:
            file.save(PATH, secure_filename(file.filename))
    elif flask.request.method == 'DELETE':
        try:
            # System calls are different for deleting directories
            # recursively vs. single files.
            if os.path.isdir(PATH):
                shutil.rmtree(PATH, ignore_errors=True)
            else:
                os.remove(PATH)
            # File or directory has been removed, so go up one level.
            FILEPATH = os.path.dirname(FILEPATH)
            PATH = os.path.join(BASEPATH, FILEPATH)
        except (FileNotFoundError, IsADirectoryError) as e:
            jasondrive.app.logger.debug(str(e))
            return flask.abort(400)
    # Handle GET method - returns files in path.
    # Also used to return current files after PUT or DELETE operation.
    context = {}
    # Dictionary: keys are filenames or directory names.
    try:
        for name in os.listdir(PATH):
            # Value is a boolean - True if directory, False if file.
            if os.path.isdir(os.path.join(PATH, name)):
                context[name] = True
            else:
                context[name] = False
    except FileNotFoundError as e:
        jasondrive.app.logger.debug(str(e))
        return flask.abort(400)
    return flask.jsonify(**context)
