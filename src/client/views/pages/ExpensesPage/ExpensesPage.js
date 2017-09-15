import React, {Component} from 'react'
import PropTypes from 'prop-types'

import server from 'views/helpers/network.js'
import ExpenseCard from 'views/components/ExpenseCard'
import { colorMoney, hashHSL } from 'views/helpers/colors.js'

import {
  Bar as BarChart,
  Doughnut as DoughnutChart
} from 'react-chartjs-2'
import moment from 'moment'
import map from 'lodash/map'

import Card from 'material-ui/Card'
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

/**
 * Helper function used like `reduce(toCategory, {})` on `expenses`
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

/**
 * Helper function used like `reduce(toAccount, {})` on `expenses`
 * @param {Object} accounts
 * @param {Object} x
 */
function toAccount (accounts, x) {
  const key = x.account
  if (!accounts[key]) {
    accounts[key] = 0
  }
  accounts[key] += x.amount
  return accounts
}

/**
 * Helper function used like `sort(byTimestampDesc)` on `expenses`
 * @param {Object} x1
 * @param {Object} x2
 */
function byTimestampDesc (x1, x2) {
  return x2.timestamp - x1.timestamp
}

class ExpensesPage extends Component {
  state = {
    // overall
    expenses: [],
    accountBalances: undefined,
    // weekly data
    weekly: {
      start: moment().startOf('week'),
      labels: [0, 0, 0, 0, 0, 0, 0],
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

  componentDidMount () {
    const lastFetch = 0
    // const lastFetch = window.localStorage.getItem('lastFetch') || 0
    const now = Date.now()

    // this.setState(() => ({
    //   expenses: JSON.parse(window.localStorage.getItem('expenses') || '[]')
    //     .concat(JSON.parse(window.localStorage.getItem('income') || '[]'))
    //     .sort(byTimestampDesc)
    // }), this.analyzeExpenses)

    server.getExpenses(lastFetch, now)
      .then(expenses => {
        const newExpenses = this.state.expenses
          .concat(expenses.map(expense => ({
            type: 'expense',
            ...expense
          })))
          .sort(byTimestampDesc)
        this.setState({
          expenses: newExpenses
        }, () => {
          window.localStorage.setItem('lastFetch', now)
          const { expenses } = this.state
          window.localStorage.setItem('expenses', JSON.stringify(
            expenses.filter(({ type }) => type === 'expense')
          ))
          this.analyzeExpenses()
        })
      })

    server.getIncome(lastFetch, now)
      .then(income => {
        const newExpenses = this.state.expenses
          .concat(income.map(income => ({
            type: 'income',
            ...income
          })))
          .sort(byTimestampDesc)
        this.setState({
          expenses: newExpenses
        }, () => {
          window.localStorage.setItem('lastFetch', now)
          const { expenses } = this.state
          window.localStorage.setItem('income', JSON.stringify(
            expenses.filter(({ type }) => type === 'income')
          ))
          this.analyzeExpenses()
        })
      })
  }

  analyzeExpenses () {
    const accountBalances = this.state.expenses
      .map(x => ({ ...x, amount: Math.round(x.amount) }))
      .reduce(toAccount, {})
    const weeklyChart = this.Weekly.computeForChart(this.state.weekly.start)
    const monthlyChart = this.Monthly.computeForChart(this.state.monthly.start)

    this.setState(prev => ({
      accountBalances,
      weekly: {
        ...prev.weekly,
        ...weeklyChart
      },
      monthly: {
        ...prev.monthly,
        ...monthlyChart
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

  Weekly = {
    handlePrev: event => {
      const start = moment(this.state.weekly.start)
        .add(-1, 'd')
        .startOf('week')
      this.setState({
        weekly: {
          start,
          ...this.Weekly.computeForChart(start)
        }
      })
    },

    handleNext: event => {
      const start = moment(this.state.weekly.start)
        .endOf('week')
        .add(1, 'd')
        .startOf('week')
      this.setState({
        weekly: {
          start,
          ...this.Weekly.computeForChart(start)
        }
      })
    },

    computeForChart: start => {
      const weekStart = start.unix()
      const weekEnd = moment(weekStart * 1000).endOf('week').unix()

      const day = 24 * 60 * 60
      const toWeekDays = (days, x) => {
        const i = Math.floor((x.timestamp - weekStart) / day)
        days[i] += x.amount
        return days
      }

      const weeklyIncome = this.state.expenses
        .filter(x => x.timestamp >= weekStart && x.timestamp <= weekEnd)
        .filter(x => x.amount > 0)
        .map(x => ({ ...x, amount: Math.round(x.amount) }))
        .reduce(toWeekDays, [0, 0, 0, 0, 0, 0, 0])

      const totalWeeklyIncome = weeklyIncome
        .reduce((s, x) => s + x, 0)

      const weeklyExpenses = this.state.expenses
        .filter(x => x.timestamp >= weekStart && x.timestamp <= weekEnd)
        .filter(x => x.amount < 0)
        .map(x => ({ ...x, amount: Math.round(x.amount) }))
        .reduce(toWeekDays, [0, 0, 0, 0, 0, 0, 0])

      const totalWeeklyExpenses = weeklyExpenses
        .reduce((s, x) => s + x, 0)

      const weeklyLabels = [0, 0, 0, 0, 0, 0, 0]
        .map((x, i) => {
          const t = moment(weekStart * 1000)
            .startOf('week')
            .add(i, 'd')
          return t
            .isSame(moment(), 'day')
            ? 'Today'
            : t.format('MMM D')
        })

      return {
        labels: weeklyLabels,
        income: weeklyIncome,
        expenses: weeklyExpenses,
        totalIncome: totalWeeklyIncome,
        totalExpenses: totalWeeklyExpenses
      }
    }
  }

  Monthly = {
    handlePrev: event => {
      const start = moment(this.state.monthly.start)
        .add(-1, 'd')
        .startOf('month')
      this.setState({
        monthly: {
          start,
          ...this.Monthly.computeForChart(start)
        }
      })
    },

    handleNext: event => {
      const start = moment(this.state.monthly.start)
        .endOf('month')
        .add(1, 'd')
      this.setState({
        monthly: {
          start,
          ...this.Monthly.computeForChart(start)
        }
      })
    },

    computeForChart: start => {
      const monthStart = start.unix()
      const monthEnd = moment(monthStart * 1000).endOf('month').unix()

      let monthlyIncome = this.state.expenses
        .filter(x => x.timestamp >= monthStart && x.timestamp <= monthEnd)
        .filter(x => x.amount > 0)
        .map(x => ({ ...x, amount: Math.round(x.amount) }))

      const totalMonthlyIncome = monthlyIncome
        .reduce((s, x) => s + x.amount, 0)

      monthlyIncome = monthlyIncome
        .reduce(toCategory, {})

      let monthlyExpenses = this.state.expenses
        .filter(x => x.timestamp >= monthStart && x.timestamp <= monthEnd)
        .filter(x => x.amount < 0)
        .map(x => ({ ...x, amount: Math.round(x.amount) }))

      const totalMonthlyExpenses = monthlyExpenses
        .reduce((s, x) => s + x.amount, 0)

      monthlyExpenses = monthlyExpenses
        .map(x => ({ ...x, amount: Math.abs(x.amount) }))
        .reduce(toCategory, {})

      return {
        income: monthlyIncome,
        expenses: monthlyExpenses,
        totalIncome: totalMonthlyIncome,
        totalExpenses: totalMonthlyExpenses
      }
    }
  }

  render () {
    if (this.state.accountBalances === undefined) {
      return null
    }
    const isEmpty = Object.keys(this.state.accountBalances).length
    let prevDay
    return (
      <div className="home">
        {!isEmpty && (
          <Card style={{ margin: '10px 0', padding: '16px' }}>
            <div style={{ fontSize: 20, fontWeight: 'normal' }}>Hello Omar!</div>
            <p>You do not have any expenses logged into the database yet.</p>
          </Card>
        )}
        {!!isEmpty && (
          <div>
            {/* Total */}
            <Card style={{ margin: '10px 0', padding: '16px' }}>
              <div style={{ display: 'flex', textAlign: 'center' }}>
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
            <Card style={{ margin: '10px 0', padding: '16px' }}>
              <div className="home-timerange-heading">
                {this.state.weekly.start
                  .format('MMM D') +
                  ' - ' +
                moment(this.state.weekly.start)
                  .endOf('week')
                  .format('MMM D')}
              </div>
              <div style={{ display: 'flex', textAlign: 'center' }}>
                {/* Previous Week */}
                <div>
                  <IconButton
                    tooltip="Previous week"
                    tooltipPosition="bottom-center"
                    onTouchTap={this.Weekly.handlePrev}>
                    <FontIcon className="material-icons"
                      color="#444">
                      chevron_left
                    </FontIcon>
                  </IconButton>
                  <div className="home-timerange-sm">
                    {moment(this.state.weekly.start)
                      .add(-7, 'd')
                      .format('MMM D')}
                  </div>
                </div>
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
                <div>
                  {/* Next Week */}
                  <IconButton
                    tooltip="Next week"
                    tooltipPosition="bottom-center"
                    onTouchTap={this.Weekly.handleNext}>
                    <FontIcon className="material-icons"
                      color="#444">
                      chevron_right
                    </FontIcon>
                  </IconButton>
                  <div className="home-timerange-sm">
                    {moment(this.state.weekly.start)
                      .add(7, 'd')
                      .format('MMM D')}
                  </div>
                </div>
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
            <Card style={{ margin: '10px 0', padding: '16px' }}>
              <div className="home-timerange-heading">
                {this.state.monthly.start
                  .format('MMM D') +
                  ' - ' +
                moment(this.state.monthly.start)
                  .endOf('month')
                  .format('MMM D')}
              </div>
              <div style={{ display: 'flex', textAlign: 'center' }}>
                <div>
                  {/* Previous Month */}
                  <IconButton
                    tooltip="Previous month"
                    tooltipPosition="bottom-center"
                    onTouchTap={this.Monthly.handlePrev}>
                    <FontIcon className="material-icons"
                      color="#444">
                      chevron_left
                    </FontIcon>
                  </IconButton>
                  <div className="home-timerange-sm">
                    {moment(this.state.monthly.start)
                      .add(-1, 'd')
                      .startOf('month')
                      .format('MMM D')}
                  </div>
                </div>
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
                <div>
                  {/* Next Month */}
                  <IconButton
                    tooltip="Next month"
                    tooltipPosition="bottom-center"
                    onTouchTap={this.Monthly.handleNext}>
                    <FontIcon className="material-icons"
                      color="#444">
                      chevron_right
                    </FontIcon>
                  </IconButton>
                  <div className="home-timerange-sm">
                    {moment(this.state.monthly.start)
                      .endOf('month')
                      .add(1, 'd')
                      .format('MMM D')}
                  </div>
                </div>
              </div>
              {(this.state.monthly.totalIncome - this.state.monthly.totalExpenses > 0) &&
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
            <div>
              {this.state.expenses.map(expense => {
                const currDate = moment(expense.timestamp * 1000)
                const currDay = currDate.day()
                let divider
                if (!prevDay || prevDay !== currDay) {
                  divider = (
                    <Chip style={{ margin: '0 auto' }}>
                      {currDate.format('Y-M-D')}
                    </Chip>
                  )
                }
                prevDay = currDay
                return [
                  divider,
                  <ExpenseCard
                    key={expense.id}
                    {...expense}
                    categories={Object.keys(this.state.expenses.reduce(toCategory, {}))}
                    onEdit={this.handleEditExpense}
                    onDelete={this.handleDeleteExpense}
                  />
                ]
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
}

function MoneySum (props) {
  return (
    <div style={{ display: 'inline-block', flexGrow: 1 }}>
      <h3 style={{ marginTop: 5, marginBottom: 0, fontWeight: 'normal' }}>
        {props.title}
      </h3>
      <div style={{ marginBottom: 5, fontSize: 12, fontStyle: 'italic' }}>
        {props.subtitle}
      </div>
      <span style={{ color: colorMoney(props.value) }}>
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

export default ExpensesPage
