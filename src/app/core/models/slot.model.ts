export interface Slot {
  _id?: string;

  startTime: string;
  endTime: string;

  duration: 15 | 20;

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}