'use strict'

const util = require('./util')

module.exports = function (addon) {
  let host = process.env.HEROKU_POSTGRESQL_HOST

  if (addon && util.starterPlan(addon)) {
    if (host) return `https://${host}`
    return 'https://postgres-starter-api.heroku.com'
  } else {
    if (host) return `https://${host}`
    return 'https://postgres-api.heroku.com'
  }
}
