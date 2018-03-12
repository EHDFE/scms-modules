/**
 * <directive>
 * @description 日期插件
 * @date 2017-12-06
 * @author 田艳容
 * @lastBy
 * @html <input class="form-control input-date" date-picker-directive ng-model='ngModel' min-date="minDate" max-date="maxDate" max-date-value="maxDateValue" min-date-value="minDateValue">
 */

import angular from 'angular';
import DatePicker from './DatePickerClass';
import html from './calendar.html';
import './calendar.css';
import moment from 'moment';

export default (app, elem, attrs, scope) => {
  app.directive('calendar', [
    'G',
    '$rootScope',
    '$document',
    '$compile',
    function (G, $rootScope, $document, $compile) {
      return {
        template: html,
        scope: {
          minDate: '=', // @scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: '=', // @scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: '=', // @scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: '=', // @scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initDate: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          checkedDate: '=',//@scope activeDate 选中的排班日期 {type:'object', exampleValue:"[{year:'2018',month:'2', date:'28', value:'2018-02-28'}]"}
          deleteActiveDateFn: '=',//@scope isDeleteActiveDate 外部删除当前选中的排期时调用此方法 {type: "function"}
          isView: '=',//@scope isView 是否是查看模式 {type:'boolear'}
          activeDate: '='//@scope activeDate 当前查看日期 {type:'object', exampleValue:"{year:'2018',month:'2', date:'28', value:'2018-02-28'}"}
        },
        replace: true,
        controller: [
          '$scope',
          '$element',
          '$attrs',
          '$timeout',
          function ($scope, $element, $attrs, $timeout) {
            $scope.useSeconds = $attrs.useSeconds;
            $scope.minViewMode = $attrs.minViewMode;
            $scope.pickTime = !!$attrs.pickTime;
            let formatDate = 'YYYY-MM-DD';
            let isInitComplate = false;
            $scope.checkedDate = $scope.checkedDate || [];
            

            const datePicker = new DatePicker({
              dateRange: $scope.dateRange,
              dateRangeData: $scope.dateRangeData || {},
              $attrs,
              weekPick: $scope.weekPick,
              weekPickerData: $scope.weekPickerData || {},
              timePick: $scope.timePick,
              isCalender: true
            });
            $scope.datePicker = datePicker;
            
            

            $scope.$watch('minViewMode', (newVal, oldVal) => {
              $scope.datePicker.minViewMode = newVal;
              if (newVal === 'months') {
                datePicker.showPanel = 'month';
              }
            });

            /* 在面板中标记已选中日期 */
            var getCheckedView = function(isViewPannel) {
              let checkedObj = {};
              angular.forEach($scope.checkedDate, function(item) {
                checkedObj[item.value] = item;
                if(!item.year) {
                  let momentData = moment(item.value);
                  item.year = momentData.year();
                  item.month = momentData.month()+1;
                  item.date = momentData.date();
                }
                if(isViewPannel) {
                  datePicker.init(item.value);
                }
                
              });
              
              angular.forEach($scope.datePicker.dateView, function(row) {
                angular.forEach(row, function(item) { 
                  if(item.tag === 'active') {
                    item.tag = '';
                  }
                  if(checkedObj[item.dateValue]) {
                    item.tag = 'active';
                  }
                  if(item.tag === 'active') {
                    $scope.activeValue = item.data.format(formatDate);
                  }
                  if(item.isToday && item.tag === 'active') {
                    $scope.activeValue = item.data.format(formatDate);
                  }
                  getActiveDate();
                })
              })
            }

            
            /* 切换月操作 */
            $scope.setPrevMonth = function() {
              datePicker.setPrevMonth();
              getCheckedView();
            }
            $scope.setNextMonth = function() {
              datePicker.setNextMonth();
              getCheckedView();
            }
            $scope.setMonth = function(currmonth) {
              datePicker.setMonth(currmonth);
              getCheckedView();
            }
            $scope.setPreYear = function() {
              datePicker.setPreYear(currmonth);
              getCheckedView();
            }
            $scope.setNextYear = function() {
              datePicker.setNextYear(currmonth);
              getCheckedView();
            }

            /* 删除当前选中的排班 */
            $scope.deleteActiveDateFn = function() {
              isInitComplate = true;
              if(!$scope.activeValue) {
                return;
              }
              var deleteIndex;
              angular.forEach($scope.checkedDate, function(item, index) {
                if($scope.activeValue === item.value) {
                  deleteIndex = index;
                }
              })
              $scope.checkedDate.splice(deleteIndex, 1);
              $scope.activeValue = '';
              getCheckedView();
            }

            /* 添加已选中的日期 */
            let pushCheckedDateItem = function(momentDate) {
              $scope.checkedDate.push({
                year:momentDate.year(),
                month:momentDate.month()+1, 
                date:momentDate.date(), 
                value:momentDate.format(formatDate)
              });
            };

            /* 删除已选中的日期 */
            let deleteCheckedDateItem = function(momentDate) {
              let deleteIndex;
              angular.forEach($scope.checkedDate, function(item, index) {
                if(item.value === momentDate.format(formatDate)) {
                  deleteIndex = index;
                }
              });
              $scope.checkedDate.splice(deleteIndex,1);
              getCheckedView();
            }

            /* 获取当前查看的日期 */
            let getActiveDate = function() {
              $scope.activeDate = '';
              if(!$scope.checkedDate || ($scope.checkedDate && !$scope.checkedDate.length)) {
                $scope.activeValue = '';
              }
              angular.forEach($scope.checkedDate, function(item) {
                if(item.value === $scope.activeValue) {
                  $scope.activeDate = item;
                }
              })
            }
            
            
            /*
             * 初始化面板
             * 初始化显示已选中(外部传入)的日期
            */
            datePicker.init();
            $scope.$watch('checkedDate', function(newValue, old) {
              console.log(newValue,'===',old, isInitComplate)

              if(newValue && !isInitComplate) {
                isInitComplate = true;
                getCheckedView(true);
              }
            })

            /*手动选中日期*/
            $scope.checked = function(col) {
              isInitComplate = true;
              if($scope.isView) {
                if(col.tag === 'active') {
                  $scope.activeValue = col.data.format(formatDate);
                  getActiveDate();
                }
                return;
              }
              col.tag = col.tag === 'active' ? '' : 'active';
              if(col.tag === 'active' ) {
                $scope.activeValue = col.data.format(formatDate);
                pushCheckedDateItem(col.data);
              }
              else {
                deleteCheckedDateItem(col.data);
              }

              getActiveDate();
            }
          },
        ],
        link($scope, $element, $attrs, ngModel) {},
        //
      };
    },
  ]);
};

