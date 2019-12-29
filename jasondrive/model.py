"""
Interface for jasondrive database.
Referenced from EECS 485 starter code for linking SQLite database.
"""
import jasondrive
import flask
import sqlite3


def dict_factory(cursor, row):
    """Database row to dictionary."""
    output = {}
    for idx, col in enumerate(cursor.description):
        output[col[0]] = row[idx]
    return output


def get_db():
    """New database connection."""
    if not hasattr(flask.g, 'sqlite_db'):
        flask.g.sqlite_db = sqlite3.connect(
            jasondrive.app.config['DATABASE_FILENAME'])
        flask.g.sqlite_db.row_factory = dict_factory
        # Enable foreign keys per-connection
        flask.g.sqlite_db.execute("PRAGMA foreign_keys = ON")
    return flask.g.sqlite_db


@jasondrive.app.teardown_appcontext
def close_db(error):
    """Close DB when a request is fulfilled."""
    if hasattr(flask.g, 'sqlite_db'):
        flask.g.sqlite_db.commit()
        flask.g.sqlite_db.close()
