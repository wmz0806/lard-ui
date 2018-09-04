export interface Config {
  /**
   * 是否激活这个按钮? 默认会激活第一个
   * @default false
   */
  active?: boolean
  /**
   * 如果使用 icon 传进来
   */
  icon?: string
  /**
   * 如果使用图片, 默认未激活的图片
   */
  defaultImg?: string
  /**
   * 如果使用图片, 激活时的图片
   */
  activeImg?: string
  /**
   * 如果激活的时候显示大图 (隐藏文字)
   * @default false
   */
  isBigActiveImg?: boolean
  /**
   * 下方文字
   */
  text?: string | React.ReactNode
  /**
   * 点击事件
   */
  onClick?: (e:any, index: number, item: Config) => void
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 自定义样式
   */
  style?: object
}

export interface Props {
  /**
   * 列表数据
   */
  list: Config[]
  /**
   * 一开始不需要组件自动激活第一个的话 设置他
   * @default false
   */
  noNeedAutoActive?: boolean
  /**
   * 未激活的文字颜色 (如果图标使用的icon, 会同时设置文字和icon)
   * @default #999
   */
  defaultColor?: string
  /**
   * 激活的文字颜色 (如果图标使用的icon, 会同时设置文字和icon)
   * @default #3C4EA0
   */
  activeColor?: string
  /**
   * 自定义类名
   */
  className?: string
  /**
   * 自定义样式
   */
  style?: object
}

export interface State {
  list: Config[]
}
