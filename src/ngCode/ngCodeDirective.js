export default (app, elem, attrs, scope) => {
  app.directive('ngCodeDirective', [
    '$compile',
    function($compile) {
      return {
        template: '<div ng-transclude></div>',
        restrict: 'EA',
        scope: true,
        transclude: true,
        link: function($scope, $element, $attrs) {
          //$compile($element.contents())($scope);
        },

        controller: function($scope, $element, $attrs) {},
      };
    },
  ]);
};
