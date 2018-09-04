import config from './config';

export default {
  createUUID: (place: number = 3, connector: string = '_'): string => {
    /** @return {string} */
    const U = (): string => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    let uuid = '';
    for (let i = 0; i < place; i++) uuid += U() + connector;
    return uuid + new Date().getTime().toString(32);
  },


  isMobile: (): boolean => {
    return !!navigator.userAgent.match(/(iPhone|iPad|iPod|Android|ios)/i);
  },

  /**
   * 获取缩放比例
   * @param baseSize 基础字号大小
   * @returns {number}
   */
  getZoomRate: (baseSize = config.baseFontSize) => {
    const fontSize = window.document.documentElement.style.fontSize;
    const curSize = parseInt(`${fontSize}`, 10);
    return curSize / baseSize;
  },

}
