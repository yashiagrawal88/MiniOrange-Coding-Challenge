import React, { Component } from 'react'
import axios from 'axios';
import './App.css';


class App extends Component {

  constructor() {
    super()
    this.state = {
      email: null,
      password: null,
      login: null,
      store: null,
      post: null,
    }
  }

  componentDidMount() {

    this.storeCollector();
  }
  //this login function sends http post to server with email and password
  login() {
    axios.post('http://localhost:8000/api/login', {
      email: this.state.email,
      password: this.state.password
    })
      .then(response => {
        console.log(response); //Here we get the respone and token in console


        //saving the received token in the local storage
        localStorage.setItem('login', JSON.stringify({
          login: true,
          token: response.data.token
        }))
        this.storeCollector();
      })
      .catch(error => {
        console.log(error);

      })
  }

  //get the localStorage data
  storeCollector() {
    let store = JSON.parse(localStorage.getItem('login'))
    if (store && store.login) {
      this.setState({
        login: true,
        store: store
      })

    }
  }


  createPost() {
    let token = "Bearer " + this.state.store.token;
    let config = {
      headers: {
        Authorization: token
      }
    }

    axios.post("http://localhost:8000/api/posts", {
      post: this.state.post
    }, config)
      .then(response => {
        console.log("response from protected route", response);
      }).catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <div className="App">

        {
          !this.state.login ?
            <div>
              <h1>LOGIN</h1>
              <input type="text" autoComplete="new-password" onChange={(event => { this.setState({ email: event.target.value }) })} /> <br />
              <input type="password" autoComplete="new-password" onChange={(event => { this.setState({ password: event.target.value }) })} /> <br />
              <button onClick={() => { this.login() }}>Login</button>

            </div>

            :
            <div>
              <h1>Post Something!</h1>
              <textarea onChange={(event) => this.setState({ post: event.target.value })}>

              </textarea>
              <br />
              <button onClick={() => { this.createPost() }}>Post data</button>
            </div>
        }



      </div>

    );
  }
}

export default App;
