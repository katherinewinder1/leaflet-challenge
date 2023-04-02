// Creating the map object
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// Load in the json
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
// Create a circle for each earthquake
    function styleInfo(feature) {
        return {
            stroke: false,
            fillOpacity: 0.5,
            fillColor: circleColor(feature.geometry.coordinates[2]),
                        radius: circleSize(feature.properties.mag)
                }
            };

// Determine circle size
function circleSize(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: styleInfo, onEachFeature: function (feature, layer) {
        layer.bindPopup("Mag: " + feature.properties.mag + "<br>depth: " + feature.geometry.coordinates[2] + "<br>Loc: " + feature.properties.place
        );
    }
}).addTo(myMap);

// function to get the circle color
function circleColor(depth) {
    
    switch(true) {
        case depth < 10:
            return "#FFFFE0";
        
        case depth < 30: 
            return "#eee8aa";
        
        case depth < 50: 
            return"#da70d6";
        
        case depth < 70:
            return "#E31A1C";

        case depth < 90:
            return "#FF1493";

        case depth > 90:
            return "#800080"
        
    }
};

// Create a legend
var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var categories = [-10, 10, 30, 50, 70, 90];
    var colors = ["#FFFFE0", "#eee8aa", "#da70d6", "#E31A1C", "#FF1493", "#800080"]
    for (var i = 0; i < categories.length; i++) {
    div.innerHTML += "<i style=background:" + colors[i] + "></i>" + categories[i] + 
        (categories[i + 1] ? "&ndash;" + categories[i+1] + "<br>" : "+");
    }
    return div;
};

legend.addTo(myMap);

});