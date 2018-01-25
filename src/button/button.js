/**
 * <directive>
 * @name Button 按钮
 * @description 按钮
 * @date 2017-11-27
 * @author 田艳容
 * @lastBy 
 * @html <button class-type="{{classType}}" is-loading="isLoading" aaa-ba="aaaBa()">按钮</button>
 */
define([
    'angular',
    './button.css'
], function(
    angular
    ) {
    return function(app, elem, attrs, scope) {
        app.directive('button', ['$timeout', function($timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    //@scope isLoading 是否显示等待动画 {type: "boolean", scopeType: "=", parentScopeValue:false}
                    isLoading: '=',
                    //@scope classType 类型 {type: "string", scopeType: "@", parentScopeValue:'submit'}
                    classType: '@',
                    //@scope aaaBa 类型 {type: "function", scopeType: "&", parentScopeValue:"function(){alert(1)}"}
                    aaaBa: '&'
                },
                link: function($scope,$element,$attrs) {
                    $element.append('<i class="fa fa-spinner"></i>');
                    
                    var type = $scope.classType;
                    var types = {
                        'submit': 'btn btn-success',
                        'search': 'btn btn-info'
                    };
                    if(type) {
                        $element.attr('class', types[type]);
                    }
                    
                    $scope.$watch("isLoading", function(newValue, oldValue) {
                        if($scope.isLoading) {
                            $element.addClass('ant-btn-loading');
                        }
                        else {
                            $element.removeClass('ant-btn-loading');
                        }
                    });

                    $element.bind('click', function() {
                        $scope.aaaBa();
                        $element.addClass('ant-btn-clicked');
                        $timeout(function() {
                            $element.removeClass('ant-btn-clicked');
                        }, 500)
                    });
                },

                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                }
            };
        }]);
    };
});