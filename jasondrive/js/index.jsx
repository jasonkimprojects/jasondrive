import React from 'react';
import axios from 'axios';
// axios needed for promise-based XHRs

class App extends React.Component {
  constructor(props) {
    super(props);
    // folder_name stores the input field of creating a new folder
    this.state = {
      files: {},
      directory: '?p=',
      folder_name: '',
    };
    // Binding handlers for changing directory, upload, and delete.
    // Also download, up one level, and creating directory.
    this.handleCD = this.handleCD.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleUpOneLevel = this.handleUpOneLevel.bind(this);
    this.handleMkdir = this.handleMkdir.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // Event handler for changing value of folder name input field.
    event.preventDefault();
    this.setState({
      folder_name: event.target.value,
    });
  }

  handleCD(event) {
    // Event handler for moving into a directory.
    event.preventDefault();
    const new_path = this.state.directory +
      event.target.getAttribute('name') + '/';
    fetch("/api/" + new_path, { credentials: 'same-origin'})
      .then( (response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then( (data) => {
        this.setState({
          files: data,
          directory: new_path,
        });
        // Add updated state to history.
        history.replaceState(this.state, '', '');
      })
      .catch(error => console.log(error));
  }

  handleUpOneLevel(event) {
    // Event handler for moving to parent directory.
    event.preventDefault();
    const url_parts = this.state.directory.split('/');
    let new_url = '';
    // Root storage directory, or one subfolder below.
    // Just redirect to root.
    if (url_parts.length < 3){
      new_url = '?p=';
    }
    else {
      // Remove the last directory in the path.
      // Since path is / terminated, must pop twice since the
      // last element after split will be an empty string.
      url_parts.pop();
      url_parts.pop();
      new_url = url_parts.join('/') + '/';
    }
    fetch("/api/" + new_url, { credentials: 'same-origin' })
      .then( (response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then( (data) => {
        this.setState({
          files: data,
          directory: new_url,
        });
        history.replaceState(this.state, '', '');
      })
      .catch(error => console.log(error));
  }

  handleUpload(event) {
    // Event handler for uploading a new file.
    event.preventDefault();
    // Cast needed to FormData object.
    const data = new FormData(event.target);
    // Using axios instead of fetch for form submission.
    axios.post("/api/" + this.state.directory, data, {})
    .then( (data) => {
      if (data.statusText !== 'OK') throw Error(data.statusText);
      // In Axios responses are already JS objects!
      this.setState({
        files: data.data,
      });
      history.replaceState(this.state, '', '');
    })
    .catch(error => console.log(error));

  }

  handleMkdir(event) {
    // Event handler for creating a new directory.
    event.preventDefault();
    // Need to retrieve user-set directory name
    let dirname = event.target.children[0].value;
    const new_path = this.state.directory + dirname + '/';
    axios.post("/api/" + new_path, { credentials: 'same-origin', method: 'post' })
      .then( (data) => {
        if (data.statusText !== 'OK') throw Error(data.statusText);
        this.setState({
          files: data.data,
          directory: new_path,
        });
        history.replaceState(this.state, '', '');
      })
      .catch(error => console.log(error));
  }

  handleDelete(event) {
    // Event handler for deleting a file or directory.
    event.preventDefault();
    const target = event.target.getAttribute('name');
    const delete_url = "/api/" + this.state.directory + target;
    const options = {
      credentials: 'same-origin',
      method: 'DELETE',
    };
    fetch(delete_url, options)
    .then( (response) => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then( (data) => {
      this.setState({
        files: data,
      });
      history.replaceState(this.state, '', '');
    })
    .catch(error => console.log(error));
  }

  handleDownload(event) {
    // Event handler for downloading a file.
    event.preventDefault();
    const download_url = "/download/" + this.state.directory +
      event.target.getAttribute('name');
    window.open(download_url);
  }

  componentDidMount() {
    // If back button led to this page, restore previous state.
    if (window.performance &&
        window.performance.navigation.type ===
        window.performance.navigation.TYPE_BACK_FORWARD) {
          if (history.state) {
            this.setState(history.state);
            return;
          }
        }
    // Obtain list of files and directories in current directory.
    fetch("/api/" + this.state.directory, { credentials: 'same-origin'})
      .then( (response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then( (data) => {
        this.setState({
          files: data,
        });
        // Add updated state to history.
        history.replaceState(this.state, '', '');
      })
      .catch(error => console.log(error));
  }

  render() {
    const filesnippets = [];
    // Iterate over dictionary of files where
    // key = filename, value = true if directory, false if file.
    Object.keys(this.state.files).forEach( (key) => {
      filesnippets.push(
        <div key={key} style={{ align: 'left' }}>
          <div style={{ display: 'inline-block' }}>
            <p>{key}</p>
          </div>
          <div style={{ display: 'inline-block' }}>
            {
              this.state.files[key] ? (
                <button id="uibutton2" name={key} onClick={this.handleCD}>Open</button>
              ) : (
                <button id="uibutton2" name={key} onClick={this.handleDownload}>Download</button>
              )
            }
            <button id="uibutton2" name={key} onClick={this.handleDelete}>Delete</button>
            </div>
        </div>
      );
    });
    // Don't display the query to the user
    const path_to_display = this.state.directory.replace("?p=", '/');
    const upload_url = "/api/" + this.state.directory;
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ display: 'inline-block' }}>
          <div style={{ display: 'inline-block' }}>
            <h3>Current Directory:</h3>
          </div>
          <div style={{ display: 'inline-block', marginLeft: '10px' }}>
            <p>{path_to_display}</p>
          </div>
          <div style={{ display: 'inline-block', marginLeft: '20px' }}>
          {
            path_to_display === '/' ? (
              <p>(At root directory)</p>
            ) : (
              <button id="uibutton" onClick={this.handleUpOneLevel}>Up One Level</button>
            )
          }
          </div>
          <div>
            <form action='' method='' onSubmit={this.handleMkdir}>
              <input type="text" value={this.state.folder_name}
                onChange={this.handleChange} placeholder="Folder Name" />
              <input id="newfolder" type="submit" value="Create New Folder" />
            </form>
          </div>
          <div style={{ marginTop: '20px' }}>
            <form action={upload_url} method='post' id="upload"
              onSubmit={this.handleUpload} encType="multipart/form-data">
                <input type="file" name="file" />
                <input id="uibutton" type="submit" name="upload" value="Upload File" />
            </form>
          </div>
          <div style={{ textAlign: 'left', marginTop: '30px' }}>
          {filesnippets}
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {};
export default App;
