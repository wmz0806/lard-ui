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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var classnames_1 = require("classnames");
var Icon_1 = require("../Icon");
var config_1 = require("../../config");
var styles = require("./style.less");
var pre = config_1.default.pre;
var cx = classnames_1.default.bind(styles);
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            disabled: _this.props.disabled,
            disabledOpacity: _this.props.disabledOpacity,
            loadingChildren: null
        };
        return _this;
    }
    Button.prototype.componentDidMount = function () {
        // empty
    };
    Button.prototype.componentWillReceiveProps = function (nextProps) {
        var opt = {};
        if (nextProps.disabled !== this.state.disabled) {
            opt.disabled = nextProps.disabled;
        }
        if (nextProps.disabledOpacity !== this.state.disabledOpacity) {
            opt.disabledOpacity = nextProps.disabledOpacity;
        }
        if (Object.keys(opt).length)
            this.setState(opt);
    };
    Button.prototype.renderButton = function () {
        var _this = this;
        var _a = this.props, target = _a.target, className = _a.className, attribute = _a.attribute, style = _a.style, onClick = _a.onClick;
        var params = __assign({}, attribute, { className: cx(pre + "button", className, {
                disabled: this.state.disabled,
                disabledOpacity: this.state.disabledOpacity
            }), style: style, onClick: function (e) {
                if (_this.state.disabled || _this.state.disabledOpacity)
                    return;
                if (_this.props.autoDisabled && onClick) {
                    var p = onClick(e);
                    if (p && typeof (p) === 'object' && p.then) {
                        //包含then方法
                        if (!_this.props.loading)
                            _this.setState({ disabled: true });
                        p.then(function () {
                            _this.enabled();
                        }).catch(function () {
                            _this.enabled();
                        });
                    }
                }
                else
                    onClick && onClick(e);
                if (_this.props.loading) {
                    _this.setState({
                        disabledOpacity: true,
                        loadingChildren: React.createElement("div", { className: cx(pre + "loading-view") },
                            React.createElement(Icon_1.default, { name: 'jiazai', className: 'rotateLoop', size: 0, color: '' }),
                            React.createElement("span", null, _this.props.loading))
                    });
                }
            } });
        var children = this.getButtonChildren();
        if (target === 'button') {
            return (React.createElement("div", __assign({}, params), children));
        }
        else if (target === 'a') {
            return (React.createElement("a", __assign({ href: 'javascript:;' }, params), children));
        }
        else {
            return React.createElement("button", __assign({}, params), children);
        }
    };
    Button.prototype.getButtonChildren = function () {
        if (this.state.loadingChildren)
            return this.state.loadingChildren;
        var children = this.props.children;
        return children;
    };
    Button.prototype.enabled = function () {
        this.setState({
            disabled: false,
            disabledOpacity: false,
            loadingChildren: null
        });
    };
    Button.prototype.render = function () {
        return this.renderButton();
    };
    Button.defaultProps = {
        children: null,
        className: "",
        style: {},
        target: 'button',
        disabled: false,
        disabledOpacity: false,
        loading: "",
        autoDisabled: true,
        attribute: {},
        onClick: undefined,
    };
    return Button;
}(React.Component));
exports.default = Button;
