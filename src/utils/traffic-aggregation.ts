import type { Traffic } from '../api/traffic/types';

export interface PaymentMethodData {
  method: string;
  count: number;
}

export interface GateData {
  gateName: string;
  gateId: number;
  count: number;
}

export interface ShiftData {
  shift: string;
  count: number;
  percentage: number;
}

export interface BranchData {
  branchName: string;
  branchId: number;
  count: number;
  percentage: number;
}

export class TrafficAggregationUtil {
  private static readonly PAYMENT_METHODS = [
    { key: 'eBca', label: 'BCA' },
    { key: 'eBri', label: 'BRI' },
    { key: 'eBni', label: 'BNI' },
    { key: 'eDKI', label: 'DKI' },
    { key: 'eMandiri', label: 'Mandiri' },
    { key: 'eFlo', label: 'Flo' },
    { key: 'DinasKary', label: 'KTP' },
  ];

  static aggregatePaymentMethods(traffic: Traffic[]): PaymentMethodData[] {
    const aggregated = this.PAYMENT_METHODS.map(({ key, label }) => {
      const count = traffic.reduce((sum, item) => {
        return sum + ((item as any)[key] || 0);
      }, 0);
      return { method: label, count };
    });

    return aggregated.sort((a, b) => b.count - a.count);
  }

  static aggregateByGate(traffic: Traffic[]): GateData[] {
    const gateMap = new Map<number, number>();

    traffic.forEach((item) => {
      const current = gateMap.get(item.IdGerbang) || 0;
      const total =
        item.eBca +
        item.eBri +
        item.eBni +
        item.eDKI +
        item.eMandiri +
        item.eFlo +
        item.DinasKary +
        item.Tunai +
        item.DinasOpr +
        item.DinasMitra;
      gateMap.set(item.IdGerbang, current + total);
    });

    const result: GateData[] = [];
    gateMap.forEach((count, gateId) => {
      result.push({
        gateName: `Gerbang ${gateId}`,
        gateId,
        count,
      });
    });

    return result.sort((a, b) => b.count - a.count);
  }

  static aggregateByShift(traffic: Traffic[]): ShiftData[] {
    const shiftMap = new Map<number, number>();

    traffic.forEach((item) => {
      const current = shiftMap.get(item.Shift) || 0;
      const total =
        item.eBca +
        item.eBri +
        item.eBni +
        item.eDKI +
        item.eMandiri +
        item.eFlo +
        item.DinasKary +
        item.Tunai +
        item.DinasOpr +
        item.DinasMitra;
      shiftMap.set(item.Shift, current + total);
    });

    const totalCount = Array.from(shiftMap.values()).reduce(
      (sum, val) => sum + val,
      0
    );

    const result: ShiftData[] = [];
    shiftMap.forEach((count, shift) => {
      result.push({
        shift: `Shift ${shift}`,
        count,
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
      });
    });

    return result.sort((a, b) => {
      const shiftA = parseInt(a.shift.replace('Shift ', ''));
      const shiftB = parseInt(b.shift.replace('Shift ', ''));
      return shiftA - shiftB;
    });
  }

  static aggregateByBranch(traffic: Traffic[]): BranchData[] {
    const branchMap = new Map<number, number>();

    traffic.forEach((item) => {
      const current = branchMap.get(item.IdCabang) || 0;
      const total =
        item.eBca +
        item.eBri +
        item.eBni +
        item.eDKI +
        item.eMandiri +
        item.eFlo +
        item.DinasKary +
        item.Tunai +
        item.DinasOpr +
        item.DinasMitra;
      branchMap.set(item.IdCabang, current + total);
    });

    const totalCount = Array.from(branchMap.values()).reduce(
      (sum, val) => sum + val,
      0
    );

    const result: BranchData[] = [];
    branchMap.forEach((count, branchId) => {
      result.push({
        branchName: `Ruas ${branchId}`,
        branchId,
        count,
        percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
      });
    });

    return result.sort((a, b) => b.count - a.count);
  }
}
