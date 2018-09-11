"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Container_1 = require("./Container");
var newContainer;
// 单例 获得一个 Toast 容器
var getNewContainer = function () {
    if (!newContainer) {
        newContainer = Container_1.default.create();
    }
    return newContainer;
};
/**
 *  集合参数 完成对Container的改变
 * @param type toast的类型
 * @param content 文字
 * @param time
 * @param shade 是否显示背景层 默认不显示
 * @param shadeType 背景层颜色类型 black | white | transparent 默认 transparent
 * @param css 额外的样式
 * @param tapToClose 是否点击立马关闭toast
 * @param onClose 关闭回调
 */
var toast = function (type, content, time, _a) {
    if (time === void 0) { time = 3000; }
    var _b = _a.shade, shade = _b === void 0 ? false : _b, _c = _a.shadeType, shadeType = _c === void 0 ? 'transparent' : _c, _d = _a.css, css = _d === void 0 ? '' : _d, _e = _a.tapToClose, tapToClose = _e === void 0 ? false : _e, onClose = _a.onClose;
    var n = getNewContainer();
    if (!content)
        return;
    n.toast({ type: type, content: content, time: time, shade: shade, shadeType: shadeType, css: css, tapToClose: tapToClose, onClose: onClose });
};
/*
    icon 分别有
    btn_selectd 成功
    alert_toast 警告
    delete 失败
    busy_toast 繁忙 // 哭脸
    internet_toast 没有网络
    loading 加载 // 会转的哟
 */
exports.default = {
    show: function (content, time, options) {
        if (options === void 0) { options = {}; }
        return toast('text', content, time, options);
    },
    success: function (content, time, options) {
        if (options === void 0) { options = {}; }
        return toast('success', content, time, options);
    },
    warning: function (content, time, options) {
        if (options === void 0) { options = {}; }
        return toast('warning', content, time, options);
    },
    error: function (content, time, options) {
        if (options === void 0) { options = {}; }
        return toast('error', content, time, options);
    },
    busy: function (content, time, options) {
        if (options === void 0) { options = {}; }
        return toast('busy', content, time, options);
    },
    wifi: function (content, time, options) {
        if (options === void 0) { options = {}; }
        return toast('wifi', content, time, options);
    },
    /*
    loading
    默认时间无限制 需要手动关闭
    默认显示背景层
     */
    loading: function (content, time, options) {
        if (content === void 0) { content = '加载中...'; }
        if (time === void 0) { time = 10000; }
        if (options === void 0) { options = {}; }
        options.shade = options.shade === undefined ? true : options.shade;
        return toast('loading', content, time, options);
    },
    // 设置独立的 loading  Toast.setIndependentLoading(true); 全局设置
    setIndependentLoading: function (b) {
        Container_1.default.independentLoading = b;
    },
    // 隐藏 loading
    hideLoading: function () { return newContainer && newContainer.hideLoading(); },
    // 隐藏
    hide: function () { return newContainer && newContainer.hide(); },
    // 销毁
    destroy: function () {
        if (newContainer) {
            newContainer.destroy();
            newContainer = undefined;
        }
    },
};
