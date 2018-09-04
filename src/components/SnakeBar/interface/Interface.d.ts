export interface Props {
  /**
   * 文字内容
   */
  content?: string | React.ReactNode
  /**
   * 点击事件
   */
  onClick?: (e: any, item: Props) => void
  /**
   * 下面那个喇叭位置的图片
   * @default 喇叭
   */
  image?: string
  /**
   * 自动关闭时间, 不传则不关
   */
  autoClose?: number
  /**
   * 样式
   */
  className?: string
  style?: object

  /**
   * 以下两个字段内部使用, 不用关注
   */
  uuid?: string
  animateClass?: string
}

export interface State {
  list: Props[]
}

export interface ISnakeBar {
  _add: (props: Props) => () => void
  show: (props: Props) => () => void
  close: (uuid?: string) => void
  clear: () => void
  destroy: (container: ISnakeBar | null, div: Element | null) => void
}
