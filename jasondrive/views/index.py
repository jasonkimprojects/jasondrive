"""
jasondrive index.html view.
"""
import shutil
import tempfile
import hashlib
import os
import uuid
import flask
import jasondrive

# TODO implement index server-side functions

@jasondrive.app.route('/', methods=['GET'])
def show_index():
    """Display / route."""
    context = {}
    # If user is not logged in, redirect.
    if 'username' not in flask.session:
        return flask.redirect(flask.url_for('show_login'))
    # Otherwise, TODO


@jasondrive.app.route('/login/', methods=['GET', 'POST'])
def show_login():
    """Display login route."""
    # If logged in, redirect to index page.
    if 'username' in flask.session:
        return flask.redirect(flask.url_for('show_index'))
    db = jasondrive.model.get_db()
    # Handle POST request for login.
    if flask.request.method == 'POST':
        username = flask.request.form['username']
        password = flask.request.form['password']
        # Check that both are nonempty
        if not username or not password:
            jasondrive.app.logger.debug('No username or password!')
            return flask.abort(403)
        # Search username in database.
        user_row = db.cursor().execute(
            """ SELECT * FROM users WHERE username - ? """,
            (username,)).fetchone()
        if not user_row:
            jasondrive.app.logger.debug('Account does not exist!')
            return flask.abort(403)
        # Check password entry with hashed password.
        pwd_info = user_row['password'].split('$')
        # Then index 0 = algorithm, 1 = salt, 2 = password hash.
        hasher = hashlib.new(pwd_info[0])
        hasher.update((pwd_info[1] + password).encode('utf-8'))
        # Compare to hashed password in database.
        if hasher.hexdigest() != pwd_info[2]:
            jasondrive.app.logger.debug('Password is incorrect!')
            return flask.abort(403)
        # Otherwise if password is correct, set cookie.
        flask.session['username'] = username
        return flask.redirect(flask.url_for('show_index'))
    # Handle GET request.
    return flask.render_template('login.html')
