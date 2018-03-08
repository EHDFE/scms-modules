/**
 *
 * @description 左则栏
 * @date 2016-12-20
 * @author 田艳容
 * @lastBy
 * @html
 */
export default (app, elem, attrs, scope) => {
  app.directive('switchDirective', [
    '$rootScope',
    function($rootScope) {
      return {
        template:
          '<label class="switch" ng-class="{\'switch-open\': isChecked, \'disabled\': isDisabled}"" ng-click="setChecked();"></label>',
        restrict: 'EA',
        replace: true,
        scope: {
          isDisabled: '=',
          isChecked: '=',
        },
        link: function postLink($scope, $element, $attrs) {},

        controller: function($scope, $element, $attrs) {
          $scope.setChecked = function() {
            if ($scope.isDisabled) {
              return;
            }
            $scope.isChecked = !$scope.isChecked;
          };
        },
      };
    },
  ]);
};
