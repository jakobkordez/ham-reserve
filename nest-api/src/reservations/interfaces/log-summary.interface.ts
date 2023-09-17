export interface LogSummary {
  qso_count: number;
  bands: string[];
  modes: string[];
  first_qso_time: Date;
  last_qso_time: Date;
  warnings?: string[];
}
