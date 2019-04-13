/**
 * File: spray-chart-pie.js
 * Desc: MLB Spray Chart as D3 Semi-Circle Pie
 */

const d3 = require('d3');

// 1- set some data
const leftyPullHitterData = [
  { field: 'left', percent: 9 },
  { field: 'left-center', percent: 15 },
  { field: 'center', percent: 27 },
  { field: 'right-center', percent: 37 },
  { field: 'right', percent: 13 }
];
const pieData = [
  { label: 'CDU', value: 1 },
  { label: 'SPD', value: 1 },
  { label: 'Die Grünen', value: 1 },
  { label: 'Die Mitte', value: 1 },
  { label: 'Frei Wähler', value: 1 }
];

// 2- set svg dimensions
const width = 835; // 368
const height = 485; // 364
const radius = Math.min(width, height) / 2;
const innerRadius = 30;

// 3- set the colors -- these need to mirror the data (and be the same length)

const colors = d3.scaleOrdinal().range([
  'rgba(255, 255, 178, 0.6)', // 1
  'rgba(253, 141, 60, 0.6)', // 3
  'rgba(240, 59, 32, 0.6)', // 4
  'rgba(189, 0, 38, 0.6)', // 5
  'rgba(254, 204, 92, 0.6)' // 2
]);

// 4- arc generator set up: create <path> elements for using arc data
const arc = d3
  .arc()
  .innerRadius(innerRadius)
  .outerRadius(radius);

// 5- pie layout set up (an array of arcs)
const pie = d3
  .pie()
  .startAngle(-90 * (Math.PI / 180))
  .endAngle(90 * (Math.PI / 180))
  .padAngle(0.02) // space between slices
  .sort(null) // No order by size
  .value(d => d.percent); // access the value of each element in the data

// #- render the SVG (// todo: move this to a render())
function renderPieChart() {
  const vis = d3
    .select('#spray-chart-mount-point')
    .append('svg')
    .data([leftyPullHitterData])
    // .data([pieData])
    .attr('width', width)
    .attr('height', height)
    .append('g')
    // moves the whole svg:g as a unit (// todo: center on home plate)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  // const diamond = vis
  //   .append('image')
  //   .attr('xlink:href', 'assets/diamond-bground.png')
  //   .attr('preserveAspectRatio', 'none')
  //   //.attr('width', '100%')
  //   //.attr('height', '100%');
  //   .attr('x', 10)
  //   .attr('y', 10)
  //   .attr('width', 100)
  //   .attr('height', 100);
  //   <image
  //   xlink:href="assets/diamond-bground.png"
  //   preserveAspectRatio="none"
  //   width="100%"
  //   height="100%"
  // />

  // 7- create <g> for each slice
  const arcs = vis
    .selectAll('g.slice') // was g.slice future select all <g> elements w/class slice
    .data(pie)
    .enter()
    .append('g')
    .attr('class', 'slice');

  // 8- give your arcs a <path>
  arcs
    .append('path')
    .attr('fill', (d, i) => colors(i)) // set color for each slice
    .attr('d', arc); // recall the key 'd' attr of path contains the drawing data

  // 9- give your arcs <text> labels
  arcs
    .append('text')
    .attr('fill', '#666')
    .attr('transform', d => {
      // set label origin to arc center (do before calling .centroid())
      d.innerRadius = 0;
      d.outerRadius = radius;
      return 'translate(' + arc.centroid(d) + ')'; // returns coord pair (ex: [50, 50])
    })
    .attr('text-anchor', 'middle')
    .attr('dy', 5)
    // render the text
    .text((d, i) => ` ${leftyPullHitterData[i].percent}%`);
}

// call render
renderPieChart();
