import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  PageId,
  SaleOrder,
  SaleStatus,
  PaymentStatus,
  Client,
  RawMaterial,
  FinishedProduct,
  WarehouseMovement,
  ProductionOrder,
  ProductionStage,
  PRODUCTION_STAGES_LIST,
  ProductionStatus,
  Machine,
  MachineStatus,
  FinanceTransaction,
  FinanceRecord,
  CallRecord,
  ScrapRecord,
  WasteRecord,
  WasteStatus,
  InvoiceStatus,
  InvoiceRegistryItem,
  PaymentType
} from '../types';
import {
  INITIAL_SALES,
  INITIAL_CLIENTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_FINISHED_PRODUCTS,
  INITIAL_WAREHOUSE_MOVEMENTS,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_MACHINES,
  INITIAL_TRANSACTIONS,
  INITIAL_CALLS,
  INITIAL_SCRAP_RECORDS,
  INITIAL_INVOICE_REGISTRY
} from '../data/initialData';

interface AppContextType {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedSaleId: string | null;
  setSelectedSaleId: (id: string | null) => void;
  selectedMachineId: string | null;
  setSelectedMachineId: (id: string | null) => void;
  activeAudioCall: CallRecord | null;
  setActiveAudioCall: (call: CallRecord | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Data collections
  sales: SaleOrder[];
  clients: Client[];
  rawMaterials: RawMaterial[];
  finishedProducts: FinishedProduct[];
  warehouseMovements: WarehouseMovement[];
  productionOrders: ProductionOrder[];
  machines: Machine[];
  transactions: FinanceTransaction[];
  calls: CallRecord[];
  scraps: ScrapRecord[];
  invoices: InvoiceRegistryItem[];

  // Mutations
  addSale: (sale: {
    clientId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }) => void;
  updateSaleStatus: (id: string, status: SaleStatus, paymentStatus?: PaymentStatus) => void;
  addClient: (clientData: {
    companyName: string;
    contactPerson: string;
    phone: string;
    email?: string;
    city: string;
    address?: string;
    inn?: string;
    notes?: string;
  }) => void;
  addWarehouseMovement: (movement: {
    type: 'Kirim' | 'Chiqim';
    productName: string;
    quantity: number;
    unit: string;
    supplierOrDestination: string;
    reason?: string;
    price?: number;
    notes?: string;
  }) => void;
  addProductionOrder: (order: {
    productName: string;
    targetQuantity: number;
    startDate?: string;
    endDate?: string;
    deadline?: string;
    responsible?: string;
    foreman?: string;
    machineId?: string;
    machineName?: string;
    notes?: string;
  }) => void;
  productionStagesList: ProductionStage[];
  advanceProductionStage: (id: string) => void;
  updateProductionStage: (id: string, stage: ProductionStage, completedQty?: number) => void;
  updateProductionStatus: (id: string, status: ProductionStatus) => void;
  addTransaction: (tx: {
    type: 'Tushum' | 'Xarajat';
    category: string;
    amount: number;
    party: string;
    paymentMethod: 'Naqd' | 'Karta' | 'Bank';
    notes?: string;
  }) => void;
  addScrap: (scrap: {
    scrapType: ScrapRecord['scrapType'];
    quantity: number;
    unit: string;
    reason: string;
    status: ScrapRecord['status'];
    notes?: string;
  }) => void;
  updateMachineStatus: (id: string, status: MachineStatus) => void;
  addCallRecord: (call: {
    clientName: string;
    phone: string;
    operator: string;
    type: 'Kiruvchi' | 'Chiquvchi';
    status: CallRecord['status'];
    notes: string;
    duration?: string;
  }) => void;
  resetAllData: () => void;
  resetToDefaultData: () => void;

  // Hisob-fakturalarni kelishish reyestri
  addInvoiceItem: (item: Omit<InvoiceRegistryItem, 'id'>) => void;
  updateInvoiceAccountantData: (id: string, updates: Partial<InvoiceRegistryItem>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deductInvoiceFromWarehouse: (id: string) => void;
  unalignedInvoicesCount: number;

  // Additional aliases
  finances: FinanceRecord[];
  addFinanceRecord: (record: {
    type: 'Tushum' | 'Xarajat';
    category: string;
    amount: number;
    paymentMethod: 'Bank' | 'Kassa';
    partner: string;
    notes?: string;
  }) => void;
  cashBalance: number;
  totalBalance: number;
  wasteRecords: WasteRecord[];
  addWasteRecord: (waste: {
    type: string;
    quantity: number;
    unit: string;
    sourceStage: string;
    status: WasteStatus;
    notes?: string;
  }) => void;

  // Computed totals
  todaySalesAmount: number;
  todayIncomeAmount: number;
  finishedProductsStockCount: number;
  activeProductionOrdersCount: number;
  openOrdersCount: number;
  todayExpensesAmount: number;
  kassaBalance: number;
  bankBalance: number;
  totalCashBalance: number;
}

const STORAGE_KEY_PREFIX = 'MEP_ERP_DEMO_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [activeAudioCall, setActiveAudioCall] = useState<CallRecord | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Entities
  const [sales, setSales] = useState<SaleOrder[]>(() => loadFromStorage('sales', INITIAL_SALES));
  const [clients, setClients] = useState<Client[]>(() => loadFromStorage('clients', INITIAL_CLIENTS));
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() =>
    loadFromStorage('rawMaterials', INITIAL_RAW_MATERIALS)
  );
  const [finishedProducts, setFinishedProducts] = useState<FinishedProduct[]>(() =>
    loadFromStorage('finishedProducts', INITIAL_FINISHED_PRODUCTS)
  );
  const [warehouseMovements, setWarehouseMovements] = useState<WarehouseMovement[]>(() =>
    loadFromStorage('warehouseMovements', INITIAL_WAREHOUSE_MOVEMENTS)
  );
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() =>
    loadFromStorage('productionOrders', INITIAL_PRODUCTION_ORDERS)
  );
  const [machines, setMachines] = useState<Machine[]>(() => loadFromStorage('machines', INITIAL_MACHINES));
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() =>
    loadFromStorage('transactions', INITIAL_TRANSACTIONS)
  );
  const [calls, setCalls] = useState<CallRecord[]>(() => loadFromStorage('calls', INITIAL_CALLS));
  const [scraps, setScraps] = useState<ScrapRecord[]>(() => loadFromStorage('scraps', INITIAL_SCRAP_RECORDS));
  const [invoices, setInvoices] = useState<InvoiceRegistryItem[]>(() =>
    loadFromStorage('invoices', INITIAL_INVOICE_REGISTRY)
  );

  // Sync to localStorage
  useEffect(() => {
    saveToStorage('sales', sales);
  }, [sales]);
  useEffect(() => {
    saveToStorage('invoices', invoices);
  }, [invoices]);
  useEffect(() => {
    saveToStorage('clients', clients);
  }, [clients]);
  useEffect(() => {
    saveToStorage('rawMaterials', rawMaterials);
  }, [rawMaterials]);
  useEffect(() => {
    saveToStorage('finishedProducts', finishedProducts);
  }, [finishedProducts]);
  useEffect(() => {
    saveToStorage('warehouseMovements', warehouseMovements);
  }, [warehouseMovements]);
  useEffect(() => {
    saveToStorage('productionOrders', productionOrders);
  }, [productionOrders]);
  useEffect(() => {
    saveToStorage('machines', machines);
  }, [machines]);
  useEffect(() => {
    saveToStorage('transactions', transactions);
  }, [transactions]);
  useEffect(() => {
    saveToStorage('calls', calls);
  }, [calls]);
  useEffect(() => {
    saveToStorage('scraps', scraps);
  }, [scraps]);

  // Actions
  const addSale = (saleData: {
    clientId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }) => {
    const client = clients.find(c => c.id === saleData.clientId);
    const clientName = client ? client.companyName : 'Noma’lum mijoz';
    const totalAmount = saleData.quantity * saleData.unitPrice;
    const nextNumber = 1024 + sales.length;
    const orderNumber = `SO-${nextNumber}`;
    const newSaleId = `so-${Date.now()}`;

    const newSale: SaleOrder = {
      id: newSaleId,
      orderNumber,
      clientId: saleData.clientId,
      clientName,
      productName: saleData.productName,
      quantity: saleData.quantity,
      unitPrice: saleData.unitPrice,
      totalAmount,
      status: 'Yangi',
      paymentStatus: 'To‘lanmagan',
      date: new Date().toISOString().split('T')[0],
      notes: saleData.notes
    };

    setSales(prev => [newSale, ...prev]);

    // Update client totalSales
    setClients(prev =>
      prev.map(c => {
        if (c.id === saleData.clientId) {
          return {
            ...c,
            lastOrderDate: newSale.date,
            totalSales: c.totalSales + totalAmount,
            debt: c.debt + totalAmount,
            interactions: [
              {
                id: `int-${Date.now()}`,
                date: newSale.date,
                title: 'Yangi buyurtma qabul qilindi',
                description: `${orderNumber}: ${saleData.productName} (${saleData.quantity} dona).`,
                type: 'offer'
              },
              ...c.interactions
            ]
          };
        }
        return c;
      })
    );
  };

  const updateSaleStatus = (id: string, status: SaleStatus, paymentStatus?: PaymentStatus) => {
    setSales(prev =>
      prev.map(s => {
        if (s.id === id) {
          const updated = { ...s, status };
          if (paymentStatus) {
            updated.paymentStatus = paymentStatus;
          }
          return updated;
        }
        return s;
      })
    );
  };

  const addClient = (clientData: {
    companyName: string;
    contactPerson: string;
    phone: string;
    email?: string;
    city: string;
    address?: string;
    inn?: string;
    notes?: string;
  }) => {
    const newClient: Client = {
      id: `cli-${Date.now()}`,
      companyName: clientData.companyName,
      contactPerson: clientData.contactPerson,
      phone: clientData.phone,
      email: clientData.email || 'info@mep-construction.uz',
      city: clientData.city,
      address: clientData.address || 'O‘zbekiston',
      inn: clientData.inn || `${Math.floor(100000000 + Math.random() * 900000000)}`,
      lastOrderDate: 'Yangi mijoz',
      totalSales: 0,
      debt: 0,
      notes: clientData.notes,
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          title: 'Mijoz tizimga kiritildi',
          description: 'Mijoz profili yaratildi va dastlabki ma’lumotlar to‘ldirildi.',
          type: 'meeting'
        }
      ]
    };
    setClients(prev => [newClient, ...prev]);
  };

  const addWarehouseMovement = (movement: {
    type: 'Kirim' | 'Chiqim';
    productName: string;
    quantity: number;
    unit: string;
    supplierOrDestination: string;
    reason?: string;
    price?: number;
    notes?: string;
  }) => {
    const newMovement: WarehouseMovement = {
      id: `wm-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: movement.type,
      productName: movement.productName,
      quantity: movement.quantity,
      unit: movement.unit,
      supplierOrDestination: movement.supplierOrDestination,
      reason: movement.reason,
      price: movement.price,
      totalValue: movement.price ? movement.price * movement.quantity : undefined,
      notes: movement.notes
    };

    setWarehouseMovements(prev => [newMovement, ...prev]);

    // Update raw materials stock if matched
    setRawMaterials(prev =>
      prev.map(rm => {
        if (rm.name.toLowerCase().includes(movement.productName.toLowerCase()) ||
            movement.productName.toLowerCase().includes(rm.name.toLowerCase())) {
          const delta = movement.type === 'Kirim' ? movement.quantity : -movement.quantity;
          return {
            ...rm,
            currentStock: Math.max(0, rm.currentStock + delta)
          };
        }
        return rm;
      })
    );

    // Update finished products stock if matched
    setFinishedProducts(prev =>
      prev.map(fp => {
        if (fp.name.toLowerCase().includes(movement.productName.toLowerCase()) ||
            movement.productName.toLowerCase().includes(fp.name.toLowerCase())) {
          const delta = movement.type === 'Kirim' ? movement.quantity : -movement.quantity;
          const newStock = Math.max(0, fp.stock + delta);
          return {
            ...fp,
            stock: newStock,
            status: newStock < fp.minStock ? 'Kam qoldiq' : 'Mavjud'
          };
        }
        return fp;
      })
    );
  };

  const addProductionOrder = (order: {
    productName: string;
    targetQuantity: number;
    startDate?: string;
    endDate?: string;
    deadline?: string;
    responsible?: string;
    foreman?: string;
    machineId?: string;
    machineName?: string;
    notes?: string;
  }) => {
    const resp = order.foreman || order.responsible || 'Sobir Tursunov';
    const end = order.deadline || order.endDate || '2026-09-30';
    const start = order.startDate || new Date().toISOString().split('T')[0];
    const mId = order.machineId || machines[0]?.id || 'mac-1';
    const machine = machines.find(m => m.id === mId);
    const mName = order.machineName || (machine ? machine.name : 'Lazer kesish stanogi');
    const code = `OP-00${productionOrders.length + 1}`;

    const newOrder: ProductionOrder = {
      id: `po-${Date.now()}`,
      code,
      productName: order.productName,
      targetQuantity: order.targetQuantity,
      completedQuantity: 0,
      startDate: start,
      endDate: end,
      deadline: end,
      responsible: resp,
      foreman: resp,
      machineId: mId,
      machineName: mName,
      currentStage: 'Kesish',
      status: 'Jarayonda',
      notes: order.notes || 'Sex konveyeriga yangi buyurtma kiritildi'
    };

    setProductionOrders(prev => [newOrder, ...prev]);
  };

  const advanceProductionStage = (id: string) => {
    setProductionOrders(prev =>
      prev.map(po => {
        if (po.id !== id) return po;
        const currentIdx = PRODUCTION_STAGES_LIST.indexOf(po.currentStage);
        const nextIdx = currentIdx >= 0 ? Math.min(PRODUCTION_STAGES_LIST.length - 1, currentIdx + 1) : 1;
        const nextStage = PRODUCTION_STAGES_LIST[nextIdx];
        const isDone = nextIdx === PRODUCTION_STAGES_LIST.length - 1;
        const newQty = isDone
          ? po.targetQuantity
          : Math.min(po.targetQuantity, Math.round((po.targetQuantity * (nextIdx + 1)) / PRODUCTION_STAGES_LIST.length));

        // If completed, automatically record warehouse movement and finished product entry
        if (isDone && po.status !== 'Tayyor') {
          setTimeout(() => {
            addWarehouseMovement({
              type: 'Kirim',
              productName: po.productName,
              quantity: po.targetQuantity,
              unit: 'dona',
              supplierOrDestination: 'Ishlab chiqarish sexi',
              reason: `${po.code} buyurtma bo‘yicha ishlab chiqarildi`,
              notes: 'Sifat nazorati (OTK) to‘liq tasdiqladi.'
            });
          }, 50);
        }

        return {
          ...po,
          currentStage: nextStage,
          completedQuantity: newQty,
          status: isDone ? 'Tayyor' : 'Jarayonda'
        };
      })
    );
  };

  const updateProductionStage = (id: string, stage: ProductionStage, completedQty?: number) => {
    setProductionOrders(prev =>
      prev.map(po => {
        if (po.id === id) {
          const newQty = completedQty !== undefined ? completedQty : po.completedQuantity;
          const isFinished = stage === 'Tayyor mahsulot' || newQty >= po.targetQuantity;
          return {
            ...po,
            currentStage: stage,
            completedQuantity: newQty,
            status: isFinished ? 'Tayyor' : po.status
          };
        }
        return po;
      })
    );
  };

  const updateProductionStatus = (id: string, status: ProductionStatus) => {
    setProductionOrders(prev =>
      prev.map(po => (po.id === id ? { ...po, status } : po))
    );
  };

  const addTransaction = (tx: {
    type: 'Tushum' | 'Xarajat';
    category: string;
    amount: number;
    party: string;
    paymentMethod: 'Naqd' | 'Karta' | 'Bank';
    notes?: string;
  }) => {
    const newTx: FinanceTransaction = {
      id: `tx-${Date.now()}`,
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      party: tx.party,
      paymentMethod: tx.paymentMethod,
      date: new Date().toISOString().split('T')[0],
      notes: tx.notes
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  const addScrap = (scrap: {
    scrapType: ScrapRecord['scrapType'];
    quantity: number;
    unit: string;
    reason: string;
    status: ScrapRecord['status'];
    notes?: string;
  }) => {
    const newScrap: ScrapRecord = {
      id: `scr-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      scrapType: scrap.scrapType,
      quantity: scrap.quantity,
      unit: scrap.unit,
      reason: scrap.reason,
      status: scrap.status,
      notes: scrap.notes
    };
    setScraps(prev => [newScrap, ...prev]);
  };

  const updateMachineStatus = (id: string, status: MachineStatus) => {
    setMachines(prev =>
      prev.map(m => (m.id === id ? { ...m, status } : m))
    );
  };

  const addCallRecord = (call: {
    clientName: string;
    phone: string;
    operator: string;
    type: 'Kiruvchi' | 'Chiquvchi';
    status: CallRecord['status'];
    notes: string;
    duration?: string;
  }) => {
    const duration = call.duration || '02:45';
    const [min, sec] = duration.split(':').map(Number);
    const durationSeconds = (min || 2) * 60 + (sec || 30);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newCall: CallRecord = {
      id: `call-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      clientName: call.clientName,
      phone: call.phone,
      operator: call.operator,
      duration,
      durationSeconds,
      type: call.type,
      status: call.status,
      notes: call.notes,
      audioDuration: duration
    };

    setCalls(prev => [newCall, ...prev]);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'sales');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'clients');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'rawMaterials');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'finishedProducts');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'warehouseMovements');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'productionOrders');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'machines');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'transactions');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'calls');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'scraps');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'invoices');

    setSales(INITIAL_SALES);
    setClients(INITIAL_CLIENTS);
    setRawMaterials(INITIAL_RAW_MATERIALS);
    setFinishedProducts(INITIAL_FINISHED_PRODUCTS);
    setWarehouseMovements(INITIAL_WAREHOUSE_MOVEMENTS);
    setProductionOrders(INITIAL_PRODUCTION_ORDERS);
    setMachines(INITIAL_MACHINES);
    setTransactions(INITIAL_TRANSACTIONS);
    setCalls(INITIAL_CALLS);
    setScraps(INITIAL_SCRAP_RECORDS);
    setInvoices(INITIAL_INVOICE_REGISTRY);
  };

  // Invoice registry mutations
  const addInvoiceItem = (item: Omit<InvoiceRegistryItem, 'id'>) => {
    const newItem: InvoiceRegistryItem = {
      ...item,
      id: `inv-${Date.now()}`
    };
    setInvoices(prev => [newItem, ...prev]);
  };

  const updateInvoiceAccountantData = (id: string, updates: Partial<InvoiceRegistryItem>) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, ...updates } : inv))
    );
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, status } : inv))
    );
  };

  const deductInvoiceFromWarehouse = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv || inv.warehouseDeducted) return;

    // Mark invoice as deducted
    setInvoices(prev =>
      prev.map(i => (i.id === id ? { ...i, warehouseDeducted: true } : i))
    );

    // Automatically record warehouse movement (Chiqim) for Opora
    const movement: WarehouseMovement = {
      id: `wm-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Chiqim',
      productName: inv.productName,
      quantity: inv.quantity,
      unit: inv.unit || 'dona',
      supplierOrDestination: inv.clientName,
      reason: `${inv.dealNumber} sonli bitim va ${inv.invoiceNumber || 'HF'} hisob-faktura bo‘yicha sotuvga chiqarildi`,
      price: Math.round(inv.dealAmount / (inv.quantity || 1)),
      totalValue: inv.dealAmount,
      notes: `Ombordan hisobdan chiqarildi: ${inv.warehouseDeduction}`
    };

    setWarehouseMovements(prev => [movement, ...prev]);

    // Also deduct finished product stock
    setFinishedProducts(prev =>
      prev.map(fp => {
        const match =
          inv.productName.toLowerCase().includes(fp.name.toLowerCase()) ||
          fp.name.toLowerCase().includes(inv.productName.toLowerCase()) ||
          (inv.productName.toLowerCase().includes('opora') && fp.name.toLowerCase().includes('opora'));
        if (match) {
          const newStock = Math.max(0, fp.stock - inv.quantity);
          return {
            ...fp,
            stock: newStock,
            status: newStock <= 0 ? 'Buyurtmada' : newStock < fp.minStock ? 'Kam qoldiq' : 'Mavjud'
          };
        }
        return fp;
      })
    );
  };

  const unalignedInvoicesCount = useMemo(() => {
    return invoices.filter(inv => {
      const diff = inv.dealAmount - inv.invoiceAmount;
      return inv.status === 'Aniqlashtirish kerak' || (inv.status !== 'Yozilmagan' && diff !== 0) || inv.status === 'Yozilmagan';
    }).length;
  }, [invoices]);

  // Computed Values
  const todaySalesAmount = useMemo(() => {
    return sales
      .filter(s => s.status !== 'Bekor qilingan')
      .slice(0, 3)
      .reduce((sum, s) => sum + s.totalAmount, 0) || 125000000;
  }, [sales]);

  const todayIncomeAmount = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Tushum')
      .reduce((sum, t) => sum + t.amount, 0) || 87500000;
  }, [transactions]);

  const todayExpensesAmount = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Xarajat')
      .reduce((sum, t) => sum + t.amount, 0) || 34200000;
  }, [transactions]);

  const finishedProductsStockCount = useMemo(() => {
    return finishedProducts.reduce((sum, p) => sum + p.stock, 0);
  }, [finishedProducts]);

  const activeProductionOrdersCount = useMemo(() => {
    return productionOrders.filter(p => p.status === 'Jarayonda').length;
  }, [productionOrders]);

  const openOrdersCount = useMemo(() => {
    return sales.filter(s => s.status === 'Yangi' || s.status === 'Tasdiqlangan' || s.status === 'Ishlab chiqarishda').length;
  }, [sales]);

  const kassaBalance = 125450000;
  const bankBalance = 482300000;
  const totalCashBalance = kassaBalance + bankBalance;

  const finances: FinanceRecord[] = useMemo(() => {
    return transactions.map(t => ({
      id: t.id,
      type: t.type,
      category: t.category,
      amount: t.amount,
      partner: t.party,
      paymentMethod: (t.paymentMethod === 'Naqd' ? 'Kassa' : t.paymentMethod) as 'Bank' | 'Kassa' | 'Naqd',
      date: t.date,
      notes: t.notes
    }));
  }, [transactions]);

  const addFinanceRecord = (record: {
    type: 'Tushum' | 'Xarajat';
    category: string;
    amount: number;
    paymentMethod: 'Bank' | 'Kassa';
    partner: string;
    notes?: string;
  }) => {
    addTransaction({
      type: record.type,
      category: record.category,
      amount: record.amount,
      party: record.partner,
      paymentMethod: record.paymentMethod === 'Kassa' ? 'Naqd' : 'Bank',
      notes: record.notes
    });
  };

  const wasteRecords: WasteRecord[] = useMemo(() => {
    return scraps.map(s => ({
      id: s.id,
      type: s.scrapType,
      quantity: s.quantity,
      unit: s.unit,
      sourceStage: s.reason,
      date: s.date,
      status: (s.status === 'Saqlanmoqda' ? 'Omborda' : s.status === 'Utilizatsiya qilindi' ? 'Qayta ishlashga yuborildi' : 'Sotildi') as WasteStatus,
      notes: s.notes
    }));
  }, [scraps]);

  const addWasteRecord = (waste: {
    type: string;
    quantity: number;
    unit: string;
    sourceStage: string;
    status: WasteStatus;
    notes?: string;
  }) => {
    addScrap({
      scrapType: waste.type,
      quantity: waste.quantity,
      unit: waste.unit,
      reason: waste.sourceStage,
      status: waste.status === 'Omborda' ? 'Saqlanmoqda' : waste.status === 'Qayta ishlashga yuborildi' ? 'Utilizatsiya qilindi' : 'Qayta ishlanadi',
      notes: waste.notes
    });
  };

  const resetToDefaultData = resetAllData;


  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedClientId,
        setSelectedClientId,
        selectedSaleId,
        setSelectedSaleId,
        selectedMachineId,
        setSelectedMachineId,
        activeAudioCall,
        setActiveAudioCall,
        isSearchOpen,
        setIsSearchOpen,
        sidebarOpen,
        setSidebarOpen,

        sales,
        clients,
        rawMaterials,
        finishedProducts,
        warehouseMovements,
        productionOrders,
        machines,
        transactions,
        calls,
        scraps,
        invoices,

        addSale,
        updateSaleStatus,
        addClient,
        addWarehouseMovement,
        addProductionOrder,
        productionStagesList: PRODUCTION_STAGES_LIST,
        advanceProductionStage,
        updateProductionStage,
        updateProductionStatus,
        addTransaction,
        addScrap,
        updateMachineStatus,
        addCallRecord,
        resetAllData,

        // Hisob-faktura mutations
        addInvoiceItem,
        updateInvoiceAccountantData,
        updateInvoiceStatus,
        deductInvoiceFromWarehouse,
        unalignedInvoicesCount,

        todaySalesAmount,
        todayIncomeAmount,
        finishedProductsStockCount,
        activeProductionOrdersCount,
        openOrdersCount,
        todayExpensesAmount,
        kassaBalance,
        bankBalance,
        totalCashBalance,

        finances,
        addFinanceRecord,
        cashBalance: kassaBalance,
        totalBalance: totalCashBalance,
        wasteRecords,
        addWasteRecord,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
