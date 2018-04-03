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

          $scope.selectedList = Array.isArray($scope.ngModel) ? $scope.ngModel.slice(0) : [];
          $scope.renderList = [];

          const getSelectValue = (target, currentValue, prev) => {
            let match;
            const value = currentValue.shift();
            if (typeof value !== 'undefined') {
              let found = false;
              for (let i = 0, len = target.length; i < len; i += 1) {
                if (target[i].value === value) {
                  match = target[i];
                  found = true;
                  break;
                }
              }
              if (!found && target.length) {
                match = target[0];
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

          const parseSourceData = sourceData => {
            console.group('sourceData change');
            const defaultValue = getSelectValue(sourceData, $scope.selectedList, []);
            const renderList = getRenderList(defaultValue, sourceData);
            $scope.selectedList = defaultValue;
            $scope.renderList = renderList;
            console.log(defaultValue, renderList);
            console.groupEnd('sourceData change');
          };

          parseSourceData($scope.sourceData || []);

          $scope.$watch('sourceData', (newValue, oldValue) => {
            if (!isEqual(newValue, oldValue)) {
              parseSourceData(newValue);
            }
          });

          const normalizer = newValue => {
            const selectedList = [...newValue];
            return getSelectValue(
              $scope.sourceData,
              selectedList,
              []
            );
          };

          let normalizedList;
          $scope.$watch('selectedList', (newValue, oldValue) => {
            if (isEqual(newValue, oldValue) || isEqual(newValue, normalizedList)) return;
            console.group('selectedList change');
            normalizedList = normalizer(newValue);

            const renderList = getRenderList(
              normalizedList,
              $scope.sourceData
            );
            $scope.renderList = renderList;
            $scope.selectedList = normalizedList.slice(0);
            console.log('set ngModel:', normalizedList, renderList);

            $scope.ngModel = normalizedList.slice(0);
            console.groupEnd('selectedList change');
          }, true);

          $scope.$watch('ngModel', (newValue, oldValue) => {
            if (isEqual(newValue, oldValue)) return;
            $scope.selectedList = newValue;
          });

        }
      ],
    })
  ]);
};