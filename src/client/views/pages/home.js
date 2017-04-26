import React, {Component} from 'react'
import CardExpense from 'views/pure/card-expense.js'
import server from 'views/helpers/network.js'
import './home.scss'

export default class HomePage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      expenses: []
    }
  }

  componentWillMount () {
    const byTimestampDesc = (x1, x2) => {
      return x1.timestamp < x2.timestamp
    }
    server.getExpenses(0, Date.now())
      .then(expenses => this.setState(prev => ({
        expenses: prev.expenses
          .concat(expenses)
          .sort(byTimestampDesc)
      })))
    server.getIncome(0, Date.now())
      .then(income => this.setState(prev => ({
        expenses: prev.expenses
          .concat(income)
          .sort(byTimestampDesc)
      })))
  }

  render () {
    return (
      <div className="home">
        {this.state.expenses.map(expense =>
          <CardExpense {...expense}/>)}
      </div>
    )
  }
}
