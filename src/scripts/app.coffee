app = angular.module 'angular', [
    'ngRoute',
    'filters',
    'factories',
    'controllers',
    'directives',
]

app.config ['$routeProvider', ($routeProvider) ->
    $routeProvider;
]
