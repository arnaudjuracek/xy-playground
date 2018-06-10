const mm  = require('missing-math')
const path  = require('path')
const plotter = require('xy-plotter')()

const server = plotter.Server('xy-server.local')
const file = plotter.File()

const filename = path.join(__dirname, 'preview.png')
const job = plotter.Job('crop-tex-1')



console.log(plotter.Stats(job).duration.estimation.formatted)

file.export(job, filename)
server.queue(job, () => console.log('queued'))
