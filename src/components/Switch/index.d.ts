import * as React from 'react';
import { Component } from 'react';
interface Props {
    /**
     * true: 开, false: 关, 'loading': 加载中(组件禁用中).
     * @default false
     */
    status?: boolean | 'loading';
    /**
     * 点击事件回调, 如果显示的返回了false, 那么会阻止组件更改他的状态;
     * 如果返回Promise, 那么会首先设置为loading, 然后再resolve 后, 将他置为相反状态, reject后, 置为开始状态
     */
    onClick: (e: any, status: boolean | 'loading') => false | Promise<null>;
    className?: string;
    style?: object;
}
interface State {
    status: boolean | 'loading';
}
declare class Switch extends Component<Props, State> {
    static defaultProps: {};
    state: State;
    constructor(props: Props);
    _click(e: any, status: boolean | 'loading'): void;
    setStatus(status: boolean | 'loading'): void;
    render(): React.ReactNode;
}
export default Switch;
