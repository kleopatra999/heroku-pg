'use strict'

const cli = require('heroku-cli-util')

exports.configVarNamesFromValue = (config, value) => {
  const sortBy = require('lodash.sortby')

  let keys = []
  for (let key of Object.keys(config)) {
    if (config[key] === value) keys.push(key)
  }
  return sortBy(keys, k => k !== 'DATABASE_URL', 'name')
}

exports.databaseNameFromUrl = (uri, config) => {
  const url = require('url')

  let names = exports.configVarNamesFromValue(config, uri)
  let name = names.pop()
  while (name === 'DATABASE_URL') name = names.pop()
  if (name) return cli.color.configVar(name.replace(/_URL$/, ''))
  uri = url.parse(uri)
  return `${uri.hostname}:${uri.port || 5432}${uri.path}`
}
