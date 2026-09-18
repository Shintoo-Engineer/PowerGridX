export type UserRole = 'PROSUMER' | 'PRODUCER' | 'CONSUMER' | 'GRID_OPERATOR' | 'ADMIN';

export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export type EnergySource = 'SOLAR' | 'WIND' | 'HYDRO' | 'BIOMASS' | 'THERMAL' | 'NUCLEAR' | 'OTHER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  location: string;
  region: string;
  verificationStatus: VerificationStatus;
  walletBalance: number;
  pendingSettlement: number;
  createdAt: string;
  hasSolarAsset?: boolean;
}

export interface EnergyAsset {
  id: string;
  userId: string;
  userName: string;
  name: string;
  sourceType: EnergySource;
  capacityKw: number;
  location: string;
  region: string;
  meterId: string;
  verificationStatus: VerificationStatus;
  status: 'CONNECTED' | 'PENDING_VERIFICATION' | 'MAINTENANCE' | 'DISCONNECTED';
  currentGenerationKw: number;
  todayGenerationKwh: number;
  homeConsumptionKwh: number;
  surplusKwh: number;
  isRenewable: boolean;
  createdAt: string;
}

export interface MeterReading {
  id: string;
  meterId: string;
  assetId?: string;
  timestamp: string;
  generationKwh: number;
  consumptionKwh: number;
  netSurplusKwh: number;
  frequencyHz: number;
  voltageV: number;
  status: 'ONLINE' | 'VERIFIED' | 'FLAGGED';
}

export interface EnergyOffer {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRole: 'PROSUMER' | 'PRODUCER';
  assetId: string;
  assetName: string;
  sourceType: EnergySource;
  quantityKwh: number;
  availableKwh: number;
  pricePerKwh: number; // in INR ₹
  startTime: string;
  endTime: string;
  pricingType: 'FIXED' | 'SMART_MARKET';
  region: string;
  status: 'ACTIVE' | 'MATCHED' | 'PARTIAL' | 'EXPIRED' | 'CANCELLED';
  isRenewable: boolean;
  estimatedCo2SavedKg: number;
  createdAt: string;
}

export interface EnergyRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  requiredKwh: number;
  maxPricePerKwh: number;
  startTime: string;
  endTime: string;
  preferredSource: EnergySource | 'ANY_RENEWABLE' | 'ANY';
  region: string;
  status: 'PENDING' | 'MATCHED' | 'FULFILLED';
  createdAt: string;
}

export interface MatchAllocation {
  offerId: string;
  sellerId: string;
  sellerName: string;
  sellerRole: 'PROSUMER' | 'PRODUCER';
  sourceType: EnergySource;
  allocatedKwh: number;
  pricePerKwh: number;
  subtotal: number;
  region: string;
}

export interface SmartMatchResult {
  id: string;
  requestId?: string;
  targetKwh?: number;
  totalRequestedKwh: number;
  matchedKwh?: number;
  totalMatchedKwh: number;
  blendedPricePerKwh?: number;
  averagePricePerKwh: number;
  totalCost: number;
  co2SavedKg: number;
  allocations: MatchAllocation[];
  bundleItems?: Array<{
    sellerName: string;
    role: 'PROSUMER' | 'PRODUCER';
    sourceType: string;
    allocatedKwh: number;
    pricePerKwh: number;
  }>;
  status: 'OPTIMAL' | 'PARTIAL' | 'UNAVAILABLE';
}

export interface GridNode {
  id: string;
  name: string;
  type: 'SUBSTATION' | 'PRODUCER' | 'PROSUMER_CLUSTER' | 'CONSUMER_HUB';
  currentLoadMw: number;
  capacityMw: number;
  status: 'NORMAL' | 'CONGESTED';
  connectedProsumers: number;
  connectedProducers: number;
  voltageKv: number;
  x: number;
  y: number;
}

export interface GridTelemetry {
  totalGenerationMw: number;
  totalDemandMw: number;
  reserveMarginMw: number;
  frequencyHz: number;
  voltageStabilityPct: number;
  activeProsumers: number;
  activeProducers: number;
  congestionAlerts: string[];
  nodes: GridNode[];
}

export interface Transaction {
  id: string; // e.g. PGX-2026-000102
  sellerId: string;
  sellerName: string;
  sellerRole: 'PROSUMER' | 'PRODUCER';
  buyerId: string;
  buyerName: string;
  offerId?: string;
  energyKwh: number;
  sourceType: EnergySource;
  pricePerKwh: number;
  grossAmount: number;
  platformFee: number; // e.g., 3%
  gridCharges: number; // transmission/wheeling charge simulator e.g., 2%
  netSellerAmount: number;
  timestamp: string;
  status: 'COMPLETED' | 'PROCESSING' | 'PENDING';
  meterVerification: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  settlementStatus: 'COMPLETED' | 'PROCESSING' | 'PENDING';
  region: string;
}

export interface DigitalContract {
  id: string;
  contractNumber: string;
  producerId: string;
  producerName: string;
  consumerId: string;
  consumerName: string;
  energyMwhPerDay: number;
  durationDays: number;
  pricePerKwh: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  terms: string;
}

export interface GridRegion {
  id: string;
  name: string;
  code: string;
  status: 'NORMAL' | 'HIGH_DEMAND' | 'CONGESTION_RISK';
  currentDemandMw: number;
  generationMw: number;
  renewableGenerationMw: number;
  capacityMw: number;
  congestionPercent: number;
  substationsCount: number;
  coordinates: { x: number; y: number }; // SVG map normalized coords
}

export interface GridSubstation {
  id: string;
  name: string;
  regionId: string;
  capacityMva: number;
  loadPercent: number;
  status: 'OPTIMAL' | 'LOADED' | 'CRITICAL';
  x: number;
  y: number;
}

export interface GridStatus {
  frequencyHz: number;
  voltageV: number;
  totalDemandMw: number;
  totalGenerationMw: number;
  renewableSharePercent: number;
  availableCapacityMw: number;
  timestamp: string;
  regions: GridRegion[];
  substations: GridSubstation[];
  isSimulatedTelemetry: true;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  category: 'METER' | 'TRANSACTION' | 'PAYMENT' | 'VERIFICATION' | 'OFFER' | 'OTHER';
  subject: string;
  description: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  adminResponse?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'MATCH' | 'TRANSACTION' | 'VERIFICATION' | 'ALERT' | 'FORECAST' | 'SETTLEMENT';
  read: boolean;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface ForecastItem {
  time: string;
  hour: number;
  generationKwh: number;
  consumptionKwh: number;
  netSurplusKwh: number;
  solarRadiationWm2: number;
  gridDemandMw: number;
  indicativePrice: number;
}
