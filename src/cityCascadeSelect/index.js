/**
 * <directive>
 * @description 省市级联
 * @date 2020-08-14
 * @athor 程乐
 * @lastBy
 * @html 
 * example
 */
import html from './index.html';
import cityDataJson from './cityData.js';
import './index.less';

export default (app, elem, attrs, scope) => {
  app.directive('cityCascadeSelect', [() => ({
    template: html,
    restrict: 'EA',
    scope: {
        ngModel: '=',
        lever: '@', // 层级 最小1，最大3
        text: '=', // 城市集合字符串 例：北京 北京市 东城区
        cityData: '=' // 城市集合对象 例子： {leve1: "北京", leve2: "北京市", leve3: "东城区"}
    },
    replace: true,
    controller: ['$scope', '$attrs', '$element', '$rootScope', '$timeout', 'G', ($scope, $attrs, $element, $rootScope, $timeout, G) => {
        $scope.cityDataJson = cityDataJson;
        $scope.openType = false;
        if($attrs.text){
            $scope.cityText = $scope.text || '';
        }
        $scope.qeury = (obj, type)=>{
            const FN = {
                1: (data)=>{
                    $scope.cityData = data;
                    $scope.cityText = data.leve1;
                    $scope.text = data.leve1;
                },
                2: (data)=>{
                    $scope.cityData = data;
                    $scope.cityText = data.leve1 + (data.leve2 ? ' '+data.leve2 : '');
                    $scope.text = data.leve1 + (data.leve2 ? ' '+data.leve2 : '');
                },
                3: (data)=>{
                    $scope.cityData = data;
                    $scope.cityText = data.leve1 + (data.leve2 ? ' '+data.leve2 : '') + (data.leve3 ? ' '+data.leve3 : '');
                    $scope.text = data.leve1 + (data.leve2 ? ' '+data.leve2 : '') + (data.leve3 ? ' '+data.leve3 : '');
                }
            }
            FN[$scope.lever](obj);
            if($scope.lever == type){
                $scope.openType = false;
            }
        }
        $(document).mouseup(function(e){
            if(!$element.is(e.target)&&$element.has(e.target).length===0){
                $timeout(()=>{
                    $scope.openType = false;
                },10);
            }
        });
    }],
  })]);
};