var custApp = angular.module("CustManagerApp", ['ui.router', 'LocalStorageModule']).config(function ($sceProvider) {
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
custApp.factory("$responseMessage", function ($timeout, $rootScope) {
    return {
        setMessage: function (inputMessage) {
            document.getElementById("response-msg").style.display = "block";
            $rootScope.message = inputMessage;
            $timeout(function () {
                document.getElementById("response-msg").style.display = "none";
            }, 3000);
        }
    }
})
custApp.factory('resetPasswordService', ['$http', function ($http) {

    var fac = {};

    fac.resetPassword = function (resetPasswordData) {
        return $http.post('/api/Account/ResetPassword', resetPasswordData)
    };

    return fac;

}])
custApp.factory('loginAppFactory', function (localStorageService, $q, $http) {

    var fac = {};

    fac.CheckRegistration = function (token) {

        var deferred = $q.defer();

        var request = {
            method: 'get',
            url: '/api/Account/UserInfo',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }

        fac.SignupExternal = function (token) {

            var request = {
                method: 'post',
                url: '/api/Account/RegisterExternal',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                data: {}
            }

            return $http(request)
        }

        return $http(request)
    }

    return fac;

})

custApp.controller("LoginController", function ($scope, $http, $rootScope, $GetRequestedData, $responseMessage, loginAppFactory, localStorageService) {
    $scope.isLoaded = false;
    $scope.LoginToApp = function () {
        $responseMessage.setMessage("Loading Response...");
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
            window.location.href = "/User/UserMVC/Profile"
        },
            function fail(response) {
                $responseMessage.setMessage(response.data.error_description);
            })
    }
    $scope.SendResetPassLink = function () {
        $scope.isLoaded = true;
        $responseMessage.setMessage("Loading Response...");
        $GetRequestedData.processRequest("POST", "/api/Account/ForgotPassword", { Email: $scope.username }).then(function success(response) {
            $responseMessage.setMessage(response.data.Message);
        }, function error(response) {
            $responseMessage.setMessage(response.data.Message);
        });
    }

    $scope.authenticateExternalProvider = function (provider) {

        var externalProviderUrl = "/api/Account/ExternalLogin?provider=" + provider + "&response_type=token&client_id=self&redirect_uri=http%3A%2F%2Flocalhost%3A52498%2FCommon%2FOptions&state=lh9EhFcEFKB07ILio01KJ5YwjgFET3wX7_FOh-E9MjE1";
        window.location.href = externalProviderUrl;

    };
    $scope.CheckLocationHash = function () {
        if (location.hash) {

            if (location.hash.split('access_token=')) {
                $scope.accessToken = location.hash.split('access_token=')[1].split('&')[0];
                if ($scope.accessToken) {
                    loginAppFactory.CheckRegistration($scope.accessToken).then(function (response) {
                        if (response.data.HasRegistered) {
                            sessionStorage.setItem("accesssToken", $scope.accessToken);
                            location.href = "/User/UserMVC/Profile"
                        }
                        else {
                            loginAppFactory.SignupExternal($scope.accessToken).then(function (response) {
                                sessionStorage.setItem("accesssToken", $scope.accessToken);
                                location.href = "/User/UserMVC/Profile"
                            }, function (err) {
                                alert(err.data.ModelState[''][1]);
                            })
                        }
                    }, function () {
                        alert("failed.");
                    })
                }
            }
        }
    }

    $scope.CheckLocationHash();
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
        $responseMessage.setMessage("Loading Response...");
        var requestObject = {
            Name: $scope.name,
            UserName: $scope.emailId,
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

custApp.controller('resetPasswordController', ['$scope', '$window', '$location', 'resetPasswordService', function ($scope, $window, $location, resetPasswordService) {

    var queryparams = $location.absUrl().split('?')[1].split('&');
    var urlParameter = {};
    for (var index in queryparams) {
        var split = queryparams[index].split('=');
        urlParameter[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
    }
    $scope.ResetPassword = {
        Email: urlParameter['email'] ,
        Password: "",
        ConfirmPassword: "",
        code: urlParameter['code']
    }

    $scope.ChangeForgotPass = function () {

        resetPasswordService.resetPassword($scope.ResetPassword).then(function (response) {
            alert("Password Changed Successfully");
            $window.location.href = "/Common/options";

        }, function (response) {
            alert(response.data.ModelState["model.Password"]);
        })
    }
}])

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

custApp.controller("ProfileController", function ($scope, $http, $GetRequestedData, $responseMessage) {

    $scope.GetProfile = function () {

        $GetRequestedData.processRequest("GET", "/api/User/Profile","").then(function (response) {
            $scope.profileContent = response.data;
        }, function (response) {
            $responseMessage.setMessage(response.data);
        });
    }

    $scope.UpdateProfile = function () {
        var requestObject = {
            Name: $scope.profileContent.Name,
            Email: $scope.profileContent.Email,
            PhoneNumber: $scope.profileContent.PhoneNumber,
            AboutMe: $scope.profileContent.AboutMe,
        }

        $GetRequestedData.processRequest("POST", "/api/User/Profile", requestObject).then(function (response) {
            $scope.profileContent = response.data;
        }, function (response) {
            $responseMessage.setMessage(response.data);
        });
    }
})



    
