import demo from './demo.html';

export default {
  title: 'MultipleSelect',
  name: '多选器',
  type: 'directive',
  keyName: 'multipleSelectDirective',
  author: 'ryan.bian',
  date: '2018-04-28',
  description: '多选器',
  html: demo,
  scope: [
    {
      type: 'array',
      key: 'options',
      scopeType: '=',
      exampleValue: [
        {
          name: '面包车',
          children: [
            {
              name: '1.7米小面',
              value: '1.7米小面'
            },
            {
              name: '2.7米中面',
              value: '2.7米中面'
            },
            {
              name: '2.8米大面',
              value: '2.8米大面'
            },
          ]
        },
        {
          name: '栏板车',
          children: [
            {
              name: '2.5米栏板车',
              value: '2.5米栏板车',
            },
            {
              name: '3.2米栏板车',
              value: '3.2米栏板车',
            },
            {
              name: '4.2米栏板车',
              value: '4.2米栏板车',
            },
            {
              name: '5.2米栏板车',
              value: '5.2米栏板车',
            },
            {
              name: '6.8米栏板车',
              value: '6.8米栏板车',
            },
            {
              name: '9.6米栏板车',
              value: '9.6米栏板车',
            },
          ],
        },
        {
          name: '厢式货车',
          children: [
            {
              name: '4.2米厢式货车',
              value: '4.2米厢式货车',
            },
            {
              name: '6.8米厢式货车',
              value: '6.8米厢式货车',
            },
            {
              name: '9.6米厢式货车',
              value: '9.6米厢式货车',
            },
          ]
        }
      ],
      description: '选项',
    },
    {
      type: 'number',
      key: 'maxSelectLimit',
      scopeType: '@',
      exampleValue: 4,
      description: '最大可选数量'
    },
    {
      type: 'object',
      key: 'model',
      scopeType: '=',
      exampleValue: '1.7米小面,2.7米中面,3.2米栏板车',
      description: 'model'
    },
  ],
};