export default {
    title: 'Transfer',
    author: '程乐',
    type: 'directive',
    keyName: 'transfer',
    name: 'Transfer 穿梭框',
    lastBy: '',
    description: '',
    date: '2019-12-11',
    scope: [
        {
            type: 'object',
            exampleValue: [
                {
                    id: 1,
                    name: '数据打法胜多负少的发顺丰是打发斯蒂芬啊啊的范德萨发',
                    value: ''
                },
                {
                    id: 2,
                    name: '数据2',
                    value: ''
                },
                {
                    id: 3,
                    name: '数据3',
                    value: ''
                },
                {
                    id: 4,
                    name: '数据4',
                    value: ''
                }
            ],
            defaultValue: {},
            key: 'sourceData',
            description: '原始数据',
        },
        {
            type: 'object',
            exampleValue: [
                {
                    id: 3,
                    name: '数据3',
                    value: ''
                },
                {
                    id: 4,
                    name: '数据4',
                    value: ''
                }
            ],
            defaultValue: {},
            key: 'targetData',
            description: '筛选数据',
        },
        {
            type: 'string',
            exampleValue: 'name',
            key: 'showName',
            description: '显示内容key',
        },
        {
            type: 'string',
            exampleValue: 'id',
            key: 'screenKey',
            description: '筛选条件key',
        },
    ],
    attrs: [],
    deps: ['scmsModules/transfer/transfer'],
    html: '<div transfer source-data="sourceData" target-data="targetData" screen-key="id" show-name="name" ></div>',
    api: '',
    htmlUrl: '',
};
