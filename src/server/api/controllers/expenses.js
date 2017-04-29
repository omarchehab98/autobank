/**
 * Generates a controller for a REST API endpoint.
 * @param {Object} expenses
 * @param {Function} expenseModel
 */
function getController (expenses, expenseModel) {
  /**
   * Returns all expenses that happened during a time range.
   *
   * ## Parameters
   *
   * | Name | Datatype | Description |
   * |------|----------|-------------|
   * | start | number | Start time in unix timestamp seconds. |
   * | end | number | End time in unix timestamp seconds. |
   */
  return function (req, res) {
    // Validation
    const start = parseInt(req.query.start, 10)
    if (isNaN(start)) {
      res.status(400)
      res.json({
        code: 'REQUIRE_START'
      })
      return
    }
    const end = parseInt(req.query.end)
    if (isNaN(end)) {
      res.status(400)
      res.json({
        code: 'REQUIRE_END'
      })
      return
    }
    // Response
    expenses.getExpenses(start, end)
      .then(result => res.json(result.map(expenseModel)))
      .catch(result => {
        res.status(500)
        res.json({
          code: 'INTERNAL_ERROR'
        })
        console.error(result)
      })
  }
}

/**
 * Generates a controller for a REST API endpoint.
 * @param {Object} expenses
 * @param {Function} expenseModel
 */
function removeController (expenses, expenseModel) {
  /**
   * Deletes a certain expense entry identified by `id`.
   */
  return function (req, res) {
    const id = req.params.id
    // Response
    expenses.removeExpense(id)
      .then(result => res.json({}))
      .catch(result => {
        res.status(500)
        res.json({
          code: 'INTERNAL_ERROR'
        })
        console.error(result)
      })
  }
}

/**
 * Generates a controller for a REST API endpoint.
 * @param {Object} expenses
 * @param {Function} expenseModel
 */
function editController (expenses, expenseModel) {
  /**
   * Edits fields of a certain expense by `id`.
   */
  return function (req, res) {
    // Validation
    const id = req.params.id
    if (!id) {
      res.status(400)
      res.json({
        code: 'REQUIRE_ID'
      })
      return
    }
    const description = req.body.description
    if (description === undefined) {
      res.status(400)
      res.json({
        code: 'REQUIRE_DESCRIPTION'
      })
      return
    }
    const timestamp = parseInt(req.body.timestamp, 10)
    if (isNaN(timestamp)) {
      res.status(400)
      res.json({
        code: 'REQUIRE_TIMESTAMP'
      })
      return
    }
    if (timestamp < 0 || timestamp > Date.now()) {
      res.status(400)
      res.json({
        code: 'INVALID_TIMESTAMP'
      })
      return
    }
    const category = req.body.category
    if (category === undefined) {
      res.status(400)
      res.json({
        code: 'REQUIRE_CATEGORY'
      })
      return
    }
    // Response
    expenses.editExpense(id, {
      description,
      timestamp,
      category
    })
      .then(result => res.json({}))
      .catch(result => {
        res.status(500)
        res.json({
          code: 'INTERNAL_ERROR'
        })
        console.error(result)
      })
  }
}

module.exports = {
  getController,
  removeController,
  editController
}
