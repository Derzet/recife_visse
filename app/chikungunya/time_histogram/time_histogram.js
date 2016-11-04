var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

function createSvg(locator) {
  return d3.select(locator)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")")
}

function formatData(data) {
  filteredData = data.filter(function(e) { return e.ano == '2015';});

  var result = [];
  [1,2,3,4,5,6,7,8,9,10,11,12].forEach(
    function(mes){
      result.push({
        'mes': mes,
        'freq': (filteredData.filter(function(e){return e.mes == mes;})).length
      })
    }
  );

  return result;
}


function createHistogram(data, locator) {

  var xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

  var yScale = d3.scaleLinear()
            .range([height, 0]);

  var svg = createSvg(locator);

  data = formatData(data);
  xScale.domain(data.map(function(d) { return d.mes; }));
  yScale.domain([0, d3.max(data, function(d) { return d.freq; })]);

  svg.selectAll(".bar")
     .data(data)
     .enter().append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return xScale(d.mes); })
     .attr("width", xScale.bandwidth())
     .attr("y", function(d) { return yScale(d.freq); })
     .attr("height", function(d) { return height - yScale(d.freq); });

  svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(xScale));

  svg.append("g")
     .call(d3.axisLeft(yScale));
}

function init(locator) {
  d3.json("time_histogram_data.json", function(data) {
    createHistogram(data, locator);
  });
}
