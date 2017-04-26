import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Card, CardHeader, CardText
} from 'material-ui/Card'

function CardExpense (props) {
  const amount = props.amount + ' ' + props.currency
  const time = moment(props.timestamp * 1000).fromNow()
  return (
    <Card style={{margin: '10px 0'}}>
      <CardHeader
        title={amount}
        titleColor={props.amount <= 0 ? '#933' : '#393'}
        subtitle={time}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <div className="card-expense-account">
          Account {'*'.repeat(12) + props.account.substring(12)}
        </div>
        {props.availableCredit &&
        <div className="card-expense-availablecredit">
          Available Credit {props.availableCredit + ' ' + props.currency}
        </div>}
        <div className="card-expense-description">
          {props.description}
        </div>
      </CardText>
      </Card>
  )
}

CardExpense.propTypes = {
  amount: PropTypes.number,
  currency: PropTypes.string,
  timestamp: PropTypes.number,
  account: PropTypes.string,
  availableCredit: PropTypes.number,
  description: PropTypes.description
}

export default CardExpense
