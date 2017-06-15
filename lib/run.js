const core = require('shape-integrations-core')
const chalk = require('chalk')
const prettyjson = require('prettyjson')

module.exports = function(path, projectIdentifier, testIdentifier) {
  const projectPath = path || 'projects'

  if (testIdentifier) {
    core.runTest(projectPath, projectIdentifier, testIdentifier, function(
      err,
      result
    ) {
      testResult(projectIdentifier, testIdentifier, result)
    })
  } else {
    core.getTestsForProject(projectPath, projectIdentifier, function(
      err,
      data
    ) {
      data.forEach(function(test) {
        core.runTest(projectPath, projectIdentifier, test.identifier, function(
          err,
          result
        ) {
          testResult(projectIdentifier, test.identifier, result)
        })
      })
    })
  }
}

const testResult = function(projectIdentifier, testIdentifier, result) {
  if (result.ok || result.res) {
    console.log('\n')
    console.log(chalk.green(`OK - ${projectIdentifier}/${testIdentifier}`))
    console.log('\n')
  } else {
    console.log('\n')
    console.log(chalk.red(`ERROR - ${projectIdentifier}/${testIdentifier}`))
    console.log(
      prettyjson.render(result.err, {
        keysColor: 'red',
        dashColor: 'red',
        stringColor: 'red'
      })
    )
  }
}
