/**
 * <directive>
 * @description 日期插件
 * @date 2017-12-06
 * @author 黄国标
 * @lastBy
 * @html <input class="form-control input-date" date-picker-directive ng-model='ngModel' min-date="minDate" max-date="maxDate" max-date-value="maxDateValue" min-date-value="minDateValue">
 */

import angular from 'angular';
import moment from 'moment';
import datePanel from './datePanel';
import html from './weekPicker.html';
import './weekPicker.css';
import tpl from './weekPickerTpl.html';
import './weekPickerTpl.css';
import Defaults from './defaults';
import { preventBlur } from './utils';

export default (app, elem, attrs, scope) => {
  datePanel(app, elem, attrs, scope);
  app.directive('weekPicker', [
    '$rootScope',
    '$document',
    '$compile',
    function ($rootScope, $document, $compile) {
      return {
        require: '?ngModel',
        scope: {
          ngModel: '=', // @scope ngModel 选择的日期 {type:"string", exampleValue:"2016-12-01",isDisabled:1}
          minDate: '=', // @scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: '=', // @scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: '=', // @scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: '=', // @scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initWeek: '=', // @scope initWeek 初始周,它的值为距这周的周数 {type:"number"}
          weekData: '=',
          ngDisabled: '=',
          eventChange: '&'
        },
        template: tpl,
        replace: true,
        controller: [
          '$scope',
          '$element',
          '$attrs',
          '$timeout',
          function ($scope, $element, $attrs, $timeout) {
            $scope.formatDate = $attrs.formatDate || Defaults.format;
            $scope.startPlaceholder = $attrs.startPlaceholder || Defaults.lang.start;
            $scope.endPlaceholder = $attrs.endPlaceholder || Defaults.lang.end;
            $scope.isHideClose = $attrs.isHideClose;

            const panel = $compile(html)($scope);
            $document.find('#container').append(panel);
            panel.css('display', 'none');
            $scope.pick = function (data) {
              $scope.$broadcast('selectTime');
              $element.find('.week-date').trigger('blur');
            };


            function showPanel(e) {
              e.stopPropagation();
              let pos = e.target.getBoundingClientRect(),
                offset = panel.offset(),
                tipHeight = panel.outerHeight(),
                tipWidth = panel.outerWidth(),
                elWidth = pos.width || pos.right - pos.left,
                elHeight = pos.height || pos.bottom - pos.top,
                tipOffset = 0,
                scrollWidth = $('body')[0].scrollWidth;
              offset.top = pos.top + elHeight + tipOffset;
              offset.left = pos.left;
              panel.css('display', 'inline-block');
              panel.offset(offset);
              $scope.$broadcast('init');
            }

            $element.find('.week-date').bind('focus', (e) => {
              if($scope.ngDisabled) {
                return;
              }
              e.stopPropagation();
              let pos = e.target.getBoundingClientRect(),
                offset = panel.offset(),
                tipHeight = panel.outerHeight(),
                tipWidth = panel.outerWidth(),
                elWidth = pos.width || pos.right - pos.left,
                elHeight = pos.height || pos.bottom - pos.top,
                tipOffset = 0,
                scrollWidth = $('body')[0].scrollWidth;
              offset.top = pos.top + elHeight + tipOffset;
              offset.left = pos.left;
              panel.css('display', 'inline-block');
              panel.offset(offset);
              $scope.$broadcast('init');
            });

            $element.find('input').on('focus', (e) => {
              if($scope.ngDisabled) {
                return;
              }
              $element.find('.week-date').focus();
            });

            preventBlur($element.find('.week-date'), (target) => {
              if ($.contains($element[0], target)) {
                return true;
              }
              if ($(target).parents('.day').hasClass('disabled')) {
                return true;
              }
              
              if(
                $.contains(panel[0], target) && 
                (!$(target).parents('.day').length || $(target).parents('.day').siblings('.disabled').length)) {
                return true;
              }
              else {
                if ($(target).parents('.day').length) {
                  $scope.pick();
                }
              }
              return false;
            });
            
            $scope.clearDate = () => {
              $scope.datePicker.weekPickerData = {};
              setWeekData(null, true)
            };

            $element.find('.week-date').bind('blur', () => {
              $timeout(() => {
                panel.css('display', 'none');
              }, 250);
            });

            $scope.$on('$destroy', () => {
              $document.find('.week-picker').remove();
            });

            //设置最终选择的周
            var setWeekData = function(newVal, isFetch) {
              $scope.weekData = {
                start: newVal && newVal.start && newVal.start.format($scope.formatDate) || '',
                end: newVal && newVal.end && newVal.end.format($scope.formatDate) || '',
                week: newVal ? newVal.week || '' : '',
                year: newVal ? newVal.year || '' : '',
              };
              if ($scope.eventChange && isFetch) {
                $timeout(function() {
                  $scope.eventChange();
                })
              }
            };

            //设置在datePicker中选择的周
            var setDatePickerData = function(date) {
              date = date || '';
              return {
                start: moment(date).startOf('week'),
                end: moment(date).endOf('week'),
                year: moment(date).year(),
                week: moment(date).week(),
                month: moment(date).month(),
                date: moment(date)
              }
            }

            //初始化数据
            var init = function(type, isUpdate) {
              if(type === 'init') {
                if($scope.weekData && $scope.weekData.start && !isUpdate) {
                  return setDatePickerData($scope.weekData.start);
                }
                else if($scope.initWeek || $scope.initWeek === 0) {
                  var initWeek = parseInt($scope.initWeek, 10);
                  var startDate = moment().add(initWeek*7, 'day').format($scope.formatDate);
                  return setDatePickerData(startDate);
                }
              }
            }

            var isHasFirst = false;
            $scope.$watch('initWeek', function(newValue, oldValue) {
              if(parseInt(newValue, 10) && isHasFirst) {
                var initData = init('init', true);
                if(initData) {
                  angular.extend($scope.datePicker.weekPickerData, initData);
                  setWeekData($scope.datePicker.weekPickerData, true);
                  $scope.selectDate = initData.date;
                }
              }
            });

            /*
             * 当面板中触发的事件。
             */
            $scope.onPickEvent = function(type, date, datePicker, $attrs) {
              switch(type) {
                case 'init':
                  $scope.datePicker = datePicker;
                  datePicker.startDay = 1;
                  datePicker.weekDayNames = ['一','二','三','四','五','六','日'];                
                  var initData = init('init');
                  if(initData) {
                    angular.extend(datePicker.weekPickerData, initData);
                    setWeekData(datePicker.weekPickerData, true);
                    $scope.selectDate = initData.date;
                  }
                  isHasFirst = true;
                break;
                case 'date':
                  setWeekData(datePicker.weekPickerData, true);
                break;
                case 'month':
                  datePicker.setMonth(date);
                break;
              }
            };

          }
        ],
        link($scope, $element, $attrs, ngModel) {},
        //
      };
    },
  ]);
};
