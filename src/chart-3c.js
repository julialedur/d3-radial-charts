import * as d3 from 'd3'

var margin = { top: 30, left: 70, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 60

let radiusScale = d3
  .scaleLinear()
  .domain([0, 70])
  .range([0, radius])

let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

let cities = ['NYC', 'Tuscon', 'Lima', 'Beijing', 'Melbourne', 'Stockholm']

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

let arc = d3
  .arc()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

var xPositionScale = d3.scaleBand().range([0, width])

var colorScale = d3
  .scaleLinear()
  .domain([16, 100])
  .range(['#B6D5E3', '#FDC0CC'])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  xPositionScale.domain(cities)

  let nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  let holder = svg.append('g')

  holder
    .selectAll('.graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      console.log(d)
      var g = d3.select(this)
      g.selectAll('.temp-bar')
        .data(d.values)
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', function(d) {
          return colorScale(d.high_temp)
        })
        .attr('stroke', 'white')
        .attr('stroke-width', 0.2)

      g.append('circle')
        .attr('r', 3)
        .attr('fill', 'black')
        .attr('cx', 0)
        .attr('cy', 0)

      g.append('text')
        .text(d => d.key)
        .attr('x', xPositionScale(d.cities))
        .attr('y', height / 3)
        .attr('font-size', 15)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
    })
}
