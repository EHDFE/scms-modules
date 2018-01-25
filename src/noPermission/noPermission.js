define([
  './noPermissionCtrl',
  './noPermission.css',
  './noPermission.html'
], function(
  ctrl,
  css,
  html) {
  return function(app, elem, attrs, scope){
    ctrl(app, elem, attrs, scope);
    elem.append(html);
  }
});