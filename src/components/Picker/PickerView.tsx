import *  as  React from 'react';
import cn from 'classnames';
import config from '../../config';
import PickerColumn from './PickerColumn';
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

  col: number;
  data: any;
  cascade: boolean;
  controlled?: boolean;
  value: string[];
  onChange(v: string[]): void;
}

interface State {
  defaultSelectedValue: string[]
}


// 选择器组件
class PickerView extends React.Component<Props, State> {

  public static defaultProps: Props = {
    children: null,
    className: "",
    style: {},
    data: [],
    value: [],
    cascade: true,
    col: 0,
    controlled: false,
    onChange: () => {
      //empty
    },
  };

  public state: State = {
    defaultSelectedValue: [], // 默认选择的值
  };

  constructor(props: Props) {
    super(props);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  public componentDidMount(): void {
    // picker view 当做一个非受控组件
    const {value, controlled} = this.props;
    if (!controlled) this.setState({defaultSelectedValue: value});
  }

  public handleValueChange(newValue: any, index: number): void {
    // 子组件column发生变化的回调函数
    // 每次值发生变化 都要判断整个值数组的新值
    const {defaultSelectedValue} = this.state;
    const {data, cascade, controlled, value, onChange} = this.props;

    if (controlled) {
      // 也要算一下正确的值
      const oldValue = value.slice();
      oldValue[index] = newValue;

      if (cascade) {
        onChange(this.getNewValue(data, oldValue, [], 0));
      } else {
        onChange(oldValue);
      }

      return;
    }

    const oldValue = defaultSelectedValue.slice();
    oldValue[index] = newValue;

    if (cascade) {
      // 如果级联的情况下
      const newState = this.getNewValue(data, oldValue, [], 0);

      this.setState({defaultSelectedValue: newState});

      onChange(newState);
    } else {
      // 不级联 单纯改对应数据
      if (!controlled) {
        this.setState({defaultSelectedValue: oldValue});
      }
      onChange(oldValue);
    }
  }

  public getColumns(): any {
    const {col, data, cascade, value, controlled} = this.props;
    const {defaultSelectedValue} = this.state;
    const result = [];

    if (controlled) {
      if (value.length === 0) return;
    } else if (defaultSelectedValue.length === 0) return;

    let array;

    if (cascade) {
      array = controlled ?
        this.getColumnsData(data, value, [], 0) :
        this.getColumnsData(data, defaultSelectedValue, [], 0);
    } else {
      array = data;
    }

    for (let i = 0; i < col; i++) {
      result.push(
        <PickerColumn
          key={i}
          index={i}
          value={controlled ? value[i] : defaultSelectedValue[i]}
          data={array[i]}
          onValueChange={this.handleValueChange}
        />
      );
    }

    return result;
  }

  // 递归寻找value
  public getNewValue(tree: any, oldValue: string[], newValue: string[], deep: number): string[] {
    // 遍历tree
    let has;

    tree.map((item: any, i: number) => {
      if (item.value === oldValue[deep]) {
        newValue.push(item.value);
        has = i;
      }
    });

    if (has === undefined) {
      has = 0;
      newValue.push(tree[has].value);
    }

    if (tree[has].children) this.getNewValue(tree[has].children, oldValue, newValue, deep + 1);

    return newValue;
  }

// 根据value找索引
  public getColumnsData(tree: any, value: string[], hasFind: any[], deep: number): any[] {
    // 遍历tree
    let has;
    const array: any[] = [];

    tree.map((item: any, i: number) => {
      array.push({label: item.label, value: item.value});
      if (item.value === value[deep]) has = i;
    });

    // 判断有没有找到
    // 没找到return
    // 找到了 没有下一集 也return
    // 有下一级 则递归
    if (has === undefined) return hasFind;

    hasFind.push(array);

    if (tree[has].children) this.getColumnsData(tree[has].children, value, hasFind, deep + 1);

    return hasFind;
  }

  public render(): React.ReactNode {
    const columns = this.getColumns();

    return (
      <div className={cx(`${pre}view`)}>
        <div className={cx(`${pre}view-shade-top`)}/>
        <div className={cx(`${pre}view-shade-bottom`)}/>
        {columns}
      </div>
    );
  }
}


// PickerView.defaultProps = {
//   prefixCls: 'gsg-picker-view',
//   col: 1,
//   cascade: true,
//   controlled: false,
// };

export default PickerView;
