define(['angular'], function(angular) {
  return function(app, elem, attrs, scope) {
    app.controller('headerCtrl', [
      '$scope',
      '$cookies',
      '$location',
      '$state',
      'headerService',
      'G',
      '$timeout',
      '$window',
      'navsData',
      '$rootScope',
      async function(
        $scope,
        $cookies,
        $location,
        $state,
        service,
        G,
        $timeout,
        $window,
        originNavsData,
        $rootScope
      ) {
        let navsData = await originNavsData.promise;
        //用户状态判断
        if (!$cookies.jobcard) {
          G.doLogin();
        } else if (!navsData.data || (navsData.data && !navsData.data.length)) {
          G.alertNoPermission();
        }

        if (G.userInfo.versionUpgrade) {
          $('#versionUpgradeLog').modal({
            backdrop: 'static',
          });
        }
        //
        $scope.userInfo = G.userInfo;
        $scope.orgGroup = [];
        var userProfessionObj = '';
        try {
          userProfessionObj = JSON.parse($scope.userInfo.userprofession);
          angular.forEach($scope.userInfo.orgCodeGroup.split(','), function(
            item,
            $index
          ) {
            if (userProfessionObj[$index]) {
              $scope.orgGroup.push({
                name: $scope.userInfo.orgNameGroup.split(',')[$index],
                value: item,
                userprofession: userProfessionObj[$index].userprofession,
              });
            }
          });
        } catch (e) {}

        $scope.userOrgGroup = [];
        try {
          var orgList = [];
          angular.forEach($scope.userInfo.userorgpros, function(item) {
            if (orgList.indexOf(item.organizationname) < 0) {
              orgList.push(item.organizationname);
              $scope.userOrgGroup.push({
                name: item.organizationname,
                value: item.organizationcode,
                professionList: [
                  {
                    professioncode: item.professioncode,
                    professionname: item.professionname,
                  },
                ],
                userprofession: item.professioncode,
              });
            } else {
              $scope.userOrgGroup[
                $scope.userOrgGroup.length - 1
              ].professionList.push({
                professioncode: item.professioncode,
                professionname: item.professionname,
              });
            }
          });

          $scope.professionList = $scope.userOrgGroup[0].professionList;
        } catch (e) {}

        $scope.currentOrg = $scope.userInfo.organizationname;
        $scope.currentProfession = $scope.userInfo.professionname;

        $scope.image = '';

        //监听路由发生改变时，按钮选中切换
        $scope.$on('$stateChangeSuccess', function(
          e,
          toState,
          toParams,
          fromState,
          fromParams
        ) {
          if (
            angular.element('.nav-second-level') &&
            angular.element('.nav-second-level').length
          ) {
            angular.element('.nav-second-level').removeAttr('style');
          }
        });

        $scope.navData = G.clone(navsData.data);

        //登出
        $scope.loginOut = function() {
          service.loginOut().then(
            function(data) {
              if (
                data &&
                data.data &&
                data.data &&
                data.data.result === 'success'
              ) {
                $cookies = {};
                $scope.userInfo = {};
                G.doLogin();
              }
            },
            function() {}
          );
        };

        $scope.showAllNavFn = function() {
          $scope.showAllNav = true;
        };

        $scope.setCurrent = function(org, index) {
          $scope.currentOrg = org.name;
          $scope.professionList = org.professionList;
          $scope.currentProfession = $scope.professionList[0].professionname;
          G.userInfo.professionname = $scope.currentProfession;
          G.userInfo.professioncode = $scope.professionList[0].professioncode;
          G.userInfo.organizationcode = org.value;
          G.userInfo.organizationname = org.name;
          G.userInfo.userprofession = org.userprofession;
          G.cityListOfHaveRight = [];
          $rootScope.$broadcast('updateOrg');
        };

        $scope.changeProfession = function(profession) {
          $scope.currentProfession = profession.professionname;
          G.userInfo.professionname = profession.professionname;
          G.userInfo.professioncode = profession.professioncode;
          G.userInfo.userprofession = profession.professionname;
          $rootScope.$broadcast('updateOrg');
        };

        $scope.removeHeight = function(item) {
          $scope.setActive(item);
          if (
            angular.element('.nav-second-level') &&
            angular.element('.nav-second-level').length
          ) {
            angular.element('.nav-second-level').removeAttr('style');
          }
        };

        $scope.setActive = function(item) {
          angular.forEach($scope.navData, function(nav) {
            nav.isChecked = false;
          });
          angular.forEach($scope.hideMenu, function(nav) {
            nav.isChecked = false;
          });
          item.isChecked = true;
        };
        
        $scope.toggleNav = function(){
          $scope.showUserCenter = !$scope.showUserCenter;
          $timeout(function(){
            if($scope.showUserCenter){
              $('.header-right').focus();
            }
          });
        };

        $scope.closeNav = function(){
          $scope.showUserCenter = false;
        };

        //跳到首页
        $scope.gotoCenter = function() {
          window.location.href = G.urls.center[G.envType];
        };

        $scope.gotoPmTool = function(){
          window.open('/pmTool/');
        }

        $scope.innerJump = function(url){
          $state.go(url);
          $scope.showUserCenter = false;
        };

        $scope.hideMenu = [];
        function resizeMenu(container, menuWidth, index) {
          var menuIndex = index || $scope.navData.length - 1;
          if (menuIndex < 0) {
            return;
          }
          var lastMenuWidth = angular.element('.header-ctrl .nav-menu li')[menuIndex].offsetWidth;
          var angleWidth = angular
            .element('.header-ctrl .fa-angle-double-right')
            .width();
          if (
            (container - menuWidth > lastMenuWidth &&
              !$scope.hideMenu.length) ||
            (container - menuWidth > angleWidth + lastMenuWidth &&
              $scope.hideMenu.length)
          ) {
            if ($scope.hideMenu.length) {
              $scope.navData.push($scope.hideMenu.shift());
            }
            return;
          } else if (container-menuWidth <= angleWidth){
            menuWidth = menuWidth - lastMenuWidth;
            $scope.hideMenu.unshift($scope.navData.pop());
            var nextMenuWidth = angular.element('.header-ctrl .nav-menu li')[menuIndex-1].offsetWidth;
            if(container-menuWidth<angleWidth+nextMenuWidth){
              resizeMenu(container, menuWidth, index-1);
            }
          }
        }

        $scope.domReady = function(last) {
          if (last) {
            $timeout(function() {
              var bodyWidth = angular.element('body')[0].offsetWidth;
              var logoWidth = angular.element('.header-ctrl .logo')[0]
                .offsetWidth;
              var loginWidth = angular.element('.header-ctrl .login-status')[0]
                .offsetWidth;
              var menuWidth = angular.element('.header-ctrl .nav-menu')[0]
                .offsetWidth;
              var menuContainer = bodyWidth - logoWidth - loginWidth;

              resizeMenu(menuContainer, menuWidth);
            });
          }
        };

        var timer;
        $(window).on('resize', function() {
          timer && clearTimeout(timer);
          timer = $timeout(function() {
            var bodyWidth = angular.element('body')[0].offsetWidth;
            var logoWidth = angular.element('.header-ctrl .logo')[0]
              .offsetWidth;
            var loginWidth = angular.element('.header-ctrl .login-status')[0]
              .offsetWidth;
            var menuWidth = angular.element('.header-ctrl .nav-menu')[0]
              .offsetWidth;
            var menuContainer = bodyWidth - logoWidth - loginWidth;

            resizeMenu(menuContainer, menuWidth);
          });
        });
      },
    ]);
  };
});
