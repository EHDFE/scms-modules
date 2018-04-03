import isEqual from 'lodash/isEqual';
import isBoolean from 'lodash/isBoolean';

const SOURCE_API = '/ehuodiBedrockApi/ehdrbacorganizationcs/selectCascadeRbacOrganizationByCode';

export default class DataSource {
  constructor(options) {
    this.setOption(options);
  }
  setOption(options) {
    this.options = Object.assign(this.options || {}, {
      openCityType: this.openCityType || 'GOODS_TAXI',
      isActivated: isBoolean(this.isActivated) ? this.isActivated : true,
      organizationCode: this.organizationCode || '',
    }, options);
    this.openCityType = this.options.openCityType;
    this.isActivated = this.options.isActivated;
    this.organizationCode = this.options.organizationCode;
    this.prependOption = this.options.prependOption;
    this.prependOptionName = this.options.prependOptionName;
    this.prependOptionType = this.options.prependOptionType;
  }
  update(options) {
    const prevOptions = Object.assign({}, this.options);
    this.setOption(options);
    if (!isEqual(prevOptions, this.options)) {
      this.getSource();
    }
  }
  request(data) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'post',
        url: SOURCE_API,
        data,
      }).then(res => {
        if (res.result === 'success') {
          resolve(res.data);
        } else {
          $.alert(res.msg, {
            type: 'error',
          });
          reject(res.msg);
        }
      }).fail(err => {
        reject(err);
      });
    });
  }
  getSource() {
    return Promise.all([
      this.request({
        organizationcode: this.organizationCode,
        returnformat: 1,
      }),
      this.request({
        organizationcode: this.organizationCode,
        returnformat: 3,
        isactivated: this.isActivated ? '已开通' : '未开通',
        opencitytype: this.openCityType,
      }),
    ]).then((regionList, cityList) => {
      return this.parser(regionList, cityList);
    }).then(source => {
      this.updater(source);
    });
  }
  parser([regionList, cityList]) {
    console.log(regionList, cityList);
    const regionMap = {};
    regionList.forEach(d => {
      if (d.organizationcode !== '88888888') {
        Object.assign(regionMap, {
          [d.organizationcode]: {
            name: d.organizationname,
            children: [],
          },
        });
      }
    });
    cityList.forEach(d => {
      if (d.organizationcode !== '88888888') {
        regionMap[d.parorganizationcode].children.push({
          name: d.organizationname,
          value: d.organizationcode,
        });
      }
    });
    const company = {
      name: '全国',
      value: '88888888',
    };
    return [company].concat(Object.keys(regionMap).map(code => {
      const children = regionMap[code].children;
      if (this.prependOption) {
        children.unshift({
          name: this.prependOptionName,
          value: this.prependOptionType === 'NULL' ? '' : children.map(d => d.value).join(','),
        });
      }
      return {
        name: regionMap[code].name,
        value: code,
        children,
      };
    }));
  }
  setUpdater(updater) {
    this.updater = updater;
  }
}