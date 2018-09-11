import { Config } from '../interface/Interface';
/**
 * @param {Config[]} data
 * @returns {Config[]}
 */
export declare const formatData: (data: Config[], index?: number[] | undefined) => Config[];
/**
 * @param {Config[]} data
 * @returns {boolean}
 */
export declare const setHasChildChose: (data?: Config[] | undefined) => boolean | void;
/**
 * 根据isChoose来判断哪些选项已经被选中了, 初始的时候进行判断.
 * @param {Config[]} data
 * @param {Config[]} chose
 * @returns {Config[]}
 */
export declare const getChose: (data: Config[], chose?: Config[]) => Config[];
export declare const getAllChildChose: (data?: Config[] | undefined, chose?: Config[]) => Config[];
/**
 * 根据 indexArr 获取当前选中的item
 * @param {Config[]} data
 * @param {number[]} indexArr
 * @returns {any}
 */
export declare const getSelectItem: (data: Config[], indexArr: number[]) => any;
/**
 * 关闭某一特定层的树
 * @param {Config[]} data
 * @param {number[]} indexArr
 */
export declare const closeItem: (data: Config[], indexArr: number[]) => void;
/**
 * 关闭所有展开的树
 * @param {Config[]} data
 */
export declare const closeAll: (data: Config[]) => void;
/**
 * 计算第三层树的高度, 下拉动画需要
 * @param {Config[]} data
 * @returns {number}
 */
export declare const calcChildTreeHeight: (data: Config[]) => number;
/**
 * 重置data
 * @param {Config[]} data
 */
export declare const resetData: (data?: Config[] | undefined) => void;
