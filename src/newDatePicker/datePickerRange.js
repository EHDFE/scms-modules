/**
 * <directive>
 * @description 日期插件
 * @date 2017-12-06
 * @author 黄国标
 * @lastBy
 * @html <input class="form-control input-date" date-picker-directive ng-model='ngModel' min-date="minDate" max-date="maxDate" max-date-value="maxDateValue" min-date-value="minDateValue">
 */
import datePanel from './datePanel';
import html from './datePickerRange.html';
import './datePickerRange.less';

export default (app, elem, attrs, scope) => {
  datePanel(app, elem, attrs, scope);
  app.directive('datePickerRange', [
    'G',
    '$rootScope',
    '$document',
    '$compile',
    function (G, $rootScope, $document, $compile) {
      return {
        require: '?ngModel',
        scope: {
          ngModel: '=', // @scope ngModel 选择的日期 {type:"string", exampleValue:"2016-12-01",isDisabled:1}
          minDate: '=', // @scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: '=', // @scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: '=', // @scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: '=', // @scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initStartDate: '=', // @scope initDateStart 初始日期,它的值为距今天的天数 {type:"number"}
          initEndDate: '=', // @scope initDateEnd 初始日期,它的值为距今天的天数 {type:"number"}
          dateRangeResult: '=',
        },
        controller: [
          '$scope',
          '$element',
          '$attrs',
          '$timeout',
          function ($scope, $element, $attrs, $timeout) {
            const panel = $compile(html)($scope);
            $scope.useSeconds = !!$attrs.useSeconds;
            $scope.minViewMode = $attrs.minViewMode;
            $scope.pickTime = !!$attrs.pickTime;
            $scope.formatDate = $attrs.formatDate || 'YYYY-MM-DD';

            $timeout(() => {
              $scope.dateRangeResult = {
                start: ($scope.initStartDate && ($scope.initStartDate !== 'null') || $scope.initStartDate === 0) ? $scope.startDate : '',
                end: ($scope.initEndDate && ($scope.initEndDate !== 'null') || $scope.initEndDate === 0) ? $scope.endDate : '',
              };
            });

            $document.find('body').append(panel);
            let clickTimes = 0;
            $scope.pick = function (data) {
              $timeout(() => {
                if ($scope.dateRangeData && $scope.dateRangeData.start && $scope.dateRangeData.end) {
                  $scope.ngModel = `${$scope.dateRangeData.start.format($scope.formatDate)}  ~  ${$scope.dateRangeData.end.format($scope.formatDate)}`;
                  $scope.startDate = $scope.dateRangeData.start.format($scope.formatDate);
                  $scope.endDate = $scope.dateRangeData.end.format($scope.formatDate);
                  $scope.dateRangeResult = {
                    start: $scope.startDate,
                    end: $scope.endDate,
                  };
                }
                $element.trigger('blur');
                $scope.dateRangeData = {};
                $timeout(() => {
                  $scope.$broadcast('refreshDate');
                });
              }, 300);
            };


            $element.delegate('input', 'focus', (e) => {
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
                $scope.dateRangeData = {
                  start: $scope.dateRangeResult && $scope.dateRangeResult.start ? moment($scope.dateRangeResult.start) : null,
                  end: $scope.dateRangeResult && $scope.dateRangeResult.end ? moment($scope.dateRangeResult.end) : null,
                };

                $scope.startDate = $scope.dateRangeResult && $scope.dateRangeResult.start;
                if ($scope.dateRangeResult.start && $scope.dateRangeResult.end) {
                  if (moment($scope.dateRangeResult.start).year() === moment($scope.dateRangeResult.end).year()
                      && (moment($scope.dateRangeResult.start).month() === moment($scope.dateRangeResult.end).month())) {
                    $scope.endDate = moment($scope.dateRangeResult.start).add(1, 'month').format($scope.formatDate);
                  }
                } else {
                  $scope.endDate = $scope.dateRangeResult && $scope.dateRangeResult.end;
                }
                $timeout(() => {
                  $scope.$broadcast('init');
                });
              });
            });

            preventBlur($element, (target) => {
              if ($element[0] === target || ($.contains(panel[0], target))) {
                if (!($(target).parent().hasClass('day') || $(target).hasClass('day'))) {
                  return true;
                }
                clickTimes += 1;
                if (clickTimes !== 2) {
                  return true;
                }
                $scope.pick();
                return false;
              }
              return false;
            });
            function preventBlur(elem, func) {
              let fnDocumentMousedown;
              angular.element(elem).bind('focus', () => {
                $document.bind('mousedown', fnDocumentMousedown = function (event) {
                  if (func(event.target)) {
                    event.target.setAttribute('unselectable', 'on');
                    event.preventDefault();
                  } else if (event.target != elem) {
                    $document.unbind('mousedown', fnDocumentMousedown);
                  }
                });
              });
              angular.element(elem).bind('blur', () => {
                $document.unbind('mousedown', fnDocumentMousedown);
              });
            }
            $scope.$on('refresh', (e, data) => {
              $scope.$broadcast('refreshDate', data);
            });
            $element.bind('blur', () => {
              $timeout(() => {
                clickTimes = 0;
                panel.css('display', 'none');
              }, 250);
            });

            $scope.$on('$destroy', () => {
              $document.find('.date-picker-range').remove();
            });

            $timeout(() => {
              if (!($scope.initStartDate === 'null' || !$scope.initStartDate) && $scope.startDate && $scope.endDate) {
                $scope.ngModel = `${$scope.startDate}  ~  ${$scope.endDate}`;
              }
            });

            $scope.$watch('startDate', (newVal) => {
              if (newVal) {
                if (moment(newVal).year() === moment($scope.endDate).year() && moment(newVal).month() === moment($scope.endDate).month()) {
                  $scope.endDate = moment(newVal).add(1, 'month').format($scope.formatDate);
                  $scope.$broadcast('init');
                }
              }
            });

            $scope.$watch('endDate', (newVal) => {
              if (newVal) {
                if (moment(newVal).year() === moment($scope.startDate).year() && moment(newVal).month() === moment($scope.startDate).month()) {
                  $scope.startDate = moment(newVal).add(-1, 'month').format($scope.formatDate);
                  $scope.$broadcast('init');
                }
              }
            });

            $scope.$watch('dateRangeData', (newVal) => {
              // console.log(newVal, '-------------------------------')
            }, true);
          },
        ],
        link($scope, $element, $attrs, ngModel) {},
        //
      };
    },
  ]);
};
