const playground = require('./lib/playground')

playground({
  title: 'crop-tex-6',
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

  for (let i = -100; i < 200; i += 1) {
    const a = [aabb[0] + i, aabb[1]]
    for (let j = 0; j < 2; j += 1) {
      const b = slope(a, 45 + j, 138 + Math.cos(radians(i * 10)))
      const lines = clip([[a[0], a[1]], [b[0], b[1]]], aabb)
      lines.forEach(line => job.line(...line[0], ...line[1]))
    }
  }
})
