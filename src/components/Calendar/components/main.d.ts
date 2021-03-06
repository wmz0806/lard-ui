import * as React from 'react';
import { Component } from 'react';
import { State, Props, IData, ISimpleDate, IPrev, INext, ICurrent } from './interface';
declare class Calendar extends Component<Props, State> {
    static defaultProps: {};
    state: State;
    private _beginDate;
    private _endDate;
    private _chooseDate;
    private _disabledDate;
    private _currentBeginDate;
    private _renderMonthNum;
    private _contentRef;
    private _disabled;
    private _timer;
    private _picker;
    private _moveFlag;
    private _width;
    private isCheck;
    private isHorizontal;
    constructor(props: Props);
    componentDidMount(): void;
    componentWillUnmount(): void;
    changeMonth(monthStep: number, curBegin: ISimpleDate, curEnd: ISimpleDate): IData | void;
    changeAnimate(monthStep: number): void;
    setContentTransform(x: string): void;
    setContentTransition(on: boolean): void;
    setData(begin: Date, month: number, choose: ISimpleDate[] | null, disabled: ISimpleDate[] | null): void;
    _validateDate(monthStep: number): false | {
        curBegin: ISimpleDate;
        curEnd: ISimpleDate;
    };
    setDate(choose: Date[]): void;
    setMonth(date: Date | string): void;
    goPrevMonth(date?: IPrev): void;
    goNextMonth(date?: INext): void;
    chooseDate(cDate: ICurrent): void;
    _touchStart(e: any): void;
    _touchMove(e: any): void;
    _touchEnd(e: any): void;
    _chooseMonth(): void;
    _clearFlag(): void;
    _renderMonth(index: number): React.ReactNode;
    _renderHeader(): React.ReactNode | void;
    _renderContent(): React.ReactNode;
    render(): React.ReactNode;
}
export default Calendar;
