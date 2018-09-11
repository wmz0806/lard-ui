import * as React from 'react';
import cn from 'classnames';
import config from '../../config';
import * as styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
  /**
   * 子元素
   * @default null
   */
  children: null | React.ReactNode;
  /**
   * 额外的 class 类名
   * @default ""
   */
  className?: string;
  /**
   * 额外的 style
   * @default {}
   */
  style?: object;

  /**
   * 点击事件
   * @default void
   */
  onClick?(): void;
}


const Item = ({className = '', children, style = {}, onClick}:Props) => {
  return (
    <button className={cx(`${pre}toolbar-item`, className)} style={style} onClick={onClick}>{children}</button>
  )
};

export default Item;
