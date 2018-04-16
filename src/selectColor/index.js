/**
 * <directive>
 * @description 颜色选择器
 * @date 2018-04-16
 * @author 程乐
 * @lastBy
 * @html <div select-color-directive init-color="initColor"></div>
 */
import html from './selectColor.html';

export default (app, elem, attrs, scope) => {
  app.directive('selectColorDirective', [
    '$http',
    '$timeout',
    function ($http, $timeout) {
      return {
        template: html,
        restrict: 'EA',
        scope: {
            initColor: '=', //  当前选中的颜色 {type: "string", exampleValue: "", defaultValue: ""}
        },
        controller($scope, $element, $attrs) {
            $element.colorpicker({color:$scope.initColor});
        },

        link($scope, $element, $attrs, ngModel) {},
      };
    },
  ]);
};
