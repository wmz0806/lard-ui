import * as React from 'react';
import cn from 'classnames';

import config from '../../config';
import Utils from '../../utils';
import styles from './style.less';

const pre = config.pre;
const cx = cn.bind(styles);

export interface Props {
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
   * 默认图
   * @default ""
   */
  def?: string;

  /**
   * lazy 时的 loading
   * @default null
   */
  defLoading?: React.ReactElement<any> | null;

  /**
   * 显示的图
   * @default ""
   */
  src: string;

  /**
   * 是否开启懒加载
   * @default false
   */
  lazy?: boolean;

  /**
   * 是否开启显示才加载
   * @default false
   */
  displayToLazy?: boolean;

  /**
   * 图片显示方式
   * @default cover
   */
  bgSize?: '' | 'cover' | 'contain';

  /**
   * 宽度
   * @default 0
   */
  width: number;

  /**
   * 高度（不传默认为宽度）
   * @default 0
   */
  height?: number;

  /**
   *  单位
   * @default "rem"
   */
  unit?: string;

  /**
   *  图片遮罩
   * @default false
   */
  imgShade?: boolean;

  /**
   *  单击重载图片
   * @default false
   */
  clickReload?: boolean;
}

interface State {
  src: string;
  done: boolean;
  error: boolean;
  width: number;
  height: number | undefined;
  def: string;
  defLoading: React.ReactElement<any> | null;
  launch: boolean;
}

interface Common {
  [key: string]: any
}

class LImg extends React.Component<Props, State> {

  public static defaultProps: Props = {
    className: '',
    style: {},
    def: '',
    defLoading: null,
    src: '',
    lazy: false,
    displayToLazy: false,
    bgSize: 'cover',
    width: 0,
    height: undefined,
    unit: 'rem',
    imgShade: false,
    clickReload: false
  };

  public state: State = {
    src: "",
    def: "",
    done: false,
    error: false,
    width: 0,
    height: 0,
    defLoading: null,
    launch: true,
  };

  public img: JSX.Element | null = null;

  public div: HTMLElement | null = null;


  constructor(props: Props) {
    super(props);
  }

  public componentDidMount(): void {
    const props = this.props;
    this.state.src = this.getSrc(props.src);
    if (props.lazy) {
      if (props.src) {
        this.img = this.createImage();
      } else {
        this.state.done = true;
        this.state.error = true;
      }
    } else {
      this.state.done = true;
    }

    this.state.def = props.def || '';

    if (props.defLoading) {
      this.state.defLoading = React.cloneElement(props.defLoading, {className: cx(`${pre}img-loading`)})
    }

    this.state.width = props.width;
    this.state.height = props.height === undefined ? props.width : props.height;

    if (props.displayToLazy) {
      this.state.launch = false;
    }

    this.setState({});
  }

  public getSrc(src: string): string {
    if (!src) return src;
    if (/\/\/yanxuan\./.test(src)) {
      src += '?imageView&quality=65&thumbnail=330x330';
    } else if (/360buyimg/.test(src)) {
      src += '!q50.dpg.webp';
    }

    if (src.indexOf('http:') === 0) {
      return src.substring(5);
    } else {
      return src;
    }
  }


  public createImage(): JSX.Element | null {

    if (!this.state.src) {
      this.setState({src: "", done: true, error: true});
      return null;
    }

    const uuid = Utils.createUUID();

    return (<img
      key={uuid}
      className={cx(`${pre}img-shade`)}
      src={this.state.src}
      onLoad={() => {
        if (this.state.done) return;
        this.setState({src: this.state.src, done: true, error: false});
      }}
      onError={() => {
        if (this.state.done) return;
        this.setState({src: "", done: true, error: true});
      }}
    />);
  }

  public setLaunch(v: boolean): void {
    this.setState({launch: v});
  }


  public render(): React.ReactNode {
    const {style, className, unit, bgSize, imgShade, clickReload} = this.props;
    const {width, height, def, done, error, src, defLoading, launch} = this.state;

    const boxStyle: Common = {...style};

    if (width) boxStyle.width = `${width}${unit}`;
    if (height) boxStyle.height = `${height}${unit}`;

    if (!defLoading || done) {
      boxStyle.backgroundImage = `url(${def})`;
    }

    const sizeClass = bgSize === 'cover' ? 'bg_cover' : bgSize === 'contain' ? 'bg_contain' : '';
    const linerStyle = launch ? done ? error ? {backgroundColor: 'transparent'} : {backgroundImage: `url(${src})`} : {backgroundColor: 'transparent'} : {backgroundColor: 'transparent'};

    return (<div
      className={cx(`${pre}img-box`, className)}
      style={boxStyle}
    >
      {defLoading && !done ? defLoading : null}
      <div ref={el => (this.div = el)}
           className={cx(`${pre}img-liner`, sizeClass)}
           style={linerStyle}
           onClick={() => {
             if (clickReload && done && error) {
               this.img = this.createImage();
               this.setState({done: false, error: false});
             }
           }}>
        {launch ? done ? (imgShade ? this.img : null) : this.img : null}
      </div>
    </div>);
  }
}

export default LImg;
