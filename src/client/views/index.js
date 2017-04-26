import React from 'react'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import HomePage from 'views/pages/home.js'

export default (
  <Layout>
    <Router>
      <Route exact path="/" component={HomePage} />
    </Router>
  </Layout>
)

function Layout (props) {
  return (
    <MuiThemeProvider>
      {props.children}
    </MuiThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node
}
