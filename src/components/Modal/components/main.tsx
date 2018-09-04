import Collection from './Collection';
import {IDialog, IConfirm, IButton, IAlert} from './interface-modal'

let Container: any;

const getContainer = () => {
  if (!Container) Container = Collection.create();
  return Container;
};

const dialog = (params: IDialog) => {
  const Modal = getContainer();
  const {buttons} = params;
  buttons && buttons.forEach(btn => btn.cb = btn.onClick);

  return Modal.show(params)
};

export default {
  dialog: (params: IDialog) => {
    return dialog(params)
  },

  confirm: (params: IConfirm) => {
    const buttons: IButton[] = [];
    const {title, content, cancelBtn = {}, sureBtn = {}, options} = params;

    buttons.push({
      ...cancelBtn,
      content: cancelBtn.content || '取消',
    });
    buttons.push({
      ...sureBtn,
      content: sureBtn.content || '确认',
    });

    const opt = {
      title,
      content,
      buttons,
      options,
    };

    return dialog(opt);
  },

  alert: (params: IAlert) => {
    const {title, content, sureBtn = {}, options} = params;

    const button = {
      ...sureBtn,
      content: sureBtn.content || '确认',
    };

    const opt = {
      title,
      content,
      buttons: [button],
      options,
    };
    return dialog(opt);
  },

  // 隐藏最后一个模态框
  hide: () => {
    Container && Container.hide();
  },

  // 隐藏所有
  hideAll: () => {
    Container && Container.hideAll();
  },

  // 销毁
  destroy: () => {
    Container && Container.destroy();
    Container = null;
  }
}
