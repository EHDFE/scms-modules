import './versionUpgradeLog.css';
export default (app, elem, attrs, scope) => {
        app.factory('versionUpgradeLogService', ['$rootScope', '$http', 'G', function($rootScope, $http, G) {
            return {
                queryVersionManageList: function(options) {
                    return $http({
                        url: '/ehuodiBedrockApi/versionmanagecs/queryVersionManageList',
                        method: 'post',
                        data: options
                    });
                },

                updateRbacUser: function(options) {
                    return $http({
                        url: '/ehuodiBedrockApi/ehdrbacuserscs/updateRbacUser',
                        method: 'post',
                        data: options
                    });
                }
            };
        }]);
    }