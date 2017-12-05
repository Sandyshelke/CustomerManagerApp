var custApp = angular.module("CustManagerApp", ['ui.router']).config(function ($sceProvider) {
    $sceProvider.enabled(true);
});
custApp.factory("$GetRequestedData", function ($http, $q) {
    return {
        processRequest: function (requestMethod, pageUrl, requestData) {
            var deferred = $q.defer();
            $http({
                method: requestMethod,
                url: pageUrl,
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem('accesssToken')
                },
                data: JSON.stringify(requestData)
            }).then(function (data) {
                deferred.resolve(data);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
});
custApp.factory("$responseMessage", function ($timeout) {
    return {
        setMessage: function (message) {
            document.getElementById("response-message").style.display = "block";
            document.getElementById("response-message").innerHTML = message;
            $timeout(function () {
                document.getElementById("response-message").style.display = "none";
            }, 3000);
        }
    }
})

custApp.controller("LoginController", function ($scope, $http, $GetRequestedData, $responseMessage) {
    $scope.LoginToApp = function () {
        var requestObject = {
            Email: $scope.emailId,
            Password: $scope.password
        }
        $http({
            method: "POST",
            url: "/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "grant_type=password&username=" + requestObject.Email + "&password=" + requestObject.Password
        }).then(function success(response) {
            sessionStorage.setItem("accesssToken", response.data.access_token);
            window.location.href = "/Common/Dashboard"
        },
            function fail(response) {
                $responseMessage.setMessage(response.data.error_description);
            })
    }


    // Frogot Password :Reset link send on email
    $scope.showResp = false;
    $scope.showForm = true;
    $scope.GetFogotPassResponse = function () {
        $scope.showResp = true;
        $scope.ResponseContent = "Loading Data...";
        $scope.showResetBtn = true;
        $http({
            method: "POST",
            url: "/api/Account/ForgotPassword",
            data: { "Email": $scope.username }
        }).then(function success(response) {
            $scope.ResponseContent = response.data.message;
            $scope.showResetBtn = false;
            $scope.username = "";
            $scope.showForm = false;
        }, function error(response) {
            $scope.username = "";
            $scope.showResetBtn = false;
            $scope.ResponseContent = response.data.errorMessage;
        });
    }
})

custApp.controller("RegisterController", function ($scope, $http, $GetRequestedData, $responseMessage) {

    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    $scope.passwordStrength = {
        "width": "100%",
        "height": "5px",
        "border-radius": "2px",
    };

    $scope.analyze = function (value) {
        if (strongRegex.test(value)) {
            $scope.passwordStrength["background-color"] = "green";
        } else if (mediumRegex.test(value)) {
            $scope.passwordStrength["background-color"] = "orange";
        } else {
            $scope.passwordStrength["background-color"] = "red";
        }
    };

    $scope.RegisterAcc = function () {
        var requestObject = {
            UserName: $scope.name,
            Email: $scope.emailId,
            Password: $scope.password,
            ConfirmPassword: $scope.confirmPassword
        }
        $GetRequestedData.processRequest("POST", "/api/Account/Register", requestObject).then(function (response) {
            $responseMessage.setMessage("Verification Email has been sent to your account.Please activate your account.");
        }, function (response) {
            $responseMessage.setMessage(response.data.ModelState[''][1]);
        });
    }
})

custApp.controller("ProductController", function ($scope, $http, $GetRequestedData, $responseMessage) {


    $scope.AddProduct = function () {
        var requestObject = {
            ProductName: $scope.productName,
        }
        $GetRequestedData.processRequest("POST", "/api/Product", requestObject).then(function (response) {
            $responseMessage.setMessage(response.data);
        }, function (response) {
            $responseMessage.setMessage(response.data);
        });
    }
})

/*custApp.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider.state('current', {
        url: '/Matches/Current',
        views: {
            '': {
                templateUrl: "Html/Matches/CurrentMatches.html",
                controller: "MatchController"
            }
        }
    })
    $locationProvider.html5Mode(true);
}).controller("MatchController", function ($scope, $http, $GetRequestedData) {
    
})*/


//Resetpassword


//var resetPasswordApp = angular.module('resetPasswordApp', []);

custApp.controller('resetPasswordController', ['$scope', '$window', '$location', 'resetPasswordService', function ($scope, $window, $location, resetPasswordService) {


    $scope.ResetPassword = {
        Email: "",
        Password: "",
        ConfirmPassword: "",
        code: ""
    }

    var parseLocation = function (location) {
        var pairs = location.substring(1).split("&");
        var obj = {};
        var pair;
        var i;

        for (i in pairs) {
            if (pairs[i] === "") continue;

            pair = pairs[i].split("=");
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }

        return obj;
    };

    $scope.ResetPassword.code = parseLocation(window.location.search)['code'];
    //console.log(x);

    $scope.ChangePassword = function () {

        resetPasswordService.resetPassword($scope.ResetPassword).then(function (response) {
            alert("Password Changed Successfully");
            $window.location.href = "/Common/options";

        }, function () {
            alert("Failed.Please try again.");
        })
    }

}])

custApp.factory('resetPasswordService', ['$http', function ($http) {

    var fac = {};

    fac.resetPassword = function (resetPasswordData) {
        return $http.post('/api/Account/ResetPassword', resetPasswordData)
    };

    return fac;

}])


    
