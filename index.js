var mm      = require('missing-math');
var path    = require('path');
var plotter = require('xy-plotter')();

// -------------------------------------------------------------------------

function Agent(x, y, speed, scale) {
  var pos = {x: x, y: y};
  var vel = {x: 0, y: 0};
  var acc = {x: 0, y: 0};

  return {
    update: function() {
      var theta = mm.noise(pos.x / scale, pos.y / scale) * Math.PI;
      acc.x = Math.sin(theta);
      acc.y = Math.cos(theta);

      vel.x += acc.x * speed;
      vel.y += acc.y * speed * 2;

      pos.x += vel.x;
      pos.y += vel.y;

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

var margin = {x: 100, y: 50};
var size   = {x: plotter.width, y: plotter.height};

// spawning agents
var noiseScale = 40;
var speed      = 0.4;
var lineLength = 5;

var circle = {
  x: cx,
  y: cy * 0.5,
  r: 150
};

var agents = function() {
  var agents = [];
  for (var i = 0; i < 10000; i++) {
  agents[i] = new Agent(
                        mm.random(margin.x, size.x - margin.x),
                        mm.random(margin.y, size.y - margin.y),
                        speed,
                        noiseScale);
  }
  return agents;
}();

// creating lines
var lines = [];
for (var index = 0, l = agents.length; index < l; index++) {
  var line = [];
  for (var iteration = 0; iteration < lineLength; iteration++) {
    var agent = agents[index];
    var pos = agent.update();
    if (pos) {
      var radius = mm.random(circle.r * 0.9, circle.r * 1.1);
      if (iteration < lineLength * 0.6 || distSq(pos.x, pos.y, circle.x, circle.y) < radius * radius) line.push([pos.x, pos.y]);
      else break;
    }
    else break;
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

// sorting lines
console.log(lines[0][0]);
// console.log('sorting on the x axis...');
// bubbleSort(lines, function(line) { return line[0][0] });
// console.log(lines[0][0]);
console.log('sorting on the y axis...');
bubbleSort(lines, function(line) { return line[0][1] });
console.log(lines[0][0]);

function bubbleSort(a, fn) {
  var swapped;
  do {
    swapped = false;
    for (var i=0; i < a.length-1; i++) {
      if (fn(a[i]) > fn(a[i+1])) {
        var temp = a[i];
        a[i] = a[i+1];
        a[i+1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
}

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
// plotter.File().export(job, path.join(__dirname, 'preview.png'));
// plotter.Server('xy-server.local').queue(job, () => console.log('queued'));