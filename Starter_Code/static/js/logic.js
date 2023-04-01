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
    var earthquakes = []
    data.features.forEach(i => {
        var lat = i.geometry.coordinates[1];
        var lng = i.geometry.coordinates[0];

        earthquakes.push(
            L.circle([lat,lng], {
                stroke: false,
                fillOpacity: 0.5,
                fillColor: circleColor(i.geometry.coordinates[2]),
                radius: circleSize(i.properties.mag)
            }).bindPopup("<h3>" + i.properties.place + "</h3><hr><p>" +
                new Date(i.properties.time) + "</p", {
                    maxWidth: 500
        })
    )
});

// Determine circle size
function circleSize(mag) {
    return mag * 30000;
}

function circleColor(depth) {
    var color = "#FFEDA0";
    switch(true) {
        case (depth < 10): color = "#FFEDA0";
        break;
        case (depth < 30): color = "#FEB24C";
        break;
        case (depth < 50): color = "#FD8D3C";
        break;
        case (depth < 70): color = "#E31A1C";
        break;
    }
}

// Create a legend
var legend = L.control({
    position: "bottomright"
});

legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
    labels = ['<strong>Magnitude and Depth</strong>']
    categories = ['-10 to 10', '10 to 30', '30 to 50', '50 to 70', '70 to 90', '90+'];
    for (var i = 0; i < categories.length; i++) {
        div.innerHTML += 
        labels.push('<i class="circle" style="background:' + circleColor(categories[i])
        + (categories[i] ? categories[i] : '+'));
    } div.innerHTML = labels.join("<br>");
    return div;
};

legend.addTo(myMap);

});
