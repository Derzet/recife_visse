var map = L.map('map').setView([-8.05596, -34.87986], 13);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([-8.05596, -34.87986]).addTo(map);
L.geoJson(stateData).addTo(map);

