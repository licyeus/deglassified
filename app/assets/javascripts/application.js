//= require jquery.min
//= require select2
//= require angular
//= require angular-cookies.min
//= require angular-ui-router.min
//= require angular-ui-select2
//= require angular-error-box.min
//= require custom-foundation.min
//= require spin.min
//= require ladda.min
//= require_tree .

$(document).foundation();

angular.module('deglassified', [
    // Libs
    'ui.router',

    // Services
    'service.location-data',
    'service.main-map',

    // Controllers
    'controller.side-bar',

    // States
    'state.home',
    'state.login-register',
    'state.add-business',
    'state.change-location',
    'state.404',
    // Location has a wildcard route, so it must be loaded after all states with an explicit route
    'state.location'
])

.config(function($locationProvider, $httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $locationProvider.html5Mode(true);
})

.run(function(mainMapService) {
    mainMapService.initMap();
})

;
