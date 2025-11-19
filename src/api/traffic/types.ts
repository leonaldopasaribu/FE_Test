export interface Traffic {
  id: number;
  IdCabang: number;
  IdGerbang: number;
  Tanggal: string;
  Shift: number;
  IdGardu: number;
  Golongan: number;
  IdAsalGerbang: number;
  Tunai: number;
  DinasOpr: number;
  DinasMitra: number;
  DinasKary: number;
  eMandiri: number;
  eBri: number;
  eBni: number;
  eBca: number;
  eNobu: number;
  eDKI: number;
  eMega: number;
  eFlo: number;
}

export interface TrafficResponse {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: Traffic[];
    };
  };
}

export interface GroupedTrafficRow {
  IdCabang: number;
  IdGerbang: number;
  IdGardu: number;
  Tanggal: string;
  Shift: number;
  IdAsalGerbang: number;
  metodePembayaran: string;
  gol1: number;
  gol2: number;
  gol3: number;
  gol4: number;
  gol5: number;
  totalLalin: number;
}
