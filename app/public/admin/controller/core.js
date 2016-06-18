(function(){
  console.log('in core js');
  var socialcops = angular.module('socialcops',[]);

  socialcops.controller('mainController',function($scope,$http){
    $scope.formData = {};

      $http.get('/api/select')
          .success(function(data){
            $scope.userdata = data;
            console.log('in get_users : user = ',data);
          })
          .error(function(err){
            console.log('Error in getting users:'+err);
          });



    $scope.createUser = function(){
      $http.post('/api/insert',$scope.formData)
          .success(function(data){
            $scope.formData = {};
            $scope.users = data;
            console.log(data);
          })
          .error(function(err){
            console.log('Error in createUser fn:'+err);
          });
    };
  });

})();
