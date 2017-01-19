var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);
app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/'
    var obj = {};
    obj.getCustomers = function(){
        return $http.get(serviceBase + 'customers');
    }
    obj.getCustomer = function(customerID){
        return $http.get(serviceBase + 'customer?id=' + customerID);
    }

    obj.login = function (rowdata) {
    return $http.post(serviceBase + 'login', rowdata).then(function (results) {
        return results;
    });
	};

	obj.updateCustomer = function (id,customer) {
	    return $http.post(serviceBase + 'updateCustomer', {id:id, customer:customer}).then(function (status) {
	        return status.data;
	    });
	};

	obj.deleteCustomer = function (id) {
	    return $http.delete(serviceBase + 'deleteCustomer?id=' + id).then(function (status) {
	        return status.data;
	    });
	};

    return obj;   
}]);

app.controller('homeCtrl', function ($scope, services) {
//    $scope.slider = {
//    options: {
//        start: function (event, ui) { $log.info('Slider start'); },
//        stop: function (event, ui) { $log.info('Slider stop'); }
//        }
//    }
//    $scope.dologin = function(data) {
//      $location.path('/');
//        services.login(data);
//        
//    };
});
app.controller('aboutCtrl', function ($scope, services) {
//    $scope.slider = {
//    options: {
//        start: function (event, ui) { $log.info('Slider start'); },
//        stop: function (event, ui) { $log.info('Slider stop'); }
//        }
//    }
//    $scope.dologin = function(data) {
//      $location.path('/');
//        services.login(data);
//        
//    };
});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, services, customer) {
    var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
    $rootScope.title = (customerID > 0) ? 'Edit Customer' : 'Add Customer';
    $scope.buttonText = (customerID > 0) ? 'Update Customer' : 'Add New Customer';
      var original = customer.data;
      original._id = customerID;
      $scope.customer = angular.copy(original);
      $scope.customer._id = customerID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.customer);
      }

      $scope.deleteCustomer = function(customer) {
        $location.path('/');
        if(confirm("Are you sure to delete customer number: "+$scope.customer._id)==true)
        services.deleteCustomer(customer.customerNumber);
      };

      $scope.saveCustomer = function(customer) {
        $location.path('/');
        if (customerID <= 0) {
            services.insertCustomer(customer);
        }
        else {
            services.updateCustomer(customerID, customer);
        }
    };
});

app.config(function($routeProvider, $locationProvider) {
      
    $routeProvider.
      when('/', {
        title: 'Home',
        templateUrl: 'partials/home.html',
        controller: 'homeCtrl'
      })
      .when('/about-us', {
        title: 'About Us',
        templateUrl: 'partials/about.html',
        controller: 'aboutCtrl'
      })
      .when('/edit-customer/:customerID', {
        title: 'Edit Customers',
        templateUrl: 'partials/edit-customer.html',
        controller: 'editCtrl',
        resolve: {
          customer: function(services, $route){
            var customerID = $route.current.params.customerID;
            return services.getCustomer(customerID);
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
      if (window.history && window.history.pushState) {
          $locationProvider.html5Mode({
              enabled : true,
              requireBase : false
          }).hashPrefix('');
      }
    // use the HTML5 History API
    
});
app.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);