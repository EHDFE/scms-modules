export default (app, elem, attrs, scope) => {
  app.directive('loadingDirective', [
    'G',
    function (G) {
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          listData: '=',
          currentPage: '=',
          isLoading: '=',
        },
        controller($scope, $element, $attrs) {},
        link($scope, $element, $attrs, ngModel) {},
      };
    },
  ]);
};
