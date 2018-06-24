const playground = require('./lib/playground')

playground({
  title: 'perlin-1',
  server: 'xy-server.local',
  optimize: true,
  useTurtle: false
}, ({ plotter, job, turtle }) => {
  const { noise, radians } = require('missing-math')

  const aabb = [
    plotter.width / 2 - 50,
    plotter.height / 2 - 50,
    plotter.width / 2 + 50,
    plotter.height / 2 + 50
  ]

  const slope = (from, deg, len) => [
    from[0] + Math.cos(radians(deg)) * len,
    from[1] + Math.sin(radians(deg)) * len
  ]

  const freq = [0.03, 0.25]
  const amp = 10
  const steps = [1, 1.5]

  let xoff = 0
  let yoff = 0

  for (let x = aabb[0]; x <= aabb[2]; x += steps[0]) {
    xoff += freq[0]
    yoff = 0
    for (let y = aabb[1]; y <= aabb[3]; y += steps[1]) {
      const n = noise(xoff, yoff)
      yoff += freq[1]

      const point = slope([x, y], n * 90, n * amp)
      job.move(...point)
      job.pen_down()
    }
    // NOTE: this may also be cool without lifting the pen
    job.pen_up()
  }
})
