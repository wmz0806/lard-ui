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
var react_transition_group_1 = require("react-transition-group");
var classnames_1 = require("classnames");
var Icon_1 = require("../../Icon");
var helper_1 = require("./helper");
var styles = require("../style.less");
var config_1 = require("../../../config");
// TODO mock
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
/*
* 分为 1级, 2级, 3级的情况, 4级暂时不做, 有点乱
* 1级有可代替组件, 不做考虑
*
* */
var SelectorTree = /** @class */ (function (_super) {
    __extends(SelectorTree, _super);
    function SelectorTree(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isShow: false,
            choseData: [],
            data: []
        };
        /* 组件挂载中... */
        var data = props.data, isShow = props.isShow;
        _this.state.data = helper_1.formatData(data);
        _this.state.choseData = helper_1.getChose(data);
        _this.state.isShow = !!isShow;
        return _this;
    }
    // public componentDidMount(): void {  }
    // public componentWillUnmount(): void { }
    SelectorTree.prototype.show = function () {
        this.setState({ isShow: true });
    };
    SelectorTree.prototype.hide = function () {
        this.setState({ isShow: false });
    };
    SelectorTree.prototype.reset = function () {
        var onReset = this.props.onReset;
        var data = this.state.data;
        helper_1.closeAll(data);
        helper_1.resetData(data);
        onReset && onReset(data);
        this.setState({ data: data, choseData: [] });
    };
    SelectorTree.prototype._onSure = function () {
        var onSure = this.props.onSure;
        var choseData = this.state.choseData;
        onSure && onSure(choseData);
        this.hide();
    };
    SelectorTree.prototype._addItem = function (item, data) {
        var stateData = this.state.data;
        item.children = data;
        this._changeActive(item.index, !!item.isActive);
        helper_1.formatData(stateData);
        this.setState({ data: stateData });
    };
    SelectorTree.prototype._clickItem = function (item) {
        var _this = this;
        var _a = this.props, onClick = _a.onClick, isAsync = _a.isAsync;
        var res = onClick && onClick(item, function (data) { return _this._addItem(item, data); });
        /* 只有在小于2级的时候才可能异步接收数据! */
        if (isAsync && item.index.length <= 2) {
            if (res && res.then && res.catch) {
                res.then(function (data) { return _this._addItem(item, data); });
            }
            if (!res) {
                this._changeActive(item.index, !!item.isActive);
            }
        }
    };
    SelectorTree.prototype._deleteChose = function (indexArr) {
        var data = this.state.data;
        var choseItem = helper_1.getSelectItem(data, indexArr);
        if (choseItem)
            choseItem.isChoose = false;
        var choseData = helper_1.getChose(data);
        helper_1.setHasChildChose(data);
        this.setState({ data: data, choseData: choseData });
    };
    SelectorTree.prototype._changeActive = function (indexArr, isActive) {
        var data = this.state.data;
        /* 需要层层关闭相同层, 如果点击了第一层, 把所有的都关掉 */
        helper_1.closeItem(data, indexArr);
        if (indexArr.length === 1) {
            helper_1.closeAll(data);
        }
        var choseItem = helper_1.getSelectItem(data, indexArr);
        choseItem[choseItem.children ? 'isActive' : 'isChoose'] = !isActive;
        helper_1.setHasChildChose(data);
        this.setState({ data: data });
    };
    SelectorTree.prototype._changeChoose = function (item) {
        var data = this.state.data;
        item.isChoose = !item.isChoose;
        helper_1.setHasChildChose(data);
        var choseData = helper_1.getChose(data);
        this.setState({ data: data, choseData: choseData });
    };
    SelectorTree.prototype._renderChose = function () {
        var _this = this;
        var choseData = this.state.choseData;
        var length = choseData.length;
        return (React.createElement("div", { className: cx(pre + 's-t-chose-container') },
            React.createElement("div", { className: cx(pre + 's-t-title') }, length ? '已选' : '请选择'),
            React.createElement("ul", { className: cx(pre + 's-t-chose'), style: {
                    height: Math.ceil(length / 4) * 0.84 + "rem",
                } },
                React.createElement(react_transition_group_1.TransitionGroup, null, choseData.map(function (item, index) {
                    return (React.createElement(react_transition_group_1.CSSTransition, { key: item.uuid, timeout: 200, classNames: pre + 's-t-chose-fade' },
                        React.createElement("li", { key: item.uuid, className: cx(pre + 's-t-chose-item') },
                            React.createElement("div", { className: cx(pre + 's-t-chose-text', 'f-toe') }, item.label),
                            React.createElement("div", { className: cx(pre + 's-t-chose-delete'), onClick: function () { return _this._deleteChose(item.index); } },
                                React.createElement(Icon_1.default, { name: 'cha', color: 'white', size: .2 })))));
                })))));
    };
    SelectorTree.prototype._renderTree3 = function (data, item) {
        var _this = this;
        return (React.createElement("div", { className: cx(pre + 's-t-tree-3') },
            React.createElement("div", { className: cx(pre + 's-t-tree-title-3') }, item.label),
            React.createElement("ul", { className: cx(pre + 's-t-tree-inner-3') }, data.map(function (item, index) {
                return (React.createElement("li", { key: index, onClick: function () {
                        _this._clickItem(item);
                        _this._changeChoose(item);
                    }, className: cx(pre + 's-t-tree-item-3', 'f-toe', item.isChoose && (pre + 's-t-active-3')) }, item.label));
            }))));
    };
    /*
    * 二级树, 该组件至少需要 二级树!
    * 如果点选时没有子树, 则当做选中
    * */
    SelectorTree.prototype._renderTree2 = function (data) {
        var _this = this;
        var children = data.children;
        var isAsync = this.props.isAsync;
        if (!children)
            return;
        var height = (0.6 + helper_1.calcChildTreeHeight(children) + Math.ceil(children.length / 4) * 0.84) + 'rem';
        var activeChild = null;
        var activeItem = null;
        return (React.createElement("div", { onClick: function (e) { return e.stopPropagation(); }, className: cx(pre + 's-t-tree-2'), style: {
                height: data.isActive ? height : '0',
            } },
            React.createElement("ul", { className: cx(pre + 's-t-tree-inner-2') }, children.map(function (item, index) {
                if (item.isActive) {
                    activeItem = item;
                    activeChild = item.children;
                }
                var classNames = [];
                if (item.children) {
                    item.hasChildSelect && classNames.push(pre + 's-t-has-child-2');
                    item.isActive && classNames.push(pre + 's-t-active-2');
                }
                else {
                    item.isChoose && classNames.push(pre + 's-t-choose-2');
                }
                return (React.createElement("li", { key: index, className: cx.apply(void 0, [pre + 's-t-tree-item-2', 'f-toe'].concat(classNames)), onClick: function () {
                        _this._clickItem(item);
                        /* 这里只是同步的逻辑, 如果是异步, 走另一套逻辑 */
                        if (!isAsync) {
                            item.children
                                ? _this._changeActive(item.index, !!item.isActive)
                                : _this._changeChoose(item);
                        }
                    } }, item.label));
            })),
            activeChild && activeItem && this._renderTree3(activeChild, activeItem)));
    };
    /* 主树 */
    SelectorTree.prototype._renderTree1 = function () {
        var _this = this;
        var data = this.state.data;
        var isAsync = this.props.isAsync;
        console.log(data[0].children);
        console.log(helper_1.getAllChildChose(data[0].children));
        return (React.createElement("ul", { className: cx(pre + 's-t-tree') }, data.map(function (item, index) {
            return (React.createElement("li", { key: index, onClick: function () {
                    _this._clickItem(item);
                    if (!isAsync) {
                        _this._changeActive(item.index, !!item.isActive);
                    }
                }, className: cx(pre + 's-t-tree-item') },
                React.createElement("div", { className: cx(pre + 'tree-item-1') },
                    React.createElement("div", { className: cx(pre + 'tree-item-title-1', 'f-fl') }, item.label),
                    React.createElement("div", { className: cx(pre + 'tree-item-chose-1', 'f-toe') }, item.hasChildSelect &&
                        helper_1.getAllChildChose(item.children).map(function (_a) {
                            var label = _a.label;
                            return label;
                        }).join(',')),
                    React.createElement("div", { className: cx(pre + 'tree-item-more', 'f-fr') },
                        "\u66F4\u591A",
                        React.createElement(Icon_1.default, { name: 'xiangxia', size: .15 }))),
                _this._renderTree2(item)));
        })));
    };
    SelectorTree.prototype._renderFooter = function () {
        var _this = this;
        var _a = this.props, _b = _a.resetBtn, resetBtn = _b === void 0 ? {} : _b, _c = _a.sureBtn, sureBtn = _c === void 0 ? {} : _c;
        return (React.createElement("div", { className: cx(pre + 's-t-footer') },
            React.createElement("div", { onClick: function () { return _this.reset(); }, className: cx(pre + 's-t-reset', resetBtn.className), style: __assign({}, resetBtn.style) }, resetBtn.content || '重置'),
            React.createElement("div", { onClick: function () { return _this._onSure(); }, className: cx(pre + 's-t-sure', sureBtn.className), style: __assign({}, sureBtn.style) }, sureBtn.content || '确定')));
    };
    SelectorTree.prototype.render = function () {
        var isShow = this.state.isShow;
        return (React.createElement("div", { className: cx(pre + 'selector-tree-main', !isShow && (pre + 's-t-hidden')) },
            React.createElement("div", { className: cx(pre + 's-tree-scroll') },
                this._renderChose(),
                this._renderTree1()),
            this._renderFooter()));
    };
    SelectorTree.defaultProps = {};
    return SelectorTree;
}(react_1.Component));
exports.default = SelectorTree;
