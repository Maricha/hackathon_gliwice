function initMap() {
    var cords = $("#map").attr('data-map').split(', ');
    var chicago = new google.maps.LatLng(parseFloat(cords[0]), parseFloat(cords[1]));

    var map = new google.maps.Map(document.getElementById('map'), {
        center: chicago,
        zoom: 17
    });

    var coordInfoWindow = new google.maps.InfoWindow();
    coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
    coordInfoWindow.setPosition(chicago);
    coordInfoWindow.open(map);

    map.addListener('zoom_changed', function() {
        coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
        coordInfoWindow.open(map);
    });
}

var TILE_SIZE = 256;

function createInfoWindowContent(latLng, zoom) {
    var scale = 1 << zoom;

    var worldCoordinate = project(latLng);

    var pixelCoordinate = new google.maps.Point(
        Math.floor(worldCoordinate.x * scale),
        Math.floor(worldCoordinate.y * scale));

    var tileCoordinate = new google.maps.Point(
        Math.floor(worldCoordinate.x * scale / TILE_SIZE),
        Math.floor(worldCoordinate.y * scale / TILE_SIZE));
    var adres = $("#address").attr('data-address');
    return [
        adres
    ].join('<br>');
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
    var siny = Math.sin(latLng.lat() * Math.PI / 180);

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new google.maps.Point(
        TILE_SIZE * (0.5 + latLng.lng() / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
}
