import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import Card from 'material-ui/Card'

class Status404Page extends Component {
  render () {
    return (
      <Card style={{ padding: 20, margin: 10 }}>
        <p>
          Whoops! This page does not exist.
        </p>
        <p>
          What do the geeks call it again-- four, oh' four
        </p>
        <p style={{ margin: 0 }}>
          <Link to="/">
            Let me escort you home
          </Link>
        </p>
      </Card>
    )
  }
}

export default Status404Page
