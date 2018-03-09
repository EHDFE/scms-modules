/**
 * <directive>
 * @description 弹出框：选择易货嘀划分的业务城市，可多选
 * @date 2016-09-20
 * @author 田艳容
 * @lastBy
 * @html <div citys-select-multiple-directive ng-model="ngModel" d-value="dValue" selected-city="selectedCity"></div>
 * @api 获取已开通城市接口:/goodstaxiAdmin/ehuodiactivitycs/selectCitylist
 */
import './citysSelectMultiple.css';
import html from './citysSelectMultiple.html';

export default (app, elem, attrs, scope) => {
  app.directive('citysSelectMultipleDirective', ['$http', '$timeout', 'G', function ($http, $timeout, G) {
    return {
      template: html,
      require: '?ngModel',
      scope: {
        ngModel: '=', // @scope ngModel 当前选中的城市code数组 {type: "object", "exampleValue": ["e830495"], defaultValue: []}
        dValue: '=', // @scope dValue 当前选中城市code字符串 {type: "out-string"}
        nameString: '=', // @scope nameString 当前选中城市名字字符串 {type: "out-string"}
        checkedItem: '=', // @scope checkedItem 当前选中城市 {type: "object"}
        selectedCity: '=', // @scope selectedCity 已经选择的城市，不可再选择 {type:"object","exampleValue":[{"entityid":"a24c4bc","name":"上海"}],defaultValue:[]}
      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        $scope.chooseAll = $attrs.chooseAll || false;
        const separator = $attrs.separator || ',';
        $scope.all = false;

        $scope.$watch('checkedItem', (newValue, oldValue) => {
          if (newValue) {
            $scope.checkedItems = G.clone($scope.checkedItem);
          }
        });

        $scope.$watch('selectedCity', (newValue, oldValue) => {
          if ($scope.list) {
            setSelectedCity();
          }
        }, true);

        $scope.$watch('list', (newValue, oldValue) => {
          if (newValue) {
            setSelectedCity();
          }
        }, true);

        function setSelectedCity() {
          angular.forEach($scope.list, (item) => {
            item.disable = false;
            angular.forEach($scope.selectedCity, (selectedItem) => {
              if (item.entityid === selectedItem.entityid) {
                item.disable = true;
              }
            });
          });
        }

        $scope.ngModel = $scope.ngModel || [];
        const $dialog = $element.find('#citysSelectmultipleDialog');
        $scope.isCanChange = $attrs.canChange !== 'false';

        let isSetInitValue = false;
        const setInitValue = function () {
          if (!isSetInitValue && $scope.list && $scope.list.length) {
            const names = $scope.nameString && $scope.nameString.split(separator) || [];
            const checkedItems = [];
            angular.forEach($scope.list, (item) => {
              if ($scope.ngModel && $scope.ngModel.length) {
                angular.forEach($scope.ngModel, (checkedItem) => {
                  if (item.entityid === checkedItem) {
                    checkedItems.push(item);
                  }
                });
              } else if (names && names.length) {
                angular.forEach(names, (cityname) => {
                  if (item.name === cityname) {
                    checkedItems.push(item);
                  }
                });
              }
            });
            $scope.dValue = '';
            $scope.checkedItems = checkedItems;
            if ($attrs.checkedItem) {
              $scope.checkedItem = G.clone($scope.checkedItems);
            }
            angular.forEach($scope.checkedItems, (item, index) => {
              if (index === ($scope.checkedItems.length - 1)) {
                $scope.dValue += item.entityid;
              } else {
                $scope.dValue += item.entityid + separator;
              }
            });
            $scope.ngModel = $scope.dValue.split(separator);
            isSetInitValue = true;
          }
        };

        $http({
          url: '/goodstaxiAdmin/ehuodiactivitycs/selectCitylist',
          method: 'post', // ,
          // test: 'scmsModules/citysSelect/citysSelectDirective.json'//假数据api
        }).then((data) => {
          data = data.data.data;
          $scope.list = data;
          if ($scope.selectedCity) {
            angular.forEach($scope.list, (item) => {
              angular.forEach($scope.selectedCity, (selectedItem) => {
                if (item.entityid === selectedItem.entityid) {
                  item.disable = true;
                } else {
                  item.disable = false;
                }
              });
            });
          }
          setInitValue();
        });

        $scope.$watch('ngModel', (newValue, oldValue) => {
          if (newValue && !oldValue) {
            setInitValue();
          }
        });

        $scope.getCheckedItmes = function () {
          $scope.checkedItems = [];
          $scope.ngModel = [];
          let nameString = '';
          angular.forEach($scope.list, (item) => {
            if (item.isChecked) {
              $scope.checkedItems.push(item);
              $scope.ngModel.push(item.entityid);
              nameString += `;${item.name}`;
            }
          });
          if ($attrs.nameString) {
            $scope.nameString = nameString.slice(1);
          }
          if ($attrs.checkedItem) {
            $scope.checkedItem = G.clone($scope.checkedItems);
          }
          $scope.dValue = $scope.ngModel && $scope.ngModel.length ? $scope.ngModel.join(separator) : null;
          $dialog.modal('hide');
        };

        $scope.checked = function (item) {
          item.isChecked = item.isChecked ? '' : 1;
          if (!item.isChecked) {
            $scope.all = false;
          } else {
            let a = true;
            for (let i = 0, len = $scope.list.length; i < len; i++) {
              if (!$scope.list[i].isChecked) {
                a = false;
                break;
              }
            }
            if (a) {
              $scope.all = true;
            } else {
              $scope.all = false;
            }
          }
        };

        // 取消
        $scope.cancel = function () {
          $dialog.modal('hide');
        };

        $scope.checkAll = function () {
          angular.forEach($scope.list, (item) => {
            if (!item.disable) {
              item.isChecked = !$scope.all;
            }
          });
          $scope.all = !$scope.all;
        };

        // 初始化弹出框
        $dialog.on('show.bs.modal', (e) => {
          $timeout(() => {
            angular.forEach($scope.list, (item) => {
              item.isChecked = '';
              angular.forEach($scope.checkedItems, (checkedItem) => {
                if (item.entityid === checkedItem.entityid) {
                  item.isChecked = 1;
                }
              });
            });
          });
        });
      }],
      link($scope, $element, $attrs, ngModel) {

      },
    };
  }]);
};
