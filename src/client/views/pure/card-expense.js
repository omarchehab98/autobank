import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Card, CardHeader, CardText, CardActions
} from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

function CardExpense (props) {
  const amount = props.amount + ' ' + props.currency
  const time = moment(props.timestamp * 1000).fromNow()
  const hidden = props.account.length - 4
  const account = '*'.repeat(hidden) + props.account.substring(hidden)
  return (
    <Card style={{margin: '10px 0'}}>
      <CardHeader
        title={amount}
        titleColor={props.amount <= 0 ? '#933' : '#393'}
        subtitle={props.description}
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        {props.account && <div>
          Account {account}
        </div>}
        {props.availableCredit &&
        <div>
          Available Credit {props.availableCredit + ' ' + props.currency}
        </div>}
        <div>
          {time}
        </div>
      </CardText>
      <CardActions>
        <IconButton
          tooltip="Delete"
          tooltipPosition="bottom-center">
          <FontIcon className="material-icons"
            color="#444">
            delete
          </FontIcon>
        </IconButton>
      </CardActions>
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
