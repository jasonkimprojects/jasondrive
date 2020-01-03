# JasonDrive

A bungled version of Google Drive without the bells and whistles for duplicate servers and distributed file systems. But still full stack: this was an exercise in SQLite and Python/Flask in the back end and React for the front end, done over the last couple days of 2019 when I was bored over winter break.

JasonDrive is licensed under the GNU GPL v3.0. Use on your own or with some friends to share files over the network, but at your own risk!

## Logging in

The default login credentials are:
* username=`admin`
* password=`password`

Very insecure, but the intent was for actual users (myself included) to create additional accounts or at least change the default user's password. This can be done in SQLite3 by adding a row to the `users` table. The hashed password entry is in the form `algorithm$salt$hash`, where `hash` is the digest of `salt + password`.

## Files

The 'root directory' that users see as `/` is in fact `var/uploads/` in the project folder. Users are prohibited from specifying an absolute path or calling `..`, since that would extend the scope of reading and writing files beyond the project folder. Filenames are preserved on upload and download, but are sanitized with Python's `secure_filename()`.

## Supported operations

* Downloading and uploading files
* Deleting files and directories
* Creating new directories
* Sharing files (to everyone logged in!)

## Scripts

All bash scripts are in `bin/`. Use `install` to handle all the tools and dependencies after cloning this repo and before running the server on your machine. The script creates a new Python virtual environment, installs the `jasondrive` package plus its dependencies, and the front end toolchain with `node`.

Use `manage_db` to create, delete, or reset the database of authorized users.

Finally, use `run` to start the server! Debug mode is on by default.
