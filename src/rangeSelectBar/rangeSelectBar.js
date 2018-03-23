import './rangeSelectBar.css';
import moment from 'moment';
import html from './rangeSelectBar.html';

export default (app, elem, attrs, scope) => {
  app.directive('rangeSelectBar', ['$document', '$interval', function($document,$interval){
    return {
      template: html,
      restrict: 'EA',
      scope: {
        rangeType: '@',
        onChange: '&',
      },
      replace: true,
      controller: function($scope, $timeout) {
        $scope.cursorOffsetLeft = {};
        $scope.cursorOffsetRight = {};
        $scope.cursorOffsetPanel = {};

        var HOUR_ITERIATE_TICKS = [];
        var i = 0;
        while (i <= 24) {
          if (i % 3 === 0) {
            HOUR_ITERIATE_TICKS.push({
              label: i + ':00',
              showLabel: true,
              value: i,
              half: false,
            });
          // } else if (Math.round(i) === i) {
          } else {
            HOUR_ITERIATE_TICKS.push({
              label: i + ':00',
              showLabel: false,
              value: i,
              half: false,
            });
          // } else {
          //   HOUR_ITERIATE_TICKS.push({
          //     label: Math.floor(i) + ':30',
          //     showLabel: false,
          //     value: i,
          //     half: true,
          //   });
          }
          // i += 0.5;
          i += 1;
        }

        $scope.playing = false;
        const TYPE = {
          'MONTH': 'date',
          'DAY': 'hour'
        };

        // 开始播放
        $scope.startPlay = function(){
          $scope.playing = true;
          replay();
        };
        // 停止播放
        $scope.stopPlay = function(){
          $scope.playing = false;
          $scope.cursorOffsetPanel.backgroundPositionX = 0;
          replayTimer && clearInterval(replayTimer);
        };

        /**
         * 触发范围变化
         */
        function dispatchChangeEvent() {
          $scope.onChange({
            startMoment: $scope.startMoment,
            endMoment: $scope.endMoment,
          });
        }

        var replayTimer;
        function replay() {
          var step;
          var stepWidth = $('.range-select-tick').width();
          var totalWidth = $('.tick-cursor').width();
          var arrived = false;
          $scope.cursorOffsetPanel.backgroundPositionX = 0;
          var endMoment = $scope.startMoment.clone();
          var startMoment = $scope.startMoment.clone();
          if ($scope.rangeType === 'DAY') {
            step = {
              hours: 1
            };
          } else if ($scope.rangeType === 'MONTH') {
            step = {
              days: 1
            };
          }
          replayTimer && clearInterval(replayTimer);
          replayTimer = $interval(function(){
            if (!$scope.endMoment.isBefore(endMoment)) {
              $scope.onChange({
                startMoment: startMoment,
                endMoment: endMoment,
              });
              if (!arrived) {
                $scope.cursorOffsetPanel.backgroundPositionX += stepWidth;
                if (Math.abs(totalWidth - $scope.cursorOffsetPanel.backgroundPositionX) < stepWidth) {
                  arrived = true;
                }
              } else {
                $scope.cursorOffsetPanel.backgroundPositionX = totalWidth;
              }
              startMoment.add(step);
              endMoment.add(step);
            } else {
              replayTimer && $interval.cancel(replayTimer);
              $scope.playing = false;
              $scope.cursorOffsetPanel.backgroundPositionX = 0;
            }
          }, 500);
        }

        var resizeTimer;
        $(window).on('resize', function(){
          resizeTimer && clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function(){
            try{
              setCursorPosition($scope.startMoment, 'start');
              setCursorPosition($scope.endMoment, 'end');
            }catch(e){

            }
          }, 300);
        });
        $scope.$on('$destroy', function(){
          $(window).off('resize');
        }); 

        var now = moment();
        initialize($scope.rangeType);
        dispatchChangeEvent();

        $scope.$watch('rangeType', function(type){
          initialize(type);
        });

        $scope.clickTimes = 0;
        
        $scope.setTick = function(tickValue, disable) {
          if (disable) return;
          //选择时间
          $scope.clickTimes ++;
          if($scope.clickTimes%2 > 0) {
            $scope.startMoment[TYPE[$scope.rangeType]](tickValue);
            setCursorPosition($scope.startMoment, 'start');
            $scope.endMoment[TYPE[$scope.rangeType]](tickValue);
            setCursorPosition($scope.endMoment, 'end', 'oneClick');
          }
          else {
            if($scope.startMoment[TYPE[$scope.rangeType]]() > tickValue) {
              $scope.endMoment[TYPE[$scope.rangeType]]($scope.startMoment[TYPE[$scope.rangeType]]());
              $scope.startMoment[TYPE[$scope.rangeType]](tickValue);
              setCursorPosition($scope.startMoment, 'start');
              setCursorPosition($scope.endMoment, 'end');
            }
            else {
              $scope.endMoment[TYPE[$scope.rangeType]](tickValue);
              setCursorPosition($scope.endMoment, 'end');
            }
            dispatchChangeEvent();
          }          
        };

        $scope.mouseenterTick = function(tickValue, disable) {
          if (disable) return;
          //选择时间
          if ($scope.rangeType === 'DAY') {
            if($scope.clickTimes%2 > 0) {
              setCursorPosition(moment({hour:tickValue}), 'end', 'hove');
            }
          } else if ($scope.rangeType === 'MONTH') {//选择日期
            if($scope.clickTimes%2 > 0) {
              setCursorPosition(moment({year:$scope.endMoment.year(), month: $scope.endMoment.month(), date:tickValue}), 'end', 'hove');
            }
          }
        };

        $scope.onJump = function(delta, level) {
          var action, unit;
          if (delta === -1) {
            action = 'subtract';
          } else {
            action = 'add';
          }
          if ($scope.rangeType === 'MONTH') {
            $scope.startMoment[action](1, level === 1 ? 'M': 'y');
            $scope.endMoment[action](1, level === 1 ? 'M': 'y');
            $scope.displayMoment = $scope.startMoment.format('YYYY年MM月');
            updateMonthTicks();
          } else if ($scope.rangeType === 'DAY') {
            $scope.startMoment[action](1, level === 1 ? 'd': 'M');
            $scope.endMoment[action](1, level === 1 ? 'd': 'M');
            $scope.displayMoment = $scope.startMoment.format('YYYY年MM月DD日');
            updateDayTicks();
          }
          dispatchChangeEvent();
          setCursorPosition($scope.startMoment, 'start');
          setCursorPosition($scope.endMoment, 'end');
        }

        function updateMonthTicks() {
          var date = 1;
          var year = $scope.startMoment.year();
          var month = $scope.startMoment.month();
          var activeDate = $scope.startMoment.date();
          var lastDay = $scope.startMoment.clone().endOf('month').date();
          var ticks = [];
          var disable;
          while (date <= lastDay) {
            disable = moment({
              year: year,
              month: month,
              day: date
            }).isAfter(now);
            ticks.push({
              label: date,
              showLabel: true,
              value: date,
              half: false,
              // active: !disable && date === activeDate,
              disable: disable,
            });
            date += 1;
          }
          $scope.iterateTicks = ticks;
        }

        function updateDayTicks() {
          var year = $scope.startMoment.year();
          var month = $scope.startMoment.month();
          var date = $scope.startMoment.date();
          var compareMoment, disable;
          $scope.iterateTicks = HOUR_ITERIATE_TICKS.map(function(d){
            compareMoment = moment({
              year: year,
              month: month,
              day: date,
              hour: d.value
            });
            disable = compareMoment.isAfter(now);
            // d.active = !disable && $scope.startMoment.hour() === d.value;
            d.disable = disable;
            return d;
          });
        }

        $scope.cursorOffsetPanel = {
          left: 0,
          right: 0,
          backgroundPositionX: 0
        };
        
        function setCursorPosition(momentData, tickType, type) {
          var tickIndex;

          if($scope.rangeType === 'DAY') {
            var minute = momentData.minute();
            if (minute === 59) {
              tickIndex = $scope.iterateTicks.length - 1;
            }
          }

          if(!tickIndex) {
            var data = momentData[TYPE[$scope.rangeType]]();
            $scope.iterateTicks.some(function(d, i){
              if (d.value === data) {
                tickIndex = i;
                return true;
              }
            });
          }

          $timeout(function(){
            try{
              var $tick = $('.pick-bar-track .range-select-tick').eq(tickIndex);
              var $tickLine = $tick.find('.tick-line');
              var tickTrackRect = $('.pick-bar-track')[0].getBoundingClientRect();
              var tickLineRect = $tickLine[0].getBoundingClientRect();
              if (tickType === 'start') {
                $scope.cursorOffsetLeft.left = tickLineRect.left - tickTrackRect.left;
                $scope.cursorOffsetPanel.left = $scope.cursorOffsetLeft.left;
              } else if (tickType === 'end') {
                $scope.cursorOffsetRight.left = type === 'oneClick' ? $scope.cursorOffsetLeft.left : tickLineRect.left - tickTrackRect.left;
                $scope.cursorOffsetPanel.overflow = 'hidden';
                
                if(momentData[TYPE[$scope.rangeType]]() < $scope.startMoment[TYPE[$scope.rangeType]]()) {
                  $scope.cursorOffsetPanel.width = type === 'oneClick' ? 0 : $scope.cursorOffsetLeft.left - (tickLineRect.left - tickTrackRect.left);
                  $scope.cursorOffsetPanel.right = tickTrackRect.right - tickTrackRect.left - $scope.cursorOffsetLeft.left;
                  $scope.cursorOffsetPanel.left = 'auto';
                }
                else {
                  $scope.cursorOffsetPanel.width = type === 'oneClick' ? 0 :  $scope.cursorOffsetRight.left - $scope.cursorOffsetLeft.left;
                  $scope.cursorOffsetPanel.left = $scope.cursorOffsetLeft.left;
                  $scope.cursorOffsetPanel.right = 'auto';
                }
              }
            }catch(e){

            }
          });
        }


        
        function initialize(type) {
          var cur = {
            hour: moment().hour(),
            minute: 0,
            seconds: 0,
            milliseconds: 0,
          };
          if (type === 'MONTH') {
            if (moment().date() === 1) {
              $scope.startMoment = moment(cur);
              $scope.endMoment = moment(cur).add(1, 'days');
            } else {
              $scope.startMoment = moment(cur).subtract(1, 'days');
              $scope.endMoment = moment(cur);
            }
            $scope.displayMoment = $scope.startMoment.format('YYYY年MM月');
            updateMonthTicks();
          } else if (type === 'DAY') {
            if (cur.hour === 0) {
              $scope.startMoment = moment(cur);
              $scope.endMoment = moment(cur).add(1, 'hours');
            } else {
              $scope.startMoment = moment(cur).subtract(1, 'hours');
              $scope.endMoment = moment(cur);
            }
            $scope.displayMoment = $scope.startMoment.format('YYYY年MM月DD日');
            updateDayTicks();
          }
          setCursorPosition($scope.startMoment, 'start');
          setCursorPosition($scope.endMoment, 'end');
        }

        //$scope.$watch('cursorOffset.right',function(newValue,oldValue){
          //$scope.rightBarOffset = {right : $scope.cursorOffset.right};
        //});

      }
    };
  }]);
};
