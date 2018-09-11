import { ISimpleDate } from './interface';
export declare const formatDate: (date: string | Date) => Date;
export declare const getSimpleDate: (d: Date) => ISimpleDate;
export declare const getNatureDate: (d: ISimpleDate) => Date;
export declare const findDateIndexOfMap: (date: ISimpleDate, map: ISimpleDate[]) => number;
export declare const deleteMap: (index: number, map: any[]) => boolean;
export declare const isSameDate: (d1: ISimpleDate, d2: ISimpleDate) => boolean;
export declare const isOverDate: (curTime: ISimpleDate, compareTime: ISimpleDate, isBegin: boolean) => boolean;
export declare const walkMonth: (date: Date, monthStep: number) => ISimpleDate;
