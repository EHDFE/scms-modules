/**
 * <directive>
 * @description 周选择
 * @date 2017-6-6
 * @author 程乐
 * @lastBy
 * @html <input class="form-control input-week" week-picker-directive ng-model="ngModel" week-data="week" default-week="defaultWeek"><span ng-if="week.week">(第{{week.week}}周)</span>
 */
export default (app, elem, attrs, scope) => {
  app.directive('weekPickerDirective', [
    'G',
    '$rootScope',
    function(G, $rootScope) {
      return {
        require: '?ngModel',
        scope: {
          ngModel: '=',
          weekData: '=',
          defaultWeek: '=',
        },
        restrict: 'EA',
        controller: [
          '$scope',
          '$element',
          '$attrs',
          function($scope, $element, $attrs) {
            $scope.weekData = $scope.weekData || {};
            $element
              .datetimepicker({
                format: 'YYYY-MM-DD',
                calendarWeeks: true,
                language: 'zh-cn',
              })
              .each(function() {
                $(this)
                  .data('DateTimePicker')
                  .widget.find('.datepicker-days .dow')
                  .css({ width: '12.49%' });
              });
            // $element.data("DateTimePicker").widget.find(".picker-switch a.btn").hide();
            $element
              .data('DateTimePicker')
              .widget.find('.picker-switch.accordion-toggle')
              .replaceWith(
                '<li class="clearWeek"><a class="btn" style="width:100%"><span>清除</span></a></li>'
              );
            $element
              .data('DateTimePicker')
              .widget.find('.clearWeek')
              .on('click', function() {
                $scope.weekData.week = '0';
                $element.val('');
                $scope.$apply();
              });

            if ($scope.defaultWeek) {
              setWeek($scope.defaultWeek);
            } else {
              setWeek();
            }

            function setWeek(num) {
              if ($element.val()) {
                var value = $element.val();
              } else {
                if (num) {
                  var now = new Date();
                  var weekDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - num * 7
                  );
                  var y = weekDate.getFullYear();
                  var m = weekDate.getMonth() + 1;
                  m = m < 10 ? '0' + m : m;
                  var d = weekDate.getDate();
                  d = d < 10 ? '0' + d : d;
                } else {
                  var date = new Date();
                  var y = date.getFullYear();
                  var m = date.getMonth() + 1;
                  m = m < 10 ? '0' + m : m;
                  var d = date.getDate();
                  d = d < 10 ? '0' + d : d;
                }

                var value = y + '-' + m + '-' + d;
              }
              var firstDate = moment(value, 'YYYY-MM-DD')
                .day(1)
                .format('YYYY-MM-DD');
              var lastDate = moment(value, 'YYYY-MM-DD')
                .day(7)
                .format('YYYY-MM-DD');
              var week = moment(value, 'YYYY-MM-DD').week();

              $element.data('DateTimePicker').setDate(value);
              $scope.weekData.week = week;
              $scope.weekData.year = moment(firstDate, 'YYYY-MM-DD').format(
                'YYYY'
              );
              $scope.weekData.firstDate = firstDate;
              $scope.weekData.lastDate = lastDate;

              setTimeout(function() {
                $element.val(firstDate + ' 到 ' + lastDate);
                $element
                  .data('DateTimePicker')
                  .widget.find('.day.active')
                  .parent()
                  .find('.day')
                  .addClass('active');

                weekStyle();
                $('.prev, .next, .month')
                  .off()
                  .on('click', function() {
                    setTimeout(function() {
                      weekStyle();
                    }, 50);
                  });
              }, 50);
            }

            $scope.$watch('defaultWeek', function(newVal) {
              if (newVal || newVal === 0) {
                var now = new Date();
                var weekDate = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate() - newVal * 7
                );
                var y = weekDate.getFullYear();
                var m = weekDate.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                var d = weekDate.getDate();
                d = d < 10 ? '0' + d : d;
                var value = y + '-' + m + '-' + d;
                var firstDate = moment(value, 'YYYY-MM-DD')
                  .day(1)
                  .format('YYYY-MM-DD');
                var lastDate = moment(value, 'YYYY-MM-DD')
                  .day(7)
                  .format('YYYY-MM-DD');
                var week = moment(value, 'YYYY-MM-DD').week();

                $element.data('DateTimePicker').setDate(value);
                $scope.weekData.week = week;
                $scope.weekData.year = moment(firstDate, 'YYYY-MM-DD').format(
                  'YYYY'
                );
                $scope.weekData.firstDate = firstDate;
                $scope.weekData.lastDate = lastDate;

                setTimeout(function() {
                  $element.val(firstDate + ' 到 ' + lastDate);
                  $element
                    .data('DateTimePicker')
                    .widget.find('.day.active')
                    .parent()
                    .find('.day')
                    .addClass('active');

                  weekStyle();
                  $('.prev, .next, .month')
                    .off()
                    .on('click', function() {
                      setTimeout(function() {
                        weekStyle();
                      }, 50);
                    });
                }, 50);
              }
            });
            $element.on('dp.change', function(e) {
              setWeek();
            });

            var weekStyle = function() {
              var weekStart = 8,
                selectColor = '#ccc',
                prevSlice,
                nextSlice,
                prevWeek,
                nextWeek;

              $('.day').hover(
                function() {
                  var index = $(this).index();
                  if (index < weekStart) {
                    prevSlice = index;
                    nextSlice = weekStart - index - 1;
                    prevWeek = 7;
                    nextWeek = 0;
                  } else {
                    prevSlice = index - weekStart;
                    nextSlice = 6 - index;
                    prevWeek = weekStart;
                    nextWeek = weekStart;
                  }
                  $(this)
                    .prevAll()
                    .slice(0, prevSlice)
                    .css('background-color', selectColor);
                  $(this)
                    .nextAll()
                    .slice(0, nextSlice)
                    .css('background-color', selectColor);
                },
                function() {
                  $(this)
                    .prevAll()
                    .slice(0, prevSlice)
                    .css('background-color', '');
                  $(this)
                    .nextAll()
                    .slice(0, nextSlice)
                    .css('background-color', '');
                }
              );
            };

            $rootScope.$on('$stateChangeStart', function(event, next, curr) {
              if (
                $element.data('DateTimePicker') &&
                $element.data('DateTimePicker').hide
              ) {
                $element.data('DateTimePicker').hide();
              }
            });
          },
        ],
        link: function($scope, $element, $attrs, ngModel) {},
      };
    },
  ]);
};
