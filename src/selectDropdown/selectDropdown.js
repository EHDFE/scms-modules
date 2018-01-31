/**
 * <directive>
 * @name selector 选择器
 * @description 选择器
 * @date 2018-1-19
 * @author 程乐
 * @lastBy 
 * @html 
 */

import html from './selectDropdown.html';

export default function(app, elem, attrs, scope) {
    app.directive('selectDropdown', ['$timeout', '$rootScope', function($timeout, $rootScope) {
        return {
            template: html,
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                dropData: '=',//dropData 
                checkedItem:'=',
                onChange: '@',
                disabled: '='
            },
            link: function($scope, $element, $attrs) {
                console.log($scope.dropData)
            },

            controller: function($scope,$element,$attrs){
                if(!$scope.checkedItem) {
                    $scope.checkedItem = $scope.dropData[0];
                    $scope.itemIndex = 0;
                }
                $scope.checked = function(item,index) {
                    $scope.checkedItem = item;
                    $scope.itemIndex = index;
                }
                $scope.$watch('checkedItem.name',function(newValue, oldValue){
                    if(newValue != oldValue) {
                        $('li',$element).each(function(){
                            if($(this).text().indexOf(newValue) == -1){
                                $(this).hide();
                            }else{
                                $(this).show();
                            }
                        });
                        var type = false;
                        $('li',$element).each(function(){
                            if($(this).css('display') == 'none'){
                                type = true;
                            }else{
                                type = false;
                                return false;
                            }
                        });
                        if(type){
                            if(!$('.EUi-select-none',$element)[0]){
                                $('.dropdown-menu',$element).append('<p class="EUi-select-none">无匹配选项</p>');
                            }
                        }else{
                            $('.EUi-select-none',$element).remove();
                        }
                    }
                    if(!newValue){
                        $('li',$element).show();
                    }
                });
                $('input',$element).focus(function(){
                    if(!$element.hasClass('EUi-select-disabled')){
                        $('li',$element).show();
                        $('.EUi-select-none',$element).remove();
                    }
                    return false;
                });
            }
        };
    }]);
}