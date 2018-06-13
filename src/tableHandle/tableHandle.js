import html from "./tableHandle.html";
import "./table-handle.less";

export default (app, elem, attrs, scope) => {
  app.directive("tableHandleDirective", [
    "$cookies",
    "$http",
    "allRouterData",
    "$rootScope",
    "$state",
    "$timeout",
    function($cookies, $http, allRouterData, $rootScope, $state, $timeout) {
      return {
        template: html,
        scope: {
          side: '=', // left(默认),right'
        },
        restrict: "EA",
        transclude: true,
        link: function($scope, $element, $attr) {
          let _childlist = $element.find(".table-handle-childlist");
          let _moreBtnsUl = $element.find(".more-btns-ul");
          let _more = $element.find(".more");
          let _moreBtnsDiv = $element.find(".more-btns-div");

          let side = $scope.side || 'left';

          _moreBtnsDiv.addClass(side);

          // 将按钮移到更新列表中
          let moveTimeout = setTimeout(() => {
            let hideBtns = _childlist.children("[fold][fold!=false]");
            if (hideBtns && hideBtns.length) {
              for (let i = 0; i < hideBtns.length; i++) {
                let li = $("<li></li>");
                li.append(hideBtns[i]);
                _moreBtnsUl.append(li);
              }
              _more.show();
            } else {
              _more.hide();
            }
            window.clearTimeout(moveTimeout);
          }, 1);
        },
        controller: function($scope, $element, $attrs) {
        }
      };
    }
  ]);
};
