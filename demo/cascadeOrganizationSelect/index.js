import html from './index.html';

export default {
  title: 'cascadeOrganizationSelect',
  author: 'ryan.bian',
  type: 'directive',
  keyName: 'cascadeOrganizationSelectDirective',
  name: '组织&城市级联选择',
  date: '2018-04-3',
  description: '城市级联选择',
  scope: [
    {
      type: 'object',
      key: 'model',
      exampleValue: ['测试事业部', '7bcb87d'],
      description: 'model',
    },
    {
      type: 'string',
      key: 'defaultValue',
      scopeType: '@',
      exampleValue: '',
      description: '默认值',
    },
    {
      type: 'string',
      key: 'label',
      scopeType: '@',
      exampleValue: '城市',
      description: 'label',
    },
    {
      type: 'string',
      key: 'openCityType',
      scopeType: '@',
      exampleValue: 'GOODS_TAXI',
      description: '开城业务类型枚举 整车：GOODS_TAXI 零担：PART_LOAD 大客户：KA 班车：ARER_BUS',
    },
    {
      type: 'boolean',
      key: 'isActivated',
      exampleValue: true,
      description: '是否开城',
    },
    {
      type: 'boolean',
      key: 'prependOption',
      scopeType: '@',
      exampleValue: true,
      description: '是否添加前置选项',
    },
    {
      type: 'string',
      key: 'prependOptionName',
      scopeType: '@',
      exampleValue: '所有',
      description: '前置选项名称',
    },
    {
      type: 'string',
      key: 'prependOptionType',
      scopeType: '@',
      exampleValue: 'NULL',
      description: '前置选项值模式 可选 ("NULL": 空值) 或 ("CONCAT": 包含全部城市code，逗号分隔)',
    },
    {
      type: 'string',
      key: 'apiUrl',
      scopeType: '@',
      exampleValue: '//green-sun-9840.getsandbox.com/selectCascadeRbacOrganizationByCode',
      description: '接口地址，默认不用传',
    },
    {
      type: 'function',
      key: 'sourceFormatter',
      description: '处理数据格式，返回对象必须包含 name 和 value 字段'
    }
  ],
  deps: [''],
  html,
  api: '',
  htmlUrl: '',
};