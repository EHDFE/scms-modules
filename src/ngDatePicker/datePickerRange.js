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
import isInteger from 'lodash/isInteger';
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
          //dateRangeResultData: '=',
          startDateRange: '=', // 开始时间
          endDateRange: '=', // 结束时间
          ngDisabled: '=',
          eventChange: '&' //当时间范围发生改变时，会触发时方式
        },
        controller: [
          '$scope',
          '$element',
          '$attrs',
          '$timeout',
          function ($scope, $element, $attrs, $timeout) {
            
            $scope.isHideClose = $attrs.isHideClose;
            const panel = $compile(html)($scope);
            panel.css('display', 'none');
            $document.find('#container').append(panel);
            //$scope.useSeconds = !!$attrs.useSeconds;
            //$scope.minViewMode = $attrs.minViewMode;
            //$scope.pickTime = !!$attrs.pickTime;
            $scope.formatDate = $attrs.formatDate || Defautls.format;
            $scope.startPlaceholder = $attrs.startPlaceholder || Defautls.lang.start;
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
                $timeout(function() {
                  $scope.eventChange();
                });
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
              if(isInit && isInteger($scope.initStartDate) && isInteger($scope.initEndDate)) {
                if(!$scope.startDateRange && !$scope.endDateRange) {
                  $scope.endDate = moment().add($scope.initEndDate, 'd').format($scope.formatDate);
                  $scope.startDate = moment().add($scope.initStartDate, 'd').format($scope.formatDate); 
                  $scope.startValue = $scope.startDate;
                  $scope.endValue = $scope.endDate;                  
                  setOutValue($scope.startValue, $scope.endValue);
                }
              }
              if(isInit) {
                return;
              }
              if($scope.startDateRange && $scope.endDateRange) {
                if($scope.startDateRange.substr(0,7) === $scope.endDateRange.substr(0,7)) {
                  $scope.startDate = $scope.startDateRange;
                  $scope.endDate =  moment($scope.startDate).add(1, 'month').format($scope.formatDate);
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
              } else{
                if(!$scope.dateRangeData || !$scope.dateRangeData.start) {
                  $scope.startDate = moment().format($scope.formatDate);
                  $scope.endDate = moment().add(1, 'month').format($scope.formatDate);  
                }               
              }
            }

            initDate(true);
            
            /*
             * 当面板中触发了“点击日期”事件，设置值。
             */
            $scope.onPickEvent = function(type, date, datePicker) {
              switch(type) {
                case 'date':
                var dateRangeData = datePicker.dateRangeData;
                $scope.startValue = dateRangeData.start.format($scope.formatDate) || '';
                $scope.endValue = dateRangeData.end.format($scope.formatDate) || '';
                $scope.endDate = dateRangeData.start.format($scope.formatDate) || '';
                $scope.startDate = dateRangeData.end.format($scope.formatDate) || '';
                break;
                case 'month':
                datePicker.setMonth(date);
                break;
              }
            }

            
            /*
             * 点“确认”提交选中的时间范围
             */
            $scope.pick = () => {
              setOutValue($scope.startValue, $scope.endValue, true);
              $element.find('.input-date-range').trigger('blur');
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
              initDate();
              $timeout(() => {
                $scope.$broadcast('init');
              });
            }
            $element.find('input').on('focus', (e) => {
              if($scope.ngDisabled) {
                return;
              }
              $element.find('.input-date-range').focus();
            });
            $element.find('.input-date-range').on('focus', (e) => {
              if($scope.ngDisabled) {
                return;
              }
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
              angular.element(elem).bind('focus',function(){
                $document.bind('mousedown',fnDocumentMousedown=function(event){
                  if(func(event.target)){
                    event.target.setAttribute('unselectable','on');
                    event.preventDefault();
                  }else if(event.target!=elem){
                    $document.unbind('mousedown',fnDocumentMousedown);
                  }
                });
              });
              angular.element(elem).bind('blur',function(){
                $document.unbind('mousedown',fnDocumentMousedown);
              });
            }
            $scope.$on('datePickerRefresh', (e, data) => {
              $scope.$broadcast('refreshDate', data);
            });
            
            $element.find('.input-date-range').bind('blur', () => {
              panel.css('display', 'none');
            });

            $scope.$on('$destroy', () => {
              panel.remove();
            });

            /*
             * 点关闭图标时，删除已选中的时间范围
             */
            $scope.clearDate = () => {              
              $scope.startValue = '';
              $scope.endValue = '';
              $scope.startDate = '';
              $scope.endDate = '';
              $scope.dateRangeData = {
                start: '',
                end: ''
              };
              setOutValue($scope.startValue, $scope.endValue, true);
              $timeout(() => {
                $scope.$broadcast('refreshDate');
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

