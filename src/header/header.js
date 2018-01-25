define([
  './headerCtrl',
  './headerService',
  '../changePwdDialog/changePwdDialogDirective',
  '../versionUpgradeLog/versionUpgradeLogDirective',
  '../allNav/allNavDirective',
  './header.html',
  './header.css',
], function(
  ctrl,
  service,
  changePwdDialogDirective,
  versionUpgradeLogDirective,
  allNavDirective,
  html,
  css,
) {
  return function(app, elem, attrs, scope){
    ctrl(app, elem, attrs, scope);
    service(app, elem, attrs, scope);
    changePwdDialogDirective(app, elem, attrs, scope);
    versionUpgradeLogDirective(app, elem, attrs, scope);
    elem.append(html);
    allNavDirective(app, elem, attrs, scope);
  }
});