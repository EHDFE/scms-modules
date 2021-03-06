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
import html from './datePicker.html';
import './datePicker.css';
import tpl from './datePickerTpl.html';
import './datePickerTpl.css';
import { preventBlur } from './utils';

export default (app, elem, attrs, scope) => {
  datePanel(app, elem, attrs, scope);
  app.directive('datePicker', [
    '$rootScope',
    '$document',
    '$compile',
    ($rootScope, $document, $compile) => ({
      require: '?ngModel',
      scope: {
        ngModel: '=', // @scope ngModel 选择的日期 {type:"string", exampleValue:"2016-12-01",isDisabled:1}
        minDate: '=', // @scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
        maxDate: '=', // @scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
        minDateValue: '=', // @scope minDateValue 最小可选日期,距今天天数 {type:"number"}
        maxDateValue: '=', // @scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
        initDate: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
        ngDisabled: '='
      },
      template: tpl,
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
          $scope.formatDate = 'YYYY-MM-DD';
          if($scope.pickTime) {
            $scope.formatDate = 'YYYY-MM-DD HH:mm:ss';
          }
          if($scope.useSeconds === 'false') {
            $scope.formatDate = 'YYYY-MM-DD HH:mm';
          }
          if($scope.minViewMode === 'months') {
            $scope.formatDate = 'YYYY-MM';
          }

          var getInitDate = function() {
            let initDate = $scope.initDate;
            let newDate;
            if (initDate && initDate !== 'null') {
              initDate = initDate * 24 * 60 * 60 * 1000;
              newDate = +new Date() + initDate;
              newDate = new Date(newDate);
            }
            return moment(newDate).format($scope.formatDate);
          };
          if($scope.initDate && $scope.ngModel) {}
          else if($scope.initDate){
            $scope.ngModel = $scope.ngModel || getInitDate();
          }          

          $scope.placeholder = $attrs.placeholder;
          const panel = $compile(html)($scope);
          $document.find('#container').append(panel);
          panel.css('display', 'none');
          $scope.pick = function (data) {
            $scope.$broadcast('selectTime');
            $element.find('.form-control').trigger('blur');
          };

          $scope.onPickEvent = function(type, date, datePicker, $attrs) {
            switch(type) {
              case 'month':
              datePicker.setMonth(date);
              break;
            }
          }

          $element.find('.form-control').bind('focus', (e) => {
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
            $scope.$broadcast('init');
          });

          preventBlur($element.find('.form-control'), (target) => {
            if ($scope.pickTime) {
              if ($element[0] === target || ($.contains($element[0], target)) || ($.contains(panel[0], target))) {
                return true;
              }
            } else {
              if ($(target).hasClass('disabled') || $(target).parents('.day').hasClass('disabled')) {
                return true;
                
              }
              if ($scope.minViewMode === 'months') {
                if (
                  $element[0] === target ||
                    $.contains($element[0], target) ||
                    ($.contains(panel[0], target) && !$(target).hasClass('month'))
                ) {
                  return true;
                  
                }
                if ($(target).hasClass('month')) {
                  $scope.pick();
                }
              } else {
                if (
                  $element[0] === target ||
                    $.contains($element[0], target) ||
                    ($.contains(panel[0], target) && !$(target).hasClass('date-item'))
                ) {
                  return true;
                }
                if (
                  $(target).hasClass('date-item')
                ) {
                  $scope.pick();
                }
              }
            }
            return false;
          });
          $element.find('.form-control').bind('blur', () => {
            $timeout(() => {
              panel.css('display', 'none');
            }, 250);
          });

          $scope.$on('$destroy', () => {
            $document.find('.date-picker').remove();
          });
          $scope.clearDate = () => {
            $scope.ngModel = '';
          };
        },
      ],
      link($scope, $element, $attrs, ngModel) {},
      //
    }),
  ]);
};

