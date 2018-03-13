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
import tpl from './datePickerRangeTpl.html';
import './datePickerRangeTpl.css';
import html from './datePickerRange.html';
import './datePickerRange.css';
import { preventBlur } from './utils';

import Defautls from './defaults';

export default (app, elem, attrs, scope) => {
  datePanel(app, elem, attrs, scope);
  app.directive('datePickerRange', [
    '$rootScope',
    '$document',
    '$compile',
    function ($rootScope, $document, $compile) {
      return {
        require: '?ngModel',
        template: tpl,
        replace: true,
        scope: {
          minDate: '=', // @scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: '=', // @scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: '=', // @scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: '=', // @scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initStartDate: '=', // @scope initDateStart 初始日期,它的值为距今天的天数 {type:"number"}
          initEndDate: '=', // @scope initDateEnd 初始日期,它的值为距今天的天数 {type:"number"}
          dateRangeResultData: '=',
          startDateRange: '=', // 开始时间
          endDateRange: '=', // 结束时间
          eventChange: '&',
        },
        controller: [
          '$scope',
          '$element',
          '$attrs',
          '$timeout',
          function ($scope, $element, $attrs, $timeout) {
            
            const panel = $compile(html)($scope);
            panel.css('display', 'none');
            $scope.useSeconds = !!$attrs.useSeconds;
            $scope.minViewMode = $attrs.minViewMode;
            $scope.pickTime = !!$attrs.pickTime;
            $scope.formatDate = $attrs.formatDate || Defautls.format;
            $scope.startPlaceholder = $attrs.startPlaceholder || Defautls.lang.start;
            $scope.endPlaceholder = $attrs.endPlaceholder || Defautls.lang.end;
            function initDate() {
              $timeout(() => {
                $scope.dateRangeResult = {
                  start: '',
                  end: '',
                };
                if ($scope.startDateRange) {
                  $scope.dateRangeResult.start = $scope.startDateRange;
                } else if ($scope.initStartDate && ($scope.initStartDate !== 'null') || $scope.initStartDate === 0) {
                  $scope.dateRangeResult.start = $scope.startDate;
                }
                if ($scope.endDateRange) {
                  $scope.dateRangeResult.end = $scope.endDate = $scope.endDateRange;
                } else if ($scope.initEndDate && ($scope.initEndDate !== 'null') || $scope.initEndDate === 0) {
                  $scope.dateRangeResult.end = $scope.endDate;
                }
              });
            }
            initDate();
            $document.find('#container').append(panel);
            
            /*
             * 获取范围值
             */
            $scope.onPickEvent = function(date, dateRangeData) {
              $scope.startValue = dateRangeData.start.format('YYYY-MM-DD') || '';
              $scope.endValue = dateRangeData.end.format('YYYY-MM-DD') || '';
              $scope.endDate = dateRangeData.start.format('YYYY-MM-DD') || '';
              $scope.startDate = dateRangeData.end.format('YYYY-MM-DD') || '';
            }

            $scope.pick = () => {
              $scope.startDateRange = $scope.startValue;
              $scope.endDateRange = $scope.endValue;
              $scope.dateRangeResult = {
                start: $scope.startValue,
                end: $scope.endDateRange
              }
              $element.find('.input-date-range').trigger('blur');
              if ($scope.eventChange) {
                $scope.eventChange();
              }
            };

            /*
             * 显示面板，根据已有时间范围显示面板
             */
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

              $timeout(() => {
                if($scope.initStartDate && $scope.initEndDate+'') {
                  if(!$scope.startDateRange && !$scope.endDateRange) {
                    $scope.endDate = moment().format($scope.formatDate);
                    $scope.startDate = moment().add(-1, 'month').format($scope.formatDate); 
                    $scope.startValue = $scope.startDate;
                    $scope.endValue = $scope.endDate;
                    $scope.dateRangeData = {
                      start: moment($scope.startValue),
                      end: moment($scope.endValue)
                    }
                  }
                }
                if($scope.startDateRange && $scope.endDateRange) {
                  if($scope.startDateRange.substr(0,7) === $scope.endDateRange.substr(0,7)) {
                    $scope.startDate = $scope.startDateRange;
                    $scope.endDate =  moment($scope.startDate).add(1, 'month').format($scope.formatDate);
                    $scope.startValue = $scope.startDate;
                    $scope.endValue = $scope.endDateRange;
                    $scope.dateRangeData = {
                      start: moment($scope.startValue),
                      end: moment($scope.endValue)
                    }
                  }
                  else {
                    $scope.startDate = $scope.startDateRange;
                    $scope.endDate = $scope.endDateRange;
                    $scope.startValue = $scope.startDate;
                    $scope.endValue = $scope.endDate;
                    $scope.dateRangeData = {
                      start: moment($scope.startValue),
                      end: moment($scope.endValue)
                    }   
                  }
                }
                else{
                  if($scope.dateRangeData && $scope.dateRangeData.start) {

                  }
                  else {
                    $scope.startDate = moment().format($scope.formatDate);
                    $scope.endDate = moment().add(1, 'month').format($scope.formatDate);  
                  }
                    
                                  
                }

                $timeout(() => {
                  $scope.$broadcast('init');
                });

              });
            }

            $element.find('input').on('focus', (e) => {
              $element.find('.input-date-range').focus();
            });
            $element.find('.input-date-range').on('focus', (e) => {
              showPanel(e);
            });

            /*
             * 隐藏面板
             */
            preventBlur($element.find('.input-date-range'), function(target){
              if ($.contains($element[0], target)) {
                return true;
              }
              if($element[0] === target||$.contains($element[0], target)||($.contains(panel[0], target))){
                return true;
              }
              $element.find('.input-date-range').trigger('blur');
              return false;
            });
            function preventBlur(elem, func) {
              var fnDocumentMousedown;
              angular.element(elem).bind("focus",function(){
                  $document.bind("mousedown",fnDocumentMousedown=function(event){
                      if(func(event.target)){
                          event.target.setAttribute("unselectable","on");
                          event.preventDefault();
                      }else if(event.target!=elem){
                         $document.unbind("mousedown",fnDocumentMousedown);
                      }
                  });
              });
              angular.element(elem).bind("blur",function(){
                  $document.unbind("mousedown",fnDocumentMousedown);
              });
            }

            //
            $scope.$on('refresh', (e, data) => {
              $scope.$broadcast('refreshDate', data);
            });
            
            $element.find('.input-date-range').bind('blur', () => {
              panel.css('display', 'none');
            });

            $scope.$on('$destroy', () => {
              $document.find('.date-picker-range').remove();
            });

            $scope.clearDate = () => {
              $scope.dateRangeResult = {};
              $scope.startDateRange = '';
              $scope.endDateRange = '';
              $timeout(() => {
                $scope.$broadcast('refreshDate');
                if ($scope.eventChange) {
                  $scope.eventChange();
                }
              });
            };
          },
        ],
        link($scope, $element, $attrs, ngModel) {},
        //
      };
    },
  ]);
};

