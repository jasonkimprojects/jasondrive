import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: {},
      directory: '?p=',
    };
    // Binding handlers for changing directory, upload, and delete.
    // Also download!
    this.handleCD = this.handleCD.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleUpOneLevel = this.handleUpOneLevel.bind(this);
  }

  handleCD(event) {
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
    // TODO
  }

  handleUpOneLevel(event) {
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
    event.preventDefault();
    const form = event.target;
    const options = {
      method: 'post',
      body: form,
    };
    fetch("/api/" + this.state.directory, options)
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

  handleDelete(event) {
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
        <div key={key}>
          <p>{key}</p>
          {
            this.state.files[key] ? (
              <button name={key} onClick={this.handleCD}>Open</button>
            ) : (
              <button name={key} onClick={this.handleDownload}>Download</button>
            )
          }
          <button name={key} onClick={this.handleDelete}>Delete</button>
        </div>
      );
    });
    const path_to_display = this.state.directory.replace("?p=", '/');
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ display: 'inline-block' }}>
          <h3>Current Directory:</h3>
          <p>{path_to_display}</p>
          {
            path_to_display === '/' ? (
              <p>At root directory</p>
            ) : (
              <button onClick={this.handleUpOneLevel}>Up One Level</button>
            )
          }
          <form action='' method='post' onSubmit={this.handleUpload}
              encType="multipart/form-data">
              <input type="file" name="file" />
              <input type="submit" name="submit" value="Upload File" />
          </form>
          {filesnippets}
        </div>
      </div>
    );
  }
}

App.propTypes = {};
export default App;
