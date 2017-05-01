import React, {Component} from 'react'
import PropTypes from 'prop-types'
import CardExpense from 'views/components/card-expense.js'
import server from 'views/helpers/network.js'
import './home.scss'
import Card from 'material-ui/Card'
import Chip from 'material-ui/Chip'
import {
  Bar as BarChart,
  Doughnut as DoughnutChart
} from 'react-chartjs-2'
import moment from 'moment'
import {colorMoney, hashHSL} from 'views/helpers/colors.js'
import {map} from 'lodash'

/**
 * Helper function used like `reduce(toCategory, {})` on `expenses` or `income`
 * @param {Object} categories
 * @param {Object} x
 */
function toCategory (categories, x) {
  const key = x.category || 'Other'
  if (!categories[key]) {
    categories[key] = 0
  }
  categories[key] += x.amount
  return categories
}

export default class HomePage extends Component {
  state = {
    // overall
    expenses: [],
    accountBalances: {},
    // weekly data
    weekly: {
      start: moment().startOf('week'),
      labels: [0, 0, 0, 0, 0, 0, 0]
        .map((x, i) => {
          const t = moment().startOf('week').add(i, 'd')
          return t.isSame(moment(), 'day') ? 'Today' : t.format('MMM D')
        }),
      totalIncome: 0,
      totalExpenses: 0,
      // bar chart
      income: [0, 0, 0, 0, 0, 0, 0],
      expenses: [0, 0, 0, 0, 0, 0, 0]
    },
    // monthly data
    monthly: {
      start: moment().startOf('month'),
      totalIncome: 0,
      totalExpenses: 0,
      // pie chart
      income: {},
      expenses: {}
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
        }, this.analyzeExpenses)
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
        }, this.analyzeExpenses)
      })
  }

  analyzeExpenses () {
    // Total
    function toAccount (accounts, x) {
      const key = x.account
      if (!accounts[key]) {
        accounts[key] = 0
      }
      accounts[key] += x.amount
      return accounts
    }

    const accountBalances = this.state.expenses
      .map(x => ({...x, amount: Math.round(x.amount)}))
      .reduce(toAccount, {})

    const day = 24 * 60 * 60

    // Weekly
    const weekStart = this.state.weekly.start.unix()
    const weekEnd = moment(weekStart).endOf('week')

    const toWeekDays = (days, x) => {
      const i = Math.floor((x.timestamp - weekStart) / day)
      days[i] += x.amount
      return days
    }

    const weeklyIncome = this.state.expenses
      .filter(x => x.timestamp >= weekStart && x.timestamp < weekEnd)
      .filter(x => x.amount > 0)
      .map(x => ({...x, amount: Math.round(x.amount)}))
      .reduce(toWeekDays, [0, 0, 0, 0, 0, 0, 0])

    const totalWeeklyIncome = weeklyIncome
      .reduce((s, x) => s + x, 0)

    const weeklyExpenses = this.state.expenses
      .filter(x => x.timestamp >= weekStart && x.timestamp < weekEnd)
      .filter(x => x.amount < 0)
      .map(x => ({...x, amount: Math.round(x.amount)}))
      .reduce(toWeekDays, [0, 0, 0, 0, 0, 0, 0])

    const totalWeeklyExpenses = weeklyExpenses
      .reduce((s, x) => s + x, 0)

    // Monthly
    const monthStart = this.state.monthly.start.unix()
    const monthEnd = moment(monthStart).endOf('month')

    let monthlyIncome = this.state.expenses
      .filter(x => x.timestamp >= monthStart && x.timestamp < monthEnd)
      .filter(x => x.amount > 0)
      .map(x => ({...x, amount: Math.round(x.amount)}))

    const totalMonthlyIncome = monthlyIncome
      .reduce((s, x) => s + x.amount, 0)

    monthlyIncome = monthlyIncome
      .reduce(toCategory, {})

    let monthlyExpenses = this.state.expenses
      .filter(x => x.timestamp >= monthStart && x.timestamp < monthEnd)
      .filter(x => x.amount < 0)
      .map(x => ({...x, amount: Math.round(x.amount)}))

    const totalMonthlyExpenses = monthlyExpenses
      .reduce((s, x) => s + x.amount, 0)

    monthlyExpenses = monthlyExpenses
      .map(x => ({...x, amount: Math.abs(x.amount)}))
      .reduce(toCategory, {})

    this.setState(prev => ({
      accountBalances,
      weekly: {
        ...prev.weekly,
        income: weeklyIncome,
        expenses: weeklyExpenses,
        totalIncome: totalWeeklyIncome,
        totalExpenses: totalWeeklyExpenses
      },
      monthly: {
        ...prev.monthly,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        totalIncome: totalMonthlyIncome,
        totalExpenses: totalMonthlyExpenses
      }
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
            x = {
              ...x,
              description: changes.description,
              timestamp: changes.timestamp,
              category: changes.category
            }
          }
          return x
        })
        .sort(byTimestampDesc)
    }), this.analyzeExpenses)
  }

  handleDeleteExpense = id => {
    this.setState(prev => ({
      expenses: prev.expenses
        .filter(x => x.id !== id)
    }), this.analyzeExpenses)
  }

  render () {
    let prevDay
    return (
      <div className="home">
        {/* Total */}
        <Card style={{margin: '10px 0', padding: '16px'}}>
          <div style={{display: 'flex', textAlign: 'center'}}>
            {map(this.state.accountBalances, (balance, account) =>
            <MoneySum
              key={account}
              title="Balance"
              subtitle={'(' + account.substring(account.length - 4, account.length) + ')'}
              value={balance}
              currency="CAD"
            />)}
          </div>
        </Card>
        {/* Weekly */}
        <Card style={{margin: '10px 0', padding: '16px'}}>
          <div style={{display: 'flex', textAlign: 'center'}}>
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
          {(this.state.weekly.totalIncome - this.state.weekly.totalExpenses > 0) &&
          <BarChart
            data={{
              labels: this.state.weekly.labels,
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
          />}
        </Card>
        {/* Monthly */}
        <Card style={{margin: '10px 0', padding: '16px'}}>
          <div style={{display: 'flex', textAlign: 'center'}}>
            <MoneySum
              title="Income"
              subtitle="(month)"
              value={this.state.monthly.totalIncome}
              currency="CAD"
            />
            <MoneySum
              title="Expenses"
              subtitle="(month)"
              value={this.state.monthly.totalExpenses}
              currency="CAD"
            />
          </div>
          {(this.state.monthly.totalIncome - this.state.monthly.totalExpenses > 0 &&
            Object.keys(this.state.monthly.expenses).length > 1) &&
            <DoughnutChart
            data={{
              labels: Object.keys(this.state.monthly.expenses),
              datasets: [{
                data: Object.values(this.state.monthly.expenses),
                backgroundColor: Object.keys(this.state.monthly.expenses).map(s => hashHSL(s, '75%', '40%'))
              }]
            }}
          />}
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
              categories={Object.keys(this.state.expenses.reduce(toCategory, {}))}
              onEdit={this.handleEditExpense}
              onDelete={this.handleDeleteExpense}
            />
          ]
        })}
      </div>
    )
  }
}

function MoneySum (props) {
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

MoneySum.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  value: PropTypes.number,
  currency: PropTypes.string
}
