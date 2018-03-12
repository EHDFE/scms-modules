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
          initDate: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
          weekData: '=',
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
              $element.find('.week-date').focus();
            });

            preventBlur($element.find('.week-date'), (target) => {
              if ($.contains($element[0], target)) {
                return true;
              }
              if ($(target).parent().parent().find('.day')
                .hasClass('disabled')) {
                return true;
              }
              if (
                $(target)
                  .parent()
                  .hasClass('day')
              ) {
                $scope.pick();
              }
              if ($element[0] === target || ($.contains(panel[0], target))) {
                return true;
              }
              return false;
            });
            
            $scope.clearDate = () => {
              $scope.weekPickerData = {};
              $timeout(() => {
                $scope.$broadcast('refreshDate');
              });
            };

            $element.find('.week-date').bind('blur', () => {
              $timeout(() => {
                panel.css('display', 'none');
              }, 250);
            });

            $scope.$on('$destroy', () => {
              $document.find('.week-picker').remove();
            });


            $scope.$watch('weekPickerData', (newVal) => {
              $scope.weekData = {
                start: newVal && newVal.start && newVal.start.format($scope.formatDate) || '',
                end: newVal && newVal.end && newVal.end.format($scope.formatDate) || '',
                week: newVal && newVal.week,
                year: newVal && newVal.year,
              };
            }, true);
          },
        ],
        link($scope, $element, $attrs, ngModel) {},
        //
      };
    },
  ]);
};
