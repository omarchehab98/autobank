import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import server from 'views/helpers/network.js'

import ExpensesPage from 'views/pages/ExpensesPage'
import LoginPage from 'views/pages/LoginPage'

class Application extends Component {
  render () {
    return (
      <Router>
        <MuiThemeProvider>
          <div>
            <Route exact path="/" component={LoginPage} />
            <PrivateRoute path="/expenses" component={ExpensesPage} />
          </div>
        </MuiThemeProvider>
      </Router>
    )
  }
}

function PrivateRoute ({ component: Component, ...rest }) {
  return (
    <Route {...rest}
      render={props => (
        server.isAuthenticated ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: '/',
            state: { from: props.location }
          }}/>
        )
      )}/>
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  location: PropTypes.string
}

export default Application
