import * as React from 'react';
import cn from 'classnames';
import Icon from '../Icon';
import config from '../../config';
import * as styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
  /**
   * 额外的 class 类名
   * @default ""
   */
  className?: string;
  /**
   * 额外的 style
   * @default {}
   */
  style?: object;

  /**
   * 聚合的按钮集合 [ { children: 元素, onClick: 点击元素触发的方法 } ]
   * @default {}
   */
  menus: any[];
}

interface State {
  [key: string]: any
}

export default class Aggregation extends React.Component<Props, State> {

  public static defaultProps: Props = {
    className: "",
    style: {},
    menus: [],
  };

  public state: State = {
    active: false
  };

  constructor(props: Props) {
    super(props);

  }


  public componentDidMount(): void {
    // empty
  }

  public componentWillUnmount(): void {
    // empty
  }


  public toggleActive(active?:boolean): void {
    this.setState({active: active === undefined ? !this.state.active: active});
  }


  public render(): React.ReactNode {

    const {className, style, menus} = this.props;

    return (
      <div className={cx(`${pre}agg-container`, className, {active: this.state.active})}
           style={style}
      >
        <div className={cx(`${pre}agg-box`)}>
          <button className={cx(`${pre}agg-play`)} onClick={() => this.toggleActive()}><Icon name={'jia'}/></button>
          <div className={cx(`${pre}agg-menus`)}>
            {
              menus.map((item: any, i: number) => {
                return <button
                  key={`agg-item-${i}`}
                  className={cx(`${pre}agg-button`)}
                  onClick={(e) => {
                    this.toggleActive(false);
                    item.onClick && item.onClick(e);
                  }}>
                  {item.children}
                </button>
              })
            }
          </div>
        </div>
      </div>
    );
  }

}
