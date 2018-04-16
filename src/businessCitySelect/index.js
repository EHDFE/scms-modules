import template from './index.html';
import get from 'lodash/get';
import find from 'lodash/find';
import isFunction from 'lodash/isFunction';
// import isEqual from 'lodash/isEqual';
// import cascadeSelect from '../cascadeSelect';
import DataSource from './dataSource';

import DevTool from '../../utils/DevTool';
import './index.less';

const devTool = new DevTool('citySelect');

const SOURCE_API = '/ehuodiBedrockApi/ehdrbacorganizationcs/selectCascadeRbacOrganizationByCode';

export default (app, elem, attrs, scope) => {
  // cascadeSelect(app, elem, attrs, scope);
  app.directive('businessCitySelect', [() => ({
    template,
    scope: {
      ngModel: '=',
      width: '@',
      mode: '=',
      openCityType: '@',
      isActivated: '=',
      label: '@',
      apiUrl: '@',
      cityOnly: '=',
      sourceFormatter: '=',
      readonly: '=',
      ignoreDataPermission: '=',
      prependOptionType: '@',
      autoSelect: '=',
      onChange: '=',
      onBeforeChange: '=',
    },
    replace: true,
    controller: [
      '$scope',
      '$attrs',
      '$element',
      '$rootScope',
      '$timeout',
      'G',
      ($scope, $attrs, $element, $rootScope, $timeout, G) => {
        let currentOrganizationCode = get(G, 'userInfo.organizationcode', '88888888');

        const $inputField = $element.find('input');
        const $layer = $element.find('.business-city-select-layer');
        setTimeout(() => {
          $scope.$apply(() => {
            $scope.layerOffset = $inputField[0].getBoundingClientRect().left - $element[0].getBoundingClientRect().left;
          });
        }, 0);
        // 多选模式
        $scope.multipleSelectMode = $scope.mode === 'MULTIPLE';
        $scope.active = false;

        let mouseInPanel = false;
        $layer.on('mouseenter', () => {
          mouseInPanel = true;
        });
        $layer.on('mouseleave', () => {
          mouseInPanel = false;
          $layer[0].focus();
        });
        $inputField.on('keypress', e => {
          e.preventDefault();
        });
        
        $layer.on('blur', () => {
          if (!mouseInPanel) {
            $scope.$apply(() => {
              $scope.active = false;
            });
          }
        });
        
        const dataSource = new DataSource(Object.assign({
          openCityType: $scope.openCityType,
          isActivated: $scope.isActivated,
          organizationCode: currentOrganizationCode,
          apiUrl: $scope.apiUrl || SOURCE_API,
          prependOptionType: $scope.prependOptionType || 'PARENT_VALUE',
<<<<<<< HEAD
          // sourceFormatter: $scope.sourceFormatter,
          sourceFormatter: data => {
            // if (data.organizationcode === '88888888') return false;
            return {
              name: data.organizationname,
              value: data.organizationcode === '88888888' ? '' : data.organizationcode,
            };
          },
=======
          sourceFormatter: $scope.sourceFormatter,
          // sourceFormatter: data => {
          //   // if (data.organizationcode === '88888888') return false;
          //   return {
          //     name: data.organizationname,
          //     value: data.organizationcode === '88888888' ? '' : data.organizationcode,
          //   };
          // },
>>>>>>> feat/cascadeOrganizationSelector
        }));

        const updateSelectListByModel = (source, value) => {
          devTool.log(source, value);
          const matchedList = [];
          if (value === null || value === undefined) {
            if ($scope.autoSelect) {
              let defaultSelect;
              if ($scope.cityOnly) {
                const flatSource = source.reduce((prev, item) => {
                  if (item.children) {
                    return prev.concat(item.children);
                  } else {
                    return prev.concat(item);
                  }
                }, []);
                defaultSelect = flatSource[0];
              } else {
                defaultSelect = source[0];
              }
              defaultSelect && matchedList.push(defaultSelect);
            }
          } else {
            let targetList;
            if (!Array.isArray(value)) {
              targetList = [value];
            } else {
              targetList = value;
            }
            const flatSource = source.reduce((prev, item) => {
              if (item.children) {
                return prev.concat(item, item.children);
              }
              return prev.concat(item);
            }, []);
            targetList.forEach(targetValue => {
              const matchOne = find(flatSource, d => d.value === targetValue);
              if (matchOne) {
                matchedList.push(matchOne);
              }
            });
          }
          devTool.log('matchedList:', matchedList);
          $scope.selectedList.forEach(d => Object.assign(d, {
            selected: false,
          }));
          $scope.selectedList = matchedList.map(d => Object.assign(d, {
            selected: true,
          }));
          $scope.displayValue = matchedList.map(d => d.name).join('/');
        };

        let initialized = false;
        dataSource.setUpdater(source => {
          $scope.$apply(() => {
            devTool.log('source update', source);
            $scope.source = source;
            nationNode = find(source, d => d.isNational);
            if (initialized) {
              updateSelectListByModel(source, null);
            } else {
              // 初始化赋值
              updateSelectListByModel(source, $scope.ngModel);
              initialized = true;
            }
          });
        });

        dataSource.getSource();

        let nationNode;
        $scope.selectedList = [];

        $scope.handleSelectAction = (data, isCity, parent) => {
          devTool.log(data, isCity, parent);
          if (isFunction($scope.onBeforeChange)) {
            if (!$scope.onBeforeChange(data, isCity, parent)) return false;
          }
          const nextSelectStatus = !data.selected;
          const isNational = !!data.isNational;
          if (!isCity && $scope.cityOnly && !isNational) return false;
          if (isNational) {
            Object.assign(data, {
              selected: nextSelectStatus,
            });
            if (nextSelectStatus) {
              $scope.selectedList.forEach(d => Object.assign(d, {
                selected: false,
              }));
              $scope.selectedList = [data];
            } else {
              $scope.selectedList = [];
            }
          } else {
            if ($scope.selectedList.includes(nationNode)) {
              $scope.selectedList.splice(
                $scope.selectedList.indexOf(nationNode),
                1,
              );
              Object.assign(nationNode, {
                selected: false,
              });
            }
            if ($scope.multipleSelectMode) {
              if (isCity) {
                if ($scope.selectedList.includes(parent)) {
                  const newSelectedList = parent.children
                    .filter(d => d !== data)
                    .map(d => Object.assign(d, {
                      selected: true
                    }));
                  const removedItem = $scope.selectedList.splice(
                    $scope.selectedList.indexOf(parent),
                    1,
                    ...newSelectedList,
                  );
                  Object.assign(parent, {
                    selected: false,
                  });
                  Object.assign(removedItem, {
                    selected: false,
                  });
                } else {
                  if (nextSelectStatus) {
                    // 选中之后，是否要把父级选中
                    const parentNeedToBeSelected = parent.children.every(d => {
                      if (d === data) return true;
                      return d.selected;
                    });
                    if (parentNeedToBeSelected && !$scope.cityOnly) {
                      Object.assign(parent, {
                        selected: true,
                      });
                      parent.children.forEach(d => Object.assign(d, {
                        selected: false,
                      }));
                      $scope.selectedList = $scope.selectedList.filter(d => {
                        return !parent.children.includes(d);
                      }).concat(parent);
                    } else {
                      Object.assign(data, {
                        selected: true,
                      });
                      $scope.selectedList.push(data);
                    }
                  } else {
                    Object.assign(data, {
                      selected: false,
                    });
                    $scope.selectedList.splice(
                      $scope.selectedList.indexOf(data),
                      1,
                    );
                  }
                }
              } else {
                Object.assign(data, {
                  selected: nextSelectStatus,
                });
                if ($scope.selectedList.includes(data)) {
                  $scope.selectedList.splice(
                    $scope.selectedList.indexOf(data),
                    1
                  );
                } else {
                  if (Array.isArray(data.children)) {
                    data.children.forEach(d => Object.assign(d, {
                      selected: false,
                    }));
                  }
                  $scope.selectedList = $scope.selectedList.filter(d => {
                    return !data.children.includes(d);
                  }).concat(data);
                }
              }
            } else {
              // 单选模式
              $scope.selectedList.forEach(item => {
                if (item !== data) {
                  Object.assign(item, {
                    selected: false,
                  });
                }
              });
              Object.assign(data, {
                selected: nextSelectStatus,
              });
              if (nextSelectStatus) {
                $scope.selectedList = [data];
              } else {
                $scope.selectedList.pop();
              }
            }
          }
        };

        $scope.confirmSelected = () => {
          devTool.info('confirmSelected')
          const selectedValues = $scope.selectedList.map(d => d.value);
          if ($scope.multipleSelectMode) {
            $scope.ngModel = selectedValues;
          } else {
            $scope.ngModel = selectedValues.join(',');
          }
          $scope.onChange && $scope.onChange($scope.selectedList);
          $scope.displayValue = $scope.selectedList.map(d => d.name).join('/');
          $scope.active = false;
        };

        $scope.$watch('selectedList', value => {
          devTool.log('selectedList change:', value);
          if (!$scope.multipleSelectMode && initialized) {
            $scope.confirmSelected();
          }
        }, true);

        $scope.$watch('mode', mode => {
          $scope.multipleSelectMode = mode === 'MULTIPLE';
        });
        $scope.$watch('openCityType', value => {
          dataSource.update({
            openCityType: value,
          });
        });
        $scope.$watch('isActivated', value => {
          dataSource.update({
            isActivated: value,
          });
        });
        $scope.$watch('active', value => {
          if (value) {
            devTool.log($layer);
            setTimeout(() => {
              $layer[0].focus();
            }, 0);
          }
        });
        
        $scope.$watch('ngModel', (value, oldValue) => {
          devTool.info('ngModel change:', value, oldValue);
          if (value !== oldValue) {
            updateSelectListByModel($scope.source, value);
          }
        });

        if (!$scope.ignoreDataPermission) {
          // 控制数据权限
          const handleUserOrgChange = $rootScope.$on('updateOrg', () => {
            const nextOrganizationCode = get(G, 'userInfo.organizationcode', '');
            if (currentOrganizationCode === nextOrganizationCode) return;
            currentOrganizationCode = nextOrganizationCode;
            dataSource.update({
              organizationCode: nextOrganizationCode,
            });
          });
  
          $scope.$on('$destroy', () => {
            handleUserOrgChange();
          });
        }
      }],
  })]);
};