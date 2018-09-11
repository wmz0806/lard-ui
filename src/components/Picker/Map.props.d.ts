declare const Map: {
    data1: {
        label: string;
        value: string;
    }[][];
    data2: {
        label: string;
        value: string;
        children: {
            label: string;
            value: string;
            children: {
                label: string;
                value: string;
            }[];
        }[];
    }[];
};
export default Map;
