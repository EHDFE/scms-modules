/**
 * <directive>
 * @description 信息提示
 * @date 2016-12-01
 * @author 黄思飞
 * @lastBy 
 * @html <i class="fa fa-question-circle" tooltip="tooltip" tooltip-position="tooltipPosition"></i>
 */
export default (app, elem, attrs, scope) => {
        app.directive('tooltip', ['$document', '$compile',
            function($document, $compile) {
            return {
                scope: true,
                restrict: 'A',
                scope: {
                    tooltip:'@',    //@scope tooltip 提示的文本内容 {type: "string", "exampleValue": "这是一个小tip"}
                    tooltipPosition: '=',    //@scope tooltipPosition 提示弹框的位置 {type: "string", "exampleValue": "left", defaultValue: "down"}
                },
                link: function postLink($scope,$element,$attrs) {
                    var tip = $compile('<div ng-class="tipClass"><div ng-bind-html="text"></div><div class="tooltip-arrow"></div></div>')($scope),
                        tipClassName = 'tooltip',
                        tipActiveClassName = 'tooltip-show',
                        initialClassName = '',
                        newClassName = '';

                    $scope.tipClass = [tipClassName];
                    $scope.text = $scope.tooltip;
                  
                    if($scope.tooltipPosition||$attrs.position){
                      $scope.tipClass.push('tooltip-' + ($scope.tooltipPosition||$attrs.position));
                    }else{
                     $scope.tipClass.push('tooltip-down'); 
                    }
                    $document.find('body').append(tip);
                  
                    $element.bind('mouseover', function (e) {
                        tip.addClass(tipActiveClassName);
                        e.stopPropagation();

                        var pos = e.target.getBoundingClientRect(),
                            offset = tip.offset(),
                            tipHeight = tip.outerHeight(),
                            tipWidth = tip.outerWidth(),
                            elWidth = pos.width || pos.right - pos.left,
                            elHeight = pos.height || pos.bottom - pos.top,
                            tipOffset = 15,
                            scrollWidth = $('body')[0].scrollWidth;

                        if(tip.hasClass('tooltip-right')&&(pos.right + tipOffset + tipWidth>=scrollWidth)){
                          tip.removeClass('tooltip-right');
                          tip.addClass('tooltip-left');
                          initialClassName = 'tooltip-right';
                          newClassName = 'tooltip-left';
                        }
                        if(tip.hasClass('tooltip-left')&&(pos.left - tipOffset - tipWidth<=0)){
                          tip.removeClass('tooltip-left');
                          tip.addClass('tooltip-right');
                          initialClassName = 'tooltip-left';
                          newClassName = 'tooltip-right';
                        }
                        if(tip.hasClass('tooltip-down')&&(pos.left - tipWidth/2<=0)){
                          tip.removeClass('tooltip-down');
                          tip.addClass('tooltip-right');
                          initialClassName = 'tooltip-down';
                          newClassName = 'tooltip-right';
                        }
                        if(tip.hasClass('tooltip-down')&&(pos.right + tipWidth/2>=scrollWidth)){
                          tip.removeClass('tooltip-down');
                          tip.addClass('tooltip-left');
                          initialClassName = 'tooltip-down';
                          newClassName = 'tooltip-left';
                        }

                        if(tip.hasClass('tooltip-right')) {
                          offset.top = pos.top - (tipHeight / 2) + (elHeight / 2);
                          offset.left = pos.right + tipOffset;
                        }else if(tip.hasClass('tooltip-left')) {
                          offset.top = pos.top - (tipHeight / 2) + (elHeight / 2);
                          offset.left = pos.left - tipWidth - tipOffset;
                        }else if(tip.hasClass('tooltip-down')) {
                          offset.top = pos.top + elHeight + tipOffset;
                          offset.left = pos.left - (tipWidth / 2) + (elWidth / 2);
                        }else{
                          offset.top = pos.top - tipHeight - tipOffset;
                          offset.left = pos.left - (tipWidth / 2) + (elWidth / 2);
                        }

                        tip.offset(offset);
                  });
                  
                  $element.bind('mouseout', function (e) {
                    tip.removeClass(tipActiveClassName);
                    tip.addClass(initialClassName);
                    tip.removeClass(newClassName);
                  });

                  tip.bind('mouseover', function (e) {
                    tip.addClass(tipActiveClassName);
                  });

                  tip.bind('mouseout', function () {
                    tip.removeClass(tipActiveClassName);
                    tip.addClass(initialClassName);
                    tip.removeClass(newClassName);
                  });

                  $scope.$on('$destroy',function(){
                    $document.find('.tooltip').remove();
                  });
                },

                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                }
            };
        }]);
    };