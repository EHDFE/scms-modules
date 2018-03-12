import html from './crumb.html';

export default (app, elem, attrs, scope) => {
  app.directive('crumbDirective', [
    function () {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
          crumbsData: '=',
        },
        link($scope, $element, $attrs) {},

        controller(
          $scope,
          $element,
          $attrs,
          $cookies,
          $timeout,
          $sce,
          $compile,
        ) {
          $scope.$watch('crumbsData', (newValue, ole) => {
            $scope.crumbs = newValue;
          });
        },
      };
    },
  ]);
};
