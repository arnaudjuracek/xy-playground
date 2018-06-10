const playground = require('./lib/playground')

playground({
  title: 'crop-tex-5',
  server: 'xy-server.local',
  optimize: false,
  useTurtle: false
}, ({ plotter, job, turtle }) => {
  const { radians } = require('missing-math')
  const clip = require('lineclip')

  const slope = (from, deg, len) => [
    from[0] + Math.cos(radians(deg)) * len,
    from[1] + Math.sin(radians(deg)) * len
  ]

  const aabb = [
    plotter.width / 2 - 50,
    plotter.height / 2 - 50,
    plotter.width / 2 + 50,
    plotter.height / 2 + 50
  ]

  for (let i = -1; i < 99; i += 1) {
    const a = [aabb[3] - i, aabb[1]]
    const b = slope(a, i, 500)
    for (let j = 0; j < 4; j += 1) {
      const lines = clip([[a[0] + j, a[1]], [b[0] - j, b[1]]], aabb)
      lines.forEach(line => job.line(...line[0], ...line[1]))
    }
  }
})
