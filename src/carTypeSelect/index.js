/**
 * <directive>
 * @description 图片上传
 * @date 2018-08-22
 * @athor 程乐
 * @lastBy
 * @html <input type="text" class="form-control" car-type select-type="radio" ng-model="cars">
 * @html <input type="text" class="form-control" car-type select-type="checkbox" ng-model="cars" max-select-limit="2">
 * example
 */

import isEqual from 'lodash/isEqual';
import template from './index.html';
import './index.less';

import DevTool from '../../utils/DevTool';

const devTool = new DevTool('carTypeSelect');

export default (app, elem, attrs, scope) => {
  app.directive('carTypeSelect', [
    () => ({
      require: '?ngModel',
      scope: {
        ngModel: '=',
        maxSelectLimit: '@',
        separator: '@',
        selectType: '@'
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

          $element.on('keypress', e => {
            e.preventDefault();
          });

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

          var getCarTypes = () => {
                return new Promise(resolve => {
                    $.ajax({
                    type: 'post',
                    url: '/lbsApi/miniApp/selectPubDictionaryListByParam',
                    data: {
                        returnformat: 1,
                        parentdictionarycode: 'CAT',
                    },
                    dataType: 'json',
                    }).done(res => {
                    if (res.result === 'success') {
                        const data = res.data;
                        const treeData = {};
                        data.forEach(item => {
                        if (item.parentdictionaryname === '车型' || item.parentdictionaryname === '大客户车型') return;
                        let parentdictionaryname = item.parentdictionaryname;
                        if (['小面', '中面', '大面'].indexOf(parentdictionaryname) !== -1) {
                            parentdictionaryname = '面包车';
                        }
                        if (!treeData[parentdictionaryname]) {
                            Object.assign(treeData, {
                            [parentdictionaryname]: {
                                name: parentdictionaryname,
                                children: [
                                {
                                    name: item.dictionaryname,
                                    value: item.dictionaryname,
                                }
                                ]
                            },
                            });
                        } else {
                            treeData[parentdictionaryname].children.push({
                            name: item.dictionaryname,
                            value: item.dictionaryname,
                            });
                        }
                        });
                        resolve(Object.keys(treeData).map(category => {
                        return {
                            name: category,
                            children: treeData[category].children,
                        };
                        }));
                    } else {
                        resolve([]);
                    }
                    });
                });
            };
            let sourceMapByValue = {};
            getCarTypes().then(data => {
                // if($scope.selectType === 'radio'){
                //     $scope.options = [{name:'',children:[{name:'全部', value:'全部'}]}].concat(data);
                // }else{
                    $scope.options = data;
                // }
                $scope.options.forEach(group => {
                    group.children.forEach(item => {
                    Object.assign(sourceMapByValue, {
                        [item.value]: item,
                    });
                    });
                });
            });

          $scope.handleClick = data => {
            devTool.log(data);
            const selectedList = $scope.selectedList.slice(0);
            if (!data.selected) {
              if (Number.isFinite(maxSelectLimit) && $scope.selectedList.length >= maxSelectLimit) {
                devTool.warn('maximum limit reached', $scope.selectedList);
                return false;
              }
              selectedList.push(data);
            } else {
              selectedList.splice(
                selectedList.indexOf(data),
                1
              );
            }
            data.selected = !data.selected;
            $scope.selectedList = selectedList;
          };

          $scope.selectClick = data => {
            devTool.log(data);
            var selectedList = [];
            $scope.options.map(group=>{
              group.children.map(d=>{
                if (d.selected) {
                  d.selected = !d.selected;
                }
              })
            });

            if(data.name === '全部'){
              selectedList.push(data);
              $scope.selectedAll = true;
            }else{
              selectedList.push(data);
              $scope.selectedAll = false;
              data.selected = !data.selected;
            }
            $scope.selectedList = selectedList;
          };

          // let sourceMapByValue = {};
          // if($scope.options){
          //   $scope.options.forEach(group => {
          //     group.children.forEach(item => {
          //       Object.assign(sourceMapByValue, {
          //         [item.value]: item,
          //       });
          //     });
          //   });
          // }

          const updateSelectList = (data, isInit) => {
            if (isInit && Object.keys(sourceMapByValue).length === 0) {
              return;
            }
            let selectedList;
            if (data) {
              selectedList = data
                .split(separator)
                .map(value => sourceMapByValue[value])
                .filter(value => value);
            } else {
              selectedList = [];
            }
            if($scope.selectType === 'radio'){
              if(!data || data === '全部'){
                selectedList = [{name:'全部',value:'全部'}];
                $scope.selectedAll = true;
              }
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

          
          $scope.selectedList = [];
          const initialize = () => {
            updateSelectList($scope.ngModel, true);
          };

          initialize();

          $scope.$watch('options', newOptions => {
            if(newOptions){
                devTool.info('options Change:', newOptions);
                sourceMapByValue = {};
                newOptions.forEach(group => {
                    group.children.forEach(item => {
                        Object.assign(sourceMapByValue, {
                        [item.value]: item,
                        });
                    });
                });
                updateSelectList($scope.ngModel);
            }
          });

          $scope.$watch('selectedList', (newValue, oldValue) => {
            if (isEqual(newValue, oldValue)) return;
            devTool.info('SelectedList Change:', newValue, oldValue);
            $scope.ngModel = newValue.map(d => d.value).join(separator);
          });

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