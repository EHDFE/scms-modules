/**
 * <directive>
 * @description 日期插件
 * @date 2017-12-06
 * @author 黄国标
 * @lastBy
 * @html <input class="form-control input-date" date-picker-directive ng-model='ngModel' min-date="minDate" max-date="maxDate" max-date-value="maxDateValue" min-date-value="minDateValue">
 */

import angular from "angular";
import datePanel from "./datePanel";
import html from "./datePicker.html";
import "./datePicker.css";
import moment from "moment";

export default (app, elem, attrs, scope) => {
  datePanel(app, elem, attrs, scope);
  app.directive("datePicker", [
    "G",
    "$rootScope",
    "$document",
    "$compile",
    function(G, $rootScope, $document, $compile) {
      return {
        require: "?ngModel",
        scope: {
          ngModel: "=", //@scope ngModel 选择的日期 {type:"string", exampleValue:"2016-12-01",isDisabled:1}
          minDate: "=", //@scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: "=", //@scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: "=", //@scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: "=", //@scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initDate: "=", //@scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
        },
        controller: [
          "$scope",
          "$element",
          "$attrs",
          "$timeout",
          function($scope, $element, $attrs, $timeout) {
            var panel = $compile(html)($scope);
            $scope.useSeconds = !!$attrs.useSeconds;
            $scope.minViewMode = $attrs.minViewMode;
            $scope.pickTime = !!$attrs.pickTime;
            $scope.formatDate = $attrs.formatDate;
            $document.find("body").append(panel);
            $scope.pick = function(data) {
              $scope.$broadcast("selectTime");
              $element.trigger("blur");
            };

            $element.bind("focus", function(e) {
              e.stopPropagation();
              var pos = e.target.getBoundingClientRect(),
                offset = panel.offset(),
                tipHeight = panel.outerHeight(),
                tipWidth = panel.outerWidth(),
                elWidth = pos.width || pos.right - pos.left,
                elHeight = pos.height || pos.bottom - pos.top,
                tipOffset = 0,
                scrollWidth = $("body")[0].scrollWidth;
              offset.top = pos.top + elHeight + tipOffset;
              offset.left = pos.left;
              panel.css("display", "inline-block");
              panel.offset(offset);
              $scope.$broadcast("init");
            });

            preventBlur($element, function(target) {
              if ($scope.minViewMode === "months") {
                if (
                  $element[0] === target ||
                  ($.contains(panel[0], target) && !$(target).hasClass("month"))
                ) {
                  return true;
                }
                if ($(target).hasClass("month")) {
                  $scope.pick();
                }
              } else {
                if (
                  $element[0] === target ||
                  ($.contains(panel[0], target) &&
                    !(
                      $(target)
                        .parent()
                        .hasClass("day") || $(target).hasClass("day")
                    ))
                ) {
                  return true;
                }
                if (
                  $(target)
                    .parent()
                    .hasClass("day") ||
                  $(target).hasClass("day")
                ) {
                  $scope.pick();
                }
              }
              return false;
            });
            function preventBlur(elem, func) {
              var fnDocumentMousedown;
              angular.element(elem).bind("focus", function() {
                $document.bind(
                  "mousedown",
                  (fnDocumentMousedown = function(event) {
                    if (func(event.target)) {
                      event.target.setAttribute("unselectable", "on");
                      event.preventDefault();
                    } else if (event.target != elem) {
                      $document.unbind("mousedown", fnDocumentMousedown);
                    }
                  })
                );
              });
              angular.element(elem).bind("blur", function() {
                $document.unbind("mousedown", fnDocumentMousedown);
              });
            }

            $element.bind("blur", function() {
              $timeout(() => {
                panel.css("display", "none");
              }, 250);
            });

            $scope.$on("$destroy", function() {
              $document.find(".date-picker").remove();
            });
          },
        ],
        link: function($scope, $element, $attrs, ngModel) {},
        //
      };
    },
  ]);
};

