import * as React from 'react';
import cn from 'classnames';
import {CSSTransition} from 'react-transition-group';
import config from '../../config';
import Icon from '../../components/Icon/index';

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
   * 当前是否显示
   * @default false
   */
  show?: boolean;

  /**
   * 点击事件
   * @default void
   */
  onClick?(e: any): void;
}

export default class GoTop extends React.Component<Props, object> {

  public static defaultProps: Props = {
    className: "",
    style: {},
    show: false,
  };

  public state: any = {
    show: false,
  };

  constructor(props: Props) {
    super(props);

    this.state.show = !!props.show;
  }

  public show(): void {
    if(this.state.show) return;
    this.setState({show: true});
  }

  public hide(): void {
    if(!this.state.show) return;
    this.setState({show: false});
  }

  public render(): React.ReactNode {
    const {className, style, onClick} = this.props;

    return (
      <CSSTransition
        in={this.state.show}
        timeout={{enter: 16, exit: 555}}
        classNames="a"
        unmountOnExit
      >
        <div
          className={cx(`${pre}go-top`, className)}
          style={style}
          onClick={(e) => {
            onClick && onClick(e);
          }}>
          <Icon name={'fanhuidingbu'}/>
        </div>
      </CSSTransition>

    );
  }

}
