var mm      = require('missing-math');
var path    = require('path');
var plotter = require('xy-plotter')();

// -------------------------------------------------------------------------

function Agent(x, y, i) {
  var pos = {x: x, y: y, offset: 0};
  var acc = {x: 0, y: 0};

  return {
    update: function(scale, speed) {
      var theta = mm.noise(pos.x / scale, pos.y / scale) * Math.PI * 2;
      acc.x = Math.sin(theta + Math.PI / 2);
      acc.y = Math.cos(theta + Math.PI / 2);

      pos.x += acc.x * speed;
      pos.y += acc.y * speed;

      if (pos.x > 0 && pos.x < plotter.width && pos.y > 0 && pos.y < plotter.height) return pos;
      else return null;
    },
  }
}

function distSq(x1, y1, x2, y2) { return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2); }

// -------------------------------------------------------------------------

var job = plotter.Job('flowfield');

var cx = plotter.width / 2;
var cy = plotter.height / 2;

var margin = {x: 50, y: 50};
var size   = {x: plotter.width, y: plotter.height};

// spawning agents
var noiseScale = {min: 200, max: 75};
var speed      = {min: 10, max: 2};

var agents = function() {
  var agents = [];
  for (var i = 0; i < 1000; i++) {
  agents[i] = new Agent(
                        mm.random(margin.x, size.x - margin.x),
                        mm.random(margin.y, size.y - margin.y),
                        i);
  }
  return agents;
}();

// creating lines
var lines = [];
for (var index = 0, l = agents.length; index < l; index++) {
  var line = [];
  var agent = agents[index];
  var running = true;
  var px = 0;
  var iter = 0;
  while (running && iter++ < 10000) {
    var t = mm.norm(px, 0, plotter.width);
    var scale = mm.lerp(noiseScale.min, noiseScale.max, t);
    var spd = mm.lerp(speed.min, speed.max, t);

    var pos = agent.update(scale, spd);

    var rnd = mm.random(-10, 10);
    if (pos && pos.x >= margin.x && pos.x < size.x - margin.x + rnd && pos.y > margin.y + rnd && pos.y < size.y - margin.y + rnd) {
      line.push([pos.x + pos.offset, pos.y]);
      px = pos.x;
    } else running = false;
  }
  lines.push(line);
}

// cleaning lines
console.log('lines.length', lines.length);
console.log('cleaning...');
for (var i = lines.length - 1; i > 0; i--) {
  var line = lines[i];
  var dist = 0;
  var pp = null;
  for (var j = 0, ll = line.length; j < ll; j++) {
    var p = lines[i][j];
    if (pp !== null) dist += distSq(pp[0], pp[0], p[1], p[1]);
    else pp = p;
  }

  if (dist < 100) lines.splice(i, 1);
}
console.log('lines.length', lines.length);

// finally drawing
for (var i = 0, l = lines.length; i < l; i++) {
  job.pen_up();
  var line = lines[i];
  for (var j = 0, ll = line.length; j < ll; j++) {
    var p = lines[i][j];
    job.move(p[0], p[1]).pen_down();
  }
}

// -------------------------------------------------------------------------

console.log(plotter.Stats(job).getDuration().estimation.formatted);
plotter.File().export(job, path.join(__dirname, 'preview.png'));
plotter.Server('xy-server.local').queue(job, () => console.log('queued'));