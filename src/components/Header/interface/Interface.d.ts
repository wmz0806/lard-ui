export interface Btn {
  /**
   * 按钮内容
   * @default ''
   */
  content?: string | React.ReactNode
  /**
   * 按钮icon (左侧icon按钮的统一名称可以通过 setDefaultLeftIcon 来进行全局设置)
   * @default 'fanhui'
   */
  icon?: string
  /**
   * 按钮图片 (注意: content, icon, img 三选一)
   */
  img?: string
  /**
   * 点击事件
   */
  onClick?: (e: any) => void
  /**
   * 额外的类名
   */
  className?: string
  /**
   * 额外的 style
   */
  style?: object
}

export interface Simple {
  /**
   * 左侧按钮参数 如果为空则不显示 参见 interface Btn
   */
  leftBtnConfig?: Btn
  /**
   * 标题参数 (标题按钮不可以使用icon) 参见 interface Btn
   */
  titleConfig?: Btn
  /**
   * 右侧按钮数组 如果为空则不显示 参见 interface Btn
   */
  rightBtnConfig?: Btn[]
  /**
   * 如果没有标题参数 或者 参数 content 为空, 则使用 children 作为标题
   */
  children?: React.ReactNode
  /**
   * header额外的style
   */
  style?: object
  /**
   * header 额外的 className
   */
  className?: string
}

export interface SearchConfig {
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 点击搜索框, 默认的值 (只有在搜索框当前没有值的时候才会进行设置)
   */
  searchValue?: string
  /**
   * 直接显示的默认值
   */
  value?: string
  /**
   * 最大长度
   */
  maxLength?: number
  /**
   * 以下7个均为事件, 第一个参数为 event, 第二个是当前的值
   */
  onClick?: (e: any, val: string) => void
  onFocus?: (e: any, val: string) => void
  onBlur?: (e: any, val: string) => void
  /**
   * 该事件在首次点击设置默认值, 还有点击x清空值的时候, event 为null
   */
  onChange?: (e: any, val: string) => void
  onCancel?: (e: any, val: string) => void
  onSearch?: (e: any, val: string) => void
  onKeyDown?: (e: any, val: string) => void
  /**
   * onChange事件的触发间隔 (比如定义500, 则需要用户输入停下500ms之后才会触发onChange事件)
   */
  onChangeDelay?: number
}

export interface SearchProps {
  /**
   * 左侧按钮参数 如果为空则不显示 参见 interface Btn
   */
  leftBtnConfig?: Btn

  /**
   * 右侧按钮参数 如果为空则不显示 (如果是数组, 就显示多个按钮) 参见 interface Btn
   */
  rightBtnConfig?: Btn | Btn[]

  /**
   * 搜索框参数 参见interface SearchConfig
   */
  searchConfig: SearchConfig
}

export interface SearchState {
  isActive: boolean
  curValue: string
}
