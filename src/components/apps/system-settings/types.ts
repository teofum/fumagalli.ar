export type SystemSettings = {
  taskbarPosition: 'top' | 'bottom';
  imageQuality: number;
  imageSize: number;
};

export const defaultSystemSettings: SystemSettings = {
  taskbarPosition: 'bottom',
  imageQuality: 80,
  imageSize: 2000,
};
