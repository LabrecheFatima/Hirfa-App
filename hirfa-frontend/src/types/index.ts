// Keycloak Roles
export enum Role {
  ATTENDEE = 'ATTENDEE_ROLE',
  ORGANISER = 'ORGANISER_ROLE',
  STAFF = 'STAFF_ROLE',
}

// Enums matching com.advance.hirfa.domaine.entities
export enum EventStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum TicketStatusEnum {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PURCHASED = 'PURCHASED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  CANCELLED = 'CANCELLED',
}

export enum TicketValidationEnum {
  VALID = 'VALID',
  INVALID = 'INVALID',
  EXPIRED = 'EXPIRED',
}

export enum TicketValidationMethod {
  QR_SCAN = 'QR_SCAN',
  MANUAL = 'MANUAL',
}

// Core Entity Interfaces
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
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
  venue: string;
  start?: string;
  end?: string;
  salesStart?: string;
  salesEnd?: string;
  status: EventStatusEnum;
  organizer?: User;
  ticketTypes?: TicketType[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Ticket {
  id: string;
  status: TicketStatusEnum;
  chargilyCheckoutId?: string;
  ticketType?: TicketType;
  createAt?: string;
  updateAt?: string;
}

// DTOs matching Spring Boot Controllers
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
  ticketTypes: CreateTicketTypeResponseDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateEventRequestDto {
  id: string;
  name: string;
  start?: string;
  end?: string;
  venue: string;
  salesStart?: string;
  salesEnd?: string;
  status: EventStatusEnum;
  ticketTypes: CreateTicketTypeRequestDto[];
}

export interface UpdateEventResponseDto {
  id: string;
  name: string;
  start?: string;
  end?: string;
  venue: string;
  salesStart?: string;
  salesEnd?: string;
  status: EventStatusEnum;
  ticketTypes: UpdateTicketTypeResponseDto[];
  createdAt?: string;
  updatedAt?: string;
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

export interface ListTicketResponseDto {
  id: string;
  status: TicketStatusEnum;
  ticketType?: TicketType;
}

export interface TicketValidationRequestDto {
  id: string;
  method: TicketValidationMethod;
}

export interface TicketValidationResponseDto {
  ticketId: string;
  status: TicketValidationEnum;
}

export interface PurchaseTicketResponseDto {
  ticketId: string;
  checkoutUrl: string;
}