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
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import {colorMoney} from 'views/helpers/colors.js'
import AutoComplete from 'material-ui/AutoComplete';

class CardExpense extends Component {
  state = {
    loading: 0,
    EditDialog: {
      isOpen: false,
      description: this.props.description,
      timestamp: this.props.timestamp * 1000,
      category: this.props.category
    },
    DeleteDialog: {
      isOpen: false
    }
  }

  EditDialog = {
    handleClose: () => {
      this.setState(prev => ({
        EditDialog: Object.assign(prev.EditDialog, {
          isOpen: false,
          description: this.props.description,
          timestamp: this.props.timestamp * 1000
        })
      }))
    },

    handleOpen: () => {
      this.setState(prev => ({
        EditDialog: Object.assign(prev.EditDialog, {
          isOpen: true
        })
      }))
    },

    handleEditDescription: (event, description) => {
      this.setState(prev => ({
        EditDialog: Object.assign(prev.EditDialog, {
          description
        })
      }))
    },

    handleEditTimestamp: (isPickingTime, event, date) => {
      this.setState(prev => {
        const newDate = new Date(prev.EditDialog.timestamp)
        if (isPickingTime) {
          const hours = date.getHours()
          const minutes = date.getMinutes()
          console.log(hours, minutes)
          newDate.setHours(hours)
          newDate.setMinutes(minutes)
        } else {
          const day = date.getDate()
          const month = date.getMonth()
          const year = date.getFullYear()
          newDate.setDate(day)
          newDate.setMonth(month)
          newDate.setFullYear(year)
        }
        return {
          EditDialog: Object.assign(prev.EditDialog, {
            timestamp: newDate.getTime()
          })
        }
      })
    },

    handleEditCategory: (category) => {
      this.setState(prev => ({
        EditDialog: Object.assign(prev.EditDialog, {
          category
        })
      }))
    },

    handleSave: () => {
      this.setState(prev => ({
        loading: prev.loading + 1,
        EditDialog: Object.assign(prev.EditDialog, {
          isOpen: false
        })
      }))
      const changes = Object.assign({},
        this.state.EditDialog, {
          timestamp: Math.floor(this.state.EditDialog.timestamp / 1000)
        })
      let promise
      switch (this.props.type) {
        case 'expense':
          promise = server.editExpense(this.props.id, changes)
          break
        case 'income':
          promise = server.editIncome(this.props.id, changes)
          break
      }
      promise.then(() => {
        this.setState(prev => ({
          loading: prev.loading - 1
        }))
        this.props.onEdit(this.props.id, changes)
      })
    }
  }

  DeleteDialog = {
    handleClose: () => {
      this.setState(prev => ({
        DeleteDialog: Object.assign(prev.DeleteDialog, {
          isOpen: false
        })
      }))
    },

    handleOpen: () => {
      this.setState(prev => ({
        DeleteDialog: Object.assign(prev.DeleteDialog, {
          isOpen: true
        })
      }))
    },

    handleDelete: () => {
      this.setState(prev => ({
        loading: prev.loading + 1,
        DeleteDialog: Object.assign(prev.DeleteDialog, {
          isOpen: false
        })
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
          titleColor={colorMoney(this.props.amount)}
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
          {/* Edit */}
          <IconButton
            tooltip="Edit"
            tooltipPosition="bottom-center"
            onTouchTap={this.EditDialog.handleOpen}>
            <FontIcon className="material-icons"
              color="#444">
              edit
            </FontIcon>
          </IconButton>

          <Dialog
            modal={false}
            open={this.state.EditDialog.isOpen}
            onReqeustClose={this.EditDialog.handleClose}
            actions={[
              <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.EditDialog.handleClose}
              />,
              <FlatButton
                label="Save"
                primary={true}
                onTouchTap={this.EditDialog.handleSave}
              />
            ]}
          >
            <AutoComplete
              hintText="Category"
              searchText={this.state.EditDialog.category}
              onUpdateInput={this.EditDialog.handleEditCategory}
              dataSource={this.props.categories}
              filter={AutoComplete.caseInsensitiveFilter}
              openOnFocus={true}
              fullWidth={true}
            />
            <TextField
              hintText="Description"
              value={this.state.EditDialog.description}
              onChange={this.EditDialog.handleEditDescription}
              fullWidth={true}
            />
            <DatePicker
              hintText="Date"
              minDate={new Date(0)}
              maxDate={new Date()}
              value={new Date(this.state.EditDialog.timestamp)}
              onChange={this.EditDialog.handleEditTimestamp.bind(this, false)}
              fullWidth={true}
            />
            <TimePicker
              hintText="Time"
              value={new Date(this.state.EditDialog.timestamp)}
              onChange={this.EditDialog.handleEditTimestamp.bind(this, true)}
              fullWidth={true}
            />
          </Dialog>

          {/* Delete */}
          <IconButton
            tooltip="Delete"
            tooltipPosition="bottom-center"
            onTouchTap={this.DeleteDialog.handleOpen}>
            <FontIcon className="material-icons"
              color="#444">
              delete
            </FontIcon>
          </IconButton>

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

          {this.state.loading &&
          <CircularProgress
              size={24}
              style={{
                float: 'right',
                padding: 12,
                margin: 0
              }}
          />}
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
  category: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  categories: PropTypes.array
}

export default CardExpense
