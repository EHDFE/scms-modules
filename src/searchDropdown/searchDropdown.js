/**
 * <directive>
 * @description 搜索下拉
 * @date 2017-04-19
 * @author 黄思飞
 * @lastBy 
 * @html <search-dropdown display-text="displayText" is-error-inline="isErrorInline" item-selected="itemSelected" list="list"></search-dropdown>
 * @htmlUrl scmsModules/searchDropdown/searchDropdown.html
 */
import './searchDropdown.css';
import html from './searchDropdown.html';
export default (app, elem, attrs, scope) => {
        app.directive('searchDropdown', ['$timeout', function($timeout) {
            return {
                template: html,
                restrict: 'EA',
                replace: false,
                scope: {
                    list: '=',          //@scope list 搜索列表 {type: "array", "exampleValue": [{text:'第一项'},{text:'第二项'},{text:'第三项'}]}
                    itemSelected: '=',  //@scope itemSelected 所选元素 {type: "string","exampleValue":""}
                    isOptional: '=',    //@scope isOptional 是否必填 {type: "boolean", "exampleValue": true}
                    isErrorInline: '=', //@scope isErrorInline 错误信息是否在同一行 {type: "boolean", "exampleValue": true}
                    searchFromApi: '=', //@scope searchFromApi 搜索列表是否从服务端获取 {type: "function"}
                    displayText: '@',   //@scope displayText 显示文本属性名 {type: "string", "exampleValue":"text"}
                    searchType: '@',    //@scope searchType 显示文本属性名 {type: "string", "exampleValue":"text"}
                    isReadonly: '=',    //@scope isReadonly 是否只读 {type: "string", "exampleValue": true, defaultValue: false}
                    maxlen: '='         //@scope maxlen 搜索最长长度 {type: "string", "exampleValue":"20"}
                },
                link: function($scope, $element, $attrs) {

                },
               
                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                    $scope.onItemClick = function(item){
                        $scope.itemSelected = item;
                    }; 

                    $scope.toggleDropdown = function($event){
                        $scope.searchItem = '';
                        if($scope.searchFromApi){
                            $scope.list = [];
                            var target = $event.target;
                            if(!!target.attributes[3].value){
                                $scope.searchFromApi('', $scope.searchType);
                            }
                        }
                    };

                    $scope.$watch('searchItem',function(newValue, oldValue){
                        if($scope.searchFromApi && (newValue||oldValue)){
                            $timeout.cancel($scope.timer);
                            $scope.timer = $timeout(function(){
                                $scope.searchFromApi(newValue, $scope.searchType);
                            },500);  
                        }
                    });
                }
            };
        }]);
    }