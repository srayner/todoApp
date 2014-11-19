// public/core.js
var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all tasks and show them
    $http.get('/api/tasks')
    .success(function(data) {
        $scope.tasks = data;
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });

    // post new task to server
    $scope.createTask = function() {
        $http.post('/api/tasks', $scope.formData)
        .success(function(data) {
            $scope.formData = {}; // clear the form
            $scope.tasks = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    // display task for editing
    $scope.displayTask = function(task){
        $scope.formData = task;
    };
    
    // save changes
    $scope.saveTask = function(){
        if ($scope.formData._id) {
            $scope.editTask($scope.formData._id);
        } else {
            $scope.createTask();
        }
    };
    // post changes to server
    $scope.editTask = function(id){
        $http.put('api/tasks/' + id, $scope.formData)
        .success(function(data) {
            $scope.formData = {}; // clear the form
            $scope.tasks = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
    
    // delete a task after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/tasks/' + id)
        .success(function(data) {
            $scope.tasks = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
}