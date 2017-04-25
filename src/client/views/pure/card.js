import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import './card.scss'

export default class Card extends PureComponent {
  render () {
    return (
      <div className="card">
        {this.props.children}
      </div>
    )
  }
}

Card.propTypes = {
  children: PropTypes.node
}
