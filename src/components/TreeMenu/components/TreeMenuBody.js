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
var ReactDom = require("react-dom");
var classnames_1 = require("classnames");
var helper_1 = require("./helper");
var styles = require("../style.less");
var config_1 = require("../../../config");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var beforeLoad = null;
/* body内的容器节点和实例化容器 */
var div = null;
var Container = null;
var TreeMenuBody = /** @class */ (function (_super) {
    __extends(TreeMenuBody, _super);
    function TreeMenuBody(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isShow: false,
            data: [],
            activeIndex: [],
            transformQueue: [],
            bodyScale: '0',
            onClick: undefined,
            top: '0',
            onShow: undefined,
            onHide: undefined,
        };
        /* 总的列数 */
        _this.col = 0;
        /* 实际上看得到的列数 */
        _this.showCol = 0;
        _this._timer = null;
        var _a = props.isShow, isShow = _a === void 0 ? false : _a, data = props.data;
        _this.state.isShow = isShow;
        /* 存入数据, 追踪选中的数据 */
        _this.state.data = helper_1.setData(data);
        _this.state.activeIndex = helper_1.getActiveIndex(data);
        return _this;
    }
    TreeMenuBody.prototype.componentDidMount = function () {
        this._setCSS();
        if (beforeLoad) {
            this.show(beforeLoad);
            beforeLoad = null;
        }
    };
    TreeMenuBody.prototype.componentWillUnmount = function () {
        this._timer && clearTimeout(this._timer);
    };
    TreeMenuBody.prototype.show = function (props) {
        var _this = this;
        var data = props.data, _a = props.isShow, isShow = _a === void 0 ? true : _a, _b = props.isAsync, isAsync = _b === void 0 ? false : _b, onClick = props.onClick, top = props.top, onHide = props.onHide, onShow = props.onShow;
        if (div)
            div.style.top = top || '';
        this.setState({
            isAsync: isAsync, isShow: isShow, onClick: onClick, onHide: onHide, onShow: onShow,
            data: helper_1.setData(data || []),
            activeIndex: helper_1.getActiveIndex(data || []),
        }, function () {
            _this._setCSS();
        });
        if (isShow) {
            this._timer = setTimeout(function () {
                _this._mainTransition(true);
                _this.setState({ bodyScale: '1' });
            }, 16);
        }
        onShow && onShow();
    };
    TreeMenuBody.prototype.hide = function () {
        var onHide = this.state.onHide;
        this._mainTransition(false);
        this.setState({ bodyScale: '0' });
        onHide && onHide();
    };
    TreeMenuBody.prototype._mainTransition = function (isShow) {
        if (!div)
            return;
        div.style.opacity = isShow ? '1' : '0';
        div.style.visibility = isShow ? 'visible' : 'hidden';
    };
    TreeMenuBody.prototype._update = function (nextActiveIndex) {
        var _this = this;
        var data = this.state.data;
        // 根据新的index 设定组件的 data;
        var newData = helper_1.setActive(nextActiveIndex, data);
        this.setState({ activeIndex: nextActiveIndex, data: newData }, function () { return _this._setCSS(); });
    };
    TreeMenuBody.prototype._setCSS = function () {
        /* 设定每一个list的位移 */
        var col = this.col;
        var showCol = this.showCol;
        var transformQueue = this.state.transformQueue;
        if (!col || !showCol)
            return;
        transformQueue.length = col;
        transformQueue.fill('');
        transformQueue.forEach(function (item, index) {
            transformQueue[index] = (!index || index >= showCol)
                ? '0'
                : -(showCol - index) * (100 / showCol) + "%";
        });
        this.setState({ transformQueue: transformQueue });
    };
    TreeMenuBody.prototype._addListAndUpdate = function (res, clickData, nextIndex) {
        var _this = this;
        var _a = this.state, data = _a.data, isAsync = _a.isAsync;
        // 同步数据的时候, 不让外部调用这个方法
        if (!isAsync)
            return;
        if (clickData)
            clickData.children = res;
        var newData = helper_1.setActive(nextIndex, data);
        this.setState({ data: newData, activeIndex: nextIndex }, function () { return _this._setCSS(); });
    };
    /*
    * 点击item事件
    * 1. 需截断跟踪的activeIndex
    * 2. 需更改UI展示data
    * */
    TreeMenuBody.prototype._itemClick = function (e, listIndex, index, item) {
        var _this = this;
        var _a = this.state, activeIndex = _a.activeIndex, data = _a.data, onClick = _a.onClick, isAsync = _a.isAsync;
        /*
          * 1. 如果是异步情况
          * 如果返回Promise, 那么等待结果返回
          * 也可以调用 callback, 组件回调观察回调事件返回
          * 若没有返回, 则认为以后没有数据, 若返回, 则动态添加数据到state内
          * */
        var clickData = helper_1.getClickData(data, activeIndex, listIndex);
        var nextActiveIndex = helper_1.updateActiveIndex(activeIndex, listIndex, index);
        var res = onClick && onClick(e, listIndex, index, item, data, nextActiveIndex, function (res) { return _this._addListAndUpdate(res, clickData && clickData[index], nextActiveIndex); });
        if (isAsync) {
            if (res && res.then && res.catch) {
                res.then(function (res) {
                    _this._addListAndUpdate(res, clickData && clickData[index], nextActiveIndex);
                });
            }
        }
        else {
            /*
            * 2. 如果是同步情况, 数据已经全都给组件了, 只需要整起
            * */
            this._update(nextActiveIndex);
        }
    };
    TreeMenuBody.prototype._renderItem = function (data, listIndex) {
        var _this = this;
        if (listIndex[listIndex.length - 1] === -1)
            return (React.createElement("li", null));
        var showCol = this.showCol;
        var list = helper_1.getRenderData(data, listIndex);
        return list && list.map(function (item, index) {
            var isActive = item.isActive, label = item.label;
            return (React.createElement("li", { key: 'item' + index, onClick: function (e) {
                    _this._itemClick(e, listIndex.length, index, item);
                }, className: cx(pre + 't-m-b-item', isActive && (pre + 't-m-b-item-active')) },
                React.createElement("div", { className: cx(pre + 't-m-b-item-text'), style: { width: 100 / showCol + "%" } }, label)));
        });
    };
    TreeMenuBody.prototype._renderCol = function () {
        var _a = this.state, data = _a.data, activeIndex = _a.activeIndex, transformQueue = _a.transformQueue;
        /*
         * 必须要显示已经选中的, 还有选中的那个的下一级(如果有)
         * activeIndex的长度, 代表了渲染了几列列表
         * */
        var renderIndex = [];
        var renderList = [];
        var renderCol = 0;
        for (var i = 0; i <= activeIndex.length; i++) {
            var Item = this._renderItem(data, renderIndex.slice());
            Item && renderCol++;
            renderList.push(React.createElement("ul", { key: 'col' + i, className: cx(pre + 't-m-b-list'), style: {
                    left: i === 0 ? '0' : '100%',
                    backgroundColor: (i !== 0 && i === activeIndex.length) ? '#F8F8F8' : '',
                    transform: "translateX(" + transformQueue[i] + ")",
                    WebkitTransform: "translateX(" + transformQueue[i] + ")",
                } }, Item));
            renderIndex.push(activeIndex.length > i ? activeIndex[i] : -1);
        }
        /* 不删除 ul 节点 保留动画 */
        var al = activeIndex.length;
        if (this.col > al) {
            for (var i = 0; i < this.col - al; i++) {
                renderList.push(React.createElement("ul", { key: 'pre-col' + i, className: cx(pre + 't-m-b-list', pre + 't-m-b-list-prev'), style: {
                        transform: "translateX(0)",
                        WebkitTransform: "translateX(0)",
                    } },
                    React.createElement("li", null)));
            }
        }
        /* 如果已经渲染了一列, 就不删除节点, 只是让他隐藏掉 */
        if (renderCol > this.col)
            this.col = renderCol;
        this.showCol = renderCol;
        return renderList;
    };
    TreeMenuBody.prototype.render = function () {
        var _this = this;
        var bodyScale = this.state.bodyScale;
        return (React.createElement("div", { className: cx(pre + 'tree-menu-container'), onClick: function () { return _this.hide(); } },
            React.createElement("div", { className: cx(pre + 'tree-menu-body', { active: bodyScale === '1' }), onClick: function (e) { return e.stopPropagation(); } }, this._renderCol())));
    };
    TreeMenuBody.defaultProps = {
        top: '0',
        isActive: false,
        data: [],
    };
    return TreeMenuBody;
}(react_1.Component));
var getContainer = function (props) {
    if (!div) {
        div = document.createElement('div');
        div.className = 'lui-tree-menu-body-main';
        document.body.appendChild(div);
        ReactDom.render(React.createElement(TreeMenuBody, { data: [] }), div, function () {
            Container = this;
        });
    }
    return Container;
};
var Body = {
    show: function (props) {
        var Container = getContainer();
        Container ? Container.show(props) : beforeLoad = props;
        getContainer(props);
    },
    hide: function () {
        var Container = getContainer();
        Container && Container.hide();
    }
};
exports.default = Body;
