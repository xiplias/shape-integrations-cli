#!/usr/bin/env node

const program = require('commander')
const core = require('shape-integrations-core')
const path = require('path')
const Table = require('easy-table')
const chalk = require('chalk')
const prettyjson = require('prettyjson')
const fs = require('fs')

program
  .version('0.0.1')
  .option('-p, --path <path>', 'path for projects (defaults to projects)')

program
  .command('create [projectname]')
  .description('create the structure for a new project')
  .action(function(projectname) {
    const testFolder = 'projects'
    const projectFolder = path.resolve(testFolder, projectname)
    const testsFolder = path.resolve(projectFolder, 'tests')

    // create projects folder
    fs.existsSync(testFolder) || fs.mkdirSync(testFolder)

    if (fs.existsSync(projectFolder))
      return console.log('project already exists')

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
  })

program
  .command('run [projectIdentifier] [testIdentifier]')
  .description('run setup commands for all envs')
  .action(function(projectIdentifier, testIdentifier, options) {
    const projectPath = program.path || 'projects'

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
          core.runTest(
            projectPath,
            projectIdentifier,
            test.identifier,
            function(err, result) {
              testResult(projectIdentifier, test.identifier, result)
            }
          )
        })
      })
    }
  })

program
  .command('list [project]')
  .description('run setup commands for all envs')
  .action(function(projectIdentifier, options) {
    const projectPath = program.path || 'projects'

    if (!projectIdentifier) {
      listProjects(projectPath)
    } else {
      showProject(projectPath, projectIdentifier)
    }
  })

const listProjects = function(path) {
  return core.getAllProjects(path, function(err, data) {
    console.log('\n')
    headline('Projects')
    var t = new Table()

    data.forEach(function(project) {
      t.cell('Identifier', project.identifier)
      t.cell('Name', project.name)
      t.cell('Base URL', project.base_url)
      t.newRow()
    })

    console.log(t.toString())
  })
}

const showProject = function(path, projectIdentifier) {
  return core.getProject(path, projectIdentifier, function(err, project) {
    console.log('\n')
    headline(project.name)

    var t = new Table()
    t.cell('Identifier', project.identifier)
    t.cell('Base URL', project.base_url)
    t.cell('Path', path)
    t.cell('Test username', project.test_username)
    t.cell('Test password', project.test_password)
    t.cell('Access key', project.accessKey)
    t.newRow()

    console.log(t.printTransposed(), '\n')

    core.getTestsForProject(path, projectIdentifier, function(err, data) {
      var t = new Table()

      data.forEach(function(project) {
        t.cell(`Tests (${data.length})`, project.identifier)
        t.cell('Name', project.name)
        t.cell('Description', project.description)
        t.newRow()
      })

      console.log(t.toString())
    })
  })
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

const headline = function(str) {
  console.log(chalk.blue(str))
  console.log(chalk.blue(Array(str.length + 1).join('-')), '\n')
}

program.parse(process.argv)
