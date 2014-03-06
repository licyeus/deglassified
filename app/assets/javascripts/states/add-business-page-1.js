//= require select2
//= require angular-ui-select2

angular.module('state.add-business.page-1', [
    'ui.router',
    'ui.select2'
]) 

.config(function($stateProvider) {
    $stateProvider.state('add-business.page-1', {
        url: '/basic-information',
        views: {
            'addBusiness': {
                templateUrl: '/partials/add-business-page-1.html',
                controller: 'addBusinessPage1Ctrl'
            }
        },
        onEnter: function($rootScope) {
            $rootScope.pageTitle = 'Basic Information - Add Business';
        }
    }); 
})

.controller('addBusinessPage1Ctrl', function($scope, $state) {
    $scope.nextPage = function() {
        $state.go('add-business.page-2');
    };

    $('#city-select').select2();

})

;
