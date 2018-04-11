import isEqual from 'lodash/isEqual';
import defaults from 'lodash/defaults';
import pick from 'lodash/pick';

const KEYS_NEED_UPDATE = ['apiUrl', 'openCityType', 'isActivated', 'organizationCode'];
const COUNTRY_CODE = '88888888';

export default class DataSource {
  constructor(options) {
    this.options = {
      openCityType: 'GOODS_TAXI',
      organizationCode: undefined,
      isActivated: true,
      sourceFormatter(data) {
        return {
          name: data.organizationname,
          value: data.organizationcode,
        };
      },
    };
    this.setOption(options);
  }
  setOption(options) {
    this.options = defaults({}, options, this.options);
    this.openCityType = this.options.openCityType;
    this.apiUrl = this.options.apiUrl;
    this.isActivated = this.options.isActivated;
    this.organizationCode = this.options.organizationCode;
    this.prependOptionType = this.options.prependOptionType;
    this.sourceFormatter = this.options.sourceFormatter;
  }
  update(options) {
    const prevOptions = Object.assign({}, this.options);
    this.setOption(options);
    if (!isEqual(pick(prevOptions, KEYS_NEED_UPDATE), pick(this.options, KEYS_NEED_UPDATE))) {
      this.getSource();
    }
  }
  request(data) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'post',
        url: this.apiUrl,
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
        organizationcode: COUNTRY_CODE,
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
      return source;
    });
  }
  parser([regionList, cityList]) {
    // console.log(regionList, cityList);
    const regionMap = {};
    regionList.forEach(d => {
      if (d.organizationcode !== COUNTRY_CODE) {
        Object.assign(regionMap, {
          [d.organizationcode]: Object.assign({
            name: d.organizationname,
            children: [],
          }, d),
        });
      }
    });
    cityList.forEach(d => {
      if (d.organizationcode !== COUNTRY_CODE) {
        const transformed = this.sourceFormatter(d);
        if (transformed) {
          regionMap[d.parorganizationcode].children.push(transformed);
        }
      }
    });
    let company;
    if (this.organizationCode === COUNTRY_CODE) {
      company = {
        organizationname: '全国',
        organizationcode: COUNTRY_CODE,
        isNational: true,
      };
      const formattedCompany = this.sourceFormatter(company);
      if (formattedCompany) {
        Object.assign(company, formattedCompany);
      } else {
        company = false;
      }
    } else {
      company = false; 
    }
    company = company ? [ company ] : [];
    return company.concat(Object.keys(regionMap).map(code => {
      const children = regionMap[code].children;
      if (children.length === 0) return false;
      const formattedData = this.sourceFormatter(regionMap[code]);
      let regionValue;
      if (this.prependOptionType === 'CONCAT') {
        regionValue = children.map(d => d.value).join(',');
      } else if (this.prependOptionType === 'CONCAT_ALL') {
        regionValue = [formattedData.value].concat(children.map(d => d.value)).join(',');
      } else {
        regionValue = formattedData.value;
      }
      return {
        name: formattedData.name,
        value: regionValue,
        children,
      };
    })).filter(d => !!d);
  }
  setUpdater(updater) {
    this.updater = updater;
  }
}