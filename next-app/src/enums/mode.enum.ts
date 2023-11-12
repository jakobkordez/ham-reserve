export enum Mode {
  CW = 'CW',
  SSB = 'SSB',
  FM = 'FM',
  AM = 'AM',
  FT8 = 'FT8',
  FT4 = 'FT4',
  RTTY = 'RTTY',
  PSK = 'PSK',
  SSTV = 'SSTV',
}

export const COMMON_MODES = [Mode.CW, Mode.SSB, Mode.FM, Mode.FT8];
