const playground = require('./lib/playground')

playground({
  title: 'crop-tex-8',
  server: 'xy-server.local',
  optimize: false,
  useTurtle: false
}, ({ plotter, job, turtle }) => {
  const { normalize, radians } = require('missing-math')
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

  for (let i = -100; i < 100; i++) {
    const a = [aabb[0] + i, aabb[1]]
    const b = slope(a, 90 - Math.tan(normalize(i, -100, 100)) ** 2, 200)
    const lines = clip([[a[0], a[1]], [b[0], b[1]]], aabb)
    lines.forEach(line => job.line(...line[0], ...line[1]))
  }
})
