// Store our API endpoint as queryUrl.
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Creating a GeoJSON layer Using the features array retrieved from the API data, and add it to the map.
// Perform a GET request to the query URL.
d3.json(queryUrl).then(function (data) {
    console.log(data.features);
    // send the data.features object to the createFeatures function.
    createFeatures(data.features);

});

// Function to determine marker size
function markerSize(magnitude) {
    return magnitude * 20500;
  }

// Function to determine marker color by depth
function getColor(depth) {
    if (depth < 10) return "#00FF00";
    else if (depth < 30) return "greenyellow";
    else if (depth < 50) return "yellow";
    else if (depth < 70) return "orange";
    else if (depth < 90) return "orangered";
    else return "#FF0000";
  }
  
// Creating createFeatures() function to set up the features of markers on the map

function createFeatures(earthquakeData) {
    
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>`);
        }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

    // Passing a pointToLayer function 

        pointToLayer: function(feature, latlng) {

            let geojsonMarker = {
                radius: markerSize(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "black",
                weight: 0.5,
                stroke: true,
                
            };
        
        return L.circle(latlng, geojsonMarker);
        }
    });

    // sending the marker features to the createMap function.
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Adding a tile layer.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Assing a starter map, and adding the layers to display.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Adding the map legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend"),
            depth = [-10, 10, 30, 50, 70, 90],
            labels = [];

        for (var i = 0; i <depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);

}

