const path    = require('path');
const plotter = require('xy-plotter')();

const job = plotter.Job('sq2circle');

const maxRadius = plotter.height / 2;
const center = {x: plotter.width / 2, y: plotter.height / 2};

for (let radius = 1, i = 4; radius < maxRadius; radius += 0.1, i -= .00003) {
  let x = center.x + Math.cos(radius * i) * radius;
  let y = center.y + Math.sin(radius * i) * radius;

  let constrain = radius;
  x = Math.max(center.x - constrain, Math.min(x, center.x + constrain));
  y = Math.max(center.y - constrain, Math.min(y, center.y + constrain));
  job.move(x, y).pen_down();
}

console.log(plotter.Stats(job).getDuration().estimation.formatted);
// plotter.File().export(job, path.join(__dirname, 'preview.png'));
plotter.Server('xy-server.local').queue(job, () => console.log('queued'));