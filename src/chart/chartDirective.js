/*
 * <div chart-directive data-height="250" chart-data="usersActiveChartData"></div>
 */
// TODO: Echart exclude
export default (app, elem, attrs, scope) => {
  app.directive('chartDirective', [function () {
    return {
      // template: '<div></div>',
      restrict: 'EA',
      replace: true,
      scope: {
        chartData: '=',	// array 数据
      },
      link: function postLink($scope, $element, $attrs) {

      },

      controller($scope, $element, $attrs, $transclude, $log, $http, G) {
        // $scope.chartData = {};
        $element.css({
          height: `${$attrs.height}px`,
        });

        const myChart = echarts.init($element[0]);

        $scope.$watch('chartData', (newValue, oldValue) => {
          if (!$scope.chartData || !$scope.chartData.data) {
            return;
          }
          const legend = [];
          let i,
            k;
          const color = [];
          let formatter = '';
          if ($scope.chartData.data && $scope.chartData.data.length > 1) {
            for (i = 0, k = $scope.chartData.data.length; i < k; i++) {
              legend.push($scope.chartData.data[i].name);
              if ($scope.chartData.data[i].color) {
                color.push($scope.chartData.data[i].color);
              }
            }
          }

          let maxNum = 0,
            interval;
          angular.forEach($scope.chartData.data, (item) => {
            angular.forEach(item.data, (num) => {
              if (Number(num) > Number(maxNum)) {
                maxNum = num;
              }
            });
          });

          if (maxNum < 8) {
            interval = 1;
          } else {
            interval = '';
          }

                    	let options = {
                    		title: {
                    			show: false,
                    		},
						    tooltip: {
						        trigger: 'axis',
						    },
						    legend: {
						        data: legend,
						        bottom: 0,
              top: 20,
						    },
						    label: {
						        normal: {
						        show: true,
						        position: 'top',
						        },
						    },
						    series: $scope.chartData.data,
          };
          if ($scope.chartData.data[0] && $scope.chartData.data[0].type === 'pie') {
            options.tooltip.trigger = 'item';
          } else {
            options.grid = {
						        left: '20px',
						        right: '40px',
						        bottom: '10px',
						        containLabel: true,
						    };
						    options.xAxis = [
						        {
						            type: 'category',
						            boundaryGap: $scope.chartData.boundaryGap || false,
						            data: $scope.chartData.category,
						        },
						    ];
						    if ($scope.chartData.data[0] && $scope.chartData.data[0].formatter) {
						    	formatter = $scope.chartData.data[0].formatter;
						    }
						    options.yAxis = [
						        {
						            type: 'value',
						            axisLabel: {
							            formatter: `{value}${formatter}`,
							        },
						        },
						    ];
						    if (interval === 1) {
						    	options.yAxis[0].interval = 1;
						    }
          }
          if (color.length) {
            options.color = color;
          }

          myChart.clear();
          myChart.setOption(options);
          options = null;
        });
      },
    };
  }]);
};
