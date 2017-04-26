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
    server.getExpenses(0, Date.now())
      .then(expenses => this.setState({
        expenses
      }))
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
