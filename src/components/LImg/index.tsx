import * as React from 'react';
import LImg, {Props} from './LImg';
import * as def from './images/default.png'

export interface Dict {
  component?: React.ReactNode,
  target?: any
}

let timer: any = null;

const load = (arr: Dict[], callback: (div: HTMLElement) => boolean): void => {
  for (let i: number = 0; i < arr.length; i++) {
    const dict: Dict = arr[i];
    if (dict.target) {
      if (dict.target.state.done) {
        // 加载完毕删除这个 Dict
        arr.splice(i, 1);
        i--
      } else if (dict.target.div) {
        if (callback(dict.target.div)) {
          dict.target.setLaunch(true);
          arr.splice(i, 1);
          i--
        }
      }
    }
  }
};

export default {

  get: (props: Props, arr?: Dict[]) => {

    if (!props.def) props.def = def;

    if (Array.isArray(arr)) {
      const dict: Dict = {};
      const C = (<LImg ref={el => (dict.target = el)} {...props}/>);
      dict.component = C;
      arr.push(dict);
      return C;
    } else {
      return (<LImg {...props}/>)
    }

  },

  attemptLoad: (arr: Dict[], callback: (div: HTMLElement) => boolean) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      load(arr, callback);
    }, 233);
  }
};
