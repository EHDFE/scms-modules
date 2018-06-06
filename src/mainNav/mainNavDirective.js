/**
 *
 * @description 左则栏
 * @date 2016-12-20
 * @author 田艳容
 * @lastBy
 * @html
 */
import html from './template.html';

export default (app, elem, attrs, scope) => {
  app.directive('mainNavDirective', [
    '$rootScope',
    function ($rootScope) {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
          navs: '=',
          callback: '=',
        },
        link: function postLink($scope, $element, $attrs) {},

        controller($scope, $element, $attrs) {
          $scope.callback = $scope.callback || function () {};
          // 切换路由时，更新菜单
          $scope.navs = $scope.navs || [];

          var removeChecked = function (data) {
            angular.forEach(data, (item) => {
              if (!item.children) {
                item.isChecked = false;
              } else {
                removeChecked(item.children);
              }
            });
          };

          let $preActiveEl;
          $scope.checked = function ($event, item) {
            if (!item.children) {
              removeChecked($scope.navs);
            }
            item.isChecked = true;
          };

          // 下级目录收展
          $scope.collapse = function ($event, item) {
            if (!item.children) {
              return;
            }
            const $el = $($event.currentTarget);
            const $parent = $el.parent();
            $el.next().collapse('toggle');
            if ($parent.hasClass('active')) {
              $parent.removeClass('active');
            } else {
              $parent.addClass('active');
            }
          };

          var timeTriggerEventValue;
          var triggerEvent = function() {
            if(timeTriggerEventValue) {
              clearTimeout(timeTriggerEventValue);
              timeTriggerEventValue = null;
            }
            timeTriggerEventValue = setTimeout(function() {
              clearTimeout(timeTriggerEventValue);
              timeTriggerEventValue = null;
              $(window).trigger('resize');
            }, 500);
          };

          // 目录收展
          $scope.toggleLock = function () {
            const isShrink = $element.hasClass('shrink-tag');
            const $content = $('#content');
            if (isShrink) {
              $element.removeClass('shrink');
              $content.removeClass('contentShrink');
              $element.removeClass('shrink-tag');
            } else {
              $element.addClass('shrink-tag');
              $element.addClass('shrink');
              $content.addClass('contentShrink');
            }
            triggerEvent();
            
          };

          $element.hover(
            () => {
              if ($element.hasClass('shrink-tag')) {
                $('#content').removeClass('contentShrink');
                $element.removeClass('shrink');
                triggerEvent();
              }
            },
            () => {
              if ($element.hasClass('shrink-tag')) {
                $element.addClass('shrink');
                $('#content').addClass('contentShrink');
                triggerEvent();
              }
            },
          );
        },
      };
    },
  ]);
};
