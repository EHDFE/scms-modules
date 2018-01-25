define([
  './mainNavCtrl',
  './mainNav.html',
  './mainNav.css',
  '../../configs/navsData'
], function(
  ctrl,
  html) {
  return function(app, elem, attrs, scope){
    ctrl(app, elem, attrs, scope);
    elem.append(html);
  }
});