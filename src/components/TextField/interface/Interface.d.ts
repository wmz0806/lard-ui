export interface Props {
  /**
   * placeholder
   * @default ''
   */
  placeholder?: string
  /**
   * 组件一开始的默认值 (如果同时有placeholder和默认值, 会显示默认值, 同时在用户聚焦该组件的时候, 显示默认value)
   * @default ''
   */
  initValue?: string
  /**
   * 组件的input 的type
   * @default text
   */
  type?: 'text' | 'number' | 'password'
  /**
   * 最多输入的字数, 对应的 input 为 max-length 对应 textarea 则右下方会显示
   */
  maxLength?: number
  /**
   * 是否禁用该组件
   * @default false
   */
  isDisabled?: boolean
  /**
   * 是否需要清空的图标
   * @default false
   */
  needClearIcon?: boolean
  /**
   * 是否需要隐藏密码的图标? 激活的时候会将input type=password
   * @default false
   */
  needEncrypt?: boolean
  /**
   * 验证表单的正则, 失焦验证和主动验证均会调用这个正则来验证
   */
  validateReg?: string | RegExp
  /**
   * 验证函数: 如果在验证条件过于复杂, 正则不好实现的时候, 用这个
   */
  validateFunc?: (value: string) => boolean
  /**
   * 在失焦时自动验证正则或者方法
   * @default false
   */
  isBlurValidate?: boolean
  /**
   * 验证失败的时候的提示方法, 有下方提示失败和摆动两种方式
   * @default tips
   */
  validateType?: 'msg' | 'shake'
  /**
   * validateType 为 msg 时, 显示的文字
   * @default '信息有误, 请重新输入'
   */
  validateMsg?: string
  /**
   * 验证失败时, 组件的提示颜色
   * @default #E4393C
   */
  validateColor?: string
  /**
   * textArea 时, 是否需要下方的字数显示和验证提示(这两个是一起出现的)
   * @default true
   */
  needTextAreaFooter?: boolean
  /**
   * onChange 事件的延迟触发时间, 默认为0
   */
  onChangeDelay?: number
  /**
   * 以下皆为事件
   */
  onBlur?: (e: any, val: string) => void
  onFocus?: (e: any, val: string) => void
  onClick?: (e: any, val: string) => void
  onChange?: (e: any, val: string) => void
  onClear?: () => void

  className?: string
  style?: object

  /**
   * 如果是 text area 设置高度 (也可以间接的在className里面设置)
   */
  height?: string
  /**
   * 如果是 text area, 超出最大长度的时候提示信息(必须设置最大长度, 可以设置为falsy值来取消他)
   * @default 不能再输入了
   */
  overLengthMsg?: string

  /*
   * 组件内部逻辑, 无需关注
   * */
  xmlTag?: string
}

export interface State {
  value: string
  isActive: boolean
  isErr: boolean
  isShowEncrypt: boolean
  isShake: boolean
  isDisabled: boolean
}
