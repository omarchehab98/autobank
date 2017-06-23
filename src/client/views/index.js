import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import server from 'views/helpers/network.js'

import ExpensesPage from 'views/pages/ExpensesPage'
import LoginPage from 'views/pages/LoginPage'
import Status404Page from 'views/pages/Status404Page'

class Application extends Component {
  render () {
    return (
      <Router>
        <MuiThemeProvider>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <PrivateRoute path="/expenses" component={ExpensesPage} />
            <Route component={Status404Page} />
          </Switch>
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
