'use strict';

angular.module('myApp.operation')
        .factory('OperationServices', ['$http', '$q', 
            function ($http, $q) {
              var obj = {};

                // Get a operation
                obj.get = function (operationName) {
                    return $http.get('https://localhost:9000/1.0/operations/' + operationName);
                }

                // Get all operations
                obj.getAll = function() {
                    return $http.get('https://localhost:9000/1.0/operations').then(function (data) {
                      data = data.data;

                      if (data.status != "Success") {
                        return $q.reject("Error");
                      }

                      if ( _.isEmpty(data.metadata)) {
                        return data;
                      }

                      var promises = data.metadata.running.map(function(operationUrl) {
                          return $http.get('https://localhost:9000' + operationUrl).then(function(resp) {
                              return resp.data.metadata;
                          });
                      });

                      return $q.all(promises);
                    });
                }

                return obj;
            }])
;