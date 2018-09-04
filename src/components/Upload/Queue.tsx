import * as React from 'react';
import cn from 'classnames';
import Upload from './Upload';
import Item from './Item';
import config from '../../config';
import styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
  /**
   * 额外的 class 类名 （指定的是 target 的类名）
   * @default ""
   */
  className?: string;

  /**
   * 最多上传多少张图，0表示不限制
   * @default 0
   */
  max: number;

  /**
   * 当前图片数组
   * @default []
   */
  images: any[];

  /**
   * 在图片数组中去图片src的键， 如果为""则去当前本身
   * @default ""
   */
  srcKey: string;

  /**
   * 删除图片时的触发回调
   * @default void
   */
  delCallback(index: number, item: any): void;

  /**
   * Upload 组件的单独配置
   * @default {}
   */
  uploadProps: any;
}

const Queue = (props: Props) => {
  const {className, max = 0, images = [], srcKey = '', delCallback, uploadProps = {}} = props;
  return (<div className={cx(`${pre}upload-queue`, 'f-cb', className)}>
    {
      images.map((item: any, i: number) => {
        return (
          <Item
            key={`upload-item-${i}`}
            src={srcKey ? item[srcKey] : item}
            close={() => {
              delCallback && delCallback(i, item);
            }}
          />
        );
      })
    }
    {
      max === 0 || images.length < max ?
        <Upload autoShow={false} autoCloseLoading={false} {...uploadProps}/> : null
    }
  </div>);
};

export default Queue;

