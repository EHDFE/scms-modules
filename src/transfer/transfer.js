/**
 * <directive>
 * @description 穿梭框
 * @date 2019-12-11
 * @author 程乐
 * @lastBy
 * @html <div transfer source-data="sourceData" target-data="targetData" screen-key="id" show-name="name" ></div>
 */
import html from './transfer.html';
import './transfer.less';

export default (app, elem, attrs, scope) => {
  app.directive('transfer', ['$timeout',function ($timeout) {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
            sourceData: '=', // @scope sourceData 原始数据 [{id:1,name:'数据1',value:''}]
            targetData: '=', // @scope targetData 筛选数据 [{id:1,name:'数据1',value:''}]
            screenKey: '@', // @scope screenKey 筛选条件key id
            showName: '@' // @scope showName 显示内容key name
        },
        link: function postLink() {},
        controller($scope,$element,$attrs,$transclude,$log,$http,G) {
            
            $scope.$watch('sourceData',(newValue, oldValue)=>{
                leftInit();
                rightInit();
                if($scope.targetData && $scope.targetData.length > 0){
                    $scope.dataSource = screenBox($scope.targetData,$scope.sourceData);
                }else{
                    $scope.targetData = $scope.targetData || [];
                    $scope.sourceData = $scope.sourceData || [];
                    $scope.dataSource = $scope.sourceData && $scope.sourceData.length > 0 ? G.clone($scope.sourceData) : [] ;
                }
            });


            // 选择左右数据
            $scope.selectLeft = () => {
                leftInit();
                $scope.dataSource.map(item=>{
                    if(item.check){
                        $scope.selectLeftData.push(item);
                        $scope.leftSelectType = true;
                        $scope.leftNum++;
                    }
                });
            }
            $scope.selectRight = () => {
                rightInit();
                $scope.targetData.map(item=>{
                    if(item.check){
                        $scope.selectRightData.push(item);
                        $scope.rightSelectType = true;
                        $scope.rightNum++;
                    }
                });
            }

            // 穿梭操作
            $scope.transferRight = () => {
                $scope.selectLeftData.map(item=>{
                    item.check = false;
                });
                $scope.targetData = $scope.selectLeftData.concat($scope.targetData);
                $scope.dataSource = screenBox($scope.targetData,$scope.sourceData);
                leftInit();
            }
            $scope.transferLeft = () => {
                $scope.selectRightData.map(item=>{
                    item.check = false;
                });
                $scope.dataSource = $scope.selectRightData.concat($scope.dataSource);
                $scope.targetData = screenBox($scope.dataSource,$scope.sourceData);
                rightInit();
            }

            // 还原初始化数据
            function leftInit(){
                $scope.selectLeftData = [];
                $scope.leftSelectType = false;
                $scope.leftNum = 0;
            }

            function rightInit(){
                $scope.selectRightData = [];
                $scope.rightSelectType = false;
                $scope.rightNum = 0;
            }
            
            function screenBox (arr1,arr2){
                var data = [];                
                var idSet = arr1.reduce((acc, v) => {
                    acc[v[$scope.screenKey]] = true;
                    return acc;
                }, {});
                data = arr2.filter(v => !idSet[v[$scope.screenKey]]);
                return data;
            }

        },
      };
    },
  ]);
};
