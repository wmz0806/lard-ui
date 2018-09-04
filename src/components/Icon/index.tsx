import * as React from 'react';
import cn from 'classnames';
import config from '../../config';
import styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
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
   * icon 名称
   * @default ""
   */
  name: string,
  /**
   * icon 颜色
   * @default “”
   */
  color?: string,
  /**
   * icon 大小
   * @default 0
   */
  size?: number,
  /**
   * 单位
   * @default rem
   */
  unit?: string,
}

export default class Icon extends React.Component<Props, object> {

  public static defaultProps: Props = {
    className: "",
    style: {},
    name: "",
    color: '',
    size: 0,
    unit: 'rem',
  };

  public render(): React.ReactNode {

    const {className, style, name, color, size, unit} = this.props;

    const sty:any = {...style};

    if(color) sty.color = color;
    if(size) sty.fontSize = `${size}${unit}`;

    return (
      <i className={cx(`${pre}icon`, `icon-${name}`, className)} style={sty}/>
    );
  }

}
