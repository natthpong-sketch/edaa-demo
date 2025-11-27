export enum RequestType {
  UPDATE = 'UPDATE',
  DISPOSAL = 'DISPOSAL'
}

export interface AssetItem {
  assetType: string;
  mainAssetId: string;
  subAssetId: string;
  assetName: string;
}

export interface AssetFormData {
  requesterName: string;
  department: string;
  position: string;
  
  // Changed from single fields to list or attachment mode
  items: AssetItem[]; 
  isAttachmentMode: boolean;

  requestType: RequestType;
  reason: string;
  additionalNote?: string;
  headOfDepartment?: string;
  headOfUnit?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
}