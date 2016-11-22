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
                  "translate(" + margin.left + "," + margin.top + ")");
}

function formatData(data, granularity, inital_date, final_date) {

  var monthIntToStr = function(month) {
                      return {1:'Jan', 2:'Feb', 3:'Mar',
                              4:'Apr', 5:'May', 6:'Jun',
                              7:'Jul', 8:'Aug', 9:'Sept',
                              10:'Oct', 11:'Nov', 12:'Dec'}[month];
                    };

  var filter_by_date = function(data, inital_date, final_date) {
                    return data.filter(function(elem) {
                      var elem_date = moment(elem.mes + '/' + elem.dia + '/' + elem.ano);
                      return elem_date >= inital_date && elem_date <= final_date;
                    });
                  };

  var filtered_data = filter_by_date(data, inital_date, final_date);
  var entry_freq = {};
  var start = inital_date;

  while (start <= final_date) {
    if(granularity == 'Yearly') {
      entry_freq[start.year()] = 0;
    } else {
      entry_freq[(start.month() + 1) + ' ' + start.year()] = 0;
    }
    start.add(1, 'day');
  }

  filtered_data.forEach(function(elem){
    if('Yearly' == granularity){
      entry_freq[elem.ano] += 1;
    } else {
      entry_freq[elem.mes + ' ' + elem.ano] += 1;
    }
  });

  result = [];

  for (var entry in entry_freq) {
      if('Yearly' == granularity){
        var label = entry;
      } else {
        splitted_entry = entry.split(' ');
        var label = splitted_entry[1] + ' ' + monthIntToStr(splitted_entry[0]);
      }

      result.push({'entry': label, 'freq': entry_freq[entry]});
  }

  var i = result.length;
  while(i--)
  {
    if(result[i].freq > 0) break;
    result.splice(i,1);
  }

  return result;
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
