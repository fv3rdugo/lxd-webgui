'use strict';

angular.module('myApp.image', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/images', {
            title: 'Images',
            templateUrl: 'modules/image/images.html',
            controller: 'imageListCtrl',
            resolve: {
                images: function (ImageServices, $route) {
                    return ImageServices.getAll();
                }
            }
        })
        .when('/image-view/:imageID', {
            title: 'Images',
            templateUrl: 'modules/image/image-view.html',
            controller: 'imageViewCtrl',
            resolve: {
                image: function (ImageServices, $route) {
                    return ImageServices.getByFingerprint($route.current.params.imageID)
                }
            }
        })
        .when('/image-add-remote', {
            title: 'Images',
            templateUrl: 'modules/image/image-add-remote.html',
            controller: 'imageAddRemoteCtrl',
            resolve: {}
        })
        ;
    }])


    .controller('imageViewCtrl', function ($scope, $routeParams, $filter, $location, image, ImageServices) {
        $scope.image = image.data.metadata;
    })

    .controller('imageListCtrl', function ($scope, $routeParams, $interval, $filter, $location, $uibModal,
                                           ContainerServices, ImageServices, images) {
        $scope.images = images;

        $scope.delete = function(image) {
          // Create modal
          var modalInstance = $uibModal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'modules/image/modalDelImage.html',
              controller: 'genericImageModalCtrl',
              size: 'md',
              resolve: {
                image: function () {
                    return image;
                }
              }
          });

          // Handle modal answer
          modalInstance.result.then(function (container) {
            ImageServices.delete(container).then(function(data) {

              var operationUrl = data.data.operation;
              var refreshInterval;

              // Try until operation is finished
              refreshInterval = $interval(
                function() {
                  ContainerServices.isOperationFinished(operationUrl).then(function(data) {
                    // I dont really care if the operation is still runnging
                  }, function(error) {
                    $interval.cancel(refreshInterval);

                    // Operation returned 404, so its finished
                    ImageServices.getAll().then(function(data) {
                      $scope.images = data;
                    })
                  });
                }, 1000
              );
            });
          }, function () {
            // Do Nothing
          });
      }
    })


    .controller('genericImageModalCtrl', function ($scope, $routeParams, $filter, $location, $uibModalInstance,
                                                       image, ImageServices) {
        $scope.image = image;

        $scope.ok = function () {
            $uibModalInstance.close($scope.image);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })


    .controller('imageAddRemoteCtrl', function ($scope, $routeParams, $filter, $location, ImageServices) {
        $scope.addRemoteImage = function () {
            ImageServices.addRemoteImage($scope.url);
        }

        $scope.addSourceImage = function () {
            ImageServices.addSourceImage2();
        }
    })
;
