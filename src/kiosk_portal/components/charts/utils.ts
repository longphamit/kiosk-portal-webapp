export enum LineChartType {
    Year,
    Month
}

export enum FilterChartType {
    All,
    Year,
    Month
}

export const convertToVietNameCurrency = (text: any) => {
    return text.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}