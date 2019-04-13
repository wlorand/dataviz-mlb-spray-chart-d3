/**
 * File: semi-pie example (type up from: https://jsfiddle.net/Saninn/15pwLf7u/)
 * Desc: Do example de D3 semi-circle pie to model your MLB spray chart after
 */

// Problem: this code uses D3 v3
// First Cut: downgrade your npm import to D3 v3

// 0 - import d3 -- know to do import you'll need to do browserify
const d3 = require('d3');

// 1- set some data
const pieData = [
  { label: 'CDU', value: 1 },
  { label: 'SPD', value: 1 },
  { label: 'Die Grünen', value: 1 },
  { label: 'Die Mitte', value: 1 },
  { label: 'Frei Wähler', value: 1 }
];

const leftyPullHitterData = [
  { field: 'left', percent: 9 },
  { field: 'left-center', percent: 15 },
  { field: 'center', percent: 27 },
  { field: 'right-center', percent: 37 },
  { field: 'right', percent: 13 }
];

// 2- set some svg dimensions -- likely no need for margin pattern for axis here
const width = 368;
const height = 364;
const radius = Math.min(width, height) / 2;
const innerRadius = 30;

// 3- set the colors -- these need to mirror the data (and be the same length)\
// temp: hard-coded order so it lines up with data quantity
// todo: move to quanity-based switch ala ygeo leaflet choropleth
const colors = d3.scaleOrdinal().range([
  'rgba(29, 29, 27, 0.6)', // 1
  'rgba(58, 170, 53, 0.6)', // 3
  'rgba(14, 113, 184, 0.6)', // 4
  'rgba(243, 146, 0, 0.6)', // 5
  'rgba(190, 21, 34, 0.6)' // 2
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
  .value(d => d.value); // access the value of each element in the data

// #- render the SVG (// todo: move this to a render())
function renderPieChart() {
  const vis = d3
    .select('#semi-pie-example')
    .append('svg')
    .data([pieData])
    .attr('width', width)
    .attr('height', height)
    .append('g')
    // moves the whole svg:g as a unit (// todo: center on home plate)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  // 7- create <g> for each slice
  const arcs = vis
    .selectAll('g.slice') // future select all <g> elements w/class slice
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
    .attr('fill', '#fff')
    .attr('transform', d => {
      // set label origin to arc center (do before calling .centroid())
      d.innerRadius = 0;
      d.outerRadius = radius;
      return 'translate(' + arc.centroid(d) + ')'; // returns coord pair (ex: [50, 50])
    })
    .attr('text-anchor', 'middle')
    // render the text
    .text((d, i) => pieData[i].value);
}

// call render
renderPieChart();
