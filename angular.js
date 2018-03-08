//angularJS
var app = angular.module('myapp', ['ngMaterial','ngAnimate','storageService','ui.toggle']);

//autocomplete
app.controller("autocompleteController", function($http, $scope){
  this.querySearch = function(query){
    return $http.get("http://cs-server.usc.edu:37394/hw8_backend/index.php", {params: {input: query}})
    .then(function(response){
      return response.data.auto;
    })
  };

  $scope.clear = function(){
    $scope.myForm.myName.$setUntouched();
    $scope.ctrl.searchText = null;       
  };

});

//favorite table 
app.controller('MainCtrl', ['$scope', 'getLocalStorage','$http', '$interval', function ($scope, getLocalStorage, $http, $interval) {

    //disable the order select when the sort type is default
    $scope.disabled = true;

    //Read the Company List from LocalStorage  
    $scope.companies = getLocalStorage.getCompanies();  

    //Count the Company List  
    $scope.count = $scope.companies.length;

    //default sort 
    $scope.orderByField = '';
    $scope.reverseSort = false;

    //Add Company - using AngularJS push to add Company in the Company Object  
    //Call Update Company to update the locally stored Company List  
    //Reset the AngularJS Company scope  
    //Update the Count  
    $scope.addCompany = function () {

        if (!inFavList) {

            $scope.companies.push({ 'symbol': symbol, 'lastPrice':lastPrice, 'lastPriceN': parseFloat(lastPrice), 'change': parseFloat(change), 'changePercent': changePercent, 'changePercentN': parseFloat(changePercent), 'volume': volume, 'volumeN':parseFloat(volumeN) });  
            getLocalStorage.updateCompanies($scope.companies);   
            $scope.count = $scope.companies.length;

        } else {

            //delete the company
            for(var i = 0; i < $scope.count; i++) {

                if($scope.companies[i]['symbol'] == symbol) {

                    $scope.companies.splice(i, 1); 
                    getLocalStorage.updateCompanies($scope.companies);  
                    $scope.count = $scope.companies.length;
                    break;

                }

            }

        }

    };  

    //Delete Company - Using AngularJS splice to remove the emp row from the Company list  
    //All the Update Company to update the locally stored Company List  
    //Update the Count  
    $scope.deleteCompany = function (emp) {  
        $scope.companies.splice($scope.companies.indexOf(emp), 1); 
        getLocalStorage.updateCompanies($scope.companies);  
        $scope.count = $scope.companies.length;  
    };

    //refresh the favorite list table
    $scope.refresh = function(){

        $scope.companies.forEach(function(company) {
            $http({
                method:"GET",
                url: 'http://cs-server.usc.edu:37394/hw8_backend/index.php', 
                params: {stock_symbolTable: company['symbol']}
            }).then( function(response) {

                //console.log(company['symbol']);
                company['lastPrice'] = response.data['Last Price'];
                company['lastPriceN'] = parseFloat(response.data['Last Price']);
                company['change'] = parseFloat(response.data['Change']);
                company['changePercent'] = response.data['Change Percent'];
                company['changePercentN'] = parseFloat(response.data['Change Percent']);
                company['volume'] = response.data['Volume'];
                company['volumeN'] = parseFloat(response.data['VolumeN']);
                getLocalStorage.updateCompanies($scope.companies);

            },function myError(error) {
                console.log(error);
            });
        });

        
        $scope.count = $scope.companies.length; 

    };

    //auto refresh the favorite list
    $scope.autoRefresh = function(){
        // console.log($scope.autoRef);

        $interval(function(){
            if($scope.autoRef){
                $scope.refresh();
                console.log("auto refresh");
            }
        }, 5000);

    };

    //selecte sort
    $scope.switchSort1 = function(){
        var sortKey = $scope.selected1;
        
        switch (sortKey){
            case 'symbol':
            $scope.orderByField = 'symbol';
            $scope.reverseSort = false;
            $scope.disabled = false;
            break;
            case 'price':
            $scope.orderByField = 'lastPriceN';
            $scope.reverseSort = false;
            $scope.disabled = false;
            break;
            case 'change':
            $scope.orderByField = 'change';
            $scope.reverseSort = false;
            $scope.disabled = false;
            break;
            case 'changePercent':
            $scope.orderByField = 'changePercentN';
            $scope.reverseSort = false;
            $scope.disabled = false;
            break;
            case 'volume':
            $scope.orderByField = 'volumeN';
            $scope.reverseSort = false;
            $scope.disabled = false;
            break;
            default:
            $scope.orderByField = '';
            $scope.reverseSort = false;
            $scope.disabled = true;
        }

    };

    //selecte order
    $scope.switchSort2 = function(){
        var sortKey = $scope.selected2;
        switch (sortKey){
            case 'des':
            $scope.reverseSort = true;
            break;
            default:
            $scope.reverseSort = false;
        }

    };

}]);  

//Create the Storage Service Module  
//Create getLocalStorage service to access UpdateCompanies and getCompanies method  
var storageService = angular.module('storageService', []);  
storageService.factory('getLocalStorage', function () {  
    var companyList = {};  
    return {  
        list: companyList,  
        updateCompanies: function (CompaniesArr) {  
            if (window.localStorage && CompaniesArr) {  
                //Local Storage to add Data  
                localStorage.setItem("companies", angular.toJson(CompaniesArr));  
            }  
            companyList = CompaniesArr;  

        },  
        getCompanies: function () {  
            //Get data from Local Storage  
            companyList = angular.fromJson(localStorage.getItem("companies"));  
            return companyList ? companyList : [];  
        }  
    };  

});