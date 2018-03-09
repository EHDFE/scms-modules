/**
 * <directive>
 * @description 信息提示
 * @date 2018-1-23
 * @author 田艳容
 * @lastBy
 * @html <div ng-html-container html-data="{{htmlData}}"></div>
 */
export default (app, elem, attrs, scope) => {
  app.directive('ngHtmlContainer', [
    '$compile',
    function ($compile) {
      return {
        template: '<div></div>',
        restrict: 'EA',
        replace: true,
        scope: {
          htmlData: '@', // @scope htmlData 文本内容 {type: "string", "exampleValue": "<button class='btn btn-success'></button>"}
        },
        link($scope, $element, $attrs) {
          const html = $scope.htmlData;
          $element.html(html);
          $compile($element.contents())($scope);
          if (!scope.$$phase) {
            scope.$apply();
          }
        },

        controller(
          $scope,
          $element,
          $attrs,
          $transclude,
          $log,
          $http,
          G,
        ) {},
      };
    },
  ]);
};
