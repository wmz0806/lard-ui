export interface Config {
  /**
   * 内容
   */
  content: React.ReactNode | string
  /**
   * 选中状态
   * @default false
   */
  isChoose?: boolean
  /**
   * 是否禁用
   * @default false
   */
  isDisabled?: boolean
  /**
   * 某一个按钮单独的点击事件
   */
  onClick?: (e: any, select: boolean[], item: Config) => void

  /**
   * 额外的样式
   */
  className?: string
  style?: object
}

export interface Props {
  /**
   * 是不是要固定几列排列, 如果不传, 将以文字宽度确定按钮宽度
   */
  col?: number
  /**
   * 单选还是多选
   * @default single
   */
  type?: 'single' | 'multiple'
  /**
   * canCancel 单选的时候, 是否可以再次点击 取消
   * @default false
   */
  canCancel?: boolean
  /**
   * 多选的时候, 是否需要全选的按钮 (设定为 falsy 则认为不需要)
   * @default 全部
   */
  allSelect?: boolean | string
  /**
   * 选项数据集
   */
  data: Config[]

  /**
   * 总的选择事件
   */
  onClick: (e: any, index: number, select: boolean[], item: Config) => void

  /**
   * 额外的样式
   */
  className?: string
  style?: object
}

export interface State {
  data: Config[]
  isAllChoose: boolean
}
