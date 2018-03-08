export default (app, elem, attrs, scope) => {
  app.directive('loadingDirective', [
    'G',
    function(G) {
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          listData: '=',
          currentPage: '=',
          isLoading: '=',
        },
        controller: function($scope, $element, $attrs) {},
        link: function($scope, $element, $attrs, ngModel) {},
      };
    },
  ]);
};
