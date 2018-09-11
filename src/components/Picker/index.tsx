import * as React from 'react';
import cn from 'classnames';
import config from '../../config';
import PickerView from './PickerView';
import * as styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
  /**
   * 子元素
   * @default null
   */
  children?: null | React.ReactNode;
  /**
   * 额外的 class 类名 （指定的是 target 的类名）
   * @default ""
   */
  className?: string;
  /**
   * 额外的 style （指定的是 target 的style）
   * @default {}
   */
  style?: object;

  /**
   *  默认选中的值
   * @default undefined
   */
  value?: string[];

  /**
   *  数据有多少列
   * @default undefined
   */
  col?: number,
  /**
   *  数据，如果type = 'date' 则数据自动生成
   * @default undefined
   */
  data?: any;

  /**
   * Picker类型， basic（基本）, cascade（级联）, date（时间）
   * @default basic
   */
  type?: 'basic' | 'cascade' | 'date';

  /**
   * date 类型最小支持年月日（Date 对象）
   * @default undefined
   */
  min?: any,
  /**
   * date 类型最大支持年月日（Date 对象）
   * @default undefined
   */
  max?: any,
  /**
   *  标题
   * @default ""
   */
  title?: string;
  /**
   *  取消按钮文本
   * @default "取消"
   */
  cancelText?: string,
  /**
   *  确定按钮文本
   * @default "确定"
   */
  confirmText?: string,

  /**
   *  点击确定按钮的回调
   * @default void
   */
  onChange?(v: string[]): void,

  /**
   *  点击取消按钮的回调
   * @default void
   */
  onCancel?(): void,

  /**
   *  滑动Picker停止后的回调
   * @default void
   */
  onPickerChange?(v: string[]): void,
}

interface State {
  defaultValue: string[], // 默认value
  selectedValue: string[], // 当前选中value
  animation: string,
  show: boolean,
  title: string,
  col: number,
  data: any[],
}

interface Options {
  [key: string]: any
}

// 选择器组件
class Picker extends React.Component<Props, State> {

  public static defaultProps: Props = {
    children: null,
    className: "",
    style: {},
    title: "",
    type: 'basic',
    cancelText: '取消',
    confirmText: '确定',

    onChange: () => {
      //empty
    },
    onCancel: () => {
      //empty
    },

    onPickerChange: () => {
      //empty
    }
  };

  public state: State = {
    defaultValue: [],
    selectedValue: [],
    animation: 'out',
    show: false,
    title: "",
    col: 0,
    data: []
  };

  constructor(props: Props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handlePickerViewChange = this.handlePickerViewChange.bind(this);

    const {title} = props;
    this.state.title = title;
  }

