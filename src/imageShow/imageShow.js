/**
 * <directive>
 * @description 图片展示
 * @date 2017-08-03
 * @author 程乐
 * @lastBy 
 * @html <img image-show img-url="item.imageurl" alt-text="'卸货凭证'" text-only="显示文字" bg-click="false">
 */
define([
    'angular',
    './imageShow.html',
    './imageShow.css'
    ], function(
        angular,
        html,
        css) {
        return function(app, elem, attrs, scope) {
            app.directive('imageShow', ['$timeout', '$document', '$compile',
                function($timeout, $document, $compile) {
                    return {
                        template: html,
                        restrict: 'EA',
                        replace: true,
                        scope: {
                            imgUrl: '=',
                            altText: '=',
                            textOnly: '=',
                            bgClick: '=',
                            customCss: '=',
                            clickFun:'=',
                            miniImg: '='
                        },
                        link: function postLink() {

                        },

                        controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                            if($scope.miniImg){
                                if($scope.imgUrl.substr(-4,4) == '.png'){
                                    $scope.miniImgUrl = $scope.imgUrl.replace('.png','_100x100.png');
                                }else if($scope.imgUrl.substr(-4,4) == '.jpg'){
                                    $scope.miniImgUrl = $scope.imgUrl.replace('.jpg','_100x100.jpg');
                                }else if($scope.imgUrl.substr(-4,4) == '.gif'){
                                    $scope.miniImgUrl = $scope.imgUrl.replace('.gif','_100x100.gif');
                                }
                            }
                            // $scope.customCss = $scope.customCss || false;
                            var html = $compile('<div class="imgUrlBox"><a href="javascript:;" class="imgShowClosBtn"></a><img></div>')($scope);

                            if($('.imgUrlBox').length<=0){
                                $document.find('body').append(html);
                                $document.find('body').append('<div class="modal-backdrop fade in" style="z-index: 9999;opacity: 0; display:none;" id="imgUrlBoxBG"></div>');
                            }
                            
                            // $scope.altText = $scope.altText || '';
                            $scope.imgClick = function($event,url){
                                var x= $event.pageX|| $event.clientX+$(window).scrollLeft();
                                var y= $event.pageY|| $event.clientY+$(window).scrollTop();

                                $('.imgUrlBox').css({position:'absolute',top:y,left:x,width:'1px',height:'1px',overflow:'hidden'});
                                $('.imgUrlBox img').remove();
                                $('.imgUrlBox').append("<img src="+url+">");//添加大图
                                $('.imgUrlBox').show();

                                // $timeout(function(){                                    

                                    var windowW = $(window).width();
                                    var windowH = $(window).height();
                                    var realWidth = $('.imgUrlBox img').width();
                                    var realHeight = $('.imgUrlBox img').height();

                                    // console.log(realWidth)
                                    // $('.imgUrlBox img').css({top:y,left:x,width:'1px',height:'1px'});
                                    var imgWidth, imgHeight;  
                                    var scale = 0.9;
                                    if(realHeight>windowH*scale) {
                                        imgHeight = windowH*scale;
                                        imgWidth = imgHeight/realHeight*realWidth;
                                        if(imgWidth>windowW*scale) {
                                            imgWidth = windowW*scale;
                                        }  
                                    } else if(realWidth>windowW*scale) {
                                        imgWidth = windowW*scale;
                                        imgHeight = imgWidth/realWidth*realHeight;
                                    } else {
                                        imgWidth = realWidth;  
                                        imgHeight = realHeight;  
                                    }  
                                    
                                    var w = (windowW-imgWidth)/2;
                                    var h = (windowH-imgHeight)/2;
                                    // $('.imgUrlBox img').css({"top":h, "left":w, "width":imgWidth});
                                    var x2=windowW/2-realWidth/2+$(window).scrollLeft();//在屏幕居中的坐标
                                    var y2=windowH/2-realHeight/2+$(window).scrollTop();
                                    $('.imgUrlBox img').css({width:'100%'});
                                    $('.imgUrlBox').animate({left:w,top:h,width:imgWidth,height:imgHeight},200,function(){
                                        $('#imgUrlBoxBG').show().css({opacity: .8});
                                    });
                                    // $('.imgUrlBox').css({"top":h, "left":w, "width":'100%'});

                                    // $('.imgUrlBox').animate({left:w,top:h,width:imgWidth},300);
                                    
                                // },0);
                            }
                            $scope.clickFun= $scope.clickFun ;
                            if($scope.clickFun){
                                $scope.clickFun.imgClick = $scope.imgClick;
                            }
                            
                            $('.imgUrlBox .imgShowClosBtn').on('click',function(){
                                $('#imgUrlBoxBG').css({opacity: 0}).hide();
                                $('.imgUrlBox').hide();
                                $('.imgUrlBox img').css("width",'');
                                return false;
                            });
                            if($scope.bgClick){
                                $('body').on('click','#imgUrlBoxBG',function(){
                                    $('#imgUrlBoxBG').css({opacity: 0}).hide();
                                    $('.imgUrlBox').hide();
                                    $('.imgUrlBox img').css("width",'');
                                    return false;
                                });
                            }

                            $scope.$on('$destroy',function(){
                                $document.find('.imgUrlBox').remove();
                            });

                        }
                    };
                }]);
    };
});