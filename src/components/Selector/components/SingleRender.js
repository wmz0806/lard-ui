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
var classnames_1 = require("classnames");
var styles = require("../style.less");
var config_1 = require("../../../config");
var utils_1 = require("../../../utils");
var Icon_1 = require("../../Icon");
var cx = classnames_1.default.bind(styles);
var pre = config_1.default.pre;
var createUUID = utils_1.default.createUUID;
/*
* 组件内部维护选中状态
* 有变动时, 调用refMap的set方法
* ---- test ----
* */
var radioSelectMap = {};
var radioRefMap = {};
var checkboxSelectMap = {};
var checkboxRefMap = {};
var checkboxASRefMap = {};
var SingleSelect = /** @class */ (function (_super) {
    __extends(SingleSelect, _super);
    function SingleSelect(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isChoose: false,
            allSelectStatus: 0,
        };
        var id = props.id, _a = props.isChoose, isChoose = _a === void 0 ? false : _a, index = props.index, type = props.type, isAllSelect = props.isAllSelect;
        _this.state.isChoose = isChoose;
        /* 维护组件组的选中状态, 实时更新 */
        if (type === 'radio') {
            radioSelectMap[id][index] = isChoose;
        }
        else if (type === 'checkbox' && !isAllSelect) {
            // 全选的状态不用关注
            checkboxSelectMap[id][index] = isChoose;
        }
        return _this;
    }
    SingleSelect.prototype.componentDidMount = function () {
        var _a = this.props, id = _a.id, type = _a.type;
        if (type === 'checkbox') {
            var status_1 = _getAllSelectStatus(id);
            checkboxASRefMap[id] && checkboxASRefMap[id].setAllSelectStatus(status_1);
        }
    };
    SingleSelect.prototype.componentWillUnmount = function () {
        /* 卸载缓存区的内容 */
        var _a = this.props, id = _a.id, type = _a.type, index = _a.index, isAllSelect = _a.isAllSelect;
        if (isAllSelect) {
            delete checkboxASRefMap[id];
        }
        else if (type === 'radio') {
            var refMap = radioRefMap[id];
            refMap[index] = null;
            if (refMap.every(function (item) { return !item; })) {
                delete radioRefMap[id];
                delete radioSelectMap[id];
            }
        }
        else if (type === 'checkbox') {
            var refMap = checkboxRefMap[id];
            refMap[index] = null;
            if (refMap.every(function (item) { return !item; })) {
                delete checkboxRefMap[id];
                delete checkboxSelectMap[id];
                delete checkboxASRefMap[id];
            }
        }
    };
    SingleSelect.prototype.setChoose = function (isChoose) {
        var _this = this;
        /*
         * 1. 更新当前组件的state
         * 2. 更新 selectMap 的值
         * 3. 如果是 checkbox, 还需要更新全选的状态
         * */
        var _a = this.props, type = _a.type, id = _a.id, index = _a.index, isAllSelect = _a.isAllSelect;
        if (type === 'radio') {
            this.setState({ isChoose: isChoose });
            radioSelectMap[id][index] = isChoose;
        }
        else if (type === 'checkbox') {
            this.setState({ isChoose: isChoose }, function () { type === 'checkbox' && !isAllSelect && _this._updateAllSelectStatus(); });
            checkboxSelectMap[id][index] = isChoose;
        }
    };
    SingleSelect.prototype.setAllSelectStatus = function (status) {
        this.setState({ allSelectStatus: status });
    };
    SingleSelect.prototype.getChoose = function () {
        return this.state.isChoose;
    };
    SingleSelect.prototype.getStatus = function () {
        var _a = this.props, _b = _a.isErr, isErr = _b === void 0 ? false : _b, _c = _a.isDisabled, isDisabled = _c === void 0 ? false : _c;
        var isChoose = this.state.isChoose;
        return { isErr: isErr, isDisabled: isDisabled, isChoose: isChoose };
    };
    SingleSelect.prototype._updateAllSelectStatus = function () {
        // 更新全选的状态
        var id = this.props.id;
        var allSelectRef = checkboxASRefMap[id];
        var status = _getAllSelectStatus(id);
        if (allSelectRef)
            allSelectRef.setAllSelectStatus(status);
    };
    SingleSelect.prototype._click = function (e) {
        e.stopPropagation();
        var _a = this.props, type = _a.type, isAllSelect = _a.isAllSelect;
        if (isAllSelect)
            return this._allSelectClick(e);
        type === 'radio'
            ? this._radioClick(e)
            : this._checkboxClick(e);
    };
    SingleSelect.prototype._radioClick = function (e) {
        var isChoose = this.state.isChoose;
        var _a = this.props, isErr = _a.isErr, isDisabled = _a.isDisabled, id = _a.id, index = _a.index, onCheck = _a.onCheck;
        if (isErr || isDisabled || isChoose)
            return;
        radioRefMap[id].forEach(function (ref) { return ref && ref.setChoose(false); });
        radioSelectMap[id] = radioSelectMap[id].map(function () { return false; });
        this.setChoose(true);
        onCheck && onCheck(e, index, true);
    };
    SingleSelect.prototype._checkboxClick = function (e) {
        var isChoose = this.state.isChoose;
        var _a = this.props, isErr = _a.isErr, isDisabled = _a.isDisabled, id = _a.id, index = _a.index, onCheck = _a.onCheck;
        if (isErr || isDisabled)
            return;
        this.setChoose(!isChoose);
        var select = checkboxSelectMap[id].map(function (item) { return item; });
        onCheck && onCheck(e, index, !isChoose, select);
    };
    SingleSelect.prototype._allSelectClick = function (e) {
        var _a = this.props, id = _a.id, onCheck = _a.onCheck;
        var allSelectStatus = this.state.allSelectStatus;
        if (allSelectStatus === 2) {
            this.setState({ allSelectStatus: 0 });
        }
        else {
            this.setState({ allSelectStatus: 2 });
        }
        _setAllCheckboxChoose(id, allSelectStatus !== 2);
        onCheck && onCheck(e, -1, allSelectStatus !== 2);
    };
    SingleSelect.prototype._renderIcon = function () {
        var _a = this.state, isChoose = _a.isChoose, allSelectStatus = _a.allSelectStatus;
        var _b = this.props, isErr = _b.isErr, isDisabled = _b.isDisabled, type = _b.type, isAllSelect = _b.isAllSelect;
        var isRadio = type === 'radio';
        if (isAllSelect) {
            var name_1 = ['duoxuan-weixuanzhong', 'duoxuan-weiquanxuan', 'duoxuan-xuanzhong'][allSelectStatus];
            return (React.createElement(Icon_1.default, { name: name_1, size: 0.4, color: allSelectStatus ? '#3B4FA0' : '#999', style: { position: 'absolute' } }));
        }
        else {
            return (React.createElement("div", { className: cx(pre + "selector-box", isChoose && 'active') },
                React.createElement(Icon_1.default, { name: isRadio ? 'danxuan-xuanzhong' : 'duoxuan-xuanzhong', className: cx({ error: isErr, disabled: isDisabled, choose: true }) }),
                React.createElement(Icon_1.default, { name: isRadio ? 'danxuan-weixuanzhong' : 'duoxuan-weixuanzhong', className: cx({ error: isErr, disabled: isDisabled, choose: false }) })));
        }
    };
    SingleSelect.prototype.render = function () {
        var _this = this;
        var _a = this.props, id = _a.id, index = _a.index, className = _a.className, style = _a.style;
        return (React.createElement("div", { key: id + index, onClick: function (e) { return _this._click(e); }, className: cx(pre + 'single-main', className), style: __assign({}, style) },
            React.createElement("div", { className: cx(pre + 'single-icon') }, this._renderIcon())));
    };
    SingleSelect.defaultProps = {};
    return SingleSelect;
}(react_1.Component));
var Render = function (props, config, id) {
    var isChoose = props.isChoose, isDisabled = props.isDisabled, isErr = props.isErr, isAllSelect = props.isAllSelect;
    var onCheck = config.onCheck, type = config.type;
    var index = props.index;
    if (index === undefined && !isAllSelect) {
        index = type === 'radio' ? radioSelectMap[id].length - 1 : checkboxSelectMap[id].length - 1;
    }
    return (React.createElement(SingleSelect, { id: id, index: index, type: type, isChoose: isChoose, isDisabled: isDisabled, isErr: isErr, isAllSelect: isAllSelect, ref: function (r) {
            if (type === 'radio') {
                radioRefMap[id] = radioRefMap[id] || [];
                radioRefMap[id][index] = r;
            }
            else if (type === 'checkbox') {
                /* 狗东西不知道为啥一直抽风报错 */
                checkboxRefMap[id] = checkboxRefMap[id] || [];
                if (isAllSelect) {
                    checkboxASRefMap[id] = r;
                }
                else {
                    checkboxRefMap[id][index] = r;
                }
            }
        }, onCheck: function (e, index, choose, select) { return onCheck(e, index, choose, select); } }));
};
var Wrapper = function (props, id, type) {
    var index = props.index, children = props.children, isAllSelect = props.isAllSelect;
    var isRadio = type === 'radio';
    var _onClick = function (e) {
        var ref = isRadio
            ? radioRefMap[id][index]
            : (isAllSelect ? checkboxASRefMap[id] : checkboxRefMap[id][index]);
        if (isRadio) {
            ref._radioClick(e);
        }
        else {
            isAllSelect ? ref._allSelectClick(e) : ref._checkboxClick(e);
        }
    };
    return (React.createElement("div", { className: cx(pre + 'selector-wrapper'), onClick: function (e) { return _onClick(e); } }, children));
};
var RadioItem = function (config) {
    var id = createUUID();
    /* 一系列组件的状态维护 */
    radioSelectMap[id] = radioSelectMap[id] || [];
    /*
    * 返回组件 function
    * */
    var Radio = function (props) {
        config.type = 'radio';
        return Render(props, config, id);
    };
    /*
    * 返回 wrapper 组件
    * */
    var RadioWrapper = function (props) {
        return Wrapper(props, id, 'radio');
    };
    var getChoose = function () { return radioSelectMap[id].map(function (item) { return item; }); };
    var getRef = function () { return radioRefMap[id]; };
    return {
        Radio: Radio, RadioWrapper: RadioWrapper, getChoose: getChoose, getRef: getRef,
    };
};
exports.RadioItem = RadioItem;
var CheckboxItem = function (config) {
    var id = createUUID();
    /* 一系列组件的状态维护 */
    checkboxSelectMap[id] = checkboxSelectMap[id] || [];
    /*
    * 返回组件 function
    * */
    var Checkbox = function (props) {
        config.type = 'checkbox';
        return Render(props, config, id);
    };
    /*
    * 返回 wrapper 组件
    * */
    var CheckboxWrapper = function (props) {
        return Wrapper(props, id, 'checkbox');
    };
    var getChoose = function () { return checkboxSelectMap[id].map(function (item) { return item; }); };
    var getRef = function () { return checkboxRefMap[id]; };
    var getAllSelectStatus = function () { return _getAllSelectStatus(id); };
    var selectAll = function (isChoose) {
        _setAllCheckboxChoose(id, isChoose);
    };
    return {
        Checkbox: Checkbox, CheckboxWrapper: CheckboxWrapper, getChoose: getChoose, getRef: getRef, getAllSelectStatus: getAllSelectStatus, selectAll: selectAll,
    };
};
exports.CheckboxItem = CheckboxItem;
/* helper */
/* 获取某一组 checkbox 的全选状态 */
var _getAllSelectStatus = function (id) {
    var refs = checkboxRefMap[id];
    if (!refs)
        return 0;
    var status = 0;
    var len = refs.length;
    var firstCheck = true;
    // 初始设置为0, 遇到选择则变成2, 再遇到未选择则变成1, break;
    for (var i = 0; i < len; i++) {
        var ref = refs[i];
        if (ref) {
            var _a = ref.getStatus(), isErr = _a.isErr, isDisabled = _a.isDisabled, isChoose = _a.isChoose;
            if (!isErr && !isDisabled) {
                if (status === 0 && isChoose) {
                    if (firstCheck) {
                        status = 2;
                    }
                    else {
                        status = 1;
                        break;
                    }
                }
                else if (status === 2 && !isChoose) {
                    status = 1;
                    break;
                }
                firstCheck = false;
            }
        }
    }
    return status;
};
var _setAllCheckboxChoose = function (id, isChoose) {
    var checkboxRefs = checkboxRefMap[id];
    checkboxRefs.forEach(function (item) {
        if (item) {
            var _a = item.getStatus(), isErr = _a.isErr, isDisabled = _a.isDisabled;
            !isErr && !isDisabled && item.setChoose(isChoose);
        }
    });
};
