const path = require('path')
const plotter = require('xy-plotter')()
const isProduction = require('./is-production')

const defaultOpts = {
  title: 'playground',
  server: 'xy-server.local',
  filename: 'preview.png'
}

module.exports = (opts = {}, playground = function () {}) => {
  opts = Object.assign({}, defaultOpts, opts)

  const job = plotter.Job(opts.title)
  playground({ plotter, job })

  console.log(opts.title, '\n' + new Array(opts.title.length).fill('-').join(''))
  console.log('Estimated duration:', plotter.Stats(job).duration.estimation.formatted)

  plotter.File().export(job, path.join(__dirname, '..', opts.filename))
  if (isProduction) plotter.Server(opts.server).queue(job, () => console.log(`"${opts.title}" has been queued on <${opts.server}>`))
}
