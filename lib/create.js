const path = require('path')
const fs = require('fs')

module.exports = function(projectname) {
  const testFolder = 'projects'
  const projectFolder = path.resolve(testFolder, projectname)
  const testsFolder = path.resolve(projectFolder, 'tests')

  // create projects folder
  fs.existsSync(testFolder) || fs.mkdirSync(testFolder)

  if (fs.existsSync(projectFolder)) return console.log('project already exists')

  // create projectname folder
  fs.mkdirSync(projectFolder)

  // create project.json file
  fs.writeFile(
    path.resolve(projectFolder, 'project.json'),
    `{
"name": "${projectname}",
"accessKey": "${projectname}_pass",
"base_url": ""
}`,
    function(err) {
      if (err) {
        return console.log(err)
      }
    }
  )

  // create test folder
  fs.mkdirSync(testsFolder)

  // create project.json file
  fs.writeFile(
    path.resolve(testsFolder, 'first_test.js'),
    `'use strict'

const request = require('superagent')
const Ajv = require('ajv')

module.exports = {
name: 'Test a endpoint',
description: 'Tests getting the users',
testFunction: function(context, callback) {
  request
    .get('https://jsonplaceholder.typicode.com/users')
    .end(function(err, res) {
      if (err) return callback(err)
      if (!res.ok) return callback(null, res)

      const validator = new Ajv()
      const schema = {
        properties: {
          statusCode: {
            type: 'integer',
            minimum: 200,
            maximum: 200
          },
          body: {
            type: 'array'
          }
        }
      }
      validator.validate(schema, res)
      callback(validator.errors, res.body)
    })
}
}`,
    function(err) {
      if (err) {
        return console.log(err)
      }

      console.log('project created at ' + projectFolder)
    }
  )
}
