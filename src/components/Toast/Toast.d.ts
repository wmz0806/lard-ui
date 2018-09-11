import * as React from 'react';
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
     * 自动关闭时间 （ 单位毫秒）
     * @default ""
     */
    time?: number;
    /**
     * toast 类型
     * @default "text"
     */
    type?: string;
    /**
     * 是否点击即关闭
     * @default false
     */
    tapToClose?: boolean;
    /**
     * 显示的内容
     * @default ""
     */
    content?: string;
    /**
     * 关闭后的回调（这个是调用层的回调）
     * @default function
     */
    onClose?: () => void;
    /**
     * 关闭的回调（这个是自身的关闭回调）
     * @default function
     */
    onRealClose: () => void;
}
declare class Toast extends React.Component<Props, object> {
    static defaultProps: Props;
    state: {
        show: boolean;
        hide: boolean;
    };
    closeTimer: any;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    clearCloseTimer(): void;
    close(): void;
    getIconName(type: string): string;
    render(): React.ReactNode;
}
export default Toast;
