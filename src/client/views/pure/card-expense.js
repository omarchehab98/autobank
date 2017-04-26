import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import './card-expense.scss'
import moment from 'moment'

import Card from './card.js'

export default class CardExpense extends PureComponent {
  render () {
    const amount = this.props.amount + ' ' + this.props.currency
    const time = moment(this.props.timestamp * 1000).fromNow()
    return (
      <Card>
        <span className="card-expense-amount">{amount}</span>
        <span className="card-expense-time">{time}</span>
        <div className="card-expense-description">{this.props.description}</div>
      </Card>
    )
  }
}

CardExpense.propTypes = {
  account: PropTypes.string,
  amount: PropTypes.number,
  availableCredit: PropTypes.number,
  currency: PropTypes.string,
  description: PropTypes.string,
  timestamp: PropTypes.number
}
