import { CorrectiveAction } from '../types';

export const INITIAL_ACTIONS: CorrectiveAction[] = [
  {
    id: 'ACT-2026-089',
    title: 'Redeploy available haul capacity (TRK-07 & TRK-12) to Block B',
    category: 'Equipment',
    urgency: 'Immediate',
    recommended_action: 'Reallocate 2x 35-tonne haul trucks from Waste Dump 3 to Pit 2 / Block B ramp to eliminate loading shovel idle time.',
    constraint_detected: 'Current haul capacity is constraining forecast production by 12.8%.',
    root_cause: 'TRK-07 brake thermal cycle limits reduced effective fleet cycle rate while EXC-01 shovel idle time reached 3.2 hours/shift.',
    estimated_impact_tonnes: '+8–12 kt',
    impact_val_kt: 10.0,
    status: 'Pending',
    model_version: 'GeoProd-Prescriptive v1.2',
    created_at: '19 Sep 2026, 06:00 IST'
  },
  {
    id: 'ACT-2026-090',
    title: 'Preemptive hydraulic overhaul on Excavator EXC-01 during shift handover',
    category: 'Equipment',
    urgency: 'High',
    recommended_action: 'Replace main hydraulic cylinder seals and flush return filters during the 14:00–16:00 maintenance window.',
    constraint_detected: 'Hydraulic pressure drop of 18 bar detected, predicting catastrophic breakdown within 36 hours.',
    root_cause: 'Seal wear degradation under continuous heavy digging in silica-rich Sausar formation.',
    estimated_impact_tonnes: '+5–7 kt',
    impact_val_kt: 6.0,
    status: 'Pending',
    model_version: 'GeoProd-Prescriptive v1.2',
    created_at: '19 Sep 2026, 07:30 IST'
  },
  {
    id: 'ACT-2026-091',
    title: 'Advance blasting window for Panel 4B prior to IMD heavy rainfall alert',
    category: 'Blasting',
    urgency: 'High',
    recommended_action: 'Advance 120-hole blast from 22 Sep to 20 Sep 05:30 IST before 35mm precipitation event.',
    constraint_detected: 'Forecast weather indicates heavy rain causing wet-hole loading delays and pit bench flooding.',
    root_cause: 'Monsoon depression over Balaghat belt threatens 3-day access suspension to lower benches.',
    estimated_impact_tonnes: '+4–6 kt',
    impact_val_kt: 5.0,
    status: 'Pending',
    model_version: 'GeoProd-Prescriptive v1.2',
    created_at: '19 Sep 2026, 08:15 IST'
  },
  {
    id: 'ACT-2026-092',
    title: 'Prioritize extraction from high-grade stope G001 (Level 8)',
    category: 'Ore Access',
    urgency: 'Medium',
    recommended_action: 'Shift primary mucking crews to Mansar horizon Stope 8 (observed assay 38.6% Mn).',
    constraint_detected: 'Run-of-mine Mn grade declined to 42.6% against target 44.5%.',
    root_cause: 'Dilution from footwall contact zone schist over last 4 shifts.',
    estimated_impact_tonnes: '+3–5 kt',
    impact_val_kt: 4.0,
    status: 'Pending',
    model_version: 'GeoProspect-MinePlan v0.4',
    created_at: '19 Sep 2026, 09:00 IST'
  }
];
