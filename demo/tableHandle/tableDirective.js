export default [
  {
    keyName: 'tableHandleDirective',
    name: 'Table Handle Directive',
    title: 'Table Handle Directive',
    parentTitle: 'TableHandle',
    author: 'djd',
    lastBy: '',
    description:
      '列表指令，将多余的按隐藏，并显示更多，当鼠标移到更多上时显示隐藏的按钮',
    date: '2018-05-25',
    scope: [
      
    ],
    attrs: [
      {
        type: 'string',
        defaultValue: 'Bottom',
        key: 'morePosition',
        description: '更多下接按钮弹出位置，可选值：TopLeft, Top, TopRight, BottomLeft, Bottom, BottomRight',
      }
    ],
    deps: [''],
    api: '',
    type: 'directive',
  },
];