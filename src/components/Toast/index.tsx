import Container, {ContainerObj} from './Container';

interface cToastObj {
  shade?: boolean;
  shadeType?: string;
  css?: string;
  tapToClose?: boolean;

  onClose?: () => void;
}

let newContainer: ContainerObj | undefined;

// 单例 获得一个 Toast 容器
const getNewContainer = (): ContainerObj => {
  if (!newContainer) {
    newContainer = Container.create();
  }
  return newContainer;
};

/**
 *  集合参数 完成对Container的改变
 * @param type toast的类型
 * @param content 文字
 * @param time
 * @param shade 是否显示背景层 默认不显示
 * @param shadeType 背景层颜色类型 black | white | transparent 默认 transparent
 * @param css 额外的样式
 * @param tapToClose 是否点击立马关闭toast
 * @param onClose 关闭回调
 */
const toast = (type: string, content: string, time: number = 3000, {shade = false, shadeType = 'transparent', css = '', tapToClose = false, onClose}: cToastObj) => {
  const n = getNewContainer();
  if (!content) return;
  n.toast({type, content, time, shade, shadeType, css, tapToClose, onClose});
};

/*
    icon 分别有
    btn_selectd 成功
    alert_toast 警告
    delete 失败
    busy_toast 繁忙 // 哭脸
    internet_toast 没有网络
    loading 加载 // 会转的哟
 */

export default {
  show: (content: string, time?: number, options: cToastObj = {}) => toast('text', content, time, options), // 普通文字
  success: (content: string, time?: number, options: cToastObj = {}) => toast('success', content, time, options), // 成功
  warning: (content: string, time?: number, options: cToastObj = {}) => toast('warning', content, time, options), // 警告
  error: (content: string, time?: number, options: cToastObj = {}) => toast('error', content, time, options), // 错误
  busy: (content: string, time?: number, options: cToastObj = {}) => toast('busy', content, time, options), // 繁忙
  wifi: (content: string, time?: number, options: cToastObj = {}) => toast('wifi', content, time, options), // 没有网络
  /*
  loading
  默认时间无限制 需要手动关闭
  默认显示背景层
   */
  loading: (content: string = '加载中...', time: number = 10000, options: cToastObj = {}) => {
    options.shade = options.shade === undefined ? true : options.shade;
    return toast('loading', content, time, options);
  },
  // 设置独立的 loading  Toast.setIndependentLoading(true); 全局设置
  setIndependentLoading: (b: boolean): void => {
    Container.independentLoading = b;
  },
  // 隐藏 loading
  hideLoading: (): void => newContainer && newContainer.hideLoading(),
  // 隐藏
  hide: (): void => newContainer && newContainer.hide(),
  // 销毁
  destroy(): void {
    if (newContainer) {
      newContainer.destroy();
      newContainer = undefined;
    }
  },
};
