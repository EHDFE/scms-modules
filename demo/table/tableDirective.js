export default [
  {
    keyName: 'tableDirective',
    name: 'Table Directive',
    title: 'Table Directive',
    parentTitle: 'Tables',
    author: '田艳容',
    lastBy: '',
    description:
      '列表指令，获取列表数据，展示分页，展示无数据提示，之后会有排序等功能',
    date: '2016-12-01',
    scope: [
      {
        type: 'string',
        exampleValue: '//www.mocky.io/v2/5aa2278c2f0000751ad4639f',
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
        exampleValue: 'false',
        defaultValue: 'false',
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
    api: '',
    type: 'directive',
  },
];
