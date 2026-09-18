export type PageId =
  | 'dashboard'
  | 'sotuvlar'
  | 'mijozlar'
  | 'qongiroqlar'
  | 'ombor'
  | 'moliya'
  | 'ishlab_chiqarish'
  | 'stanoklar'
  | 'chiqindilar'
  | 'hisobotlar'
  | 'sozlamalar';

export type SaleStatus =
  | 'Yangi'
  | 'Tasdiqlangan'
  | 'Ishlab chiqarishda'
  | 'Tayyor'
  | 'Yetkazib berildi'
  | 'Yakunlangan'
  | 'Bekor qilingan';

export type PaymentStatus =
  | 'To‘langan'
  | 'Qisman to‘langan'
  | 'To‘lanmagan';

export interface SaleOrder {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: SaleStatus;
  paymentStatus: PaymentStatus;
  date: string;
  deliveryDate?: string;
  notes?: string;
  productionOrderId?: string;
}

export interface ClientInteraction {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'call' | 'offer' | 'contract' | 'meeting' | 'note';
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  inn: string;
  lastOrderDate: string;
  totalSales: number;
  debt: number;
  interactions: ClientInteraction[];
  notes?: string;
}

export interface CallRecord {
  id: string;
  date: string;
  time: string;
  clientName: string;
  phone: string;
  operator: string;
  duration: string;
  durationSeconds: number;
  type: 'Kiruvchi' | 'Chiquvchi';
  status: 'Qabul qilindi' | 'Javobsiz' | 'Band' | 'Buyurtma olindi';
  notes: string;
  audioDuration: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  pricePerUnit: number;
  category: string;
  location: string;
}

export interface FinishedProduct {
  id: string;
  name: string;
  height: string; // '6m', '8m', '9m', '10m', '12m'
  diameter: string;
  stock: number;
  minStock: number;
  price: number;
  status: 'Mavjud' | 'Kam qoldiq' | 'Buyurtmada';
}

export type WarehouseMovementType = 'Kirim' | 'Chiqim';

export interface WarehouseMovement {
  id: string;
  date: string;
  type: WarehouseMovementType;
  productName: string;
  quantity: number;
  unit: string;
  supplierOrDestination: string; // Yetkazib beruvchi or Qayerga
  reason?: string;
  price?: number;
  totalValue?: number;
  notes?: string;
}

export type ProductionStatus =
  | 'Rejalashtirilgan'
  | 'Jarayonda'
  | 'To‘xtatilgan'
  | 'Tayyor'
  | 'Yakunlangan';

export type ProductionStage =
  | 'Xomashyo'
  | 'Kesish'
  | 'Payvandlash'
  | 'Tozalash'
  | 'Bo‘yash'
  | 'Quritish'
  | 'Sifat nazorati'
  | 'Tayyor mahsulot';

export const PRODUCTION_STAGES_LIST: ProductionStage[] = [
  'Xomashyo',
  'Kesish',
  'Payvandlash',
  'Tozalash',
  'Bo‘yash',
  'Quritish',
  'Sifat nazorati',
  'Tayyor mahsulot'
];

export interface ProductionOrder {
  id: string;
  code: string; // e.g. OP-001
  productName: string;
  targetQuantity: number;
  completedQuantity: number;
  startDate: string;
  endDate: string;
  deadline?: string;
  responsible: string;
  foreman?: string;
  machineId: string;
  machineName: string;
  currentStage: ProductionStage;
  status: ProductionStatus;
  notes?: string;
  relatedSaleNumber?: string;
}

export type MachineStatus =
  | 'Ishlayapti'
  | 'To‘xtab turibdi'
  | 'Ta’mirda'
  | 'Ishlamoqda'
  | 'Bo‘sh'
  | 'To‘xtagan';

export interface Machine {
  id: string;
  name: string;
  inventoryNumber: string;
  status: MachineStatus;
  operator: string;
  model?: string;
  productionType?: string;
  todayWorkload?: string;
  todayProduction?: string;
  efficiency?: number;
  description?: string;
  specifications?: string;
  produces?: string;
  usedForProducts?: string;
  workHours?: number;
  runningHours?: string;
  lastInspection?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

export type TransactionType = 'Tushum' | 'Xarajat';
export type PaymentMethod = 'Naqd' | 'Karta' | 'Bank' | 'Kassa';

export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  party: string; // Kimdan / Kimga
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
}

// Alias for compatibility
export type FinanceRecord = {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  partner: string;
  paymentMethod: 'Bank' | 'Kassa' | 'Naqd';
  date: string;
  notes?: string;
};

export type ScrapStatus = 'Saqlanmoqda' | 'Qayta ishlanadi' | 'Utilizatsiya qilindi' | 'Omborda' | 'Sotildi' | 'Qayta ishlashga yuborildi';

export interface ScrapRecord {
  id: string;
  date: string;
  scrapType: string;
  quantity: number;
  unit: string;
  reason?: string;
  status: ScrapStatus;
  notes?: string;
}

export type WasteStatus = 'Omborda' | 'Sotildi' | 'Qayta ishlashga yuborildi';

export interface WasteRecord {
  id: string;
  type: string;
  quantity: number;
  unit: string;
  sourceStage: string;
  date: string;
  status: WasteStatus;
  notes?: string;
}

