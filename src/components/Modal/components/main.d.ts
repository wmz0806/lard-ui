import { IDialog, IConfirm, IAlert } from './interface-modal';
declare const _default: {
    dialog: (params: IDialog) => any;
    confirm: (params: IConfirm) => any;
    alert: (params: IAlert) => any;
    hide: () => void;
    hideAll: () => void;
    destroy: () => void;
};
export default _default;
