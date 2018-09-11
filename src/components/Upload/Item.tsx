import * as React from 'react';
import cn from 'classnames';
import Icon from '../Icon';
import config from '../../config';
import * as styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

const Item = (opt: any) => {
  const {src, className, showClose = true, close} = opt;
  if (!src) return null;
  return (<div className={cx(`${pre}upload-result-container`, className)}>
    <div className={cx(`${pre}item-image`)} style={{backgroundImage: `url(${src})`}}/>
    {
      showClose && <div
        className={cx(`${pre}item-close`, 'f-db')}
        onClick={() => {
          close && close();
        }}
      >
        <Icon name={'qingkongwenben'} size={0.3} color={'#fff'}/>
      </div>
    }
  </div>);
};

export default Item;

