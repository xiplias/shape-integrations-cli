const prettyjson = require('prettyjson')
const chalk = require('chalk')

exports.httpOutput = function(requests) {
  console.log('\n')
  exports.headline('HTTP Request logged')
  console.log(
    prettyjson.render(requests, {
      keysColor: 'red',
      dashColor: 'red',
      stringColor: 'red'
    })
  )
}

exports.headline = function(str) {
  console.log(chalk.blue(str))
  console.log(chalk.blue(Array(str.length + 1).join('-')), '\n')
}
