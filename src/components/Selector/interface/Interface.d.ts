export interface Config {
  /**
   * 是否禁用该 item
   * @default false
   */
  isDisabled?: boolean
  /**
   * 该 item 是否显示错误 (就是设计图上那种红色, 感觉没见过)
   * @default false
   */
  isErr?: boolean
  /**
   * 该 item 是否 choose 状态
   * @default false
   */
  isChoose?: boolean
  /**
   * vertical 情况下, 该item特定的高度
   */
  height?: string
  /**
   * 特定的 item 渲染, 在render函数
   */
  render?: (index: number, item: Config) => React.ReactNode

  /**
   * item 的选中事件
   */
  onCheck?: (e: any, select?: boolean[]) => void

  /**
   * 额外的样式
   */
  className?: string
  style?: object
}

export interface Props {
  /**
   * 单选还是多选?
   * @default radio
   */
  type: 'radio' | 'checkbox'
  /**
   * 排列方式
   * @default vertical
   */
  direction: 'horizontal' | 'vertical'
  /**
   * 如果是竖向的话, 高度是多少? (不设定高度的话, 会按照 context 来设置高度. 如果是文字: 默认高度 0.88 rem)
   */
  itemHeight: string
  /**
   * 在多选的情况下, 是否有全选按钮. 如果是true, 文字为全选, 如果是string 则文字是string
   * @default false
   */
  hasAllSelect?: boolean | string
  /**
   * 总的render Item, 如果返回的是string类型, 高度会设定为 0.88rem
   */
  renderItem?: (index: number, item: Config) => React.ReactNode
  /**
   * 总的选择事件
   */
  onCheck?: (e: any, index: number, item?: Config, select?: boolean[]) => void
  /**
   * 选项参数 参见 interface Config
   */
  data: Config[]

  /**
   * 额外的样式
   */
  className?: string
  style?: object
}

export interface State {
  allSelectStatus: 0 | 1 | 2
  data: Config[]
}
