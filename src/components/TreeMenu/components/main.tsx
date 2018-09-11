import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';

import Header from './TreeMenuHeader';
import Body from './TreeMenuBody';

import {MainProps as Props} from '../interface/Interface';

import * as styles from '../style.less';
import config from '../../../config';

const cx = cn.bind(styles);
const pre = config.pre;

class TreeMenu extends Component<Props, object> {
  public static defaultProps = {
    bodyData: []
  };

  private _headerRef: any | null = null;

  private _bodyTop: string = '';

  private _bodyActive: boolean = false;

  private _timer: any = null;

  constructor(props: Props) {
    super(props)
  }

  public componentDidMount(): void {
    const {headerConfig} = this.props;

    const headerRef: HTMLUListElement | null = this._headerRef && this._headerRef.getRef();

    this._bodyTop =  headerRef ? headerRef.getBoundingClientRect().bottom + 'px' : '0';

    for (let i = 0; i < headerConfig.length; i++) {
      if (headerConfig[i].isActive) {
        this._showBody(i, true);
        break;
      }
    }
  }

  public componentWillUnmount(): void {
    this._timer && clearTimeout(this._timer);
  }

  public hide(): void {
    Body.hide();
    this._hide();
  }

  public show(index: number): void {
    this._hide();
    this._showBody(index, true);
  }

  public setHeaderValue(index: number, value: string | React.ReactNode): void {
    this._headerRef.setValue(index, value);
  }

  public _hide(): void {
    // 只设置状态
    this._headerRef && this._headerRef.setActive(-1, false);
    this._bodyActive = false;
  }

  public _showBody(index: number, isActive: boolean): void {
    const _bodyActive = this._bodyActive;
    const {bodyData, isAsync, bodyClick} = this.props;

    const config = {
      top: this._bodyTop,
      data: bodyData[index] || [],
      isAsync,
      onClick: bodyClick,
      onHide: () => { this._hide() },
    };

    /* 如果本来就没有打开 */
    if (!_bodyActive) {
      if (isActive) {
        Body.show(config);
      }
    } else {
      /* 如果已经是打开状态 */
      Body.hide();
      if (isActive) {
        this._timer = setTimeout(() => {
          Body.show(config);
        }, 200)
      }
    }

    this._headerRef && this._headerRef.setActive(index, isActive);

    this._bodyActive = isActive;

  }

  public _headerClick(e: any, index: number, isActive: boolean): void {
    const {headerClick} = this.props;

    const headerRef: HTMLUListElement | null = this._headerRef && this._headerRef.getRef();

    this._bodyTop =  headerRef ? headerRef.getBoundingClientRect().bottom + 'px' : '0';

    headerClick && headerClick(e, index, isActive);

    this._showBody(index, isActive);
  }

  public render(): React.ReactNode {
    const {headerConfig, headerClassName, headerStyle} = this.props;
    return (
      <div className={cx(pre + 'tree-menu')}>
        <Header
          ref={r => this._headerRef = r}
          data={headerConfig}
          onClick={(e, index, isActive) => this._headerClick(e, index, isActive)}
          className={headerClassName}
          style={headerStyle}
        />
      </div>
    )
  }

}

export default TreeMenu;
