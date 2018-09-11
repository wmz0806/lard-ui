"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Map = {
    data1: [
        [
            { label: '王', value: '王' },
            { label: '张', value: '张' },
            { label: '李', value: '李' },
        ],
        [
            { label: '麻子', value: '麻子' },
            { label: '三', value: '三' },
        ]
    ],
    data2: [
        {
            label: '北京市', value: '北京市', children: [
                {
                    label: '北京市', value: '北京市', children: [
                        { label: '朝阳区', value: '朝阳区' },
                        { label: '海淀区', value: '海淀区' },
                        { label: '东城区', value: '东城区' },
                        { label: '西城区', value: '西城区' }
                    ]
                }
            ]
        },
        {
            label: '辽宁省', value: '辽宁省', children: [
                {
                    label: '沈阳市', value: '沈阳市', children: [
                        { label: '沈河区', value: '沈河区' },
                        { label: '浑南区', value: '浑南区' },
                        { label: '沈北新区', value: '沈北新区' },
                    ]
                },
                {
                    label: '本溪市', value: '本溪市', children: [
                        { label: '溪湖区', value: '溪湖区' },
                        { label: '东明区', value: '东明区' },
                        { label: '桓仁满族自治县', value: '桓仁满族自治县' },
                    ]
                }
            ]
        },
        {
            label: '云南省', value: '云南省', children: [
                {
                    label: '昆明市', value: '昆明市', children: [
                        { label: '五华区', value: '五华区' },
                        { label: '官渡区', value: '官渡区' },
                        { label: '呈贡区', value: '呈贡区' },
                    ]
                }
            ]
        },
    ]
};
exports.default = Map;
