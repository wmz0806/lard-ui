import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import Icon from '../../Icon/index';

import {Props, State} from '../interface/Interface';

import styles from '../style.less';
import config from '../../../config';

const cx = cn.bind(styles);
const pre = config.pre;

export default class extends Component<Props, State> {
  public static defaultProps = {
    placeholder: '',
    initValue: '',
    type: 'text',
    isDisabled: false,

    needClearIcon: false,
    needEncrypt: false,

    isBlurValidate: false,
    validateType: 'msg',
    validateMsg: '信息有误, 请重新输入',
    validateColor: '#E4393C',

    overLengthMsg: '不能再输入了',
    needTextAreaFooter: true,

    xmlTag: 'input',
  };

  public state: State = {
    value: '',
    isActive: false,
    isErr: false,
    isShowEncrypt: false,
    isShake: false,
    isDisabled: false,
  };

  private _textRef: any = null;

  private _isNotBlur: boolean = false;

  private _shakeTimer: any = null;
  private _scrollTimer: any = null;

  private _changeTimer: number | null = null;

  private _isAndroid: boolean = /[Aa]ndroid/.test(window.navigator.userAgent);

  constructor(props: Props) {
    super(props);
    const {needEncrypt} = props;
    this.state.isShowEncrypt = !needEncrypt;
    this.state.isDisabled = !!props.isDisabled;
  }

  public componentWillUnmount(): void {
    this._shakeTimer && clearTimeout(this._shakeTimer);
    this._scrollTimer && clearTimeout(this._scrollTimer);
  }

  public getRef(): any {
    return this._textRef
  }

  public validate(isShowErr: boolean = true): boolean {
    const isSuccess = this._validateValue();
    isShowErr && !isSuccess && this._showErr();
    return isSuccess
  }

  public getValue(): string {
    return this.state.value;
  }

  public setValue(value: string): void {
    this.setState({value});
  }

  public setDisabled(isDisabled: boolean): void {
    this.setState({isDisabled});
  }

  public _showErr(): void {
    const {validateType} = this.props;

    this.setState({isErr: true});

    if (validateType === 'shake') {
      this.setState({isShake: true});

      this._shakeTimer = setTimeout(
        () => this.setState({isShake: false}),
        400
      )
    }
  }

  public _validateValue(): boolean {
    const {validateReg, validateFunc} = this.props;
    const {value} = this.state;

    /* 若是字符串或者RegExp */
    if (validateReg) {
      if (typeof validateReg === 'string') {
        return value.indexOf(validateReg) !== -1;
      } else if (/RegExp/.test(Object.prototype.toString.call(validateReg))) {
        return validateReg.test(value);
      } else {
        console.warn('validateReg 格式错误, 直接通过验证');
        return true;
      }
    }

    /* 若是验证函数 */
    if (typeof validateFunc === 'function') {
      return validateFunc(value);
    }

    return true
  }

  /* 失焦时, 由于其优先级高, 仍然需要判断用户的真实意图 */
  public _onBlur(e: any): boolean {
    const {onBlur, isBlurValidate} = this.props;
    // 某些时候, 不需要将他失焦
    if (!this._isNotBlur) {
      this.setState({isActive: false});
      onBlur && onBlur(e, this.state.value);

      /* 若失焦时需要验证 */
      if (isBlurValidate) {
        !this._validateValue() && this._showErr();
      }

      this._textRef.blur();
    } else {
      this._textRef.focus();
    }

    this._isNotBlur = false;

    return false
  }

  public _onFocus(e: any): void {
    const {onFocus, initValue} = this.props;
    const {value} = this.state;

    this.setState({
      isActive: true,
      isErr: false,
    });

    if (!this._isNotBlur) {
      if (initValue && !value) this.setState({value: initValue});

      if (!this._isNotBlur) onFocus && onFocus(e, this.state.value);
    }

    this._scrollTimer = setTimeout(() => {
      this._isAndroid && this._textRef && this._textRef.scrollIntoViewIfNeeded();
    }, 350);
  }

  public _onChange(e: any): void {
    const {onChange, onChangeDelay} = this.props;
    const nativeEvent = e.nativeEvent;


    this.setState(
      {value: e.target.value},
      () => {
        if (onChangeDelay) {
          const now = Date.now();
          if (!this._changeTimer || (now - this._changeTimer) >= onChangeDelay) {
            onChange && onChange(nativeEvent, this.state.value);
            this._changeTimer = now;
          }
        } else {
          onChange && onChange(nativeEvent, this.state.value);
        }
      });
  }

  public _onClick(e: any): void {
    const {onClick} = this.props;

    onClick && onClick(e, this.state.value);
  }

