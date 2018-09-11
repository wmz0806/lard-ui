"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = require("./Collection");
var Container;
var getContainer = function () {
    if (!Container)
        Container = Collection_1.default.create();
    return Container;
};
var dialog = function (params) {
    var Modal = getContainer();
    var buttons = params.buttons;
    buttons && buttons.forEach(function (btn) { return btn.cb = btn.onClick; });
    return Modal.show(params);
};
exports.default = {
    dialog: function (params) {
        var title = params.title, content = params.content, buttons = params.buttons, others = __rest(params, ["title", "content", "buttons"]);
        return dialog({ title: title, content: content, buttons: buttons, options: others });
    },
    confirm: function (params) {
        var buttons = [];
        var title = params.title, content = params.content, _a = params.cancelBtn, cancelBtn = _a === void 0 ? {} : _a, _b = params.sureBtn, sureBtn = _b === void 0 ? {} : _b, others = __rest(params, ["title", "content", "cancelBtn", "sureBtn"]);
        buttons.push(__assign({}, cancelBtn, { content: cancelBtn.content || '取消' }));
        buttons.push(__assign({}, sureBtn, { content: sureBtn.content || '确认' }));
        var opt = {
            title: title,
            content: content,
            buttons: buttons,
            options: others,
        };
        return dialog(opt);
    },
    alert: function (params) {
        var title = params.title, content = params.content, _a = params.sureBtn, sureBtn = _a === void 0 ? {} : _a, others = __rest(params, ["title", "content", "sureBtn"]);
        var button = __assign({}, sureBtn, { content: sureBtn.content || '确认' });
        var opt = {
            title: title,
            content: content,
            buttons: [button],
            options: others,
        };
        return dialog(opt);
    },
    // 隐藏最后一个模态框
    hide: function () {
        Container && Container.hide();
    },
    // 隐藏所有
    hideAll: function () {
        Container && Container.hideAll();
    },
    // 销毁
    destroy: function () {
        Container && Container.destroy();
        Container = null;
    }
};
