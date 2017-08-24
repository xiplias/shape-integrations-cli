const core = require('shape-integrations-core')
const chalk = require('chalk')
const prettyjson = require('prettyjson')
const formatting = require('../utils/formatting')

module.exports = function(
  path,
  projectIdentifier,
  testIdentifier,
  debug = false
) {
  const projectPath = path || 'projects'

  if (testIdentifier) {
    core.runTest(projectPath, projectIdentifier, testIdentifier, function(
      err,
      result
    ) {
      testResult(projectIdentifier, testIdentifier, err, result)
    })
  } else {
    core.getTestsForProject(projectPath, projectIdentifier, function(
      err,
      data
    ) {
      if (err) return error(projectIdentifier, null, err)
      data.forEach(function(test) {
        core.runTest(projectPath, projectIdentifier, test.identifier, function(
          err,
          result
        ) {
          testResult(projectIdentifier, test.identifier, err, result)
        })
      })
    })
  }
}

const ok = function(projectIdentifier, testIdentifier) {
  console.log('\n')
  console.log(chalk.green(`OK - ${projectIdentifier}/${testIdentifier}`))
}

const error = function(projectIdentifier, testIdentifier, err) {
  console.log('\n')
  console.log(chalk.red(`ERROR - ${projectIdentifier}/${testIdentifier || ''}`))
  console.log(
    prettyjson.render(err, {
      keysColor: 'red',
      dashColor: 'red',
      stringColor: 'red'
    })
  )
}

const testResult = function(projectIdentifier, testIdentifier, err, result) {
  if (result.err) {
    error(projectIdentifier, testIdentifier, result.err)
    if (result && result.requests) formatting.httpOutput(result.requests)
  } else {
    ok(projectIdentifier, testIdentifier)
  }

  console.log('\n\n')
}
