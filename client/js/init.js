// VARIABLES Y ESTRUCTURA DE ANGULAR

var app = angular.module('aplicacion', []);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

/*
app.config(['$locationProvider', function($locationProvider)
{
	$locationProvider.html5Mode({
                                  enabled: true,
                                  requireBase: false
                               });
}]);
*/