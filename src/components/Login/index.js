import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    showErrorMsg: false,
    errorMessage: '',
  }

  onChangeUserId = event => {
    this.setState({
      userId: event.target.value,
    })
  }

  onChangePin = event => {
    this.setState({
      pin: event.target.value,
    })
  }

  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })

    history.replace('/')
  }

  fail = errorMessage => {
    this.setState({
      showErrorMsg: true,
      errorMessage,
    })
  }

  onClickLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.fail(data.error_msg)
    }
  }

  render() {
    const {userId, pin, showErrorMsg, errorMessage} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-container">
        <div className="responsive-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="image"
            />
          </div>
          <form className="form-container" onSubmit={this.onClickLogin}>
            <h1 className="header"> Welcome Back! </h1>
            <div className="input-container">
              <label htmlFor="user" className="label">
                User ID
              </label>
              <input
                id="user"
                placeholder="142420"
                className="input"
                type="text"
                value={userId}
                onChange={this.onChangeUserId}
              />
            </div>
            <div className="input-container">
              <label htmlFor="pin" className="label">
                PIN
              </label>
              <input
                placeholder="231225"
                id="pin"
                className="input"
                type="password"
                value={pin}
                onChange={this.onChangePin}
              />
            </div>
            <button className="submit-btn" type="submit">
              Login
            </button>
            <div className="container">
              {showErrorMsg === true && (
                <p className="error-msg">{errorMessage}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login