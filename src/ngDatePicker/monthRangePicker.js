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
  app.directive('monthRangePicker', [
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
          initStartMonth: '=', // @scope initDateStart 初始日期,它的值为距今天的天数 {type:"number"}
          initEndMonth: '=', // @scope initDateEnd 初始日期,它的值为距今天的天数 {type:"number"}
          //dateRangeResultData: '=',
          startDateRange: '=', // 开始时间
          endDateRange: '=', // 结束时间
          eventChange: '&', //当时间范围发生改变时，会触发时方式
          ngDisabled: '='
        },
        controller: [
          '$scope',
          '$element',
          '$attrs',
          '$timeout',
          function ($scope, $element, $attrs, $timeout) {
            
            $scope.isHideClose = $attrs.isHideClose;
            // const panel = $compile(html)($scope);
            const panel = $element.find(".date-picker-range");
            panel.css('display', 'none');
            // $document.find('#container').append(panel);
            $scope.minViewMode = 'months';
            $scope.formatDate = 'YYYY-MM';
            $scope.startPlaceholder = $attrs.startPlaceholder || Defautls.lang.start;
            $scope.endPlaceholder = $attrs.endPlaceholder || Defautls.lang.end;
            $element.addClass('month-range-picker');
            /*
             * 设置外部scope的值,触发外部scope事件
             * start 开始时间值 如，'2018-03-02'
             * end 结束时间值
             * isFetch 是否需要触发外部scope事件
             */
            let setOutValue = function(start, end, isFetch) {
              $scope.startDateRange = start;
              $scope.endDateRange =  end;
              if ($scope.eventChange && isFetch) {
                $timeout(function() {
                  $scope.eventChange();
                })
              }
            }
            
            /*
             * 处理初始数据、面板数据
             * isInit 值为：true 时是否是初始时执行，初始时需要处理设置的默认时间initStartMonth、initEndMonth
             * isInit 值为：false 时，处理面板数据。
             * $scope.monthRangeData 范围数据，用于在面板中选中范围
             * $scope.startDate 范围数据，用于在面板中显示第一个面板在此时间的月份
             * $scope.endDate 范围数据，用于在面板中显示第二个面板在此时间的月份
             */
            function initDate(isInit) {
              if(isInit && $scope.initStartMonth && ($scope.initEndMonth || $scope.initEndMonth === 0)) {
                if(!$scope.startDateRange && !$scope.endDateRange) {
                  $scope.startDate = moment().add($scope.initStartMonth, 'month').format($scope.formatDate); 
                  $scope.endDate = moment().add($scope.initEndMonth, 'month').format($scope.formatDate);
                  $scope.startValue = $scope.startDate;
                  $scope.endValue = $scope.endDate;
                  setOutValue($scope.startValue, $scope.endValue)
                  $scope.monthRangeData = {
                    start: moment($scope.startValue),
                    end: moment($scope.endValue)
                  }
                }
              }
              else if(isInit) {
                
              }
              if(isInit) {
                return;
              }

              if($scope.startDateRange && $scope.endDateRange) {
                if($scope.startDateRange === $scope.endDateRange) {
                  $scope.startDate = $scope.startDateRange;
                  $scope.endDate =  moment($scope.startDate).add(-1, 'year').format($scope.formatDate);
                  $scope.startValue = $scope.startDate;
                  $scope.endValue = $scope.endDateRange;
                  $scope.monthRangeData = {
                    start: moment($scope.startValue),
                    end: moment($scope.endValue)
                  }
                }
                else {
                  $scope.startDate = $scope.startDateRange;
                  $scope.endDate = $scope.endDateRange;
                  $scope.startValue = $scope.startDate;
                  $scope.endValue = $scope.endDate;
                  $scope.monthRangeData = {
                    start: moment($scope.startValue),
                    end: moment($scope.endValue)
                  }
                }
                
              }
              else{
                if($scope.monthRangeData && $scope.monthRangeData.start) {

                }
                else {
                  $scope.startDate = moment().format($scope.formatDate);
                  $scope.endDate = moment().add(-1, 'year').format($scope.formatDate);  
                }               
              }
              
            };

            initDate(true);

            var pickTimes = 0;
            var datepickers = {};

            /**
             * 获取当前月份的状态
             * currMonth 当前月份
             * start 月份范围开始时间
             * end 月份范围结束时间
             * min 最小moment时间
             * max 最大moment时间
             */
            let setMonthStatus = function(currMonth, start, end, min, max) {
              let startMonthValueOf = start ? start.valueOf() : '';
              let endMonthValueOf = end ? end.valueOf() : '';
              let currMonthValueOf = currMonth.valueOf();
              let isRange = false;
              let isChecked = false;
              let isToday = false;
              let rangeTag = '';
              let isDisabled = false;
              if(startMonthValueOf && endMonthValueOf) {
                if(currMonthValueOf > startMonthValueOf && currMonthValueOf < endMonthValueOf) {
                  isRange = true;
                }
              }
              if(startMonthValueOf && currMonthValueOf === startMonthValueOf) {
                isChecked = true;
                rangeTag = 'start';
              }
              else if(endMonthValueOf && currMonthValueOf === endMonthValueOf) {
                isChecked = true;
                rangeTag = 'end';
              }
              if(currMonthValueOf === moment(moment().year()+'-'+(moment().month()+1), ['YYYY-MM']).valueOf()) {
                isToday = true;
              }
              if(min && currMonthValueOf < min.valueOf()) {
                isDisabled = true;
              }
              if(max && currMonthValueOf > max.valueOf()) {
                isDisabled = true;
              }
              return {
                isRange: isRange,
                isChecked: isChecked,
                isToday: isToday,
                rangeTag: startMonthValueOf !== endMonthValueOf ? rangeTag : '',
                isDisabled: isDisabled
              }
            };

            /**
             * 更新月份数据的状态
             * currMonth 当前月份
             * start 月份范围开始moment时间
             * end 月份范围结束moment时间
             * min 最小moment时间
             * max 最大moment时间
             */
            let updateMonthData = function(datePicker, start, end, type) {
              let data = datePicker.monthView;
              let status;
              if(start.valueOf() > end.valueOf()) {
                datePicker.monthRangeData.end = start;
                datePicker.monthRangeData.start = end;
              }
              else {
                datePicker.monthRangeData.start = start;
                datePicker.monthRangeData.end = end;
              }
              
              angular.forEach(data, function(item) {
                status = setMonthStatus(moment(item.year+'-'+item.data,['YYYY-MM']), datePicker.monthRangeData.start, datePicker.monthRangeData.end);
                item.checked = status.isChecked;
                item.isRange = status.isRange;
                item.rangeTag = type === 'month' ? status.rangeTag : '';
              })
            };

            /**
             * 在月份面板中更新年份操作状态
             * type 类型：prevYear、nextYear
             * datePicker 
             */
            let getYearsStatus = function(type, datePicker) {
              let isPreYear = true;
              let isNextYear = true;
              let start = datepickers['part1'] && datepickers['part1'].dateData && datepickers['part1'].dateData.year ? datepickers['part1'].dateData.year : moment($scope.startDate).year();
              let end = datepickers['part2'] && datepickers['part2'].dateData && datepickers['part2'].dateData.year ? datepickers['part2'].dateData.year : moment($scope.endDate).year();
              
              switch(type) {
                case 'prevYear':
                  if(datePicker.name === 'part2' && start && start + 1 === datePicker.dateData.year) {
                    isPreYear = false;
                  }
                break;
                case 'nextYear': 
                  if(datePicker.name === 'part1' && end && end - 1 === datePicker.dateData.year) {
                    isNextYear = false;
                  }
                break;
              }
              return {
                isPreYear: isPreYear,
                isNextYear: isNextYear
              };
            };

            var setMonthView = function() {
              this.monthRangeData = this.monthRangeData || {};
              this.monthView = Array(...Array(12)).map((item, i) => {
                const thisMonth = i + 1;
                let status = {};
                
                const thisMoment = moment({year: this.dateData.year, month: i});
                const minMoment = this.minDateArr && this.minDateArr.year && this.minDateArr.month ? moment({year: this.minDateArr.year, month: this.minDateArr.month}) : '';
                const maxMoment = this.maxDateArr && this.maxDateArr.year && this.maxDateArr.month ? moment({year: this.maxDateArr.year, month: this.maxDateArr.month}) : '';
                status = setMonthStatus(thisMoment,this.monthRangeData.start,this.monthRangeData.end,minMoment,maxMoment);
                return {
                  data: thisMonth,
                  year: this.dateData.year,
                  dataView: this.monthMap(thisMonth),
                  checked: status.isChecked,
                  isRange: status.isRange,
                  today: status.isToday,
                  rangeTag: status.rangeTag,
                  disabled: status.isDisabled
                };
              });

              this.monthView.prevYear = getYearsStatus('prevYear', this).isPreYear;
              this.monthView.nextYear = getYearsStatus('nextYear', this).isNextYear;
              if(this.name === 'part1' && datepickers && datepickers['part2'] && datepickers['part2'].monthView) {
                datepickers['part2'].monthView.prevYear = getYearsStatus('prevYear', datepickers['part2']).isPreYear;
              }
              if(this.name === 'part2' && datepickers && datepickers['part1'] && datepickers['part1'].monthView) {
                datepickers['part1'].monthView.nextYear = getYearsStatus('nextYear', datepickers['part1']).isNextYear;
              }
            };

            var initPanelView = function() {
              //初始化面板数据
              if(!datepickers['part1'] || !datepickers['part2']) {
                return;
              }
              initDate();
              $scope.monthRangeData = $scope.monthRangeData || {end: moment()};
              
              datepickers['part1'].monthRangeData = $scope.monthRangeData;
              datepickers['part2'].monthRangeData = $scope.monthRangeData;
              
              
              if(!$scope.monthRangeData.start) {
                datepickers['part1'].dateData = {
                  year: $scope.monthRangeData.end.year() -1,
                  month: $scope.monthRangeData.end.month()
                };
              }
              else if($scope.monthRangeData.start && $scope.monthRangeData.start.year() === $scope.monthRangeData.end.year()) {
                if(!(datepickers['part1'].dateData.year === datepickers['part2'].dateData.year - 1)){
                  datepickers['part1'].dateData = {
                    year: $scope.monthRangeData.start.year() -1,
                    month: $scope.monthRangeData.start.month()
                  };
                }
              }
              else {
                datepickers['part1'].dateData = {
                  year: $scope.monthRangeData.start.year(),
                  month: $scope.monthRangeData.start.month()
                };
              }
              if(!(datepickers['part1'].dateData.year === datepickers['part2'].dateData.year - 1)){
                datepickers['part2'].dateData = {
                  year: $scope.monthRangeData.end.year(),
                  month: $scope.monthRangeData.end.month()
                };
              }

              datepickers['part1'].name = 'part1';
              datepickers['part2'].name = 'part2';
              datepickers['part1'].setMonthView();
              datepickers['part2'].setMonthView();
            }

            /**
             * 当面板中触发了事件,会回调此函数。
             * init 当面板初始化时触发
             * month 当面板点击月份时触发
             * hoverMonth 当面板移入到月分时触发
             */
            $scope.onPickEvent = function(type, month, datePicker, $panelAttrs) {
              switch(type) {
                //事件为初始化时
                case 'init':
                
                  datepickers[$panelAttrs.name] = datePicker;
                  datePicker.setMonthView = setMonthView;
                  datePicker.setDateView = function() {};

                  //初始化面板数据
                  initPanelView();
                  break;

                //事件为"选中月份"时
                case 'month':
                  if(month.disabled) {
                    return;
                  }
                  pickTimes ++;
                  if(pickTimes%2 > 0) {
                      $scope.startValue = moment(month.year + '-' + month.data, ['YYYY-MM']).format($scope.formatDate) || '';
                      $scope.startDate = $scope.endValue;
                      $scope.endValue = '';
                      $scope.endDate = '';
                  }
                  else {
                      $scope.endValue = moment(month.year + '-' + month.data, ['YYYY-MM']).format($scope.formatDate) || '';
                      $scope.endDate = $scope.endValue;
                      if(moment($scope.startValue).valueOf() > moment($scope.endValue).valueOf()) {
                        var startValue = $scope.startValue;
                        var startDate = $scope.startDate;
                        $scope.startValue = $scope.endValue;
                        $scope.endValue = startValue;
                        $scope.startDate = $scope.endDate;
                        $scope.endDate = startDate;
                      }
                  }
                  $scope.monthRangeData = {
                    start: $scope.startValue ? moment($scope.startValue) : '',
                    end: $scope.endValue ? moment($scope.endValue) : ''
                  };
                  
                  updateMonthData(datepickers['part1'], $scope.monthRangeData.start, $scope.monthRangeData.end, 'month');
                  updateMonthData(datepickers['part2'], $scope.monthRangeData.start, $scope.monthRangeData.end, 'month');
                  break;
                
                //事件为"hover月份"时
                case 'hoverMonth': 
                  if($scope.startValue && !$scope.endValue) {
                    updateMonthData(datepickers['part1'], $scope.monthRangeData.start, moment(month.year + '-' + month.data, ['YYYY-MM']), 'hoverMonth');
                    updateMonthData(datepickers['part2'], $scope.monthRangeData.start, moment(month.year + '-' + month.data, ['YYYY-MM']), 'hoverMonth');
                  }
                  break;
              }
            };
            
            /*
             * 点“确认”提交选中的时间范围
             */
            $scope.pick = () => {
              setOutValue($scope.startValue, $scope.endValue, true)
              $element.find('.input-date-range').trigger('blur');
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
                scrollWidth = $('body')[0].scrollWidth,
                scrollHeight = $('body')[0].scrollHeight;
              if(scrollHeight < elPos.top + elHeight + tipHeight + tipOffset && e.target.offsetTop > tipHeight){
                offset.top = elPos.top - (tipHeight - elHeight) - elHeight - tipOffset;
              }
              else {
                offset.top = elPos.top + elHeight + tipOffset;
              }
              if(scrollWidth > elPos.left + tipWidth) {
                offset.left = elPos.left;
              }
              else {
                offset.left = elPos.left - (tipWidth - elWidth);
              }
              
              panel.css('display', 'inline-block');
              panel.offset(offset);
              $timeout(function() {
                initPanelView();
              },0)
            };

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
            $scope.$on('refresh', (e, data) => {
              $scope.$broadcast('refreshDate', data);
            });
            
            $element.find('.input-date-range').bind('blur', () => {
              panel.css('display', 'none');
            });

            $scope.$on('$destroy', () => {
              $document.find('.date-picker-range').remove();
            });

            /*
             * 点关闭图标时，删除已选中的时间范围
             */
            $scope.clearDate = () => {
              $scope.startValue = '';
              $scope.endValue = '';
              $scope.startDate = '';
              $scope.endDate = '';
              $scope.monthRangeData = {
                start: '',
                end: ''
              }
              setOutValue($scope.startValue, $scope.endValue, true)
              updateMonthData(datepickers['part1'], $scope.monthRangeData.start, $scope.monthRangeData.end, 'month');
              updateMonthData(datepickers['part2'], $scope.monthRangeData.start, $scope.monthRangeData.end, 'month');
            };
          },
        ],
        link($scope, $element, $attrs, ngModel) {},
        //
      };
    },
  ]);
};

