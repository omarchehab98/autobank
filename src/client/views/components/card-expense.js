import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import server from 'views/helpers/network.js'
import {
  Card, CardHeader, CardText, CardActions
} from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'

class CardExpense extends Component {
  state = {
    loading: 0,
    DeleteDialog: {
      isOpen: false
    }
  }

  DeleteDialog = {
    handleClose: () => {
      this.setState({
        DeleteDialog: {
          isOpen: false
        }
      })
    },

    handleOpen: () => {
      this.setState({
        DeleteDialog: {
          isOpen: true
        }
      })
    },

    handleDelete: () => {
      this.setState(prev => ({
        loading: prev.loading + 1,
        DeleteDialog: {
          isOpen: false
        }
      }))
      let promise
      switch (this.props.type) {
        case 'expense':
          promise = server.removeExpense(this.props.id)
          break
        case 'income':
          promise = server.removeIncome(this.props.id)
          break
      }
      promise.then(() => {
        this.setState(prev => ({
          loading: prev.loading - 1
        }))
        this.props.onDelete(this.props.id)
      })
    }
  }

  render () {
    const amount = this.props.amount + ' ' + this.props.currency
    const time = moment(this.props.timestamp * 1000).fromNow()
    const hidden = this.props.account.length - 4
    const account = '*'.repeat(hidden) + this.props.account.substring(hidden)
    return (
      <Card style={{margin: '10px 0'}}>
        <CardHeader
          title={amount}
          titleColor={this.props.amount <= 0 ? '#933' : '#393'}
          subtitle={this.props.description}
          actAsExpander={true}
          showExpandableButton={true}
        />

        <CardText expandable={true}>
          {this.props.account && <div>
            Account {account}
          </div>}

          {this.props.availableCredit &&
          <div>
            Available Credit {this.props.availableCredit + ' ' + this.props.currency}
          </div>}

          <div>
            {time}
          </div>
        </CardText>

        <CardActions>
          <IconButton
            tooltip="Delete"
            tooltipPosition="bottom-center"
            onTouchTap={this.DeleteDialog.handleOpen}>
            <FontIcon className="material-icons"
              color="#444">
              delete
            </FontIcon>
          </IconButton>

          {this.state.loading && <CircularProgress />}

          <Dialog
            modal={false}
            open={this.state.DeleteDialog.isOpen}
            onReqeustClose={this.DeleteDialog.handleClose}
            actions={[
              <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.DeleteDialog.handleClose}
              />,
              <FlatButton
                label="Delete"
                primary={true}
                onTouchTap={this.DeleteDialog.handleDelete}
              />
            ]}
          >
            Delete expense {this.props.description}?
          </Dialog>
        </CardActions>
      </Card>
    )
  }
}

CardExpense.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  amount: PropTypes.number,
  currency: PropTypes.string,
  timestamp: PropTypes.number,
  account: PropTypes.string,
  availableCredit: PropTypes.number,
  description: PropTypes.string,
  onDelete: PropTypes.func
}

export default CardExpense
