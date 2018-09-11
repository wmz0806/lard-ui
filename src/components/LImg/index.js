"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var LImg_1 = require("./LImg");
var def = require("./images/default.png");
var timer = null;
var load = function (arr, callback) {
    for (var i = 0; i < arr.length; i++) {
        var dict = arr[i];
        if (dict.target) {
            if (dict.target.state.done) {
                // 加载完毕删除这个 Dict
                arr.splice(i, 1);
                i--;
            }
            else if (dict.target.div) {
                if (callback(dict.target.div)) {
                    dict.target.setLaunch(true);
                    arr.splice(i, 1);
                    i--;
                }
            }
        }
    }
};
exports.default = {
    get: function (props, arr) {
        if (!props.def)
            props.def = def;
        if (Array.isArray(arr)) {
            var dict_1 = {};
            var C = (React.createElement(LImg_1.default, __assign({ ref: function (el) { return (dict_1.target = el); } }, props)));
            dict_1.component = C;
            arr.push(dict_1);
            return C;
        }
        else {
            return (React.createElement(LImg_1.default, __assign({}, props)));
        }
    },
    attemptLoad: function (arr, callback) {
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            load(arr, callback);
        }, 233);
    }
};
