import * as d3 from 'd3'

var margin = { top: 30, left: 90, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 70

let radiusScale = d3
  .scaleLinear()
  .domain([0, 84])
  .range([30, radius])

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

let cities = ['NYC', 'Tuscon', 'Lima', 'Beijing', 'Stockholm', 'Melbourne']

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var xPositionScale = d3.scaleBand().range([0, width])

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .angle(d => angleScale(d.month_name))

let bands = [20, 40, 60, 80, 100]
let labels = [20, 60, 100]

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  xPositionScale.domain(cities)

  let nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  var holder = svg.append('g')

  holder
    .selectAll('.graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      var datapoints = d.values
      datapoints.push(datapoints[0])
      console.log(d)
      var g = d3.select(this)
      g.append('path')
        .datum(datapoints)
        .attr('d', d => line(d))
        .attr('fill', 'lightblue')
        .attr('opacity', 0.8)
        .attr('stroke', 'none')

      g.selectAll('.scale-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', 'none')
        .attr('stroke', 'lightgrey')
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      g.selectAll('.temp-label')
        .data(labels)
        .enter()
        .append('text')
        .text(d => d + '°')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -1)
        .attr('font-size', 11)

      // g.append('text')
      //   .text('NYC')
      //   .attr('text-anchor', 'middle')
      //   .attr('x', 0)
      //   .attr('y', 0)
      //   .attr('font-weight', 'bold')
      //   .attr('font-size', 23)
    })
}
