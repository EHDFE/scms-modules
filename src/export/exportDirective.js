/**
 * <directive>
 * @description 导出列表
 * @date 2017-04-05
 * @author 程乐
 * @lastBy
 * @html <span export-directive api-url="'/goodstaxiAdmin/goodsseascs/downGoodsSeasListFile'" fetch-param="a" total-count="list.totalCount" max-number="5000" class="btn btn-export fr">导出</span>
 */
export default (app, elem, attrs, scope) => {
  app.directive('exportDirective', ['G', function (G) {
    return {
      scope: {
        apiUrl: '=',
        fetchParam: '=',
        totalCount: '=',
        maxNumber: '=',
      },
      link($scope, $element, $attrs) {
        $scope.fetchParam = $scope.fetchParam || {};
        $element.on('click', () => {
          if ($scope.totalCount > $scope.maxNumber) {
            G.alert('导出数据太多，请分段导出');
          } else if ($scope.totalCount < 1) {
            G.alert('没有数据');
          } else {
            const temp = document.createElement('form');
            temp.action = $scope.apiUrl;
            temp.method = 'get';
            temp.style.display = 'none';
            for (const x in $scope.fetchParam) {
              const opt = document.createElement('textarea');
              opt.name = x;
              opt.value = $scope.fetchParam[x];
              temp.appendChild(opt);
            }
            document.body.appendChild(temp);
            temp.submit();
            return temp;
          }
        });
      },
    };
  }]);
};
