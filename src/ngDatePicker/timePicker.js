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
import html from "./timePicker.html";
import "./timePicker.css";
import tpl from './timePickerTpl.html';
import './timePickerTpl.css';
import moment from "moment";

export default (app, elem, attrs, scope) => {
  datePanel(app, elem, attrs, scope);
  app.directive("timePicker", [
    "G",
    "$rootScope",
    "$document",
    "$compile",
    function(G, $rootScope, $document, $compile) {
      return {
        require: "?ngModel",
        scope: {
          ngModel: "=", //@scope ngModel 选择的日期 {type:"string", exampleValue:"2016-12-01",isDisabled:1}
          initDate: "=", //@scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          minTime: '=',
          maxTime: '=',
        },
        template: tpl,
        replace: true,
        controller: [
          "$scope",
          "$element",
          "$attrs",
          "$timeout",
          function($scope, $element, $attrs, $timeout) {
            $scope.formatDate = $attrs.formatDate;
            $scope.placeholder = $attrs.placeholder;
            $scope.useSeconds = $attrs.useSeconds;
            var panel = $compile(html)($scope);
            $document.find("#container").append(panel);
            panel.css('display', 'none');
            $scope.pick = function(data) {
              $scope.$broadcast("selectTime");
              $element.find('.form-control').trigger("blur");
            };

            $element.find('.form-control').bind("focus", function(e) {
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

            preventBlur($element.find('.form-control'), function(target) {
              if ($element[0] === target ||($.contains($element[0], target))|| ($.contains(panel[0], target))) {
                return true;
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

            $element.find('.form-control').bind("blur", function() {
              $timeout(() => {
                panel.css("display", "none");
              }, 250);
            });

            $scope.$on("$destroy", function() {
              $document.find(".date-picker").remove();
            });
            $scope.clearDate = ($event) => {
              $scope.ngModel = '';
            }
          },
        ],
        link: function($scope, $element, $attrs, ngModel) {},
        //
      };
    },
  ]);
};

