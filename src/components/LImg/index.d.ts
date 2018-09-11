import * as React from 'react';
import { Props } from './LImg';
export interface Dict {
    component?: React.ReactNode;
    target?: any;
}
declare const _default: {
    get: (props: Props, arr?: Dict[] | undefined) => JSX.Element;
    attemptLoad: (arr: Dict[], callback: (div: HTMLElement) => boolean) => void;
};
export default _default;
