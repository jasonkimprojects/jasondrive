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
  }

  handleCD(event) {
    event.preventDefault();
    // TODO
  }

  handleUpload(event) {
    event.preventDefault();
    // TODO
  }

  handleDelete(event) {
    event.preventDefault();
    // TODO
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
              <button onClick={this.handleCD}>Open</button>
            ) : (
              <button name={key} onClick={this.handleDownload}>Download</button>
            )
          }
          <button name={key} onClick={this.handleDelete}>Delete</button>
        </div>
      );
    });
    return (
      <div style={{ textAlign: 'center'}}>
        <div style={{ display: 'inline-block' }}>
          {filesnippets}
        </div>
      </div>
    );
  }
}

App.propTypes = {};
export default App;
