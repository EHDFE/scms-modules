export default {
  title: 'Pagination',
  author: 'tianyanrong',
  type: 'directive',
  keyName: 'paginationDirective',
  name: 'Pagination 翻页',
  lastBy: '',
  description: '',
  date: '2016-09-20',
  scope: [
    {
      type: 'number',
      exampleValue: 1,
      defaultValue: 1,
      key: 'currentPage',
      description: '当前页码',
    },
    {
      type: 'number',
      exampleValue: 100,
      key: 'totalCount',
      description: '总共行数',
    },
    {
      type: 'number',
      exampleValue: 15,
      defaultValue: 15,
      isDisabled: 1,
      key: 'pageSize',
      description: '一页显示行数',
    },
    {
      type: 'function',
      parentScopeValue:
        "$.alert('已执行回调函数,返回参数有:pageSize、currentPage', {type:'success'})",
      key: 'onchanged',
      description: '回调函数',
    },
    {
      type: 'boolean',
      exampleValue: false,
      defaultValue: false,
      key: 'hidePageSize',
      description: 'pageSize是否显示',
    },
    {
      type: 'boolean',
      exampleValue: false,
      defaultValue: false,
      key: 'miniPage',
      description: '是否显示缩小分页',
    }
  ],
  attrs: [],
  deps: ['scmsModules/pagination/paginationDirective'],
  html:
    '<div pagination-directive current-page="currentPage" total-count="totalCount" page-size="pageSize" onchanged="onchanged" hide-page-size="hidePageSize" mini-page="miniPage"></div>',
  api: '',
  htmlUrl: '',
};
