/**
 * <directive>
 * @name selector 选择器
 * @description 选择器
 * @date 2018-1-19
 * @author 程乐
 * @lastBy
 * @html
 */

import html from './selectDropdown.html';

export default (app, elem, attrs, scope) => {
  app.directive('selectDropdown', [
    '$timeout',
    '$rootScope',
    function ($timeout, $rootScope) {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        transclude: true,
        scope: {
          dropData: '=', // dropData
          checkedItem: '=',
          onChange: '@',
          disabled: '=',
          mode: '=',
        },
        controller($scope, $element, $attrs) {
          if (!$scope.checkedItem) {
            if (!$scope.mode) {
              $scope.checkedItem = $scope.dropData[0];
            } else {
              $scope.checkedItem = $scope.dropData[0].values[0];
            }
            $timeout(() => {
              $scope.itemId = $scope.checkedItem.$$hashKey;
            }, 50);
            $scope.inputVlue = $scope.checkedItem.name;
          }
          $scope.checked = function(item, index) {
            $scope.checkedItem = item;
            $scope.inputVlue = $scope.checkedItem.name;
            $scope.itemId = item.$$hashKey;
          };
          $scope.$watch('inputVlue', (newValue, oldValue) => {
            if (newValue != oldValue) {
              $timeout(() => {
                $('li', $element).each(function() {
                  if (
                    $(this)
                      .text()
                      .indexOf(newValue) == -1
                  ) {
                    $(this).hide();
                  } else {
                    $(this).show();
                  }
                });
                let type = false;
                $('li', $element).each(function() {
                  if ($(this).css('display') == 'none') {
                    type = true;
                  } else {
                    type = false;
                    return false;
                  }
                });
                if (type) {
                  if (!$('.EUi-select-none', $element)[0]) {
                    $('.dropdown-menu', $element).append(
                      '<p class="EUi-select-none">无匹配选项</p>'
                    );
                  }
                } else {
                  $('.EUi-select-none', $element).remove();
                }
              }, 50);
            }
            if (!newValue) {
              $('li', $element).show();
            }
          });
          $('input', $element).focus(() => {
            if (!$element.hasClass('EUi-select-disabled')) {
              $('li', $element).show();
              $('.EUi-select-none', $element).remove();
            }
            return false;
          });
        },
      };
    },
  ]);
};
