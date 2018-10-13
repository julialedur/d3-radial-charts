import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// At the very least you'll need scales, and
// you'll need to read in the file. And you'll need
// and svg, too, probably.

// Scales

var pie = d3.pie().value(function(d) {
  return d.minutes
})

var radius = 80

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var colorScale = d3.scaleOrdinal().range(['#fad3cf', '#a696c8', '#b1cbfa', '#757882'])

var xPositionScale = d3.scalePoint().range([0, width])

var tasks = ['Typing code', 'Rewriting code', 'Reading StackOverflow']

var angleScale = d3
  .scaleBand()
  .domain(tasks)
  .range([0, Math.PI * 2])

// Read in the data

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  var projects = datapoints.map(d => d.project)
  console.log(projects)

  xPositionScale.domain(projects).padding(0.4)

  let nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)

  var container = svg.append('g').attr('transform', 'translate(200,200)')

  svg
    .selectAll('.graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      console.log(d)
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      console.log(d)
      var container = d3.select(this)
      var datapoints = d.values
      console.log('g data looks like', datapoints)

      container
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', function(d) {
          return arc(d)
        })
        .style('fill', d => colorScale(d.data.task))

      container
        .append('text')
        .text(d => d.key)
        .attr('x', xPositionScale(d.projects))
        .attr('y', height / 3)
        .attr('font-size', 15)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
    })
}
