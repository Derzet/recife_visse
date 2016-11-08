 
 var map = L.map('map').setView([-8.05596, -34.87986], 12);

L.tileLayer(
'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  
}).addTo(map);




var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
	
    this._div.innerHTML = '<h4>Casos Chikungunya</h4>' +  (props ?
        '<b>' + props.bairro_codigo + '</b><br />' + props.bairro_nome_ca 
        : 'Passe por um bairro');
};

info.addTo(map);


function getColor(d) {
	
    return d> 180 ? '#800026' :
           d> 150  ? '#BD0026' :
           d> 130  ? '#E31A1C' :
           d> 100  ? '#FC4E2A' :
           d> 50   ? '#FD8D3C' :
           d> 20   ?'#FEB24C' :
           d> 10   ?  '#FED976' :
                      '#FFEDA0';

}




/*		
	dataCountBairro = provData.reduce( function (prev, item) { 
  if ( item in prev ) prev[item] ++; 
  else prev[item] = 1; 
  return prev; 
}, {} );
*/

 		
			
//L.geoJson(stateData).addTo(map);


function style(feature) {
   // console.log(feature.properties.bairro_nome_ca);

	
	return {

	
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
		fillColor:getColor(result[feature.properties.bairro_nome_ca])
    };
}




					

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
	
	info.update(layer.feature.properties);
	
}




var geojson;



function resetHighlight(e) {
    geojson.resetStyle(e.target);
	info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

geojson = L.geoJson(stateData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);



var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 10, 20, 50, 100, 130, 150, 180],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);

	
	
	

