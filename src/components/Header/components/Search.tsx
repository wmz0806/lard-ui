import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import {
  SearchProps as Props,
  SearchState as State,
} from '../interface/Interface';

import * as styles from '../style.less';
import config from '../../../config';

import Icon from '../../Icon';

const cx = cn.bind(styles);
const pre = config.pre;

class Header extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    isActive: false,            // 搜索栏是否激活
    curValue: '',              // 实际的搜索框内容
  };

  private _delayTimer: any = null;

  private _blurTimer: any = null;

  private _isNotBlur: boolean = false;

  private _isClickClear: boolean = false;

  public _inputRef: any = null;

  constructor(props) {
    super(props);
    if (props.searchConfig.value) this.state.curValue = props.searchConfig.value;
  }

  public componentWillUnmount(): void {
    this._blurTimer && clearTimeout(this._blurTimer);
    this._delayTimer && clearTimeout(this._delayTimer);
  }

  public setActive(isActive: boolean): void {
    this.setState({isActive});

    isActive ? this._inputRef.focus() : this._inputRef.blur();
  }

  public setValue(val): void {
    this.setState({curValue: val});
  }

  public getInputRef(): any {
    return this._inputRef;
  }

  public _searchClick(e: any): void {
    const {onClick} = this.props.searchConfig;
    onClick && onClick(e, this.state.curValue);
  }

  public _searchFocus(e: any): void {
    const {searchConfig} = this.props;
    const {curValue} = this.state;

    if (!searchConfig) console.warn('缺少必要的 searchConfig 属性');

    this.setState({isActive: true});

    const {searchValue, onFocus} = searchConfig;

    if (!this._isNotBlur) {
      if (!curValue && searchValue) {
        this._setSearchValue(searchValue);
      }
      onFocus && onFocus(e, curValue);
    }
  }

  public _searchBlur(e: any): boolean | void {
    /* 使用了 touchstart 解决点击事件冲突.. */
    const {onBlur} = this.props.searchConfig;

    // 如果不是点击x触发的 blur 就公开出去
    if (!this._isNotBlur) {
      onBlur && onBlur(e, this.state.curValue);
      this.setState({isActive: false});
      this._inputRef.blur()
    } else {
      this._inputRef.focus();
      this._isClickClear && this._setSearchValue('');
    }

    this._isNotBlur = false;
    this._isClickClear = false;

    return false
  }

  public _searchChange(e: any): void {
    const {onChangeDelay, onChange} = this.props.searchConfig;
    const {value} = e.target;
    this.setState({curValue: value});

    if (!onChangeDelay) {
      onChange && onChange(e, value);
    } else {
      this._delaychange(e, value);
    }
  }

  public _searchKeyDown(e: any): void {
    const {onSearch, onKeyDown} = this.props.searchConfig;

    const {curValue} = this.state;

    onKeyDown && onKeyDown(e, curValue);

    if (e.keyCode === 13 || e.key === 'Enter') {
      onSearch && onSearch(e, curValue);

      this.setState({isActive: false});
      this._inputRef.blur();
    }
  }

  public _setSearchValue(val: string): void {
    const {onChange} = this.props.searchConfig;
    this.setState({curValue: val});
    onChange && onChange(null, val);
  }

  public _delaychange(e: any, value: string): void {
    const {onChangeDelay, onChange} = this.props.searchConfig;

    if (this._delayTimer) clearTimeout(this._delayTimer);

    this._delayTimer = setTimeout(() => {
      onChange && onChange(e, value);
    }, onChangeDelay)
  }

  public _renderRight(): React.ReactNode {
    const {rightBtnConfig = {}, searchConfig: {onCancel}} = this.props;
    const {isActive, curValue} = this.state;

    let renderConfig = [];

    if (!Array.isArray(rightBtnConfig)) {
      renderConfig = [rightBtnConfig];
    } else {
      renderConfig = rightBtnConfig;
    }

    if (isActive) {
      return (
        <div
          className={cx(pre + 'header-search-right-btn')}
          onTouchStart={e => {
            onCancel && onCancel(e, curValue)
          }}
        >
          取消
        </div>
      );
    }

    return renderConfig.map((item, index) => {
      const {style, onClick, icon, content, img} = item;

      return (
        <div
          key={'right' + index}
          className={cx(pre + 'header-search-right-btn')}
          style={{...style}}
          onClick={e => onClick && onClick(e)}
          onTouchStart={e => isActive && onCancel && onCancel(e, curValue)}
        >
          {
            icon
              ? <Icon name={icon} size={0.44} style={{lineHeight: '.88rem'}}/>
              : (content ? content :
                (img ? <img src={img}/> : '')
              )
          }
        </div>
      )
    });

  }

  public render(): React.ReactNode {
    const {leftBtnConfig = {}, searchConfig} = this.props;
    const {isActive} = this.state;

    return (
      <div className={cx(pre + 'header-container')}>
        {
          leftBtnConfig &&
          <div
            className={cx(pre + 'header-left-btn', leftBtnConfig.className)}
            onClick={(e) => leftBtnConfig.onClick && leftBtnConfig.onClick(e)}
            style={{...leftBtnConfig.style}}
          >
            {
              leftBtnConfig.icon
                ? <Icon name={leftBtnConfig.icon} size={0.44} style={{lineHeight: '.88rem'}}/>
                : (leftBtnConfig.content || <img src={leftBtnConfig.img}/>)
            }
          </div>
        }

        <div
          className={cx(pre + 'header-search-container')}
          style={{left: isActive ? '.3rem' : '.9rem'}}
        >
          <div
            className={cx(pre + 'header-search-icon')}
            onTouchStart={() => this.state.isActive && (this._isNotBlur = true)}
          >
            <Icon name={'sousuo'} size={.3} style={{lineHeight: '.6rem'}}/>
          </div>
          <form onSubmit={(e) => e.preventDefault()} action=''>
            <input
              type="search"
              ref={r => this._inputRef = r}
              placeholder={searchConfig.placeholder}
              value={this.state.curValue}
              maxLength={searchConfig.maxLength}
              onKeyDown={(e) => this._searchKeyDown(e)}
              onClick={(e) => this._searchClick(e)}
              onFocus={(e) => this._searchFocus(e)}
              onBlur={(e) => this._searchBlur(e)}
              onChange={(e) => this._searchChange(e)}
            />
          </form>
          {
            this.state.isActive && this.state.curValue && <div
              className={cx(pre + 'header-search-clear')}
              onTouchStart={() => {
                if (this.state.isActive) {
                  this._isNotBlur = true;
                  this._isClickClear = true;
                }
              }}
            >
              <Icon name={'qingkongwenben'} size={.32} color={'#C5C5C5'} style={{lineHeight: '.6rem'}}/>
            </div>
          }

        </div>

        <div className={cx(pre + 'header-search-right-btn-group')}>
          { this._renderRight() }
        </div>



      </div>
    )
  }
}

export default Header
