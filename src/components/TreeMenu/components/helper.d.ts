import { BodyConfig } from '../interface/Interface';
export declare const getActiveIndex: (data: BodyConfig[]) => number[];
export declare const setActive: (index: number[], data: BodyConfig[], startIndex?: number) => BodyConfig[];
export declare const setData: (data: BodyConfig[]) => BodyConfig[];
export declare const getRenderData: (data: BodyConfig[], index: number[]) => BodyConfig[] | undefined;
/**
 * 获取当前点击 item 处于的哪条数据
 */
export declare const getClickData: (data: BodyConfig[], activeIndex: number[], listIndex: number) => BodyConfig[] | undefined;
/**
 * 更新 activeIndex
 */
export declare const updateActiveIndex: (activeIndex: number[], listIndex: number, index: number) => number[];
