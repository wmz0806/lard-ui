// requestAnimationFrame.js 模块
let lastTime = 0;
const vendors = ['webkit', 'moz'];
for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
  window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
  window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`] || // Webkit中此取消方法的名字变了
    window[`${vendors[x]}CancelRequestAnimationFrame`];
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback) => {
    const currTime = new Date().getTime();
    const timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
    const id = window.setTimeout(() => {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id) => {
    clearTimeout(id);
  };
}

/*
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
 * Get effect on 'http://easings.net/zh-cn'
 */
/* eslint-disable */
const Tween = {
  linear(t, b, c, d) {
    return c * t / d + b;
  },
  // Quad
  easeIn(t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOut(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOut(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  },
  // Cubic
  easeInCubic(t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  },
  // Quart
  easeInQuart(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutQuart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  },
  // Quint
  easeInQuint(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOutQuint(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  },
  // Sine
  easeInSine(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  },
  easeOutSine(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  },
  easeInOutSine(t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  },
  // Expo
  easeInExpo(t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOutExpo(t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  },
  easeInOutExpo(t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  // Circ
  easeInCirc(t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOutCirc(t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  easeInOutCirc(t, b, c, d) {
    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
  // Elastic
  easeInElastic(t, b, c, d, a, p) {
    let s;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (typeof p === 'undefined') p = d * 0.3;
    if (!a || a < Math.abs(c)) {
      s = p / 4;
      a = c;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  },
  easeOutElastic(t, b, c, d, a, p) {
    let s;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (typeof p === 'undefined') p = d * 0.3;
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
  },
  easeInOutElastic(t, b, c, d, a, p) {
    let s;
    if (t == 0) return b;
    if ((t /= d / 2) == 2) return b + c;
    if (typeof p === 'undefined') p = d * (0.3 * 1.5);
    if (!a || a < Math.abs(c)) {
      a = c;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
  },
  // Back
  easeInBack(t, b, c, d, s) {
    if (typeof s === 'undefined') s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  easeOutBack(t, b, c, d, s) {
    if (typeof s === 'undefined') s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  easeInOutBack(t, b, c, d, s) {
    if (typeof s === 'undefined') s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  },
  // Bounce
  easeInBounce(t, b, c, d) {
    return c - Tween.easeOutBounce(d - t, 0, c, d) + b;
  },
  easeOutBounce(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    }
  },
  easeInOutBounce(t, b, c, d) {
    if (t < d / 2) {
      return Tween.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
    } else {
      return Tween.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
  },
};
/* eslint-enable */


export default class Timeline {
  constructor(opt) {
    this._init(opt);
    this.state = 'init';
  }

  _init(opt) {
    this.target = opt.target;
    this._initValue(opt.value);
    this.duration = opt.duration || 1000;
    this.timingFunction = opt.timingFunction || 'linear';
    this.renderFunction = opt.render || this._defaultFunc;

    /* Events */
    this.onPlay = opt.onPlay;
    this.onEnd = opt.onEnd;
    this.onStop = opt.onStop;
    this.onReset = opt.onReset;
  }

  _initValue(value) {
    this.value = [];
    if (Array.isArray(value)) {
      Array.isArray(value[0]) ? this._initMutipleValue(value) : this._initSimgleValue(value);
    } else if (typeof value === 'object' && value.type === 'path') {
      this._initPathValue(value);
    }
  }

  _initPathValue(value) {
    this.value.push({
      start: 0,
      end: value.svg.getTotalLength(),
      type: 'path',
      svg: value.svg,
    });
  }

  _initSimgleValue(value) {
    this.value.push({
      start: parseFloat(value[0]),
      end: parseFloat(value[1]),
      type: 'simgle',
    });
  }

  _initMutipleValue(values) {
    values.forEach((value) => {
      this.value.push({
        start: parseFloat(value[0]),
        end: parseFloat(value[1]),
        type: 'mutiple',
      });
    });
  }

  _defaultFunc() {
    console.warn('no render function!');
  }

  _renderEndState() {
    const d = this.duration;
    const func = Tween[this.timingFunction] || Tween.linear;
    this._renderFunction(d, d, func);
  }

  _renderInitState() {
    const d = this.duration;
    const func = Tween[this.timingFunction] || Tween.linear;
    this._renderFunction(0, d, func);
  }

  _renderStopState(t) {
    const d = this.duration;
    const func = Tween[this.timingFunction] || Tween.linear;
    this._renderFunction(t, d, func);
  }

  _loop() {
    const t = Date.now() - this.beginTime;
    const d = this.duration;
    const func = Tween[this.timingFunction] || Tween.linear;

    if (this.state === 'end' || t >= d) {
      this._end();
    } else if (this.state === 'stop') {
      this._stop(t);
    } else if (this.state === 'init') {
      this._reset();
    } else {
      this._renderFunction(t, d, func);
      window.requestAnimationFrame(this._loop.bind(this));
    }
  }

  _renderFunction(t, d, func) {
    const values = this.value.map((value) => {
      const curValue = func(t, value.start, value.end - value.start, d);
      return value.type === 'path' ? value.svg.getPointAtLength(curValue) : curValue;
    });
    this.renderFunction(values);
    // this.renderFunction.apply(this, values);
  }

  _play() {
    this.state = 'play';
    this.onPlay && this.onPlay.call(this);

    this.beginTime = Date.now();
    const loop = this._loop.bind(this);
    window.requestAnimationFrame(loop);
  }

  _end() {
    this.state = 'end';
    this._renderEndState();
    this.onEnd && this.onEnd.call(this);
  }

  _stop(t) {
    this.state = 'stop';
    this._renderStopState(t);
    this.onStop && this.onStop.call(this);
  }

  _reset() {
    this.state = 'init';
    this._renderInitState();
    this.onReset && this.onReset.call(this);
  }

  play() {
    this._play();
  }

  end() {
    this.state === 'play' ? (this.state = 'end') : this._end();
  }

  stop() {
    if (this.state === 'play') {
      this.state = 'stop';
    } else {
      this.state = 'stop';
      this.onStop && this.onStop();
    }
  }

  reset() {
    this.state === 'play' ? (this.state = 'init') : this._reset();
  }
}
