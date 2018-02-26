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
import DatePicker from "./DatePickerClass";
import { throttle } from './tool'; 

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
          tmpDate: "=",
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

          // // $scope.useSeconds = !!$attrs.useSeconds;
          // // $scope.minViewMode = $attrs.minViewMode;
          // $scope.pickTime = !!$attrs.pickTime;
          const datePicker = new DatePicker({
            dateRange: $scope.dateRange,
            dateRangeData: $scope.dateRangeData || {},
            $attrs: $attrs,
          });
          $scope.datePicker = datePicker;
          $scope.$watch('formatDate', (newVal) =>  {
            datePicker.formatDate = newVal;            
          });

          if ($attrs.dateRange) {
            $scope.dateRangeData = $scope.datePicker.dateRangeData;
          }

          $scope.datePicker.minViewMode = $attrs.minViewMode;
          $scope.$watch("minViewMode", (newVal, oldVal) => {
            if (newVal === "months") {
              datePicker.showPanel = "month";
            }
          });

          $scope.$watch("minDate", function(newValue, oldValue) {
            if (!newValue) {
              return;
            }
            var initTime = "00:00:00";
            if (newValue.length > 11) {
              newValue = newValue + initTime.slice(newValue.length - 11);
            }
            datePicker.setMinDate(newValue);
            datePicker.init(datePicker.getResult());
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
            datePicker.init(datePicker.getResult());
          });
          $scope.$watch("minDateValue", function(newValue, oldValue) {
            if (!newValue) {
              return;
            }
            datePicker.setMinDate(getDate($scope.minDateValue));
            datePicker.init(datePicker.getResult());
          });
          $scope.$watch("maxDateValue", function(newValue, oldValue) {
            if (!newValue) {
              return;
            }
            datePicker.setMaxDate(getDate($scope.maxDateValue));
            datePicker.init(datePicker.getResult());
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
            datePicker.setDateView(datePicker.getResult());
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
          $scope.$watch(
            "datePicker.dateData",
            newVal => {
              if ($scope.dateRange) {
                $scope.date = datePicker.getResult();
                showArrow();
              }
            },
            true
          );

          $scope.$watch(
            "datePicker.dateRangeData",
            newVal => {
              if (newVal) {
                if ($scope.dateRange) {
                  if (
                    $scope.dateRangeData.start &&
                    $scope.dateRangeData.start.valueOf() ===
                      $scope.datePicker.dateRangeData &&
                    $scope.datePicker.dateRangeData.start.valueOf() &&
                    $scope.dateRangeData.end &&
                    $scope.dateRangeData.end.valueOf() ===
                      $scope.datePicker.dateRangeData.end &&
                    $scope.datePicker.dateRangeData.end.valueOf()
                  ) {
                    return;
                  }
                  $scope.dateRangeData = newVal;
                }
              }
            },
            true
          );

          $scope.$watch("dateRangeData", newVal => {
            if (newVal && $scope.dateRange) {
              if (
                $scope.dateRangeData.start &&
                $scope.dateRangeData.start.valueOf() ===
                  $scope.datePicker.dateRangeData &&
                $scope.datePicker.dateRangeData.start.valueOf() &&
                $scope.dateRangeData.end &&
                $scope.dateRangeData.end.valueOf() ===
                  $scope.datePicker.dateRangeData.end &&
                $scope.datePicker.dateRangeData.end.valueOf()
              ) {
                return;
              }
              datePicker.dateRangeData = newVal;
            }
          });

          $scope.$watch("datePicker.refresh", (newVal, oldVal) => {
            if (newVal && newVal !== oldVal) {
              $scope.$emit("refresh");
            }
          });
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
              $timeout(() => {
                locateTime();
              });
            });
          });
          $scope.$on("selectTime", function() {
            $timeout(() => {
              $scope.date = datePicker.getResult();
            }, 500);
          });

          $scope.setHour = (hour, $index) => {
            datePicker.setHour(hour);
            if (!hour.disabled) {
              $timeout(() => {
                locateTime();
              }, 500);
            }
          }

          $scope.setMinute = (minute, $index) => {
            datePicker.setMinute(minute);
            if (!minute.disabled) {
              $timeout(() => {
                let minElm = $element.find('.time-wrap').eq(1),
                    secElm = $element.find('.time-wrap').eq(2);
                minElm.scrollTop(Number(minElm.find('.active').text()*30));
                secElm.scrollTop(Number(secElm.find('.active').text()*30));
              });
            }
          }
 
          $scope.setSecond = (second, $index) => {
            datePicker.setSecond(second);
            if (!second.disabled) {
              $timeout(() => {
                let secElm = $element.find('.time-wrap').eq(2);
                secElm.scrollTop(Number(secElm.find('.active').text()*30)); 
              });
            }
          }

          $element.find(".time-area").bind("mouseleave", e => {
            $(e.currentTarget)
              .find(".time-wrap")
              .scrollTop(
                Math.round(
                  $(e.currentTarget)
                    .find(".time-wrap")
                    .scrollTop() / 30
                ) * 30
              );
          });

          $element.find(".time-wrap").bind('scroll', e => {
            $(e.currentTarget)
            .parents(".time-area")
            .find(".scroll-bar-thumb")
            .css(
              "transform",
              `translateY(${e.currentTarget.scrollTop / 220 * 100}%)`
            );
          });
          $element.find(".time-wrap").bind("scroll", throttle(e => {
            let index = Math.floor((e.currentTarget.scrollTop + 15) / 30);
            if($(e.currentTarget).find(".time-zone li").eq(index).data('disabled')) {
              let scrollTop = $(e.currentTarget).scrollTop(),
                  firstIndex = $(e.currentTarget).find('.first').data('index'),
                  lastIndex = $(e.currentTarget).find('.last').data('index');
              if (firstIndex&&(firstIndex*30>scrollTop)) {
                $(e.currentTarget).scrollTop(firstIndex*30);
              } else if (lastIndex&&(lastIndex*30< scrollTop )) {
                $(e.currentTarget).scrollTop(lastIndex*30);
              }
              return;
            }
            $timeout(() => {
              let func = $(e.currentTarget).data("func");
              datePicker[func]({
                value: $(e.currentTarget).find(".time-zone li").eq(index).data("value"),
              });
              $timeout(() => {                
                switch(func) {
                  case 'setHour': {
                    let minElm = $element.find('.time-wrap').eq(1),
                      secElm = $element.find('.time-wrap').eq(2);
                    minElm.scrollTop(Number(minElm.find('.active').text()*30));
                    secElm.scrollTop(Number(secElm.find('.active').text()*30));
                    break;
                  }
                  case 'setMinute': {
                    let secElm = $element.find('.time-wrap').eq(2);
                    secElm.scrollTop(Number(secElm.find('.active').text()*30)); 
                    break;
                  }
                  default: {
                  }
                }
              })
            })
          }, 250));
          $timeout(() => {
            locateTime();
          })
          function locateTime() {
            $element.find(".time-wrap").each(function(i, elem){
              $(this).scrollTop(Number($(this).find('.active').text()*30));
            });
          }
        },
      };
    },
  ]);
};
