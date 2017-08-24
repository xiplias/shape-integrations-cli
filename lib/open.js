const opn = require('opn')
const core = require('shape-integrations-core')

module.exports = function(path, projectIdentifier, options) {
  const projectPath = path || 'projects'

  return core.getProject(projectPath, projectIdentifier, function(err, project) {
    if (err) return console.log('ERR: ', err)

    opn(
      `https://integrations.shape.dk/projects/${project.name}?key=${project.accessKey}`,
      { wait: false }
    )
  })
}
