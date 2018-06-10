const TITLE = 'crop-tex-3'

const path  = require('path')
const plotter = require('xy-plotter')()

const { random, radians } = require('missing-math')
const clip = require('lineclip')

const job = plotter.Job(TITLE)

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

for (let i = -1; i < 99; i += 1.5) {
  const a = [aabb[0] + i, aabb[1]]
  const b = slope(a, 90 - i, 500)

  for (let j = 0; j < 5; j += 1.5) {
    const lines = clip([[a[0] + j, a[1]], [b[0] - j, b[1]]], aabb)
    lines.forEach(line => job.line(...line[0], ...line[1]))
  }
}

console.log('Estimated duration:', plotter.Stats(job).duration.estimation.formatted)

plotter.File().export(job, path.join(__dirname, 'preview.png'))
// plotter.Server('xy-server.local').queue(job, () => console.log('queued'))
