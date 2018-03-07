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

export default (app, elem, attrs, scope) => {
  datePanel(app, elem, attrs, scope);
  app.directive("datePickerRange", [
    "G",
    "$rootScope",
    '$document', 
    '$compile',
    function(G, $rootScope, $document, $compile) {
      return {
        require: "?ngModel",
        template: tpl,
        replace: true,
        scope: {
          minDate: "=", //@scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: "=", //@scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: "=", //@scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: "=", //@scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initStartDate: "=", //@scope initDateStart 初始日期,它的值为距今天的天数 {type:"number"}
          initEndDate: "=", //@scope initDateEnd 初始日期,它的值为距今天的天数 {type:"number"}
          dateRangeResult: "=",
          startDateRange: '=', //开始时间
          endDateRange: '=', //结束时间
        },
        controller: [
          "$scope",
          "$element",
          "$attrs",
          "$timeout",
          function($scope, $element, $attrs, $timeout) {
              var panel = $compile(html)($scope);
              $scope.useSeconds = !!$attrs.useSeconds;
              $scope.minViewMode = $attrs.minViewMode;
              $scope.pickTime = !!$attrs.pickTime;
              $scope.formatDate = $attrs.formatDate||'YYYY-MM-DD';
              function init() {
                $timeout(()=> {
                  $scope.dateRangeResult = {
                    start: '',
                    end: '',
                  }
                  if ($scope.startDateRange) {
                    $scope.dateRangeResult.start = $scope.startDate = $scope.startDateRange;
                  } else if ($scope.initStartDate&&($scope.initStartDate!== 'null')||$scope.initStartDate === 0) {
                    $scope.dateRangeResult.start = $scope.startDate;
                  }
                  if ($scope.endDateRange) {
                    $scope.dateRangeResult.end = $scope.endDate = $scope.endDateRange;
                  }else if ($scope.initEndDate&&($scope.initEndDate!== 'null')||$scope.initEndDate === 0) {
                    $scope.dateRangeResult.end = $scope.endDate;
                  }
                });
              }
              init();

              $document.find('body').append(panel);
              var clickTimes = 0;
              $scope.pick = (data) => {
                $timeout(() => {
                  if ($scope.dateRangeData&&$scope.dateRangeData.start&&$scope.dateRangeData.end) {
                    $scope.startDate = $scope.dateRangeData.start.format($scope.formatDate);
                    $scope.endDate = $scope.dateRangeData.end.format($scope.formatDate);
                    $scope.dateRangeResult = {
                      start: $scope.startDate,
                      end: $scope.endDate,
                    }
                  }
                  $element.find('.input-date-range').trigger('blur');
                  $scope.dateRangeData = {};
                  $timeout(() => {
                    $scope.$broadcast('refreshDate');
                  });
                }, 300);
              }

              
              function showPanel(e) {
                e.stopPropagation();
                var pos = e.target.getBoundingClientRect(),
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
                  $scope.dateRangeData = {
                    start:  $scope.dateRangeResult&&$scope.dateRangeResult.start? moment($scope.dateRangeResult.start): null,
                    end: $scope.dateRangeResult&&$scope.dateRangeResult.end? moment($scope.dateRangeResult.end): null,
                  }
                  
                  if (!$scope.dateRangeResult.start&&!$scope.dateRangeResult.end) {
                    if ($scope.maxDate) {
                      if (moment($scope.maxDate).valueOf() < moment().valueOf()) {
                        $scope.startDate = moment($scope.maxDate).add(-1, 'month').format($scope.formatDate);
                        $scope.endDate = moment($scope.maxDate).format($scope.formatDate);
                      }
                    } else if ($scope.maxDateValue) {
                      if (moment().add($scope.maxDateValue, 'day').valueOf() < moment().valueOf()) {
                        $scope.startDate =moment().add($scope.maxDateValue, 'day').add(-1, 'month').format($scope.formatDate);
                        $scope.endDate = moment().add($scope.maxDateValue, 'day').format($scope.formatDate);
                      }
                    } else if ($scope.minDate) {
                      if (moment($scope.minDate).valueOf() > moment().add(-1, 'month').valueOf()) {
                        $scope.startDate = moment($scope.minDate).format($scope.formatDate);
                        $scope.endDate = moment($scope.minDate).add(1, month).format($scope.formatDate);
                      }
                    } else if ($scope.minDateValue) {
                      if (moment().add($scope.minDateValue, 'day').valueOf() > moment().add(-1, 'month').valueOf()) {
                        $scope.startDate = moment().add($scope.minDateValue, 'day').format($scope.formatDate);
                        $scope.endDate = moment().add($scope.minDateValue, 'day').add(1, month).format($scope.formatDate);
                      }
                    } else {
                        $scope.startDate = moment().add(-1, 'month').format($scope.formatDate);
                        $scope.endDate = moment().format($scope.formatDate);
                    }
                  } else {
                    $scope.startDate = $scope.dateRangeResult&&$scope.dateRangeResult.start;
                    if ($scope.dateRangeResult&&$scope.dateRangeResult.start&&$scope.dateRangeResult.end) {
                      if (moment( $scope.dateRangeResult.start).year() === moment($scope.dateRangeResult.end).year()
                      &&(moment( $scope.dateRangeResult.start).month() === moment($scope.dateRangeResult.end).month())) {
                        $scope.endDate = moment($scope.dateRangeResult.start).add(1, 'month').format($scope.formatDate);
                      }
                    } else {
                      $scope.endDate = $scope.dateRangeResult&&$scope.dateRangeResult.end;
                    }
                  }
                  
                  $timeout(() => {
                    $scope.$broadcast('init');
                  });
                }); 
              }
              
              $element.find('input').on('focus', (e) => {
                $element.find('.input-date-range').focus();
              })
              $element.find('.input-date-range').on('focus', (e) => {
                showPanel(e);
              })


              preventBlur($element.find('.input-date-range'), function(target){
                if ($.contains($element[0], target)) {
                  return true;
                }
                if($element[0] === target||$.contains($element[0], target)||($.contains(panel[0], target))){
                  if ($(target).parent().hasClass('disabled')||$(target).hasClass('disabled')) {
                    return true;
                  }
                  if (!($(target).parent().hasClass('day')||$(target).hasClass('day'))) {
                    return true;
                  } else {
                    clickTimes += 1;
                    if (clickTimes !== 2) {
                      return true;
                    } else {
                      $scope.pick();
                      return false;
                    }
                  }
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
              })
              $element.find('.input-date-range').bind('blur', function(){
                $timeout(() => {
                  clickTimes = 0;
                  panel.css('display', 'none');
                }, 250);
              });

              $scope.$on('$destroy',function(){
                  $document.find('.date-picker-range').remove();
              });
 

              $scope.$watch('startDate', (newVal) => {
                if(newVal) {
                  if (moment(newVal).year() === moment($scope.endDate).year() && moment(newVal).month() === moment($scope.endDate).month()) {
                    $scope.endDate = moment(newVal).add(1, 'month').format($scope.formatDate);
                    $scope.$broadcast('init');
                  }
                }
              });

              $scope.$watch('endDate', (newVal) => {
                if(newVal) {
                  if (moment(newVal).year() === moment($scope.startDate).year() && moment(newVal).month() === moment($scope.startDate).month()) {
                    $scope.startDate = moment(newVal).add(-1, 'month').format($scope.formatDate);
                    $scope.$broadcast('init');
                  }
                }
              });

              var init = true;
              $scope.$watch('dateRangeResult', (newVal) => {
                if (init) {
                  init =false;
                  return;
                }
                if ($attrs.startDateRange) {
                  $scope.startDateRange = newVal&&newVal.start;
                }
                if ($attrs.endDateRange) {
                  $scope.endDateRange = newVal&&newVal.end;
                }
              }, true);
              $scope.$watch('startDateRange', (newVal, oldVal) => {
                if(newVal !== oldVal) {
                  init();
                }
              });
              $scope.$watch('endDateRange', (newVal, oldVal) => {
                if(newVal !== oldVal) {
                  init();
                }
              });


              $scope.clearDate = () => {
                $scope.dateRangeResult = {};
                $scope.dateRangeData = {};
                $timeout(() => {
                  $scope.$broadcast('refreshDate');
                })
              }
          },
        ],
        link: function($scope, $element, $attrs, ngModel) {},
        //
      };
    },
  ]);
};

