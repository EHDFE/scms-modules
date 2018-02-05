/**
 * <directive>
 * @description 图片上传
 * @date 2018-02-02
 * @author 程乐
 * @lastBy 
 * @html 
 */
define([
    'angular',
    './imageUpload.html'
    ], function(
        angular,
        html,
        css) {
        return function(app, elem, attrs, scope) {
            app.directive('imageUpload', ['$timeout', '$document', '$compile',function($timeout, $document, $compile) {
                return {
                    template: html,
                    restrict: 'EA',
                    replace: true,
                    scope: {
                    },
                    link: function postLink() {

                    },
                    controller: function($scope,$element,$attrs,$transclude,$log,$http,G){

                    }
                };
            }]);
    };
});