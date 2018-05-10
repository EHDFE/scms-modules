/**
 * <directive>
 * @description 带限制的textarea
 * @date 2018-02-27
 * @author lhf
 * @lastBy 
 * @html <div textarea-limit >
 */
define([
    'angular',
    './textareaLimit.html',
    './textareaLimit.css'
    ], function(
        angular,
        html,
        css) {
        return function(app, elem, attrs, scope) {
            app.directive('textareaLimitDirective', ['$timeout', 
                function($timeout) {
                    return {
                        template: html,
                        restrict: 'EA',
                        replace: true,
                        scope: {
                            maxLength : '=',//@scope maxLength 限制字长 {type: "number", "exampleValue": "200"}
                            rows: '@',//@scope rows 显示几行文字 {type: "number", exampleValue: "1"}
                        },
                        link: function postLink() {

                        },

                        controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                            $scope.currLength = 0;
                            console.log($scope.maxLength,8888);

                            $scope.keupFun = function(event){
                                var length = $(event.currentTarget).val().length;
                                $scope.currLength = length;
                                console.log($(event.currentTarget).val(),7777,$(event.currentTarget).val().length);
                            }
                            
                        }
                    };
                }]);
    };
});