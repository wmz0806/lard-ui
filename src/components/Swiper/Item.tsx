import * as React from "react";
import cn from 'classnames';

import config from '../../config';
import styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
  /**
   * 子元素
   * @default null
   */
  children: null | React.ReactNode;

  /**
   * 额外的 class 类名 （指定的是 target 的类名）
   * @default ""
   */
  className?: string;

  /**
   * 额外的 style （指定的是 target 的style）
   * @default {}
   */
  style?: object;
}

class Item extends React.Component<Props, object> {
  public static defaultProps: Props = {
    children: null,
    className: "",
    style: {},
  };

  public render(): React.ReactNode {
    return (<div className={cx(`${pre}banner-slide`, this.props.className)} style={this.props.style}>
      {this.props.children}
    </div>)
  }
}

export default Item;
