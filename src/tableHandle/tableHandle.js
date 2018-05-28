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
          morePosition: "=" // 可选值: TopLeft, Top, TopRight, BottomLeft, Bottom, BottomRight
        },
        restrict: "EA",
        transclude: true,
        link: function($scope, $element, $attr) {
          let childlist = $element.find(".table-handle-childlist");
          let moreBtnsUl = $element.find(".more-btns-ul");
          let more = $element.find(".more");
          let moreBtns = $element.find(".more-btns");
          let arrow = $element.find(".arrow");

          // 将按钮移到更新列表中
          function moveToMoreList() {
            let hideBtns = childlist.children("[fold][fold!=false]");
            if (hideBtns && hideBtns.length) {
              for (let i = 0; i < hideBtns.length; i++) {
                let li = $("<li></li>");
                li.append(hideBtns[i]);
                moreBtnsUl.append(li);
              }
              more.show();
            } else {
              more.hide();
            }
          }

          function setMorePosition() {
            moreBtns.css({ left: "auto", right: "auto", top: "auto", bottom: "auto", transform: "unset" });
            arrow.css({ left: "auto", right: "auto", top: "auto", bottom: "auto", transform: "unset" });
            switch ($scope.morePosition) {
              case "TopLeft":
                moreBtns.css({ right: "0px", bottom: "20px" });
                arrow.css({ right: "5px", bottom: "-6px", transform: "rotateZ(225deg)" });
                break;
              case "Top":
                moreBtns.css({ left: "50%", bottom: "20px", transform: "translateX(-50%)" });
                arrow.css({ left: "50%", bottom: "-6px", transform: "translateX(-50%) rotateZ(225deg)" });
                break;
              case "TopRight":
                moreBtns.css({ left: "0px", bottom: "20px" });
                arrow.css({ left: "5px", bottom: "-6px", transform: "rotateZ(225deg)" });
                break;

              case "BottomLeft":
                moreBtns.css({ right: "0px", top: "20px" });
                arrow.css({ right: "5px", top: "-6px", transform: "rotateZ(45deg)" });
                break;

              case "BottomRight":
                moreBtns.css({ left: "0px", top: "20px" });
                arrow.css({ left: "5px", top: "-6px", transform: "rotateZ(45deg)" });
                break;
              case "Bottom":
              default:
                moreBtns.css({ left: "50%", top: "20px", transform: "translateX(-50%)" });
                arrow.css({ left: "50%", top: "-6px", transform: "translateX(-50%) rotateZ(45deg)" });
                break;
            }
          }

          setMorePosition();

          setTimeout(() => {
            moveToMoreList();
          }, 1);

          $scope.showMore = () => {
            $scope.isMoreShown = true;
          };

          let askHideMoreTimeout = null;

          $scope.hideMore = () => {
            $scope.isMoreShown = false;
          };

          $scope.askNotHideMore = () => {
            if (askHideMoreTimeout) {
              clearTimeout(askHideMoreTimeout);
            }
          };

          $scope.askHideMore = () => {
            askHideMoreTimeout = setTimeout(() => {
              $timeout(() => {
                $scope.hideMore();
              });
            }, 300);
          };
        },
        controller: function($scope, $element, $attrs) {
          // console.log("controller");
        }
      };
    }
  ]);
};
