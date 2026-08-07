// Keycloak Roles
export const Role = {
  ATTENDEE : 'ATTENDEE_ROLE',
  ORGANISER : 'ORGANISER_ROLE',
  STAFF : 'STAFF_ROLE',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const EventStatusEnum = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;
export type EventStatusEnum = (typeof EventStatusEnum)[keyof typeof EventStatusEnum];

export const TicketStatusEnum = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PURCHASED: 'PURCHASED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  CANCELLED: 'CANCELLED',
} as const;
export type TicketStatusEnum = (typeof TicketStatusEnum)[keyof typeof TicketStatusEnum];

export const QrCodeStatusEnum = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
} as const;
export type QrCodeStatusEnum = (typeof QrCodeStatusEnum)[keyof typeof QrCodeStatusEnum];

export const TicketValidationEnum = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  EXPIRED: 'EXPIRED',
} as const;
export type TicketValidationEnum = (typeof TicketValidationEnum)[keyof typeof TicketValidationEnum];

export const TicketValidationMethod = {
  QR_SCAN: 'QR_SCAN',
  MANUAL: 'MANUAL',
} as const;
export type TicketValidationMethod = (typeof TicketValidationMethod)[keyof typeof TicketValidationMethod];

// ==========================================
// 2. DOMAIN ENTITY INTERFACES
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  createAt?: string;
  updateAt?: string;
  roles?: Role[];
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
  totalAvailable?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  name: string;
  start?: string;
  end?: string;
  venue: string;
  salesStart?: string;
  salesEnd?: string;
  status: EventStatusEnum;
  ticketTypes?: TicketType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QrCode {
  id: string;
  status: QrCodeStatusEnum;
  value: string;
  createAt?: string;
  updateAt?: string;
}

export interface TicketValidation {
  id: string;
  status: TicketValidationEnum;
  validationMethod: TicketValidationMethod;
  createAt: string;
  updateAt?: string;
}

export interface Ticket {
  id: string;
  status: TicketStatusEnum;
  chargilyCheckoutId?: string;
  ticketType?: TicketType;
  validation?: TicketValidation[];
  qrCodes?: QrCode[];
  createAt?: string;
  updateAt?: string;
}

// ==========================================
// 3. API DTO INTERFACES
// ==========================================

// --- Event DTOs ---
export interface CreateTicketTypeRequestDto {
  name: string;
  price: number;
  description?: string;
  totalAvailable?: number;
}

export interface CreateTicketTypeResponseDto {
  id: string;
  name: string;
  price: number;
  description?: string;
  totalAvailable?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventRequestDto {
  name: string;
  start?: string;
  end?: string;
  venue: string;
  salesStart?: string;
  salesEnd?: string;
  status: EventStatusEnum;
  ticketTypes: CreateTicketTypeRequestDto[];
}

export interface CreateEventResponseDto {
  id: string;
  name: string;
  start?: string;
  end?: string;
  venue: string;
  salesStart?: string;
  salesEnd?: string;
  status: EventStatusEnum;
  ticketTypes?: CreateTicketTypeResponseDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetEventTicketTypeResponseDto {
  id: string;
  name: string;
  price: number;
  description?: string;
  totalAvailable?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetEventDetailsResponseDto {
  id: string;
  name: string;
  start?: string;
  end?: string;
  venue: string;
  salesStart?: string;
  salesEnd?: string;
  status: EventStatusEnum;
  ticketTypes: GetEventTicketTypeResponseDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetPublishedEventTicketTypeResponseDto {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface GetPublishedEventDetailsResponseDto {
  id: string;
  name: string;
  start?: string;
  end?: string;
  venue: string;
  ticketType: GetPublishedEventTicketTypeResponseDto[];
}

export interface ListEventTicketTypeResponseDto {
  id: string;
  name: string;
  price: number;
  description?: string;
  totalAvailable?: number;
}

export interface ListEventResponseDto {
  id: string;
  name: string;
  start?: string;
  end?: string;
  venue: string;
  salesStart?: string;
  salesEnd?: string;
  status: EventStatusEnum;
  ticketTypes: ListEventTicketTypeResponseDto[];
}

export interface ListPublishedEventResponseDto {
  id: string;
  name: string;
  start?: string;
  end?: string;
  venue: string;
}

// --- Ticket Type Management DTOs ---
export interface UpdateTicketTypeRequestDto {
  id?: string;
  name: string;
  price: number;
  description?: string;
  totalAvailable?: number;
}

export interface UpdateTicketTypeResponseDto {
  id: string;
  name: string;
  price: number;
  description?: string;
  totalAvailable?: number;
  createdAt?: string;
  updatedAt?: string;
}

// --- Ticket DTOs ---
export interface ListTicketTypeResponseDto {
  id: string;
  name: string;
  price: number;
}

export interface ListTicketResponseDto {
  id: string;
  status: TicketStatusEnum;
  ticketType: ListTicketTypeResponseDto;
}

export interface GetTicketResponseDto {
  id: string;
  status: TicketStatusEnum;
  price: number;
  description?: string;
  eventName: string;
  eventVenue: string;
  eventStart?: string;
  eventEnd?: string;
}

export interface PurchaseTicketResponseDto {
  ticketId: string;
  checkoutUrl?: string;
}

// --- Validation DTOs ---
export interface TicketValidationRequestDto {
  id: string;
  method: TicketValidationMethod;
}

export interface TicketValidationResponseDto {
  ticketId: string;
  status: TicketValidationEnum;
}

// --- Chargily Payment DTOs ---
export interface ChargilyCheckoutRequestDto {
  amount: number;
  currency: string;
  successUrl: string;
  failureUrl: string;
  metadata?: Record<string, any>;
}

export interface ChargilyCheckoutResponseDto {
  id: string;
  status: string;
  checkoutUrl?: string;
}

// --- Common / Error DTO ---
export interface ErrorDto {
  error: string;
}