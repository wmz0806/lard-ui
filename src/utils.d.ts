declare const _default: {
    createUUID: (place?: number, connector?: string) => string;
    isMobile: () => boolean;
    /**
     * 获取缩放比例
     * @param baseSize 基础字号大小
     * @returns {number}
     */
    getZoomRate: (baseSize?: number) => number;
};
export default _default;
