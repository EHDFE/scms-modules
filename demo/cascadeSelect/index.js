//mock http://www.mocky.io/v2/5aa89134320000b9091657ec
import html from './index.html';
import mockData from './mock.json';

export default {
  title: 'cascadeSelect',
  author: 'ryan.bian',
  type: 'directive',
  keyName: 'cascadeSelectDirective',
  name: 'CascadeSelect 级联选择',
  date: '2018-03-14',
  description: '级联选择器',
  scope: [
    {
      type: 'object',
      key: 'sourceData',
      exampleValue: mockData.data,
      description: '数据源, array',
    },
    {
      type: 'object',
      key: 'model',
      exampleValue: [],
      description: 'model',
    },
    {
      type: 'number',
      key: 'width',
      exampleValue: 80,
      description: '宽度',
    },
  ],
  deps: [''],
  html,
  api: '',
  htmlUrl: '',
};