  public _renderInput(): React.ReactNode {

    const {
      placeholder, type, maxLength,
      needClearIcon, needEncrypt,
      validateType, validateMsg, validateColor,
    } = this.props;

    const {value, isActive, isErr, isShowEncrypt, isDisabled} = this.state;

    const paddingRight = (): string => {
      const total = Number(needClearIcon) + Number(needEncrypt);
      if (!total) return '0';
      return `${(56 * total + 20) / 100}rem`
    };

    return (
      <div className={cx(pre + 't-f-input')}>
        <input
          ref={r => this._textRef = r}
          placeholder={placeholder}
          type={isShowEncrypt ? type : 'password'}
          pattern={type === 'number' ? '[0-9]*' : ''}

          maxLength={maxLength}
          disabled={isDisabled}

          onBlur={(e) => this._onBlur(e)}
          onFocus={(e) => this._onFocus(e)}
          onChange={(e) => this._onChange(e)}

          style={{paddingRight: paddingRight()}}

          value={value}
        />

        <div
          className={cx(pre + 't-f-input-icon')}
          onTouchStart={() => {
            this._isNotBlur = isActive && true
          }}
        >
          {
            needClearIcon && this.state.value &&
            <div
              onClick={() => {
                const {onClear} = this.props;
                this.setState({value: ''});

                onClear && onClear();
              }}
            >
              <Icon name={'cha'} size={.3} color={'#999'}/>
            </div>
          }
          {
            needEncrypt &&
            <div
              onClick={() => this.setState({isShowEncrypt: !isShowEncrypt})}
            >
              <Icon
                name={isShowEncrypt ? 'xianshi' : 'yincang'}
                size={.3}
                color={isShowEncrypt ? '#3B4FA0' : '#999'}
              />
            </div>
          }
        </div>

        <div className={cx(pre + 't-f-input-line')}>
          <div
            className={cx(pre + 't-f-input-line-inner')}
            style={{
              transform: `scale(${isActive ? '1' : '0'})`,
              WebkitTransform: `scale(${isActive ? '1' : '0'})`,
              backgroundColor: '#3B4FA0',
            }}
          />
          <div
            className={cx(pre + 't-f-input-line-inner')}
            style={{
              transform: `scale(${isErr ? '1' : '0'})`,
              WebkitTransform: `scale(${isErr ? '1' : '0'})`,
              backgroundColor: validateColor,
            }}
          />
        </div>

        {/* 如果验证是msg时 */}
        {
          validateType === 'msg' &&
          <div
            className={cx(pre + 't-f-v-msg')}
            style={{
              color: validateColor,
              opacity: isErr ? 1 : 0,
            }}
          >
            {validateMsg}
          </div>
        }
      </div>
    )
  }

  public _renderTextArea(): React.ReactNode {
    const {
      placeholder, maxLength,
      validateMsg, validateColor, overLengthMsg,
      height,
    } = this.props;

    const {value, isActive, isErr, isDisabled} = this.state;

    const renderErr = (): React.ReactNode => {
      if (isErr) {
        return <div className={cx(pre + 't-f-ta-err')}>{validateMsg}</div>;
      } else if (!isErr && ((maxLength || 0) <= value.length)) {
        return <div className={cx(pre + 't-f-ta-err')}>{overLengthMsg}</div>
      } else return null;
    };

    return (
      <div
        className={cx(pre + 't-f-ta')}
      >
        <textarea
          ref={r => this._textRef = r}
          value={value}
          placeholder={placeholder}
          disabled={isDisabled}
          maxLength={maxLength}

          onChange={(e) => this._onChange(e)}
          onBlur={(e) => this._onBlur(e)}
          onFocus={(e) => this._onFocus(e)}

          style={{height: height ? height : '2.23rem'}}
        />
        <div
          className={cx(pre + 't-f-ta-footer')}
          style={{color: validateColor}}
          onTouchStart={() => {
            this._isNotBlur = isActive && true
          }}
        >
          {renderErr()}
          {
            maxLength &&
            <div className={cx(pre + 't-f-ta-count')}>
              <span
                style={{color: maxLength === value.length ? validateColor : '#999'}}
              >{value.length}</span>
              <span> / {maxLength}</span>
            </div>
          }
        </div>
      </div>
    )
  }

  public render(): React.ReactNode {
    const {className, style, xmlTag} = this.props;
    const {isShake, isDisabled} = this.state;
    return (
      <div
        className={cx(
          pre + 'text-field-wrapper',
          isShake && (pre + 't-f-shake'),
          className
        )}
        onClick={(e) => this._onClick(e)}
        style={{opacity: isDisabled ? .3 : 1, ...style}}
      >
        {xmlTag === 'input' && this._renderInput()}
        {xmlTag === 'textArea' && this._renderTextArea()}
      </div>
    )
  }
}
