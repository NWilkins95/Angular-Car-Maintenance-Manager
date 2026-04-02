import { Record } from './record.model';

export const MOCKRECORDS: Record[] = [
  {
    id: '1',
    vehicleId: '1',
    date: '2026-01-12',
    serviceType: 'Oil Change',
    description: 'Replaced oil and filter',
    mileage: '62000',
    cost: '59.99'
  },
  {
    id: '2',
    vehicleId: '1',
    date: '2026-02-03',
    serviceType: 'Tire Rotation',
    description: 'Rotated all four tires',
    mileage: '63500',
    cost: '34.95'
  },
  {
    id: '3',
    vehicleId: '2',
    date: '2026-01-22',
    serviceType: 'Brake Service',
    description: 'Replaced front brake pads',
    mileage: '38000',
    cost: '249.00'
  },
  {
    id: '4',
    vehicleId: '3',
    date: '2026-03-01',
    serviceType: 'Battery',
    description: 'Installed new battery',
    mileage: '47000',
    cost: '169.50'
  }
];