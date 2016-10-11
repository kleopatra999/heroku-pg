'use strict'
/* global describe it beforeEach afterEach */

const cli = require('heroku-cli-util')
const expect = require('unexpected')
const nock = require('nock')
const proxyquire = require('proxyquire')

const db = {
  database: 'mydb',
  host: 'foo.com',
  user: 'jeff',
  password: 'pass',
  url: {href: 'postgres://foo'}
}

const addon = {
  name: 'postgres-1',
  plan: {name: 'heroku-postgresql:standard-0'}
}

const fetcher = () => {
  return {
    database: () => db,
    addon: () => addon
  }
}

const cmd = proxyquire('../../commands/credentials', {
  '../lib/fetcher': fetcher
})

describe('pg:credentials', () => {
  let api, pg

  beforeEach(() => {
    api = nock('https://api.heroku.com')
    pg = nock('https://postgres-api.heroku.com')
    cli.mockConsole()
  })

  afterEach(() => {
    nock.cleanAll()
    api.done()
  })

  it('runs query', () => {
    return cmd.run({app: 'myapp', args: {}, flags: {}})
    .then(() => expect(cli.stdout, 'to equal', `Connection info string:
   "dbname=mydb host=foo.com port=5432 user=jeff password=pass sslmode=require"
Connection URL:
   postgres://foo
`))
  })

  it('resets credentials', () => {
    pg.post('/client/v11/databases/postgres-1/credentials_rotation').reply(200)
    return cmd.run({app: 'myapp', args: {}, flags: {reset: true}})
    .then(() => expect(cli.stdout, 'to equal', ''))
    .then(() => expect(cli.stderr, 'to equal', 'Resetting credentials on postgres-1... done\n'))
  })
})
