import * as React from 'react';
import cn from 'classnames';

import {Simple as Props} from '../interface/Interface'

import styles from '../style.less';
import config from '../../../config';

import Icon from '../../Icon';

const cx = cn.bind(styles);
const pre = config.pre;

let defaultIcon = 'fanhui';

const Header: React.SFC<Props> = (props: Props) => {
  const {leftBtnConfig, titleConfig = {}, rightBtnConfig = [], style, className} = props;

  /* 若是有leftConfig 但是没有内容, 就使用默认icon */
  if (leftBtnConfig) {
    const {icon, content, img} = leftBtnConfig;
    if (!icon && !content && !img) {
      leftBtnConfig.icon = defaultIcon
    }
  }

  let titlePadding = 0.88;

  if (rightBtnConfig.length) {
    titlePadding = titlePadding * rightBtnConfig.length;
  }

  return (
    <div className={cx(pre + 'header-container', className)} style={{...style}}>
      {
        leftBtnConfig &&
        <button
          className={cx(pre + 'header-left-btn', leftBtnConfig.className)}
          onClick={(e) => leftBtnConfig.onClick && leftBtnConfig.onClick(e)}
          style={{...leftBtnConfig.style}}
        >
          {
            leftBtnConfig.icon
              ? <Icon name={leftBtnConfig.icon} size={0.34}/>
              : (leftBtnConfig.content || <img src={leftBtnConfig.img}/>)
          }
        </button>
      }

      <div
        className={cx(pre + 'header-title', titleConfig.className)}
        style={{...titleConfig.style}}
        onClick={(e) => titleConfig.onClick && titleConfig.onClick(e)}
      >
        {
          titleConfig.img
            ? <img src={titleConfig.img}/>
            : <h4 className={cx('f-toe')} style={{padding: `0 ${titlePadding}rem`}}>
              {titleConfig.content ? titleConfig.content : props.children}
            </h4>
        }
      </div>


      <div className={cx(pre + 'header-right-group-btn')}>
        {
          rightBtnConfig.map((btn, index) => (
            <button
              key={index}
              className={cx(pre + 'header-right-btn', btn.className)}
              style={{...btn.style}}
              onClick={e => btn.onClick && btn.onClick(e)}
            >
              {
                btn.icon
                  ? <Icon name={btn.icon} size={0.34}/>
                  : (btn.content || <img src={btn.img}/>)
              }
            </button>
          ))
        }
      </div>
    </div>
  )
};

export default Header

export const setDefaultLeftIcon = (name: string): void => {
  defaultIcon = name
};
