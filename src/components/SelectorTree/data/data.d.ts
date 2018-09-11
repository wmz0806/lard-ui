declare const data: ({
    label: string;
    value: string;
    children: {
        label: string;
        value: string;
        children: ({
            label: string;
            value: string;
            isChoose?: undefined;
        } | {
            label: string;
            value: string;
            isChoose: boolean;
        })[];
    }[];
} | {
    label: string;
    value: string;
    children: {
        label: string;
        value: string;
    }[];
})[];
export default data;
export declare const asyncData: {
    label: string;
}[];
