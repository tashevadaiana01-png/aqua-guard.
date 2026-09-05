/**
 * Types and interfaces for the Taldykol Eco-Platform simulation prototype
 */

export interface SimulationMetrics {
  dissolvedOxygen: number; // in mg/L (O2)
  bod: number; // Biochemical Oxygen Demand in mg/L (БПК)
  waterClarity: number; // percentage 0-100%
  nitrogenAbsorption: number; // percentage 0-100%
  phosphorusAbsorption: number; // percentage 0-100%
}

export interface SimulationState {
  isRunning: boolean;
  aeratorActive: boolean;
  intensity: number; // 0 to 100%
  elapsedSeconds: number; // simulated cycle duration
  metrics: SimulationMetrics;
  selectedHotspot: HotspotId | null;
}

export type HotspotId = 'cattails' | 'aerator' | 'roots' | 'intake' | 'sensors';

export interface HotspotInfo {
  id: HotspotId;
  title: string;
  badge: string;
  description: string;
  role: string;
  scientificBenefit: string;
  coordinates: { x: number; y: number }; // percentage inside simulation stage
}

export interface SchemeStep {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  badge: string;
}
