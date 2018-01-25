define([
  'angular'
], function(angular) {
	return function(app, elem, attrs, scope) {
    	app.factory('headerService', ['$rootScope', '$http', 'G', function($rootScope, $http, G) {
            return {
				loginOut: function() {
					return $http({
						url: '/ehuodiBedrockApi/baseconfigcs/logout',
						method: 'get',
						test: '/modules/header/header.json'//假数据api
					});
				}
            };
        }]);
  }
});