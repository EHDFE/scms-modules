define(['angular'], function(angular) {
    return function(app, elem, attrs, scope) {
      app.controller('mainNavCtrl', [
        '$scope',
        'navsData',
        '$rootScope',
        '$timeout',
        async function($scope, originNavsData, $rootScope, $timeout) {
            const navsData = await originNavsData;
          //切换路由时，更新菜单
          $scope.navs = navsData.currentNavs.children;
          if (!$scope.navs) {
            $timeout(() => {
              $scope.navs = navsData.currentNavs.children;
              checkChildren($scope.navs);
            }, 500);
          } else {
            checkChildren($scope.navs);
          }
          $rootScope.$on('$stateChangeStart', function(event, next, curr) {
          $scope.navs = navsData.currentNavs.children;
          checkChildren($scope.navs);
        });

        $scope.sideLockDisplay = false;

        function checkChildren(navs) {
          angular.forEach(navs, function(nav) {
            checkCollapse(nav);
          });
        }

        function checkCollapse(items) {
          angular.forEach(items.children, function(item) {
            item.isActive = item.isChecked;
            if (item.isChecked && item.children) {
              var hasActiveChild = false;
              angular.forEach(item.children, function(child) {
                child.isActive = child.isChecked;
                if (child.isActive) {
                  hasActiveChild = true;
                  if (child.children) {
                    var hasActiveLeaf = false;
                    angular.forEach(child.children, function(leafChild) {
                      if (leafChild.isChecked) {
                        hasActiveLeaf = true;
                      }
                    });
                    if (hasActiveLeaf) {
                      child.isActive = false;
                    }
                  }
                }
              });
              if (hasActiveChild) {
                item.isActive = false;
              }
            } else if (item.isChecked && !item.children) {
              item.isActive = true;
            } else {
              item.isActive = false;
            }
          });
        }

        //展开，合闭菜单
        $scope.collapse = function($event, href, hrefA) {
          if (href.indexOf('javascript:void') > -1) {
            $event.preventDefault();
          }
          var $el = $($event.currentTarget);
          var $preEl = {};

          if (href.indexOf('javascript:void') > -1 || !hrefA) {
            $preEl = $('[aria-expanded="true"]');
            if ($preEl && $preEl.length) {
              $preEl.collapse('hide');
              if ($el[0] && $el[0].href) {
                $preEl.parent().removeClass('active');
              }
            }
          } else {
            $preEl = $el
              .parent()
              .parent()
              .find('[aria-expanded="true"]');
            if ($preEl && $preEl.length) {
              $preEl.collapse('hide');
              $el.find('.chevron').addClass('chevron-left');
            } else {
              $el.find('.chevron-left').removeClass('chevron-left');
            }
          }

          $el.next().collapse('toggle');
          if ($el.next().attr('aria-expanded') === 'true') {
            var parentHref = $el.parent().children()[0].href;
            $el.parent().addClass('active');
            $el
              .parent()
              .parent()
              .parent()
              .removeClass('activeB');
            $el
              .next()
              .find('.chevron')
              .addClass('chevron-left');
          }
        };

        //在中屏中鼠标移上去，给容器添加hover类
        var timer;
        elem.hover(
          function() {
            if (!elem.hasClass('lock-menu')) {
              elem.addClass('hover');
            }
            timer = $timeout(function() {
              elem.find('.menu-side-lock').addClass('display-me');
            }, 500);
          },
          function() {
            if (!elem.hasClass('lock-menu')) {
              elem.removeClass('hover');
            }
            elem.find('.menu-side-lock').removeClass('display-me');
            $timeout.cancel(timer);
          }
        );

        $scope.toggleLock = function() {
          $scope.sideLockDisplay = !$scope.sideLockDisplay;
          if ($scope.sideLockDisplay) {
            elem.addClass('lock-menu');
            $('#content').addClass('lock-content');
          } else {
            elem.removeClass('lock-menu');
            $('#content').removeClass('lock-content');
          }
        };
      }
    ]);
  };
});
