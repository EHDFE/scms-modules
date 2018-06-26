export default [
  {
    keyName: "tableHandleDirective",
    name: "Table Handle Directive",
    title: "Table Handle Directive",
    parentTitle: "TableHandle",
    author: "djd",
    lastBy: "",
    description:
      '列表操作按钮指令，将多余的按钮隐藏移入"更多"里，当鼠标移到"更多"上时显示隐藏的按钮。注意：子控件需要添加属性"handle"才受控制',
    date: "2018-05-25",
    scope: [],
    attrs: [
      {
        type: "number",
        defaultValue: "3",
        key: "count",
        description: "展示几个按钮，超出的按钮放到更多里"
      },
      {
        type: "string",
        defaultValue: "left",
        key: "side",
        description: "更多下接按钮弹出水平方向，可选值：left(默认),right"
      }
    ],
    deps: [""],
    api: "",
    type: "directive"
  }
];
