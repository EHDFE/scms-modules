/**
 * <directive>
 * @description 颜色选择器
 * @date 2018-04-16
 * @author 程乐
 * @lastBy
 * @html <div color-picker-directive init-color="initColor"></div>
 */
import 'bootstrap-colorpicker';
import html from './colorPicker.html';

export default (app, elem, attrs, scope) => {
  app.directive('colorPickerDirective', [
    '$http',
    '$timeout',
    function ($http, $timeout) {
      return {
        template: html,
        restrict: 'EA',
        scope: {
            initColor: '=', 
            colorValue: '='
        },
        controller($scope, $element, $attrs) {
          $scope.init = function(){
            $scope.colorValue = $scope.initColor||'';
            $element.colorpicker({color:$scope.initColor});
          }
          $scope.init();
          $scope.$watch('initColor',function(newValue,oldValue){
            if(newValue!==oldValue){
              $scope.init();
            }
          });

        },

        link($scope, $element, $attrs, ngModel) {},
      };
    },
  ]);
};
