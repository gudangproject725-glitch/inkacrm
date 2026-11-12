import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatIDR,
  normalizeIndonesianPhone,
  displayIndonesianPhone,
  getNextRoundRobinAgent,
  calculatePipelineMetrics,
  calculateLeadConversionRate,
  evaluateAutomationCondition,
  checkQuotaEntitlement,
} from './crm-rules.ts';
import { User, Deal, Lead, SubscriptionQuota, AutomationRule } from '../types/crm.ts';

test('formatIDR formats currency correctly', () => {
  const result = formatIDR(15000000);
  assert.ok(result.includes('15.000.000'));
});

test('normalizeIndonesianPhone converts local 08xx to standard 628xx', () => {
  assert.equal(normalizeIndonesianPhone('081234567890'), '6281234567890');
  assert.equal(normalizeIndonesianPhone('+62 812-3456-7890'), '6281234567890');
  assert.equal(normalizeIndonesianPhone('6285712345678'), '6285712345678');
});

test('displayIndonesianPhone renders human readable phone format', () => {
  const formatted = displayIndonesianPhone('081234567890');
  assert.equal(formatted, '+62 812-3456-7890');
});

test('getNextRoundRobinAgent distributes in circular sequence', () => {
  const mockAgents: User[] = [
    {
      id: 'agent-1',
      name: 'Andi Pratama',
      email: 'andi@example.com',
      role: 'sales_rep',
      avatarUrl: '',
      tenantId: 'tenant-1',
      phone: '081234567890',
      isOnline: true,
      assignedLeadsCount: 5,
    },
    {
      id: 'agent-2',
      name: 'Siti Rahma',
      email: 'siti@example.com',
      role: 'sales_rep',
      avatarUrl: '',
      tenantId: 'tenant-1',
      phone: '081234567891',
      isOnline: true,
      assignedLeadsCount: 4,
    },
    {
      id: 'agent-3',
      name: 'Dewi Lestari',
      email: 'dewi@example.com',
      role: 'sales_rep',
      avatarUrl: '',
      tenantId: 'tenant-1',
      phone: '081234567892',
      isOnline: true,
      assignedLeadsCount: 3,
    },
  ];

  // First call without lastAssignedAgentId returns first agent
  const first = getNextRoundRobinAgent(mockAgents);
  assert.equal(first?.id, 'agent-1');

  // Next after agent-1 is agent-2
  const second = getNextRoundRobinAgent(mockAgents, 'agent-1');
  assert.equal(second?.id, 'agent-2');

  // Next after agent-2 is agent-3
  const third = getNextRoundRobinAgent(mockAgents, 'agent-2');
  assert.equal(third?.id, 'agent-3');

  // Wrap around after agent-3 is back to agent-1
  const looped = getNextRoundRobinAgent(mockAgents, 'agent-3');
  assert.equal(looped?.id, 'agent-1');
});

test('calculatePipelineMetrics computes stage totals, active pipeline and weighted pipeline value', () => {
  const deals: Deal[] = [
    {
      id: 'd1',
      tenantId: 't1',
      leadId: 'l1',
      title: 'Deal 1',
      company: 'PT A',
      contactName: 'A',
      value: 10000000,
      stage: 'qualification',
      probability: 50,
      ownerId: 'u1',
      ownerName: 'U1',
      expectedClosing: '2026-12-01',
      priority: 'high',
    },
    {
      id: 'd2',
      tenantId: 't1',
      leadId: 'l2',
      title: 'Deal 2',
      company: 'PT B',
      contactName: 'B',
      value: 20000000,
      stage: 'proposal_sent',
      probability: 70,
      ownerId: 'u1',
      ownerName: 'U1',
      expectedClosing: '2026-12-05',
      priority: 'medium',
    },
    {
      id: 'd3',
      tenantId: 't1',
      leadId: 'l3',
      title: 'Deal 3',
      company: 'PT C',
      contactName: 'C',
      value: 15000000,
      stage: 'won',
      probability: 100,
      ownerId: 'u2',
      ownerName: 'U2',
      expectedClosing: '2026-11-01',
      priority: 'high',
    },
  ];

  const metrics = calculatePipelineMetrics(deals);
  assert.equal(metrics.totalActiveDeals, 2);
  assert.equal(metrics.totalPipelineValue, 30000000); // d1 + d2
  assert.equal(metrics.wonDealsValue, 15000000); // d3
  assert.equal(metrics.weightedPipelineValue, 5000000 + 14000000); // (10m * 0.5) + (20m * 0.7) = 19m
  assert.equal(metrics.stageTotals.won.count, 1);
  assert.equal(metrics.stageTotals.qualification.count, 1);
});

test('calculateLeadConversionRate returns percentage', () => {
  const leads: Lead[] = [
    { id: '1', status: 'won' } as Lead,
    { id: '2', status: 'contacted' } as Lead,
    { id: '3', status: 'lost' } as Lead,
    { id: '4', status: 'won' } as Lead,
  ];
  assert.equal(calculateLeadConversionRate(leads), 50.0);
});

test('evaluateAutomationCondition filters by source and value', () => {
  const rule: AutomationRule = {
    id: 'r1',
    tenantId: 't1',
    name: 'Meta High Value',
    description: 'Assign meta leads > 10m',
    trigger: 'lead_created',
    conditions: {
      sourceEquals: 'Meta Ads',
      minValue: 10000000,
    },
    actions: { assignRoundRobin: true },
    isActive: true,
    executionsCount: 0,
  };

  const matchingLead: Partial<Lead> = {
    source: 'Meta Ads',
    estimatedValue: 12000000,
  };
  assert.equal(evaluateAutomationCondition(rule, matchingLead), true);

  const wrongSourceLead: Partial<Lead> = {
    source: 'Google Ads',
    estimatedValue: 15000000,
  };
  assert.equal(evaluateAutomationCondition(rule, wrongSourceLead), false);

  const lowValueLead: Partial<Lead> = {
    source: 'Meta Ads',
    estimatedValue: 5000000,
  };
  assert.equal(evaluateAutomationCondition(rule, lowValueLead), false);
});

test('checkQuotaEntitlement blocks when limits are reached', () => {
  const quota: SubscriptionQuota = {
    tier: 'starter',
    billingPeriod: 'monthly',
    maxLeads: 500,
    maxAgents: 3,
    maxWhatsAppNumbers: 1,
    currentLeads: 490,
    currentAgents: 3,
    currentWhatsAppNumbers: 1,
    priceMonthly: 299000,
    priceAnnual: 2990000,
    renewalDate: '2026-12-01',
    status: 'active',
  };

  const leadCheck = checkQuotaEntitlement(quota, 'leads');
  assert.equal(leadCheck.allowed, true);
  assert.equal(leadCheck.percentageUsed, 98);

  const agentCheck = checkQuotaEntitlement(quota, 'agents');
  assert.equal(agentCheck.allowed, false);
  assert.ok(agentCheck.message?.includes('Batas kuota agents'));
});
