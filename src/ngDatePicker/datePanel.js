/**
 * <directive>
 * @description 日期插件
 * @date 2017-12-06
 * @author 黄国标
 * @lastBy
 * @html <input class="form-control input-date" date-picker-directive ng-model='ngModel' min-date="minDate" max-date="maxDate" max-date-value="maxDateValue" min-date-value="minDateValue">
 */
import angular from "angular";
import html from "./datePanel.html";
import "./datePanel.css";
import moment from "moment";
import DatePicker from './DatePickerClass';


export default (app, elem, attrs, scope) => {
  app.directive("datePanel", [
    "G",
    "$rootScope",
    "$timeout",
    function(G, $rootScope, $timeout) {
      return {
        // require: '?ngModel',
        template: html,
        scope: {
          date: "=", //@scope ngModel 选择的日期 {type:"string", exampleValue:"2016-12-01",isDisabled:1}
          minDate: "=", //@scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: "=", //@scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: "=", //@scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: "=", //@scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initDate: "=", //@scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          useSeconds: "=", //@scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          minViewMode: "=", //@scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          pickTime: "=", //@scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          formatDate: "=", //@scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          leftRange: "=",
          rightRange: "=",
          dateRangeData: "=",
          watchDate: "=",
        },
        controller: [
          "$scope",
          "$element",
          "$attrs",
          "$timeout",
          function($scope, $element, $attrs, $timeout) {},
        ],
        link: function($scope, $element, $attrs, ngModel) {
          var formatDate = $scope.formatDate || "YYYY-MM-DD";
          //@attrs initDate 初始日期字段,它的值为距今天的天数;当值为"null"时,input显示空值, {type:"string", defaultValue: 0}
          $scope.dateRange = $attrs.dateRange;
          var initDate = $scope.initDate;
          var newDate;
          if (initDate && initDate !== "null") {
            initDate = initDate * 24 * 60 * 60 * 1000;
            newDate = +new Date() + initDate;
            newDate = new Date(newDate);
          } else if ($scope.date) {
            newDate = $scope.date;
          }

          // $scope.useSeconds = !!$attrs.useSeconds;
          // $scope.minViewMode = $attrs.minViewMode;
          // $scope.pickTime = !!$attrs.pickTime;
          const datePicker = new DatePicker({
            dateRange: $scope.dateRange,
          });
          $scope.datePicker = datePicker;

          $scope.datePicker.minViewMode = $attrs.minViewMode;
          $scope.$watch("minViewMode", (newVal, oldVal) => {
            if (newVal === "months") {
              datePicker.showPanel = "month";
            }
          });

          function setCanChooseYear() {
            if ($scope.minDateArr.year && $scope.minDateArr.month) {
              $scope.canChoosePrevYear =
                moment([
                  $scope.minDateArr.year,
                  $scope.minDateArr.month - 1,
                ]).valueOf() < moment([$scope.dateData.year, 0]).valueOf();
            } else {
              $scope.canChoosePrevYear = true;
            }
            if ($scope.maxDateArr.year && $scope.maxDateArr.month) {
              $scope.canChooseNextYear =
                moment([
                  $scope.maxDateArr.year,
                  $scope.maxDateArr.month - 1,
                ]).valueOf() > moment([$scope.dateData.year, 11]).valueOf();
            } else {
              $scope.canChooseNextYear = true;
            }
          }




          $scope.$watch("minDate", function(newValue, oldValue) {
            if (!newValue) {
              return;
            }
            var initTime = "00:00:00";
            if (newValue.length > 11) {
              newValue = newValue + initTime.slice(newValue.length - 11);
            }
            datePicker.setMinDate(newValue);
            datePicker.init(getResult());
          });
          $scope.$watch("maxDate", function(newValue, oldValue) {
            if (!newValue) {
              return;
            }
            var initTime = "23:59:59";
            if (newValue.length > 11) {
              newValue = newValue + initTime.slice(newValue.length - 11);
            }
            datePicker.setMaxDate(newValue);
            datePicker.init(getResult());
          });
          $scope.$watch("minDateValue", function(newValue, oldValue) {
            if (!newValue) {
              return;
            }
            datePicker.setMinDate(getDate($scope.minDateValue));
            datePicker.init(getResult());
          });
          $scope.$watch("maxDateValue", function(newValue, oldValue) {
            if (!newValue) {
              return;
            }
            datePicker.setMaxDate(getDate($scope.maxDateValue));
            datePicker.init(getResult());
          });

          function getDate(date) {
            date = parseInt(date, 10);
            if ("number" === typeof date) {
              date = date * 24 * 60 * 60 * 1000;
              var newDateA = +new Date() + date;
              return new Date(newDateA);
            } else if (date) {
              return date;
            }
          }


          $scope.hover = col => {
            if (
              $scope.dateRange &&
              $scope.dateRangeData.start &&
              !$scope.dateRangeData.end
            ) {
              if (
                datePicker.tmpDate &&
                datePicker.tmpDate.valueOf() === col.data.valueOf()
              ) {
                return;
              }
              datePicker.tmpDate = col.data;
              $scope.$emit("refresh", datePicker.tmpDate);
            }
          };
          $scope.mouseleave = () => {
            if ($scope.dateRange) {
              $timeout(() => {
                datePicker.tmpDate = null;
                $scope.$emit("refresh");
              });
            }
          };
          datePicker.init(newDate);

          if ((initDate !== "null" && initDate) || initDate === 0) {
            $timeout(() => {
              $scope.date = datePicker.getResult();
            });
          } else {
            $scope.date = "";
          }

          $scope.$on("refreshDate", (e, data) => {
            datePicker.tmpDate = data;
            datePicker.setDateView(getResult());
          });

          function showArrow() {
            if ($attrs.part === "left" && $scope.watchDate) {
              if (
                moment($scope.date)
                  .add(1, "month")
                  .year() === moment($scope.watchDate).year() &&
                moment($scope.date)
                  .add(1, "month")
                  .month() === moment($scope.watchDate).month()
              ) {
                $scope.hideMonthRight = true;
              } else {
                $scope.hideMonthRight = false;
              }
              if (
                moment($scope.date)
                  .add(1, "year")
                  .valueOf() > moment($scope.watchDate).valueOf()
              ) {
                $scope.hideYearRight = true;
              } else {
                $scope.hideYearRight = false;
              }
            }
            if ($attrs.part === "right" && $scope.watchDate) {
              if (
                moment($scope.date).year() ===
                  moment($scope.watchDate)
                    .add(1, "month")
                    .year() &&
                moment($scope.date).month() ===
                  moment($scope.watchDate)
                    .add(1, "month")
                    .month()
              ) {
                $scope.hideMonthLeft = true;
              } else {
                $scope.hideMonthLeft = false;
              }
              if (
                moment($scope.date).valueOf() <
                moment($scope.watchDate)
                  .add(1, "year")
                  .valueOf()
              ) {
                $scope.hideYearLeft = true;
              } else {
                $scope.hideYearLeft = false;
              }
            }
          }

          $scope.$watch("watchDate", newVal => {
            if ($scope.dateRange) {
              showArrow();
            }
          });
          $scope.$watch("dateData", newVal => {
              if ($scope.dateRange) {
                $scope.date = getResult();
                showArrow();
              }
            }, true);

          // $scope.$watch("date", newVal => {
          //   // console.log(newVal, $attrs.name, '@#$%^&*')
          // });

          $scope.$on("init", function() {
            $timeout(() => {
              var newDate;
              if ($scope.date) {
                newDate = $scope.date;
              } else if (initDate && initDate !== "null") {
                initDate = initDate * 24 * 60 * 60 * 1000;
                newDate = +new Date() + initDate;
                newDate = new Date(newDate);
              }
              datePicker.init(newDate);
            });
          });
          $scope.$on("selectTime", function() {
            $timeout(() => {
              $scope.date = datePicker.getResult();
            }, 500);
          });
        },
      };
    },
  ]);
};

