import demo from './demo.html';

export default {
  title: 'carTypeSelect',
  name: '车辆类型选择',
  type: 'directive',
  keyName: 'carTypeSelect',
  author: '程乐',
  date: '2018-08-23',
  description: '车辆类型选择，支持单选和多选,指令有接口，demo展示有问题，参见multipleSelect',
  deps:["scmsModules/carTypeSelect"],
  html: demo,
  scope: [
    {
      type: 'string',
      key: 'selectType',
      scopeType: '@',
      description: '可选参数，radio和checkbox，默认checkbox'
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