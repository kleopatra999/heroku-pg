'use strict'

module.exports = function (addon) {
  let host = process.env.HEROKU_POSTGRESQL_HOST

  if (addon && (addon.plan.name.endsWith('dev') || addon.plan.name.endsWith('basic'))) {
    if (host) return `https://${host}`
    return 'https://postgres-starter-api.heroku.com'
  } else {
    if (host) return `https://${host}`
    return 'https://postgres-api.heroku.com'
  }
}
