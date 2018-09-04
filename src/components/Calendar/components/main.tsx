import * as React from 'react';
import {Component} from 'react';
import cn from 'classnames';
import Icon from '../../Icon';
import {State, Props, IData, ISimpleDate, IPrev, INext, ICurrent, Flag} from './interface';
import {
  formatDate,
  getSimpleDate,
  getNatureDate,
  // findDateIndexOfMap,
  // isSameDate,
  isOverDate,
  walkMonth,
} from './helper';

import Picker from '../../Picker';

import {getRenderData} from './compute';

import styles from '../style.less';
import config from '../../../config';

const cx = cn.bind(styles);
const pre = config.pre;

class Calendar extends Component<Props, State> {
  public static defaultProps = {};

  public state: State = {
    disabledLeft: false,
    disabledRight: false,
    dateCollection: {current: [], prev: [], next: []},
  };

  // 开始时间 结束时间 选择时间 禁用时间
  private _beginDate: Date = new Date();
  private _endDate: Date = new Date();
  private _chooseDate: ISimpleDate[] | null = null;
  private _disabledDate: ISimpleDate[] | null = null;

  // 记录当前 已经渲染 的开始时间和结束时间: **注意**, 当前组件中,由于动画原因, 是实际的日期还要减少一个月份.
  private _currentBeginDate: Date | null = null;
  // private _currentEndDate: Date | null = null;

  // 渲染几个月呢?
  private _renderMonthNum: number = 3;

  // ref
  private _contentRef: HTMLElement | null = null;

  // 禁用组件中
  private _disabled: boolean = false;

  // timer
  private _timer: any = null;

  private _picker: any = null;

  // touch flag
  private _moveFlag: Flag = {
    startX: 0,
    startY: 0,
  };
  private _width: number = 1;
  private isCheck: boolean = false;
  private isHorizontal: boolean = false;

  constructor(props: Props) {
    super(props);
    const {beginDate, endDate, chooseDate, disabledDate} = props;

    // 转换时间
    if (beginDate) this._beginDate = formatDate(beginDate);
    if (endDate) this._endDate = formatDate(endDate);

    if (chooseDate) {
      this._chooseDate = chooseDate.map(item => getSimpleDate(formatDate(item)));
    }

    if (disabledDate) {
      this._disabledDate = disabledDate.map(item => getSimpleDate(formatDate(item)));
    }
  }

  public componentDidMount(): void {
    // 初始化 width;
    this._width = this._contentRef ? this._contentRef.offsetWidth : 1;

    // 初始化render
    const _chooseDate = this._chooseDate;
    const _disabledDate = this._disabledDate;
    const num = this._renderMonthNum;

    let begin;
    const td = getSimpleDate(new Date());
    const bd = getSimpleDate(this._beginDate);
    const ed = getSimpleDate(this._endDate);

    // 优先级: chooseDate(选第一个), new Date(), beginDate - 1,
    if (_chooseDate && _chooseDate.length) {
      begin = getNatureDate(walkMonth(getNatureDate(_chooseDate[0]), -1));
    } else if(!isOverDate(td, bd, true) && !isOverDate(td, ed, false)) {
      begin = getNatureDate(walkMonth(new Date(), -1));
    } else {
      begin = getNatureDate(walkMonth(this._beginDate, -1));
    }

    this.setData(
      begin, num, _chooseDate, _disabledDate
    );
  }

  public componentWillUnmount(): void {
    this._timer && clearTimeout(this._timer);
  }

  public changeMonth(monthStep: number, curBegin: ISimpleDate, curEnd: ISimpleDate): IData | void {
    const beginTime = getNatureDate(curBegin);
    const month = (curEnd.month - curBegin.month + 1) + 12 * (curEnd.year - curBegin.year);

    const _chooseDate = this._chooseDate;
    const _disabledDate = this._disabledDate;

    this.setData(beginTime, month, _chooseDate, _disabledDate);

  }

  public changeAnimate(monthStep: number): void {
    if (this._disabled) return;
    this._disabled = true;

    // 验证时间超限
    const res = this._validateDate(monthStep);
    if (!res) {
      this._disabled = false;
      return
    }
    const {curEnd, curBegin} = res;

    // 150 ms 动画时间, 禁用组件. 动画后执行重新渲染, 然后回来..
    this.setContentTransition(true);
    this.setContentTransform(monthStep < 0 ? '0' : '-66.666666%');

    this._timer = setTimeout(() => {
      this._disabled = false;
      this.changeMonth(monthStep, curBegin, curEnd);
      this.setContentTransition(false);
      this.setContentTransform('-33.333333%');
    }, 250)
  }

