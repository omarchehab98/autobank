import React, {Component} from 'react'
import CardExpense from 'views/components/card-expense.js'
import server from 'views/helpers/network.js'
import './home.scss'
import Card from 'material-ui/Card'
import Chip from 'material-ui/Chip'
import {Bar as BarChart} from 'react-chartjs-2'
import moment from 'moment'
import {colorMoney} from 'views/helpers/colors.js'

export default class HomePage extends Component {
  state = {
    expenses: [],
    balance: 0,
    weekly: {
      income: [0, 0, 0, 0, 0, 0, 0],
      totalIncome: 0,
      expenses: [0, 0, 0, 0, 0, 0, 0],
      totalExpenses: 0,
      start: moment().startOf('week')
    }
  }

  componentWillMount () {
    const byTimestampDesc = (x1, x2) => {
      return x2.timestamp - x1.timestamp
    }
    server.getExpenses(0, Date.now())
      .then(expenses => {
        const newExpenses = this.state.expenses
          .concat(expenses.map(expense => ({
            type: 'expense',
            ...expense
          })))
          .sort(byTimestampDesc)
        this.setState({
          expenses: newExpenses
        })
        this.analyzeExpenses(newExpenses)
      })
    server.getIncome(0, Date.now())
      .then(income => {
        const newExpenses = this.state.expenses
          .concat(income.map(income => ({
            type: 'income',
            ...income
          })))
          .sort(byTimestampDesc)
        this.setState({
          expenses: newExpenses
        })
        this.analyzeExpenses(newExpenses)
      })
  }

  analyzeExpenses (expenses) {
    const balance = Math.round(this.state.expenses
      .reduce((s, x) => s + x.amount, 0))

    const weekStart = this.state.weekly.start.unix()
    const day = 24 * 60 * 60
    const toWeekDays = (days, x) => {
      const i = Math.floor((x.timestamp - weekStart) / day)
      days[i] += x.amount
      return days
    }

    const weeklyIncome = expenses
      .filter(x => x.timestamp >= weekStart && x.timestamp < weekStart + day * 7)
      .filter(x => x.amount > 0)
      .reduce(toWeekDays, [0, 0, 0, 0, 0, 0, 0])

    const totalWeeklyIncome = Math.round(weeklyIncome
      .reduce((s, x) => s + x, 0))

    const weeklyExpenses = expenses
      .filter(x => x.timestamp >= weekStart && x.timestamp < weekStart + day * 7)
      .filter(x => x.amount < 0)
      .reduce(toWeekDays, [0, 0, 0, 0, 0, 0, 0])

    const totalWeeklyExpenses = Math.round(weeklyExpenses
      .reduce((s, x) => s + x, 0))

    this.setState(prev => ({
      balance,
      weekly: Object.assign(prev.weekly, {
        income: weeklyIncome,
        expenses: weeklyExpenses,
        totalIncome: totalWeeklyIncome,
        totalExpenses: totalWeeklyExpenses
      })
    }))
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
        <Card style={{margin: '10px 0', padding: '16px'}}>
          <div style={{display: 'flex', textAlign: 'center'}}>
            <MoneySum
              title="Balance"
              subtitle="(total)"
              value={this.state.balance}
              currency="CAD"
            />
            <MoneySum
              title="Income"
              subtitle="(week)"
              value={this.state.weekly.totalIncome}
              currency="CAD"
            />
            <MoneySum
              title="Expenses"
              subtitle="(week)"
              value={this.state.weekly.totalExpenses}
              currency="CAD"
            />
          </div>
          <BarChart
            data={{
              labels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
              datasets: [
                {
                  backgroundColor: colorMoney(1),
                  label: 'Income',
                  data: this.state.weekly.income
                },
                {
                  backgroundColor: colorMoney(-1),
                  label: 'Expense',
                  data: this.state.weekly.expenses.map(Math.abs)
                }
              ]
            }}
            options={{
              scales: {
                xAxes: [{
                  stacked: true
                }],
                yAxes: [{
                  stacked: true
                }]
              }
            }}
          />
        </Card>

        {this.state.expenses.map(expense => {
          const currDate = moment(expense.timestamp * 1000)
          const currDay = currDate.day()
          let divider
          if (!prevDay || prevDay !== currDay) {
            divider = (
              <Chip style={{margin: '0 auto'}}>
                {currDate.format('Y-M-D')}
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

function MoneySum(props) {
  return (
    <div style={{display: 'inline-block', flexGrow: 1}}>
      <h3 style={{marginTop: 5, marginBottom: 0, fontWeight: 'normal'}}>
        {props.title}
      </h3>
      <div style={{marginBottom: 5, fontSize: 12, fontStyle: 'italic'}}>
        {props.subtitle}
      </div>
      <span style={{color: colorMoney(props.value)}}>
        {props.value} {props.currency}
      </span>
    </div>
  )
}
