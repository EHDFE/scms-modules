/**
 * <directive>
 * @description 日期插件
 * @date 2017-12-06
 * @author 黄国标
 * @lastBy
 * @html <input class="form-control input-date" date-picker-directive ng-model='ngModel' min-date="minDate" max-date="maxDate" max-date-value="maxDateValue" min-date-value="minDateValue">
 */
import angular from "angular";
import moment from "moment";
import isInteger from "lodash/isInteger";
import datePanel from "./datePanel";
import tpl from "./datePickerRangeTpl.html";
import "./datePickerRangeTpl.css";
import html from "./datePickerRange.html";
import "./datePickerRange.css";
// import { preventBlur } from './utils';

import Defautls from "./defaults";

let DOMS = {},
  domIndex = 0,
  isBindChangeComponent = false,
  timeoutValues = {},
  fnDocumentMousedown;
let preventBlur;

export default (app, elem, attrs, scope) => {
  datePanel(app, elem, attrs, scope);
  app.directive("datePickerRange", [
    "$rootScope",
    "$document",
    "$compile",
    "G",
    function($rootScope, $document, $compile, G) {
      return {
        require: "?ngModel",
        template: tpl,
        replace: true,
        scope: {
          minDate: "=", // @scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: "=", // @scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: "=", // @scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: "=", // @scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initStartDate: "=", // @scope initDateStart 初始日期,它的值为距今天的天数 {type:"number"}
          initEndDate: "=", // @scope initDateEnd 初始日期,它的值为距今天的天数 {type:"number"}
          //dateRangeResultData: '=',
          startDateRange: "=", // 开始时间
          endDateRange: "=", // 结束时间
          ngDisabled: "=",
          eventChange: "&" //当时间范围发生改变时，会触发时方式
        },
        controller: [
          "$scope",
          "$element",
          "$attrs",
          "$timeout",
          function($scope, $element, $attrs, $timeout) {
            if (!isBindChangeComponent) {
              $rootScope.$on("$changeComponent", function() {
                let key;
                //console.log('44444 DOMS=', DOMS)
                if (fnDocumentMousedown) {
                  $document.unbind("mousedown", fnDocumentMousedown);
                }

                for (key in DOMS) {
                  DOMS[key].unbind();
                  DOMS[key].remove();
                  delete DOMS[key];
                }
                for (key in timeoutValues) {
                  if (timeoutValues[key]) {
                    $timeout.cancel(timeoutValues[key]);
                    timeoutValues[key] = null;
                    delete timeoutValues[key];
                  }
                }
              });

              preventBlur = function(elem, func) {
                elem.bind("focus", function() {
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
                elem.bind("blur", function() {
                  $document.unbind("mousedown", fnDocumentMousedown);
                });
              };
            }
            isBindChangeComponent = true;
            $scope.isHideClose = $attrs.isHideClose;

            const panel = $element.find(".date-picker-range");
            panel.css("display", "none");

            const $inputDateRange = $element.find(".input-date-range");
            const $input = $element.find("input");
            DOMS["" + domIndex++] = $input;
            DOMS["" + domIndex++] = $inputDateRange;
            DOMS["" + domIndex++] = $element;
            DOMS["" + domIndex++] = panel;

            //console.log("datePickerRange come in panel=", panel);
            //$scope.useSeconds = !!$attrs.useSeconds;
            //$scope.minViewMode = $attrs.minViewMode;
            //$scope.pickTime = !!$attrs.pickTime;
            $scope.formatDate = $attrs.formatDate || Defautls.format;
            $scope.startPlaceholder =
              $attrs.startPlaceholder || Defautls.lang.start;
            $scope.endPlaceholder = $attrs.endPlaceholder || Defautls.lang.end;

            /*
             * 设置外部scope的值,触发外部scope事件
             * start 开始时间值 如，'2018-03-02'
             * end 结束时间值
             * isFetch 是否需要触发外部scope事件
             */
            let setOutValue = function(start, end, isFetch) {
              $scope.startDateRange = start;
              $scope.endDateRange = end;
              if ($scope.eventChange && isFetch) {
                const timeoutValue2 = $timeout(function() {
                  $scope.eventChange();
                });
                timeoutValues["a3"] = timeoutValue2;
              }
            };

            /*
             * 处理初始数据、面板数据
             * isInit 值为：true 时是否是初始时执行，初始时需要处理设置的默认时间initStartDate、initEndDate
             * isInit 值为：false 时，处理面板数据。
             * $scope.dateRangeData 范围数据，用于在面板中选中范围
             * $scope.startDate 范围数据，用于在面板中显示第一个面板在此时间的月份
             * $scope.endDate 范围数据，用于在面板中显示第二个面板在此时间的月份
             */
            function initDate(isInit) {
              if (
                isInit &&
                isInteger($scope.initStartDate) &&
                isInteger($scope.initEndDate)
              ) {
                if (!$scope.startDateRange && !$scope.endDateRange) {
                  $scope.endDate = moment()
                    .add($scope.initEndDate, "d")
                    .format($scope.formatDate);
                  $scope.startDate = moment()
                    .add($scope.initStartDate, "d")
                    .format($scope.formatDate);
                  $scope.startValue = $scope.startDate;
                  $scope.endValue = $scope.endDate;
                  setOutValue($scope.startValue, $scope.endValue);
                }
              }
              if (isInit) {
                return;
              }
              if ($scope.startDateRange && $scope.endDateRange) {
                if (
                  $scope.startDateRange.substr(0, 7) ===
                  $scope.endDateRange.substr(0, 7)
                ) {
                  $scope.startDate = $scope.startDateRange;
                  $scope.endDate = moment($scope.startDate)
                    .add(1, "month")
                    .format($scope.formatDate);
                  $scope.startValue = $scope.startDate;
                  $scope.endValue = $scope.endDateRange;
                } else {
                  $scope.startDate = $scope.startDateRange;
                  $scope.endDate = $scope.endDateRange;
                  $scope.startValue = $scope.startDate;
                  $scope.endValue = $scope.endDate;
                }
                $scope.dateRangeData = {
                  start: moment($scope.startValue),
                  end: moment($scope.endValue)
                };
              } else {
                if (!$scope.dateRangeData || !$scope.dateRangeData.start) {
                  $scope.startDate = moment().format($scope.formatDate);
                  $scope.endDate = moment()
                    .add(1, "month")
                    .format($scope.formatDate);
                }
              }
            }

            initDate(true);

            var datepickers = {};
            //
            var setTitleStatus = function() {
              if (!datepickers["part1"] || !datepickers["part2"]) {
                return;
              }
              if (
                datepickers["part1"].dateData.year >=
                  datepickers["part2"].dateData.year ||
                (datepickers["part1"].dateData.year + 1 ===
                  datepickers["part2"].dateData.year &&
                  datepickers["part1"].dateData.month >=
                    datepickers["part2"].dateData.month)
              ) {
                datepickers["part1"].isHideYearRight = true;
                datepickers["part2"].isHideYearLeft = true;
              } else {
                datepickers["part1"].isHideYearRight = false;
                datepickers["part2"].isHideYearLeft = false;
              }
              if (
                datepickers["part1"].dateData.year >
                  datepickers["part2"].dateData.year ||
                (datepickers["part1"].dateData.year ===
                  datepickers["part2"].dateData.year &&
                  datepickers["part1"].dateData.month + 1 >=
                    datepickers["part2"].dateData.month)
              ) {
                datepickers["part1"].isHideMonthRight = true;
                datepickers["part2"].isHideMonthLeft = true;
              } else {
                datepickers["part1"].isHideMonthRight = false;
                datepickers["part2"].isHideMonthLeft = false;
              }

              angular.forEach(datepickers["part1"].monthView, function(item) {
                if (
                  item.year === datepickers["part2"].dateData.year &&
                  item.data >= datepickers["part2"].dateData.month
                ) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              });

              angular.forEach(datepickers["part2"].monthView, function(item) {
                if (
                  item.year === datepickers["part1"].dateData.year &&
                  item.data <= datepickers["part1"].dateData.month
                ) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              });

              angular.forEach(datepickers["part1"].yearView, function(item) {
                if (item.data > datepickers["part2"].dateData.year) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              });

              angular.forEach(datepickers["part2"].yearView, function(item) {
                if (item.data < datepickers["part1"].dateData.year) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              });
            };

            /*
             * 当面板中触发了“点击日期”事件，设置值。
             */

            $scope.onPickEvent = function(type, date, datePicker, $panelAttrs) {
              switch (type) {
                case "init":
                  datepickers[$panelAttrs.name] = datePicker;
                  datepickers[$panelAttrs.name].setTitleStatus = setTitleStatus;
                  break;
                case "date":
                  var dateRangeData = datePicker.dateRangeData;
                  $scope.startValue =
                    dateRangeData.start.format($scope.formatDate) || "";
                  $scope.endValue =
                    dateRangeData.end.format($scope.formatDate) || "";
                  $scope.endDate =
                    dateRangeData.start.format($scope.formatDate) || "";
                  $scope.startDate =
                    dateRangeData.end.format($scope.formatDate) || "";
                  break;
                case "month":
                  datePicker.setMonth(date);
                  break;
              }
            };

            /*
             * 点“确认”提交选中的时间范围
             */
            $scope.pick = () => {
              setOutValue($scope.startValue, $scope.endValue, true);
              $inputDateRange.trigger("blur");
            };

            /*
             * 显示面板，根据已有时间范围显示面板
             */
            function showPanel(e) {
              e.stopPropagation();
              let pos = e.target.getBoundingClientRect(),
                elPos = $(e.target).offset(),
                offset = {},
                tipWidth = panel.outerWidth(),
                tipHeight = panel.outerHeight(),
                elWidth = pos.width || pos.right - pos.left,
                elHeight = pos.height || pos.bottom - pos.top,
                tipOffset = 1,
                scrollWidth = $("body")[0].scrollWidth,
                scrollHeight = $("body")[0].scrollHeight;
              if (
                scrollHeight < elPos.top + elHeight + tipHeight + tipOffset &&
                e.target.offsetTop > tipHeight
              ) {
                offset.top =
                  elPos.top - (tipHeight - elHeight) - elHeight - tipOffset;
              } else {
                offset.top = elPos.top + elHeight + tipOffset;
              }
              if (scrollWidth > elPos.left + tipWidth) {
                offset.left = elPos.left;
              } else {
                offset.left = elPos.left - (tipWidth - elWidth);
              }
              panel.css("display", "inline-block");
              panel.offset(offset);
              initDate();
              const timeoutValue3 = $timeout(() => {
                $scope.$broadcast("init");
              });
              timeoutValues["a1"] = timeoutValue3;
            }
            $input.on("focus", () => {
              if ($scope.ngDisabled) {
                return;
              }
              $inputDateRange.focus();
            });
            $inputDateRange.on("focus", e => {
              //console.log("datePickerRange input focus", $scope.ngDisabled);
              if ($scope.ngDisabled) {
                return;
              }
              showPanel(e);
            });

            /*
             * 隐藏面板
             */
            preventBlur($inputDateRange, function(target) {
              if ($.contains($element[0], target)) {
                return true;
              }
              if (
                $element[0] === target ||
                $.contains($element[0], target) ||
                $.contains(panel[0], target)
              ) {
                return true;
              }
              $inputDateRange.trigger("blur");
              return false;
            });

            $scope.$on("datePickerRefresh", (e, data) => {
              $scope.$broadcast("refreshDate", data);
            });

            $inputDateRange.bind("blur", () => {
              panel.css("display", "none");
            });

            /*
             * 点关闭图标时，删除已选中的时间范围
             */
            $scope.clearDate = () => {
              $scope.startValue = "";
              $scope.endValue = "";
              $scope.startDate = "";
              $scope.endDate = "";
              $scope.dateRangeData = {
                start: "",
                end: ""
              };
              setOutValue($scope.startValue, $scope.endValue, true);
              const timeoutValue1 = $timeout(() => {
                $scope.$broadcast("refreshDate");
              });
              timeoutValues["a2"] = timeoutValue1;
            };
          }
        ],
        link($scope, $element, $attrs, ngModel) {}
        //
      };
    }
  ]);
};
