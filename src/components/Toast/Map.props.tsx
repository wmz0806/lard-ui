import * as React from 'react';

export interface Props {
  /**
   * 提示的内容（如果调用的是 loading  默认值为 加载中...， 除了loading值为空的话不显示toast）
   * @default ""
   */
  content?: string;
  /**
   * 自动关闭时间 （ 单位毫秒， 如果调用的是 loading 自动关闭时间默认为 10 * 1000）
   * @default 3000
   */
  time?: number;

  /**
   * 聚合参数
   * @default {}
   */
  options?: object;
  /**
   * options.shade 是否显示背景层 默认不显示（loading 中默认显示）
   * @default false
   */
  shade?: boolean;
  /**
   * options.shadeType 背景层颜色类型 black | white | transparent
   * @default "transparent"
   */
  shadeType?: string;
  /**
   * options.css 额外的样式
   * @default ""
   */
  css?: string,
  /**
   * options.tapToClose 是否点击即关闭
   * @default false
   */
  tapToClose?: boolean,
  /**
   * options.onClose 关闭后的回调
   * @default function
   */
  onClose?(): void;
}

class Class extends React.Component<Props, object> {

  public static defaultProps: Props = {
    content: '',
    time: 3000,
    options: {},
  };

}

export default Class;
