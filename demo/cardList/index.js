import html from './index.html';

export default {
  title: 'cardList',
  author: '程乐',
  type: 'directive',
  keyName: 'cardList',
  name: '卡片列表',
  date: '2020-12-04',
  description: '列表指令，获取列表数据，展示分页，展示无数据提示，之后会有排序等功能',
  scope: [
    {
      type: 'string',
      exampleValue: '//run.mocky.io/v3/f24fe8f3-6e7f-4d23-9342-68d88c3e5a08',
      key: 'apiUrl',
      description: '依赖后端api接口地址',
    },
    {
      type: 'function',
      key: 'fetch',
      description: '获取数据的函数',
    },
    {
      type: 'out-object',
      key: 'items',
      description: '获得的items',
    },
    {
      type: 'out-number',
      key: 'pageSize',
      description: '每页显示个数',
    },
    {
      type: 'out-number',
      key: 'currPage',
      description: '当前页码',
    },
    {
      type: 'object',
      exampleValue: {
        keyword: '15810221572',
      },
      defaultValue: {},
      key: 'fetchParam',
      description: '数据筛选的参数',
    },
    {
      type: 'callback',
      parentScopeValue: "console.log('格式化参数:',arguments);",
      key: 'formatParam',
      description: '格式化传入参数',
    },
    {
      type: 'function',
      parentScopeValue: "console.log('格式化数据:',arguments);",
      key: 'formatData',
      description: '格式化列表数据',
    },
    {
      type: 'boolean',
      exampleValue: 'false',
      key: 'disableStorage',
      description: '是否禁止从localStorage中获取搜索条件',
    },
    {
      type: 'boolean',
      exampleValue: 'false',
      key: 'delEmptyParam',
      description: '是否删除值为空字符串的请求参数',
    },
    {
      type: 'boolean',
      exampleValue: false,
      defaultValue: false,
      key: 'miniPage',
      description: '是否使用缩小样式',
    }
  ],
  attrs: [
    {
      type: 'string',
      defaultValue: 'post',
      key: 'method',
      description: 'http类型',
    },
    {
      type: 'string',
      defaultValue: 'true',
      key: 'isPagination',
      description: '是否显示分页',
    },
  ],
  deps: [''],
  html,
  api: '',
  htmlUrl: '',
};
