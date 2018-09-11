import * as React from 'react';
import * as ReactDOM from 'react-dom';
import cn from 'classnames';
import Item from './Item';
import config from '../../config';
import * as styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
  /**
   * 子元素
   * @default null
   */
  children: null | React.ReactNode;
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
   * 显示方向
   * @default top
   */
  direction: 'top' | 'bottom';

  /**
   * X轴的偏移
   * @default 0
   */
  offsetX: number;
  /**
   * Y轴的偏移
   * @default 0
   */
  offsetY: number;
}

interface State {
  [key: string]: any
}

export default class Toolbar extends React.Component<Props, State> {

  public static defaultProps: Props = {
    children: null,
    className: "",
    style: {},
    direction: 'bottom',
    offsetY: 0,
    offsetX: 0,
  };

  public static Item = Item;

  public state: State = {
    direction: this.props.direction,
    show: false,
    x: 0,
    y: 0,
    ix: 0
  };

  public triangle: any = null;
  public box: any = null;

  constructor(props: Props) {
    super(props);
  }

  public componentDidMount(): void {
    // empty
  }

  public show(target: any, direction: string = this.props.direction, ox?: number, oy?: number): void {

    ox = ox || this.props.offsetX;
    oy = oy || this.props.offsetY;

    const dir = direction ? direction : this.state.direction;
    const bodyReact = document.body.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const triangleReact = this.triangle.getBoundingClientRect();
    const boxReact = this.box.getBoundingClientRect();

    const fx = targetRect.width / 2;
    const fy = targetRect.height;

    const offset = Math.sqrt(Math.pow(triangleReact.width, 2) + Math.pow(triangleReact.height, 2)) / 2;

    let y = targetRect.top + oy + fy;

    if (direction === 'top') {
      y = targetRect.top - boxReact.height + oy;
    }
    this.setState({
      show: true,
      x: targetRect.left + ox,
      y,
      direction: dir,
      ix: fx - offset + ox
    }, () => {
      const reactWidth = boxReact.width + boxReact.left;
      let c = 0;
      if (reactWidth > bodyReact.width) {
        c = reactWidth - bodyReact.width;
      }
      c !== 0 && this.setState({x: this.state.x - c, ix: this.state.ix + c})
    })
  }

  public hide(): void {
    this.setState({
      show: false,
      x: 0, y: 0, ix: 0
    })
  }

  public render(): React.ReactNode {

    const {className, style, children} = this.props;
    const {show, x, y, ix, direction} = this.state;

    const transform = `translate3d(${x}px, ${y}px, 0)`;

    return ReactDOM.createPortal(
      <div className={cx(`${pre}toolbar-container`, className, {active: show, top: direction === 'top'})}
           style={style}
           onClick={() => {
             this.hide()
           }}
      >
        <div className={cx(`${pre}toolbar-main`)} style={{transform, WebkitTransform: transform}}
             ref={(e) => (this.box = e)}>
          <div className={cx(`${pre}toolbar-box`)}>
            <i className={cx(`${pre}toolbar-triangle`)} style={{left: `${ix}px`}} ref={(e) => (this.triangle = e)}/>
            {children}
          </div>
        </div>
      </div>, document.body
    );
  }

};
