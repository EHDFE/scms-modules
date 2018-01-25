/**
 * <directive>
 * @description 多选框
 * @date 2017-1-6
 * @author 田艳容
 * @lastBy 
 * @html <div multiselect-directive check-items="checkItems" items="items" placeholder="请选择您绑定的城市"></div>
 */
define([
    'angular',
    './multiselect.css'
], function(
    angular
    ) {
    return function(app, elem, attrs, scope) {
        app.directive('multiselectDirective', ['$timeout',function($timeout) {
            return {
                template: '<div class="multiselectDirective" role="group"><div class="form-control" data-toggle="dropdown" role="button" aria-expanded="false"><span class="placeholder" ng-if="!checkItems||checkItems.length<1">{{placeholder}}</span><span class="label label-default" ng-repeat="item in checkItems track by $index">{{item.name}}<i class="fa fa-close" ng-mousedown="remove(item);"></i></span><input type="text"><i class="fa fa-angle-down"></i></div><ul class="dropdown-menu"><li ng-repeat="item in items"><a href="javascript:void(0);" ng-click="doCheck(item)"><i class="fa fa-square-o" ng-show="!item.isChecked"></i><i ng-show="item.isChecked" class="fa fa-check-square-o"></i>{{item.name}}</a></li></ul></div>',
                scope: true,
                replace: true,
                restrict: 'A',
                scope: {
                    checkItems:'=',    //@scope checkItems 选中的选项 {type: "object"}
                    items: '=',    //@scope items 所以选项 {type: "object", "exampleValue": [{name:'北京'},{name:'上海'}, {name: '杭州'}, {name: 'A杭州'},{name: 'B杭州'},{name: 'C杭州'},{name: 'D杭州'},{name: 'E杭州'}], defaultValue: []}
                },
                link: function postLink($scope,$element,$attrs) {
                    $scope.items = $scope.items || [];
                    $scope.checkItems = $scope.checkItems || [];
                    $scope.placeholder = $attrs.placeholder || '';

                    var getCheckItems = function() {
                        $scope.checkItems = [];
                        angular.forEach($scope.items, function(currItem) {
                            if(currItem.isChecked) {
                                $scope.checkItems.push(currItem);
                            }
                        });
                        if($scope.checkItems.length) {
                            $scope.placeholder = '';
                        }
                        $element.find('input').focus();
                    };

                    function lightCheckItems(){
                        angular.forEach($scope.items, function(item) {
                            angular.forEach($scope.checkItems, function(checkItem) {
                                if(checkItem.isChecked&&item.name===checkItem.name) {
                                    item.isChecked = true;
                                }
                            });
                        });
                    }
                    lightCheckItems();

                    $element.delegate('.fa-close', 'click', function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                    });
                    $element.delegate('.dropdown-menu li a', 'click', function(event) {
                        event.stopPropagation();
                        event.preventDefault();
                    });
                    $element.delegate('.form-control', 'click', function(event) {
                        $timeout(function() {
                            $element.find('input').focus();
                        });
                    });
                    $element.delegate('input', 'focus', function(event) {
                        $timeout(function() {
                            $scope.placeholder = '';
                        });
                    });
                    $element.delegate('input', 'blur', function(event) {
                        if(!$scope.checkItems.length) {
                            $timeout(function() {
                                $scope.placeholder = $attrs.placeholder || '';
                            });                            
                        }
                    })
                    $element.delegate('input', 'keyup', function(event) {
                        if(event.keyCode === 8 && $scope.checkItems[0]) {
                            $timeout(function() {
                                 angular.forEach($scope.items, function(currItem) {
                                    if($scope.checkItems[$scope.checkItems.length - 1].name === currItem.name) {
                                        currItem.isChecked = false;
                                    }
                                });
                                getCheckItems();
                            });
                        }                        
                    });

                    $scope.doCheck = function(item) {
                        item.isChecked = !item.isChecked;
                        getCheckItems()
                    };

                    $scope.remove = function(item) {
                        angular.forEach($scope.items, function(currItem) {
                            if(item.name === currItem.name) {
                                currItem.isChecked = false;
                            }
                        })
                        getCheckItems();
                        return false;
                    }
                },

                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                }
            };
        }]);
    };
});