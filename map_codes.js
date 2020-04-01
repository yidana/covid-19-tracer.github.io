/// <reference path="../typings/index.d.ts" />
var mymap=L.map('map').setView([8.267976, -1.018641],7)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(mymap)



function getColor(d) {
    return d > 50 ? '#800026' :
           d > 10  ? '#BD0026' :
           d > 5  ? '#E31A1C' :
                      '#FFEDA0';
}
function getOpacity(d) {
    return d > 0 ? 0.9 :
           d == 0  ? 0 :
                    0;
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#d1774f',
        dashArray: '',
        fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToBack();
    }
    info.update(layer.feature.properties);
}
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function onEachFeature(feature, layer) {
    var content = '<div class="custom-popup" id="map-popup">' + '<table border="1" style="border-collapse:collapse;" cellpadding="5">' +
        '<tr>' + '<th>Region: </th>' + '<td>' + feature.properties.REGION + '</td>' + '</tr>' +
        '<tr>' + '<th>Confirmed Cases: </th>' + '<td>' + feature.properties.Cases + '</td>' + '</tr>' +
        '<table>' + '</div>';
    var customOptions =
        {
            'className': 'custom'
        }

    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: layer.bindPopup('<h6 class="popup-heading">Covid-19 Cases</h6>'+ content,customOptions)
    });
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h5>Ghana Covid-19 Cases</h5>' +  (props ?
        '<b>' + props.REGION + ' REGION' + '<br />'+'<h6>'+'Comfirmed Cases: ' + props.Cases +'</h6>'+ '</b>'
        : 'Hover over a region');
};

info.addTo(mymap);

var geojson = L.geoJSON(new_regions,{
    style: {
        color: "white",
        weight: 2,
        fillOpacity:0.8,
        fillColor:"#d1774f",
        dashArray: '3',
    },
    onEachFeature: onEachFeature
}).addTo(mymap)

points=L.geoJSON(hotspots,{
    pointToLayer: function(feature,latlng){
        console.log(feature.properties.Cases)
        return L.circle(latlng,{
            color:getColor(feature.properties.Cases),
            fillOpacity:getOpacity(feature.properties.Cases),
            opacity:getOpacity(feature.properties.Cases),
            radius:100*feature.properties.Cases
        })
    }
}).addTo(mymap)
