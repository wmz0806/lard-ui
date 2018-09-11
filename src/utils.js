"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
exports.default = {
    createUUID: function (place, connector) {
        if (place === void 0) { place = 3; }
        if (connector === void 0) { connector = '_'; }
        /** @return {string} */
        var U = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        var uuid = '';
        for (var i = 0; i < place; i++)
            uuid += U() + connector;
        return uuid + new Date().getTime().toString(32);
    },
    isMobile: function () {
        return !!navigator.userAgent.match(/(iPhone|iPad|iPod|Android|ios)/i);
    },
    /**
     * 获取缩放比例
     * @param baseSize 基础字号大小
     * @returns {number}
     */
    getZoomRate: function (baseSize) {
        if (baseSize === void 0) { baseSize = config_1.default.baseFontSize; }
        var fontSize = window.document.documentElement.style.fontSize;
        var curSize = parseInt("" + fontSize, 10);
        return curSize / baseSize;
    },
};
