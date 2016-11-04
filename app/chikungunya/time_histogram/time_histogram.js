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

function formatData(data, granularity) {

  var removeDuplicates = function(list){return Array.from(new Set(list))};
  var flat_array = function(array){
                    return array.reduce(function(a, b) {
                      return a.concat(b);
                    })
                  };

  var years = removeDuplicates(data.map(function(e){return e.ano;}));
  var months = flat_array([1,2,3,4,5,6,7,8,9,10,11,12].map(function(month){return years.map(function(year){return {'ano': year, 'mes': month};})}));
  var divisions = {'type': granularity == 'Yearly' ? 'ano' : 'mes',
                   'set':  granularity == 'Yearly' ? years : months};

  var result = [];

  var yearlyProcess = function(value){result.push({
                                        'entry': value,
                                        'freq': (data.filter(function(e){return e[divisions.type] == value;})).length
                                      })
                                    };

  var monthlyProcess = function(value){result.push({
                                        'entry': value.ano + ' ' + value.mes,
                                        'freq': (data.filter(function(e){return e.mes == value.mes && e.ano == value.ano;})).length
                                      })
                                    };

  divisions.set.forEach(
    granularity == 'Yearly' ? yearlyProcess : monthlyProcess
  );

  var sortMonth = function(a,b){

                                 if(parseInt(a.entry.split(' ')[0]) > parseInt(b.entry.split(' ')[0])) {
                                   return 1;
                                 }

                                 if(parseInt(a.entry.split(' ')[0]) < parseInt(b.entry.split(' ')[0])) {
                                   return -1;
                                 }

                                 if(parseInt(a.entry.split(' ')[1]) < parseInt(b.entry.split(' ')[1])){
                                   return -1;
                                 }

                                 return 1;
                               };

  var sortYear = function(a,b){return a.entry > b.entry ? 1 : -1};

  return result.sort(granularity == 'Yearly' ? sortYear : sortMonth);
}


function createHistogram(data, locator, granularity) {

  var xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

  var yScale = d3.scaleLinear()
            .range([height, 0]);

  var svg = createSvg(locator);

  data = formatData(data, granularity);
  xScale.domain(data.map(function(d) { return d.entry; }));
  yScale.domain([0, d3.max(data, function(d) { return d.freq; })]);

  svg.selectAll(".bar")
     .data(data)
     .enter().append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return xScale(d.entry); })
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
    createHistogram(data, locator, getCheckedRadioButton());
  });
}

function update(locator) {
  d3.selectAll("svg").remove();
  init(locator);
}
