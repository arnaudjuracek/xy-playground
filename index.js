const path  = require('path')
const plotter = require('xy-plotter')()

const { radians } = require('missing-math')
const clip = require('lineclip')
const job = plotter.Job('crop-tex-2')


const slope = (from, deg, len) => [
  from[0] + Math.cos(radians(deg)) * len,
  from[1] + Math.sin(radians(deg)) * len,
]

const aabb = [
  plotter.width / 2 - 50,
  plotter.height / 2 - 50,
  plotter.width / 2 + 50,
  plotter.height / 2 + 50
]

for (let i = -100; i < 200; i++) {
  const a = [aabb[0] + i, aabb[1]]
  const b = slope(a, i, 200)
  const lines = clip([a, b], aabb)
  lines.forEach(line => job.line(...line[0], ...line[1]))
}

console.log(plotter.Stats(job).duration.estimation.formatted)
plotter.File().export(job, path.join(__dirname, 'preview.png'))
// plotter.Server('xy-server.local').queue(job, () => console.log('queued'))
