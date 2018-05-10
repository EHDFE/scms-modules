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
          
          $scope.colorValue = $scope.initColor||'';
          $element.colorpicker({color:$scope.initColor});

          $scope.$watch('initColor',function(newValue,oldValue){
            if(newValue!==oldValue){
              $element.colorpicker('setValue', $scope.initColor);
            }
          });

        },

        link($scope, $element, $attrs, ngModel) {},
      };
    },
  ]);
};
