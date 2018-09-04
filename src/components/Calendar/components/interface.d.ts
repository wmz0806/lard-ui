export interface IDefault {
  /**
   * 起始时间, 可以传入 Date 类型 或者 用 [- / .] 分割的字符串, 如: 2017.1.1
   * @default new Date()
   */
  beginDate?: Date | string
  /**
   * 类型同 beginDate
   * @default new Date()
   */
  endDate?: Date | string
  /**
   * 类型同 beginDate 不过是数组 (可以用比如 ['2018-3-3' | Date] 的格式, )
   * @default []
   */
  chooseDate?: Date[] | null
  /**
   * 类型同 beginDate 不过是数组 (可以用比如 ['2018-3-3' | Date] 的格式, )
   * @default []
   */
  disabledDate?: Date[] | null
}

export interface ISimpleDate {
  year: number
  month: number
  date: number
}

interface IDateDetails {
  date: number
}

interface IPrev extends IDateDetails {
  isPrev?: boolean
}
interface INext extends IDateDetails {
  isNext?: boolean
}
interface ICurrent extends IDateDetails {
  year?: number
  month?: number
  day?: number
  isDisabled?: boolean
  isChoose?: boolean
  isToday?: boolean
}

export interface IData {
  prev: IPrev[][]
  current:  ICurrent[][]
  next:  INext[][]
}

export interface Props extends IDefault {
  /**
   * 是否需要用户多选?
   * @default false
   */
  isMultiple?: boolean
  /**
   * 选择日期回调, 返回值为普通 object 类型
   */
  onChoose?: (date: ICurrent) => ICurrent
}

export interface State extends IDefault {
  choose?: null
  disabledLeft: boolean
  disabledRight: boolean

  dateCollection: IData
}

export interface Flag {
  startX: number
  startY: number
}
