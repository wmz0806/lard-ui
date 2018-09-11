import * as React from 'react';
interface IList {
    content: React.ReactNode | string;
    color?: string;
    disabled?: boolean;
    isCancel?: boolean;
    isDelete?: boolean;
    onClick?: (e: any) => void;
}
interface Props {
    list: IList[];
    onHide?: () => void;
}
declare const _default: {
    show: (props: Props) => void;
    hide: () => void;
};
export default _default;
