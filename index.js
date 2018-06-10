const playground = require('./lib/playground')

playground({
  title: 'crop-tex-4',
  server: 'xy-server.local'
}, ({ plotter, job }) => {
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

  for (let i = -1; i < 99; i += 1.5) {
    const a = [aabb[0], aabb[1]]
    const b = slope(a, i, 500)
    for (let j = 0; j < 3; j += 2) {
      const lines = clip([[a[0] + j, a[1]], [b[0] - j, b[1]]], aabb)
      lines.forEach(line => job.line(...line[0], ...line[1]))
    }
  }
})
