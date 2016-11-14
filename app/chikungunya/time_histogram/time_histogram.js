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

function formatData(data, granularity, inital_date, final_date) {

  var removeDuplicates = function(list){return Array.from(new Set(list))};

  var flat_array = function(array) {
                    return array.reduce(function(a, b) {
                      return a.concat(b);
                    })
                  };

  var filter_by_date = function(data, inital_date, final_date) {
                    return data.filter(function(elem) {
                      var elem_date = moment(elem.mes + '/' + elem.dia + '/' + elem.ano);
                      return elem_date >= inital_date && elem_date <= final_date;
                    });
                  };

  var monthIntToStr = function(month) {
                      return {1:'Jan', 2:'Feb', 3:'Mar',
                              4:'Apr', 5:'May', 6:'Jun',
                              7:'Jul', 8:'Aug', 9:'Sept',
                              10:'Oct', 11:'Nov', 12:'Dec'}[month];
                    };

  var filtered_data = filter_by_date(data, inital_date, final_date);
  var years = removeDuplicates(filtered_data.map(function(e){return e.ano;}));

  var months = [];
  filtered_data.forEach(function(elem){
                          months.push({'ano': elem.ano, 'mes': elem.mes});
                      });

  var divisions = {'type': granularity == 'Yearly' ? 'ano' : 'mes',
                   'set':  granularity == 'Yearly' ? years : months};

  var result = [];

  var yearlyProcess = function(value){result.push({
                                        'entry': value,
                                        'freq': (filtered_data.filter(function(e){return e[divisions.type] == value;})).length
                                      })
                                    };

  var monthlyProcess = function(value){result.push({
                                        'entry': value.ano + ' ' + monthIntToStr(value.mes),
                                        'date': moment(value.mes + '/1/' + value.ano),
                                        'freq': (filtered_data.filter(function(e){return e.mes == value.mes && e.ano == value.ano;})).length
                                      })
                                    };

  divisions.set.forEach(
    granularity == 'Yearly' ? yearlyProcess : monthlyProcess
  );

  return result.sort(function(a,b){return a.date > b.date ? 1 : -1;});
}

function createHistogram(data, svg_locator) {
  var xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.1);

  var yScale = d3.scaleLinear()
            .range([height, 0]);

  var svg = createSvg(svg_locator);

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

function init(locator, inital_date, final_date) {
  var inital_date = moment(inital_date);
  var final_date = moment(final_date);
  d3.json("time_histogram_data.json", function(data) {
    var data = formatData(data, getCheckedRadioButton(), inital_date, final_date);
    createHistogram(data, locator);
  });
}

function deleteDiagram() {
  d3.selectAll("svg").remove();
}

function update(svg_locator, initial_id, final_id) {
  deleteDiagram();
  init(svg_locator, $( initial_id).val(), $(final_id).val());
}

function update_filter_by_date(svg_locator, initial_id, final_id) {
  deleteDiagram();
  init(svg_locator, $( initial_id).val(), $( final_id).val());
}
