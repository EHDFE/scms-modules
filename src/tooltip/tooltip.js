/**
 * <directive>
 * @description 信息提示
 * @date 2016-12-01
 * @author 黄思飞
 * @lastBy
 * @html <i class="fa fa-question-circle" tooltip="tooltip" tooltip-position="tooltipPosition"></i>
 */
export default (app, elem, attrs, scope) => {
  app.directive('tooltip', ['$document', '$compile',
    function ($document, $compile) {
      return {
        restrict: 'A',
        scope: {
          tooltip: '@', // @scope tooltip 提示的文本内容 {type: "string", "exampleValue": "这是一个小tip"}
          tooltipPosition: '=', // @scope tooltipPosition 提示弹框的位置 {type: "string", "exampleValue": "left", defaultValue: "down"}
        },
        link: function postLink($scope, $element, $attrs) {
          const tip = $compile('<div ng-class="tipClass"><div ng-bind-html="text"></div><div class="tooltip-arrow"></div></div>')($scope),
            tipClassName = 'tooltip',
            tipActiveClassName = 'tooltip-show';
          let initialClassName = '';
          let newClassName = '';

          $scope.tipClass = [tipClassName];
          $scope.text = $scope.tooltip;

          if ($scope.tooltipPosition || $attrs.position) {
            $scope.tipClass.push(`tooltip-${$scope.tooltipPosition || $attrs.position}`);
          } else {
            $scope.tipClass.push('tooltip-down');
          }
          $document.find('body').append(tip);

          $element.on('mouseover', (e) => {
            tip.addClass(tipActiveClassName);
            e.stopPropagation();

            let targetRect = e.target.getBoundingClientRect(),
              offset = tip.offset(),
              tipHeight = tip.outerHeight(),
              tipWidth = tip.outerWidth(),
              elWidth = targetRect.width || targetRect.right - targetRect.left,
              elHeight = targetRect.height || targetRect.bottom - targetRect.top,
              tipOffset = 15,
              scrollWidth = $(window).scrollLeft();

            if (tip.hasClass('tooltip-right') && (targetRect.right + tipOffset + tipWidth >= scrollWidth)) {
              tip.removeClass('tooltip-right');
              tip.addClass('tooltip-left');
              initialClassName = 'tooltip-right';
              newClassName = 'tooltip-left';
            }
            if (tip.hasClass('tooltip-left') && (targetRect.left - tipOffset - tipWidth <= 0)) {
              tip.removeClass('tooltip-left');
              tip.addClass('tooltip-right');
              initialClassName = 'tooltip-left';
              newClassName = 'tooltip-right';
            }
            if (tip.hasClass('tooltip-down') && (targetRect.left - tipWidth / 2 <= 0)) {
              tip.removeClass('tooltip-down');
              tip.addClass('tooltip-right');
              initialClassName = 'tooltip-down';
              newClassName = 'tooltip-right';
            }
            if (tip.hasClass('tooltip-down') && (targetRect.right + tipWidth / 2 >= scrollWidth)) {
              tip.removeClass('tooltip-down');
              tip.addClass('tooltip-left');
              initialClassName = 'tooltip-down';
              newClassName = 'tooltip-left';
            }

            if (tip.hasClass('tooltip-right')) {
              offset.top = targetRect.top - (tipHeight / 2) + (elHeight / 2);
              offset.left = targetRect.right + tipOffset;
            } else if (tip.hasClass('tooltip-left')) {
              offset.top = targetRect.top - (tipHeight / 2) + (elHeight / 2);
              offset.left = targetRect.left - tipWidth - tipOffset;
            } else if (tip.hasClass('tooltip-down')) {
              offset.top = targetRect.top + elHeight + tipOffset;
              offset.left = targetRect.left - (tipWidth / 2) + (elWidth / 2);
            } else {
              offset.top = targetRect.top - tipHeight - tipOffset;
              offset.left = targetRect.left - (tipWidth / 2) + (elWidth / 2);
            }
            offset.left += scrollWidth;

            tip.offset(offset);
          });

          $element.on('mouseout', () => {
            tip.removeClass(tipActiveClassName);
            tip.addClass(initialClassName);
            tip.removeClass(newClassName);
          });

          tip.on('mouseover', () => {
            tip.addClass(tipActiveClassName);
          });

          tip.on('mouseout', () => {
            tip.removeClass(tipActiveClassName);
            tip.addClass(initialClassName);
            tip.removeClass(newClassName);
          });

          $scope.$on('$destroy', () => {
            tip.destroy();
          });
        },

        controller($scope, $element, $attrs, $transclude) {
        },
      };
    }]);
};
