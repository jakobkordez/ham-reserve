export enum Band {
  b160m = '160m',
  b80m = '80m',
  b40m = '40m',
  b30m = '30m',
  b20m = '20m',
  b17m = '17m',
  b15m = '15m',
  b12m = '12m',
  b10m = '10m',
  b6m = '6m',
  b4m = '4m',
  b2m = '2m',
}

export const hfBands = [
  Band.b160m,
  Band.b80m,
  Band.b40m,
  Band.b20m,
  Band.b15m,
  Band.b10m,
];

export const warcBands = [Band.b30m, Band.b17m, Band.b12m];

export const vhfBands = [Band.b6m, Band.b4m, Band.b2m];
