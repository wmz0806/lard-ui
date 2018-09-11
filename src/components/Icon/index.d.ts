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
     * icon 名称
     * @default ""
     */
    name: string;
    /**
     * icon 颜色
     * @default “”
     */
    color?: string;
    /**
     * icon 大小
     * @default 0
     */
    size?: number;
    /**
     * 单位
     * @default rem
     */
    unit?: string;
}
export default class Icon extends React.Component<Props, object> {
    static defaultProps: Props;
    render(): React.ReactNode;
}
