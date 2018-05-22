export default [
    {
      keyName: 'ngTableFixed',
      name: 'Table Fixed',
      title: 'Table Fixed',
      parentTitle: 'Tables',
      author: '黄思飞',
      lastBy: '',
      description:
        '列表固定头部行、左边列或右边列',
      date: '2018-05-01',
      scope: [
      ],
      attrs: [
        {
          type: 'number',
          exampleValue: '2',
          key: 'fixedLeft',
          description: '左则固定列的个数',
        },
        {
          type: 'number',
          exampleValue: '2',
          key: 'fixedRight',
          description: '右则固定列的个数',
        },
        {
          type: 'string',
          exampleValue: 'true',
          key: 'fixedHeader',
          description: '是否固定头部,为空不固定头部',
        }
      ],
      deps: [''],
      api: '',
      type: 'directive',
    },
  ];
  