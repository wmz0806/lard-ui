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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var classnames_1 = require("classnames");
var PopWindow_1 = require("../PopWindow");
var styles = require("./style.less");
var config_1 = require("../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var popWindowRef = null;
var ActionSheet = /** @class */ (function (_super) {
    __extends(ActionSheet, _super);
    function ActionSheet(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            active: false,
        };
        return _this;
    }
    ActionSheet.prototype._renderContent = function () {
        var cancel = {
            content: '取消',
            color: '#3B4FA0',
        };
        var content = this.props.list.filter(function (item) {
            if (item.isCancel)
                cancel = item;
            return !item.isCancel;
        });
        return (React.createElement("div", null,
            React.createElement("ul", { className: cx(pre + 'a-s-main') }, content.map(function (_a, index) {
                var color = _a.color, content = _a.content, disabled = _a.disabled, isDelete = _a.isDelete, onClick = _a.onClick;
                return (React.createElement("li", { key: index, className: cx(pre + 'a-s-item', isDelete ? pre + 'a-s-delete' : '', disabled ? pre + 'a-s-disabled' : ''), style: { color: color ? color : '' }, onClick: function (e) {
                        !disabled && onClick && onClick(e);
                        !disabled && popWindowRef && popWindowRef.hide();
                    } }, content));
            })),
            React.createElement("div", { className: cx(pre + 'a-s-cancel'), onClick: function (e) {
                    cancel.onClick && cancel.onClick(e);
                    popWindowRef && popWindowRef.hide();
                } }, cancel.content)));
    };
    ActionSheet.prototype.render = function () {
        return (React.createElement("div", { className: cx(pre + 'action-sheet-container') }, this._renderContent()));
    };
    ActionSheet.defaultProps = {};
    return ActionSheet;
}(react_1.Component));
// 导出方法..
exports.default = {
    show: function (props) {
        if (popWindowRef) {
            popWindowRef._show({
                content: React.createElement(ActionSheet, { list: props.list }),
                backColor: 'transparent',
                type: 'bottom',
                onHide: props.onHide,
                animateTime: 250,
            });
        }
        else {
            popWindowRef = PopWindow_1.default.show({
                content: React.createElement(ActionSheet, { list: props.list }),
                backColor: 'transparent',
                type: 'bottom',
                onHide: props.onHide,
                animateTime: 250,
            }, pre + 'action-sheet-wrapper');
        }
    },
    hide: function () {
        popWindowRef.hide();
    }
};
