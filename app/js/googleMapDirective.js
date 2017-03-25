(function(){
    'use strict';

    require ('angular');

    module.exports = function() {
        var link = function(scope, element, attrs) {
            var map, infoWindow, geocoder, searchBox, selectedMarker;
            var markers = [];
            var searchBoxMarker = [];
            var mapOptions = {
                center: new google.maps.LatLng(50, 2),
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                scrollwheel: false
            };

            function initMap() {
                if (map === void 0) {
                    map = new google.maps.Map(element[0].children[1], mapOptions);
                    var input = element[0].children[0];
                    searchBox = new google.maps.places.SearchBox(input);
                    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                    geocoder = new google.maps.Geocoder();
                }
            }

            initMap();

            searchBox.addListener('places_changed', function() {

                var places = searchBox.getPlaces();

                if (places.length === 0) {
                    return;
                }
                searchBoxMarker.forEach(function(marker) {
                    marker.setMap(null);
                });
                searchBoxMarker = [];

                var bounds = new google.maps.LatLngBounds();

                placeMarker(places[0].geometry.location);
                map.fitBounds(bounds);
            });

            google.maps.event.addListener(map, 'click', function(event) {
                placeMarker(event.latLng);
            });

            var placeMarker = function(location) {
                if (!!selectedMarker) {
                    selectedMarker.setMap(null);
                }

                selectedMarker = new google.maps.Marker({
                    position: location,
                    map: map,
                    draggable: true
                });

                geocoder.geocode({
                    latLng: selectedMarker.getPosition()
                }, function(responses) {
                    var addressObject = parseAddressComponents(responses[0]);
                    scope.updateAddressForm({address:addressObject});
                    map.setZoom(mapOptions.zoom);
                    map.setCenter(selectedMarker.getPosition());
                });

                google.maps.event.addListener(selectedMarker, 'dragend', function(event) {
                    placeMarker(event.latLng);
                });
            };

            function setMarker(map, position, title, content) {
                var marker;
                var markerOptions = {
                    position: position,
                    map: map,
                    title: title
                };

                marker = new google.maps.Marker(markerOptions);
                markers.push(marker); // add marker to array

                google.maps.event.addListener(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: content
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }

            function parseAddressComponents(item) {
                var arrAddress = item.address_components;
                var streetNumber = ''; //street_number
                var street = ''; //route
                var ward = ''; //political
                var district = ''; //administrative_area_level_2
                var city = ''; //administrative_area_level_1
                var country = ''; //country

                angular.forEach(arrAddress, function(addressComponent, key) {
                    if (addressComponent.types[0] == "street_number"){
                        streetNumber = addressComponent.long_name;
                    }
                    if (addressComponent.types[0] == "route"){
                        street = addressComponent.long_name;
                    }
                    if (addressComponent.types[0] == "political"){
                        ward = addressComponent.long_name;
                    }
                    if (addressComponent.types[0] == "administrative_area_level_2"){
                        district = addressComponent.long_name;
                    }
                    if (addressComponent.types[0] == "administrative_area_level_1"){
                        city = addressComponent.long_name;
                    }
                    if (addressComponent.types[0] == "country"){
                        country = addressComponent.long_name;
                    }
                });

                return {
                    streetNumber: streetNumber,
                    street: street,
                    ward: ward,
                    district: district,
                    city: city,
                    country: country
                };
            }
        };

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'views/googleMapTpl.html',
            link: link,
            scope: {
                updateAddressForm: '&'
            }
        };
    };
})();
