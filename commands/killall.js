'use strict'

const cli = require('heroku-cli-util')
const co = require('co')

function * run (context, heroku) {
  const fetcher = require('../lib/fetcher')(heroku)
  const host = require('../lib/host')

  yield cli.action('Terminating connections', co(function * () {
    const db = yield fetcher.addon(context.app, context.args.database)
    yield heroku.post(`/client/v11/databases/${db.name}/connection_reset`, {host: host(db)})
  }))
}

module.exports = {
  topic: 'pg',
  command: 'killall',
  description: 'terminates all connections',
  needsApp: true,
  needsAuth: true,
  args: [{name: 'database', optional: true}],
  run: cli.command({preauth: true}, co.wrap(run))
}
