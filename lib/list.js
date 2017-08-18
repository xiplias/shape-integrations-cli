const core = require('shape-integrations-core')
const Table = require('easy-table')
const chalk = require('chalk')
const formatting = require('../utils/formatting')

module.exports = function(path, projectIdentifier, options) {
  const projectPath = path || 'projects'

  if (!projectIdentifier) {
    listProjects(projectPath)
  } else {
    showProject(projectPath, projectIdentifier)
  }
}

const listProjects = function(path) {
  return core.getAllProjects(path, function(err, data) {
    if (err) return console.log('ERR: ', err)
    
    console.log('\n')
    formatting.headline('Projects')
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
    if (err) return console.log('ERR: ', err)

    console.log('\n')
    formatting.headline(project.name)

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
