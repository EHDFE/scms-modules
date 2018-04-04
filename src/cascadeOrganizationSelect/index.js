import template from './index.html';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import cascadeSelect from '../cascadeSelect';
import DataSource from './dataSource';

import DevTool from '../../utils/DevTool';

const devTool = new DevTool('cascadeOrganizationSelect');

const SOURCE_API = '/ehuodiBedrockApi/ehdrbacorganizationcs/selectCascadeRbacOrganizationByCode';

const DEFAULT_PREPEND_OPTION_CONFIG = {
  prependOptionName: '全部',
  prependOptionType: 'NULL',
};

export default (app, elem, attrs, scope) => {
  cascadeSelect(app, elem, attrs, scope);
  app.directive('cascadeOrganizationSelect', [() => ({
    template,
    scope: {
      ngModel: '=',
      openCityType: '@',
      isActivated: '=',
      label: '@',
      prependOption: '@',
      prependOptionName: '@',
      prependOptionType: '@', // 'NULL' or 'CONCAT',
      apiUrl: '@',
    },
    replace: true,
    controller: [
      '$scope',
      '$attrs',
      '$rootScope',
      '$timeout',
      'G',
      ($scope, $attrs, $rootScope, $timeout, G) => {

        let currentOrganizationCode = get(G, 'userInfo.organizationcode', '88888888');
        
        const dataSource = new DataSource(Object.assign({
          openCityType: $scope.openCityType,
          isActivated: $scope.isActivated,
          organizationCode: currentOrganizationCode,
          apiUrl: $scope.apiUrl || SOURCE_API,
        }, {
          prependOption: $scope.prependOption === 'true' ? true : false,
          prependOptionName: $scope.prependOptionName || DEFAULT_PREPEND_OPTION_CONFIG.prependOptionName,
          prependOptionType: $scope.prependOptionType || DEFAULT_PREPEND_OPTION_CONFIG.prependOptionType,
        }));

        dataSource.setUpdater(source => {
          $timeout(() => {
            $scope.source = source;
          });
        });

        dataSource.getSource()
          .then(() => {
            if (Array.isArray($scope.ngModel)) {
              const defaultSelected = $scope.ngModel.slice(0);
              $timeout(() => {
                $scope.selected = defaultSelected;
              });
            }
          });

        // $scope.$watch('openCityType', value => {
        //   dataSource.update({
        //     openCityType: value,
        //   });
        // });
        $scope.$watch('isActivated', value => {
          dataSource.update({
            isActivated: value,
          });
        });
        $scope.$watch('prependOption', value => {
          dataSource.update({
            prependOption: value === 'true',
          });
        });
        // $scope.$watch('prependOptionName', value => {
        //   dataSource.update({
        //     prependOptionName: value,
        //   });
        // });
        // $scope.$watch('prependOptionType', value => {
        //   dataSource.update({
        //     prependOptionType: value,
        //   });
        // });

        $scope.$watch('ngModel', (value, oldValue) => {
          if (!isEqual(value, oldValue)) {
            devTool.info('ngModel change', value);
            $scope.selected = value;
          }
        });

        $scope.$watch('selected', (value, oldValue) => {
          if (!isEqual(value, oldValue)) {
            $scope.ngModel = value;
          }
        });

        // 控制数据权限
        const handleUserOrgChange = $rootScope.$on('updateOrg', () => {
          const nextOrganizationCode = get(G, 'userInfo.organizationcode', '');
          if (currentOrganizationCode === nextOrganizationCode) return;
          currentOrganizationCode = nextOrganizationCode;
          dataSource.update({
            organizationcode: nextOrganizationCode,
          });
        });

        $scope.$on('$destroy', () => {
          handleUserOrgChange();
        });

      }],
  })]);
};