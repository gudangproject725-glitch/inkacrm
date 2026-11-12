import React, { useState, useEffect } from 'react';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_LEADS,
  INITIAL_DEALS,
  INITIAL_CONVERSATIONS,
  INITIAL_QUICK_TEMPLATES,
  INITIAL_AUTOMATIONS,
  INITIAL_AUTOMATION_LOGS,
  INITIAL_INVOICES,
  INITIAL_CAMPAIGNS,
} from './data/mock-seed.ts';
import {
  Organization,
  User,
  Lead,
  Deal,
  WhatsAppConversation,
  QuickReplyTemplate,
  AutomationRule,
  AutomationLog,
  BillingInvoice,
  MarketingCampaign,
  PlanTier,
} from './types/crm.ts';
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { MarketingLanding } from './components/marketing/MarketingLanding.tsx';
import { DashboardOverview } from './components/dashboard/DashboardOverview.tsx';
import { LeadsManagement } from './components/leads/LeadsManagement.tsx';
import { PipelineKanban } from './components/pipeline/PipelineKanban.tsx';
import { WhatsAppInbox } from './components/chat/WhatsAppInbox.tsx';
import { ContactsDatabase } from './components/contacts/ContactsDatabase.tsx';
import { AutomationBuilder } from './components/automation/AutomationBuilder.tsx';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics.tsx';
import { TeamManagement } from './components/team/TeamManagement.tsx';
import { WhatsAppConnection } from './components/whatsapp/WhatsAppConnection.tsx';
import { SubscriptionBilling } from './components/billing/SubscriptionBilling.tsx';
import { OrganizationSettings } from './components/settings/OrganizationSettings.tsx';
import { SuperAdminPlatform } from './components/admin/SuperAdminPlatform.tsx';
import { evaluateAutomationCondition } from './utils/crm-rules.ts';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mobile navigation drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Organizations & Context
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [currentOrg, setCurrentOrg] = useState<Organization>(INITIAL_ORGANIZATIONS[0]);

  // View state: 'dashboard' is default in CRM workspace, 'marketing' for public website
  const [activeView, setActiveView] = useState<string>('dashboard');

  // Multi-tenant Data Entities
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [allLeads, setAllLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [allDeals, setAllDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [allConversations, setAllConversations] = useState<WhatsAppConversation[]>(INITIAL_CONVERSATIONS);
  const [templates, setTemplates] = useState<QuickReplyTemplate[]>(INITIAL_QUICK_TEMPLATES);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [logs, setLogs] = useState<AutomationLog[]>(INITIAL_AUTOMATION_LOGS);
  const [invoices, setInvoices] = useState<BillingInvoice[]>(INITIAL_INVOICES);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(INITIAL_CAMPAIGNS);

  // Global modal control
  const [triggerNewLeadModal, setTriggerNewLeadModal] = useState(false);

  // Sync dark class on html root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Support ?view= query parameter or autostart
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam) {
      setActiveView(viewParam);
    }
  }, []);

  // Filtered entities for current tenant workspace
  const tenantUsers = allUsers.filter((u) => u.tenantId === currentOrg.id);
  const tenantLeads = allLeads.filter((l) => l.tenantId === currentOrg.id);
  const tenantDeals = allDeals.filter((d) => d.tenantId === currentOrg.id);
  const tenantConversations = allConversations.filter((c) => c.tenantId === currentOrg.id);
  const tenantRules = rules.filter((r) => r.tenantId === currentOrg.id);
  const tenantLogs = logs.filter((l) => l.tenantId === currentOrg.id);
  const tenantInvoices = invoices.filter((i) => i.tenantId === currentOrg.id);

  // Active current user (fallback to first user of current organization)
  const currentUser = tenantUsers[0] || allUsers[0];

  // Total unread WhatsApp messages for this tenant
  const totalUnreadWhatsApp = tenantConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // Lead Actions
  const handleAddLead = (newLead: Lead) => {
    setAllLeads([newLead, ...allLeads]);

    // Update tenant quota counter
    setCurrentOrg((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        currentLeads: prev.subscription.currentLeads + 1,
      },
    }));

    // Trigger matching automations!
    tenantRules.forEach((rule) => {
      if (rule.isActive && rule.trigger === 'lead_created') {
        const matches = evaluateAutomationCondition(rule, newLead);
        if (matches) {
          const newLog: AutomationLog = {
            id: `log-${Date.now()}`,
            tenantId: currentOrg.id,
            ruleId: rule.id,
            ruleName: rule.name,
            triggerEvent: `Lead Dibuat: ${newLead.name} (${newLead.company})`,
            entityName: newLead.name,
            status: 'success',
            executedAt: 'Baru saja',
            summary: `Aturan "${rule.name}" berhasil dijalankan. Di-assign ke ${newLead.assignedAgentName}.`,
          };
          setLogs((prev) => [newLog, ...prev]);

          // Increment rule executions
          setRules((prev) =>
            prev.map((r) => (r.id === rule.id ? { ...r, executionsCount: r.executionsCount + 1 } : r))
          );
        }
      }
    });
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setAllLeads(allLeads.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
  };

  const handleDeleteLead = (leadId: string) => {
    setAllLeads(allLeads.filter((l) => l.id !== leadId));
    setCurrentOrg((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        currentLeads: Math.max(0, prev.subscription.currentLeads - 1),
      },
    }));
  };

  // Deal Actions
  const handleAddDeal = (newDeal: Deal) => {
    setAllDeals([newDeal, ...allDeals]);
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setAllDeals(allDeals.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
  };

  // WhatsApp Conversation Actions
  const handleUpdateConversation = (updatedConv: WhatsAppConversation) => {
    setAllConversations(allConversations.map((c) => (c.id === updatedConv.id ? updatedConv : c)));
  };

  // Automation Actions
  const handleToggleRule = (ruleId: string) => {
    setRules(
      rules.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleAddRule = (newRule: AutomationRule) => {
    setRules([newRule, ...rules]);
  };

  const handleRunTestRule = (ruleId: string) => {
    const targetRule = rules.find((r) => r.id === ruleId);
    if (!targetRule) return;

    const mockLog: AutomationLog = {
      id: `log-${Date.now()}`,
      tenantId: currentOrg.id,
      ruleId: targetRule.id,
      ruleName: targetRule.name,
      triggerEvent: `Uji Coba Manual: Simulasi Event Pemicu (${targetRule.trigger})`,
      entityName: 'Simulasi Kontak Uji',
      status: 'success',
      executedAt: 'Baru saja',
      summary: `Eksekusi uji coba berhasil. Seluruh aksi (${targetRule.actions.assignRoundRobin ? 'Round-Robin' : ''} ${targetRule.actions.addTag ? `Tag: ${targetRule.actions.addTag}` : ''}) berjalan normal.`,
    };

    setLogs((prev) => [mockLog, ...prev]);
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, executionsCount: r.executionsCount + 1 } : r))
    );
  };

  // Team Actions
  const handleAddUser = (newUser: User) => {
    setAllUsers([...allUsers, newUser]);
    setCurrentOrg((prev) => ({
      ...prev,
      subscription: {
        ...prev.subscription,
        currentAgents: prev.subscription.currentAgents + 1,
      },
    }));
  };

  const handleToggleUserOnline = (userId: string) => {
    setAllUsers(
      allUsers.map((u) => (u.id === userId ? { ...u, isOnline: !u.isOnline } : u))
    );
  };

  // Upgrade Plan
  const handleUpgradePlan = (tier: PlanTier) => {
    let maxLeads = 1000;
    let maxAgents = 3;
    let maxWhatsApp = 1;
    let priceMonthly = 299000;

    if (tier === 'growth') {
      maxLeads = 5000;
      maxAgents = 10;
      maxWhatsApp = 3;
      priceMonthly = 799000;
    } else if (tier === 'enterprise') {
      maxLeads = 25000;
      maxAgents = 30;
      maxWhatsApp = 10;
      priceMonthly = 1999000;
    }

    const updatedOrg: Organization = {
      ...currentOrg,
      subscription: {
        ...currentOrg.subscription,
        tier,
        maxLeads,
        maxAgents,
        maxWhatsAppNumbers: maxWhatsApp,
        priceMonthly,
        priceAnnual: priceMonthly * 10,
      },
    };

    setCurrentOrg(updatedOrg);
    setOrganizations(organizations.map((o) => (o.id === updatedOrg.id ? updatedOrg : o)));
  };

  // Handle open chat from Lead Drawer or Contacts
  const handleOpenChatWithLead = (lead: Lead) => {
    // Check if conversation already exists for this lead phone
    const existing = tenantConversations.find(
      (c) => c.phone === lead.phone || c.contactName === lead.name
    );

    if (existing) {
      setActiveView('chat');
    } else {
      // Create new conversation
      const newConv: WhatsAppConversation = {
        id: `conv-${Date.now()}`,
        tenantId: currentOrg.id,
        leadId: lead.id,
        contactName: lead.name,
        phone: lead.phone,
        unreadCount: 0,
        lastMessage: 'Obrolan baru dimulai dari database leads.',
        lastMessageTime: 'Baru saja',
        status: 'open',
        assignedAgentId: lead.assignedAgentId,
        assignedAgentName: lead.assignedAgentName,
        tags: lead.tags,
        internalNotes: [`Dibuat dari prospek ${lead.company}`],
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'system',
            text: `Percakapan WhatsApp baru diinisiasi untuk ${lead.name} (${lead.company}).`,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          },
        ],
      };
      setAllConversations([newConv, ...allConversations]);
      setActiveView('chat');
    }
  };

  // If user is viewing the Public Marketing Website
  if (activeView === 'marketing') {
    return <MarketingLanding onEnterApp={() => setActiveView('dashboard')} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        currentOrg={currentOrg}
        organizations={organizations}
        currentUser={currentUser}
        onSelectOrg={(org) => setCurrentOrg(org)}
        activeView={activeView}
        onChangeView={(view) => {
          setActiveView(view);
          setIsMobileMenuOpen(false);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {activeView !== 'superadmin' && (
          <Sidebar
            currentOrg={currentOrg}
            activeView={activeView}
            onChangeView={(view) => {
              setActiveView(view);
              setIsMobileMenuOpen(false);
            }}
            unreadCount={totalUnreadWhatsApp}
            isOpenOnMobile={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full">
            {activeView === 'dashboard' && (
              <DashboardOverview
                currentOrg={currentOrg}
                leads={tenantLeads}
                deals={tenantDeals}
                users={tenantUsers}
                onNavigate={(view) => setActiveView(view)}
                onOpenNewLeadModal={() => setActiveView('leads')}
              />
            )}

            {activeView === 'leads' && (
              <LeadsManagement
                currentOrg={currentOrg}
                leads={tenantLeads}
                users={tenantUsers}
                onAddLead={handleAddLead}
                onUpdateLead={handleUpdateLead}
                onDeleteLead={handleDeleteLead}
                onOpenChatWithLead={handleOpenChatWithLead}
              />
            )}

            {activeView === 'pipeline' && (
              <PipelineKanban
                currentOrg={currentOrg}
                deals={tenantDeals}
                users={tenantUsers}
                leads={tenantLeads}
                onUpdateDeal={handleUpdateDeal}
                onAddDeal={handleAddDeal}
              />
            )}

            {activeView === 'chat' && (
              <WhatsAppInbox
                currentOrg={currentOrg}
                conversations={tenantConversations}
                templates={templates}
                users={tenantUsers}
                currentUser={currentUser}
                onUpdateConversation={handleUpdateConversation}
              />
            )}

            {activeView === 'contacts' && (
              <ContactsDatabase
                currentOrg={currentOrg}
                leads={tenantLeads}
                onOpenChatWithLead={handleOpenChatWithLead}
              />
            )}

            {activeView === 'automation' && (
              <AutomationBuilder
                currentOrg={currentOrg}
                rules={tenantRules}
                logs={tenantLogs}
                users={tenantUsers}
                onToggleRule={handleToggleRule}
                onAddRule={handleAddRule}
                onRunTestRule={handleRunTestRule}
              />
            )}

            {activeView === 'reports' && (
              <ReportsAnalytics
                currentOrg={currentOrg}
                campaigns={campaigns}
                leads={tenantLeads}
                deals={tenantDeals}
              />
            )}

            {activeView === 'team' && (
              <TeamManagement
                currentOrg={currentOrg}
                users={tenantUsers}
                onAddUser={handleAddUser}
                onToggleUserOnline={handleToggleUserOnline}
                onNavigateToBilling={() => setActiveView('billing')}
              />
            )}

            {activeView === 'whatsapp' && (
              <WhatsAppConnection currentOrg={currentOrg} />
            )}

            {activeView === 'billing' && (
              <SubscriptionBilling
                currentOrg={currentOrg}
                invoices={tenantInvoices}
                onUpgradePlan={handleUpgradePlan}
              />
            )}

            {activeView === 'settings' && (
              <OrganizationSettings
                currentOrg={currentOrg}
                onUpdateOrg={(updated) => {
                  setCurrentOrg(updated);
                  setOrganizations(organizations.map((o) => (o.id === updated.id ? updated : o)));
                }}
              />
            )}

            {activeView === 'superadmin' && (
              <SuperAdminPlatform
                organizations={organizations}
                onSelectTenant={(org) => {
                  setCurrentOrg(org);
                  setActiveView('dashboard');
                }}
                onExitSuperAdmin={() => setActiveView('dashboard')}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
