import * as React from 'react';
import { Component } from 'react';
import { Props } from './interface/Interface';
declare class Container extends Component<Props, object> {
    static defaultProps: {
        isAutoHidden: boolean;
        isShow: boolean;
    };
    static show: (props: Props) => void;
    static hide: () => void;
    componentDidMount(): void;
    show(initShow?: boolean): void;
    hide(): void;
    render(): React.ReactNode;
}
export default Container;
