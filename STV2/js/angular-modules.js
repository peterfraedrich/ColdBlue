// angular-modules.js

// ======== INIT APP ===================//

var app = angular.module('stv', ['ui']);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);

// ========= CONTROLLERS =================//

app.controller('servList', ['$scope', '$timeout', '$http', '$templateCache', function($scope, $timeout, $http, $templateCache) {

    var method = 'POST';
    var rooturl = 'http://192.168.1.100:666';
    var oip = '';

    $scope.codeStatus = "";

    // list hosts
    $scope.list = function() {

        var url = rooturl+'/get';
        $http.get(url).then(function(res) {
            $scope.servers = res.data;
        });
    };
     
    $scope.nothing = function() {

    };

    $scope.edit = function(row) {

        $scope.hide = false;
        $scope.editIpaddr = row.ipaddr;
        $scope.editHostname = row.hostname;
        $scope.editSubnet = row.subnet;
        $scope.editVlan = row.vlan;
        $scope.editVp = row.vp;
        $scope.editVirthost = row.virthost;
        $scope.editLocation = row.location;
        $scope.editLogin = row.login;
        $scope.editServices = row.services;
        $scope.editAddedby = row.user;
        $scope.editreserved = row.reserved;
        oip = row.ipaddr;

    };

    $scope.edithide = function () {

        $scope.hide = ($scope.hide) ? false : true;
        return $scope.hide;

    };

    $scope.viewOptions = function() {

        $scope.viewhide = false;

    };

    $scope.viewhide = function () {

        $scope.viewhide = ($scope.viewhide) ? false : true;
        return $scope.viewhide;

    };

    $scope.viewSave = function() {

        $scope.viewhide = true;

    };

    $scope.saveEdit = function () {

        date = new Date().toJSON().slice(0,10);
        time = new Date().toJSON().slice(11,19);
        datetime = date + " " + time

        console.log("saving to DB");

        var formData = {
            ipaddr: $scope.editIpaddr,
            oip: oip,
            hostname: $scope.editHostname,
            subnet: $scope.editSubnet,
            vlan: $scope.editVlan,
            vp: $scope.editVp,
            virthost: $scope.editVirthost,
            location: $scope.editLocation,
            login: $scope.editLogin,
            services: $scope.editServices,
            user: $scope.editAddedby,
            reserved: $scope.editreserved,
            };

        var jdata = 'mydata=' + JSON.stringify(formData);

        console.log(jdata);

        $http({
            method: 'POST',
            url: rooturl+'/save',
            data: jdata,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache,
        }).
        success(function(response) {
            console.log("success");
            $scope.codeStatus = response.data;
            console.log($scope.codeStatus);
        }).
        error(function(response){
            console.log("error");
            $scope.codeStatus = response || "Request failed";
            console.log($scope.codeStatus);
        });

        $scope.edithide();
        $scope.list();

    };

    $scope.resetStats = function () {

        var formdata = {
            ipaddr: $scope.editIpaddr,
            alive: 'true',
            health: '100',
            ping: '0',
            pingfail: '0',
            lastscan: '',
            tidyflag: 'false',
            lastalive: '',
        };

        var jdata = 'mydata='+JSON.stringify(formdata);

        $http({
            method: 'POST',
            url: rooturl+'/reset',
            data: jdata,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache,
        }).
        success(function(response) {
            console.log("success");
            $scope.codeStatus = response.data;
            console.log($scope.codeStatus);
        }).
        error(function(response){
            console.log("error");
            $scope.codeStatus = response || "Request failed";
            console.log($scope.codeStatus);
        });

        $scope.edithide();
        $scope.list();

    };

    $scope.deleteEdit = function () {
        var rowData = {
            ipaddr: $scope.$edit.ipaddr,
        };

        var delurl = rooturl+"/delete";
        var jdata = "mydata="+JSON.stringify(rowData);
        var delmethod = 'POST';

        $http({
            method: 'POST',
            data: jdata,
            url: rooturl+'/delete',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).
        success(function(response) {
            console.log("success");
            $scope.codeStatus = response.data;
            console.log($scope.codeStatus);
        }).
        error(function(response){
            console.log("error");
            $scope.codeStatus = response || "Request failed";
            console.log($scope.codeStatus);
        });
        $scope.list();
        return false;

    };

    $scope.refresh = function () {
        $scope.list();
        console.log('refreshed the page');

    };

    $scope.clearfilters = function () {

        $scope.search = '';
        $scope.search.vlan = '';
        $scope.search.user = '';
        $scope.search.vp = '';
        $scope.search.virthost = '';
        $scope.search.reserved = '';

    };

    $scope.delete = function(row) {

        var rowData = {
            ipaddr: row.ipaddr,
        };

        var delurl = rooturl+"/delete";
        var jdata = "mydata="+JSON.stringify(rowData);
        var delmethod = 'POST';

        $http({
            method: 'POST',
            data: jdata,
            url: rooturl+'/delete',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache
        }).
        success(function(response) {
            console.log("success");
            $scope.codeStatus = response.data;
            console.log($scope.codeStatus);
        }).
        error(function(response){
            console.log("error");
            $scope.codeStatus = response || "Request failed";
            console.log($scope.codeStatus);
        });
        $scope.list();
        return false;


    };

    $scope.add = function () {

        var ipData = {
            ipaddr: $scope.ipaddr,
        };

        /// check to see if fields are null & fix 
        if ($scope.hostname == null) {
            $scope.hostname = ""
        };
        if ($scope.subnet == null) {
            $scope.subnet = ""
        };
        if ($scope.vlan == null) {
            $scope.vlan = ""
        };
        if ($scope.vp != "virtual") {
            $scope.vp = "physical"
        };
        if ($scope.virthost == null) {
            $scope.virthost = ""
        };
        if ($scope.location == null) {
            $scope.location = ""
        };
        if ($scope.login == null) {
            $scope.login = ""
        };
        if ($scope.services == null) {
            $scope.services = ""
        };
        if ($scope.user == null) {
            $scope.user = ""
        };
        if ($scope.reserved == null) {
            $scope.reserved = "false"
        };

        var iplookup = 'mydata='+JSON.stringify(ipData);

        console.log(iplookup);

        $http({
            method: 'POST',
            url: rooturl+'/lookup',
            data: iplookup,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            cache: $templateCache,
        }).
        then( function(res) {

            console.log(res.data);
            if (res.data[0].response==="1") {

                alert("IP address exists!\nPlease choose another.");
            }
            else {

                date = new Date().toJSON().slice(0,10);
                time = new Date().toJSON().slice(11,19);
                datetime = date + " " + time

                console.log("ip doesn't exist, do write to db function");
                var formData = {
                    ipaddr: $scope.ipaddr,
                    hostname: $scope.hostname,
                    subnet: $scope.subnet,
                    vlan: $scope.vlan,
                    vp: $scope.vp,
                    virthost: $scope.virthost,
                    location: $scope.location,
                    login: $scope.login,
                    services: $scope.services,
                    user: $scope.user,
                    reserved: $scope.reserved,
                    alive: '',
                    added: datetime,
                    health: $scope.health,
                    ping: '0',
                    pingfail: '0',
                    lastscan: '',
                    tidyflag: 'false',
                    lastalive: datetime
                    };

                var jdata = 'mydata=' + JSON.stringify(formData);

                $http({
                    method: 'POST',
                    url: rooturl+'/add',
                    data: jdata,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    cache: $templateCache,
                }).
                success(function(response) {
                    console.log("success");
                    $scope.codeStatus = response.data;
                    console.log($scope.codeStatus);
                }).
                error(function(response){
                    console.log("error");
                    $scope.codeStatus = response || "Request failed";
                    console.log($scope.codeStatus);
                });

                $scope.ipaddr = '';
                $scope.hostname = '';
                $scope.subnet = '';
                $scope.vlan = '';
                $scope.vp = '';
                $scope.virthost = '';
                $scope.services = '';
                $scope.user = '';
                $scope.location = '';
                $scope.login = '';
                $scope.reserved = false;  
                        
            };

        });

    $timeout(function() {$scope.list()}, 500);

    };

app.filter('unique', function() {
    return function(input, key) {
        var unique = {};
        var uniqueList = [];
        for(var i = 0; i < input.length; i++){
            if (typeof unique[input[i][key]] == "undefined"){
                unique[input[i][key]] = "";
                uniqueList.push(input[i]);
            }
        }
        return uniqueList;

    };

});


// ============= ON LOAD FUNCTION CALLS ======//

    $scope.list();
    $scope.hide = true;
    $scope.viewhide = true;
    

}]);
