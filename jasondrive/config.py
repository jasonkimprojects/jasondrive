"""
Config file.
"""
import os

APPLICATION_ROOT = '/'
# CHANGE SECRET KEY BEFORE LAUNCHING AN INSTANCE!!!
SECRET_KEY = b'\xabCY\xe8x\nw\x04\xcd\xdbI\x17@>\x80X\xfc\xa8~\xb1\xa8\x81*\xf5'
SESSION_COOKIE_NAME = 'login'
# Upload files to var/uploads/
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(
                os.path.realpath(__file__))), 'var', 'uploads')
# Let app know DB filename
DATABASE_FILENAME = os.path.join(os.path.dirname(os.path.dirname(
                    os.path.realpath(__file__))), 'var', 'jasondrive.sqlite3')

