import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Redirect
} from 'react-router'

import server from 'views/helpers/network.js'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import LinearProgress from 'material-ui/LinearProgress'

class LoginPage extends Component {
  static propTypes = {
    location: PropTypes.object
  }

  state = {
    redirectToReferrer: false,
    privateKey: '',
    error: false,
    skipRender: server.token !== null,
    loading: 0
  }

  componentDidMount () {
    if (server.token !== null) {
      this.setState(prev => ({
        loading: prev.loading + 1
      }))
      server.validateToken(server.token)
        .then(isAuthenticated => {
          if (isAuthenticated) {
            this.setState(prev => ({
              redirectToReferrer: true,
              loading: prev.loading - 1
            }))
          } else {
            this.setState(prev => ({
              skipRender: false,
              loading: prev.loading - 1
            }))
          }
        })
    }
  }

  handlePrivateKeyChange = event => {
    const privateKey = event.target.value
    this.setState({
      privateKey,
      error: false
    })
  }

  handleLoginClick = event => {
    const {privateKey} = this.state

    this.setState(prev => ({
      loading: prev.loading + 1
    }))

    server.authenticate(privateKey)
      .then(result => {
        if (result.error) {
          this.setState(prev => ({
            error: result.error,
            loading: prev.loading - 1
          }))
        } else {
          this.setState(prev => ({
            redirectToReferrer: true,
            error: false,
            loading: prev.loading - 1
          }))
        }
      })
      .catch(() => {
        this.setState(prev => ({
          error: 'Network error.',
          loading: prev.loading - 1
        }))
      })
  }

  render () {
    const {
      redirectToReferrer,
      skipRender,
      privateKey,
      error,
      loading
    } = this.state

    if (redirectToReferrer) {
      const {
        from
      } = this.props.location.state || { from: { pathname: '/expenses' } }
      return (
        <Redirect to={from}/>
      )
    }

    if (skipRender) {
      return <div/>
    }

    return (
      <Dialog
        title="Authenticate"
        actions={[
          <FlatButton
            label="Login"
            primary={true}
            disabled={loading > 0 && privateKey.length === 0}
            onClick={this.handleLoginClick}
          />
        ]}
        modal={true}
        open={true}
      >
        Before you can enter, you need to prove that you are Omar.
        <TextField
          hintText="Keep it secret, keep it safe."
          floatingLabelText="Private key"
          type="password"
          value={privateKey}
          errorText={error}
          onChange={this.handlePrivateKeyChange}
          style={{width: '100%'}}/>
        {loading > 0 && <LinearProgress mode="indeterminate" />}
      </Dialog>
    )
  }
}

export default LoginPage
