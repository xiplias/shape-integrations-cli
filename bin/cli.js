#!/usr/bin/env node

const program = require('commander')

const create = require('../lib/create')
const run = require('../lib/run')
const list = require('../lib/list')

program
  .version('0.0.1')
  .option('-p, --path <path>', 'path for projects (defaults to projects)')

program
  .command('create [projectname]')
  .description('create the structure for a new project')
  .action(function(projectname) {
    create(program.path, projectname)
  })

program
  .command('run [projectIdentifier] [testIdentifier]')
  .description('run setup commands for all envs')
  .action(function(projectIdentifier, testIdentifier) {
    run(program.path, projectIdentifier, testIdentifier)
  })

program
  .command('list [project]')
  .description('run setup commands for all envs')
  .action(function(project) {
    list(program.path, project)
  })

program.parse(process.argv)
