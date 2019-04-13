/**
 * <directive>
 * @description 日期插件
 * @date 2017-12-06
 * @author 黄国标
 * @lastBy
 * @html <input class="form-control input-date" date-picker-directive ng-model='ngModel' min-date="minDate" max-date="maxDate" max-date-value="maxDateValue" min-date-value="minDateValue">
 */
import angular from 'angular';
import throttle from 'lodash/throttle';
import moment from 'moment';
import html from './datePanel.html';
import './datePanel.less';
import DatePicker from './DatePickerClass';
import Defaults from './defaults';

let directiveEls = [];
export default (app, elem, attrs, scope) => {
  app.directive('datePanel', [
    '$rootScope',
    '$timeout',
    function ($rootScope, $timeout) {
      $rootScope.$on("$changeComponent", function() {
        directiveEls.map($el => {
          $el.unbind();
          $el.remove();
        })
        directiveEls = [];
      });
      return {
        // require: '?ngModel',
        template: html,
        scope: {
          date: '=', // @scope ngModel 选择的日期 {type:"string", exampleValue:"2016-12-01",isDisabled:1}
          minDate: '=', // @scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: '=', // @scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: '=', // @scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: '=', // @scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initDate: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          useSeconds: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          minViewMode: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          pickTime: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          formatDate: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          leftRange: '=',
          rightRange: '=',
          useSeconds: '=',
          dateRangeData: '=',
          watchDate: '=',
          tmpDate: '=',
          weekPickerData: '=',
          onPickEvent: '='
        },
        controller: [
          '$scope',
          '$element',
          '$attrs',
          '$timeout',
          function ($scope, $element, $attrs, $timeout) {},
        ],
        link($scope, $element, $attrs, ngModel) {
          directiveEls.push($element);
          const formatDate = $scope.formatDate || Defaults.format;
          // @attrs initDate 初始日期字段,它的值为距今天的天数;当值为"null"时,input显示空值, {type:"string", defaultValue: 0}
          $scope.dateRange = $attrs.dateRange;
          $scope.weekPick = $attrs.weekPick;
          $scope.timePick = $attrs.timePick;
          let initDate = $scope.initDate;
          let newDate;
          if (initDate && initDate !== 'null') {
            initDate = initDate * 24 * 60 * 60 * 1000;
            newDate = +new Date() + initDate;
            newDate = new Date(newDate);
          } else if ($scope.date) {
            newDate = $scope.date;
          }
          $scope.$watch('useSeconds', (newVal) => {
            if (newVal === 'false') {
              $scope.showSeconds = false;
              $element.find('.time-picker').width(100);
            } else {
              $scope.showSeconds = true;
              $element.find('.time-picker').width(150);
            }
          });
          const timepickTotalHeight = 170;
          const timepickItemHeight = 30;
          const datePicker = new DatePicker({
            dateRange: $scope.dateRange,
            dateRangeData: $scope.dateRangeData || {},
            $attrs,
            weekPick: $scope.weekPick,
            weekPickerData: $scope.weekPickerData || {},
            timePick: $scope.timePick,
          });
          $scope.datePicker = datePicker;
          $scope.$watch('formatDate', (newVal) => {
            datePicker.formatDate = newVal;
          });

          try{
            $timeout(function() {
              $scope.onPickEvent('init', null, datePicker, $attrs);
            })
          }catch(e) {}

          if ($attrs.dateRange) {
            $scope.dateRangeData = $scope.datePicker.dateRangeData;
          }
          if ($attrs.weekPick) {
            $scope.weekPickerData = $scope.datePicker.weekPickerData;
          }

          $scope.$watch('minViewMode', (newVal, oldVal) => {
            $scope.datePicker.minViewMode = newVal;
            if (newVal === 'months') {
              datePicker.showPanel = 'month';
            }
          });

          $scope.$watch('minDate', (newValue, oldValue) => {
            if (!newValue) {
              return;
            }
            const initTime = '00:00:00';
            if (newValue.length > 11) {
              newValue += initTime.slice(newValue.length - 11);
            }
            datePicker.setMinDate(newValue);
            datePicker.init(datePicker.getResult());
          });
          $scope.$watch('maxDate', (newValue, oldValue) => {
            if (!newValue) {
              return;
            }
            const initTime = '23:59:59';
            if (newValue.length > 11) {
              newValue += initTime.slice(newValue.length - 11);
            }
            datePicker.setMaxDate(newValue);
            datePicker.init(datePicker.getResult());
          });
          $scope.$watch('minDateValue', (newValue, oldValue) => {
            if (!newValue) {
              return;
            }
            datePicker.setMinDate(getDate($scope.minDateValue));
            datePicker.init(datePicker.getResult());
          });
          $scope.$watch('maxDateValue', (newValue, oldValue) => {
            if (!newValue) {
              return;
            }
            datePicker.setMaxDate(getDate($scope.maxDateValue));
            datePicker.init(datePicker.getResult());
          });

          function getDate(date) {
            date = parseInt(date, 10);
            if (typeof date === 'number') {
              date = date * 24 * 60 * 60 * 1000;
              const newDateA = +new Date() + date;
              return new Date(newDateA);
            } else if (date) {
              return date;
            }
          }

          $scope.pickEvent = function(col) {
            datePicker.setDate(col);
            try{
              $scope.onPickEvent('date', col, datePicker, $attrs);//$scope.dateRangeData
            }
            catch(e) {}
          }

          $scope.pickMonthEvent = function(currmonth) {
            try{
              if($scope.onPickEvent) {
                $scope.onPickEvent('month', currmonth, datePicker, $attrs);
              }
              else{
                datePicker.setMonth(currmonth);
              }
            }
            catch(e) {
              datePicker.setMonth(currmonth);
            }
            
          }

          $scope.hoverMonth = function(currmonth) {
            try{
              $scope.onPickEvent('hoverMonth', currmonth, datePicker, $attrs);
            }
            catch(e) {}
          };

          $scope.hover = throttle((col) => {
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
              $scope.$emit('datePickerRefresh', datePicker.tmpDate);
            }
          }, 100);


          $scope.mouseleave = () => {
            if ($scope.dateRange) {
              $timeout(() => {
                datePicker.tmpDate = null;
                $scope.$emit('datePickerRefresh');
              });
            }
          };
          datePicker.init(newDate);

          if ((initDate !== 'null' && initDate) || initDate === 0) {
            $timeout(() => {
              $scope.date = datePicker.getResult();
            });
          } else {
            //$scope.date = '';
          }

          /**
           * 在选择时间范围时，重新渲染时间面板
           */
          $scope.$on('refreshDate', (e, data) => {
            datePicker.tmpDate = data;
            datePicker.setDateView(datePicker.getResult());
          });

          /**
           * 判断是否显示日期面板 上一年下一年上一月下一月的箭头
          
          function showArrow() {
            if ($attrs.part === 'left' && $scope.watchDate) {
              if (
                moment($scope.date)
                  .add(1, 'month')
                  .year() === moment($scope.watchDate).year() &&
                moment($scope.date)
                  .add(1, 'month')
                  .month() === moment($scope.watchDate).month()
              ) {
                $scope.hideMonthRight = true;
              } else {
                $scope.hideMonthRight = false;
              }
              if (
                moment($scope.date)
                  .add(1, 'year')
                  .valueOf() > moment($scope.watchDate).valueOf()
              ) {
                $scope.hideYearRight = true;
              } else {
                $scope.hideYearRight = false;
              }
            }
            if ($attrs.part === 'right' && $scope.watchDate) {
              if (
                moment($scope.date).year() ===
                  moment($scope.watchDate)
                    .add(1, 'month')
                    .year() &&
                moment($scope.date).month() ===
                  moment($scope.watchDate)
                    .add(1, 'month')
                    .month()
              ) {
                $scope.hideMonthLeft = true;
              } else {
                $scope.hideMonthLeft = false;
              }
              if (
                moment($scope.date).valueOf() <
                moment($scope.watchDate)
                  .add(1, 'year')
                  .valueOf()
              ) {
                $scope.hideYearLeft = true;
              } else {
                $scope.hideYearLeft = false;
              }
            }
          }*/


          //$scope.$watch('watchDate', (newVal) => {
            //if ($scope.dateRange) {
              //showArrow();
            //}
          //});
          $scope.$watch(
            'datePicker.dateData',
            (newVal) => {
              if ($scope.dateRange) {
                $scope.date = datePicker.getResult();
                //showArrow();
              }
            },
            true,
          );

          $scope.$watch('date', function(newvalue) {
            datePicker.setDateView(datePicker.getResult());
          })

          $scope.$watch('dateRangeData', (newVal) => {
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
          $scope.$watch(
            'datePicker.weekPickerData',
            (newVal) => {
              if (newVal && $scope.weekPick) {
                if (
                  $scope.weekPickerData.start &&
                  $scope.weekPickerData.start.valueOf() ===
                    $scope.datePicker.weekPickerData &&
                  $scope.datePicker.weekPickerData.start.valueOf() &&
                  $scope.weekPickerData.end &&
                  $scope.weekPickerData.end.valueOf() ===
                    $scope.datePicker.weekPickerData.end &&
                  $scope.datePicker.weekPickerData.end.valueOf()
                ) {
                  return;
                }
                $scope.weekPickerData = newVal;
              }
            },
            true,
          );

          $scope.$watch('weekPickerData', (newVal) => {
            if (newVal && $scope.weekPick) {
              if (
                $scope.weekPickerData.start &&
                $scope.weekPickerData.start.valueOf() ===
                  $scope.datePicker.weekPickerData &&
                $scope.datePicker.weekPickerData.start.valueOf() &&
                $scope.weekPickerData.end &&
                $scope.weekPickerData.end.valueOf() ===
                  $scope.datePicker.weekPickerData.end &&
                $scope.datePicker.weekPickerData.end.valueOf()
              ) {
                return;
              }
              datePicker.weekPickerData = newVal;
            }
          }, true);

          $scope.$watch('datePicker.refresh', (newVal, oldVal) => {
            if (newVal && newVal !== oldVal) {
              $scope.$emit('datePickerRefresh');
            }
          });
          $scope.$on('init', () => {
            $timeout(() => {
              let newDate;
              if ($scope.date) {
                newDate = $scope.date;
              } else if (initDate && initDate !== 'null') {
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
          $scope.$on('selectTime', () => {
            $timeout(() => {
              $scope.date = datePicker.getResult();
            }, 500);
          });


          /**
           * 时间选择相关 函数
           */
          $scope.setHour = (hour, $index) => {
            datePicker.setHour(hour);
            if (!hour.disabled) {
              $timeout(() => {
                locateTime();
              }, 500);
            }
          };

          $scope.setMinute = (minute, $index) => {
            datePicker.setMinute(minute);
            if (!minute.disabled) {
              $timeout(() => {
                let minElm = $element.find('.time-wrap').eq(1),
                  secElm = $element.find('.time-wrap').eq(2);
                minElm.scrollTop(Number(minElm.find('.active').text() * timepickItemHeight));
                secElm.scrollTop(Number(secElm.find('.active').text() * timepickItemHeight));
              });
            }
          };

          $scope.setSecond = (second, $index) => {
            datePicker.setSecond(second);
            if (!second.disabled) {
              $timeout(() => {
                const secElm = $element.find('.time-wrap').eq(2);
                secElm.scrollTop(Number(secElm.find('.active').text() * timepickItemHeight));
              });
            }
          };

          $element.delegate('.time-area', 'mouseleave', (e) => {
            $(e.currentTarget)
              .find('.time-wrap')
              .scrollTop(Math.round($(e.currentTarget)
                .find('.time-wrap')
                .scrollTop() / timepickItemHeight) * timepickItemHeight);
          });

          $element.delegate('.time-wrap', 'scroll', (e) => {
            $(e.currentTarget)
              .parents('.time-area')
              .find('.scroll-bar-thumb')
              .css(
                'transform',
                `translateY(${e.currentTarget.scrollTop / timepickTotalHeight * 100}%)`,
              );
          });
          $element.delegate('.time-wrap', 'scroll', throttle((e) => {
            const index = Math.floor((e.currentTarget.scrollTop + 15) / timepickItemHeight);
            if ($(e.currentTarget).find('.time-zone li').eq(index).data('disabled')) {
              let scrollTop = $(e.currentTarget).scrollTop(),
                firstIndex = $(e.currentTarget).find('.first').data('index'),
                lastIndex = $(e.currentTarget).find('.last').data('index');
              if (firstIndex && (firstIndex * timepickItemHeight > scrollTop)) {
                $(e.currentTarget).scrollTop(firstIndex * timepickItemHeight);
              } else if (lastIndex && (lastIndex * timepickItemHeight < scrollTop)) {
                $(e.currentTarget).scrollTop(lastIndex * timepickItemHeight);
              }
              return;
            }
            $timeout(() => {
              const func = $(e.currentTarget).data('func');
              datePicker[func]({
                value: $(e.currentTarget).find('.time-zone li').eq(index).data('value'),
              });
              $timeout(() => {
                switch (func) {
                  case 'setHour': {
                    let minElm = $element.find('.time-wrap').eq(1),
                      secElm = $element.find('.time-wrap').eq(2);
                    minElm.scrollTop(Number(minElm.find('.active').text() * timepickItemHeight));
                    secElm.scrollTop(Number(secElm.find('.active').text() * timepickItemHeight));
                    break;
                  }
                  case 'setMinute': {
                    const secElm = $element.find('.time-wrap').eq(2);
                    secElm.scrollTop(Number(secElm.find('.active').text() * timepickItemHeight));
                    break;
                  }
                  default: {
                  }
                }
              });
            });
          }, 250));
          $timeout(() => {
            locateTime();
          });

          /**
           * 调整时间刻盘位置
          */
          function locateTime() {
            $element.find('.time-wrap').each(function (i, elem) {
              $(this).scrollTop(Number($(this).find('.active').text() * timepickItemHeight));
            });
          }
        },
      };
    },
  ]);
};
