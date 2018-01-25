/**
 * <directive>
 * @description 信息提示
 * @date 2018-1-23
 * @author 田艳容
 * @lastBy 
 * @html <div ng-html-container html-data="{{htmlData}}"></div>
 */
define([
    'angular'
], function(
    angular
    ) {
    return function(app, elem, attrs, scope) {
        app.directive('ngHtmlContainer', ['$compile',function($compile) {
            return {
                template: '<div></div>',
                restrict: 'EA',
                replace: true,
                scope: {
                    htmlData:'@',    //@scope htmlData 文本内容 {type: "string", "exampleValue": "<button class='btn btn-success'></button>"}
                },
                link: function($scope,$element,$attrs) {
                    var html = $scope.htmlData;
                    $element.html(html);
                    $compile($element.contents())($scope);
                },

                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                }
            };
        }]);
    };
});