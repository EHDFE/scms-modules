/**
 * <directive>
 * @description 国家行政城市
 * @date 2016-09-20
 * @author 田艳容
 * @lastBy 
 * @html <select canton-select-directive ng-model="ngModel" d-item="dItem" class="form-control" data-is-all="1"></select>
 * @api 获取已开通城市接口:/goodstaxiAdmin/opencitycs/selectOpenCityList
 */
define([
    'angular'
], function(
    angular) {
    'use strict';
    return function(app, elem, attrs, scope) {
        app.directive('cantonSelectDirective', ['$http','$timeout', function($http, $timeout) {

            return {
                    template: '<option value="" ng-if="isAll">全国</option><option ng-repeat="item in dData" value="{{item.citycode}}">{{item.cityname}}</option>',
                    require: '?ngModel',
                    scope: {
                        ngModel: '=',//@scope ngModel 当前选中的城市code {type: "string", exampleValue: "", defaultValue: ""}
                        dItem: '='//@scope dItem 选择城市后输出的对像数据 {type: "out-object"}
                    },
                    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                        //@attrs isAll 是不有"全部"选项 {type: "string", exampleValue: "1", defaultValue: ""}
                        $scope.isAll = $attrs.isAll;

                        $http({
                            url: '/goodstaxiAdmin/opencitycs/selectOpenCityList',
                            method: 'post'//,
                            //test: '/scms/scmsModules/citysSelect/citysSelectDirective.json'//假数据api
                        }).then(function(data) {
                            data = data.data.data;
                            angular.forEach(data, function(item) {
                                item.name = item.cityname;
                                item.entityid = item.citycode;
                            });
                            $scope.dData = data;
                            $scope.ngModel = $scope.isAll ? '' : 'e830495';
                            $scope.dItem = getItem();
                        });

                        var getItem = function() {
                            if(!$scope.dData) {
                                return;
                            }
                            var dItem;
                            angular.forEach($scope.dData, function(item, index) {
                                if(item.entityid === $scope.ngModel) {
                                    dItem = item;
                                }                                    
                            });
                            return dItem;
                        };

                        $scope.$watch('ngModel', function(newValue, oldValue) {
                            $scope.dItem = getItem();
                        });
                    }],

                    link: function($scope, $element, $attrs, ngModel) {
                       
                    }
                }
            }])
        }
})
