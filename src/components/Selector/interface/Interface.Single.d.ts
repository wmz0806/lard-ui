export interface ISelectCommon {
  setChoose: (isChoose: boolean) => void
  getChoose: () => boolean
}

export interface IRadio extends ISelectCommon{
  _radioClick: (e: any) => void
}

export interface ICheckbox extends ISelectCommon {
  getStatus: () => {isErr: boolean, isDisabled: boolean, isChoose: boolean}
  getAllSelectStatus: () => 0 | 1 | 2
  setAllSelectStatus: (status: 0 | 1 | 2) => void
  _checkboxClick: (e: any) => void
}

export interface ISelectMap {
  [key: string]: boolean[]
}

export interface IRadioRefMap {
  [key: string]: Array<IRadio | null>
}

export interface ICheckboxRefMap {
  [key: string]: Array<ICheckbox | null>
}

export interface ICheckboxASRefMap {
  [key: string]: ICheckbox | null
}


export interface Props {
  /**
   * 再调用一次 RadioItem() 或者 CheckboxItem() 后, 使用组件时需要传入的唯一标识符, 如果不传入, 则在原有的栈中自增
   * @default length - 1
   */
  index: number
  /**
   * 以下和 basic use 类似
   */

  isChoose?: boolean
  isDisabled?: boolean
  isErr?: boolean

  /**
   *
   * @param e
   * @param {number} index 点击的第几个(全选会是-1)
   * @param {boolean} choose 选中的状态
   * @param {Props} select 整个选择器的选中状态(只有多选才有)
   */
  onCheck?: (e: any, index: number, choose: boolean, select?: boolean[]) => void

  /**
   * 如果是checkbox 的情况下, 这个按钮是不是全选按钮?
   */
  isAllSelect?: boolean

  className?: string
  style?: object

  /**
   * 组件内部传入, 无需理会
   */
  id: string
  type?: 'radio' | 'checkbox'
}

export interface State {
  isChoose: boolean
  allSelectStatus: 0 | 1 | 2
}
