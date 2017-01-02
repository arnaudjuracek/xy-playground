var mm      = require('missing-math');
var path    = require('path');
var plotter = require('xy-plotter')();

// -------------------------------------------------------------------------

var job = plotter.Job('lissajous');

var cx = plotter.width / 2;
var cy = plotter.height / 2;

var radius = 100;
var resolution = 10000;

var freqX = 65.41 //mm.random(0, 100);
var freqY = 64.95 //mm.random(0, 100);
var phi   = 46.95 //mm.random(0, 360);

console.log(freqX.toFixed(2), freqY.toFixed(2), phi.toFixed(2));

for (var i = 0; i <= resolution ; i++) {
  var theta = mm.map(i, 0, resolution, 0, Math.PI * 2);
  var x = cx + Math.sin(theta * freqX + mm.radians(phi)) * radius;
  var y = cy + Math.sin(theta * freqY) * radius;

  job.move(x, y).pen_down();
}


// -------------------------------------------------------------------------

console.log(plotter.Stats(job).getDuration().estimation.formatted);
plotter.File().export(job, path.join(__dirname, 'preview.png'));
plotter.Server('xy-server.local').queue(job, () => console.log('queued'));