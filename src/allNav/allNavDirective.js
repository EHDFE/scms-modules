define(['angular', './allNav.css', './allNav.html'], function(
  angular,
  css,
  html
) {
  return function(app, elem, attrs, scope) {
    app.directive('allNavDirective', [
      'navsData',
      function(navsData) {
        return {
          template: html,
          restrict: 'EA',
          replace: true,
          scope: {
            inShow: '=',
          },
          link: function postLink($scope, $element, $attrs) {},

          controller: function($scope, $element, $attrs, $cookies, $timeout) {
            navsData.promise.then(d => {
                $scope.navs = d.data;
            });
            $scope.hide = function(href) {
              if (href) {
                $scope.inShow = false;
              }
            };
          },
        };
      },
    ]);
  };
});
