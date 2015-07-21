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
    var angApp = angular.module('RemoteControl', []);

    // This adds 'ng-enter' for catching pressing the enter button while in text-input
    angApp.directive('ngEnter', function () {
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
    angApp.directive('remoteButtons', [function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/RemoteControlButtons.html',
            controller: function ($http, $scope) {
                this.VLC = function (data) {
                    // Adding dateTime now to create a unique request each time. This circumvents IE's harsh cache policy
                    // that would otherwise this from being run more than once (yup retarded)
                    console.log('sending request: ' + $scope.url);
                    $http.get($scope.url + '/' + data + '/' + new Date().getTime());
                };
            },
            controllerAs: 'navi',
            scope: {
                url: '@',  // allow passing url to the directive
            },
        };
    }]);

    angApp.controller('ViewController', ['$scope', function ($scope) {
        // Default view is the control buttons
        this.currentView = 'buttons';

        // Load server url from settings or set default
        if (localStorage['serverUrl']) this.serverUrl = localStorage['serverUrl'];
        else this.serverUrl = 'http://188.166.126.168:9999';

        // Returns the active view
        this.isView = function (checkString) {
            if (checkString == this.currentView) return true;
            return false;
        };

        // Returns the not-active view
        this.nextView = function () {
            if (this.currentView == 'buttons') return 'settings';
            else return 'buttons';
        };

        // Toggles the view
        this.toggleView = function () {
            if (this.currentView == 'buttons') this.currentView = 'settings';
            else this.currentView = 'buttons';
        };

        // Set the url, and save to persisted storage
        this.btnSave = function (inputUrl) {
            // Valid url starts with http://, add it if not present
            if (inputUrl.indexOf('http://') == -1) inputUrl = 'http://' + inputUrl;
            console.log(inputUrl);
            this.serverUrl = inputUrl;
            localStorage['serverUrl'] = inputUrl;
            var $this = $('#savedPopup');
            $this.fadeIn(function () { $this.fadeOut(); })
        };

    }]);

    // ----------- Code below is stock WP code -------------------------------

    app.start();
})();
