import React, {Component} from 'react'
import Card from 'views/pure/card.js'
import CardExpense from 'views/pure/card-expense.js'
import server from 'views/helpers/network.js'

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
      <div>
        <Card>
          Hello Omar!
        </Card>
        {this.state.expenses.map(expense =>
          <CardExpense {...expense}/>)}
      </div>
    )
  }
}
