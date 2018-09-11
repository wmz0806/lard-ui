export declare const data: (({
    label: string;
    value: string;
    children: ({
        label: string;
        value: string;
        children?: undefined;
        isActive?: undefined;
    } | {
        label: string;
        value: string;
        children: ({
            label: string;
            value: string;
            children: {
                label: string;
                value: string;
            }[];
        } | {
            label: string;
            value: string;
            children?: undefined;
        })[];
        isActive?: undefined;
    } | {
        label: string;
        value: string;
        isActive: boolean;
        children: never[];
    })[];
    isActive?: undefined;
} | {
    label: string;
    value: string;
    isActive: boolean;
    children: ({
        label: string;
        value: string;
        children: never[];
        isActive?: undefined;
    } | {
        label: string;
        value: string;
        isActive: boolean;
        children: ({
            label: string;
            value: string;
            isActive?: undefined;
        } | {
            label: string;
            value: string;
            isActive: boolean;
        })[];
    })[];
} | {
    label: string;
    value: string;
    children?: undefined;
    isActive?: undefined;
})[] | ({
    label: string;
    value: string;
    isActive?: undefined;
    children?: undefined;
} | {
    label: string;
    value: string;
    isActive: boolean;
    children?: undefined;
} | {
    label: string;
    value: string;
    children: ({
        label: string;
        value: string;
        isActive?: undefined;
    } | {
        label: string;
        value: string;
        isActive: boolean;
    })[];
    isActive?: undefined;
})[])[];
