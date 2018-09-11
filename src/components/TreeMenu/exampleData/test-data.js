"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("./data");
exports.data = [
    data_1.asyncData,
    data_1.syncData,
    [
        { label: '11111', value: '1' },
        { label: '22222', value: '1', isActive: true },
        { label: '333333', value: '1' },
        { label: '444444', value: '1' },
        {
            label: '我有儿子', value: '1', children: [
                { label: '11111', value: '1' },
                { label: '22222', value: '1', isActive: true },
                { label: '333333', value: '1' },
                { label: '444444', value: '1' },
                { label: '我有儿子', value: '1' },
                { label: '6666', value: '1' },
                { label: '77777777', value: '1' },
                { label: '88888888', value: '1' },
                { label: '9999999999', value: '1' },
                { label: '我有儿子', value: '1' },
            ]
        },
        { label: '6666', value: '1' },
        { label: '77777777', value: '1' },
        { label: '88888888', value: '1' },
        { label: '9999999999', value: '1' },
        {
            label: '我有儿子', value: '1', children: [
                { label: '11111', value: '1' },
                { label: '22222', value: '1', isActive: true },
                { label: '333333', value: '1' },
                { label: '444444', value: '1' },
                { label: '我有儿子', value: '1' },
                { label: '6666', value: '1' },
                { label: '77777777', value: '1' },
                { label: '88888888', value: '1' },
                { label: '9999999999', value: '1' },
                { label: '我有儿子', value: '1' },
            ]
        },
    ]
];
