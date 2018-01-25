define([
    './crumbCtrl',
    './crumb.css',
    './crumb.html',
], function(
    ctrl,
    css,
    html) {
    return function(app, elem, attrs, scope){
        ctrl(app, elem, attrs, scope);
        elem.append(html);
    }
});