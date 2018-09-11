
export interface Config {
  /**
   * 每一个节点所显示的内容 (由于一级显示简介是用的字符串拼接, 所以如果使用JSX的话会出问题, 或许用的时候可以自行关闭简介..)
   */
  label: string

  /**
   * 他的子元素 (只支持 2-3 级树)
   */
  children?: Config[]

  /**
   * 组件内部使用, 无需传递
   */
  hasChildSelect?: boolean
  /**
   * 组件内部使用, 无需传递
   */
  isChoose?: boolean
  /**
   * 组件内部使用, 无需传递
   */
  isActive?: boolean

  /**
   * 组件内部使用, 无需传递
   */
  index: number[]
  /**
   * 组件内部使用, 无需传递
   */
  uuid: string
}


export interface BtnConfig {
  /**
   * 自定义按钮内容
   */
  content?: string | React.ReactNode

  /**
   * 样式
   */
  className?: string
  style?: object
}

export interface ICommon {
  data: Config[]
}

export interface Props {
  /**
   * 组件所依赖的数据
   */
  data: Config[]
  /**
   * 是否是异步树 异步树需要在点击回调返回Promise或者主动调用添加子节点方法
   * @default false
   */
  isAsync?: boolean
  /**
   * 是否一开始是显示的
   * @default false
   */
  isShow?: boolean


  /**
   * 确定按钮内容
   * @default {content: '确定', className: '', style: null}
   */
  resetBtn?: BtnConfig
  /**
   * 重置按钮内容
   * @default {content: '重置', className: '', style: null}
   */
  sureBtn?: BtnConfig


  /**
   * 点击确定按钮的事件
   */
  onSure?: (choseData: Config[]) => void
  /**
   * 点击重置按钮事件
   */
  onReset?: (data: Config[]) => void
  /**
   * 点击item的事件
   * 如果是异步树,可以通过返回Promise 或者调用callback来继续添加元素 (最多支持3级)
   */
  onClick?: (item: Config, callback: ((data: Config[]) => void)) => void | Promise<Config[]>
}

export interface State extends ICommon{
  isShow: boolean
  choseData: Config[]
}
