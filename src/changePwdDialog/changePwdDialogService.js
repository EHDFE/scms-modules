import './changePwdDialog.css';

export default (app, elem, attrs, scope) => {
  app.factory('changePwdDialogService', ['$rootScope', '$http', 'G', function ($rootScope, $http, G) {
    return {
      changePwd(options) {
        return $http({
          url: '/ehuodiBedrockApi/ehdrbacuserscs/updateUserPassword',
          method: 'post',
          data: options,
          test: '/modules/login/index.json', // 假数据api
        });
      },
      getCaptcha(options) {
        return $http({
          url: '/ehuodiBedrockApi/smscs/sendSmsCodeByMobileNumber',
          method: 'post',
          data: options,
          test: '/modules/login/index.json', // 假数据api
        });
      },
      loginOut() {
        return $http({
          url: '/ehuodiBedrockApi/baseconfigcs/logout',
          method: 'get',
          test: '/modules/header/header.json', // 假数据api
        });
      },
      getUserInfo(options) {
        return $http({
          url: '/ehuodiBedrockApi/ehdrbacuserscs/selectRbacUserByParam',
          method: 'post',
          data: options,
          test: '/modules/header/header.json', // 假数据api
        });
      },
    };
  }]);
};
