import find from 'lodash/find';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import template from './index.html';
import './index.less';

export default (app, elem, attrs, scope) => {
  app.directive('cascadeSelect', [
    () => ({
      template,
      require: '?ngModel',
      scope: {
        ngModel: '=',
        sourceData: '=',
        width: '@',
      },
      controller: [
        '$scope',
        '$attrs',
        ($scope, $attrs) => {

          $attrs.$observe('width', value => {
            if (!value) {
              $scope.width = 80;
            }
          });

          $scope.selectedList = $scope.ngModel || [];
          $scope.renderList = [];

          const getSelectValue = (target, currentValue, prev) => {
            let match;
            const value = currentValue.shift();
            if (typeof value !== 'undefined') {
              for (let i = 0, len = target.length; i < len; i += 1) {
                if (target[i].value === value) {
                  match = target[i];
                  break;
                }
              }
            } else {
              match = target[0];
            }
            if (match) {
              prev.push(match.value);
              if (match.children) {
                return getSelectValue(match.children, currentValue, prev);
              }
            }
            return prev;
          };

          const getRenderList = (selectList, sourceData) => {
            let source = sourceData;
            return selectList.reduce((prev, value) => {
              if (source) {
                prev.push(source.map(node => ({
                  name: node.name,
                  value: node.value,
                })));
              }
              source = get(find(source, ['value', value]), 'children', null);
              return prev;
            }, []);
          };

          $scope.$watch('sourceData', newValue => {
            console.group('sourceData change');
            const defaultValue = getSelectValue(newValue, $scope.selectedList, []);
            const renderList = getRenderList(defaultValue, $scope.sourceData);
            $scope.selectedList = defaultValue;
            $scope.renderList = renderList;
            console.log(defaultValue, renderList);
            console.groupEnd('sourceData change');
          });

          $scope.$watch('selectedList', (newValue, oldValue) => {
            console.group('selectedList change');
            let selectedList = [];
            for (let i = 0, len = newValue.length; i < len; i += 1) {
              selectedList.push(newValue[i]);
              if (newValue[i] !== oldValue[i]) {
                break;
              }
            }
            selectedList = getSelectValue(
              $scope.sourceData,
              selectedList,
              []
            );
            if (isEqual(selectedList, newValue)) {
              const renderList = getRenderList(
                selectedList,
                $scope.sourceData
              );
              $scope.renderList = renderList;
              $scope.selectedList = selectedList;
              console.log(selectedList, renderList);
              $scope.ngModel = selectedList;
            } else {
              $scope.selectedList = selectedList;
            }
            console.groupEnd('selectedList change');
          }, true);

          $scope.$watch('ngModel', newValue => {
            $scope.selectedList = newValue;
          });

        }
      ],
    })
  ]);
};