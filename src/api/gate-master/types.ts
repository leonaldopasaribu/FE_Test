export interface GateMaster {
  id: number;
  IdCabang: number;
  IdGerbang?: string;
  NamaGerbang: string;
  NamaCabang: string;
}

export interface GateMasterResponse {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: GateMaster[];
    };
  };
}

export interface GateMasterCreateRequest {
  id: number;
  IdCabang: number;
  NamaCabang: string;
  NamaGerbang: string;
}

export interface GateMasterUpdateRequest {
  id: number;
  IdCabang: number;
  NamaCabang: string;
  NamaGerbang: string;
}
