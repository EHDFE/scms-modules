import isEqual from 'lodash/isEqual';
import template from './index.html';
import './index.less';

import DevTool from '../../utils/DevTool';

const devTool = new DevTool('multipleSelect');

export default (app, elem, attrs, scope) => {
  app.directive('multipleSelect', [
    () => ({
      require: '?ngModel',
      scope: {
        ngModel: '=',
        options: '=',
        maxSelectLimit: '@',
        separator: '@',
      },
      controller: [
        '$scope',
        '$compile',
        '$element',
        '$attrs',
        ($scope, $compile, $element, $attrs) => {

          const $parent = $element.parent();
          const $pane = $compile(template)($scope);
          $parent.addClass('multiple-select-wrap')
            .append($pane);
          const parentRect = $parent[0].getBoundingClientRect();
          const elemRect = $element[0].getBoundingClientRect();

          $pane.css({
            left: elemRect.left - parentRect.left,
            top: elemRect.top - parentRect.top + elemRect.height + 2,
          });

          const maxSelectLimit = $attrs.maxSelectLimit ? parseInt($attrs.maxSelectLimit, 10) : Infinity;
          const separator = $attrs.separator ? $attrs.separator : ',';

          $scope.paneVisible = false;

          let mouseInPanel = false;
          $pane.on('mouseenter', () => {
            mouseInPanel = true;
          });
          $pane.on('mouseleave', () => {
            mouseInPanel = false;
          });
          $pane.on('click', () => {
            $element.focus();
          });

          $element.on('focus', () => {
            $scope.$apply(() => {
              $scope.paneVisible = true;
            });
          });
          $element.on('blur', () => {
            if (!mouseInPanel) {
              $scope.$apply(() => {
                $scope.paneVisible = false;
              });
            }
          });

          $scope.handleClick = data => {
            devTool.log(data);
            if (!data.selected) {
              if (Number.isFinite(maxSelectLimit) && $scope.selectedList.length >= maxSelectLimit) {
                devTool.warn('maximum limit reached', $scope.selectedList);
                return false;
              }
              $scope.selectedList.push(data);
            } else {
              $scope.selectedList.splice(
                $scope.selectedList.indexOf(data),
                1
              );
            }
            data.selected = !data.selected;
          };

          let sourceMapByValue = {};
          $scope.options.forEach(group => {
            group.children.forEach(item => {
              Object.assign(sourceMapByValue, {
                [item.value]: item,
              });
            });
          });

          const updateSelectList = (data, isInit) => {
            if (isInit && Object.keys(sourceMapByValue).length === 0) return;
            let selectedList;
            if (data) {
              selectedList = data
                .split(separator)
                .map(value => sourceMapByValue[value])
                .filter(value => value);
            } else {
              selectedList = [];
            }
            $scope.selectedList && $scope.selectedList.forEach(item => Object.assign(item, {
              selected: false,
            }));
            selectedList.forEach(item => Object.assign(item, {
              selected: true,
            }));
            $scope.ngModel = selectedList.map(d => d.value).join(separator);
            $scope.selectedList = selectedList;
          };

          
          const initialize = () => {
            updateSelectList($scope.ngModel);
          };

          initialize();

          $scope.$watch('options', newOptions => {
            sourceMapByValue = {};
            newOptions.forEach(group => {
              group.children.forEach(item => {
                Object.assign(sourceMapByValue, {
                  [item.value]: item,
                });
              });
            });
            updateSelectList($scope.ngModel);
          }, true);

          $scope.$watch('selectedList', (newValue, oldValue) => {
            if (isEqual(newValue, oldValue)) return;
            devTool.info('SelectedList Change:', newValue, oldValue);
            $scope.ngModel = newValue.map(d => d.value).join(separator);
          }, true);

          $scope.$watch('ngModel', (newValue, oldValue) => {
            if (newValue === oldValue) return;
            devTool.info('ngModel Change', newValue, oldValue);
            updateSelectList(newValue);
          });

          $scope.$on('$destroy', () => {
            $pane.remove();
          });
        }
      ],
    })
  ]);
};