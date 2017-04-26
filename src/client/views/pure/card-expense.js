import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Card, CardHeader, CardText
} from 'material-ui/Card';

export default props => {
  const amount = props.amount + ' ' + props.currency
  const time = moment(props.timestamp * 1000).fromNow()
  return (
    <Card style={{margin: '10px 0'}}>
      <CardHeader
        title={amount}
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

