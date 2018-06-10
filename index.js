const path  = require('path')
const plotter = require('xy-plotter')()

const { min, max, radians } = require('missing-math')
const clip = require('lineclip')

const server = plotter.Server('xy-server.local')
const file = plotter.File()

const filename = path.join(__dirname, 'preview.png')
const job = plotter.Job('crop-tex-1')


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

// job.rect(aabb[0], aabb[1], aabb[2] - aabb[0], aabb[3] - aabb[1])

for (let i = -100; i < 200; i++) {
  const a = [aabb[0] + i, aabb[1]]
  const b = slope(a, 89, 200)
  const lines = clip([a, b], aabb)
  lines.forEach(line => job.line(...line[0], ...line[1]))
}

console.log(plotter.Stats(job).duration.estimation.formatted)

file.export(job, filename)
server.queue(job, () => console.log('queued'))
