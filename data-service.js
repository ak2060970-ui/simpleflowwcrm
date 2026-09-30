/**
 * Simple Floww Business Portal — Sales Dashboard Data Service Layer
 * Inspired by automate.simplefunnel.in SaaS architecture
 * 
 * Provides dynamic data aggregation, mock APIs, interactive chart coordinates,
 * and state filtering.
 */

const SalesDataService = (() => {

  // Global Filter Options
  const filterOptions = {
    dateRanges: [
      { id: 'today', label: 'Today' },
      { id: 'yesterday', label: 'Yesterday' },
      { id: 'last-7-days', label: 'Last 7 Days' },
      { id: 'last-30-days', label: 'Last 30 Days' },
      { id: 'this-month', label: 'This Month' },
      { id: 'last-month', label: 'Last Month' },
      { id: 'custom', label: 'Custom Range' }
    ],
    pipelines: [
      { id: 'all', name: 'All Pipelines' },
      { id: 'sales-core', name: 'Sales Pipeline (Primary)' },
      { id: 'b2b-outbound', name: 'B2B Enterprise Outbound' },
      { id: 'partner-funnel', name: 'Partner & Reseller Funnel' },
      { id: 'high-ticket', name: 'High-Ticket WhatsApp Funnel' }
    ],
    salespersons: [
      { id: 'all', name: 'All Salespersons', avatar: 'ALL' },
      { id: 'rahul', name: 'Rahul Sharma', avatar: 'RS', role: 'Sr. Sales Account Exec' },
      { id: 'aman', name: 'Aman Gupta', avatar: 'AG', role: 'Inside Sales Specialist' },
      { id: 'priya', name: 'Priya Patel', avatar: 'PP', role: 'Enterprise Closer' },
      { id: 'rohit', name: 'Rohit Verma', avatar: 'RV', role: 'Inbound Growth Rep' }
    ],
    sources: [
      { id: 'all', name: 'All Sources' },
      { id: 'facebook', name: 'Facebook Ads', color: '#1877f2' },
      { id: 'instagram', name: 'Instagram Ads', color: '#e1306c' },
      { id: 'google', name: 'Google Ads', color: '#ea4335' },
      { id: 'referral', name: 'Referral', color: '#10b981' },
      { id: 'whatsapp', name: 'WhatsApp Inbound', color: '#25d366' },
      { id: 'organic', name: 'Organic / Website', color: '#6366f1' },
      { id: 'webinar', name: 'Webinar', color: '#f59e0b' },
      { id: 'manual', name: 'Manual Outbound', color: '#8b5cf6' }
    ],
    tags: [
      { id: 'all', name: 'All Tags' },
      { id: 'hot-lead', name: 'Hot Lead', color: 'orange', icon: '🔥' },
      { id: 'interested', name: 'Interested', color: 'blue', icon: '👍' },
      { id: 'follow-up', name: 'Follow-up', color: 'amber', icon: '⏳' },
      { id: 'demo-done', name: 'Demo Done', color: 'purple', icon: '🎯' },
      { id: 'payment-pending', name: 'Payment Pending', color: 'indigo', icon: '💳' },
      { id: 'not-interested', name: 'Not Interested', color: 'slate', icon: '✕' },
      { id: 'high-intent', name: 'High Intent', color: 'emerald', icon: '⚡' },
      { id: 'decision-maker', name: 'Decision Maker', color: 'rose', icon: '👑' },
      { id: 'pricing-shared', name: 'Pricing Shared', color: 'cyan', icon: '📄' }
    ]
  };

  // Pipeline definitions with dynamic stages
  const pipelineDefinitions = {
    'sales-core': {
      id: 'sales-core',
      name: 'Sales Pipeline (Primary)',
      stages: [
        { id: 'new-lead', name: 'New Lead', order: 1, baseLeads: 500, avgTime: '0.8 Days', color: '#6366f1' },
        { id: 'contacted', name: 'Contacted', order: 2, baseLeads: 320, avgTime: '1.4 Days', color: '#3b82f6' },
        { id: 'demo-scheduled', name: 'Demo Scheduled', order: 3, baseLeads: 220, avgTime: '1.8 Days', color: '#0ea5e9' },
        { id: 'demo-done', name: 'Demo Done', order: 4, baseLeads: 180, avgTime: '2.1 Days', color: '#8b5cf6' },
        { id: 'interested', name: 'Interested', order: 5, baseLeads: 110, avgTime: '3.4 Days', color: '#f59e0b' },
        { id: 'negotiation', name: 'Negotiation', order: 6, baseLeads: 74, avgTime: '4.2 Days', color: '#ea580c' },
        { id: 'won', name: 'Won', order: 7, baseLeads: 54, avgTime: '2.5 Days', color: '#16a34a' }
      ]
    },
    'b2b-outbound': {
      id: 'b2b-outbound',
      name: 'B2B Enterprise Outbound',
      stages: [
        { id: 'prospect', name: 'Prospect Identified', order: 1, baseLeads: 380, avgTime: '1.5 Days', color: '#6366f1' },
        { id: 'cold-reach', name: 'Initial Contact', order: 2, baseLeads: 195, avgTime: '2.6 Days', color: '#3b82f6' },
        { id: 'discovery', name: 'Discovery Call', order: 3, baseLeads: 120, avgTime: '3.1 Days', color: '#0ea5e9' },
        { id: 'solution-pitch', name: 'Executive Demo', order: 4, baseLeads: 85, avgTime: '4.5 Days', color: '#8b5cf6' },
        { id: 'proposal-sent', name: 'Proposal Sent', order: 5, baseLeads: 48, avgTime: '5.2 Days', color: '#ea580c' },
        { id: 'won', name: 'Closed Won', order: 6, baseLeads: 26, avgTime: '3.8 Days', color: '#16a34a' }
      ]
    },
    'partner-funnel': {
      id: 'partner-funnel',
      name: 'Partner & Reseller Funnel',
      stages: [
        { id: 'application', name: 'Partner Inbound', order: 1, baseLeads: 240, avgTime: '0.5 Days', color: '#6366f1' },
        { id: 'vetted', name: 'Vetting Call', order: 2, baseLeads: 160, avgTime: '1.2 Days', color: '#3b82f6' },
        { id: 'commercial-demo', name: 'Commercials Demo', order: 3, baseLeads: 115, avgTime: '2.0 Days', color: '#8b5cf6' },
        { id: 'agreement-pending', name: 'Agreement Sent', order: 4, baseLeads: 62, avgTime: '3.5 Days', color: '#ea580c' },
        { id: 'onboarded', name: 'Partner Live', order: 5, baseLeads: 38, avgTime: '2.1 Days', color: '#16a34a' }
      ]
    },
    'high-ticket': {
      id: 'high-ticket',
      name: 'High-Ticket WhatsApp Funnel',
      stages: [
        { id: 'wa-lead', name: 'WhatsApp Inbound', order: 1, baseLeads: 420, avgTime: '0.3 Days', color: '#25d366' },
        { id: 'qualified-chat', name: 'Chat Qualified', order: 2, baseLeads: 290, avgTime: '0.9 Days', color: '#3b82f6' },
        { id: 'vip-consultation', name: 'VIP Consultation', order: 3, baseLeads: 190, avgTime: '1.4 Days', color: '#8b5cf6' },
        { id: 'invoice-raised', name: 'Invoice Raised', order: 4, baseLeads: 95, avgTime: '1.8 Days', color: '#ea580c' },
        { id: 'paid', name: 'Payment Received', order: 5, baseLeads: 68, avgTime: '1.1 Days', color: '#16a34a' }
      ]
    }
  };

  // Base Sales Team Performance database
  const teamMembersData = [
    {
      id: 'rahul',
      name: 'Rahul Sharma',
      avatar: 'RS',
      role: 'Sr. Sales Account Exec',
      assigned: 120,
      contacted: 82,
      demos: 42,
      won: 15,
      conversion: 12.5,
      overdue: 6,
      totalSales: 825000,
      status: 'active'
    },
    {
      id: 'aman',
      name: 'Aman Gupta',
      avatar: 'AG',
      role: 'Inside Sales Specialist',
      assigned: 95,
      contacted: 71,
      demos: 37,
      won: 11,
      conversion: 11.6,
      overdue: 3,
      totalSales: 610000,
      status: 'active'
    },
    {
      id: 'priya',
      name: 'Priya Patel',
      avatar: 'PP',
      role: 'Enterprise Closer',
      assigned: 110,
      contacted: 84,
      demos: 51,
      won: 19,
      conversion: 17.3,
      overdue: 2,
      totalSales: 1240000,
      status: 'top-performer'
    },
    {
      id: 'rohit',
      name: 'Rohit Verma',
      avatar: 'RV',
      role: 'Inbound Growth Rep',
      assigned: 85,
      contacted: 62,
      demos: 30,
      won: 9,
      conversion: 10.6,
      overdue: 4,
      totalSales: 495000,
      status: 'active'
    }
  ];

  // Base Lead Source database
  const leadSourcesData = [
    { id: 'facebook', name: 'Facebook Ads', leads: 320, qualified: 118, demos: 72, won: 24, conversion: 7.5, color: '#1877f2' },
    { id: 'instagram', name: 'Instagram Ads', leads: 210, qualified: 64, demos: 41, won: 11, conversion: 5.2, color: '#e1306c' },
    { id: 'google', name: 'Google Ads', leads: 280, qualified: 102, demos: 58, won: 21, conversion: 7.5, color: '#ea4335' },
    { id: 'referral', name: 'Referral', leads: 74, qualified: 42, demos: 31, won: 14, conversion: 18.9, color: '#10b981' },
    { id: 'whatsapp', name: 'WhatsApp Inbound', leads: 160, qualified: 78, demos: 48, won: 16, conversion: 10.0, color: '#25d366' },
    { id: 'organic', name: 'Organic / Website', leads: 145, qualified: 52, demos: 33, won: 8, conversion: 5.5, color: '#6366f1' },
    { id: 'webinar', name: 'Webinar', leads: 92, qualified: 41, demos: 29, won: 12, conversion: 13.0, color: '#f59e0b' },
    { id: 'manual', name: 'Manual Outbound', leads: 48, qualified: 19, demos: 12, won: 3, conversion: 6.25, color: '#8b5cf6' }
  ];

  // Base Tags Database
  const tagsData = [
    { id: 'hot-lead', name: 'Hot Lead', count: 24, icon: '🔥', color: 'orange' },
    { id: 'interested', name: 'Interested', count: 48, icon: '👍', color: 'blue' },
    { id: 'follow-up', name: 'Follow-up', count: 31, icon: '⏳', color: 'amber' },
    { id: 'demo-done', name: 'Demo Done', count: 18, icon: '🎯', color: 'purple' },
    { id: 'payment-pending', name: 'Payment Pending', count: 12, icon: '💳', color: 'indigo' },
    { id: 'not-interested', name: 'Not Interested', count: 19, icon: '✕', color: 'slate' },
    { id: 'high-intent', name: 'High Intent', count: 15, icon: '⚡', color: 'emerald' },
    { id: 'decision-maker', name: 'Decision Maker', count: 16, icon: '👑', color: 'rose' },
    { id: 'pricing-shared', name: 'Pricing Shared', count: 22, icon: '📄', color: 'cyan' }
  ];

  // Upcoming reminders stream (inspired by upcoming-reminders-widget from automate.simplefunnel.in)
  const upcomingRemindersList = [
    {
      id: 'rem-1',
      title: 'Product Demo & Architecture Call',
      leadName: 'Vikramaditya Rao',
      company: 'Apex Health Systems',
      phone: '+91 98234 11223',
      rep: 'Priya Patel',
      repAvatar: 'PP',
      type: 'Scheduled Meeting',
      typeColor: 'purple',
      timeFormatted: 'Today, 2:30 PM',
      status: 'urgent'
    },
    {
      id: 'rem-2',
      title: 'Commercial Discussion & Pricing Negotiation',
      leadName: 'Ananya Deshpande',
      company: 'Deshpande Logistics',
      phone: '+91 98450 33445',
      rep: 'Rahul Sharma',
      repAvatar: 'RS',
      type: 'Call Follow-up',
      typeColor: 'blue',
      timeFormatted: 'Today, 4:15 PM',
      status: 'pending'
    },
    {
      id: 'rem-3',
      title: 'Contract Agreement Review & Payment Link',
      leadName: 'Gaurav Khandelwal',
      company: 'Rajasthan Granites',
      phone: '+91 98112 77889',
      rep: 'Aman Gupta',
      repAvatar: 'AG',
      type: 'WhatsApp Outreach',
      typeColor: 'emerald',
      timeFormatted: 'Today, 5:45 PM',
      status: 'pending'
    },
    {
      id: 'rem-4',
      title: 'WhatsApp Automation Onboarding Sync',
      leadName: 'Suresh Menon',
      company: 'Menon Exports Cochin',
      phone: '+91 98765 22110',
      rep: 'Priya Patel',
      repAvatar: 'PP',
      type: 'Scheduled Meeting',
      typeColor: 'purple',
      timeFormatted: 'Tomorrow, 11:00 AM',
      status: 'upcoming'
    },
    {
      id: 'rem-5',
      title: 'Initial Discovery & Flow Requirements',
      leadName: 'Kunal Singhania',
      company: 'Singhania Real Estate',
      phone: '+91 98901 44556',
      rep: 'Rohit Verma',
      repAvatar: 'RV',
      type: 'Call Follow-up',
      typeColor: 'blue',
      timeFormatted: 'Tomorrow, 3:30 PM',
      status: 'upcoming'
    }
  ];

  // Daily activity trend points for visual sparkline / area chart (inspired by message-analytics)
  const activityTrendData = [
    { day: 'Sep 1', calls: 18, whatsapp: 32, demos: 3, total: 53 },
    { day: 'Sep 5', calls: 24, whatsapp: 45, demos: 4, total: 73 },
    { day: 'Sep 10', calls: 20, whatsapp: 38, demos: 3, total: 61 },
    { day: 'Sep 15', calls: 32, whatsapp: 58, demos: 6, total: 96 },
    { day: 'Sep 20', calls: 28, whatsapp: 52, demos: 5, total: 85 },
    { day: 'Sep 24', calls: 42, whatsapp: 78, demos: 8, total: 128 },
    { day: 'Sep 27', calls: 36, whatsapp: 69, demos: 7, total: 112 }
  ];

  // Detailed sample leads for drill down drawer
  const sampleLeadsList = [
    { id: 101, name: 'Vikas Malhotra', company: 'Malhotra Logistics', phone: '+91 98112 34567', stage: 'Negotiation', rep: 'Rahul Sharma', source: 'Facebook Ads', tag: 'Hot Lead', tagColor: 'orange', value: '₹45,000', followUp: 'Overdue (Yesterday)', followUpStatus: 'overdue' },
    { id: 102, name: 'Neha Chawla', company: 'Aura Aesthetics Clinic', phone: '+91 98223 45678', stage: 'Demo Scheduled', rep: 'Priya Patel', source: 'Instagram Ads', tag: 'Interested', tagColor: 'blue', value: '₹60,000', followUp: 'Due Today 2:30 PM', followUpStatus: 'due-today' },
    { id: 103, name: 'Arunav Sengupta', company: 'Bengal FinServe', phone: '+91 98334 56789', stage: 'Demo Done', rep: 'Priya Patel', source: 'Google Ads', tag: 'Demo Done', tagColor: 'purple', value: '₹1,20,000', followUp: 'Demo Done - No Follow-up', followUpStatus: 'no-next' },
    { id: 104, name: 'Rajeev Nair', company: 'Kerala Spices Export', phone: '+91 98445 67890', stage: 'Won', rep: 'Rahul Sharma', source: 'Referral', tag: 'Payment Pending', tagColor: 'indigo', value: '₹85,000', followUp: 'Completed Today', followUpStatus: 'completed' },
    { id: 105, name: 'Kavita Joshi', company: 'EduPrime Classes', phone: '+91 98556 78901', stage: 'Contacted', rep: 'Aman Gupta', source: 'WhatsApp Inbound', tag: 'Hot Lead', tagColor: 'orange', value: '₹35,000', followUp: 'Overdue (3 Days)', followUpStatus: 'overdue' },
    { id: 106, name: 'Harsh Agarwal', company: 'Zenith Tech Solutions', phone: '+91 98667 89012', stage: 'New Lead', rep: 'Unassigned', source: 'Organic / Website', tag: 'Hot Lead', tagColor: 'orange', value: '₹75,000', followUp: 'No Follow-up Set', followUpStatus: 'no-followup' },
    { id: 107, name: 'Deepak Rao', company: 'Apex Dental Care', phone: '+91 98778 90123', stage: 'Interested', rep: 'Rohit Verma', source: 'Facebook Ads', tag: 'Pricing Shared', tagColor: 'cyan', value: '₹40,000', followUp: 'Tomorrow 11:00 AM', followUpStatus: 'upcoming' },
    { id: 108, name: 'Swati Deshmukh', company: 'Maharashtra Motors', phone: '+91 98889 01234', stage: 'Negotiation', rep: 'Aman Gupta', source: 'Google Ads', tag: 'High Intent', tagColor: 'emerald', value: '₹1,50,000', followUp: 'Due Today 4:00 PM', followUpStatus: 'due-today' },
    { id: 109, name: 'Manish Tiwari', company: 'Varanasi Weaves', phone: '+91 98990 12345', stage: 'Contacted', rep: 'Rohit Verma', source: 'Instagram Ads', tag: 'Follow-up', tagColor: 'amber', value: '₹25,000', followUp: 'No Activity 8 Days', followUpStatus: 'stuck' },
    { id: 110, name: 'Pooja Bhatia', company: 'CloudKitchen Hub', phone: '+91 98101 23456', stage: 'Won', rep: 'Priya Patel', source: 'Referral', tag: 'Decision Maker', tagColor: 'rose', value: '₹95,000', followUp: 'Completed Today', followUpStatus: 'completed' },
    { id: 111, name: 'Sanjay Rawat', company: 'Doon Valley Solar', phone: '+91 98212 34567', stage: 'Demo Done', rep: 'Rahul Sharma', source: 'Webinar', tag: 'Demo Done', tagColor: 'purple', value: '₹1,10,000', followUp: 'In 3 Days', followUpStatus: 'upcoming' },
    { id: 112, name: 'Anita Kulkarni', company: 'Pune Health Diagnostics', phone: '+91 98323 45678', stage: 'New Lead', rep: 'Unassigned', source: 'Facebook Ads', tag: 'Hot Lead', tagColor: 'orange', value: '₹55,000', followUp: 'No Follow-up Set', followUpStatus: 'no-followup' }
  ];

  /**
   * Main calculation engine that reacts to global filters:
   */
  function getDashboardData(filters = {}) {
    const {
      dateRange = 'last-30-days',
      pipeline = 'all',
      salesperson = 'all',
      source = 'all',
      tag = 'all'
    } = filters;

    // Multiplier based on date range for realistic numbers
    let multiplier = 1.0;
    let periodLabel = 'vs previous 30 days';

    switch (dateRange) {
      case 'today':
        multiplier = 0.08;
        periodLabel = 'vs yesterday';
        break;
      case 'yesterday':
        multiplier = 0.07;
        periodLabel = 'vs day before';
        break;
      case 'last-7-days':
        multiplier = 0.28;
        periodLabel = 'vs previous 7 days';
        break;
      case 'last-30-days':
        multiplier = 1.0;
        periodLabel = 'vs previous 30 days';
        break;
      case 'this-month':
        multiplier = 0.88;
        periodLabel = 'vs last month';
        break;
      case 'last-month':
        multiplier = 0.94;
        periodLabel = 'vs 2 months ago';
        break;
      case 'custom':
        multiplier = 0.65;
        periodLabel = 'for custom window';
        break;
      default:
        multiplier = 1.0;
    }

    if (salesperson !== 'all') multiplier *= 0.32;
    if (source !== 'all') multiplier *= 0.38;
    if (tag !== 'all') multiplier *= 0.25;

    // 1. TOP 8 KPIS CALCULATION
    const totalLeads = Math.max(12, Math.round(1248 * multiplier));
    const newLeads = Math.max(4, Math.round(84 * (dateRange === 'today' ? 1.0 : multiplier)));
    const qualifiedLeads = Math.max(5, Math.round(376 * multiplier));
    const dealsWon = Math.max(2, Math.round(92 * multiplier));
    const totalSalesNum = Math.max(25000, Math.round(485000 * multiplier));
    const conversionRate = totalLeads > 0 ? ((dealsWon / totalLeads) * 100).toFixed(1) : '0.0';
    const pendingFollowups = Math.max(4, Math.round(126 * multiplier));
    const overdueFollowups = Math.max(2, Math.round(27 * multiplier));

    // 2. PIPELINE FUNNEL CALCULATION
    const activePipelineKey = (pipeline === 'all' || !pipelineDefinitions[pipeline]) ? 'sales-core' : pipeline;
    const basePipeline = pipelineDefinitions[activePipelineKey];

    const stagesWithStats = basePipeline.stages.map((st, idx, arr) => {
      const stageLeads = Math.max(1, Math.round(st.baseLeads * multiplier));
      let nextStageConversion = null;
      let nextStageName = null;

      if (idx < arr.length - 1) {
        const nextBase = arr[idx + 1].baseLeads;
        const nextCount = Math.max(1, Math.round(nextBase * multiplier));
        nextStageConversion = Math.min(100, Math.round((nextCount / stageLeads) * 100));
        nextStageName = arr[idx + 1].name;
      }

      return {
        id: st.id,
        name: st.name,
        leads: stageLeads,
        avgTime: st.avgTime,
        color: st.color,
        nextConversion: nextStageConversion,
        nextStageName: nextStageName
      };
    });

    // 3. LEAD CONVERSION JOURNEY (TOTAL LEADS -> DEMOS -> SALES)
    const funnelLeads = Math.max(20, Math.round(500 * multiplier));
    const funnelDemos = Math.max(8, Math.round(180 * multiplier));
    const funnelSales = Math.max(2, Math.round(54 * multiplier));

    const leadToDemoRate = ((funnelDemos / funnelLeads) * 100).toFixed(1);
    const demoToSaleRate = ((funnelSales / funnelDemos) * 100).toFixed(1);
    const leadToSaleRate = ((funnelSales / funnelLeads) * 100).toFixed(1);

    // 4. FOLLOW-UP OVERVIEW (6 actionable metrics)
    const followups = {
      dueToday: Math.max(2, Math.round(34 * multiplier)),
      overdue: Math.max(1, Math.round(18 * multiplier)),
      completedToday: Math.max(3, Math.round(42 * multiplier)),
      noFollowup: Math.max(2, Math.round(27 * multiplier)),
      noNextFollowup: Math.max(1, Math.round(19 * multiplier)),
      upcoming: Math.max(5, Math.round(76 * multiplier))
    };

    // 5. ATTENTION REQUIRED (Actionable Bottlenecks)
    const needsAttention = [
      { id: 'hot-not-contacted', label: 'Hot Leads Not Contacted', count: Math.max(1, Math.round(14 * multiplier)), severity: 'high', filterParam: 'hot-uncontacted', icon: '🔥' },
      { id: 'overdue-followups', label: 'Overdue Follow-ups', count: Math.max(2, Math.round(27 * multiplier)), severity: 'high', filterParam: 'overdue', icon: '⚠️' },
      { id: 'demo-no-followup', label: 'Demo Done – No Follow-up', count: Math.max(1, Math.round(11 * multiplier)), severity: 'medium', filterParam: 'demo-no-followup', icon: '🎯' },
      { id: 'stuck-in-stage', label: 'Deals Stuck in Same Stage (>10 Days)', count: Math.max(1, Math.round(19 * multiplier)), severity: 'medium', filterParam: 'stuck', icon: '⏳' },
      { id: 'unassigned-leads', label: 'Unassigned Leads', count: Math.max(1, Math.round(8 * multiplier)), severity: 'high', filterParam: 'unassigned', icon: '👤' },
      { id: 'no-activity-7d', label: 'No Activity in Last 7 Days', count: Math.max(2, Math.round(23 * multiplier)), severity: 'medium', filterParam: 'inactive', icon: '💤' }
    ];

    // 6. SALES TEAM PERFORMANCE
    let teamList = teamMembersData.map(member => {
      const assigned = Math.max(5, Math.round(member.assigned * multiplier));
      const contacted = Math.max(3, Math.round(member.contacted * multiplier));
      const demos = Math.max(2, Math.round(member.demos * multiplier));
      const won = Math.max(1, Math.round(member.won * multiplier));
      const overdue = Math.max(0, Math.round(member.overdue * multiplier));
      const conv = assigned > 0 ? ((won / assigned) * 100).toFixed(1) : member.conversion;

      return {
        ...member,
        assigned,
        contacted,
        demos,
        won,
        conversion: conv,
        overdue
      };
    });

    let selectedSalespersonSummary = null;
    if (salesperson !== 'all') {
      const match = teamList.find(t => t.id === salesperson);
      selectedSalespersonSummary = match || teamList[0];
    } else {
      selectedSalespersonSummary = {
        name: 'All Team Members',
        assigned: teamList.reduce((acc, t) => acc + t.assigned, 0),
        contacted: teamList.reduce((acc, t) => acc + t.contacted, 0),
        demos: teamList.reduce((acc, t) => acc + t.demos, 0),
        won: teamList.reduce((acc, t) => acc + t.won, 0),
        conversion: (teamList.reduce((acc, t) => acc + t.won, 0) / teamList.reduce((acc, t) => acc + t.assigned, 0) * 100).toFixed(1),
        overdue: teamList.reduce((acc, t) => acc + t.overdue, 0)
      };
    }

    // 7. LEAD SOURCES PERFORMANCE (Calculate Donut Angles)
    const sources = leadSourcesData.map(src => {
      const leads = Math.max(2, Math.round(src.leads * multiplier));
      const qualified = Math.max(1, Math.round(src.qualified * multiplier));
      const demos = Math.max(1, Math.round(src.demos * multiplier));
      const won = Math.max(0, Math.round(src.won * multiplier));
      const conv = leads > 0 ? ((won / leads) * 100).toFixed(1) : src.conversion;

      return {
        ...src,
        leads,
        qualified,
        demos,
        won,
        conversion: conv
      };
    });

    // Compute Donut percentages and angles
    const totalSourcesLeads = sources.reduce((acc, s) => acc + s.leads, 0);
    let cumulativeAngle = 0;
    const donutSlices = sources.map(src => {
      const percent = (src.leads / totalSourcesLeads) * 100;
      const angle = (src.leads / totalSourcesLeads) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;

      return {
        ...src,
        percent: percent.toFixed(1),
        startAngle,
        angle
      };
    });

    // 8. SALES ACTIVITIES
    const activities = {
      calls: Math.max(10, Math.round(184 * multiplier)),
      whatsapp: Math.max(25, Math.round(372 * multiplier)),
      emails: Math.max(8, Math.round(96 * multiplier)),
      demos: Math.max(3, Math.round(31 * multiplier)),
      tasks: Math.max(12, Math.round(142 * multiplier)),
      total: Math.max(50, Math.round(825 * multiplier)),
      trend: activityTrendData.map(p => ({
        ...p,
        total: Math.round(p.total * multiplier)
      }))
    };

    // 9. TAGS OVERVIEW
    const tags = tagsData.map(tg => ({
      ...tg,
      count: Math.max(1, Math.round(tg.count * multiplier))
    }));

    return {
      kpis: {
        totalLeads: { value: totalLeads.toLocaleString('en-IN'), raw: totalLeads, change: '+12.4%', isPositive: true, period: periodLabel },
        newLeads: { value: newLeads.toLocaleString('en-IN'), raw: newLeads, label: dateRange === 'today' ? "Today's new leads" : "New leads in period", isPositive: true },
        qualifiedLeads: { value: qualifiedLeads.toLocaleString('en-IN'), raw: qualifiedLeads, rate: `${((qualifiedLeads / totalLeads) * 100).toFixed(1)}% qualification` },
        dealsWon: { value: dealsWon.toLocaleString('en-IN'), raw: dealsWon, change: '+18.2%', isPositive: true },
        conversionRate: { value: `${conversionRate}%`, raw: parseFloat(conversionRate), sub: 'Overall Lead → Won' },
        totalSales: { value: '₹' + totalSalesNum.toLocaleString('en-IN'), raw: totalSalesNum, change: '+14.8%', isPositive: true },
        pendingFollowups: { value: pendingFollowups.toLocaleString('en-IN'), raw: pendingFollowups, sub: 'Scheduled follow-ups' },
        overdueFollowups: { value: overdueFollowups.toLocaleString('en-IN'), raw: overdueFollowups, isWarning: true, sub: 'Requires immediate action' }
      },
      pipelineFunnel: {
        activePipeline: basePipeline,
        stages: stagesWithStats
      },
      leadConversion: {
        leads: funnelLeads,
        demos: funnelDemos,
        sales: funnelSales,
        leadToDemoRate,
        demoToSaleRate,
        leadToSaleRate
      },
      followups,
      upcomingReminders: upcomingRemindersList,
      needsAttention,
      salesTeam: {
        summary: selectedSalespersonSummary,
        members: teamList
      },
      leadSources: {
        totalLeads: totalSourcesLeads,
        slices: donutSlices
      },
      activities,
      tags
    };
  }

  /**
   * Drill-down Lead Filter Helper
   */
  function getFilteredLeads(filterType, filterValue) {
    if (!filterType || filterType === 'all') return sampleLeadsList;

    return sampleLeadsList.filter(lead => {
      switch (filterType) {
        case 'stage':
          return lead.stage.toLowerCase().includes(filterValue.toLowerCase());
        case 'rep':
          return lead.rep.toLowerCase().includes(filterValue.toLowerCase());
        case 'source':
          return lead.source.toLowerCase().includes(filterValue.toLowerCase());
        case 'tag':
          return lead.tag.toLowerCase().includes(filterValue.toLowerCase());
        case 'followup':
          if (filterValue === 'overdue') return lead.followUpStatus === 'overdue';
          if (filterValue === 'due-today') return lead.followUpStatus === 'due-today';
          if (filterValue === 'completed') return lead.followUpStatus === 'completed';
          if (filterValue === 'no-followup') return lead.followUpStatus === 'no-followup';
          if (filterValue === 'no-next') return lead.followUpStatus === 'no-next';
          return true;
        case 'attention':
          if (filterValue === 'overdue') return lead.followUpStatus === 'overdue';
          if (filterValue === 'unassigned') return lead.rep === 'Unassigned';
          if (filterValue === 'hot-uncontacted') return lead.tag === 'Hot Lead' && lead.stage === 'New Lead';
          if (filterValue === 'demo-no-followup') return lead.stage === 'Demo Done' && lead.followUpStatus === 'no-next';
          if (filterValue === 'stuck') return lead.followUpStatus === 'stuck';
          return true;
        case 'kpi':
          if (filterValue === 'qualified') return lead.stage !== 'New Lead';
          if (filterValue === 'won') return lead.stage === 'Won';
          if (filterValue === 'overdue') return lead.followUpStatus === 'overdue';
          if (filterValue === 'pending') return lead.followUpStatus !== 'completed';
          return true;
        default:
          return true;
      }
    });
  }

  return {
    filterOptions,
    pipelineDefinitions,
    getDashboardData,
    getFilteredLeads
  };

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SalesDataService;
}