  public setContentTransform(x: string): void {
    if (!this._contentRef) return;
    this._contentRef.style.transform = `translateX(${x})`;
  }

  public setContentTransition(on: boolean): void {
    if (!this._contentRef) return;
    this._contentRef.style.transition = on ? 'all linear .25s' : '';
  }

  // 生成渲染数据, 设定起始时间.
  public setData(begin: Date, month: number, choose: ISimpleDate[] | null, disabled: ISimpleDate[] | null): void {

    const dateCollection = getRenderData(
      begin, month, {choose, disabled}
    );

    this._currentBeginDate = new Date(begin.getFullYear(), begin.getMonth(), 1);

    this.setState({dateCollection});
  }

  public _validateDate(monthStep: number): false | { curBegin: ISimpleDate, curEnd: ISimpleDate } {
    // 如果超出了界限, 就算了吧: 注意, 收尾需要 加减一个月
    if (!this._currentBeginDate) return false;
    this.setState({disabledLeft: false, disabledRight: false});

    const curBegin = walkMonth(this._currentBeginDate, monthStep);
    const endMonth = curBegin.month + this._renderMonthNum - 1;

    const curEnd = getSimpleDate(new Date(
      curBegin.year + Math.floor(endMonth / 12),
      endMonth % 12,
      1
    ));

    // 如果即将超出界限 更换箭头颜色
    if (isOverDate(curBegin, walkMonth(this._beginDate, -1), true)) {
      this.setState({disabledLeft: true});
    } else if (isOverDate(curEnd, walkMonth(this._endDate, 1), false)) {
      this.setState({disabledRight: true});
    }

    // 这才是超出了真正的界限....
    const _begin = walkMonth(this._beginDate, -2);
    const _end = walkMonth(this._endDate, 2);

    if (isOverDate(curBegin, _begin, true)) {
      return false;
    } else if (isOverDate(curEnd, _end, false)){
      return false;
    } else {
      return {curBegin, curEnd};
    }
  }

  // 强制设定选中了某一天 (或者几天)
  public setDate(choose: Date[]): void {
    this._chooseDate = choose.map(
      (item: Date | string) => getSimpleDate(formatDate(item))
    );

    const d = choose[0];

    this.setMonth(d || new Date());
    return
  }

  // 强制设定当前显示到某一个 年, 月
  public setMonth(date: Date | string): void {
    const d: Date = formatDate(date);

    const td = getSimpleDate(d);
    // bd 和 ed 需要 加减1, 因为会多渲染一个月
    const bd = walkMonth(this._beginDate, -1);
    const ed = walkMonth(this._endDate, 1);
    if (isOverDate(td, bd, true) || isOverDate(td, ed, false)) {
      return console.warn('超限了, 大兄弟');
    }

    const begin = getNatureDate(walkMonth(d, -1));
    const _chooseDate = this._chooseDate;
    const _disabledDate = this._disabledDate;

    this.setData(begin, 3, _chooseDate, _disabledDate);
  }

  // 前往上一个月
  public goPrevMonth(date?: IPrev): void {
    this.changeAnimate(-1);
  }

  // 前往下一个月
  public goNextMonth(date?: INext): void {
    this.changeAnimate(1);
  }

  public chooseDate(cDate: ICurrent): void {
    if (!this.props.isMultiple) {
      // 单选的时候.
      const {year = 0, month = 0, date} = cDate;
      this._chooseDate = [{year, month, date}];

      this.setData(this._currentBeginDate || new Date(), this._renderMonthNum, this._chooseDate, this._disabledDate);

      this.props.onChoose && this.props.onChoose(cDate);
    } else {
      // 多选的时候, 还没做 0 0
      console.log(cDate);
    }
  }

  public _touchStart(e: any): void {
    const touch = e.nativeEvent.changedTouches[0];
    this._moveFlag.startX = touch.clientX;
    this._moveFlag.startY = touch.clientY;
  }

  public _touchMove(e: any): void {
    const touch = e.nativeEvent.changedTouches[0];
    const {startX, startY} = this._moveFlag;

    const moveX = touch.clientX;
    const moveY = touch.clientY;

    if (!this.isCheck) {
      // 写死了.. 10px 之后, 确定移动方向
      if (Math.abs(moveX - startX) >= 10) {
        this.isCheck = true;
        this.isHorizontal = true;
      }
      if (Math.abs(moveY - startY) >= 10) {
        this.isCheck = true;
        this.isHorizontal = false;
      }
    }

    // 竖向滑动, 阻止组件动画
    if (!this.isHorizontal) return;

    const movePercent: number = (startX - moveX) / (this._width);
    const percent: number = (-1 / 3) - movePercent;

    this.setContentTransform(
      (percent * 100) + '%'
    );

    // 横向移动, 阻止上下滑动
    // TODO 我也不晓得为什么. ... 不用写这个了
    // e.nativeEvent.preventDefault();
  }

