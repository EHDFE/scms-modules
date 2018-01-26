/**
 * 
 * @description 左则栏
 * @date 2016-12-20
 * @author 田艳容
 * @lastBy 
 * @html 
 */
define([
    'angular',
    './template.html'
], function(
    angular,
    html,
    css) {
    return function(app, elem, attrs, scope) {
        app.directive('mainNavDirective', ['$rootScope', function($rootScope) {
            return {
                template: html,
                restrict: 'EA',
                replace: true,
                scope: {
                    navs: '=',
                    callback: '='
                },
                link: function postLink($scope, $element, $attrs) {
                    
                },

                controller: function($scope,$element,$attrs){
                    $scope.callback = $scope.callback || function() {};
                    //切换路由时，更新菜单
                    $scope.navs = $scope.navs || [];

                    var $preActiveEl;
                    $scope.checked = function($event, children) {
                        var $el = $($event.currentTarget);
                        var $parent = $el.parent();
                        var className;
                        if(children && children.length) {
                            var className = 'active';
                        }
                        else {
                            className = 'activeB';
                            if($preActiveEl) {
                                $preActiveEl.removeClass(className);
                            }
                            $preActiveEl = $parent;
                        }
                        if($parent.hasClass(className)) {
                            $parent.removeClass(className);
                        }
                        else {
                            $parent.addClass(className);
                        }

                        var $preEl = $el.find('[aria-expanded="true"]');
                        if($preEl && $preEl.length) {
                            $preEl.collapse('hide');
                            $preEl.parent().removeClass('active');
                        }
                        
                        $el.next().collapse('toggle');
                        if($el.next().attr('aria-expanded') === 'true') {
                            $el.parent().addClass('active');
                        }
                        else {
                            $el.parent().removeClass('active');
                        }
                    }
                    
                    

                    $scope.toggleLock = function() {
                        var isShrink = $element.hasClass('shrink');
                        var $content = $('#content');
                        if(isShrink) {
                            $element.removeClass('shrink');
                            $content.removeClass('contentShrink');
                        }
                        else {
                            $element.addClass('shrink');
                            $content.addClass('contentShrink');
                        }
                    }

                }
            };
        }]);
    }
});