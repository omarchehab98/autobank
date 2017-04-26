/**
 * Generates a controller for a REST API endpoint.
 * @param {Object} expenses
 * @param {Function} incomeModel
 */
function incomeController (expenses, incomeModel) {
  /**
   * Returns all income that happened during a time range.
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
    expenses.getIncome(start, end)
      .then(result => res.json(result.map(incomeModel)))
      .catch(result => {
        res.status(500)
        res.json({
          code: 'INTERNAL_ERROR'
        })
        console.error(result)
      })
  }
}

module.exports = incomeController
