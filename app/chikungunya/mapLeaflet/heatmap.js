
var geojson;
var map;
var info;

  //var slider = d3.slider().value([10, 25 ]);
function initMap(locator,sexo,cor,idadeMin,idadeMax,gestante) {
 // var inital_date = moment(inital_date);
//  var final_date = moment(final_date);

d3.json("bairros.json", function(data1) { //data 1 é constante
  d3.json("chikungunya_data.json", function(data2) {   //data 2 é alterado de acordo com a entrada  
      var data2 =selectSexo(data2,sexo);   
        data2 = selectCor(data2,cor);
        data2 = selectIdade(data2,idadeMin,idadeMax);  
        data2 =  selectGestante(data2,gestante);  
        createMap(data1,data2,locator); 

  });

});

//deleteMap(locator);

}


function selectGestante(data,gestante){

  if(gestante=="0"){return data;}

 var filter_by_gestante =  data.filter(function(elem) {
                     if(elem["tp_gestante"]=="1" || elem["tp_gestante"]=="2" || elem["tp_gestante"]=="3" ||  elem["tp_gestante"]=="4"  ){
                               return true;
                     }else{
                               return false;
                     }
                      
                    });
      return filter_by_gestante;
} 


function selectIdade(data,idadeMin,idadeMax){


 var filter_by_idade =  data.filter(function(elem) {
          var idade = elem["nu_idade"]%1000
                     if(idadeMin<=idade  && idade<=idadeMax){   
                               return true;
                     }else{
                               return false;
                     }
                    });
      return filter_by_idade;
} 

function selectSexo(data,sexo){

  if(sexo=="Sexo"){return data;}

 var filter_by_sexo =  data.filter(function(elem) {
                     if(elem["tp_sexo"]==sexo){
                               return true;
                     }else{
                               return false;
                     }
                      
                    });
      return filter_by_sexo;
} 


function selectCor(data,cor){

  if(cor=="Todos"){return data;}

 var filter_by_cor=  data.filter(function(elem) {
                     if(elem["tp_raca_cor"]==cor){
                               return true;
                     }else{
                               return false;
                     }
                      
                    });
      return filter_by_cor;
} 

//credito leaflet tutorial
   function createMap(data1,data2, locator) {
    var result = [];
    data1.forEach(
     function(d){
         result[d['Nome Localidade']]=0;
     
     });
        
    data2.forEach(
            function(d){
                result[d['no_bairro_residencia']] +=1;
            }); 

  //console.log(result);
      map = L.map('map').setView([-8.05596, -34.87986], 12);
L.tileLayer(
'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  
}).addTo(map);


 info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info.update = function (props) {
  
    this._div.innerHTML = '<h4>Casos Chikungunya</h4>' +  (props ?
        '<b>' +  props.bairro_nome_ca + '</b><br />' +
    " \n Quantidade Casos:"+result[props.bairro_nome_ca]
        : 'Passe por um bairro');
};

info.addTo(map);
function getColor(d) {  
    return d> 180 ? '#67000d' :
           d> 150  ? '#a50f15' :
           d> 130  ? '#cb181d' :
           d> 100  ? '#ef3b2c' :
           d> 50   ? '#fb6a4a' :
           d> 20   ?'#fc9272' :
           d> 10   ?  '#fcbba1' :
                      '#fee0d2';

}

function style(feature) {
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

geojson= L.geoJson(stateData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0,20,40,60,80,100,120,140],
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

}


function updateMapa(svg_locator,sexo,cor,idadeMin,idadeMax,gestante){

  d3.json("bairros.json", function(data1) { //data 1 é constante
  d3.json("chikungunya_data.json", function(data2) {   //data 2 é alterado de acordo com a entrada  
    var data2 =selectSexo(data2,sexo) ;  
         data2 = selectIdade(data2,idadeMin,idadeMax);
       data2 = selectCor(data2,cor);    
        data2 =  selectGestante(data2,gestante);  
        updateMap(data1,data2,svg_locator); 
  });
});

}


function updateMap(data1,data2) {
      var result = [];
    data1.forEach(
     function(d){
         result[d['Nome Localidade']]=0;
     
     });
        
    data2.forEach(
            function(d){
                result[d['no_bairro_residencia']] +=1;
            }); 

      
    map.removeControl(info);
     map.removeLayer(geojson);

  
     info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info.update = function (props) {
  
    this._div.innerHTML = '<h4>Casos Chikungunya</h4>' +  (props ?
        '<b>' +  props.bairro_nome_ca + '</b><br />' +
    " \n Quantidade Casos:"+result[props.bairro_nome_ca]
        : 'Passe por um bairro');
};

info.addTo(map);


function getColor(d) {  
    return d> 180 ? '#67000d' :
           d> 150  ? '#a50f15' :
           d> 130  ? '#cb181d' :
           d> 100  ? '#ef3b2c' :
           d> 50   ? '#fb6a4a' :
           d> 20   ?'#fc9272' :
           d> 10   ?  '#fcbba1' :
                      '#fee0d2';

}

function style(feature) {
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
  
}


function selectData(data, inital_date, final_date) {

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

  return filter_by_date;


}