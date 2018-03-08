/**
 * <directive>
 * @description 树型视图
 * @date 2017-01-20
 * @author 黄思飞
 * @lastBy
 * @html <div tree-view tree-data="treeData" text-field="textField" item-clicked="itemClicked" default-item="defaultItem" link-key="linkKey">
 */
import html from './treeView.html';
import './treeView.css';
export default (app, elem, attrs, scope) => {
  app.directive('treeView', [
    '$timeout',
    function($timeout) {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
          treeData: '=', //@scope treeData 树型对象 {type: "object", "exampleValue": [{"parentresourceid":"TOP","linkKey":0,"textField":"货嘀菜单","ordernumber":0,"children":[{"linkKey":1375,"parentresourceid":0,"textField":"业务支撑","ordernumber":1473356239,"children":[{"linkKey":1377,"parentresourceid":1375,"textField":"大客户管理","ordernumber":1480558211,"children":[]},{"linkKey":1531,"parentresourceid":1375,"textField":"客诉中心","ordernumber":1482288948,"children":[]},{"linkKey":1543,"parentresourceid":1375,"textField":"营销管理","ordernumber":1482384730,"children":[]},{"linkKey":1589,"parentresourceid":1375,"textField":"客户管理","ordernumber":1482742875,"children":[]},{"linkKey":1697,"parentresourceid":1375,"textField":"调度中心","ordernumber":1483431903,"children":[]}]},{"linkKey":1365,"parentresourceid":0,"textField":"运营管理","ordernumber":1476956239,"children":[{"linkKey":1367,"parentresourceid":1365,"textField":"风控管理","ordernumber":1480557600,"children":[]},{"linkKey":1481,"parentresourceid":1365,"textField":"质控管理","ordernumber":1481098294,"children":[]},{"linkKey":1619,"parentresourceid":1365,"textField":"营销中心","ordernumber":1482830388,"children":[]}]},{"linkKey":1343,"parentresourceid":0,"textField":"公共后台","ordernumber":1480556239,"children":[{"linkKey":1345,"parentresourceid":1343,"textField":"基础管理","ordernumber":1480556266,"children":[]},{"linkKey":1347,"parentresourceid":1343,"textField":"系统管理","ordernumber":1480556286,"children":[]},{"linkKey":1509,"parentresourceid":1343,"textField":"脉象管理","ordernumber":1481533523,"children":[]},{"linkKey":1537,"parentresourceid":1343,"textField":"灰度发布","ordernumber":1482290755,"children":[]}]},{"linkKey":202,"parentresourceid":0,"textField":"资源名称2","ordernumber":1484622031,"children":[{"linkKey":211,"parentresourceid":202,"textField":"资源名称1-1","ordernumber":1484622031,"children":[]}]}]}], defaultValue: []}
          textField: '@', //@scope textField 树型节点文案属性名 {type: "string", "exampleValue": "textField"}
          linkKey: '@', //@scope linkKey 树型节点链接属性名 {type: "string", "exampleValue": "linkKey"}
          itemClicked: '=', //@scope itemClicked 树型节点点击事件 {type: "callback", "exampleValue": "console.log('格式化数据:',arguments);"}
          defaultItem: '=', //@scope defaultItem 树型默认点击节点 {type: "object", "exampleValue": {linkKey:0,textField:'货嘀菜单',children:[]}, defaultValue: {}}
        },
        link: function postLink() {},

        controller: function(
          $scope,
          $element,
          $attrs,
          $transclude,
          $log,
          $http,
          G
        ) {
          $scope.itemExpended = function(item, $event) {
            item.$$isExpend = !item.$$isExpend;
            $event.stopPropagation();
          };

          $scope.getItemIcon = function(item) {
            var isLeaf = $scope.isLeaf(item);
            if (isLeaf) {
              return '';
            }
            return item.$$isExpend ? 'fa fa-caret-up' : 'fa fa-caret-down';
          };

          $scope.isLeaf = function(item) {
            return !item.children || !item.children.length;
          };

          function expandBaner(tree, value, field, addfield, addValue) {
            if (tree[field] === value) {
              tree[addfield] = addValue;
              tree.active = true;
            }
            if (tree.children && tree.children.length > 0) {
              var ret;
              for (var i = 0, len = tree.children.length; i < len; i++) {
                expandBaner(tree.children[i], value, field, addfield, addValue);
                if (tree.children[i][addfield] === addValue) {
                  tree[addfield] = addValue;
                }
              }
            }
          }

          $timeout(function() {
            addActive();
          }, 60);

          $scope.$watch('defaultItem', function() {
            $timeout(function() {
              addActive();
            }, 60);
          });

          function addActive() {
            if ($scope.defaultItem) {
              angular.forEach($scope.treeData, function(item, index) {
                expandBaner(
                  item,
                  $scope.defaultItem[$scope.linkKey],
                  $scope.linkKey,
                  '$$isExpend',
                  true
                );
              });
            } else {
              angular.element('.tree-view span:eq(0)').addClass('active');
            }
          }

          $scope.warpCallback = function(callback, item, $event) {
            angular.element('.tree-view span').removeClass('active');
            angular.element($event.target).addClass('active');

            ($scope[callback] || angular.noop)({
              $item: item,
              $event: $event,
            });
          };
        },
      };
    },
  ]);
};
