/* header interface */
export interface HeaderConfig {
  /**
   * item内容
   */
  content: React.ReactNode | string
  /**
   * 该item是否激活
   */
  isActive?: boolean
  /**
   * 点击回调事件
   */
  onClick?: (e: any, isActive: boolean) => void

  /**
   * 额外的样式
   */
  className?: string
  style?: object
}

export interface HeaderProps {
  data: HeaderConfig[]
  onClick?: (e: any, index: number, isActive: boolean) => void

  className?: string
  style?: object
}

export interface HeaderState {
  data: HeaderConfig[]
}

/* body interface */
export interface IBody {
  show: (props: BodyProps) => void
  hide: () => void
}

export interface BodyConfig {
  /**
   * 显示在item上的东西
   */
  label: string | React.ReactNode
  /**
   * 其实没啥用.. 可以传入任意字段, 在click 回调中会返回出去
   */
  value?: string | number
  /**
   * 该item是否激活? 由于是单选树, 所以在传入错误的激活序列的时候, 组件会更正激活状态
   */
  isActive?: boolean
  /**
   * 该子节点下是否还有节点?
   */
  children?: BodyConfig[]
}

interface BodyProps {
  /**
   * 数据集
   */
  data: BodyConfig[]
  /**
   * 一开始是否是显示的
   * @default true
   */
  isShow?: boolean
  /**
   * 是否是异步数据集
   * @default false
   */
  isAsync?: boolean

  /**
   *
   * @param e 事件
   * @param {number} listIndex 点击列的index
   * @param {number} index 点击行的index
   * @param {BodyConfig} item 点击的具体的那一条数据
   * @param {BodyConfig[]} data 点击的时候, 整个数据列表
   * @param {number[]} activeIndex 点击的时候, 数据列表的active状态
   * @param {(data: BodyConfig[]) => void} callback
   * @returns {Promise<BodyConfig[]>}
   */
  onClick?: (
    e: any,
    listIndex: number,
    index: number,
    item: BodyConfig,
    data: BodyConfig[],
    activeIndex: number[],
    callback?: (data: BodyConfig[]) => void
  ) => Promise<BodyConfig[]>

  /**
   * 隐藏回调
   */
  onHide?: () => void
  /**
   * 打开回调
   */
  onShow?: () => void

  /**
   * 内部传入, 无需关注
   */
  top?: string
}


export interface BodyState extends BodyProps{
  activeIndex: number[]
  transformQueue: string[]
  bodyScale: string
}

/* main interface */
export interface MainProps {
  /* header部分的 */
  /**
   * 头部分的数据集, 参见 headerConfig interface
   */
  headerConfig: HeaderConfig[],
  /**
   * 头部点击的回调函数
   */
  headerClick?: (e: any, index: number, isActive: boolean) => void

  /**
   * 额外的样式
   */
  headerClassName?: string
  headerStyle?: object

  /* body 部分的 */
  /**
   * 下拉菜单的数据集, 需要与header的数据一一对应. 参见 BodyConfig interface
   */
  bodyData: BodyConfig[][]

  /**
   * 下拉菜单部分是否需要异步请求
   * @default false
   */
  isAsync?: boolean
  /**
   * 下拉菜单的点击事件. 如果是异步请求的话, 可以调用 callback 动态添加数据或者使用返回Promise来动态的增加数据
   */
  bodyClick?: (
    e: any,
    listIndex: number,
    index: number,
    item: BodyConfig,
    data: BodyConfig[],
    activeIndex: number[],
    callback?: (data: BodyConfig[]) => void,
  ) => Promise<BodyConfig[]>
}
