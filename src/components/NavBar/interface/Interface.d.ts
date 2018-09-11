export interface Config {
  /**
   * 按钮内容
   */
  content: string | React.ReactNode,
  /**
   * 是否激活他
   * @default false
   */
  active?: boolean
  /**
   * 某一个item的点击事件
   */
  onClick?: (e: any, index: number) => void
}

export interface Props {
  /**
   * 列表数据, 详见 Interface Config
   */
  list: Config[]
  /**
   * 自动将第一个定义为active
   * @default true
   */
  noNeedAutoActive: boolean
  /**
   * 默认颜色
   * @default #666
   */
  defaultColor: string
  /**
   * 激活时颜色
   * @default #3B4FA0
   */
  activeColor: string
  /**
   * 点击事件回调
   */
  onClick?: (e: any, index: number, item: Config) => void
  /**
   * 如果内容过多, 可以开启该模式, 触摸左右滑动
   * @default false
   */
  isSlide?: boolean
  /**
   * 是否需要自动滑动到定义的active的位置?
   * @default false
   */
  isAutoSlide?: boolean

  /**
   * 样式
   */
  className?: string
  style?: object
}

export interface State {
  list: Config[]
}
