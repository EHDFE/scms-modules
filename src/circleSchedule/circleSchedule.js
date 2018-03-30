/**
 * <directive>
 * @description 导出列表
 * @date 2018-03-13
 * @author 程乐
 * @lastBy
 * @html <canvas circle-schedule percent="percent" ops="ops"  id="canvas1" width="200" height="200" ></canvas>
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
                
                function circleSchedule(ele,ops,percent){
                    this.canvasC = $(ele)[0];
                    this.context = this.canvasC.getContext('2d');
                    this.defaultSetting={
                            circleBottomColor:"#f2f2f2",//圆环底色
                            innerColorStart:'#ffdd00',  //内部圆环 渐变色开始
                            innerColorEnd:'#fc7d37', //内部圆环 渐变色结束
                            lineW: 20
                        };
                        
                    this.option=$.extend({},this.defaultSetting,ops);
                    this.preA=Math.PI/180;
                    
                    this.R1=parseInt(this.canvasC.width/2-this.option.lineW);
                    this.init(percent);
                }
                circleSchedule.prototype = {
                    init: function(percent){
                        this.canvasC.height = this.canvasC.height;
                        var rotateAngle = percent*360;
                        this.rotataRadians = this.preA*rotateAngle;
                        this.x=this.canvasC.width/2;
                        this.y=this.canvasC.height/2;
                        this.startAa=-Math.PI/2;
                        this.startA=0;
                        this.Timer;
                        this.drawing(1);
                        this.Timer=setInterval(()=>{
                            this.drawing(2);
                        },20);
                    },
                    drawing: function(type){
                        if(this.startA < this.rotataRadians){
                            this.startA+=0.1;
                        }
                        this.context.save();
                        this.context.setTransform(1,0,0,1,0,0);
                        this.context.fillStyle="rgba(255, 255, 255, 0)";
                        this.context.fillRect(0,0,this.canvasC.width,this.canvasC.height);
                        this.context.translate(this.x,this.y);
                        this.context.rotate(-Math.PI/2);

                        if(type === 1){
                            //底环
                            this.context.beginPath();
                            this.context.strokeStyle=this.option.circleBottomColor;
                            this.context.lineWidth = this.option.lineW;
                            this.context.arc(0,0,this.R1,0,Math.PI*2,false);
                            this.context.stroke();
                            this.context.globalCompositeOperation = 'source-atop';
                            this.context.closePath();
                        }

                        this.context.beginPath();
                        var gradient2 = this.context.createLinearGradient(this.R1, 0,-this.R1,0);
                        gradient2.addColorStop(0, this.option.innerColorStart);
                        gradient2.addColorStop(1, this.option.innerColorEnd);
                        this.context.lineCap="round";
                        this.context.strokeStyle=gradient2;
                        this.context.lineWidth = this.option.lineW;
                        this.context.arc(0,0,this.R1,0,this.startA,false);
                        this.context.stroke();
                        this.context.closePath();
                    
                        //画图
                        if(this.startAa < this.rotataRadians-Math.PI/2){
                            this.startAa+=0.1;
                        }else{
                            clearInterval(this.Timer);
                        }
                    },
                    updata: function(percent){
                        clearInterval(this.Timer);
                        this.init(percent);
                    }
                }
                $scope.circleSchedule = new circleSchedule($element, $scope.ops, $scope.percent);
                $scope.$watch('percent',(newValue, oldValue) => {
                    if (newValue != oldValue) {
                        $scope.circleSchedule.updata($scope.percent);
                    }
                });
            }
        };
    }]);
};
