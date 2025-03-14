
import { GateType, GateRequirements } from "../types/gateTypes";

// Gate materials requirements based on gate type
export const GATE_MATERIALS: Record<GateType, GateRequirements> = {
  "1.2m x 1m Single Gate": {
    palings: 10,
    adjustableGateStile: 1,
    nailHardend32mm: 50,
    hardwoodPostHeight: "1800mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 0,
    screws: 0
  },
  "1.5m x 1m Single Gate": {
    palings: 10,
    adjustableGateStile: 1,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2100mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 0,
    screws: 0
  },
  "1.8m x 1m Single Gate": {
    palings: 0,
    adjustableGateStile: 1,
    nailHardend32mm: 0,
    hardwoodPostHeight: "2400mm",
    hardwoodPostQty: 0,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 0,
    dropBolts: 0,
    screws: 0
  },
  "2.1m x 1m Single Gate": {
    palings: 10,
    adjustableGateStile: 1,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2700mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 0,
    screws: 0
  },
  "1.2m x 1.5m Double Gate": {
    palings: 30,
    adjustableGateStile: 2,
    nailHardend32mm: 50,
    hardwoodPostHeight: "1800mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 1,
    screws: 0
  },
  "1.5m x 1.5m Double Gate": {
    palings: 30,
    adjustableGateStile: 2,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2100mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 1,
    screws: 0
  },
  "1.8m x 1.5m Double Gate": {
    palings: 30,
    adjustableGateStile: 2,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2400mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 2,
    dLatch: 1,
    dropBolts: 1,
    screws: 10
  },
  "2.1m x 1.5m Double Gate": {
    palings: 30,
    adjustableGateStile: 2,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2700mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 1,
    screws: 0
  }
};
