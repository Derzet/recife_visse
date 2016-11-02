
function createHistogram(data, locator) {

}

function init(locator) {
  d3.json("time_histogram_data.json", function(data) {
    createHistogram(data, locator)
  });
}
