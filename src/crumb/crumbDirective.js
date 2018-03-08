import html from './crumb.html';
export default (app, elem, attrs, scope) => {
  app.directive('crumbDirective', [
    function() {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
          crumbsData: '=',
        },
        link: function($scope, $element, $attrs) {},

        controller: function(
          $scope,
          $element,
          $attrs,
          $cookies,
          $timeout,
          $sce,
          $compile
        ) {
          $scope.$watch('crumbsData', function(newValue, ole) {
            $scope.crumbs = newValue;
          });
        },
      };
    },
  ]);
};
