import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

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
    props.children
  )
}
