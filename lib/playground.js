const path = require('path')
const xy = require('xy-plotter')
const isProduction = require('./is-production')

const defaultOpts = {
  title: 'playground',
  server: 'xy-server.local',
  filename: 'preview.png',
  useTurtle: false,
  optimize: undefined, // SEE: https://github.com/xy-plotter/xy/wiki/API-reference#joboptimizeoptions
  plotter: undefined // SEE: https://github.com/xy-plotter/xy/wiki/API-reference#var-plotter--requirexy-plotteropts
}

module.exports = (opts = {}, playground = function () {}) => {
  opts = Object.assign({}, defaultOpts, opts)

  const plotter = xy(opts.plotter)
  const job = plotter[opts.useTurtle ? 'Turtle' : 'Job'](opts.title)

  playground({
    plotter,
    [opts.useTurtle ? 'turtle' : 'job']: job
  })

  if (opts.optimize) job.optimize(opts.optimize)

  const hr = new Array(opts.title.length).fill('-').join('')
  const { duration, distance } = plotter.Stats(job)

  console.log(opts.title)
  console.log(hr)
  console.log('Estimated duration:', duration.estimation.formatted)
  console.log('Estimated distance:', (distance / 10).toFixed(2), 'cm')
  console.log(hr)

  plotter.File().export(job, path.join(__dirname, '..', opts.filename))
  if (isProduction) plotter.Server(opts.server).queue(job, () => console.log(`"${opts.title}" has been queued on <${opts.server}>`))
}
