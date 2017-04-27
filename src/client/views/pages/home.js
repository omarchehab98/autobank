import React, {Component} from 'react'
import CardExpense from 'views/components/card-expense.js'
import server from 'views/helpers/network.js'
import './home.scss'
import Chip from 'material-ui/Chip'

export default class HomePage extends Component {
  state = {
    expenses: []
  }

  componentWillMount () {
    const byTimestampDesc = (x1, x2) => {
      return x2.timestamp - x1.timestamp
    }
    server.getExpenses(0, Date.now())
      .then(expenses => this.setState(prev => ({
        expenses: prev.expenses
          .concat(expenses.map(expense => ({
            type: 'expense',
            ...expense
          })))
          .sort(byTimestampDesc)
      })))
    server.getIncome(0, Date.now())
      .then(income => this.setState(prev => ({
        expenses: prev.expenses
          .concat(income.map(income => ({
            type: 'income',
            ...income
          })))
          .sort(byTimestampDesc)
      })))
  }

  handleEditExpense = (id, changes) => {
    const byTimestampDesc = (x1, x2) => {
      return x2.timestamp - x1.timestamp
    }
    this.setState(prev => ({
      expenses: prev.expenses
        .map(x => {
          if (x.id === id) {
            x = Object.assign(x, {
              description: changes.description,
              timestamp: changes.timestamp
            })
          }
          return x
        })
        .sort(byTimestampDesc)
    }))
  }

  handleDeleteExpense = id => {
    this.setState(prev => ({
      expenses: prev.expenses
        .filter(x => x.id !== id)
    }))
  }

  render () {
    let prevDay
    return (
      <div className="home">
        {this.state.expenses.map(expense => {
          const currDate = new Date(expense.timestamp * 1000)
          const currDay = currDate.getDate()
          let divider
          if (!prevDay || prevDay !== currDay) {
            divider = (
              <Chip style={{margin: '0 auto'}}>
                {currDate.toISOString().substring(0, 10)}
              </Chip>
            )
          }
          prevDay = currDay
          return [
            divider,
            <CardExpense
              key={expense.id}
              {...expense}
              onEdit={this.handleEditExpense}
              onDelete={this.handleDeleteExpense}
            />
          ]
        })}
      </div>
    )
  }
}
