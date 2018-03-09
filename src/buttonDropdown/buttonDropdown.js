/**
 *
 * @description 按钮下拉
 * @date 2018-1-20
 * @author 田艳容
 * @lastBy
 * @html
 */
import html from './buttonDropdown.html';

export default function (app, elem, attrs, scope) {
  app.directive('buttonDropdown', ['$rootScope', function ($rootScope) {
    return {
      template: html,
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {
        dropData: '=', // dropData
        checkedItem: '=',
        onChange: '@',
      },
      link($scope, $element, $attrs) {
        console.log($scope.dropData);
      },

      controller($scope, $element, $attrs) {
        if (!$scope.checkedItem) {
          $scope.checkedItem = $scope.dropData[0];
        }
        $scope.checked = function (item) {
          $scope.checkedItem = item;
        };
      },
    };
  }]);
}
