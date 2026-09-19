import { EquipmentRecord } from '../types';

export const EQUIPMENT_DATA: EquipmentRecord[] = [
  {
    mine_id: 'MOIL_BALAGHAT',
    equipment_id: 'EXC_01',
    equipment_type: 'Excavator',
    date: '2026-09-19',
    scheduled_hours: 20.0,
    downtime_hours: 8.5,
    operating_hours: 11.5,
    failure_events: 1,
    maintenance_reason: 'Main hydraulic cylinder seal leak & line pressure drop',
    status: 'Degraded'
  },
  {
    mine_id: 'MOIL_BALAGHAT',
    equipment_id: 'TRK_07',
    equipment_type: 'Haul Truck',
    date: '2026-09-19',
    scheduled_hours: 18.0,
    downtime_hours: 10.0,
    operating_hours: 8.0,
    failure_events: 2,
    maintenance_reason: 'Retarder brake temperature sensor fault and wear limit',
    status: 'Critical Downtime'
  },
  {
    mine_id: 'MOIL_BALAGHAT',
    equipment_id: 'DRL_02',
    equipment_type: 'Drill Rig',
    date: '2026-09-19',
    scheduled_hours: 16.0,
    downtime_hours: 4.5,
    operating_hours: 11.5,
    failure_events: 1,
    maintenance_reason: 'Drill-head tungsten bit replacement and mast alignment',
    status: 'Operational'
  },
  {
    mine_id: 'MOIL_BALAGHAT',
    equipment_id: 'TRK_12',
    equipment_type: 'Haul Truck',
    date: '2026-09-19',
    scheduled_hours: 18.0,
    downtime_hours: 2.0,
    operating_hours: 16.0,
    failure_events: 0,
    maintenance_reason: 'Scheduled 250-hour lubrication inspection',
    status: 'Operational'
  },
  {
    mine_id: 'MOIL_BALAGHAT',
    equipment_id: 'WLD_04',
    equipment_type: 'Wheel Loader',
    date: '2026-09-19',
    scheduled_hours: 16.0,
    downtime_hours: 5.0,
    operating_hours: 11.0,
    failure_events: 1,
    maintenance_reason: 'Transmission fluid overheat under continuous grade climb',
    status: 'Degraded'
  },
  {
    mine_id: 'MOIL_BALAGHAT',
    equipment_id: 'CRU_01',
    equipment_type: 'Crusher',
    date: '2026-09-19',
    scheduled_hours: 22.0,
    downtime_hours: 4.0,
    operating_hours: 18.0,
    failure_events: 0,
    maintenance_reason: 'Jaw liner gap calibration and grease pack',
    status: 'Operational'
  }
];
