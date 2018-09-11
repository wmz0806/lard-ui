"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var React = require("react");
var ReactDOM = require("react-dom");
var classnames_1 = require("classnames");
var Toast_1 = require("./Toast");
var utils_1 = require("../../utils");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var beforeQueue = []; //队列
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            toast: {},
            loading: {},
        };
        _this.child = null;
        _this.loadingChild = null;
        _this.hideLoadingTimer = undefined;
        _this.hideTimer = undefined;
        return _this;
    }
    Container.prototype.releaseQueue = function () {
        var _this = this;
        beforeQueue.forEach(function (options) {
            if (typeof (options) === 'string') {
                _this[options] && _this[options]();
            }
            else
                _this.add(options);
        });
    };
    Container.prototype.add = function (toast) {
        // 添加toast
        toast.key = utils_1.default.createUUID();
        if (Container.independentLoading && toast.type === 'loading') {
            this.setState({ loading: toast });
        }
        else {
            this.setState({ toast: toast });
        }
    };
    Container.prototype.closePack = function (toast) {
        this.setState({ toast: {} });
        toast.onClose && toast.onClose();
    };
    Container.prototype.destroy = function () {
        if (Container.independentLoading)
            this.setState({ toast: {}, loading: {} });
        else
            this.setState({ toast: {} });
    };
    Container.prototype.hideLoading = function () {
        var _this = this;
        clearTimeout(this.hideLoadingTimer);
        this.hideLoadingTimer = setTimeout(function () {
            if (_this.loadingChild)
                _this.loadingChild.close();
        }, 16);
    };
    Container.prototype.hide = function () {
        var _this = this;
        clearTimeout(this.hideTimer);
        this.hideTimer = setTimeout(function () {
            if (_this.child)
                _this.child.close();
        }, 16);
    };
    Container.prototype.closeLoadingPack = function (loading) {
        this.setState({ loading: {} });
        loading.onClose && loading.onClose();
    };
    Container.prototype.getToastDom = function () {
        var _this = this;
        var toast = this.state.toast;
        if (toast.type) {
            return (React.createElement(Toast_1.default, __assign({ ref: function (child) {
                    _this.child = child;
                }, className: cx(pre + "toast-child") }, toast, { onRealClose: function () { return _this.closePack(toast); } })));
        }
    };
    Container.prototype.getShadeDom = function () {
        var _a = this.state, toast = _a.toast, loading = _a.loading;
        if (Container.independentLoading && loading.shade) {
            return React.createElement("div", { className: cx(pre + "toast-shade " + loading.shadeType) });
        }
        if (toast.shade) {
            return React.createElement("div", { className: cx(pre + "toast-shade " + toast.shadeType) });
        }
    };
    Container.prototype.getLoadingDom = function () {
        var _this = this;
        var loading = this.state.loading;
        if (Container.independentLoading && loading.type) {
            return (React.createElement("div", { className: cx(pre + "toast-independent-loading") },
                React.createElement(Toast_1.default, __assign({ ref: function (child) {
                        _this.loadingChild = child;
                    }, className: cx(pre + "loading-child") }, loading, { onRealClose: function () { return _this.closeLoadingPack(loading); } }))));
        }
    };
    Container.prototype.render = function () {
        var _a = this.state, toast = _a.toast, loading = _a.loading;
        var shadeDom = this.getShadeDom();
        var toastDom = this.getToastDom();
        var loadingDom = this.getLoadingDom();
        return (React.createElement("div", { className: cx(pre + "toast-box", toast.css, loading) },
            shadeDom,
            toastDom,
            loadingDom));
    };
    Container.independentLoading = true; // 是否是独立的loading
    Container.create = function (properties) {
        if (properties === void 0) { properties = {}; }
        var props = __rest(properties, []);
        var div = document.createElement('div');
        div.classList.add(cx(pre + "toast-main-container"));
        document.body.appendChild(div);
        var container = ReactDOM.render(React.createElement(Container, __assign({}, props)), div, function () {
            container = this;
            container.releaseQueue(); // 释放队列数据
        });
        return {
            toast: function (toastProps) {
                if (container) {
                    container.add(toastProps);
                }
                else {
                    beforeQueue.push(toastProps); // 当控件还没有加载好的时候放入暂存队列中进行缓存
                }
            },
            hideLoading: function () {
                if (Container.independentLoading) {
                    if (container) {
                        container.hideLoading();
                    }
                    else {
                        beforeQueue.push('hideLoading');
                    }
                }
            },
            hide: function () {
                if (container) {
                    container.hide();
                }
                else {
                    beforeQueue.push('hide');
                }
            },
            destroy: function () {
                container && container.destroy();
                ReactDOM.unmountComponentAtNode(div);
                document.body.removeChild(div);
            },
        };
    };
    return Container;
}(React.Component));
exports.default = Container;
