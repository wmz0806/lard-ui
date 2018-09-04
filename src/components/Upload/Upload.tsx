import * as React from 'react';
import cn from 'classnames';
import Loading from '../Loading';
import Icon from '../Icon';
import Toast from '../Toast';
import Item from './Item';
import UploadLib from './lib.js';
import config from '../../config';
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
   * 初始化图片的地址
   * @default ""
   */
  src?: string;
  /**
   * 是否自动显示选择图片预览图
   * @default true
   */
  autoShow: boolean;
  /**
   * 是否在预览图生成好自动关闭loading
   * @default true
   */
  autoCloseLoading: boolean;

  /**
   * 支持的文件类型
   * @default ['jpg', 'png', 'jpeg']
   */
  types: string[];

  /**
   * （KB） 支持上传图片的大小
   * @default 1024
   */
  size: number;
  /**
   * 是否压缩图片
   * @default true
   */
  compress: boolean;

  /**
   * 压缩图片最大的宽
   * @default 750
   */
  width: number;

  /**
   * 压缩后输出图片的质量
   * @default 0.8
   */
  quality: number;

  /**
   * 校正图片的exif信息
   * @default true
   */
  isGetEXIF: boolean;

  /**
   * 图片加载完毕后的回调（onComplete 会注入两个参数第一个是最后的结果base64， 第二个是关闭loading）
   * @default undefined
   */
  onComplete(...args: any[]): void;

  /**
   * 图片加载错误的回调
   * @default undefined
   */
  onError?(...args: any[]): void;

}

interface State {
  [key: string]: any
}


export default class Upload extends React.Component<Props, State> {
  public static defaultProps = {
    className: '',
    style: {},
    src: '', // 初始化图片的地址
    autoShow: true, // 是否自动显示选择图片预览图
    autoCloseLoading: true, // 是否在预览图生成好久自动关闭loading
    types: ['jpg', 'png', 'jpeg'], // 支持的文件类型
    size: 1024, // （KB） 支持上传图片的大小
    compress: true, // 是否压缩图片
    width: 640, // 压缩图片最大的宽
    quality: 0.8, // 压缩后输出图片的质量
    isGetEXIF: true, // 图片的exif信息
    onComplete: () => {
      //empty
    },
    onError: () => {
      //empty
    },
  };

  public state: State = {
    showInput: true,
    showLoading: false,
    showResult: true,
    src: "",
    autoShow: true,
  };
  public _input: any;

  constructor(props: Props) {
    super(props);

    const {autoShow, src} = this.props;

    this.state.autoShow = autoShow;
    this.state.src = src;
  }


  public _onChange(e: any): void {
    const files = e.target.files || e.dataTransfer.files;
    this._filter(files);
    this._input && (this._input.value = null);
  }

  public _closeLoading(): void {
    this.setState({showLoading: false});
  }

  public _filter(files: any[]): void {
    const file = files[0];

    const postfix = this._getPostfix(file.name);

    if (!this.props.types.includes(postfix)) {
      Toast.show(`选择的文件格式不对，仅支持 ${this.props.types.join(',')} 的格式`);
      return;
    }

    // 判断是否需要压缩
    if (this.props.compress) {
      this.setState({showLoading: true});
      // 压缩后的图片基本符合大小要求 如果在强行判断会影响性能 所以就不再进行大小的判断
      UploadLib.compressImage(file, this.props.width, this.props.quality, this.props.isGetEXIF).then((result: any) => {
        this.setState(this.props.autoCloseLoading ? {showLoading: false, src: result.base64} : {src: result.base64});
        this.props.onComplete(result, () => {
          this._closeLoading();
        });
      }).catch(() => {
        Toast.show('文件读取失败');
        this.props.onError && this.props.onError();
      });
    } else if (file.size >= this.props.size * 1024) {
      Toast.show(`选择文件太大应小于 ${this.props.size} KB`);
      return;
    } else {
      UploadLib.loadToBase64(file).then((result: any) => {
        this.setState(this.props.autoCloseLoading ? {showLoading: false, src: result.base64} : {src: result.base64});
        this.props.onComplete(result, () => {
          this._closeLoading();
        });
      }).catch(() => {
        Toast.show('文件读取失败');
        this.props.onError && this.props.onError();
      });
    }
  }

  public _getPostfix(name: string): string {
    const a = name.split('.');
    return a[a.length - 1].toLocaleLowerCase();
  }

  public componentDidMount(): void {
    //empty
  }

  public componentWillUnmount(): void {
    this._closeLoading = () => {
      //empty
    };
  }

  public render(): React.ReactNode {
    return (
      <div className={cx(`${pre}upload-container`, this.props.className)}>
        {
          this.state.showInput && <div className={cx(`${pre}upload-input-container`)}>
            <input
              onChange={(e) => {
                this._onChange(e);
              }}
              ref={(el) => {
                this._input = el;
              }}
              type="file"
            />
          </div>
        }
        {
          this.state.showLoading && <div className={cx(`${pre}upload-loading-container`)}>
            <Loading size={0.68}/>
          </div>
        }
        {
          this.state.showResult && this.state.autoShow && this.state.src && <Item
            src={this.state.src}
            showClose={false}
            close={() => {
              this.setState({src: ''});
            }}
          />
        }
        <div className={`${pre}upload-bg-container`}>
          <Icon name={'jia'} size={0.98} color={'#CBCBCB'}/>
        </div>
      </div>
    );
  }
}
