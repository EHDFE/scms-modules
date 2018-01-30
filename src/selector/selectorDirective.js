/**
 * <directive>
 * @name selector 选择器
 * @description 选择器
 * @date 2018-1-19
 * @author 程乐
 * @lastBy 
 * @html 
 */
define([
    'angular'
], function(
    angular
    ) {
    return function(app, elem, attrs, scope) {
        app.directive('selectorDirective', ['$timeout', function($timeout) {
            return {
                // template: '<input type="text" placeholder="请选择城市" ng-model="text" ><i class="EUi-select-icon"></i><div class="EUi-select-content"><dl><dd ng-repeat="item in items" data-value="{{ item.value }}">{{ item.text }}</dd></dl></div>',
				restrict: 'A',
				replace: true,
                scope: {
                    value: '=',
                    text: '=',
                    items: '='
                    // query: '='
                },
                link: function($scope,$element,$attrs) {
                    $timeout(()=>{
                        if($scope.text){
                            $('.EUi-select-content dd',$element).each(function(){
                                if($(this).text() == $scope.text){
                                    $(this).addClass('active');
                                    return false;
                                }
                            });
                        }
                        $(document).on('click',function(){
                            $(".EUi-select-content").hide();
                            $scope.text = $('.EUi-select-content .active',$element).text();
                            $scope.value = $('.EUi-select-content .active',$element).attr('data-value');
                            $scope.$apply();
                        });

                        $($element).on('click',function(){
                            if(!$element.hasClass('EUi-select-disabled')){
                                $('.EUi-select-content dd',$element).show();
                                $(".EUi-select-content",$element).show();
                            }
                            return false;
                        });

                        $scope.$watch('text',function(newValue, oldValue){
                            // if($scope.query){
                                if(newValue != oldValue) {
                                    $('.EUi-select-content dd',$element).each(function(){
                                        if($(this).text().indexOf($scope.text) == -1){
                                            $(this).hide();
                                        }else{
                                            $(this).show();
                                        }
                                    });
                                    var type = false;
                                    $('.EUi-select-content dd',$element).each(function(){
                                        if($(this).css('display') == 'none'){
                                            type = true;
                                        }else{
                                            type = false;
                                            return false;
                                        }
                                    });
                                    if(type){
                                        if(!$('.EUi-select-none',$element)[0]){
                                            $('.EUi-select-content',$element).append('<p class="EUi-select-none">无匹配选项</p>');
                                        }
                                    }else{
                                        $('.EUi-select-none',$element).remove();
                                    }
                                }
                                if(!newValue){
                                    $('.EUi-select-content dd',$element).show();
                                }
                            // }
                        });

                        $('input, .EUi-select-icon',$element).hover(function(){
                            if($scope.text && !$element.hasClass('EUi-select-disabled')){
                                $('.EUi-select-icon',$element).addClass('hover');
                            }
                        },function(){
                            $('.EUi-select-icon',$element).removeClass('hover');
                        });

                        $($element).on('click','i.hover',function(){
                            $scope.text = '';
                            $scope.value = '';
                            $(this).removeClass('hover');
                            $('.EUi-select-content dd',$element).removeClass('active');
                            $scope.$apply();
                        });

                        $('.EUi-select-content',$element).on('click','dd',function(){
                            $('.EUi-select-content dd',$element).removeClass('active');
                            $(this).addClass('active');
                            var val = $(this).attr('data-value');
                            var text= $(this).text();
                            $scope.text = text;
                            $scope.value = val;
                            $scope.$apply();
                            $(".EUi-select-content",$element).hide();
                            $('.EUi-select-content dd',$element).show();
                            return false;
                        });

                    },100);

                    
                },

                controller: function($scope,$element,$attrs){
                }
            };
        }]);
    };
});
