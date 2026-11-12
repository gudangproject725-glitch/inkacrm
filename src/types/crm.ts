/**
 * InkaCRM - Multi-Tenant B2B SaaS CRM Type Definitions
 * Indonesian Primary Language Context
 */

export type UserRole = 'owner' | 'admin' | 'sales_manager' | 'sales_rep' | 'cs_agent' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  tenantId: string;
  phone: string;
  isOnline: boolean;
  assignedLeadsCount: number;
}

export type PlanTier = 'free' | 'starter' | 'growth' | 'enterprise';

export interface SubscriptionQuota {
  tier: PlanTier;
  billingPeriod: 'monthly' | 'annual';
  maxLeads: number;
  maxAgents: number;
  maxWhatsAppNumbers: number;
  currentLeads: number;
  currentAgents: number;
  currentWhatsAppNumbers: number;
  priceMonthly: number; // in IDR
  priceAnnual: number;  // in IDR (discounted)
  renewalDate: string;
  status: 'active' | 'grace_period' | 'overdue' | 'canceled';
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  businessSector: string;
  phone: string;
  city: string;
  logoText: string;
  subscription: SubscriptionQuota;
}

export type LeadSource = 'Meta Ads' | 'Google Ads' | 'WhatsApp Inbound' | 'Referral' | 'Website Form' | 'Event Expo';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';
export type DealStage = 'new' | 'qualification' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';

export interface LeadActivity {
  id: string;
  timestamp: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'note' | 'assignment' | 'status_change';
  description: string;
  performedByName: string;
}

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: LeadSource;
  status: LeadStatus;
  stage: DealStage;
  estimatedValue: number; // IDR
  assignedAgentId: string;
  assignedAgentName: string;
  tags: string[];
  notes: string[];
  activities: LeadActivity[];
  createdAt: string;
  lastContactedAt: string;
}

export interface Deal {
  id: string;
  tenantId: string;
  leadId: string;
  title: string;
  company: string;
  contactName: string;
  value: number; // IDR
  stage: DealStage;
  probability: number; // 0 - 100%
  ownerId: string;
  ownerName: string;
  expectedClosing: string;
  priority: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  text: string;
  time: string;
  status: 'sent' | 'delivered' | 'read';
  agentName?: string;
}

export interface WhatsAppConversation {
  id: string;
  tenantId: string;
  leadId?: string;
  contactName: string;
  phone: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  status: 'open' | 'pending' | 'resolved';
  assignedAgentId: string;
  assignedAgentName: string;
  tags: string[];
  messages: ChatMessage[];
  internalNotes: string[];
}

export interface QuickReplyTemplate {
  id: string;
  title: string;
  shortcut: string;
  text: string;
  category: 'salam' | 'katalog' | 'followup' | 'closing';
}

export interface AutomationRule {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  trigger: 'lead_created' | 'deal_stage_changed' | 'wa_incoming_message' | 'lead_idle_24h';
  conditions: {
    sourceEquals?: LeadSource;
    minValue?: number;
    tagContains?: string;
  };
  actions: {
    assignRoundRobin?: boolean;
    sendWhatsAppTemplateId?: string;
    addTag?: string;
    createFollowUpTaskDays?: number;
  };
  isActive: boolean;
  executionsCount: number;
  lastRunAt?: string;
}

export interface AutomationLog {
  id: string;
  tenantId: string;
  ruleId: string;
  ruleName: string;
  triggerEvent: string;
  entityName: string;
  status: 'success' | 'failed' | 'skipped';
  executedAt: string;
  summary: string;
}

export interface BillingInvoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  date: string;
  amount: number; // IDR
  tier: PlanTier;
  period: string;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: 'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'WhatsApp Broadcast';
  spend: number;
  leadsGenerated: number;
  dealsClosed: number;
  revenueGenerated: number;
  cpl: number; // Cost per lead
  roas: number; // Return on ad spend
}
