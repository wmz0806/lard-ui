interface cToastObj {
    shade?: boolean;
    shadeType?: string;
    css?: string;
    tapToClose?: boolean;
    onClose?: () => void;
}
declare const _default: {
    show: (content: string, time?: number | undefined, options?: cToastObj) => void;
    success: (content: string, time?: number | undefined, options?: cToastObj) => void;
    warning: (content: string, time?: number | undefined, options?: cToastObj) => void;
    error: (content: string, time?: number | undefined, options?: cToastObj) => void;
    busy: (content: string, time?: number | undefined, options?: cToastObj) => void;
    wifi: (content: string, time?: number | undefined, options?: cToastObj) => void;
    loading: (content?: string, time?: number, options?: cToastObj) => void;
    setIndependentLoading: (b: boolean) => void;
    hideLoading: () => void;
    hide: () => void;
    destroy(): void;
};
export default _default;
