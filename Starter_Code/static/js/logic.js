// Creating the map object
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 5
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
// Create a circle for each earthquake
    function styleInfo(feature) {
        //var earthquakes = []
        //data.features.forEach(i => {
            //var lat = i.geometry.coordinates[1];
            //var lng = i.geometry.coordinates[0];

            //earthquakes.push(
                //L.circle([lat,lng], {
                    return {
                    stroke: false,
                    fillOpacity: 0.5,
                    fillColor: circleColor(feature.geometry.coordinates[2]),
                        radius: circleSize(feature.properties.mag)
                //}).bindPopup("<h3>" + i.properties.place + "</h3><hr><p>" +
                    //new Date(i.properties.time) + "</p", {
                        //maxWidth: 500
                    }
                };
    //)
//});

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
            return "#FFEDA0";
        
        case depth < 30: 
            return "#FEB24C";
        
        case depth < 50: 
            return"#FD8D3C";
        
        case depth < 70:
            return "#E31A1C";

        case depth < 90:
            return "#98ee00";

        case depth > 90:
            return "#FF0000"
        
    }
};

// Create a legend
var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var labels = ['<strong>Magnitude and Depth</strong>'];
    //var categories = ['-10 to 10', '10 to 30', '30 to 50', '50 to 70', '70 to 90', '90+'];
    var categories = [-10, 10, 30, 50, 70, 90];
    var colors = ["#FFEDA0", "#FEB24C", "#FD8D3C", "#E31A1C", "#98ee00", "#FF0000"]
    for (var i = 0; i < categories.length; i++) {
    div.innerHTML += "<i style=background:" + colors[i] + "></i>" + categories[i] + 
        (categories[i + 1] ? "&ndash;" + categories[i+1] + "<br>" : "+");
    
        //"<h2>Earthquake Depth</h2>",
        //"<p class='l10'>-10 to 10</p>",
        //"<p class='l30'>10 to 30</p>",
        //"<p class='l50'>30 to 50</p>",
        //"<p class='l70'>50 to 70</p>",
        //"<p class='l90'>70 to 90</p>",
        //"<p class='g90'>90+</p>",
    //].join("");
        //labels.push('<i class="circle" style="background:' + circleColor(categories[i])
        //+ (categories[i] ? categories[i] : '+'));
    //} div.innerHTML = labels.join("<br>");
    }
    return div;
};

legend.addTo(myMap);

});

