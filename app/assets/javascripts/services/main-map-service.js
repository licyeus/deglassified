//= require mapbox.js

angular.module('service.main-map', [ 'ui.router'])

.service('mainMapService', function($rootScope, $state) {
    var map,
        geoJSON,
        markerLayer;

    function initMap() {
        mapElement = 'map',
        defaultView = [47.603569, -122.329453],
        defaultZoom = 12,
        map = L.mapbox.map(mapElement, 'licyeus.gg3718oi').setView(defaultView, defaultZoom);

        geoJSON = {
            type: 'FeatureCollection',
            features: []
        };

        markerLayer = L.mapbox.markerLayer();
    }

    function loadLocation(location) {
        clearMarkers();
        if (location.coordinates) {
            panTo(location.coordinates);
        }
        addBusinessesToMapbox(location.businesses);
    }

    function addBusinessesToMapbox(businesses) {
        angular.forEach(businesses, function(business) {
            createMarkerForBusiness(business);
        });
        setMarkerLayer();
    }

    function createMarkerForBusiness(business) {
        geoJSON.features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [business.coordinates.lng, business.coordinates.lat]
            },
            properties: {
                business: business
            }
        });
    }

    function setMarkerLayer() {
        markerLayer.setGeoJSON(geoJSON);
        markerLayer.eachLayer(function(marker) {
            setMarkerPopup(marker);
            setMarkerListeners(marker);
        });
        markerLayer.addTo(map);
    }

    function setMarkerPopup(marker) {
        var business = marker.feature.properties.business; 

        var content  = "<h4>" + business.name + "</h4>" +
            "<p>" + business.address + "</p>";
        if (business.links) {
            content += '<p>';
            if (business.links.website)
                content += "<a href='" + business.links.website + "' target='_blank'><i class='fi-link'></i> website</a><br>";
            if (business.links.facebook)
                content += "<a href='" + business.links.facebook + "' target='_blank'><i class='fi-social-facebook'></i> facebook</a><br>";
            if (business.links.twitter)
                content += "<a href='" + business.links.twitter + "' target='_blank'><i class='fi-social-twitter'></i> twitter</a><br>";
            if (business.links.yelp)
                content += "<a href='" + business.links.yelp + "' target='_blank'><i class='fi-social-yelp'></i> yelp</a><br>";
            content += '</p>';
        }

        marker.bindPopup(content);
    }

    function setMarkerListeners(marker) {
        var business = marker.feature.properties.business; 

        marker.on('popupopen', function(business) {
            return function() {
                $state.go('location.business', { business: business.slug });
                $rootScope.pageTitle = business.name;
            };
        }(business));

        marker.on('popupclose', function() {
            // Does not 'reload' the state controller; Just changes the window location href
            $state.go('location', { location: $rootScope.currentLocation.slug });
            $rootScope.pageTitle = $rootScope.currentLocation.city;
        });
    }

    function openBusinessPopup(businessSlug) {
        markerLayer.eachLayer(function(marker) {
            if (marker.feature.properties.business.slug === businessSlug) {
                // Check up if popup is not already open
                if(!marker._map.hasLayer(marker._popup)) {
                    // Popup is not open, ok to open popup
                    marker.openPopup();
                    panTo(marker.getLatLng());
                }
            }
        });
    }

    function clearMarkers() {
        // clearLayers() will trigger a popupclose event, so make sure to unbind the listener
        markerLayer.eachLayer(function(marker) {
            marker.off('popupclose');
        });
        // Here we would set the changingLocations flag
        markerLayer.clearLayers();
        geoJSON.features.length = 0;
    }

    function panTo(coords) {
        map.panTo([coords.lat, coords.lng]);
    }

    return {
        initMap: initMap,
        clearMarkers: clearMarkers,
        loadLocation: loadLocation,
        addBusinessesToMapbox: addBusinessesToMapbox,
        openBusinessPopup: openBusinessPopup
    };

})

;
