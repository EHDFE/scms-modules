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
        app.directive('citysSelectMultipleDirective', ['$http','$timeout','G',function($http, $timeout,G) {
            return {
                    template: html,
                    require: '?ngModel',
                    scope: {
                        ngModel: '=',//@scope ngModel 当前选中的城市code数组 {type: "object", "exampleValue": ["e830495"], defaultValue: []}
                        dValue:'=',//@scope dValue 当前选中城市code字符串 {type: "out-string"}
                        nameString:'=',//@scope nameString 当前选中城市名字字符串 {type: "out-string"}
                        checkedItem:'=',//@scope checkedItem 当前选中城市 {type: "object"}
                        selectedCity:'=',//@scope selectedCity 已经选择的城市，不可再选择 {type:"object","exampleValue":[{"entityid":"a24c4bc","name":"上海"}],defaultValue:[]}
                    },
                    controller: ['$scope','$element','$attrs',function($scope, $element, $attrs) {
                        $scope.chooseAll=$attrs.chooseAll||false;
                        var separator=$attrs.separator||",";
                        $scope.all=false;

                        $scope.$watch('checkedItem',function(newValue,oldValue){
                          if(newValue){
                            $scope.checkedItems=G.clone($scope.checkedItem);
                          }
                        })

                        $scope.$watch('selectedCity',function(newValue,oldValue){
                          if($scope.list){
                            setSelectedCity()
                          }
                        },true);

                        $scope.$watch('list',function(newValue,oldValue){
                          if(newValue){
                            setSelectedCity();
                          }
                        },true)

                        function setSelectedCity(){
                          angular.forEach($scope.list,function(item){
                            item.disable=false;
                            angular.forEach($scope.selectedCity,function(selectedItem){
                              if(item.entityid===selectedItem.entityid){
                                item.disable=true;
                              }
                            })
                          })
                        }

                        $scope.ngModel = $scope.ngModel || [];
                        var $dialog = $element.find('#citysSelectmultipleDialog');
                        $scope.isCanChange = $attrs.canChange === 'false' ? false : true;

                        var isSetInitValue = false;
                        var setInitValue = function() {
                            if(!isSetInitValue && $scope.list && $scope.list.length) {
                                var names=$scope.nameString&&$scope.nameString.split(separator)||[];
                                var checkedItems =[];
                                angular.forEach($scope.list, function(item) {
                                    if($scope.ngModel&&$scope.ngModel.length){
                                      angular.forEach($scope.ngModel, function(checkedItem) {
                                        if(item.entityid === checkedItem) {
                                          checkedItems.push(item);
                                        }
                                      });
                                    }else if(names&&names.length){
                                      angular.forEach(names,function(cityname){
                                        if(item.name===cityname){
                                          checkedItems.push(item);
                                        }
                                      })
                                    }
                                });
                                $scope.dValue='';
                                $scope.checkedItems=checkedItems;
                                if($attrs.checkedItem){
                                  $scope.checkedItem=G.clone($scope.checkedItems);
                                }
                                angular.forEach($scope.checkedItems,function(item, index){
                                  if(index===($scope.checkedItems.length-1)){
                                    $scope.dValue+=item.entityid;
                                  }else{
                                    $scope.dValue+=item.entityid+separator;
                                  }
                                });
                                $scope.ngModel=$scope.dValue.split(separator);
                                isSetInitValue = true;
                            }
                        };

                        $http({
                            url: '/goodstaxiAdmin/ehuodiactivitycs/selectCitylist',
                            method: 'post'//,
                            //test: 'scmsModules/citysSelect/citysSelectDirective.json'//假数据api
                        }).then(function(data) {
                            data = data.data.data;
                            $scope.list = data;
                            if($scope.selectedCity){
                              angular.forEach($scope.list,function(item){
                                angular.forEach($scope.selectedCity,function(selectedItem){
                                  if(item.entityid===selectedItem.entityid){
                                    item.disable=true;
                                  }else {
                                    item.disable=false;
                                  }
                                })
                              })
                            }
                            setInitValue();
                        });

                        $scope.$watch('ngModel', function(newValue, oldValue) {
                            if(newValue && !oldValue) {
                                setInitValue();
                            }
                        })

                        $scope.getCheckedItmes = function() {
                            $scope.checkedItems = [];
                            $scope.ngModel = [];
                            var nameString='';
                            angular.forEach($scope.list, function(item) {
                                if(item.isChecked) {
                                    $scope.checkedItems.push(item);
                                    $scope.ngModel.push(item.entityid);
                                     nameString+=';'+item.name;
                                }
                            });
                            if($attrs.nameString){
                              $scope.nameString=nameString.slice(1);
                            }
                            if($attrs.checkedItem){
                              $scope.checkedItem=G.clone($scope.checkedItems);
                            }
                            $scope.dValue = $scope.ngModel && $scope.ngModel.length ? $scope.ngModel.join(separator) : null;
                            $dialog.modal('hide');
                        };

                        $scope.checked = function(item) {
                            item.isChecked = item.isChecked ? '' : 1;
                            if(!item.isChecked) {
                              $scope.all=false;
                            }else{
                              var a=true;
                              for(var i=0,len=$scope.list.length;i<len;i++){
                                if(!$scope.list[i].isChecked){
                                  a=false;
                                  break;
                                }
                              }
                              if(a){
                                $scope.all=true;
                              }else{
                                $scope.all=false;
                              }
                            }
                        };

                        //取消
                        $scope.cancel = function() {
                            $dialog.modal('hide');
                        };

                        $scope.checkAll=function(){
                          angular.forEach($scope.list,function(item){
                              if(!item.disable){
                                item.isChecked = !$scope.all;
                              }
                          })
                          $scope.all=!$scope.all;
                        }

                        //初始化弹出框
                        $dialog.on('show.bs.modal', function (e) {
                            $timeout(function() {
                                angular.forEach($scope.list, function(item) {
                                    item.isChecked = '';
                                    angular.forEach($scope.checkedItems, function(checkedItem) {
                                        if(item.entityid === checkedItem.entityid) {
                                            item.isChecked = 1;
                                        }
                                    });
                                });
                            });
                        });

                    }],
                    link: function($scope, $element, $attrs, ngModel) {

                    }
                }
            }])
        }
