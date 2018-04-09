import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import DevTool from '../../utils/DevTool';
import template from './index.html';
import './index.less';

const devTool = new DevTool('cascadeSelect');

export default (app, elem, attrs, scope) => {
  app.directive('cascadeSelect', [
    () => ({
      template,
      require: '?ngModel',
      scope: {
        ngModel: '=',
        sourceData: '=',
        width: '@',
        defaultValue: '@',
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

          // $scope.selectedList = Array.isArray($scope.ngModel) ? $scope.ngModel.slice(0) : [];
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

          const matchFinder = (ary, value, prev) => {
            let found, ret;
            for (let i = 0, len = ary.length; i < len; i += 1) {
              const d = ary[i];
              if (d.value === value) {
                found = {
                  name: d.name,
                  value: d.value,
                };
                ret = [found];
                break;
              } else if (Array.isArray(d.children)) {
                found = {
                  name: d.name,
                  value: d.value,
                };
                const next = matchFinder(d.children, value, found);
                if (Array.isArray(next)) {
                  ret = next;
                  break;
                }
              }
            }
            if (ret) {
              if (prev) {
                return [prev].concat(ret);
              }
              return ret;
            }
            return false;
          };

          const parseSourceData = (sourceData, value) => {
            devTool.group('sourceData change', sourceData);
            let defaultMatch;
            if ($scope.ngModel) {
              defaultMatch = matchFinder(sourceData, $scope.ngModel);
              devTool.log('matchFinder', defaultMatch);
            }
            if (defaultMatch) {
              $scope.selectedList = defaultMatch.map(d => d.value);
              $scope.renderList = getRenderList($scope.selectedList, sourceData);
            } else {
              const defaultValue = getSelectValue(sourceData, $scope.selectedList || [], []);
              const renderList = getRenderList(defaultValue, sourceData);
              $scope.selectedList = defaultValue;
              $scope.renderList = renderList;
              devTool.log(defaultValue, renderList);
            }            
            devTool.groupEnd('sourceData change');
          };

          parseSourceData($scope.sourceData || [], $scope.ngModel);

          $scope.$watch('sourceData', (newValue, oldValue) => {
            if (!isEqual(newValue, oldValue)) {
              parseSourceData(newValue, $scope.ngModel);
            }
          });

          $scope.$watch('ngModel', value => {
            devTool.log('ngModel change', value);
            if ($scope.sourceData) {
              parseSourceData($scope.sourceData, value);
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
            devTool.group('selectedList change');
            normalizedList = normalizer(newValue);

            const renderList = getRenderList(
              normalizedList,
              $scope.sourceData
            );
            $scope.renderList = renderList;
            $scope.selectedList = normalizedList.slice(0);
            devTool.log('set ngModel:', normalizedList, renderList);

            $scope.ngModel = normalizedList[normalizedList.length - 1];
            devTool.groupEnd('selectedList change');
          }, true);

          // $scope.$watch('ngModel', (newValue, oldValue) => {
          //   if (isEqual(newValue, oldValue)) return;
          //   $scope.selectedList = newValue;
          // });

        }
      ],
    })
  ]);
};