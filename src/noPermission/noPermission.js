import ctrl from './noPermissionCtrl';
import css from './noPermission.css';
import html from './noPermission.html';

export default (app, elem, attrs, scope) => {
  ctrl(app, elem, attrs, scope);
  elem.append(html);
}