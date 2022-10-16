export interface IMetrics {
  cpu?: number;
  ram?: number;
  diskSpaceUsage?: number;
  networkReceived?: number;
  networkTransmitted?: number;
}

export interface IMetricsCurrentForm {
  merchantId?: string;
  domainId?: string;
  serverIp?: string;
}
export interface IMetricsDetailForm extends IMetricsCurrentForm {
  startTime?: string;
  endTime?: string;
}
interface IDataChartItem {
  key: string;
  value: number;
}
export interface IDataChart {
  step: number;
  cpu: IDataChartItem[];
  ram: IDataChartItem[];
  diskSpaceUsage: IDataChartItem[];
  networkReceived?: IDataChartItem[];
  networkTransmitted?: IDataChartItem[];
}
