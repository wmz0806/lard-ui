import { IData } from './interface';
/**
 * 从某年某月开始, 拿出几个月的数据
 */
export declare const getRenderData: (begin: Date, month: number, { choose, disabled }: any) => IData;
