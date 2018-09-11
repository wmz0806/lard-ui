import * as React from 'react';
import cn from 'classnames';
import Icon from '../Icon';

import config from '../../config';
import * as styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
  /**
   * 额外的 class 类名 （指定的是 target 的类名）
   * @default ""
   */
  className?: string;
  /**
   * 大小
   * @default 1.14
   */
  size: number;

  /**
   * 单位
   * @default "rem"
   */
  unit?: string;

  /**
   * 是否显示动画
   * @default true
   */
  animate?: boolean;

  /**
   * FontLoading专属 图标颜色
   * @default #3B4EA0
   */
  color?: string;

  /**
   * FontLoading专属 边框颜色
   * @default #3B4EA0
   */
  borderColor?: string;
}



export const FontLoading = (props: Props) => {
  const {size = 0.88, animate = true, unit, color = '#3B4EA0', borderColor = '#3B4EA0'} = props;

  const {className} = props;

  return (
    <div className={cx(`${pre}loading`, `${pre}font-loading`, className)}>
      <div className={cx(`${pre}font-loading-box`)} style={{borderColor}}>
        <Icon className={cx(`${pre}font-loading-mk`)} name={'maika'} size={size} unit={unit} color={color}/>
        <Icon className={cx(`${pre}font-loading-border`, animate ? `${pre}loading-animate` : 'hidden')} name={'jiazai'} size={size} unit={unit} color={borderColor}/>
      </div>
    </div>
  );
};

const Loading = (props: Props) => {
  let {size, animate, unit} = props;
  const {className} = props;
  let custom = {};

  animate = animate === undefined ? true : animate;
  unit = unit === undefined ? 'rem' : unit;

  if (size !== 0.29 && size !== 0.44 && size !== 1.14 && size !== 1.71) {
    custom = {
      width: `${size}${unit}`, height: `${size}${unit}`,
    };
    size = 1.14;
  }

  if (!size) size = 1.14;

  if (unit === 'rem') size = Math.round(config.baseFontSize * size);

  return (
    <div className={cx(`${pre}loading`, `${pre}loading-${size}`, className)} style={custom}>
      <i className={cx('bg_contain',  animate ? '' : 'hidden')} />
      <em className={cx('bg_contain')}/>
      <span className={cx(`bg_contain`, animate ? `${pre}loading-animate` : 'hidden')}/>
    </div>
  );
};

export default Loading;