  public _touchEnd(e: any): void {
    // 写死了 20 px 以上, 就动
    if (this.isHorizontal) {
      const endX = e.nativeEvent.changedTouches[0].clientX;
      const {startX} = this._moveFlag;

      const move = endX - startX;
      const moveMonth = move > 0 ? -1 : 1;

      if (Math.abs(move) < 20 || !this._validateDate(moveMonth)) {
        this.setContentTransform('-33.33333333%');
      } else {
        this.changeAnimate(moveMonth);
      }
    }

    this._clearFlag()
  }

  public _chooseMonth(): void {
    this._picker.show();
  }

  public _clearFlag(): void {
    this._moveFlag = {
      startX: 0,
      startY: 0,
    };
    this.isCheck = false;
    this.isHorizontal = false;
  }

  public _renderMonth(index: number): React.ReactNode {
    const {dateCollection} = this.state;
    const {prev, current, next} = dateCollection;

    return (
      <ul key={'month' + index}>
        {
          prev[index].map((date, index) => (
            <li
              key={'prev' + index}
              className={cx('calendar-prev')}
              onClick={() => this.goPrevMonth(date)}
            >
              <span>
                {date.date}
              </span>
            </li>
          ))
        }
        {
          current[index].map((date, index) => (
              <li
                key={'current' + index}
                className={cx(
                  'calendar-current',
                  date.isToday ? 'calendar-today' : '',
                  date.isChoose ? 'calendar-choose' : ''
                )}
                onClick={() => this.chooseDate(date)}
              >
                <span>
                  {date.date}
                </span>
              </li>
            )
          )
        }
        {
          next[index].map((date, index) => (
            <li
              key={'next' + index}
              className={cx('calendar-next')}
              onClick={() => this.goNextMonth(date)}
            >
               <span>
                {date.date}
              </span>
            </li>
          ))
        }
      </ul>
    )
  }

  public _renderHeader(): React.ReactNode | void {
    const {disabledLeft, disabledRight} = this.state;
    if (!this._currentBeginDate) return;
    // 由于渲染的是第二个月, 所以实际显示的是前进一个月.
    const begin = walkMonth(this._currentBeginDate, 1);
    return (
      <div className={cx(pre + 'calendar-header')}>
        <div className={cx(pre + 'calendar-header-year')}>
          <span onClick={() => this._chooseMonth()}>{begin.year}年</span>
        </div>
        <div className={cx(pre + 'calendar-header-month')}>
          <div
            className={cx(pre + 'c-h-m-left')}
            onClick={() => this.goPrevMonth()}
          >
            <Icon name={'fanhui'} size={0.4} color={disabledLeft ? '#ccc' : '#333'}/>
          </div>
          <div>{begin.month + 1}月</div>
          <div
            onClick={() => this.goNextMonth()}
            className={cx(pre + 'c-h-m-right')}
          >
            <Icon name={'xiangyou'} size={0.4} color={disabledRight ? '#ccc' : '#333'}/>
          </div>
        </div>
      </div>
    )
  }

  public _renderContent(): React.ReactNode {
    const {dateCollection} = this.state;

    const totalMonth = dateCollection.current.length;

    const content = [];

    for (let i = 0; i < totalMonth; i++) {
      content.push(this._renderMonth(i));
    }

    return (
      <div
        className={cx(pre + 'calendar-month-content')}
        style={{transform: 'translateX(-33.3333%)'}}
        ref={r => (this._contentRef = r)}

        onTouchStart={e => this._touchStart(e)}
        onTouchMove={e => this._touchMove(e)}
        onTouchEnd={e => this._touchEnd(e)}
        onTouchCancel={e => this._touchEnd(e)}

      >
        {content}
      </div>
    )
  }

  public render(): React.ReactNode {
    return (
      <div className={cx(pre + 'calendar-main')}>
        <div className={cx(pre + 'calendar-container')}>
          {this._renderHeader()}
          <ul className={cx(pre + 'calendar-days')}>
            {
              Array.from('日一二三四五六').map((item, index) => (
                <li key={'day' + index}>{item}</li>
              ))
            }
          </ul>
          {this._renderContent()}
        </div>
        <Picker
          ref={r => this._picker = r}
          title={'请选择'}
          onChange={(v) => {
            this.setMonth(`${v[0]}-${v[1]}-1`)
          }}
          type={'date'}
          col={2}
          min={this._beginDate}
          max={this._endDate}
        />
      </div>
    )
  }

}

export default Calendar;
