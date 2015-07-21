// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=329104
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };
    // ----------- Code above is stock WP code -------------------------------
    //var angApp = angular.module('RemoteControl', []);

    // This adds 'ng-enter' for catching pressing the enter button while in text-input
    angular.module('RemoteControl', []).directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    // Remote-control buttons
    angular.module('RemoteControl', []).directive('remoteButtons', [function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/RemoteControlButtons.html',
            controller: function ($http) {
                this.VLC = function (data) {
                    // Adding dateTime now to create a unique request each time. This circumvents IE's harsh cache policy
                    // that would otherwise this from being run more than once (yup retarded)
                    console.log('sending request:');
                    $http.get(this.url + '/' + data + '/' + new Date().getTime());
                };
            },
            controllerAs: 'navi',
            scope: {
                url: '=',  // allow passing url to the directive
            },
        };
    }]);

    //angular.module('RemoteControl', []).controller('ViewController', ['$scope',function ($scope) {
    //    this.currentView = 'buttons';
    //    this.isView = function (checkString) {
    //        console.log(checkString);
    //        if (checkString == this.currentView) return true;
    //        return false;
    //    };
    //}]);
    //angApp.controller('viewController', function ($scope) {
    //    $scope.currentView = 'buttons';
    //    this.isView = function (checkView) {
    //        return (checkView == $scope.currentView);
    //    };


    //});








    // ----------- Code below is stock WP code -------------------------------

    app.start();
})();