  public componentDidMount(): void {
    const {col, data, value} = this.props;
    this.getInitialize({col, data, value});
    window.addEventListener('resize', this.resize, false);
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.resize, false);
  }

  public getInitialize(options: Options): void {
    const {type} = this.props;
    const {col, value} = options;
    let {data} = options;
    if (type !== 'date' && (!data || !data.length)) {
      console.log("data is not array");
      return;
    }

    let nCol = col;
    if (nCol === undefined) {
      //没有col 自动计算
      if (type === 'basic') nCol = data.length;
      else if (type === 'cascade') {
        const recursion = (o: any, index: number = 0): number => {
          if (o.children) return recursion(o.children[0], ++index);
          else return index;
        };
        nCol = recursion(data[0], 1);
      } else if (type === 'date') {
        nCol = 3;
      }
    }

    if (type === 'date' && nCol > 3) nCol = 3;

    let nValue = value;
    if (nValue === undefined || !nValue.join()) {
      //没有默认值
      nValue = [];
      if (type === 'basic') {
        data.forEach((item: any) => {
          nValue.push(item.length ? item[0].value : '');
        });
      } else if (type === 'cascade') {
        const recursion = (o: any, array: any[] = []): void => {
          array.push(o.value);
          if (o.children) recursion(o.children[0], array);
        };
        recursion(data[0], nValue);
      } else if (type === 'date') nValue = ['1991', '8', '6'];
    }

    if (type === 'date') {
      data = this.getDateData(nCol, nValue);
    }

    this.setState({
      col: nCol,
      defaultValue: nValue,
      selectedValue: nValue,
      data,
    });

  }

  public getDateData(nCol: number, selectedValue: any[]): any[] {

    const year = parseInt(selectedValue[0], 10);
    const month = parseInt(selectedValue[1] || 1, 10);
    const day = new Date(year, month, 0).getDate();
    let {max} = this.props;
    const {min} = this.props;

    if (min && max && min > max) {
      max = min;
    }

    let minYear = 1899;
    let maxYear = 9999;
    let minMonth = 1;
    let maxMonth = 12;
    let minDay = 1;
    let maxDay = 31;


    if (min) {
      minYear = min.getFullYear();
      minMonth = min.getMonth() + 1;
      minDay = min.getDate();
    }
    if (max) {
      maxYear = max.getFullYear();
      maxMonth = max.getMonth() + 1;
      maxDay = max.getDate();
    }


    let startYear = year - 20;


    if (startYear < minYear) {
      startYear = minYear;
    }

    if (selectedValue[0] < minYear) {
      selectedValue[0] = `${minYear}`;
    } else if (selectedValue[0] > maxYear) {
      selectedValue[0] = `${maxYear}`;
    }

    const arr = [];
    const yearArr = [];
    const monthArr = [];
    const dayArr = [];

    for (let i = 0; i < 41; i++) {
      if (startYear <= maxYear) {
        yearArr.push({value: `${startYear}`, label: `${startYear}`});
      }
      startYear++;
    }
    arr[0] = yearArr;

    if (nCol >= 2) {
      const isMinCheck = (selectedValue[0] == minYear);
      const isMaxCheck = (selectedValue[0] == maxYear);

      if (isMinCheck) {
        if (selectedValue[1] < minMonth) selectedValue[1] = `${minMonth}`;
      } else if (isMaxCheck) {
        if (selectedValue[1] > maxMonth) selectedValue[1] = `${maxMonth}`;
      }

      for (let i = 1; i <= 12; i++) {
        if (isMinCheck && isMaxCheck) {
          if (i >= minMonth && i <= maxMonth) monthArr.push({value: `${i}`, label: `${i}月`});
        } else if (isMinCheck) {
          if (i >= minMonth) monthArr.push({value: `${i}`, label: `${i}月`});
        } else if (isMaxCheck) {
          if (i <= maxMonth) monthArr.push({value: `${i}`, label: `${i}月`});
        } else {
          monthArr.push({value: `${i}`, label: `${i}月`});
        }
      }
      arr[1] = monthArr;
    }


    if (nCol >= 3) {
      const isMinCheck = (selectedValue[0] == minYear && selectedValue[1] == minMonth);
      const isMaxCheck = (selectedValue[0] == maxYear && selectedValue[1] == maxMonth);
      if (isMinCheck) {
        if (selectedValue[2] < minDay) selectedValue[2] = `${minDay}`;
      } else if (isMaxCheck) {
        if (selectedValue[2] > maxDay) selectedValue[2] = `${maxDay}`;
      }
      for (let i = 1; i <= day; i++) {
        if (isMinCheck && isMaxCheck) {
          if (i >= minDay && i <= maxDay) dayArr.push({value: `${i}`, label: `${i}日`});
        } else if (isMinCheck) {
          if (i >= minDay) dayArr.push({value: `${i}`, label: `${i}日`});
        } else if (isMaxCheck) {
          if (i <= maxDay) dayArr.push({value: `${i}`, label: `${i}日`});
        } else {
          dayArr.push({value: `${i}`, label: `${i}日`});
        }
      }
      arr[2] = dayArr;
    }

    return arr;
  }

  public resize = (e: Event) => {
    this.handleClickClose(e);
  };

  public handleClickOpen(e?: any): void {
    if (e) e.preventDefault();

    this.setState({show: true});

    // const t = this;
    // css动画
    const timer = setTimeout(() => {
      this.setState({
        animation: 'in',
      });
      clearTimeout(timer);
    }, 0);
  }

  public show(): void {
    this.handleClickOpen();
  }

  public handleClickClose(e?: Event): void {
    if (e) e.preventDefault();

    this.setState({animation: 'out'});

    // css动画
    const timer = setTimeout(() => {
      this.setState({
        show: false,
      });
      clearTimeout(timer);
    }, 300);
  }

  public handlePickerViewChange(newValue: string[]): void {
    const {onPickerChange, type} = this.props;

    if (type === 'date') {
      const data = this.getDateData(this.state.col, newValue);
      this.setState({selectedValue: newValue, data});
    } else {
      this.setState({selectedValue: newValue});
    }

    onPickerChange && onPickerChange(newValue);

  }

  public handleCancel(): void {
    const {defaultValue} = this.state;
    const {onCancel} = this.props;

    this.handleClickClose();

    this.setState({selectedValue: defaultValue});

    onCancel && onCancel();
  }

  public handleConfirm(): void {
    // 点击确认之后的回调
    const {selectedValue} = this.state;
    const {onChange} = this.props;

    this.handleClickClose();

    if (selectedValue) {
      this.setState({defaultValue: selectedValue});
      onChange && onChange(selectedValue);
    }
  }

  public getPopupDOM(): React.ReactNode | null {
    const {show, animation, title} = this.state;
    const {cancelText, confirmText} = this.props;
    const pickerViewDOM = this.getPickerView();

    if (show) {
      return (
        <div className={cx(`${pre}picker-content`)}>
          <div className={cx([`${pre}picker-mask`, {hide: animation === 'out'}])}
               onClick={this.handleCancel}/>
          <div className={cx([`${pre}picker-wrap`, {show: animation === 'in'}])}>
            <div className={cx(`${pre}picker-header f-toe`)}>
              <span className={cx(`${pre}picker-item ${pre}header-left`)}
                    onClick={this.handleCancel}>{cancelText}</span>
              <span className={cx(`${pre}picker-item ${pre}header-title`)}>{title}</span>
              <span className={cx(`${pre}picker-item ${pre}header-right`)}
                    onClick={this.handleConfirm}>{confirmText}</span>
            </div>
            <div className={cx(`${pre}picker-body`)}>
              {pickerViewDOM}
            </div>
          </div>
        </div>
      );
    } else return null;
  }

  public getPickerView(): React.ReactNode | null {
    const {type} = this.props;
    const {selectedValue, col, data} = this.state;

    if (this.state.show) {

      return (
        <PickerView
          col={col}
          data={data}
          value={selectedValue}
          cascade={type === 'cascade'}
          controlled={false}
          onChange={this.handlePickerViewChange}
        />
      );
    } else return null;
  }

  public render(): React.ReactNode {
    const popupDOM = this.getPopupDOM();

    return (
      <div className={cx(`${pre}picker-main`, this.props.className)}>
        {popupDOM}
        {
          this.props.children && <div onClick={this.handleClickOpen}>
            {this.props.children}
          </div>
        }
      </div>
    );
  }
}


export default Picker;
