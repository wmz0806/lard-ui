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
    static defaultProps: Props;
    state: any;
    constructor(props: Props);
    show(): void;
    hide(): void;
    render(): React.ReactNode;
}
