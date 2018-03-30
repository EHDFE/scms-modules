/**
 * <directive>
 * @description 信息提示
 * @date 2016-12-01
 * @author 黄思飞
 * @lastBy
 * @html <i class="fa fa-question-circle" tooltip="tooltip" tooltip-position="tooltipPosition"></i>
 */
export default (app, elem, attrs, scope) => {
  app.directive('tooltip', ['$document', '$compile', '$timeout',
    function ($document, $compile, $timeout) {
      return {
        restrict: 'A',
        scope: {
          tooltip: '@', // @scope tooltip 提示的文本内容 {type: "string", "exampleValue": "这是一个小tip"}
          tooltipPosition: '=', // @scope tooltipPosition 提示弹框的位置 {type: "string", "exampleValue": "left", defaultValue: "down"}
        },
        link: function postLink($scope, $element, $attrs) {
          const tip = $compile('<div class="tooltip" ng-class="tipClass"><div ng-bind-html="text"></div><div class="tooltip-arrow"></div></div>')($scope);
          const tipActiveClassName = 'tooltip-show';
          let initialClassName = '';
          let newClassName = '';
          const tipOffset = 15;

          $scope.tipClass = '';
          $scope.text = $scope.tooltip;

          const updateClassByPosition = position => {
            if (position) {
              $scope.tipClass = `tooltip-${position}`;
            } else {
              $scope.tipClass = 'tooltip-bottom';
            }
          };

          $scope.$watch('tooltipPosition', position => {
            updateClassByPosition(position);
          });

          updateClassByPosition($scope.tooltipPosition || $attrs.position);

          $document.find('body').append(tip);

          const showTip = e => {
            e.stopPropagation();
            tip.addClass(tipActiveClassName);

            const targetRect = e.target.getBoundingClientRect();
            const tipRect = tip[0].getBoundingClientRect();
            const offset = {};
            const scrollLeft = $(window).scrollLeft();
            const scrollTop = $(window).scrollTop();

            let nextPositionClass = $scope.tipClass;

            switch (nextPositionClass) {
            case 'tooltip-left':
              if (tipRect.width + tipOffset >= targetRect.left) {
                nextPositionClass = 'tooltip-right';
              }
              break;
            case 'tooltip-right':
              if (targetRect.right + tipRect.width + tipOffset >= $(window).width()) {
                nextPositionClass = 'tooltip-left';
              }
              break;
            case 'tooltip-top':
              if (tipRect.height + tipOffset > targetRect.top) {
                nextPositionClass = 'tooltip-bottom';
              }
              break;
            case 'tooltip-bottom':
            default:
              if (targetRect.bottom + tipRect.height + tipOffset >= $(window).height()) {
                nextPositionClass = 'tooltip-top';
              }
              break;
            }

            if (nextPositionClass === 'tooltip-right') {
              Object.assign(offset, {
                left: targetRect.right + tipOffset,
                top: targetRect.top - tipRect.height / 2 + targetRect.height / 2,
              });
            } else if (nextPositionClass === 'tooltip-left') {
              Object.assign(offset, {
                left: targetRect.left - tipRect.width - tipOffset,
                top: targetRect.top - tipRect.height / 2 + targetRect.height / 2,
              });
            } else if (nextPositionClass === 'tooltip-bottom') {
              Object.assign(offset, {
                left: targetRect.left - tipRect.width / 2 + targetRect.width / 2,
                top: targetRect.bottom + tipOffset,
              });
            } else {
              Object.assign(offset, {
                left: targetRect.left - tipRect.width / 2 + targetRect.width / 2,
                top: targetRect.top - tipOffset - tipRect.height,
              });
            }

            Object.assign(offset, {
              left: offset.left + scrollLeft,
              top: offset.top + scrollTop,
            });

            tip.offset(offset);
            $scope.tipClass = nextPositionClass;
          };

          const hideTip = () => {
            tip.removeClass(tipActiveClassName);
            tip.addClass(initialClassName);
            tip.removeClass(newClassName);
          };

          $element.on('mouseenter', e => {
            showTip(e);
          });

          $element.on('mouseleave', () => {
            hideTip();
          });

          $scope.$on('$destroy', () => {
            tip.remove();
          });
        },
      };
    }]);
};
