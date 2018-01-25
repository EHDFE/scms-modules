define([
    'angular',
    './changePwdDialogService',
    './changePwdDialog.html'
    ], function(
        angular,
        changePwdDialogService,
        html) {
        return function(app, elem, attrs, scope) {
            changePwdDialogService(app, elem, attrs, scope);
            app.directive('changePwdDialogDirective', ['G', 'changePwdDialogService', '$interval', '$cookies', '$window', function(G, service, $interval, $cookies, $window) {
                return {
                    template: html,
                    restrict: 'EA',
                    replace: true,
                    scope: {
                    },
                    link: function postLink($scope, $element, $attrs) {

                    },
                    controller: function($scope, $element, $attrs, $transclude,$timeout, $log, $http, G) {
                        $scope.captchaBtnText = '点击获取验证码';

                        var setCookie = function(key, value, options) {
                            if (typeof options.expires === 'number') {
                                var days = options.expires, t = options.expires = new Date();
                                t.setTime(+t + days * 864e+5);
                            }
                            document.cookie = [
                                key, '=', value,
                                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                                options.path    ? '; path=' + options.path : '',
                                options.domain  ? '; domain=' + options.domain : '',
                                options.secure  ? '; secure' : ''
                            ].join('')
                        };

                        $scope.getCaptcha = function(){
                            $scope.time = 60;
                            $scope.btnDisabled = true;
                            $scope.timer = $interval(function(){
                                $scope.time = $scope.time - 1;
                            },1000,60);
                            $scope.timer.then(function(){
                                $scope.btnDisabled = false;
                            });
                            service.getCaptcha({
                                type: 'UPDATE_PASSWORD',
                                mobilenumber: $scope.mobile
                            }).then(function(data){
                                if(!data || !data.data || data.data.result!=='success'){
                                    G.alert('获取验证码失败',{type:'error'});
                                }
                            },function(){
                                G.alert('获取验证码失败',{type:'error'});
                            });
                        };

                        $scope.submit = function(){
                            if(!validateForm()){
                                return;
                            }
                            service.changePwd({
                                ehdrbacusersid: G.userInfo.ehdrbacusersid,
                                type: "2",
                                password: $scope.formData.password,
                                identifycode: $scope.formData.captcha
                            }).then(function(data){
                                if(data&&data.data){
                                    if(data.data.result==='success'){
                                        G.alert('密码修改成功，即将重新登录......');
                                        $element.modal('hide');
                                        G.loading(true);
                                        $timeout(function(){
                                            service.loginOut().then(function(data) {
                                                if(data && data.data && data.data && data.data.result === 'success') {
                                                    $cookies = {};
                                                    $scope.userInfo = {};
                                                    G.doLogin();
                                                }
                                            });
                                        },2000);
                                    }else if(data.data.msg){
                                        G.alert(data.data.msg, {type:'error'});
                                    }
                                }else{
                                    G.alert('密码修改失败！', {type:'error'});
                                }
                            },function(){
                                G.alert('密码修改失败！', {type:'error'});
                            });
                        };

                        var makeInvalid = function(el, errorMsg, a) {
                            var $parents = el.parents('.form-content');
                            $parents.find('.error-msg').html(errorMsg);
                            el.parent().addClass('has-error');
                            el.parents('.form-content-error').addClass('has-error');
                        };

                        function validateForm(){
                            $scope.errors = {};
                            if($scope.formData.password!==$scope.formData.passwordRecheck){
                                makeInvalid($('#pwd'), '两次密码输入不一致');
                                return false;
                            }
                            return true;
                        }

                        function getUserInfo(){
                            var  jobcard = document.cookie.match(/jobcard\=\d+/);
                            if(jobcard && jobcard[0] && jobcard[0].indexOf('=') > 0) {
                                jobcard = jobcard[0].split('=')[1];
                            }
                            service.getUserInfo({
                                jobcard: jobcard,
                                resultstyle: '2'
                            }).then(function(data){
                                if(data&&data.data&&data.data.result==='success'){
                                    data = data.data.data[0] || {};
                                    $scope.username = data.username;
                                    $scope.mobile = data.usermobilenumber;
                                }else{
                                    if(G.userInfo){
                                        $scope.username = G.userInfo.username;
                                        $scope.mobile = G.userInfo.usermobilenumber;
                                    }
                                }
                            });
                        }

                        $('#changePwdDialog').on('show.bs.modal',function(e){
                            $scope.$apply(function(){
                                getUserInfo();
                                $interval.cancel($scope.timer);
                                $scope.btnDisabled = false;
                                $scope.formData = {};
                                G.clearAllError();
                            });
                        }); 

                    }
                };
            }]);
        }
    });