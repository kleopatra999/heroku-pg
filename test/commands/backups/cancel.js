'use strict'
/* global describe it beforeEach afterEach context */

const cli = require('heroku-cli-util')
const expect = require('unexpected')
const nock = require('nock')
const cmd = require('../../..').commands.find(c => c.topic === 'pg' && c.command === 'backups:cancel')

describe('pg:backups:cancel', () => {
  let pg

  beforeEach(() => {
    pg = nock('https://postgres-api.heroku.com')
    pg.post('/client/v11/apps/myapp/transfers/100-001/actions/cancel').reply(200, {})
    cli.mockConsole()
  })

  afterEach(() => {
    nock.cleanAll()
    pg.done()
  })

  context('with no id', () => {
    beforeEach(() => {
      pg.get('/client/v11/apps/myapp/transfers').reply(200, [
        {succeeded: true, to_type: 'gof3r', num: '3', uuid: '100-001'}
      ])
    })

    it('shows URL', () => {
      return cmd.run({app: 'myapp', args: {}})
      .then(() => expect(cli.stderr, 'to equal', 'Cancelling b003... done\n'))
    })
  })

  context('with id', () => {
    beforeEach(() => {
      pg.get('/client/v11/apps/myapp/transfers/3').reply(200, {
        succeeded: true, to_type: 'gof3r', num: '3', uuid: '100-001'
      })
    })

    it('shows URL', () => {
      return cmd.run({app: 'myapp', args: {backup_id: 'b003'}})
      .then(() => expect(cli.stderr, 'to equal', 'Cancelling b003... done\n'))
    })
  })
})