/**
 * <directive>
 * @description 导出列表
 * @date 2018-03-13
 * @author 程乐
 * @lastBy
 * @html 
 */
export default (app, elem, attrs, scope) => {
    app.directive('circleSchedule', [function () {
        return {
            // template: '<div></div>',
            restrict: 'EA',
            replace: true,
            scope: {
                percent: '=',	// 百分比
                ops: '='
            },
            link: function postLink($scope, $element, $attrs) {

            },

            controller($scope, $element, $attrs, $transclude, $log, $http, G) {
                var defaultSetting={
                        circleBottomColor:"#f2f2f2",//圆环底色
                        innerColorStart:'#ffdd00',  //内部圆环 渐变色开始
                        innerColorEnd:'#fc7d37' //内部圆环 渐变色结束
                    };
                var option=$.extend({},defaultSetting,$scope.ops);
                
                var obj=option.obj;
                var innerColorStart=option.innerColorStart;
                var innerColorEnd=option.innerColorEnd;
                var circleBottomColor=option.circleBottomColor;
                
                var preA=Math.PI/180;
                
                var canvasC=$($element)[0];
                /*控制运动*/
                var context=canvasC.getContext('2d');
                var windowW=parseInt($(canvasC).parent().width());
                var lineW1=15;
                var lineW0=5;
                var R1;
                // if(windowW>500){
                //     lineW1=15;
                //     // lineW0=1;
                // }
                var canvasW=canvasC.width;
                var R1=parseInt(canvasW/2-lineW1-lineW0-10);
                var ra=parseInt(canvasW/2-lineW0/2-5);
                var canvasH=canvasW;
                var rotateAngle=$scope.percent*360;
                var anotherA=0;
                if($scope.percent>0.5){
                    anotherA=($scope.percent-0.5)*360*preA;
                }
                var rotataRadians=preA*rotateAngle;

                var x=canvasC.width/2;
                var y=canvasC.height/2;
                var startAa=-Math.PI/2;
                var startA=0;
                var Timer;
                var preSceond=100/(Math.PI*2);
            
                function drawScreen(){
                    if(startA<rotataRadians){
                        startA+=0.1;
                    }

                    context.fillStyle="#ffffff";
                    context.fillRect(0,0,canvasC.width,canvasC.height);
                    
                    context.save();
                    context.setTransform(1,0,0,1,0,0);
                    context.fillStyle="#ffffff";
                    context.fillRect(0,0,canvasC.width,canvasC.height);
                    context.translate(x,y);
                    context.rotate(-Math.PI/2);

                    //中环
                    context.beginPath();
                    context.strokeStyle=circleBottomColor;
                    context.lineWidth=lineW1;
                    context.arc(0,0,R1,0,Math.PI*2,false);
                    context.stroke();
                    context.closePath();
                    context.beginPath();
                    
                    var gradient2 = context.createLinearGradient(R1, 0,-R1,0);
                    gradient2.addColorStop(0, innerColorStart);
                    gradient2.addColorStop(1, innerColorEnd);
                    context.lineCap="round";
                    context.strokeStyle=gradient2;
                    context.lineWidth=lineW1;
                    context.arc(0,0,R1,0,startA,false);
                    context.stroke();
                    context.closePath();
                    
                
                    
                
                    //画图
                    if(startAa<rotataRadians-Math.PI/2){
                        startAa+=0.1;
                    }else{
                        clearInterval(Timer);
                    }
                    
                    context.save();
                    context.setTransform(1,0,0,1,0,0);
                    var ax=ra*Math.cos(startAa) ;
                    var ay=ra*Math.sin(startAa) ;
                    context.translate(x+ax,y+ay);
                    context.rotate(startAa);
                    context.restore();
                }
                drawScreen();
                Timer=setInterval(drawScreen,20);
            }
        };
    }]);
};
