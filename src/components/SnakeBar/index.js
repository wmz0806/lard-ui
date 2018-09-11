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
var react_1 = require("react");
var ReactDom = require("react-dom");
var classnames_1 = require("classnames");
var Icon_1 = require("../Icon");
var styles = require("./style.less");
var config_1 = require("../../config");
var horn = require("./images/horn.png");
var utils_1 = require("../../utils");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var queue = [];
var SnakeBar = /** @class */ (function (_super) {
    __extends(SnakeBar, _super);
    function SnakeBar(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            list: []
        };
        _this._timer = null;
        _this._autoCloseTimer = null;
        return _this;
    }
    SnakeBar.prototype.componentDidMount = function () {
        var _this = this;
        if (queue.length) {
            queue.forEach(function (props) { return _this._add(props); });
        }
    };
    SnakeBar.prototype.componentWillUnmount = function () {
        this._timer && clearTimeout(this._timer);
        this._autoCloseTimer && clearTimeout(this._autoCloseTimer);
    };
    SnakeBar.prototype._clickItem = function (e, item) {
        var onClick = item.onClick;
        onClick && onClick(e, item);
    };
    SnakeBar.prototype._closeItem = function (uuid) {
        var _this = this;
        var list = this.state.list;
        list.forEach(function (item) {
            item.animateClass = item.uuid === uuid ? pre + 'snake-bar-out' : '';
        });
        this.setState({ list: list });
        this._timer = setTimeout(function () {
            list = list.filter(function (item) { return item.uuid !== uuid; });
            _this.setState({ list: list });
        }, 150);
    };
    /* 加入列表 */
    SnakeBar.prototype._add = function (props) {
        var _this = this;
        var list = this.state.list;
        var uuid = utils_1.default.createUUID();
        list.push(__assign({}, props, { uuid: uuid, animateClass: pre + 'snake-bar-in' }));
        this.setState({ list: list });
        if (props.autoClose) {
            this._autoCloseTimer = setTimeout(function () {
                _this._closeItem(uuid);
            }, props.autoClose);
        }
        return function () { return _this.close(uuid); };
    };
    SnakeBar.prototype.show = function (props) {
        return this._add(props);
    };
    SnakeBar.prototype.close = function (uuid) {
        var list = this.state.list;
        if (!list.length)
            return;
        uuid
            ? this._closeItem(uuid)
            : this._closeItem(list[0].uuid || '');
        this.setState({ list: list });
    };
    SnakeBar.prototype.clear = function () {
        this.setState({ list: [] });
    };
    SnakeBar.prototype.destroy = function (container, div) {
        container && container.clear();
        if (!div)
            return;
        ReactDom.unmountComponentAtNode(div);
        document.body.removeChild(div);
    };
    SnakeBar.prototype.render = function () {
        var _this = this;
        var list = this.state.list;
        return list.length && (React.createElement("ul", { className: cx(pre + 'snake-bar-container') }, list.map(function (item, index) { return (React.createElement("li", { key: index, className: cx(pre + 'snake-bar-item', item.className, item.animateClass), style: __assign({ bottom: index * 0.1 + "rem", left: index * 0.05 + "rem", zIndex: 10 - index, opacity: (10 - index) / 10 }, item.style), onClick: function (e) { return _this._clickItem(e, item); } },
            React.createElement("div", { className: cx(pre + 'snake-bar-image'), style: { backgroundImage: "url(" + horn + ")" } }),
            React.createElement("div", { className: cx(pre + 'snake-bar-close'), onClick: function (e) {
                    e.stopPropagation();
                    _this.close(item.uuid);
                } },
                React.createElement(Icon_1.default, { name: 'cha', size: .4, color: 'white' })),
            React.createElement("div", { className: cx(pre + 'snake-bar-content') }, item.content))); })));
    };
    SnakeBar.defaultProps = {};
    return SnakeBar;
}(react_1.Component));
var container = null;
var div = null;
var getContainer = function (props) {
    if (!container) {
        div = document.createElement('div');
        div.className = pre + 'snake-bar-main';
        document.body.appendChild(div);
        ReactDom.render(React.createElement(SnakeBar, __assign({}, props)), div, function () {
            container = this;
        });
    }
    return container;
};
exports.default = {
    show: function (props) {
        var con = getContainer();
        if (con) {
            return con._add(props);
        }
        else {
            queue.push(props);
        }
    },
    hide: function (uuid) {
        var con = getContainer();
        con && con.close(uuid);
    },
    clear: function () {
        var con = getContainer();
        con && con.clear();
    },
    destroy: function () {
        var con = getContainer();
        con && con.destroy(con, div);
    },
};
