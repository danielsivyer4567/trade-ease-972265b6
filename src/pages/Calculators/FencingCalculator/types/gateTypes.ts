
export type GateType = 
  | "1.2m x 1m Single Gate"
  | "1.5m x 1m Single Gate"
  | "1.8m x 1m Single Gate"
  | "2.1m x 1m Single Gate"
  | "1.2m x 1.5m Double Gate"
  | "1.5m x 1.5m Double Gate"
  | "1.8m x 1.5m Double Gate"
  | "2.1m x 1.5m Double Gate";

export interface GateRequirements {
  palings: number;
  adjustableGateStile: number;
  nailHardend32mm: number;
  hardwoodPostHeight: string;
  hardwoodPostQty: number;
  rapidSet30kg: number;
  rapidSet20kg: number;
  hinges: number;
  dLatch: number;
  dropBolts: number;
  screws: number;
}
