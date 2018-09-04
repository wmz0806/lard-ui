export interface Header {
  /**
   * 是不是不需要头像
   * @default false
   */
  isNoAvatar?: boolean
  /**
   * 头像图片 和icon二选一(如果都不选, 默认是鸟)
   */
  image?: string
  /**
   * 头像icon 和图片二选一(如果都不选, 默认是鸟)
   * @default 麦卡鸟
   */
  icon?: string
  /**
   * 头像右侧区域, 需要自己插入内容
   */
  detail?: string | React.ReactNode

  className?: string
  style?: object
}

export interface Item {
  /**
   * 如果左边是图标
   */
  icon?: string
  /**
   * 如果左边是图片
   */
  image?: string
  /**
   * item 内容
   */
  content?: string | React.ReactNode
  /**
   * 是否是激活状态?
   */
  active?: boolean

  /**
   * item 的点击事件回调
   */
  onClick?: (e: any, index: number, subIndex: number, item: Item) => void

  className?: string
  style?: object
}

export interface IDrawerMenu {
  _show: (props: Props, initShow?: boolean) => void
  _hide: () => void
}

export interface Props {
  /**
   * 是否是唤出的状态?
   * @default false
   */
  isShow?: boolean
  /**
   * header 参数聚集 参见 interface headerConfig (如果没有该参数, 则是为没有头部的类型)
   */
  headerConfig?: Header
  /**
   * 列表集合参数. 二维数组. 参数详见 Item
   */
  lists?: Item[][]
  /**
   * 窗口关闭回调
   */
  onHide?: () => void
  /**
   * 点击列表事件 总回调
   */
  onClick?: (e: any, index: number, subIndex: number, item: Item) => void
  /**
   * 点击Item是否自动关闭窗口
   * @default true
   */
  isAutoHidden?: boolean
}

export interface State {
  isShow: boolean
  headerConfig?: Header
  lists?: Item[][]
  onHide?: () => void
  onClick?: (e: any, index: number, subIndex: number, item: Item) => void
  isAutoHidden?: boolean
}
