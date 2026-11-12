/**
 * InkaCRM - Pure Business Logic Engine
 * Decoupled rules for Round-Robin, Quotas, Currency, Pipeline Math & Automations
 */

import { User, Lead, Deal, SubscriptionQuota, AutomationRule, DealStage } from '../types/crm.ts';

/**
 * Format raw numbers into standard Indonesian Rupiah (IDR) currency string
 * e.g. 15000000 -> "Rp 15.000.000"
 */
export function formatIDR(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Normalizes phone numbers to standard international WhatsApp format without plus or spaces
 * e.g. "0812-3456-7890" -> "6281234567890"
 */
export function normalizeIndonesianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  if (digits.startsWith('62')) {
    return digits;
  }
  return '62' + digits;
}

/**
 * Formats phone number for clean readable display
 * e.g. "6281234567890" -> "+62 812-3456-7890"
 */
export function displayIndonesianPhone(phone: string): string {
  const normalized = normalizeIndonesianPhone(phone);
  if (normalized.length >= 11) {
    const country = normalized.slice(0, 2);
    const prefix = normalized.slice(2, 5);
    const mid = normalized.slice(5, 9);
    const rest = normalized.slice(9);
    return `+${country} ${prefix}-${mid}-${rest}`;
  }
  return phone;
}

/**
 * Round-Robin Agent Assignment Algorithm
 * Given a list of active sales agents, returns the next agent in circular order.
 * If currentAgentId is undefined or not found, assigns the first agent.
 */
export function getNextRoundRobinAgent(
  agents: User[],
  lastAssignedAgentId?: string
): User | null {
  if (!agents || agents.length === 0) return null;

  // Filter only online or active sales reps / agents
  const availableAgents = agents.filter(
    (a) => a.role === 'sales_rep' || a.role === 'sales_manager' || a.role === 'cs_agent'
  );
  if (availableAgents.length === 0) return agents[0] || null;

  if (!lastAssignedAgentId) {
    return availableAgents[0];
  }

  const currentIndex = availableAgents.findIndex((a) => a.id === lastAssignedAgentId);
  if (currentIndex === -1 || currentIndex === availableAgents.length - 1) {
    return availableAgents[0];
  }

  return availableAgents[currentIndex + 1];
}

/**
 * Calculate Pipeline metrics and stage summaries
 */
export interface PipelineMetrics {
  totalPipelineValue: number;
  totalActiveDeals: number;
  wonDealsValue: number;
  weightedPipelineValue: number; // Value * probability
  stageTotals: Record<DealStage, { count: number; totalValue: number }>;
}

export function calculatePipelineMetrics(deals: Deal[]): PipelineMetrics {
  const stageTotals: Record<DealStage, { count: number; totalValue: number }> = {
    new: { count: 0, totalValue: 0 },
    qualification: { count: 0, totalValue: 0 },
    proposal_sent: { count: 0, totalValue: 0 },
    negotiation: { count: 0, totalValue: 0 },
    won: { count: 0, totalValue: 0 },
    lost: { count: 0, totalValue: 0 },
  };

  let totalPipelineValue = 0;
  let totalActiveDeals = 0;
  let wonDealsValue = 0;
  let weightedPipelineValue = 0;

  for (const deal of deals) {
    if (stageTotals[deal.stage]) {
      stageTotals[deal.stage].count += 1;
      stageTotals[deal.stage].totalValue += deal.value;
    }

    if (deal.stage === 'won') {
      wonDealsValue += deal.value;
    } else if (deal.stage !== 'lost') {
      totalPipelineValue += deal.value;
      totalActiveDeals += 1;
      weightedPipelineValue += Math.round(deal.value * (deal.probability / 100));
    }
  }

  return {
    totalPipelineValue,
    totalActiveDeals,
    wonDealsValue,
    weightedPipelineValue,
    stageTotals,
  };
}

/**
 * Calculates Lead to Won Deal Conversion Rate percentage
 */
export function calculateLeadConversionRate(leads: Lead[]): number {
  if (leads.length === 0) return 0;
  const wonCount = leads.filter((l) => l.status === 'won').length;
  return Number(((wonCount / leads.length) * 100).toFixed(1));
}

/**
 * Evaluates whether an incoming or updated Lead meets Automation Rule conditions
 */
export function evaluateAutomationCondition(
  rule: AutomationRule,
  lead: Partial<Lead>
): boolean {
  if (!rule.isActive) return false;

  const { conditions } = rule;

  if (conditions.sourceEquals && lead.source !== conditions.sourceEquals) {
    return false;
  }

  if (conditions.minValue !== undefined && (lead.estimatedValue || 0) < conditions.minValue) {
    return false;
  }

  if (conditions.tagContains && (!lead.tags || !lead.tags.includes(conditions.tagContains))) {
    return false;
  }

  return true;
}

/**
 * Multi-tenant quota enforcement check
 * Verifies whether an organization is allowed to add a new entity under their subscription
 */
export interface QuotaCheckResult {
  allowed: boolean;
  limit: number;
  current: number;
  percentageUsed: number;
  message?: string;
}

export function checkQuotaEntitlement(
  quota: SubscriptionQuota,
  resourceType: 'leads' | 'agents' | 'whatsapp'
): QuotaCheckResult {
  let limit = 0;
  let current = 0;

  switch (resourceType) {
    case 'leads':
      limit = quota.maxLeads;
      current = quota.currentLeads;
      break;
    case 'agents':
      limit = quota.maxAgents;
      current = quota.currentAgents;
      break;
    case 'whatsapp':
      limit = quota.maxWhatsAppNumbers;
      current = quota.currentWhatsAppNumbers;
      break;
  }

  const allowed = current < limit;
  const percentageUsed = Math.min(100, Math.round((current / limit) * 100));

  return {
    allowed,
    limit,
    current,
    percentageUsed,
    message: allowed
      ? undefined
      : `Batas kuota ${resourceType} untuk paket ${quota.tier.toUpperCase()} telah tercapai (${current}/${limit}). Silakan tingkatkan paket Anda.`,
  };
}
