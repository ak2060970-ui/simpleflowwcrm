/**
 * Simple Floww Business Portal — Sales Dashboard Interactive Engine (v2 Pro)
 * Inspired by automate.simplefunnel.in SaaS design patterns
 * 
 * Includes SVG Donut Chart, Area Activity Sparkline, Upcoming Reminders Stream,
 * Dynamic Filters, Skeleton Loaders, and Drill-down Leads Drawer.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Global State
  const state = {
    filters: {
      dateRange: 'last-30-days',
      dateRangeLabel: 'Last 30 Days',
      pipeline: 'all',
      pipelineLabel: 'All Pipelines',
      salesperson: 'all',
      salespersonLabel: 'All Salespersons',
      source: 'all',
      sourceLabel: 'All Sources',
      tag: 'all',
      tagLabel: 'All Tags'
    },
    funnelPipeline: 'sales-core'
  };

  // Cache DOM containers
  const kpiGridEl = document.getElementById('kpi-grid');
  const funnelStagesEl = document.getElementById('funnel-stages-container');
  const funnelPipelineSelectBtn = document.getElementById('funnel-pipeline-select-btn');
  const leadConvBoxEl = document.getElementById('lead-conversion-content');
  const followupsGridEl = document.getElementById('followups-grid');
  const remindersStreamEl = document.getElementById('reminders-stream-list');
  const attentionListEl = document.getElementById('attention-list');
  const repSummaryStripEl = document.getElementById('rep-summary-strip');
  const salesTeamTableBodyEl = document.getElementById('sales-team-table-body');
  const sourceDonutSvgEl = document.getElementById('source-donut-svg');
  const donutCenterNumEl = document.getElementById('donut-center-num');
  const sourcesLegendGridEl = document.getElementById('sources-legend-grid');
  const activitiesSparklineSvgEl = document.getElementById('activities-sparkline-svg');
  const activitiesGridEl = document.getElementById('activities-grid');
  const activitiesTotalEl = document.getElementById('activities-total');
  const tagsCloudEl = document.getElementById('tags-cloud');

  // Drawer DOM
  const drawerBackdrop = document.getElementById('leads-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerTitleEl = document.getElementById('drawer-title');
  const drawerSubtitleEl = document.getElementById('drawer-subtitle');
  const drawerLeadsCountEl = document.getElementById('drawer-leads-count');
  const drawerLeadsListEl = document.getElementById('drawer-leads-list');

  // Filter Buttons
  const dateBtn = document.getElementById('filter-btn-date');
  const pipelineBtn = document.getElementById('filter-btn-pipeline');
  const salespersonBtn = document.getElementById('filter-btn-salesperson');
  const sourceBtn = document.getElementById('filter-btn-source');
  const tagBtn = document.getElementById('filter-btn-tag');
  const headerDateBtn = document.getElementById('header-date-btn');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const activeFiltersBadge = document.getElementById('active-filters-badge');

  /**
   * Main Render Pipeline
   */
  function refreshDashboard(withSkeleton = true) {
    if (withSkeleton) {
      applySkeletonStates();
    }

    setTimeout(() => {
      const data = SalesDataService.getDashboardData({
        dateRange: state.filters.dateRange,
        pipeline: state.filters.pipeline,
        salesperson: state.filters.salesperson,
        source: state.filters.source,
        tag: state.filters.tag
      });

      renderKPIs(data.kpis);
      renderSalesFunnel(data.pipelineFunnel);
      renderLeadConversion(data.leadConversion);
      renderFollowups(data.followups);
      renderUpcomingReminders(data.upcomingReminders);
      renderNeedsAttention(data.needsAttention);
      renderSalesTeam(data.salesTeam);
      renderLeadSourceDonut(data.leadSources);
      renderActivities(data.activities);
      renderTags(data.tags);
      updateFilterButtonsUI();

      removeSkeletonStates();
    }, withSkeleton ? 160 : 0);
  }

  function applySkeletonStates() {
    document.querySelectorAll('.kpi-card, .dashboard-card').forEach(el => {
      el.classList.add('skeleton-loading');
    });
  }

  function removeSkeletonStates() {
    document.querySelectorAll('.kpi-card, .dashboard-card').forEach(el => {
      el.classList.remove('skeleton-loading');
    });
  }

  /**
   * 1. Render Top 8 KPI Cards (with subtle top border & SaaS pills)
   */
  function renderKPIs(kpis) {
    if (!kpiGridEl) return;

    kpiGridEl.innerHTML = `
      <!-- 1. Total Leads -->
      <div class="kpi-card" data-action="kpi" data-param="total">
        <div class="kpi-head">
          <span class="kpi-label">Total Leads</span>
          <div class="kpi-icon-wrap blue">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
        </div>
        <div class="kpi-main-number">${kpis.totalLeads.value}</div>
        <div class="kpi-footer">
          <span class="kpi-trend positive">↑ ${kpis.totalLeads.change}</span>
          <span>${kpis.totalLeads.period}</span>
        </div>
      </div>

      <!-- 2. New Leads -->
      <div class="kpi-card" data-action="kpi" data-param="new">
        <div class="kpi-head">
          <span class="kpi-label">New Leads</span>
          <div class="kpi-icon-wrap green">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>
        <div class="kpi-main-number">${kpis.newLeads.value}</div>
        <div class="kpi-footer">
          <span class="kpi-trend positive">⚡ Active</span>
          <span>${kpis.newLeads.label}</span>
        </div>
      </div>

      <!-- 3. Qualified Leads -->
      <div class="kpi-card" data-action="kpi" data-param="qualified">
        <div class="kpi-head">
          <span class="kpi-label">Qualified Leads</span>
          <div class="kpi-icon-wrap purple">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          </div>
        </div>
        <div class="kpi-main-number">${kpis.qualifiedLeads.value}</div>
        <div class="kpi-footer">
          <span class="kpi-trend positive">${kpis.qualifiedLeads.rate}</span>
        </div>
      </div>

      <!-- 4. Deals Won -->
      <div class="kpi-card" data-action="kpi" data-param="won">
        <div class="kpi-head">
          <span class="kpi-label">Deals Won</span>
          <div class="kpi-icon-wrap orange">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
        </div>
        <div class="kpi-main-number">${kpis.dealsWon.value}</div>
        <div class="kpi-footer">
          <span class="kpi-trend positive">↑ ${kpis.dealsWon.change}</span>
          <span>vs previous period</span>
        </div>
      </div>

      <!-- 5. Conversion Rate -->
      <div class="kpi-card" data-action="kpi" data-param="won">
        <div class="kpi-head">
          <span class="kpi-label">Conversion Rate</span>
          <div class="kpi-icon-wrap amber">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          </div>
        </div>
        <div class="kpi-main-number">${kpis.conversionRate.value}</div>
        <div class="kpi-footer">
          <span>${kpis.conversionRate.sub}</span>
        </div>
      </div>

      <!-- 6. Total Sales -->
      <div class="kpi-card" data-action="kpi" data-param="won">
        <div class="kpi-head">
          <span class="kpi-label">Total Sales</span>
          <div class="kpi-icon-wrap orange">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
        </div>
        <div class="kpi-main-number">${kpis.totalSales.value}</div>
        <div class="kpi-footer">
          <span class="kpi-trend positive">↑ ${kpis.totalSales.change}</span>
          <span>vs previous period</span>
        </div>
      </div>

      <!-- 7. Pending Follow-ups -->
      <div class="kpi-card" data-action="followup" data-param="pending">
        <div class="kpi-head">
          <span class="kpi-label">Pending Follow-ups</span>
          <div class="kpi-icon-wrap blue">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>
        <div class="kpi-main-number">${kpis.pendingFollowups.value}</div>
        <div class="kpi-footer">
          <span>${kpis.pendingFollowups.sub}</span>
        </div>
      </div>

      <!-- 8. Overdue Follow-ups (Subtle warning, no aggressive red) -->
      <div class="kpi-card kpi-warning" data-action="followup" data-param="overdue">
        <div class="kpi-head">
          <span class="kpi-label">Overdue Follow-ups</span>
          <div class="kpi-icon-wrap rose">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
        </div>
        <div class="kpi-main-number">${kpis.overdueFollowups.value}</div>
        <div class="kpi-footer">
          <span class="kpi-trend warning-badge">⚠️ Action Required</span>
          <span>${kpis.overdueFollowups.sub}</span>
        </div>
      </div>
    `;

    kpiGridEl.querySelectorAll('.kpi-card').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.getAttribute('data-action');
        const param = card.getAttribute('data-param');
        openLeadsDrawer(action, param, `Filtered Leads: ${card.querySelector('.kpi-label').textContent}`);
      });
    });
  }

  /**
   * 2. Render Sales Funnel Stages
   */
  function renderSalesFunnel(pipelineFunnel) {
    if (!funnelStagesEl) return;

    if (!pipelineFunnel.stages || pipelineFunnel.stages.length === 0) {
      funnelStagesEl.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--sf-text-muted); width: 100%;">
          Select a pipeline to view funnel performance.
        </div>`;
      return;
    }

    const maxLeads = Math.max(...pipelineFunnel.stages.map(s => s.leads), 1);

    funnelStagesEl.innerHTML = pipelineFunnel.stages.map(stage => {
      const barPercent = Math.min(100, Math.max(8, Math.round((stage.leads / maxLeads) * 100)));

      return `
        <div class="funnel-stage-card" data-action="stage" data-param="${stage.name}">
          <div>
            <div class="funnel-stage-name" title="${stage.name}">${stage.name}</div>
            <div class="funnel-stage-count">${stage.leads.toLocaleString('en-IN')}</div>
            <div class="funnel-stage-sub">Leads in stage</div>
            <div style="height: 3px; background: #e2e8f0; border-radius: 2px; margin-top: 6px; overflow: hidden;">
              <div style="height: 100%; width: ${barPercent}%; background: ${stage.color || 'var(--sf-primary)'}; border-radius: 2px;"></div>
            </div>
          </div>

          <div class="funnel-stage-conversion">
            ${stage.nextConversion !== null ? `
              <div class="conversion-pill">
                <span>↓ ${stage.nextConversion}%</span>
              </div>
              <div class="stage-time">Avg: ${stage.avgTime}</div>
            ` : `
              <div class="conversion-pill" style="color: var(--sf-green);">
                <span>★ Closed Won</span>
              </div>
              <div class="stage-time">Avg: ${stage.avgTime}</div>
            `}
          </div>
        </div>
      `;
    }).join('');

    funnelStagesEl.querySelectorAll('.funnel-stage-card').forEach(card => {
      card.addEventListener('click', () => {
        const stageName = card.getAttribute('data-param');
        openLeadsDrawer('stage', stageName, `Pipeline Stage: ${stageName}`);
      });
    });
  }

  /**
   * 3. Render Lead Conversion Flow
   */
  function renderLeadConversion(conv) {
    if (!leadConvBoxEl) return;

    leadConvBoxEl.innerHTML = `
      <div class="conversion-flow-box">
        <div class="milestones-strip">
          <div class="milestone-node" data-action="kpi" data-param="total" style="cursor: pointer;">
            <div class="m-label">TOTAL LEADS</div>
            <div class="m-val">${conv.leads}</div>
          </div>
          <div class="milestone-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div class="milestone-node" data-action="stage" data-param="Demo" style="cursor: pointer;">
            <div class="m-label">DEMOS</div>
            <div class="m-val">${conv.demos}</div>
          </div>
          <div class="milestone-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
          <div class="milestone-node" data-action="stage" data-param="Won" style="cursor: pointer;">
            <div class="m-label">SALES</div>
            <div class="m-val">${conv.sales}</div>
          </div>
        </div>

        <div class="conversion-rates-grid">
          <div class="conv-metric-card">
            <div class="cm-label">Lead → Demo</div>
            <div class="cm-rate">${conv.leadToDemoRate}%</div>
          </div>
          <div class="conv-metric-card">
            <div class="cm-label">Demo → Sale</div>
            <div class="cm-rate">${conv.demoToSaleRate}%</div>
          </div>
          <div class="conv-metric-card highlight">
            <div class="cm-label">Lead → Sale</div>
            <div class="cm-rate">${conv.leadToSaleRate}%</div>
          </div>
        </div>

        <div class="conv-explain">
          Out of <strong>${conv.leads} leads</strong>, <strong>${conv.demos} reached demos</strong> (${conv.leadToDemoRate}%) and <strong>${conv.sales} converted to deals</strong> (${conv.demoToSaleRate}% demo close rate).
        </div>
      </div>
    `;

    leadConvBoxEl.querySelectorAll('.milestone-node').forEach(node => {
      node.addEventListener('click', () => {
        const action = node.getAttribute('data-action');
        const param = node.getAttribute('data-param');
        openLeadsDrawer(action, param, `Conversion Milestone: ${node.querySelector('.m-label').textContent}`);
      });
    });
  }

  /**
   * 4. Render Follow-up Overview (6 Clickable Cards)
   */
  function renderFollowups(fu) {
    if (!followupsGridEl) return;

    followupsGridEl.innerHTML = `
      <div class="followup-card" data-action="followup" data-param="due-today">
        <div class="fu-title">Due Today</div>
        <div class="fu-count">${fu.dueToday}</div>
        <span class="fu-action-link">View Leads →</span>
      </div>

      <div class="followup-card card-overdue" data-action="followup" data-param="overdue">
        <div class="fu-title">Overdue</div>
        <div class="fu-count">${fu.overdue}</div>
        <span class="fu-action-link" style="color: #b45309;">Prioritize →</span>
      </div>

      <div class="followup-card" data-action="followup" data-param="completed">
        <div class="fu-title">Completed Today</div>
        <div class="fu-count" style="color: var(--sf-green);">${fu.completedToday}</div>
        <span class="fu-action-link" style="color: var(--sf-green);">View Done →</span>
      </div>

      <div class="followup-card" data-action="followup" data-param="no-followup">
        <div class="fu-title">No Follow-up Set</div>
        <div class="fu-count">${fu.noFollowup}</div>
        <span class="fu-action-link">Assign Date →</span>
      </div>

      <div class="followup-card" data-action="followup" data-param="no-next">
        <div class="fu-title">No Next Follow-up</div>
        <div class="fu-count">${fu.noNextFollowup}</div>
        <span class="fu-action-link">Schedule →</span>
      </div>

      <div class="followup-card" data-action="followup" data-param="upcoming">
        <div class="fu-title">Upcoming</div>
        <div class="fu-count">${fu.upcoming}</div>
        <span class="fu-action-link">Pipeline View →</span>
      </div>
    `;

    followupsGridEl.querySelectorAll('.followup-card').forEach(card => {
      card.addEventListener('click', () => {
        const param = card.getAttribute('data-param');
        openLeadsDrawer('followup', param, `Follow-up Filter: ${card.querySelector('.fu-title').textContent}`);
      });
    });
  }

  /**
   * 4b. Render Upcoming Follow-ups Stream (Inspired by automate.simplefunnel.in upcoming-reminders-widget)
   */
  function renderUpcomingReminders(reminders) {
    if (!remindersStreamEl) return;

    if (!reminders || reminders.length === 0) {
      remindersStreamEl.innerHTML = `<div style="text-align: center; color: var(--sf-text-muted); font-size: 12px; padding: 16px;">No upcoming follow-ups scheduled for this period</div>`;
      return;
    }

    remindersStreamEl.innerHTML = reminders.map(r => `
      <div class="reminder-row" data-action="followup" data-param="upcoming">
        <div class="rem-left">
          <div class="rem-avatar">${r.repAvatar}</div>
          <div class="rem-info">
            <div class="rem-lead-name">${r.leadName} <span style="font-weight: 400; color: var(--sf-text-muted); font-size: 11px;">• ${r.company}</span></div>
            <div class="rem-sub">${r.title}</div>
          </div>
        </div>

        <div class="rem-right">
          <span class="rem-type-pill ${r.typeColor}">${r.type}</span>
          <span class="rem-time-tag">⏰ ${r.timeFormatted}</span>
        </div>
      </div>
    `).join('');

    remindersStreamEl.querySelectorAll('.reminder-row').forEach(row => {
      row.addEventListener('click', () => {
        openLeadsDrawer('followup', 'upcoming', 'Scheduled Priority Follow-ups');
      });
    });
  }

  /**
   * 5. Render Needs Attention (Actionable items)
   */
  function renderNeedsAttention(items) {
    if (!attentionListEl) return;

    attentionListEl.innerHTML = items.map(item => `
      <div class="attention-item" data-action="attention" data-param="${item.filterParam}">
        <div class="attention-left">
          <span class="attention-icon-span">${item.icon || '⚠️'}</span>
          <span class="attention-label">${item.label}</span>
        </div>
        <div class="attention-right">
          <span class="attention-count ${item.count > 15 ? 'high-count' : ''}">${item.count}</span>
          <svg class="attention-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    `).join('');

    attentionListEl.querySelectorAll('.attention-item').forEach(item => {
      item.addEventListener('click', () => {
        const param = item.getAttribute('data-param');
        const label = item.querySelector('.attention-label').textContent;
        openLeadsDrawer('attention', param, `Needs Attention: ${label}`);
      });
    });
  }

  /**
   * 6. Render Sales Team Performance Table & Summary
   */
  function renderSalesTeam(team) {
    if (repSummaryStripEl) {
      repSummaryStripEl.innerHTML = `
        <div class="rep-summary-item">
          <div class="rsi-label">Assigned Leads</div>
          <div class="rsi-val">${team.summary.assigned}</div>
        </div>
        <div class="rep-summary-item">
          <div class="rsi-label">Contacted</div>
          <div class="rsi-val">${team.summary.contacted}</div>
        </div>
        <div class="rep-summary-item">
          <div class="rsi-label">Demos Done</div>
          <div class="rsi-val">${team.summary.demos}</div>
        </div>
        <div class="rep-summary-item">
          <div class="rsi-label">Deals Won</div>
          <div class="rsi-val">${team.summary.won}</div>
        </div>
        <div class="rep-summary-item">
          <div class="rsi-label">Conversion %</div>
          <div class="rsi-val" style="color: var(--sf-green);">${team.summary.conversion}%</div>
        </div>
        <div class="rep-summary-item">
          <div class="rsi-label">Overdue</div>
          <div class="rsi-val" style="color: #b45309;">${team.summary.overdue}</div>
        </div>
      `;
    }

    if (salesTeamTableBodyEl) {
      salesTeamTableBodyEl.innerHTML = team.members.map(m => `
        <tr data-rep-id="${m.id}" data-rep-name="${m.name}">
          <td>
            <div class="rep-profile-cell">
              <span class="rep-avatar-sm">${m.avatar}</span>
              <div>
                <span class="rep-name-txt">${m.name}</span>
                ${m.status === 'top-performer' ? '<span style="font-size: 10px; background: #fef3c7; color: #b45309; border-radius: 4px; padding: 1px 4px; font-weight: 700; margin-left: 4px;">Top</span>' : ''}
              </div>
            </div>
          </td>
          <td><strong>${m.assigned}</strong></td>
          <td>${m.contacted}</td>
          <td>${m.demos}</td>
          <td><strong>${m.won}</strong></td>
          <td><span class="conv-pill-badge">${m.conversion}%</span></td>
          <td><span class="overdue-count-badge">${m.overdue}</span></td>
        </tr>
      `).join('');

      salesTeamTableBodyEl.querySelectorAll('tr').forEach(row => {
        row.addEventListener('click', () => {
          const repId = row.getAttribute('data-rep-id');
          const repName = row.getAttribute('data-rep-name');

          state.filters.salesperson = repId;
          state.filters.salespersonLabel = repName;
          showToast(`Filtered dashboard by: ${repName}`);
          refreshDashboard();
        });
      });
    }
  }

  /**
   * 7. Render Lead Source Performance WITH SVG DONUT (Inspired by automate.simplefunnel.in contact-source-donut)
   */
  function renderLeadSourceDonut(leadSources) {
    if (!sourceDonutSvgEl || !sourcesLegendGridEl) return;

    if (donutCenterNumEl) {
      donutCenterNumEl.textContent = leadSources.totalLeads.toLocaleString('en-IN');
    }

    // Generate SVG path arcs for the donut
    const radius = 68;
    const strokeWidth = 20;
    const center = 85;
    const circumference = 2 * Math.PI * radius;

    let accumulatedPercent = 0;

    const circlesSvg = leadSources.slices.map(slice => {
      const strokeDash = (slice.percent / 100) * circumference;
      const strokeGap = circumference - strokeDash;
      const offset = (accumulatedPercent / 100) * circumference;
      accumulatedPercent += parseFloat(slice.percent);

      return `
        <circle 
          cx="${center}" cy="${center}" r="${radius}" 
          fill="none" 
          stroke="${slice.color}" 
          stroke-width="${strokeWidth}" 
          stroke-dasharray="${strokeDash} ${strokeGap}" 
          stroke-dashoffset="-${offset}"
          style="cursor: pointer; transition: stroke-width 0.15s ease;"
          onmouseover="this.setAttribute('stroke-width', '24')"
          onmouseout="this.setAttribute('stroke-width', '20')"
          data-source-name="${slice.name}"
        />
      `;
    }).join('');

    sourceDonutSvgEl.innerHTML = circlesSvg;

    // Render 2-Column Sources Legend Grid
    sourcesLegendGridEl.innerHTML = leadSources.slices.map(src => `
      <div class="source-legend-item" data-action="source" data-param="${src.name}">
        <div class="sli-left">
          <span class="sli-dot" style="background-color: ${src.color};"></span>
          <span class="sli-name" title="${src.name}">${src.name}</span>
        </div>
        <div class="sli-right">
          <span>${src.leads}</span>
          <span style="color: var(--sf-primary); font-size: 11px;">(${src.percent}%)</span>
        </div>
      </div>
    `).join('');

    sourcesLegendGridEl.querySelectorAll('.source-legend-item').forEach(item => {
      item.addEventListener('click', () => {
        const srcName = item.getAttribute('data-param');
        openLeadsDrawer('source', srcName, `Source Leads: ${srcName}`);
      });
    });
  }

  /**
   * 8. Render Sales Activities + Sparkline Area Chart (Inspired by automate.simplefunnel.in message-analytics)
   */
  function renderActivities(act) {
    if (!activitiesGridEl) return;

    activitiesGridEl.innerHTML = `
      <div class="activity-tile">
        <div class="act-title">📞 Calls</div>
        <div class="act-count">${act.calls}</div>
      </div>
      <div class="activity-tile">
        <div class="act-title">💬 WhatsApp</div>
        <div class="act-count">${act.whatsapp}</div>
      </div>
      <div class="activity-tile">
        <div class="act-title">✉️ Emails</div>
        <div class="act-count">${act.emails}</div>
      </div>
      <div class="activity-tile">
        <div class="act-title">🎯 Demos</div>
        <div class="act-count">${act.demos}</div>
      </div>
      <div class="activity-tile">
        <div class="act-title">✓ Tasks</div>
        <div class="act-count">${act.tasks}</div>
      </div>
      <div class="activity-tile" style="background: var(--sf-primary-light); border-color: var(--sf-primary-border);">
        <div class="act-title" style="color: var(--sf-primary);">Velocity Index</div>
        <div class="act-count" style="color: var(--sf-primary);">96.8%</div>
      </div>
    `;

    if (activitiesTotalEl) {
      activitiesTotalEl.textContent = `${act.total.toLocaleString('en-IN')} Total Touchpoints Recorded`;
    }

    // Render SVG Area Sparkline Chart
    if (activitiesSparklineSvgEl && act.trend) {
      const width = 460;
      const height = 75;
      const maxVal = Math.max(...act.trend.map(t => t.total), 1);
      const stepX = width / (act.trend.length - 1);

      const points = act.trend.map((pt, i) => {
        const x = i * stepX;
        const y = height - ((pt.total / maxVal) * (height - 18)) - 8;
        return { x, y, ...pt };
      });

      // Construct path data
      let linePath = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpX1 = prev.x + (curr.x - prev.x) / 2;
        const cpX2 = cpX1;
        linePath += ` C ${cpX1} ${prev.y}, ${cpX2} ${curr.y}, ${curr.x} ${curr.y}`;
      }

      const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

      activitiesSparklineSvgEl.innerHTML = `
        <defs>
          <linearGradient id="actGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ea580c" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#ea580c" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <path d="${areaPath}" fill="url(#actGradient)" />
        <path d="${linePath}" fill="none" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round" />
        ${points.map(p => `
          <circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#ffffff" stroke="#ea580c" stroke-width="2" />
        `).join('')}
      `;
    }
  }

  /**
   * 9. Render Tags Overview
   */
  function renderTags(tags) {
    if (!tagsCloudEl) return;

    tagsCloudEl.innerHTML = tags.map(tag => `
      <div class="tag-chip ${state.filters.tag === tag.id ? 'active-tag' : ''}" data-action="tag" data-tag-id="${tag.id}" data-tag-name="${tag.name}">
        <span>${tag.icon || ''} ${tag.name}</span>
        <span class="tag-chip-count">${tag.count}</span>
      </div>
    `).join('');

    tagsCloudEl.querySelectorAll('.tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tagId = chip.getAttribute('data-tag-id');
        const tagName = chip.getAttribute('data-tag-name');

        if (state.filters.tag === tagId) {
          state.filters.tag = 'all';
          state.filters.tagLabel = 'All Tags';
        } else {
          state.filters.tag = tagId;
          state.filters.tagLabel = tagName;
        }

        showToast(`Filtered by tag: ${tagName}`);
        refreshDashboard();
      });
    });
  }

  /**
   * Update Filter Buttons UI Text & Active Badges
   */
  function updateFilterButtonsUI() {
    if (dateBtn) dateBtn.querySelector('.filter-text').textContent = state.filters.dateRangeLabel;
    if (pipelineBtn) pipelineBtn.querySelector('.filter-text').textContent = state.filters.pipelineLabel;
    if (salespersonBtn) salespersonBtn.querySelector('.filter-text').textContent = state.filters.salespersonLabel;
    if (sourceBtn) sourceBtn.querySelector('.filter-text').textContent = state.filters.sourceLabel;
    if (tagBtn) tagBtn.querySelector('.filter-text').textContent = state.filters.tagLabel;

    if (headerDateBtn) {
      const headerDateText = headerDateBtn.querySelector('.header-date-text');
      if (headerDateText) headerDateText.textContent = state.filters.dateRangeLabel;
    }

    let activeCount = 0;
    if (state.filters.dateRange !== 'last-30-days') activeCount++;
    if (state.filters.pipeline !== 'all') activeCount++;
    if (state.filters.salesperson !== 'all') activeCount++;
    if (state.filters.source !== 'all') activeCount++;
    if (state.filters.tag !== 'all') activeCount++;

    if (activeFiltersBadge) {
      if (activeCount > 0) {
        activeFiltersBadge.textContent = `${activeCount} Active`;
        activeFiltersBadge.style.display = 'inline-block';
      } else {
        activeFiltersBadge.style.display = 'none';
      }
    }
  }

  /**
   * Actionable Leads Drawer
   */
  function openLeadsDrawer(filterType, filterValue, title = 'Filtered Leads') {
    if (!drawerBackdrop) return;

    const leads = SalesDataService.getFilteredLeads(filterType, filterValue);

    if (drawerTitleEl) drawerTitleEl.textContent = title;
    if (drawerSubtitleEl) drawerSubtitleEl.textContent = `Displaying ${leads.length} leads matching criteria`;
    if (drawerLeadsCountEl) drawerLeadsCountEl.textContent = `${leads.length} Leads`;

    if (drawerLeadsListEl) {
      if (leads.length === 0) {
        drawerLeadsListEl.innerHTML = `
          <div style="padding: 40px 20px; text-align: center; color: var(--sf-text-muted);">
            No leads currently match this filter condition.
          </div>`;
      } else {
        drawerLeadsListEl.innerHTML = leads.map(l => `
          <div class="drawer-lead-card">
            <div class="dlc-top">
              <div>
                <span class="dlc-name">${l.name}</span>
                <span style="font-size: 11px; color: var(--sf-text-muted); margin-left: 6px;">• ${l.company}</span>
              </div>
              <span class="dlc-value">${l.value}</span>
            </div>
            <div class="dlc-meta">
              <span>📞 ${l.phone}</span>
              <span>👤 Rep: <strong>${l.rep}</strong></span>
              <span>🌐 ${l.source}</span>
              <span style="background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa; padding: 1px 6px; border-radius: 4px; font-weight: 600; font-size: 11px;">${l.tag}</span>
            </div>
            <div class="dlc-bottom">
              <span>Stage: <strong>${l.stage}</strong></span>
              <span class="dlc-followup">📅 ${l.followUp}</span>
            </div>
          </div>
        `).join('');
      }
    }

    drawerBackdrop.classList.add('open');
  }

  function closeLeadsDrawer() {
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
  }

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeLeadsDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeLeadsDrawer();
    });
  }

  /**
   * Filter Dropdowns Controller
   */
  function setupDropdown(btnId, menuId, onSelect) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.remove('show');
      });
      menu.classList.toggle('show');
    });

    menu.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const val = item.getAttribute('data-value');
        const text = item.textContent.trim();
        menu.classList.remove('show');
        onSelect(val, text);
      });
    });
  }

  // Setup dropdowns
  setupDropdown('filter-btn-date', 'date-menu', (val, text) => {
    state.filters.dateRange = val;
    state.filters.dateRangeLabel = text;
    refreshDashboard();
  });

  setupDropdown('header-date-btn', 'header-date-menu', (val, text) => {
    state.filters.dateRange = val;
    state.filters.dateRangeLabel = text;
    refreshDashboard();
  });

  setupDropdown('filter-btn-pipeline', 'pipeline-menu', (val, text) => {
    state.filters.pipeline = val;
    state.filters.pipelineLabel = text;
    refreshDashboard();
  });

  setupDropdown('funnel-pipeline-select-btn', 'funnel-pipeline-menu', (val, text) => {
    state.filters.pipeline = val;
    state.filters.pipelineLabel = text;
    if (funnelPipelineSelectBtn) {
      funnelPipelineSelectBtn.querySelector('span').textContent = text;
    }
    refreshDashboard();
  });

  setupDropdown('filter-btn-salesperson', 'salesperson-menu', (val, text) => {
    state.filters.salesperson = val;
    state.filters.salespersonLabel = text;
    refreshDashboard();
  });

  setupDropdown('team-salesperson-select-btn', 'team-salesperson-menu', (val, text) => {
    state.filters.salesperson = val;
    state.filters.salespersonLabel = text;
    refreshDashboard();
  });

  setupDropdown('filter-btn-source', 'source-menu', (val, text) => {
    state.filters.source = val;
    state.filters.sourceLabel = text;
    refreshDashboard();
  });

  setupDropdown('filter-btn-tag', 'tag-menu', (val, text) => {
    state.filters.tag = val;
    state.filters.tagLabel = text;
    refreshDashboard();
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  });

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      state.filters = {
        dateRange: 'last-30-days',
        dateRangeLabel: 'Last 30 Days',
        pipeline: 'all',
        pipelineLabel: 'All Pipelines',
        salesperson: 'all',
        salespersonLabel: 'All Salespersons',
        source: 'all',
        sourceLabel: 'All Sources',
        tag: 'all',
        tagLabel: 'All Tags'
      };
      showToast('Global filters reset to defaults');
      refreshDashboard();
    });
  }

  function showToast(msg) {
    let toast = document.getElementById('sf-dashboard-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sf-dashboard-toast';
      toast.className = 'sf-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
  const sidebarEl = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mobileMenuBtn = document.getElementById('mobile-bottom-menu-btn');

  function toggleMobileSidebar(force) {
    if (!sidebarEl) return;
    const shouldOpen = typeof force === 'boolean' ? force : !sidebarEl.classList.contains('mobile-open');
    if (shouldOpen) {
      sidebarEl.classList.add('mobile-open');
      if (sidebarOverlay) sidebarOverlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    } else {
      sidebarEl.classList.remove('mobile-open');
      if (sidebarOverlay) sidebarOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileSidebar();
    });
  }
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileSidebar();
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      toggleMobileSidebar(false);
    });
  }

  /* ==========================================================================
     ALL-IN-ONE CRM INTERACTION ENGINE
     ========================================================================== */
  
  // 1. View Navigation & Routing
  const topBreadcrumb = document.getElementById('top-breadcrumb');
  const navLinks = document.querySelectorAll('[data-view]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const viewName = link.getAttribute('data-view');
      const breadcrumb = link.getAttribute('data-breadcrumb');
      if (!viewName) return;

      // Update active links
      document.querySelectorAll('.sidebar__nav .nav-item, .sidebar__nav .nav-subitem').forEach(el => el.classList.remove('active'));
      link.classList.add('active');

      // Update breadcrumb
      if (topBreadcrumb && breadcrumb) {
        topBreadcrumb.textContent = breadcrumb;
      }

      // Switch view panel
      document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
      const targetPanel = document.getElementById(`view-${viewName}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        if (viewName === 'dashboard') {
          refreshDashboard(false);
        } else if (viewName === 'helpdesk') {
          if (window.renderHelpDeskAll) window.renderHelpDeskAll();
        } else if (viewName === 'knowledgebase') {
          if (window.renderKnowledgeBaseAll) window.renderKnowledgeBaseAll();
        } else if (viewName === 'referral') {
          if (window.switchReferralView) window.switchReferralView('partner');
        }
      }

      // Close mobile sidebar if open
      if (sidebarEl && window.innerWidth <= 900) {
        sidebarEl.classList.remove('mobile-open');
      }
    });
  });

  // 2. Submenu Accordions
  document.querySelectorAll('[data-toggle="submenu"]').forEach(parentItem => {
    parentItem.addEventListener('click', () => {
      const targetId = parentItem.getAttribute('data-target');
      const submenu = document.getElementById(targetId);
      if (submenu) {
        submenu.classList.toggle('open');
        parentItem.classList.toggle('open');
      }
    });
  });

  // 3. Theme Toggle (Dark / Light)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('sf-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('sf-theme', nextTheme);
      showToast(`Switched to ${nextTheme.toUpperCase()} mode`);
    });
  }

  // 4. Wallet Refresh Action
  const walletRefreshBtn = document.getElementById('wallet-refresh-btn');
  if (walletRefreshBtn) {
    walletRefreshBtn.addEventListener('click', () => {
      walletRefreshBtn.style.transform = 'rotate(360deg)';
      walletRefreshBtn.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        walletRefreshBtn.style.transform = 'none';
        showToast('Wallet balance synced: ₹1,056.51');
      }, 500);
    });
  }

  // 5. Inbox Chat Interactions
  const contactRows = document.querySelectorAll('.inbox-contact-row');
  const welcomeScreen = document.getElementById('inbox-welcome-screen');
  const activeChatScreen = document.getElementById('inbox-active-chat-screen');
  const chatHeaderName = document.getElementById('chat-header-name');
  const chatHeaderAvatar = document.getElementById('chat-header-avatar');
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatInputText = document.getElementById('chat-input-text');
  const chatSendBtn = document.getElementById('chat-send-msg-btn');
  const contactSearchInput = document.getElementById('inbox-contact-search');

  const chatHistories = {
    'Adnan Qureshi': [
      { text: 'Hello Abhinandan bhai, API webhook setup complete hua kya?', time: '6:27 pm', type: 'incoming' },
      { text: 'Haan Adnan, outgoing webhooks ready hain. Main test payload bhej raha hu.', time: '6:28 pm', type: 'outgoing' },
      { text: 'Update krdiya aapne', time: '6:29 pm', type: 'incoming' }
    ],
    'Abhinandan Kumar': [
      { text: 'Simple Floww WhatsApp automation system check', time: '5:50 pm', type: 'incoming' },
      { text: 'You: * Simple Floww is running smoothly on Cloud Meta API', time: '5:55 pm', type: 'outgoing' }
    ],
    'faiz57185': [
      { text: 'How do I start my own WhatsApp Marketing Agency?', time: '5:10 pm', type: 'incoming' },
      { text: 'You: [Interactive] 🚀 Start Your Own Agency with Simple Floww Whitelabel!', time: '5:14 pm', type: 'outgoing' }
    ],
    'Backend Support Team': [
      { text: '+91 79832 98464', time: '4:15 pm', type: 'incoming' },
      { text: 'Broadcasting template approval pending for festive sales.', time: '4:18 pm', type: 'incoming' }
    ],
    'Divya Agrawal': [
      { text: 'Can we get instant WhatsApp alerts for new leads?', time: '3:30 pm', type: 'incoming' },
      { text: 'Yes! Instant webhook & push notifications are active.', time: '3:34 pm', type: 'outgoing' },
      { text: 'Perfect', time: '3:36 pm', type: 'incoming' }
    ],
    'MR Singh': [
      { text: 'Can you send the plan brochure screenshot?', time: '2:30 pm', type: 'incoming' },
      { text: 'You: image (pricing_matrix.png)', time: '2:32 pm', type: 'outgoing' }
    ],
    'Satyam Singh': [
      { text: 'Lead auto-assignment round-robin kaam kar raha hai?', time: '12:05 pm', type: 'incoming' },
      { text: 'ho rha hai isse b', time: '12:10 pm', type: 'incoming' }
    ],
    'Rohan Verma': [
      { text: 'Hi, hume Simple Floww CRM ka live demo dekhna hai.', time: '11:40 am', type: 'incoming' },
      { text: 'Sure Rohan! Aap aaj sham 4 baje ya kal 11 baje available hain?', time: '11:42 am', type: 'outgoing' },
      { text: 'Demo scheduling link bhej do please', time: '11:45 am', type: 'incoming' }
    ],
    'TechSolutions Pvt Ltd': [
      { text: 'Meta Business Manager verification and display name approved.', time: '10:55 am', type: 'incoming' },
      { text: 'WABA Green Tick docs submitted', time: '11:02 am', type: 'incoming' }
    ],
    'Priya Sharma': [
      { text: 'Hi, enterprise plan mein kitne team members add kar sakte hain?', time: '10:20 am', type: 'incoming' },
      { text: 'You: Pricing PDF and ROI calculator sent', time: '10:28 am', type: 'outgoing' }
    ],
    'Vikas Malhotra': [
      { text: 'Hello, recharge failed in wallet yesterday night.', time: '09:42 am', type: 'incoming' },
      { text: 'Checking with billing team right away.', time: '09:46 am', type: 'outgoing' },
      { text: 'Payment gateway link generate kar dijiye', time: '09:50 am', type: 'incoming' }
    ],
    'Digital Growth Agency': [
      { text: 'White-label dashboard branding logo and primary colors updated.', time: 'Yesterday', type: 'incoming' },
      { text: 'Custom domain CNAME mapped. Please verify', time: 'Yesterday', type: 'incoming' }
    ],
    'Neha Gupta': [
      { text: 'Hello team, onboarding call kab schedule hoga?', time: 'Yesterday', type: 'incoming' },
      { text: 'You: Reminder for tomorrow 11 AM onboarding', time: 'Yesterday', type: 'outgoing' }
    ],
    'Karanveer Patel': [
      { text: 'Diwali promotional template meta se approved ho gaya hai.', time: 'Yesterday', type: 'incoming' },
      { text: 'Broadcast campaign for 25k users scheduled', time: 'Yesterday', type: 'incoming' }
    ],
    'SmartKart Ecommerce': [
      { text: 'Shopify order recovery webhook testing chal rahi thi.', time: 'Sep 28', type: 'incoming' },
      { text: 'Abandoned cart webhook trigger test successful', time: 'Sep 28', type: 'incoming' }
    ],
    'Amit Singhania': [
      { text: 'Hamara monthly plan expire hone wala hai agle hafte.', time: 'Sep 28', type: 'incoming' },
      { text: 'You: Plan renews on 1st October with discount', time: 'Sep 28', type: 'outgoing' }
    ],
    'Pooja Mishra': [
      { text: 'Namaste! AI chatbot training ke liye documentation chahiye thi.', time: 'Sep 27', type: 'incoming' },
      { text: 'AI chatbot setup guide share kijiyega', time: 'Sep 27', type: 'incoming' }
    ],
    'Global Trade Hub': [
      { text: 'We have multi-department sales & support executives.', time: 'Sep 27', type: 'incoming' },
      { text: 'Looking for 10 team seats with custom roles', time: 'Sep 27', type: 'incoming' }
    ]
  };

  contactRows.forEach(row => {
    row.addEventListener('click', () => {
      contactRows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const name = row.getAttribute('data-name');
      const avatar = row.getAttribute('data-avatar');

      if (welcomeScreen) welcomeScreen.style.display = 'none';
      if (activeChatScreen) activeChatScreen.classList.add('show');

      if (chatHeaderName) chatHeaderName.textContent = name;
      if (chatHeaderAvatar) chatHeaderAvatar.textContent = avatar;

      renderChatMessages(name);
    });
  });

  function renderChatMessages(name) {
    if (!chatMessagesContainer) return;
    const history = chatHistories[name] || [
      { text: `Conversation with ${name}`, time: 'Just now', type: 'incoming' }
    ];

    chatMessagesContainer.innerHTML = history.map(msg => `
      <div class="chat-bubble ${msg.type}">
        ${msg.text}
        <span class="chat-bubble-time">${msg.time} ${msg.type === 'outgoing' ? '· Read ✓✓' : ''}</span>
      </div>
    `).join('');
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }

  function sendChatMessage() {
    if (!chatInputText) return;
    const text = chatInputText.value.trim();
    if (!text) return;

    const currentContact = document.querySelector('.inbox-contact-row.active');
    const name = currentContact ? currentContact.getAttribute('data-name') : 'Adnan Qureshi';

    const newMsg = { text: text, time: 'Just now', type: 'outgoing' };
    if (!chatHistories[name]) chatHistories[name] = [];
    chatHistories[name].push(newMsg);

    renderChatMessages(name);
    chatInputText.value = '';

    // Simulated Auto-Reply / AI Agent Response
    setTimeout(() => {
      const replyMsg = {
        text: `🤖 [AI Auto-Reply]: Received your message! Simple Floww AI Agent is processing your request.`,
        time: 'Just now',
        type: 'incoming'
      };
      chatHistories[name].push(replyMsg);
      renderChatMessages(name);
    }, 1200);
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', sendChatMessage);
  }
  if (chatInputText) {
    chatInputText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  // Filter tabs (All / Active / Inactive)
  const filterTabs = document.querySelectorAll('.inbox-list-col .inbox-filter-tab');
  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filterType = tab.getAttribute('data-tab');

        contactRows.forEach(row => {
          const status = row.getAttribute('data-status') || 'active';
          if (filterType === 'all') {
            row.style.display = 'flex';
          } else if (filterType === status) {
            row.style.display = 'flex';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  // Filter contacts search
  if (contactSearchInput) {
    contactSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      contactRows.forEach(row => {
        const name = (row.getAttribute('data-name') || '').toLowerCase();
        const msg = (row.querySelector('.inbox-contact-preview')?.textContent || '').toLowerCase();
        if (name.includes(term) || msg.includes(term)) {
          row.style.display = 'flex';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
  // 6. Action Toasts for Other Modules
  const btnSaveAi = document.getElementById('btn-save-ai-agent');
  if (btnSaveAi) {
    btnSaveAi.addEventListener('click', () => {
      showToast('✓ AI Agent system prompt & knowledge base updated successfully!');
    });
  }

  const btnAddRule = document.getElementById('btn-add-assign-rule');
  if (btnAddRule) {
    btnAddRule.addEventListener('click', () => {
      showToast('✓ New Round-Robin rule added to active auto-assignment engine!');
    });
  }

  const btnCreateTicket = document.getElementById('btn-create-ticket');
  if (btnCreateTicket) {
    btnCreateTicket.addEventListener('click', () => {
      showToast('✓ Support Ticket created! Assigned to Tier-1 Support Agent.');
    });
  }

  const btnAddTask = document.getElementById('btn-add-task');
  if (btnAddTask) {
    btnAddTask.addEventListener('click', () => {
      showToast('✓ New follow-up reminder task scheduled!');
    });
  }

  const refCopyBtn = document.getElementById('ref-copy-btn');
  if (refCopyBtn) {
    refCopyBtn.addEventListener('click', () => {
      const link = document.getElementById('ref-link-text')?.textContent || 'https://connect.simplefloww.com/ref/ak9082';
      navigator.clipboard.writeText(link);
      showToast('✓ Referral Link copied to clipboard!');
    });
  }

  const btnWalletPayout = document.getElementById('btn-wallet-payout');
  if (btnWalletPayout) {
    btnWalletPayout.addEventListener('click', () => {
      showToast('✓ Payout requested: ₹1,056.51 will be credited within 2 hours!');
    });
  }

  const btnTestWebhook = document.getElementById('btn-test-webhook-ping');
  if (btnTestWebhook) {
    btnTestWebhook.addEventListener('click', () => {
      const tbody = document.getElementById('webhook-logs-table-body');
      if (tbody) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td><strong>test.ping</strong></td>
          <td>Just now</td>
          <td><span class="status-chip resolved">200 OK</span></td>
          <td>38ms</td>
          <td><button class="btn-secondary" style="font-size: 11px; padding: 2px 8px;">View JSON</button></td>
        `;
        tbody.insertBefore(newRow, tbody.firstChild);
      }
      showToast('✓ Outgoing Webhook test ping successfully delivered (HTTP 200 OK)!');
    });
  }

  const btnInviteTeam = document.getElementById('btn-invite-team-member');
  if (btnInviteTeam) {
    btnInviteTeam.addEventListener('click', () => {
      const email = prompt('Enter team member email to invite:');
      if (email) {
        showToast(`✓ Invitation link sent to ${email}`);
      }
    });
  }

  // =========================================================================
  // TASK MANAGEMENT & TEAM TO-DO ENGINE (Enterprise v4 with Subtasks & Drag-Drop)
  // =========================================================================
  // TASK MANAGEMENT & TEAM TO-DOS ENGINE (Interactive CRM Task System)
  // =========================================================================
  const STORAGE_KEY = 'simplefloww_tasks_v5';
  const STORAGE_TASK_TYPES_KEY = 'simplefloww_task_types_v5';

  let draggedTaskId = null;

  const LEAD_PHONE_MAP = {
    'Adnan Qureshi': '+91 98765 43210',
    'Abhinandan Kumar': '+91 95186 49420',
    'faiz57185': '+91 98111 22334',
    'Backend Support Team': '+91 79832 98464',
    'Divya Agrawal': '+91 99887 76655',
    'Rohan Verma': '+91 98234 11223',
    'Vikas Malhotra': '+91 98991 77654',
    'Karanveer Patel': '+91 98250 88990',
    'TechSolutions Pvt Ltd': '+91 88001 99234',
    'Priya Sharma': '+91 98190 22334',
    'SmartKart Ecommerce': '+91 98450 66778',
    'Global Trade Hub': '+91 98334 22110'
  };

  function getLeadPhone(leadName) {
    if (!leadName || leadName === 'None') return '';
    return LEAD_PHONE_MAP[leadName] || '+91 98765 00000';
  }

  function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDaysToLocalDate(daysToAdd) {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return getLocalDateString(d);
  }

  const defaultTaskTypes = [
    { id: 'Follow-up', name: 'Follow-up Call', icon: '📞' },
    { id: 'WhatsApp Message', name: 'WhatsApp Message', icon: '💬' },
    { id: 'Product Demo', name: 'Product Demo', icon: '🎯' },
    { id: 'Payment Reminder', name: 'Payment Follow-up', icon: '💳' },
    { id: 'Contract Review', name: 'Contract / Proposal', icon: '📄' },
    { id: 'Client Onboarding', name: 'Client Onboarding', icon: '🤝' },
    { id: 'Technical Support', name: 'Technical Support', icon: '⚙️' }
  ];

  function loadTaskTypes() {
    try {
      const stored = localStorage.getItem(STORAGE_TASK_TYPES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse task types', e);
    }
    return JSON.parse(JSON.stringify(defaultTaskTypes));
  }

  let customTaskTypes = loadTaskTypes();

  function saveTaskTypes() {
    try {
      localStorage.setItem(STORAGE_TASK_TYPES_KEY, JSON.stringify(customTaskTypes));
    } catch (e) {
      console.warn('Failed to write task types', e);
    }
  }

  const defaultTasksData = [
    {
      id: 'TSK-101',
      title: 'Follow up on Enterprise WhatsApp API quote & pricing matrix',
      type: 'Follow-up',
      typeIcon: '📞',
      lead: 'Adnan Qureshi',
      leadPhone: '+91 98765 43210',
      assignee: 'Rahul Sharma',
      assigneeAvatar: 'RS',
      priority: 'Urgent',
      rawDate: getLocalDateString(),
      rawTime: '16:30',
      dueDate: 'Today, 04:30 PM',
      dueCategory: 'today',
      status: 'todo',
      completed: false,
      isMine: true,
      notes: 'Client reviewed rate card, need confirmation on 25k monthly broadcast bundle.',
      reminder: true,
      subtasks: [
        { id: 'st-101-1', text: 'Share 25k broadcast rate card PDF', completed: true },
        { id: 'st-101-2', text: 'Confirm onboarding timeline with client', completed: false },
        { id: 'st-101-3', text: 'Collect billing GST registration details', completed: false }
      ],
      notesHistory: [
        { id: 'nh-101-1', author: 'Rahul Sharma', avatar: 'RS', time: 'Today, 11:30 AM', text: 'Client requested custom quotation for 25k WhatsApp broadcast limit.' },
        { id: 'nh-101-2', author: 'Rahul Sharma', avatar: 'RS', time: 'Today, 02:15 PM', text: 'Sent proposal PDF on WhatsApp; scheduled follow-up for 4:30 PM.' }
      ]
    },
    {
      id: 'TSK-102',
      title: 'Live product demo walkthrough on Round-Robin auto assignment',
      type: 'Product Demo',
      typeIcon: '🎯',
      lead: 'Rohan Verma',
      leadPhone: '+91 98234 11223',
      assignee: 'Rahul Sharma',
      assigneeAvatar: 'RS',
      priority: 'High',
      rawDate: getLocalDateString(),
      rawTime: '17:30',
      dueDate: 'Today, 05:30 PM',
      dueCategory: 'today',
      status: 'progress',
      completed: false,
      isMine: true,
      notes: 'Schedule Google Meet link and test screen sharing for 6 sales agents.',
      reminder: true,
      subtasks: [
        { id: 'st-102-1', text: 'Generate Google Meet link & send calendar invite', completed: true },
        { id: 'st-102-2', text: 'Pre-configure 6 telecaller seats in demo workspace', completed: true },
        { id: 'st-102-3', text: 'Demonstrate live WhatsApp incoming routing', completed: false }
      ],
      notesHistory: [
        { id: 'nh-102-1', author: 'Rahul Sharma', avatar: 'RS', time: 'Today, 01:00 PM', text: 'Rohan confirmed 6 sales agents will join the call.' }
      ]
    },
    {
      id: 'TSK-103',
      title: 'Overdue payment link follow-up for wallet recharge credit',
      type: 'Payment Reminder',
      typeIcon: '💳',
      lead: 'Vikas Malhotra',
      leadPhone: '+91 98991 77654',
      assignee: 'Aman Gupta',
      assigneeAvatar: 'AG',
      priority: 'Urgent',
      rawDate: addDaysToLocalDate(-1),
      rawTime: '18:00',
      dueDate: 'Yesterday, 06:00 PM',
      dueCategory: 'overdue',
      status: 'todo',
      completed: false,
      isMine: false,
      notes: 'Transaction dropped at gateway. Generate custom Razorpay direct link.',
      reminder: true,
      subtasks: [
        { id: 'st-103-1', text: 'Inspect transaction failure log on payment gateway', completed: true },
        { id: 'st-103-2', text: 'Issue ₹5,000 recharge link with zero surcharge', completed: false }
      ],
      notesHistory: [
        { id: 'nh-103-1', author: 'Aman Gupta', avatar: 'AG', time: 'Yesterday, 06:00 PM', text: 'Client attempted payment but session timed out on UPI gateway.' }
      ]
    },
    {
      id: 'TSK-104',
      title: 'Meta Business Manager verification & WABA green tick submission',
      type: 'Technical Support',
      typeIcon: '⚙️',
      lead: 'TechSolutions Pvt Ltd',
      leadPhone: '+91 88001 99234',
      assignee: 'Priya Patel',
      assigneeAvatar: 'PP',
      priority: 'High',
      rawDate: addDaysToLocalDate(1),
      rawTime: '11:00',
      dueDate: 'Tomorrow, 11:00 AM',
      dueCategory: 'future',
      status: 'waiting',
      completed: false,
      isMine: false,
      notes: 'Awaiting GST certificate & official domain email verification OTP.',
      reminder: true,
      subtasks: [
        { id: 'st-104-1', text: 'Verify GST business registration document', completed: true },
        { id: 'st-104-2', text: 'Verify official domain email address', completed: false },
        { id: 'st-104-3', text: 'Submit Green Tick Official Business Account application', completed: false }
      ],
      notesHistory: [
        { id: 'nh-104-1', author: 'Priya Patel', avatar: 'PP', time: 'Sep 29, 04:30 PM', text: 'Meta Business Manager ID linked. Waiting for client OTP verification.' }
      ]
    },
    {
      id: 'TSK-105',
      title: 'Send Diwali promotional broadcast template proof for Meta approval',
      type: 'WhatsApp Message',
      typeIcon: '💬',
      lead: 'Karanveer Patel',
      leadPhone: '+91 98250 88990',
      assignee: 'Aman Gupta',
      assigneeAvatar: 'AG',
      priority: 'Medium',
      rawDate: addDaysToLocalDate(1),
      rawTime: '14:00',
      dueDate: 'Tomorrow, 02:00 PM',
      dueCategory: 'future',
      status: 'todo',
      completed: false,
      isMine: false,
      notes: 'Targeting 25,000 opt-in subscribers. Verify interactive CTA buttons.',
      reminder: false,
      subtasks: [
        { id: 'st-105-1', text: 'Draft Diwali greeting copy with dynamic name variable', completed: true },
        { id: 'st-105-2', text: 'Add interactive quick reply buttons (Claim Offer / Speak to Agent)', completed: false }
      ],
      notesHistory: [
        { id: 'nh-105-1', author: 'Aman Gupta', avatar: 'AG', time: 'Yesterday, 03:20 PM', text: 'Drafted template sent to client for brand signoff.' }
      ]
    },
    {
      id: 'TSK-106',
      title: 'Overdue SLA: Onboarding training call for telecalling team',
      type: 'Client Onboarding',
      typeIcon: '🤝',
      lead: 'Abhinandan Kumar',
      leadPhone: '+91 95186 49420',
      assignee: 'Rohit Verma',
      assigneeAvatar: 'RV',
      priority: 'Urgent',
      rawDate: addDaysToLocalDate(-2),
      rawTime: '15:00',
      dueDate: '2 Days ago, 03:00 PM',
      dueCategory: 'overdue',
      status: 'todo',
      completed: false,
      isMine: false,
      notes: 'SLA breached by 24h. Escalate to sales lead immediately.',
      reminder: true,
      subtasks: [
        { id: 'st-106-1', text: 'Send reminder SMS & WhatsApp for onboarding', completed: true },
        { id: 'st-106-2', text: 'Reschedule demo slot with senior telecalling executive', completed: false }
      ],
      notesHistory: [
        { id: 'nh-106-1', author: 'Rohit Verma', avatar: 'RV', time: 'Sep 28, 05:00 PM', text: 'Client missed scheduled onboarding slot. Need urgent follow-up.' }
      ]
    },
    {
      id: 'TSK-107',
      title: 'Contract signing & NDA document dispatch via DigiLocker',
      type: 'Contract Review',
      typeIcon: '📄',
      lead: 'Global Trade Hub',
      leadPhone: '+91 98334 22110',
      assignee: 'Rahul Sharma',
      assigneeAvatar: 'RS',
      priority: 'High',
      rawDate: addDaysToLocalDate(3),
      rawTime: '15:00',
      dueDate: 'This Week, 03:00 PM',
      dueCategory: 'future',
      status: 'progress',
      completed: false,
      isMine: true,
      notes: 'Legal department approved customized 10-seat enterprise addendum.',
      reminder: true,
      subtasks: [
        { id: 'st-107-1', text: 'Upload master agreement on DigiLocker e-sign', completed: true },
        { id: 'st-107-2', text: 'Receive counter-signed agreement from authorized director', completed: false }
      ],
      notesHistory: [
        { id: 'nh-107-1', author: 'Rahul Sharma', avatar: 'RS', time: 'Today, 10:00 AM', text: 'Legal team greenlit 10-seat addendum without penalties.' }
      ]
    },
    {
      id: 'TSK-108',
      title: 'AI Agent knowledge base prompt tuning for order status intent',
      type: 'Technical Support',
      typeIcon: '⚙️',
      lead: 'SmartKart Ecommerce',
      leadPhone: '+91 98450 66778',
      assignee: 'Priya Patel',
      assigneeAvatar: 'PP',
      priority: 'Medium',
      rawDate: addDaysToLocalDate(4),
      rawTime: '14:30',
      dueDate: 'This Week, 02:30 PM',
      dueCategory: 'future',
      status: 'waiting',
      completed: false,
      isMine: false,
      notes: 'Upload FAQ JSON file with webhook tracking URL parameters.',
      reminder: false,
      subtasks: [
        { id: 'st-108-1', text: 'Format product FAQ in JSON schema', completed: true },
        { id: 'st-108-2', text: 'Connect Shopify order recovery webhook trigger', completed: false }
      ],
      notesHistory: [
        { id: 'nh-108-1', author: 'Priya Patel', avatar: 'PP', time: 'Yesterday, 12:00 PM', text: 'Shopify webhook test ping delivered successfully.' }
      ]
    },
    {
      id: 'TSK-109',
      title: 'Initial discovery call and CRM requirement gathering',
      type: 'Follow-up',
      typeIcon: '📞',
      lead: 'Divya Agrawal',
      leadPhone: '+91 99887 76655',
      assignee: 'Aman Gupta',
      assigneeAvatar: 'AG',
      priority: 'Medium',
      rawDate: addDaysToLocalDate(14),
      rawTime: '11:30',
      dueDate: 'Later this Month, 11:30 AM',
      dueCategory: 'future',
      status: 'done',
      completed: true,
      isMine: false,
      notes: 'Demo completed. Client interested in 3-seat starter plan.',
      reminder: false,
      subtasks: [
        { id: 'st-109-1', text: 'Conduct 20-min introductory discovery zoom', completed: true },
        { id: 'st-109-2', text: 'Map sales team permissions requirement', completed: true }
      ],
      notesHistory: [
        { id: 'nh-109-1', author: 'Aman Gupta', avatar: 'AG', time: 'Sep 27, 03:00 PM', text: 'Discovery complete. Highly interested in starter 3-seat plan.' }
      ]
    },
    {
      id: 'TSK-110',
      title: 'Send customized ROI calculation sheet & annual discount coupon',
      type: 'WhatsApp Message',
      typeIcon: '💬',
      lead: 'Priya Sharma',
      leadPhone: '+91 98190 22334',
      assignee: 'Rahul Sharma',
      assigneeAvatar: 'RS',
      priority: 'Low',
      rawDate: getLocalDateString(),
      rawTime: '13:15',
      dueDate: 'Today, 01:15 PM',
      dueCategory: 'today',
      status: 'done',
      completed: true,
      isMine: true,
      notes: 'Sent via WhatsApp document attachment.',
      reminder: false,
      subtasks: [
        { id: 'st-110-1', text: 'Calculate estimated annual ROI on 10k monthly messages', completed: true },
        { id: 'st-110-2', text: 'Generate 15% annual prepaid coupon code', completed: true }
      ],
      notesHistory: [
        { id: 'nh-110-1', author: 'Rahul Sharma', avatar: 'RS', time: 'Today, 01:15 PM', text: 'ROI PDF sheet delivered via WhatsApp.' }
      ]
    }
  ];

  function loadTasksData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage read error, fallback to defaults', e);
    }
    return JSON.parse(JSON.stringify(defaultTasksData));
  }

  let tasksData = loadTasksData();

  function saveTasksData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksData));
    } catch (e) {
      console.warn('LocalStorage write error', e);
    }
  }

  const taskFilterState = {
    tab: 'all',
    search: '',
    assignee: 'all',
    priority: 'all',
    view: 'list'
  };

  const STAGE_LABELS = {
    'todo': 'To-Do',
    'progress': 'In Progress',
    'waiting': 'Waiting Client',
    'done': 'Completed'
  };

  function getInitials(name) {
    if (!name) return 'TM';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  function computeDueInfo(dateVal, timeVal) {
    if (!dateVal) {
      return {
        dueText: 'Today, ' + (timeVal || '16:00'),
        category: 'today'
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = dateVal.split('-').map(Number);
    const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
    let dayLabel = '';
    let category = 'future';

    if (diffDays < 0) {
      dayLabel = diffDays === -1 ? 'Yesterday' : `${Math.abs(diffDays)}d ago`;
      category = 'overdue';
    } else if (diffDays === 0) {
      dayLabel = 'Today';
      category = 'today';
    } else if (diffDays === 1) {
      dayLabel = 'Tomorrow';
      category = 'future';
    } else if (diffDays <= 7) {
      dayLabel = `In ${diffDays} days`;
      category = 'future';
    } else {
      dayLabel = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      category = 'future';
    }

    return {
      dueText: `${dayLabel}, ${timeVal || '16:00'}`,
      category
    };
  }

  // Classify task into one of the 5 schedule columns for Kanban
  function classifyScheduleColumn(task) {
    if (!task.rawDate) {
      if (task.dueCategory === 'overdue') return 'overdue';
      return 'today';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = task.rawDate.split('-').map(Number);
    const target = new Date(parts[0], parts[1] - 1, parts[2]);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'overdue';
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays <= 7) return 'week';
    return 'month';
  }

  // WhatsApp Icon SVG
  const waSvgIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:-1px;"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>`;

  // 1-Click WhatsApp Navigation & Chat Opener
  function openWhatsAppForLead(leadName) {
    if (!leadName || leadName === 'None') {
      showToast('Internal agency task — no external contact attached.');
      return;
    }

    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
    const inboxPanel = document.getElementById('view-inbox');
    if (inboxPanel) inboxPanel.classList.add('active');

    document.querySelectorAll('.sidebar__nav .nav-item, .sidebar__nav .nav-subitem').forEach(el => el.classList.remove('active'));
    const inboxNav = document.querySelector('.sidebar__nav [data-view="inbox"]');
    if (inboxNav) inboxNav.classList.add('active');

    if (topBreadcrumb) {
      topBreadcrumb.textContent = 'Communication > Live Chat Inbox';
    }

    const contactRows = document.querySelectorAll('#inbox-contacts-list .inbox-contact-row');
    let matchedRow = null;
    contactRows.forEach(row => {
      const name = (row.getAttribute('data-name') || '').toLowerCase();
      const target = leadName.toLowerCase();
      if (name === target || name.includes(target) || target.includes(name)) {
        matchedRow = row;
      }
    });

    if (matchedRow) {
      matchedRow.click();
      matchedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast(`✓ Opened WhatsApp chat with ${leadName}`);
    } else {
      if (contactRows.length > 0) contactRows[0].click();
      showToast(`Switched to WhatsApp Inbox for ${leadName}`);
    }
  }

  // Update Top 4 KPI Health Cards & Filter Tab Badges
  function updateTaskMetrics() {
    const todayDue = tasksData.filter(t => t.dueCategory === 'today' && !t.completed).length;
    const overdue = tasksData.filter(t => t.dueCategory === 'overdue' && !t.completed).length;
    const progress = tasksData.filter(t => t.status === 'progress' && !t.completed).length;
    const completed = tasksData.filter(t => t.completed).length;
    const myTasks = tasksData.filter(t => t.isMine && !t.completed).length;

    const elToday = document.getElementById('task-kpi-today');
    const elOverdue = document.getElementById('task-kpi-overdue');
    const elProgress = document.getElementById('task-kpi-progress');
    const elCompleted = document.getElementById('task-kpi-completed');

    if (elToday) elToday.textContent = todayDue;
    if (elOverdue) elOverdue.textContent = overdue;
    if (elProgress) elProgress.textContent = progress;
    if (elCompleted) elCompleted.textContent = completed;

    // Update Tab labels with dynamic counts
    document.querySelectorAll('[data-task-tab]').forEach(tab => {
      const tabType = tab.getAttribute('data-task-tab');
      if (tabType === 'all') tab.textContent = `All Tasks (${tasksData.length})`;
      if (tabType === 'today') tab.textContent = `Due Today (${todayDue})`;
      if (tabType === 'mine') tab.textContent = `My Tasks (${myTasks})`;
      if (tabType === 'overdue') tab.innerHTML = `🚨 Overdue (${overdue})`;
      if (tabType === 'done') tab.textContent = `Completed (${completed})`;
    });

    // Update module sidebar badge
    const taskNavBadge = document.querySelector('.sidebar__nav [data-view="tasks"] .nav-badge');
    if (taskNavBadge) {
      taskNavBadge.textContent = todayDue + overdue;
    }
  }

  // Filter Tasks Engine
  function getFilteredTasks() {
    return tasksData.filter(task => {
      if (taskFilterState.tab === 'today' && (task.dueCategory !== 'today' || task.completed)) return false;
      if (taskFilterState.tab === 'mine' && (!task.isMine || task.completed)) return false;
      if (taskFilterState.tab === 'overdue' && (task.dueCategory !== 'overdue' || task.completed)) return false;
      if (taskFilterState.tab === 'done' && !task.completed) return false;

      if (taskFilterState.assignee !== 'all' && task.assignee !== taskFilterState.assignee) return false;
      if (taskFilterState.priority !== 'all' && task.priority !== taskFilterState.priority) return false;

      if (taskFilterState.search.trim()) {
        const query = taskFilterState.search.toLowerCase();
        const inTitle = task.title.toLowerCase().includes(query);
        const inLead = (task.lead || '').toLowerCase().includes(query);
        const inRep = (task.assignee || '').toLowerCase().includes(query);
        const inNotes = (task.notes || '').toLowerCase().includes(query);
        const inSubtasks = (task.subtasks || []).some(st => st.text.toLowerCase().includes(query));
        if (!inTitle && !inLead && !inRep && !inNotes && !inSubtasks) return false;
      }

      return true;
    });
  }

  // Populate Custom Task Types into Select Dropdowns
  function populateTaskTypeDropdowns(selectedVal) {
    const select = document.getElementById('task-input-type');
    if (!select) return;
    const optionsHtml = customTaskTypes.map(t => `
      <option value="${t.id}" ${(selectedVal && selectedVal === t.id) ? 'selected' : ''}>
        ${t.icon} ${t.name}
      </option>
    `).join('');

    select.innerHTML = optionsHtml + `
      <option value="__CUSTOMIZE_TYPES__" style="color: var(--sf-primary); font-weight: 600;">
        ⚙️ + Customize / Edit Task Types...
      </option>
    `;

    if (selectedVal && customTaskTypes.some(t => t.id === selectedVal)) {
      select.value = selectedVal;
    } else if (customTaskTypes.length > 0) {
      select.value = customTaskTypes[0].id;
    }
  }

  // Custom Task Types Manager Modal Controller
  const modalTaskTypesOverlay = document.getElementById('modal-task-types-overlay');
  const btnManageTaskTypes = document.getElementById('btn-manage-task-types');
  const btnOpenTypeCustomizer = document.getElementById('btn-open-type-customizer');
  const btnCloseTaskTypes = document.getElementById('modal-task-types-close-btn');
  const btnDoneTaskTypes = document.getElementById('modal-task-types-done-btn');
  const btnRestoreDefaultTypes = document.getElementById('btn-restore-default-types');
  const customTypesListContainer = document.getElementById('custom-task-types-list');
  const btnSaveCustomType = document.getElementById('btn-save-custom-type');
  const inputNewTypeIcon = document.getElementById('new-type-icon-input');
  const inputNewTypeName = document.getElementById('new-type-name-input');
  const inputTaskType = document.getElementById('task-input-type');

  if (inputTaskType) {
    inputTaskType.addEventListener('change', () => {
      if (inputTaskType.value === '__CUSTOMIZE_TYPES__') {
        openTaskTypesModal();
        if (customTaskTypes.length > 0) {
          inputTaskType.value = customTaskTypes[0].id;
        }
      }
    });
  }

  function renderCustomTaskTypesList() {
    if (!customTypesListContainer) return;
    customTypesListContainer.innerHTML = customTaskTypes.map((type, idx) => {
      const isDefault = defaultTaskTypes.some(d => d.id === type.id);
      return `
        <div class="custom-type-item" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: #fff; border: 1px solid var(--sf-border); border-radius: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
            <input type="text" class="cti-icon-edit" data-idx="${idx}" value="${type.icon}" style="width: 34px; height: 30px; text-align: center; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 15px;" title="Edit icon" />
            <input type="text" class="cti-name-edit" data-idx="${idx}" value="${type.name}" style="flex: 1; height: 30px; padding: 0 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px;" title="Edit category name" />
            ${isDefault ? `<span style="font-size: 10px; color: var(--sf-text-muted); font-weight: 500;">(Default)</span>` : `<span style="font-size: 10px; color: #16a34a; font-weight: 600;">(Custom)</span>`}
          </div>
          <button type="button" class="cti-del-btn" data-type-id="${type.id}" style="margin-left: 8px; border: none; background: #fee2e2; color: #dc2626; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px;" title="Delete this type">✕</button>
        </div>
      `;
    }).join('');

    // Attach listeners for editing icon/name inline
    customTypesListContainer.querySelectorAll('.cti-icon-edit').forEach(input => {
      input.addEventListener('change', () => {
        const idx = parseInt(input.getAttribute('data-idx'), 10);
        if (customTaskTypes[idx]) {
          customTaskTypes[idx].icon = input.value.trim() || '📌';
          saveTaskTypes();
          populateTaskTypeDropdowns();
          renderTasks();
          showToast(`✓ Updated icon to ${customTaskTypes[idx].icon}`);
        }
      });
    });

    customTypesListContainer.querySelectorAll('.cti-name-edit').forEach(input => {
      input.addEventListener('change', () => {
        const idx = parseInt(input.getAttribute('data-idx'), 10);
        const newName = input.value.trim();
        if (customTaskTypes[idx] && newName) {
          customTaskTypes[idx].name = newName;
          customTaskTypes[idx].id = newName;
          saveTaskTypes();
          populateTaskTypeDropdowns();
          renderTasks();
          showToast(`✓ Updated task type to "${newName}"`);
        }
      });
    });

    customTypesListContainer.querySelectorAll('.cti-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const typeId = btn.getAttribute('data-type-id');
        if (customTaskTypes.length <= 1) {
          showToast('At least one task type must remain.');
          return;
        }
        customTaskTypes = customTaskTypes.filter(t => t.id !== typeId);
        saveTaskTypes();
        renderCustomTaskTypesList();
        populateTaskTypeDropdowns();
        renderTasks();
        showToast('✓ Task type removed');
      });
    });
  }

  function openTaskTypesModal() {
    if (modalTaskTypesOverlay) {
      renderCustomTaskTypesList();
      modalTaskTypesOverlay.classList.add('open');
      modalTaskTypesOverlay.style.display = 'flex';
    }
  }

  function closeTaskTypesModal() {
    if (modalTaskTypesOverlay) {
      modalTaskTypesOverlay.classList.remove('open');
      modalTaskTypesOverlay.style.display = 'none';
      populateTaskTypeDropdowns();
    }
  }

  if (btnManageTaskTypes) btnManageTaskTypes.addEventListener('click', openTaskTypesModal);
  if (btnOpenTypeCustomizer) btnOpenTypeCustomizer.addEventListener('click', openTaskTypesModal);
  if (btnCloseTaskTypes) btnCloseTaskTypes.addEventListener('click', closeTaskTypesModal);
  if (btnDoneTaskTypes) btnDoneTaskTypes.addEventListener('click', closeTaskTypesModal);
  if (btnRestoreDefaultTypes) {
    btnRestoreDefaultTypes.addEventListener('click', () => {
      customTaskTypes = JSON.parse(JSON.stringify(defaultTaskTypes));
      saveTaskTypes();
      renderCustomTaskTypesList();
      populateTaskTypeDropdowns();
      renderTasks();
      showToast('✓ Task types restored to standard defaults');
    });
  }
  if (modalTaskTypesOverlay) {
    modalTaskTypesOverlay.addEventListener('click', (e) => {
      if (e.target === modalTaskTypesOverlay) closeTaskTypesModal();
    });
  }

  if (btnSaveCustomType) {
    btnSaveCustomType.addEventListener('click', () => {
      const name = inputNewTypeName?.value?.trim();
      const icon = inputNewTypeIcon?.value?.trim() || '📌';
      if (!name) {
        showToast('Please enter a category name');
        return;
      }
      if (customTaskTypes.some(t => t.name.toLowerCase() === name.toLowerCase())) {
        showToast('This task type already exists');
        return;
      }
      customTaskTypes.push({
        id: name,
        name: name,
        icon: icon
      });
      saveTaskTypes();
      if (inputNewTypeName) inputNewTypeName.value = '';
      if (inputNewTypeIcon) inputNewTypeIcon.value = '📌';
      renderCustomTaskTypesList();
      populateTaskTypeDropdowns(name);
      renderTasks();
      showToast(`✓ Custom type "${icon} ${name}" added successfully!`);
    });
  }

  // Active State for Subtasks & Notes in Modal
  let currentModalSubtasks = [];
  let currentModalNotes = [];

  const modalSubtasksContainer = document.getElementById('modal-subtasks-container');
  const modalSubtaskBadge = document.getElementById('modal-subtask-badge');
  const modalSubtaskProgressWrap = document.getElementById('modal-subtask-progress-wrap');
  const modalSubtaskProgressBar = document.getElementById('modal-subtask-progress-bar');
  const inputNewSubtask = document.getElementById('task-input-new-subtask');
  const btnAddSubtask = document.getElementById('btn-add-subtask');

  const modalNotesTimeline = document.getElementById('modal-notes-timeline');
  const inputNewNote = document.getElementById('task-input-new-note');
  const btnAddNoteEntry = document.getElementById('btn-add-note-entry');

  function renderModalSubtasks() {
    if (!modalSubtasksContainer) return;
    const total = currentModalSubtasks.length;
    const done = currentModalSubtasks.filter(s => s.completed).length;

    if (modalSubtaskBadge) {
      modalSubtaskBadge.textContent = `${done}/${total}`;
    }
    if (modalSubtaskProgressWrap && modalSubtaskProgressBar) {
      if (total > 0) {
        modalSubtaskProgressWrap.style.display = 'block';
        modalSubtaskProgressBar.style.width = `${Math.round((done / total) * 100)}%`;
      } else {
        modalSubtaskProgressWrap.style.display = 'none';
      }
    }

    if (total === 0) {
      modalSubtasksContainer.innerHTML = `<div style="font-size: 11.5px; color: var(--sf-text-muted); font-style: italic;">No sub-tasks added yet. Add a step below.</div>`;
      return;
    }

    modalSubtasksContainer.innerHTML = currentModalSubtasks.map((st, idx) => `
      <div class="subtask-item ${st.completed ? 'completed' : ''}">
        <input type="checkbox" class="subtask-check" data-subtask-id="${st.id}" ${st.completed ? 'checked' : ''} />
        <span class="subtask-text">${st.text}</span>
        <button type="button" class="subtask-del-btn" data-subtask-del="${st.id}" title="Remove step">✕</button>
      </div>
    `).join('');

    modalSubtasksContainer.querySelectorAll('.subtask-check').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-subtask-id');
        const item = currentModalSubtasks.find(s => s.id === id);
        if (item) {
          item.completed = cb.checked;
          renderModalSubtasks();
        }
      });
    });

    modalSubtasksContainer.querySelectorAll('.subtask-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-subtask-del');
        currentModalSubtasks = currentModalSubtasks.filter(s => s.id !== id);
        renderModalSubtasks();
      });
    });
  }

  function addSubtaskEntry() {
    const text = inputNewSubtask?.value?.trim();
    if (!text) return;
    currentModalSubtasks.push({
      id: `st-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      text: text,
      completed: false
    });
    if (inputNewSubtask) inputNewSubtask.value = '';
    renderModalSubtasks();
  }

  if (btnAddSubtask) btnAddSubtask.addEventListener('click', addSubtaskEntry);
  if (inputNewSubtask) {
    inputNewSubtask.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSubtaskEntry();
      }
    });
  }

  function renderModalNotesTimeline() {
    if (!modalNotesTimeline) return;
    if (currentModalNotes.length === 0) {
      modalNotesTimeline.innerHTML = `<div style="font-size: 11.5px; color: var(--sf-text-muted); font-style: italic;">No activity notes recorded yet. Post an update below.</div>`;
      return;
    }

    modalNotesTimeline.innerHTML = currentModalNotes.map(n => `
      <div class="note-timeline-item">
        <div class="nti-head">
          <div class="nti-author-wrap">
            <div class="nti-avatar">${n.avatar || 'TM'}</div>
            <span class="nti-author">${n.author}</span>
          </div>
          <span class="nti-time">${n.time}</span>
        </div>
        <div class="nti-text">${n.text}</div>
      </div>
    `).join('');

    modalNotesTimeline.scrollTop = modalNotesTimeline.scrollHeight;
  }

  function addNoteEntry() {
    const text = inputNewNote?.value?.trim();
    if (!text) return;
    const author = 'Rahul Sharma';
    const time = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    currentModalNotes.push({
      id: `note-${Date.now()}`,
      author: author,
      avatar: getInitials(author),
      time: time,
      text: text
    });
    if (inputNewNote) inputNewNote.value = '';
    renderModalNotesTimeline();
    showToast('✓ Note added to timeline');
  }

  if (btnAddNoteEntry) btnAddNoteEntry.addEventListener('click', addNoteEntry);

  // Modal Controls: Create & Edit Mode
  const modalTaskOverlay = document.getElementById('modal-task-overlay');
  const modalTaskHeading = document.getElementById('modal-task-heading');
  const modalTaskSubheading = document.getElementById('modal-task-subheading');
  const btnOpenTaskModal = document.getElementById('btn-open-task-modal');
  const btnCloseTaskModal = document.getElementById('modal-task-close-btn');
  const btnCancelTaskModal = document.getElementById('modal-task-cancel-btn');
  const btnDeleteTaskModal = document.getElementById('btn-delete-task-modal');
  const btnSaveTask = document.getElementById('btn-save-task');
  const formCreateTask = document.getElementById('form-create-task');
  const inputEditId = document.getElementById('task-edit-id');

  const inputTaskTitle = document.getElementById('task-input-title');
  // Note: inputTaskType is already declared above for custom types handler
  const inputTaskAssignee = document.getElementById('task-input-assignee');
  const inputTaskLead = document.getElementById('task-input-lead');
  const inputTaskPriority = document.getElementById('task-input-priority');
  const inputTaskDate = document.getElementById('task-input-date');
  const inputTaskTime = document.getElementById('task-input-time');
  const inputTaskStatus = document.getElementById('task-input-status');
  const inputTaskReminder = document.getElementById('task-input-reminder');

  function openCreateTaskModal() {
    if (!modalTaskOverlay) return;
    if (inputEditId) inputEditId.value = '';
    if (formCreateTask) formCreateTask.reset();

    currentModalSubtasks = [];
    currentModalNotes = [];

    populateTaskTypeDropdowns('Follow-up');

    if (modalTaskHeading) modalTaskHeading.textContent = 'Create New Team Task';
    if (modalTaskSubheading) modalTaskSubheading.textContent = 'Assign to telecaller or rep with CRM lead association';
    if (btnSaveTask) btnSaveTask.textContent = 'Save & Assign Task';
    if (btnDeleteTaskModal) btnDeleteTaskModal.style.display = 'none';

    if (inputTaskDate) inputTaskDate.value = getLocalDateString();
    if (inputTaskTime) inputTaskTime.value = '16:00';
    if (inputTaskStatus) inputTaskStatus.value = 'todo';
    if (inputTaskReminder) inputTaskReminder.checked = true;

    renderModalSubtasks();
    renderModalNotesTimeline();

    modalTaskOverlay.classList.add('open');
    modalTaskOverlay.style.display = 'flex';
    if (inputTaskTitle) inputTaskTitle.focus();
  }

  function openEditTaskModal(taskId) {
    if (!modalTaskOverlay) return;
    const task = tasksData.find(t => t.id === taskId);
    if (!task) return;

    if (inputEditId) inputEditId.value = task.id;
    if (inputTaskTitle) inputTaskTitle.value = task.title;

    populateTaskTypeDropdowns(task.type || 'Follow-up');

    if (inputTaskAssignee) inputTaskAssignee.value = task.assignee || 'Rahul Sharma';
    if (inputTaskLead) inputTaskLead.value = task.lead || 'None';
    if (inputTaskPriority) inputTaskPriority.value = task.priority || 'High';
    if (inputTaskDate) inputTaskDate.value = task.rawDate || getLocalDateString();
    if (inputTaskTime) inputTaskTime.value = task.rawTime || '16:00';
    if (inputTaskStatus) inputTaskStatus.value = task.status || (task.completed ? 'done' : 'todo');
    if (inputTaskReminder) inputTaskReminder.checked = task.reminder !== false;

    currentModalSubtasks = JSON.parse(JSON.stringify(task.subtasks || []));
    currentModalNotes = JSON.parse(JSON.stringify(task.notesHistory || []));

    renderModalSubtasks();
    renderModalNotesTimeline();

    if (modalTaskHeading) modalTaskHeading.textContent = `Edit Task — ${task.id}`;
    if (modalTaskSubheading) modalTaskSubheading.textContent = 'Update sub-tasks, notes timeline, due date or stage';
    if (btnSaveTask) btnSaveTask.textContent = 'Save Changes';
    if (btnDeleteTaskModal) btnDeleteTaskModal.style.display = 'inline-flex';

    modalTaskOverlay.classList.add('open');
    modalTaskOverlay.style.display = 'flex';
    if (inputTaskTitle) inputTaskTitle.focus();
  }

  function closeTaskModal() {
    if (modalTaskOverlay) {
      modalTaskOverlay.classList.remove('open');
      modalTaskOverlay.style.display = 'none';
    }
  }

  if (btnOpenTaskModal) btnOpenTaskModal.addEventListener('click', openCreateTaskModal);
  if (btnCloseTaskModal) btnCloseTaskModal.addEventListener('click', closeTaskModal);
  if (btnCancelTaskModal) btnCancelTaskModal.addEventListener('click', closeTaskModal);
  if (modalTaskOverlay) {
    modalTaskOverlay.addEventListener('click', (e) => {
      if (e.target === modalTaskOverlay) closeTaskModal();
    });
  }

  function deleteTask(taskId) {
    const idx = tasksData.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      const removed = tasksData.splice(idx, 1)[0];
      saveTasksData();
      renderTasks();
      closeTaskModal();
      showToast(`✓ Task "${removed.title.substring(0, 26)}..." deleted`);
    }
  }

  if (btnDeleteTaskModal) {
    btnDeleteTaskModal.addEventListener('click', () => {
      const editId = inputEditId ? inputEditId.value : null;
      if (editId) {
        if (confirm('Are you sure you want to delete this task?')) {
          deleteTask(editId);
        }
      }
    });
  }

  // Form Submit: Create OR Update
  if (formCreateTask) {
    formCreateTask.addEventListener('submit', (e) => {
      e.preventDefault();

      const editId = inputEditId ? inputEditId.value.trim() : '';
      const title = inputTaskTitle?.value?.trim() || 'New Team Task';
      const type = inputTaskType?.value || 'Follow-up';
      const typeObj = customTaskTypes.find(t => t.id === type) || { icon: '📌' };
      const assignee = inputTaskAssignee?.value || 'Rahul Sharma';
      const lead = inputTaskLead?.value || 'None';
      const priority = inputTaskPriority?.value || 'High';
      const dateVal = inputTaskDate?.value || getLocalDateString();
      const timeVal = inputTaskTime?.value || '16:00';
      const statusVal = inputTaskStatus?.value || 'todo';
      const reminder = inputTaskReminder?.checked ?? true;

      const dueInfo = computeDueInfo(dateVal, timeVal);
      const isCompleted = statusVal === 'done';

      // Summary note for preview
      const previewNote = currentModalNotes.length > 0
        ? currentModalNotes[currentModalNotes.length - 1].text
        : '';

      if (editId) {
        // UPDATE EXISTING TASK
        const existing = tasksData.find(t => t.id === editId);
        if (existing) {
          existing.title = title;
          existing.type = type;
          existing.typeIcon = typeObj.icon || '📌';
          existing.assignee = assignee;
          existing.assigneeAvatar = getInitials(assignee);
          existing.lead = lead;
          existing.leadPhone = getLeadPhone(lead);
          existing.priority = priority;
          existing.rawDate = dateVal;
          existing.rawTime = timeVal;
          existing.dueDate = dueInfo.dueText;
          existing.dueCategory = dueInfo.category;
          existing.status = statusVal;
          existing.completed = isCompleted;
          existing.notes = previewNote;
          existing.reminder = reminder;
          existing.subtasks = JSON.parse(JSON.stringify(currentModalSubtasks));
          existing.notesHistory = JSON.parse(JSON.stringify(currentModalNotes));
          existing.isMine = assignee === 'Rahul Sharma';

          saveTasksData();
          closeTaskModal();
          renderTasks();
          showToast(`✓ Task "${title.substring(0, 24)}..." updated successfully!`);
        }
      } else {
        // CREATE NEW TASK
        const newTask = {
          id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
          title,
          type,
          typeIcon: typeObj.icon || '📌',
          lead,
          leadPhone: getLeadPhone(lead),
          assignee,
          assigneeAvatar: getInitials(assignee),
          priority,
          rawDate: dateVal,
          rawTime: timeVal,
          dueDate: dueInfo.dueText,
          dueCategory: dueInfo.category,
          status: statusVal,
          completed: isCompleted,
          isMine: assignee === 'Rahul Sharma',
          notes: previewNote,
          reminder,
          subtasks: JSON.parse(JSON.stringify(currentModalSubtasks)),
          notesHistory: JSON.parse(JSON.stringify(currentModalNotes))
        };

        tasksData.unshift(newTask);
        saveTasksData();
        closeTaskModal();
        renderTasks();
        showToast(`✓ Task created & assigned to ${assignee}!`);
      }
    });
  }

  // Quick Stage Change
  function updateTaskStatus(taskId, newStatus) {
    const task = tasksData.find(t => t.id === taskId);
    if (!task) return;
    task.status = newStatus;
    task.completed = newStatus === 'done';
    saveTasksData();
    renderTasks();
    showToast(`✓ Task moved to "${STAGE_LABELS[newStatus] || newStatus}"`);
  }

  // Toggle Completion Checkbox
  function toggleTaskCompletion(taskId, isChecked) {
    const task = tasksData.find(t => t.id === taskId);
    if (!task) return;
    task.completed = isChecked;
    task.status = isChecked ? 'done' : 'todo';
    saveTasksData();
    renderTasks();
    if (isChecked) {
      showToast(`✓ Task "${task.title.substring(0, 24)}..." marked complete!`);
    } else {
      showToast(`Task reopened: marked as To-Do`);
    }
  }

  // Reschedule Task via Drag and Drop
  function rescheduleTaskToColumn(taskId, targetColumn) {
    const task = tasksData.find(t => t.id === taskId);
    if (!task) return;

    let targetDays = 0;
    let colName = 'Today';

    if (targetColumn === 'overdue') {
      targetDays = -1;
      colName = 'Overdue';
    } else if (targetColumn === 'today') {
      targetDays = 0;
      colName = 'Today';
    } else if (targetColumn === 'tomorrow') {
      targetDays = 1;
      colName = 'Tomorrow';
    } else if (targetColumn === 'week') {
      targetDays = 3;
      colName = 'This Week';
    } else if (targetColumn === 'month') {
      targetDays = 14;
      colName = 'Later / Month';
    }

    const rawDateStr = addDaysToLocalDate(targetDays);
    const dueInfo = computeDueInfo(rawDateStr, task.rawTime || '16:00');

    task.rawDate = rawDateStr;
    task.dueDate = dueInfo.dueText;
    task.dueCategory = dueInfo.category;

    if (targetColumn !== 'overdue' && task.completed) {
      task.completed = false;
      task.status = 'todo';
    }

    // Add note in timeline
    if (!task.notesHistory) task.notesHistory = [];
    task.notesHistory.push({
      id: `nh-${Date.now()}`,
      author: 'Rahul Sharma',
      avatar: 'RS',
      time: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      text: `🔄 Rescheduled to ${colName} (${task.dueDate})`
    });

    saveTasksData();
    renderTasks();
    showToast(`✓ Rescheduled to "${colName}" (${task.dueDate})`);
  }

  // Render List / Table View
  function renderTasksListView(tasks) {
    const container = document.getElementById('task-rows-container');
    if (!container) return;

    if (tasks.length === 0) {
      container.innerHTML = `
        <div style="padding: 48px 20px; text-align: center; color: var(--sf-text-muted);">
          <div style="font-size: 36px; margin-bottom: 10px;">📋</div>
          <h3 style="font-size: 15px; font-weight: 700; color: var(--sf-text-main); margin-bottom: 4px;">No tasks match your criteria</h3>
          <p style="font-size: 13px;">Try switching filter tabs, clearing search, or creating a new task.</p>
          <button class="btn-primary" onclick="document.getElementById('btn-open-task-modal')?.click()" style="margin-top: 14px;">+ Create Task</button>
        </div>
      `;
      return;
    }

    container.innerHTML = tasks.map(task => {
      const priorityClass = task.priority.toLowerCase();
      const dueBadgeClass = task.dueCategory === 'overdue' ? 'overdue' : (task.dueCategory === 'today' ? 'today' : 'upcoming');
      const dueBadgeIcon = task.dueCategory === 'overdue' ? '🚨' : (task.dueCategory === 'today' ? '⏰' : '📅');
      const hasLead = task.lead && task.lead !== 'None';
      const leadPhone = task.leadPhone || getLeadPhone(task.lead);

      const subtasks = task.subtasks || [];
      const totalSt = subtasks.length;
      const doneSt = subtasks.filter(s => s.completed).length;
      const allDone = totalSt > 0 && doneSt === totalSt;

      const latestNote = task.notes || (task.notesHistory && task.notesHistory.length > 0 ? task.notesHistory[task.notesHistory.length - 1].text : '');

      return `
        <div class="task-row-card ${task.completed ? 'is-completed' : ''}" data-task-id="${task.id}">
          <div class="task-row-left">
            <input type="checkbox" class="task-checkbox-custom" data-id="${task.id}" ${task.completed ? 'checked' : ''} title="Mark complete" />
            <div class="task-info-block">
              <div class="task-title-line">
                <span class="task-type-badge">${task.typeIcon || '📌'} ${task.type}</span>
                <span class="task-title-text task-edit-trigger" data-edit-id="${task.id}" style="cursor: pointer;" title="Click to view details & sub-tasks">${task.title}</span>
              </div>
              <div class="task-meta-line">
                ${hasLead ? `
                  <span class="task-lead-pill" data-lead-name="${task.lead}" title="Open WhatsApp chat with ${task.lead} (${leadPhone})">
                    👤 <strong>${task.lead}</strong> <span style="color: #475569; font-size: 11px; font-weight: 600; margin-left: 2px;">• ${leadPhone}</span>
                  </span>
                ` : `<span class="task-lead-pill" style="opacity: 0.6;">🏢 Internal Team</span>`}

                <span class="task-due-badge ${dueBadgeClass}">
                  ${dueBadgeIcon} ${task.dueDate}
                </span>

                ${totalSt > 0 ? `
                  <span class="task-subtasks-pill ${allDone ? 'all-done' : ''} task-edit-trigger" data-edit-id="${task.id}" title="Subtasks checklist (${doneSt}/${totalSt} completed)">
                    ☑️ ${doneSt}/${totalSt} subtasks
                  </span>
                ` : ''}

                ${latestNote ? `<span style="font-size: 11px; color: var(--sf-text-muted); max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${latestNote}">💬 ${latestNote}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="task-row-right">
            <select class="task-row-stage-badge ${task.status}" data-stage-id="${task.id}" title="Change task workflow stage">
              <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To-Do</option>
              <option value="progress" ${task.status === 'progress' ? 'selected' : ''}>In Progress</option>
              <option value="waiting" ${task.status === 'waiting' ? 'selected' : ''}>Waiting</option>
              <option value="done" ${task.status === 'done' ? 'selected' : ''}>Completed</option>
            </select>

            <div class="task-rep-badge" title="Assigned Sales Rep">
              <div class="task-rep-avatar">${task.assigneeAvatar || 'TM'}</div>
              <span class="task-rep-name">${task.assignee}</span>
            </div>

            <span class="task-priority-chip ${priorityClass}">
              ${task.priority}
            </span>

            <div class="task-action-btns">
              ${hasLead ? `
                <button class="btn-task-action-wa" data-lead="${task.lead}" title="Open 1-Click WhatsApp Chat">
                  ${waSvgIcon} WhatsApp
                </button>
              ` : ''}
              <button class="btn-task-action-edit" data-edit-id="${task.id}" title="Edit Task & Checklist">
                ✏️ Edit
              </button>
              <button class="btn-task-action-del" data-del-id="${task.id}" title="Delete Task">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach row events
    container.querySelectorAll('.task-checkbox-custom').forEach(cb => {
      cb.addEventListener('change', () => {
        const taskId = cb.getAttribute('data-id');
        toggleTaskCompletion(taskId, cb.checked);
      });
    });

    container.querySelectorAll('.task-row-stage-badge').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const taskId = sel.getAttribute('data-stage-id');
        updateTaskStatus(taskId, e.target.value);
      });
    });

    container.querySelectorAll('.task-edit-trigger, .btn-task-action-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = btn.getAttribute('data-edit-id');
        openEditTaskModal(taskId);
      });
    });

    container.querySelectorAll('.btn-task-action-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = btn.getAttribute('data-del-id');
        if (confirm('Delete this task?')) {
          deleteTask(taskId);
        }
      });
    });

    container.querySelectorAll('.btn-task-action-wa').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lead = btn.getAttribute('data-lead');
        openWhatsAppForLead(lead);
      });
    });

    container.querySelectorAll('.task-lead-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const lead = pill.getAttribute('data-lead-name');
        if (lead) openWhatsAppForLead(lead);
      });
    });
  }

  // Render Kanban Board View (5 Schedule Columns with Drag & Drop)
  function renderTasksKanbanView(tasks) {
    const listOverdue = document.getElementById('kanban-list-overdue');
    const listToday = document.getElementById('kanban-list-today');
    const listTomorrow = document.getElementById('kanban-list-tomorrow');
    const listWeek = document.getElementById('kanban-list-week');
    const listMonth = document.getElementById('kanban-list-month');

    if (!listOverdue || !listToday || !listTomorrow || !listWeek || !listMonth) return;

    // Distribute into 5 schedule columns
    const colOverdue = [];
    const colToday = [];
    const colTomorrow = [];
    const colWeek = [];
    const colMonth = [];

    tasks.forEach(t => {
      const col = classifyScheduleColumn(t);
      if (col === 'overdue') colOverdue.push(t);
      else if (col === 'today') colToday.push(t);
      else if (col === 'tomorrow') colTomorrow.push(t);
      else if (col === 'week') colWeek.push(t);
      else colMonth.push(t);
    });

    // Update count badges
    const cntOverdue = document.getElementById('kch-count-overdue');
    const cntToday = document.getElementById('kch-count-today');
    const cntTomorrow = document.getElementById('kch-count-tomorrow');
    const cntWeek = document.getElementById('kch-count-week');
    const cntMonth = document.getElementById('kch-count-month');

    if (cntOverdue) cntOverdue.textContent = colOverdue.length;
    if (cntToday) cntToday.textContent = colToday.length;
    if (cntTomorrow) cntTomorrow.textContent = colTomorrow.length;
    if (cntWeek) cntWeek.textContent = colWeek.length;
    if (cntMonth) cntMonth.textContent = colMonth.length;

    function renderCards(cardList) {
      if (cardList.length === 0) {
        return `<div style="padding: 24px 10px; text-align: center; font-size: 11.5px; color: var(--sf-text-muted); font-style: italic;">No tasks scheduled</div>`;
      }
      return cardList.map(task => {
        const priorityClass = task.priority.toLowerCase();
        const dueBadgeClass = task.dueCategory === 'overdue' ? 'overdue' : (task.dueCategory === 'today' ? 'today' : 'upcoming');
        const dueBadgeIcon = task.dueCategory === 'overdue' ? '🚨' : (task.dueCategory === 'today' ? '⏰' : '📅');
        const hasLead = task.lead && task.lead !== 'None';
        const leadPhone = task.leadPhone || getLeadPhone(task.lead);

        const subtasks = task.subtasks || [];
        const totalSt = subtasks.length;
        const doneSt = subtasks.filter(s => s.completed).length;

        return `
          <div class="kanban-card" data-task-id="${task.id}" draggable="true" title="Drag to another column to reschedule">
            <div class="kc-head">
              <span class="task-type-badge">${task.typeIcon || '📌'} ${task.type}</span>
              <span class="task-priority-chip ${priorityClass}">${task.priority}</span>
            </div>
            <div class="kc-title task-edit-trigger" data-edit-id="${task.id}" style="${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''} cursor: pointer;" title="Click to edit task">
              ${task.title}
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 8px;">
              ${hasLead ? `
                <div class="kc-lead" data-lead-name="${task.lead}" style="cursor: pointer; margin-bottom: 0; display: inline-flex; align-items: center; gap: 4px;" title="Click to chat on WhatsApp (${leadPhone})">
                  <span>👤</span>
                  <strong style="color: var(--sf-text-main);">${task.lead}</strong>
                  <span style="color: #475569; font-size: 10px; font-weight: 600;">• ${leadPhone}</span>
                </div>
              ` : `<div class="kc-lead" style="opacity: 0.6; margin-bottom: 0;">🏢 Internal</div>`}

              ${totalSt > 0 ? `
                <span style="font-size: 10.5px; color: #475569; font-weight: 600; background: #e2e8f0; padding: 1.5px 6px; border-radius: 4px;">
                  ☑️ ${doneSt}/${totalSt}
                </span>
              ` : ''}
            </div>
            
            <div class="kc-footer">
              <div class="task-rep-badge">
                <div class="task-rep-avatar" style="width: 22px; height: 22px; font-size: 9px;">${task.assigneeAvatar || 'TM'}</div>
                <span class="task-rep-name" style="font-size: 11px;">${task.assignee.split(' ')[0]}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span class="task-due-badge ${dueBadgeClass}" style="font-size: 10px; padding: 2px 4px;">
                  ${dueBadgeIcon} ${task.dueDate.split(',')[0]}
                </span>
                ${hasLead ? `
                  <button class="btn-task-action-wa" data-lead="${task.lead}" style="padding: 2px 6px; font-size: 10px;" title="WhatsApp Quick Chat">
                    ${waSvgIcon}
                  </button>
                ` : ''}
                <button class="btn-task-action-edit" data-edit-id="${task.id}" style="padding: 2px 5px; font-size: 10px;" title="Edit Task">
                  ✏️
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    listOverdue.innerHTML = renderCards(colOverdue);
    listToday.innerHTML = renderCards(colToday);
    listTomorrow.innerHTML = renderCards(colTomorrow);
    listWeek.innerHTML = renderCards(colWeek);
    listMonth.innerHTML = renderCards(colMonth);

    // Attach Kanban Event Listeners & Drag and Drop
    const allKanbanColumns = [
      { colEl: document.getElementById('kanban-col-overdue'), listEl: listOverdue, key: 'overdue' },
      { colEl: document.getElementById('kanban-col-today'), listEl: listToday, key: 'today' },
      { colEl: document.getElementById('kanban-col-tomorrow'), listEl: listTomorrow, key: 'tomorrow' },
      { colEl: document.getElementById('kanban-col-week'), listEl: listWeek, key: 'week' },
      { colEl: document.getElementById('kanban-col-month'), listEl: listMonth, key: 'month' }
    ];

    allKanbanColumns.forEach(({ colEl, listEl, key }) => {
      // Button listeners
      listEl.querySelectorAll('.btn-task-action-wa').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const lead = btn.getAttribute('data-lead');
          openWhatsAppForLead(lead);
        });
      });

      listEl.querySelectorAll('.kc-lead').forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          const lead = pill.getAttribute('data-lead-name');
          if (lead) openWhatsAppForLead(lead);
        });
      });

      listEl.querySelectorAll('.task-edit-trigger, .btn-task-action-edit').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const taskId = el.getAttribute('data-edit-id');
          openEditTaskModal(taskId);
        });
      });

      // DRAG AND DROP SETUP
      listEl.querySelectorAll('.kanban-card').forEach(card => {
        card.addEventListener('dragstart', (e) => {
          const taskId = card.getAttribute('data-task-id');
          draggedTaskId = taskId;
          e.dataTransfer.setData('text/plain', taskId);
          e.dataTransfer.effectAllowed = 'move';
          card.classList.add('is-dragging');
        });

        card.addEventListener('dragend', () => {
          draggedTaskId = null;
          card.classList.remove('is-dragging');
          document.querySelectorAll('.kanban-column, .kanban-cards-list').forEach(el => el.classList.remove('drag-over'));
        });
      });

      // Drop handlers on column
      if (colEl) {
        colEl.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          colEl.classList.add('drag-over');
        });

        colEl.addEventListener('dragleave', (e) => {
          if (!colEl.contains(e.relatedTarget)) {
            colEl.classList.remove('drag-over');
          }
        });

        colEl.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          colEl.classList.remove('drag-over');
          const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
          if (taskId) {
            rescheduleTaskToColumn(taskId, key);
          }
        });
      }
    });
  }

  // Master Render for Tasks Module
  function renderTasks() {
    updateTaskMetrics();
    const filtered = getFilteredTasks();
    if (taskFilterState.view === 'list') {
      renderTasksListView(filtered);
    } else {
      renderTasksKanbanView(filtered);
    }
  }

  // Dual View Switcher (List vs Kanban)
  const btnListView = document.getElementById('task-btn-list-view');
  const btnKanbanView = document.getElementById('task-btn-kanban-view');
  const containerList = document.getElementById('task-list-view-container');
  const containerKanban = document.getElementById('task-kanban-view-container');

  if (btnListView && btnKanbanView) {
    btnListView.addEventListener('click', () => {
      taskFilterState.view = 'list';
      btnListView.classList.add('active');
      btnKanbanView.classList.remove('active');
      if (containerList) containerList.style.display = 'block';
      if (containerKanban) containerKanban.style.display = 'none';
      renderTasks();
    });

    btnKanbanView.addEventListener('click', () => {
      taskFilterState.view = 'kanban';
      btnKanbanView.classList.add('active');
      btnListView.classList.remove('active');
      if (containerList) containerList.style.display = 'none';
      if (containerKanban) containerKanban.style.display = 'block';
      renderTasks();
    });
  }

  // Task Filter Tabs
  document.querySelectorAll('[data-task-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-task-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      taskFilterState.tab = tab.getAttribute('data-task-tab');
      renderTasks();
    });
  });

  // KPI Health Cards Click Filter Trigger
  document.querySelectorAll('.task-kpi-card').forEach(card => {
    card.addEventListener('click', () => {
      const filterKey = card.getAttribute('data-filter');
      const targetTab = document.querySelector(`[data-task-tab="${filterKey === 'progress' ? 'all' : filterKey}"]`);
      if (targetTab) {
        targetTab.click();
      }
    });
  });

  // Search Input Filter
  const taskSearchInput = document.getElementById('task-search-input');
  if (taskSearchInput) {
    taskSearchInput.addEventListener('input', (e) => {
      taskFilterState.search = e.target.value;
      renderTasks();
    });
  }

  // Assignee Dropdown Filter
  const taskAssigneeFilter = document.getElementById('task-assignee-filter');
  if (taskAssigneeFilter) {
    taskAssigneeFilter.addEventListener('change', (e) => {
      taskFilterState.assignee = e.target.value;
      renderTasks();
    });
  }

  // Priority Dropdown Filter
  const taskPriorityFilter = document.getElementById('task-priority-filter');
  if (taskPriorityFilter) {
    taskPriorityFilter.addEventListener('change', (e) => {
      taskFilterState.priority = e.target.value;
      renderTasks();
    });
  }

  // Export CSV
  const btnExportTasks = document.getElementById('btn-export-tasks');
  if (btnExportTasks) {
    btnExportTasks.addEventListener('click', () => {
      const headers = ['Task ID', 'Title', 'Type', 'Lead', 'Lead Mobile', 'Assignee', 'Priority', 'Status', 'Due Date', 'Subtasks Count'];
      const rows = tasksData.map(t => [
        t.id,
        `"${(t.title || '').replace(/"/g, '""')}"`,
        t.type,
        `"${t.lead}"`,
        `"${t.leadPhone || getLeadPhone(t.lead)}"`,
        `"${t.assignee}"`,
        t.priority,
        t.completed ? 'Completed' : t.status,
        `"${t.dueDate}"`,
        (t.subtasks || []).length
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SimpleFloww_Tasks_Export_${getLocalDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('✓ Task CSV export initiated successfully!');
    });
  }

  // Reset Sample Tasks
  const btnResetTasks = document.getElementById('btn-reset-tasks');
  if (btnResetTasks) {
    btnResetTasks.addEventListener('click', () => {
      if (confirm('Reset tasks back to original 10 sample tasks?')) {
        tasksData = JSON.parse(JSON.stringify(defaultTasksData));
        saveTasksData();
        renderTasks();
        showToast('✓ Task list reset to default 10 sample tasks!');
      }
    });
  }

  // Initialize Custom Types Dropdown and Render Tasks
  populateTaskTypeDropdowns();
  renderTasks();

  // =========================================================================
  // HASH ROUTING (Direct Link Support: e.g. #tasks, #inbox, #dashboard)
  // =========================================================================
  function handleHashRoute() {
    let rawHash = window.location.hash.replace('#', '').trim();
    if (!rawHash) return;

    // Direct match with view panels
    const targetPanel = document.getElementById(`view-${rawHash}`);
    if (targetPanel) {
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      targetPanel.classList.add('active');

      // Update sidebar nav items
      document.querySelectorAll('.sidebar__nav .nav-item, .sidebar__nav .nav-subitem').forEach(el => el.classList.remove('active'));
      const activeLink = document.querySelector(`.sidebar__nav [href="#${rawHash}"]`) ||
                         document.querySelector(`.sidebar__nav [data-view="${rawHash}"]`);
      if (activeLink) activeLink.classList.add('active');

      // Update top breadcrumb
      if (topBreadcrumb) {
        if (rawHash === 'tasks') topBreadcrumb.textContent = 'Operations > Task Management';
        else if (rawHash === 'helpdesk') topBreadcrumb.textContent = 'Support > Help Desk & Support Desk';
        else if (rawHash === 'knowledgebase') topBreadcrumb.textContent = 'Support > Video Knowledge Base & Guides';
        else if (rawHash === 'inbox') topBreadcrumb.textContent = 'Communication > Live Chat Inbox';
        else if (rawHash === 'dashboard') topBreadcrumb.textContent = 'Sales & Revenue Overview';
        else if (rawHash === 'referral') topBreadcrumb.textContent = 'Growth > Refer & Earn';
        else if (activeLink && activeLink.getAttribute('data-breadcrumb')) {
          topBreadcrumb.textContent = activeLink.getAttribute('data-breadcrumb');
        }
      }

      // Update mobile bottom nav items
      document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item').forEach(el => el.classList.remove('active'));
      const activeMobileNav = document.querySelector(`.mobile-bottom-nav [data-nav="${rawHash}"]`);
      if (activeMobileNav) activeMobileNav.classList.add('active');

      // Close mobile sidebar drawer if open
      if (sidebarEl && window.innerWidth <= 900) {
        sidebarEl.classList.remove('mobile-open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('show');
        document.body.style.overflow = '';
      }

      if (rawHash === 'dashboard') {
        refreshDashboard(false);
      } else if (rawHash === 'helpdesk') {
        if (window.renderHelpDeskAll) window.renderHelpDeskAll();
      } else if (rawHash === 'knowledgebase') {
        if (window.renderKnowledgeBaseAll) window.renderKnowledgeBaseAll();
      } else if (rawHash === 'referral') {
        if (window.switchReferralView) window.switchReferralView('partner');
      }
    }
  }

  window.addEventListener('hashchange', handleHashRoute);
  if (window.location.hash) {
    handleHashRoute();
  }

  // Call Statuses vs Lead Statuses Tab switcher
  const tabCallStatuses = document.getElementById('tab-call-statuses');
  const tabLeadStatuses = document.getElementById('tab-lead-statuses');
  if (tabCallStatuses && tabLeadStatuses) {
    tabCallStatuses.addEventListener('click', () => {
      tabCallStatuses.classList.add('active');
      tabLeadStatuses.classList.remove('active');
      showToast('Switched to Call Statuses');
    });
    tabLeadStatuses.addEventListener('click', () => {
      tabLeadStatuses.classList.add('active');
      tabCallStatuses.classList.remove('active');
      showToast('Switched to Lead Statuses');
    });
  }

  const btnCreateLead = document.getElementById('btn-create-lead');
  if (btnCreateLead) {
    btnCreateLead.addEventListener('click', () => {
      const name = prompt('Enter Lead Full Name:');
      if (name) {
        showToast(`✓ Lead "${name}" created and auto-assigned!`);
      }
    });
  }

  const btnAddDeal = document.getElementById('btn-add-deal');
  if (btnAddDeal) {
    btnAddDeal.addEventListener('click', () => {
      const deal = prompt('Enter Deal Name:');
      if (deal) {
        showToast(`✓ Deal "${deal}" added to New Leads stage!`);
      }
    });
  }

  // =========================================================================
  // HELP DESK & VIDEO KNOWLEDGE BASE ENGINE (Self-Service Center)
  // =========================================================================
  let helpdeskFaqsData = [
    // --- Communication > WhatsApp Accounts (4) ---
    {
      id: 'faq-wa-1',
      menuId: 'comm',
      menuTitle: 'Communication',
      submenuId: 'wa-accounts',
      submenuTitle: 'WhatsApp Accounts',
      cat: 'whatsapp',
      catLabel: 'WhatsApp & QR',
      type: 'guide',
      title: 'WhatsApp Cloud API & QR Code connect kaise karein?',
      duration: '0:45',
      videoTitle: 'Walkthrough: Connecting WhatsApp Account via QR Code',
      badgeClass: 'whatsapp',
      steps: [
        'Sidebar me <strong>Communication > WhatsApp Accounts</strong> par click karke <strong>+ Connect WhatsApp</strong> button dabayein.',
        'Apne business mobile me WhatsApp kholiye ➔ <strong>Settings</strong> ➔ <strong>Linked Devices</strong> ➔ <strong>Link a Device</strong> par tap karein.',
        'Screen par show ho rahe dynamic QR Code ko scan karein. 10 seconds me status <strong>🟢 Active & Ready</strong> ho jayega.'
      ],
      actionLabel: 'Connect WhatsApp Account ➔',
      actionTarget: 'inbox',
      keywords: 'qr code connect scan phone number meta waba link device pairing official cloud api'
    },
    {
      id: 'faq-wa-2',
      menuId: 'comm',
      menuTitle: 'Communication',
      submenuId: 'wa-accounts',
      submenuTitle: 'WhatsApp Accounts',
      cat: 'whatsapp',
      catLabel: 'WhatsApp & QR',
      type: 'troubleshoot',
      title: 'WhatsApp disconnected / QR code expired show ho raha hai, reconnect kaise karein?',
      duration: '0:35',
      videoTitle: 'Fix: Resolving Disconnected WhatsApp Session & Phone Sync',
      badgeClass: 'whatsapp',
      steps: [
        '<strong>WhatsApp Accounts</strong> me jakar disconnected number ke aage <strong>Refresh QR Code</strong> button par click karein.',
        'Check karein ki primary phone me internet connection active hai aur battery saver mode off hai.',
        'Naye QR Code ko scan karein. Agar prompt aaye toh <em>"Keep this session active"</em> select karein taaki background sync disconnect na ho.'
      ],
      actionLabel: 'Reconnect WhatsApp ➔',
      actionTarget: 'inbox',
      keywords: 'disconnected qr code expired reconnect offline phone sleep logout battery saver'
    },
    {
      id: 'faq-wa-3',
      menuId: 'comm',
      menuTitle: 'Communication',
      submenuId: 'inbox',
      submenuTitle: 'Live Inbox',
      cat: 'whatsapp',
      catLabel: 'Live Inbox & 24h Window',
      type: 'troubleshoot',
      title: 'Outgoing message par single tick (✓) aa raha hai ya delivery delay ho rahi hai?',
      duration: '0:40',
      videoTitle: 'Fix: Diagnosing Delivery Delays & 24h Customer Service Window',
      badgeClass: 'whatsapp',
      steps: [
        'Check karein recipient ka country code (+91) sahi format me hai aur mobile network active hai.',
        'Sidebar me <strong>Meta Cloud API Status</strong> check karein (operational green hona chahiye).',
        'Agar user se last reply 24 hours se pehle aaya tha, toh normal text message block hoga; approved <strong>Meta Marketing / Utility Template</strong> send karein.'
      ],
      actionLabel: 'Check Message Logs ➔',
      actionTarget: 'inbox',
      keywords: 'single tick delivery delay 24 hour window template meta server queue pending failed'
    },
    {
      id: 'faq-wa-4',
      menuId: 'comm',
      menuTitle: 'Communication',
      submenuId: 'wa-accounts',
      submenuTitle: 'WhatsApp Accounts',
      cat: 'whatsapp',
      catLabel: 'Meta Verification',
      type: 'guide',
      title: 'WhatsApp Green Tick (Official Meta Verified Badge) ke liye apply kaise karein?',
      duration: '0:50',
      videoTitle: 'Walkthrough: Applying for Official WhatsApp Green Tick Badge',
      badgeClass: 'whatsapp',
      steps: [
        'Meta Business Manager me apni company ka <strong>Business Verification</strong> complete karein (GST Certificate + Incorporation doc).',
        'Two-Factor Authentication (2FA) enable karein aur Tier-2 messaging limit (10,000 msgs/day) maintain karein.',
        '<strong>Settings > WhatsApp Accounts > Request Official Badge</strong> par click karein aur brand press coverage links attach karke submit karein.'
      ],
      actionLabel: 'Apply for Green Tick ➔',
      actionTarget: 'inbox',
      keywords: 'green tick verified badge official business account oba meta trust brand identity'
    },

    // --- Campaigns & Marketing (4) ---
    {
      id: 'faq-bc-1',
      menuId: 'campaigns',
      menuTitle: 'Campaigns & Marketing',
      submenuId: 'broadcast',
      submenuTitle: 'Broadcast Campaigns',
      cat: 'broadcast',
      catLabel: 'Broadcast & Campaigns',
      type: 'guide',
      title: 'Broadcast message 10,000+ targeted customers ko safe delivery ke sath kaise bhejein?',
      duration: '0:50',
      videoTitle: 'Walkthrough: Setting up High-Volume Broadcast Campaign',
      badgeClass: 'broadcast',
      steps: [
        '<strong>Campaigns > All Broadcasts</strong> me jakar <strong>+ New Campaign</strong> par click karein.',
        'Approved Meta Marketing Template select karein aur targeted CRM audience/tags filter karein.',
        '<strong>Smart Rate Limiting (50 msgs/min)</strong> on rakhein taaki number health score "High" rahe, fir <strong>Schedule / Send Now</strong> dabayein.'
      ],
      actionLabel: 'Create Broadcast Campaign ➔',
      actionTarget: 'dashboard',
      keywords: 'broadcast 10000 bulk message blast campaign rate limit audience filter'
    },
    {
      id: 'faq-bc-2',
      menuId: 'campaigns',
      menuTitle: 'Campaigns & Marketing',
      submenuId: 'templates',
      submenuTitle: 'Message Templates',
      cat: 'broadcast',
      catLabel: 'Meta Templates',
      type: 'troubleshoot',
      title: 'Meta se WhatsApp Template reject kyun hota hai aur 60s me approve kaise karwayen?',
      duration: '0:40',
      videoTitle: 'Walkthrough: Writing Meta-Compliant Templates for 60s Approval',
      badgeClass: 'broadcast',
      steps: [
        'Category sahi chunein: Transactional/order/payment ke liye <strong>Utility</strong>, promotional discount ke liye <strong>Marketing</strong>.',
        'Dynamic variables (e.g. <code>{{1}}</code>, <code>{{2}}</code>) me realistic sample values (e.g. Rahul, 20% OFF) zaroor provide karein.',
        'Body text me excessive exclamation marks (!!!) ya short bit.ly links na daalein; direct business domain URLs use karein.'
      ],
      actionLabel: 'Create New Template ➔',
      actionTarget: 'inbox',
      keywords: 'template rejected meta approval waba sample variables guidelines utility marketing'
    },
    {
      id: 'faq-bc-3',
      menuId: 'campaigns',
      menuTitle: 'Campaigns & Marketing',
      submenuId: 'broadcast',
      submenuTitle: 'Broadcast Campaigns',
      cat: 'broadcast',
      catLabel: 'Quality Health',
      type: 'troubleshoot',
      title: 'Broadcast campaign fail ya pause kyun ho jati hai (Quality Rating Flagged)?',
      duration: '0:45',
      videoTitle: 'Fix: Recovering WhatsApp Phone Number Health & Quality Score',
      badgeClass: 'broadcast',
      steps: [
        'Top bar me Number Quality score check karein: agar <strong>Yellow (Medium)</strong> ya <strong>Red (Low)</strong> hai toh Meta rate limit karta hai.',
        'Har broadcast template me <strong>Quick Unsubscribe Button</strong> ("Reply STOP to opt out") zaroor daalein taaki users report/block na karein.',
        'Non-responding contacts ko audience list se remove karein aur agle 48 hours tak high-intent warm leads ko hi message bhejein.'
      ],
      actionLabel: 'Check Number Health ➔',
      actionTarget: 'dashboard',
      keywords: 'broadcast failed paused quality rating spam report block opt-out warm up tier'
    },
    {
      id: 'faq-bc-4',
      menuId: 'campaigns',
      menuTitle: 'Campaigns & Marketing',
      submenuId: 'broadcast',
      submenuTitle: 'Broadcast Campaigns',
      cat: 'broadcast',
      catLabel: 'Audience & CSV',
      type: 'guide',
      title: 'CSV Contact list import karke custom audience broadcast kaise banayein?',
      duration: '0:45',
      videoTitle: 'Walkthrough: Uploading CSV and Mapping Columns for Broadcast',
      badgeClass: 'broadcast',
      steps: [
        'Excel ya Google Sheets se CSV file export karein jisme <code>Phone</code>, <code>Name</code>, aur <code>Tag</code> columns hon.',
        '<strong>Contacts > Import CSV</strong> par click karein aur header columns ko system fields ke sath map karein.',
        'Contacts ko batch tag assign karein (e.g. <code>Diwali-VIP-2024</code>) aur New Broadcast me ye tag select karein.'
      ],
      actionLabel: 'Import Contacts CSV ➔',
      actionTarget: 'dashboard',
      keywords: 'csv import excel contacts bulk audience tag list upload map columns'
    },

    // --- Automation & AI (4) ---
    {
      id: 'faq-cb-1',
      menuId: 'automation',
      menuTitle: 'Automation & AI',
      submenuId: 'chatbot',
      submenuTitle: 'Chatbot Builder',
      cat: 'chatbot',
      catLabel: 'Chatbot & AI',
      type: 'guide',
      title: 'Auto-Reply Welcome Message aur 24/7 Interactive Button flow kaise banayein?',
      duration: '0:48',
      videoTitle: 'Walkthrough: Drag-and-Drop Chatbot Flow Builder',
      badgeClass: 'chatbot',
      steps: [
        '<strong>Automation & AI > Chatbot</strong> builder me jayein aur <strong>+ Create Welcome Flow</strong> click karein.',
        'Trigger condition select karein: <em>"First message from new customer"</em>.',
        'Interactive quick-reply buttons add karein: <code>[1. View Catalog]</code>, <code>[2. Pricing]</code>, <code>[3. Agent Call]</code> aur <strong>Publish Flow</strong> karein.'
      ],
      actionLabel: 'Open Chatbot Builder ➔',
      actionTarget: 'ai-agents',
      keywords: 'chatbot auto reply welcome message flow trigger bot 24/7 automation keywords'
    },
    {
      id: 'faq-cb-2',
      menuId: 'automation',
      menuTitle: 'Automation & AI',
      submenuId: 'chatbot',
      submenuTitle: 'Chatbot Builder',
      cat: 'chatbot',
      catLabel: 'Human Takeover',
      type: 'troubleshoot',
      title: 'Chatbot customer ke messages ka automatic reply kyun nahi de raha hai?',
      duration: '0:35',
      videoTitle: 'Fix: Troubleshooting Chatbot Triggers & Human Takeover Mode',
      badgeClass: 'chatbot',
      steps: [
        'Check karein chat window me <strong>Human Agent Takeover</strong> active toh nahi hai; jab executive chat me reply karta hai, bot auto-pause ho jata hai.',
        'Automation Settings me check karein ki Chatbot switch <strong>🟢 Active</strong> state me hai.',
        'Trigger keyword matching rule check karein: agar rule <em>"Exact Match"</em> hai toh typo hone par bot trigger nahi hoga; ise <em>"Contains Keyword"</em> karein.'
      ],
      actionLabel: 'Check Chatbot Rules ➔',
      actionTarget: 'ai-agents',
      keywords: 'chatbot not working silent human takeover pause keyword trigger exact match'
    },
    {
      id: 'faq-cb-3',
      menuId: 'automation',
      menuTitle: 'Automation & AI',
      submenuId: 'ai-agents',
      submenuTitle: 'AI Agent & Training',
      cat: 'chatbot',
      catLabel: 'AI Knowledge Base',
      type: 'guide',
      title: 'AI Sales Agent me Product Catalog & PDF Knowledge Base train kaise karein?',
      duration: '0:50',
      videoTitle: 'Walkthrough: Training AI Agent with PDFs, FAQs & Product Docs',
      badgeClass: 'chatbot',
      steps: [
        '<strong>Automation & AI > AI Agents</strong> me jayein aur <strong>Knowledge Base</strong> tab select karein.',
        'Apni company ka Pricing PDF, Product Specifications, ya FAQs text file drag & drop karke upload karein.',
        'Live Simulator playground me sample customer questions puchhkar test karein aur <strong>Deploy AI Agent</strong> par click karein.'
      ],
      actionLabel: 'Train AI Agent ➔',
      actionTarget: 'ai-agents',
      keywords: 'ai agent knowledge base upload pdf training prompt catalog rag vectors'
    },
    {
      id: 'faq-cb-4',
      menuId: 'automation',
      menuTitle: 'Automation & AI',
      submenuId: 'ai-agents',
      submenuTitle: 'AI Agent & Training',
      cat: 'chatbot',
      catLabel: 'AI Accuracy & Prompts',
      type: 'troubleshoot',
      title: 'AI Bot customer ko galat ya out-of-context reply de raha hai, guardrails kaise lagayein?',
      duration: '0:42',
      videoTitle: 'Fix: Fine-tuning AI Prompts, Temperature & Fallback to Human',
      badgeClass: 'chatbot',
      steps: [
        'AI Agent settings me jakar <strong>AI Temperature</strong> ko <code>0.2</code> (Strict & Precise) par set karein taaki hallucinations na hon.',
        'System prompt me strict instructions add karein: <em>"Sirf uploaded knowledge base se hi answer karein; agar exact answer na pata ho toh Human Support transfer karein."</em>',
        '<strong>Automatic Fallback</strong> toggle enable karein: agar AI confidence score 80% se kam ho toh chat turant live sales rep ko escalate ho jayegi.'
      ],
      actionLabel: 'Tune AI Guardrails ➔',
      actionTarget: 'ai-agents',
      keywords: 'ai wrong reply hallucination temperature guardrails prompt system instructions fallback'
    },

    // --- CRM & Leads (4) ---
    {
      id: 'faq-crm-1',
      menuId: 'automation',
      menuTitle: 'Automation & AI',
      submenuId: 'auto-assign',
      submenuTitle: 'Auto Assign Rules',
      cat: 'crm',
      catLabel: 'CRM & Routing',
      type: 'guide',
      title: 'Inbound Leads ko Telecallers me automatically Round-Robin assign kaise karein?',
      duration: '0:42',
      videoTitle: 'Walkthrough: Setting up Auto-Assign Rules & Round Robin',
      badgeClass: 'team',
      steps: [
        '<strong>Automation & AI > Auto Assign</strong> me jayein aur <strong>Round-Robin Lead Distribution</strong> toggle ON karein.',
        'Active sales executives (Rahul Sharma, Aman Gupta, Priya Patel) select karein aur unka working shifts set karein.',
        'Naya lead capture hote hi system sequentially agle agent ko WhatsApp notification aur Task ke sath assign kar dega.'
      ],
      actionLabel: 'Configure Auto-Assign ➔',
      actionTarget: 'auto-assign',
      keywords: 'auto assign round robin lead distribution telecaller routing sales rep delegation'
    },
    {
      id: 'faq-crm-2',
      menuId: 'crm',
      menuTitle: 'CRM & Leads',
      submenuId: 'all-leads',
      submenuTitle: 'All Leads',
      cat: 'crm',
      catLabel: 'Meta Lead Ads',
      type: 'troubleshoot',
      title: 'Facebook / Instagram Lead Ads se aane wale leads CRM me sync nahi ho rahe?',
      duration: '0:40',
      videoTitle: 'Fix: Reconnecting Meta Lead Ads Webhook & Page Permissions',
      badgeClass: 'team',
      steps: [
        '<strong>Settings > Integrations > Meta Lead Ads</strong> me jayein aur check karein Facebook Page connection status active hai ya nahi.',
        'Meta Business Manager me check karein ki connected user ke paas Facebook Page ka <strong>"Manage Leads" (Lead Access)</strong> permission granted hai.',
        '<strong>"Test Webhook Ping"</strong> button par click karein; sample lead generate karke live sync verify karein.'
      ],
      actionLabel: 'Check Meta Lead Ads ➔',
      actionTarget: 'auto-assign',
      keywords: 'facebook lead ads instagram forms webhook sync not receiving missing permissions token'
    },
    {
      id: 'faq-crm-3',
      menuId: 'crm',
      menuTitle: 'CRM & Leads',
      submenuId: 'pipeline',
      submenuTitle: 'Deals Pipeline',
      cat: 'crm',
      catLabel: 'Deals Pipeline',
      type: 'guide',
      title: 'Deals Pipeline me Drag & Drop karke deals win/close kaise karein?',
      duration: '0:40',
      videoTitle: 'Walkthrough: Managing Deals Kanban Board & Revenue Tracking',
      badgeClass: 'team',
      steps: [
        'Sidebar me <strong>CRM > Deals Pipeline</strong> par jayein.',
        'Deal card ko mouse se drag karke next stage me drop karein: <em>Discovery ➔ Demo Booked ➔ Proposal Sent ➔ Deal Won</em>.',
        'Deal Won stage me drop karte hi system deal amount calculate karke team analytics aur sales rep commission me add kar dega.'
      ],
      actionLabel: 'Open Deals Pipeline ➔',
      actionTarget: 'dashboard',
      keywords: 'deals pipeline kanban stages close win revenue sales funnel drag drop'
    },
    {
      id: 'faq-crm-4',
      menuId: 'crm',
      menuTitle: 'CRM & Leads',
      submenuId: 'tags',
      submenuTitle: 'Tags & Segments',
      cat: 'crm',
      catLabel: 'Data & Contacts',
      type: 'troubleshoot',
      title: 'Lead details me phone number duplicate create hone se kaise rokein?',
      duration: '0:35',
      videoTitle: 'Fix: Enabling Smart Phone Deduplication & Auto-Merge Rules',
      badgeClass: 'team',
      steps: [
        '<strong>Settings > CRM Settings > Deduplication Rules</strong> me jayein.',
        '<strong>"Strict Phone Deduplication"</strong> switch ON karein; is se same number se dobara message aane par naya lead banne ke bajaye existing profile update hogi.',
        'Duplicate contacts ko clean karne ke liye <strong>"Find & Merge Duplicates"</strong> scanner run karein.'
      ],
      actionLabel: 'Configure Deduplication ➔',
      actionTarget: 'dashboard',
      keywords: 'duplicate leads merge phone number clash crm clean up contacts sync'
    },

    // --- Team & Operations (3) ---
    {
      id: 'faq-tsk-1',
      menuId: 'team',
      menuTitle: 'Team Management',
      submenuId: 'team-members',
      submenuTitle: 'Team Members',
      cat: 'tasks',
      catLabel: 'Tasks & Checklist',
      type: 'guide',
      title: 'Task Management: Subtasks checklist, Due Date reminder aur Notes add kaise karein?',
      duration: '0:45',
      videoTitle: 'Walkthrough: Creating Actionable Tasks with Subtasks & Reminders',
      badgeClass: 'team',
      steps: [
        '<strong>Operations > Tasks & Follow-ups</strong> me <strong>+ Create Task</strong> par click karein.',
        'Title, related Lead, Priority, aur Deadline set karein; neeche <strong>+ Add Subtask</strong> karke actionable checklist banayein.',
        '<em>"Send automated WhatsApp alert 15 mins before deadline"</em> checkbox tick karein taaki assigned sales rep ko reminder alert mile.'
      ],
      actionLabel: 'Create New Task ➔',
      actionTarget: 'tasks',
      keywords: 'tasks subtasks checklist due date reminder notes follow up telecaller assignment'
    },
    {
      id: 'faq-tsk-2',
      menuId: 'team',
      menuTitle: 'Team Management',
      submenuId: 'roles',
      submenuTitle: 'Roles & Permissions',
      cat: 'tasks',
      catLabel: 'Custom Categories',
      type: 'troubleshoot',
      title: 'Custom Task Types create karte waqt error ya missing option kaise fix karein?',
      duration: '0:35',
      videoTitle: 'Fix: Managing Business Custom Task Types & Category Reset',
      badgeClass: 'team',
      steps: [
        'Tasks view me header me <strong>⚙️ Customize Types</strong> button par click karein.',
        'Agar koi customized type dropdown me nahi dikh rahi, toh check karein ki icon aur label dono fill kiye hain (e.g. 🏢 Site Visit).',
        'Agar default categories restore karni hon, toh modal me <strong>↺ Reset to Defaults</strong> par click karein.'
      ],
      actionLabel: 'Customize Task Types ➔',
      actionTarget: 'tasks',
      keywords: 'task types custom categories dropdown missing edit delete reset business workflow'
    },
    {
      id: 'faq-tsk-3',
      menuId: 'team',
      menuTitle: 'Team Management',
      submenuId: 'team-members',
      submenuTitle: 'Team Members',
      cat: 'tasks',
      catLabel: 'Kanban Reschedule',
      type: 'troubleshoot',
      title: 'Overdue Tasks ko Kanban board me Today ya Tomorrow me drag drop karke reschedule kaise karein?',
      duration: '0:40',
      videoTitle: 'Fix & Walkthrough: Drag-and-Drop Task Rescheduling on Kanban',
      badgeClass: 'team',
      steps: [
        'Tasks module me view toggle se <strong>Kanban Schedule View</strong> select karein.',
        '<strong>Overdue</strong> column se kisi bhi expired task card ko drag karein aur <strong>Today</strong> ya <strong>Tomorrow</strong> column me drop karein.',
        'System automatically task ki due date update kar dega aur timeline audit log me reschedule history record kar dega.'
      ],
      actionLabel: 'Open Tasks Kanban ➔',
      actionTarget: 'tasks',
      keywords: 'drag drop kanban reschedule overdue today tomorrow column due date update'
    },

    // --- Developer & Integrations (3) ---
    {
      id: 'faq-int-1',
      menuId: 'dev',
      menuTitle: 'Developer & Integrations',
      submenuId: 'integrations',
      submenuTitle: 'Integrations & Apps',
      cat: 'integrations',
      catLabel: 'E-Commerce & Carts',
      type: 'guide',
      title: 'Shopify / WooCommerce Abandoned Cart recovery WhatsApp alert kaise setup karein?',
      duration: '0:45',
      videoTitle: 'Walkthrough: Connecting E-Commerce Cart Webhooks for Recovery',
      badgeClass: 'chatbot',
      steps: [
        '<strong>Settings > Integrations > Webhooks</strong> me jakar apna SimpleFloww Unique Webhook URL copy karein.',
        'Shopify / WooCommerce store me Admin ➔ Notifications ➔ Webhooks me <em>"Checkout Created / Updated"</em> trigger par ye URL paste karein.',
        'SimpleFloww me 15-minute delay set karke personalized checkout link aur 10% discount code ka auto-template schedule karein.'
      ],
      actionLabel: 'Setup Cart Recovery ➔',
      actionTarget: 'dashboard',
      keywords: 'shopify woocommerce abandoned cart recovery webhook trigger ecommerce store'
    },
    {
      id: 'faq-int-2',
      menuId: 'dev',
      menuTitle: 'Developer & Integrations',
      submenuId: 'webhooks',
      submenuTitle: 'Webhooks & API Keys',
      cat: 'integrations',
      catLabel: 'API & Webhooks',
      type: 'troubleshoot',
      title: 'Webhook payload fail ho raha hai ya 401 Unauthorized error aa raha hai?',
      duration: '0:35',
      videoTitle: 'Fix: Resolving API Authentication & Invalid Webhook Payloads',
      badgeClass: 'chatbot',
      steps: [
        '<strong>Settings > API Keys</strong> me jakar verify karein ki aapka <strong>Bearer Token</strong> active hai aur revoke nahi hua.',
        'Ensure karein ki incoming POST request me header <code>Content-Type: application/json</code> set hai aur phone number valid E.164 (+91) format me hai.',
        '<strong>Webhook Logs</strong> tab me jakar failed request ka exact HTTP response code aur server error stack trace inspect karein.'
      ],
      actionLabel: 'Inspect Webhook Logs ➔',
      actionTarget: 'dashboard',
      keywords: 'webhook error 401 unauthorized bearer token payload bad request post api'
    },
    {
      id: 'faq-int-3',
      menuId: 'dev',
      menuTitle: 'Developer & Integrations',
      submenuId: 'integrations',
      submenuTitle: 'Integrations & Apps',
      cat: 'integrations',
      catLabel: 'Zapier & Make',
      type: 'troubleshoot',
      title: 'Google Sheets se Zapier / Make.com automation trigger nahi ho raha hai?',
      duration: '0:40',
      videoTitle: 'Fix: Connecting Google Sheets Triggers with WhatsApp Outbound API',
      badgeClass: 'chatbot',
      steps: [
        'Google Sheet me check karein ki naye rows add hone par pehli row empty na ho aur column headers (Name, Phone) row 1 me fixed hon.',
        'Zapier / Make connection test me <strong>"Fetch Sample Data"</strong> run karein taaki field mapping refresh ho jaye.',
        'Ensure karein ki Zap status <strong>ON (Published)</strong> hai aur SimpleFloww outbound endpoint <code>/api/v1/send-template</code> call ho raha hai.'
      ],
      actionLabel: 'Open Integrations ➔',
      actionTarget: 'dashboard',
      keywords: 'google sheets zapier make automation trigger new row zap error field mapping'
    },

    // --- Billing & Credits (4) ---
    {
      id: 'faq-bil-1',
      menuId: 'billing',
      menuTitle: 'Billing & Credits',
      submenuId: 'invoices',
      submenuTitle: 'GST Invoices',
      cat: 'billing',
      catLabel: 'Invoices & Tax',
      type: 'guide',
      title: 'Monthly GST Tax Invoice aur Wallet Recharge Receipt download kaise karein?',
      duration: '0:35',
      videoTitle: 'Walkthrough: Downloading GST Invoices & Managing Wallet',
      badgeClass: 'billing',
      steps: [
        'Top header me wallet balance pill par click karein ya <strong>Settings > Invoices</strong> me jayein.',
        '<strong>Transaction & Invoice History</strong> me aapke sabhi recharge transactions listed hain.',
        'Download icon par click karke 18% GST Input Credit claim karne ke liye signed PDF invoice instant download karein.'
      ],
      actionLabel: 'View Invoices & Wallet ➔',
      actionTarget: 'dashboard',
      keywords: 'invoice gst tax receipt wallet recharge billing pdf download payment input tax credit'
    },
    {
      id: 'faq-bil-2',
      menuId: 'billing',
      menuTitle: 'Billing & Credits',
      submenuId: 'wallet',
      submenuTitle: 'Conversation Wallet',
      cat: 'billing',
      catLabel: 'Wallet & Payments',
      type: 'troubleshoot',
      title: 'UPI / NetBanking recharge payment deduct ho gaya par wallet balance update nahi hua?',
      duration: '0:35',
      videoTitle: 'Fix: Instant Reconciliation for Pending UPI & Gateway Payments',
      badgeClass: 'billing',
      steps: [
        'Top header me wallet balance pill ke paas <strong>↻ Sync Balance</strong> button par click karein; banking gateway ping refresh ho jayega.',
        'Bank statement ya UPI app (GPay/PhonePe) se 12-digit <strong>UTR Number</strong> note karein.',
        'Agar 5 minutes me auto-credit na ho, toh <strong>1-Click WhatsApp Support</strong> par UTR share karein; hamari finance team 3 minutes me credit karti hai.'
      ],
      actionLabel: 'Sync Wallet Balance ➔',
      actionTarget: 'dashboard',
      keywords: 'upi payment failed wallet recharge money deducted pending utr reconciliation razorpay'
    },
    {
      id: 'faq-bil-3',
      menuId: 'billing',
      menuTitle: 'Billing & Credits',
      submenuId: 'wallet',
      submenuTitle: 'Conversation Wallet',
      cat: 'billing',
      catLabel: 'Meta Pricing Rules',
      type: 'guide',
      title: 'Meta WhatsApp Conversation Charges (Marketing vs Utility) kaise calculate hote hain?',
      duration: '0:45',
      videoTitle: 'Walkthrough: Meta Official Pricing & Conversation Session Rules',
      badgeClass: 'billing',
      steps: [
        'Meta conversation charges 24-hour window basis par lagte hain: promotional offers ke liye <strong>Marketing (~₹0.78/conv)</strong>.',
        'Order dispatch, OTP aur transactional receipts ke liye <strong>Utility (~₹0.11/conv)</strong> apply hota hai.',
        'Har mahine pehle <strong>1,000 Inbound Service Conversations bilkul Free</strong> hote hain (Meta Tier-1 waiver).'
      ],
      actionLabel: 'View Pricing Calculator ➔',
      actionTarget: 'dashboard',
      keywords: 'meta charges pricing marketing utility service conversation 24 hour rates cost per message'
    },
    {
      id: 'faq-bil-4',
      menuId: 'billing',
      menuTitle: 'Billing & Credits',
      submenuId: 'invoices',
      submenuTitle: 'GST Invoices',
      cat: 'billing',
      catLabel: 'Company Tax Profile',
      type: 'troubleshoot',
      title: 'Company GSTIN update kaise karein taaki input credit tax invoice par print ho?',
      duration: '0:35',
      videoTitle: 'Fix: Updating Registered GSTIN & Billing Address for Invoices',
      badgeClass: 'billing',
      steps: [
        '<strong>Settings > Company Profile > Billing & Tax Details</strong> me jayein.',
        'Apna 15-digit verified GSTIN aur registered business trade name enter karein.',
        '<strong>"Save Tax Profile"</strong> dabayein; system GST portal se company name auto-verify karke agle sabhi invoices par legal GSTIN print karega.'
      ],
      actionLabel: 'Update GSTIN ➔',
      actionTarget: 'dashboard',
      keywords: 'gstin update tax profile input credit itc b2b invoice address company name'
    }
  ];

    // =========================================================================
    // RESELLER & PARTNER KNOWLEDGE BASE / PLAYBOOKS ENGINE
    // =========================================================================
    let resellerPlaybooksData = [
      {
        id: 'rpb-1',
        menuId: 'reseller',
        menuTitle: 'Reseller Agency',
        submenuId: 'cname',
        submenuTitle: 'Custom Domain CNAME',
        cat: 'whitelabel',
        catLabel: '🏢 White-Label & Domain',
        badgeClass: 'badge-purple',
        title: 'How to setup Custom Domain CNAME & White-Label SSL (portal.yourdomain.com)',
        duration: '4:20',
        summary: 'Complete DNS setup to remove SimpleFloww branding and map your own agency domain with automated SSL.',
        steps: [
          'Log in to your DNS provider (Cloudflare, GoDaddy, Hostinger, AWS Route53).',
          'Add a CNAME record: Host = portal (or crm), Target = whitelabel.simplefloww.com, TTL = Auto (or 3600s).',
          'Go to SimpleFloww Settings > White-Label Portal > Custom Domain, enter portal.yourdomain.com and click "Verify DNS".',
          'Our system automatically issues an enterprise Cloudflare SSL certificate within 3 to 10 minutes.',
          'Upload your custom SVG logo, favicon, portal brand color (#HEX), and custom footer copyright text.',
          'Configure your transactional SMTP credentials (SendGrid, AWS SES, or custom SMTP) so password resets and notifications come from support@yourdomain.com.'
        ],
        tip: 'Pro Tip: Using Cloudflare with DNS Proxy (Orange Cloud turned OFF initially for SSL handshake) enables sub-30ms DNS resolution across India.'
      },
      {
        id: 'rpb-2',
        menuId: 'reseller',
        menuTitle: 'Reseller Agency',
        submenuId: 'pricing',
        submenuTitle: 'Packaging & Margins',
        cat: 'pricing',
        catLabel: '💰 Pricing & Margins',
        badgeClass: 'badge-green',
        title: 'Packaging & Pricing Strategy: Charging Clients ₹2,999/mo with 100% Retained Margin',
        duration: '5:15',
        summary: 'How to package SimpleFloww features for local Indian businesses and maximize lifetime client retention.',
        steps: [
          'White-Label Partners pay SimpleFloww flat ₹25,000/year (₹2,083/mo). There is zero per-seat royalty or revenue cut to SimpleFloww.',
          'Standard Package for SMEs: Charge ₹2,999/month (or ₹29,999/year upfront) including WhatsApp CRM + 5 telecaller logins + Round-Robin auto assignment.',
          'Premium Automation Package: Charge ₹5,999/month including AI Auto-Reply Bot + Shopify/WooCommerce lead sync + unlimited broadcast campaigns.',
          'Setup & Onboarding Fee: Charge a 1-time ₹5,000 - ₹10,000 onboarding fee for Meta Business verification, green tick application, and chatbot flow design.',
          'Meta Conversation Charges: Bill client on actuals (Utility: ~₹0.11, Marketing: ~₹0.78 per message) with a 15-20% management markup or let them link their own credit card directly to Meta.'
        ],
        tip: 'With just 10 active clients on ₹2,999/mo, your agency generates ₹3,60,000/yr gross revenue against a ₹25,000 cost — a 1,340% annual ROI!'
      },
      {
        id: 'rpb-3',
        menuId: 'reseller',
        menuTitle: 'Reseller Agency',
        submenuId: 'waba',
        submenuTitle: 'Client WABA Onboarding',
        cat: 'meta',
        catLabel: '📱 Meta Cloud API',
        badgeClass: 'badge-blue',
        title: 'Client WhatsApp Cloud API Onboarding & Embedded Signup Playbook',
        duration: '6:30',
        summary: 'Effortlessly onboard client phone numbers into official Meta WABA without technical friction.',
        steps: [
          'Ensure the client phone number is NOT currently registered on WhatsApp personal or WhatsApp Business App (delete existing account from app settings if already used).',
          'Have client ready with their Meta Business Manager admin login and official business documents (GST Certificate, MSME Udyam, or Certificate of Incorporation).',
          'From your white-label portal, click "+ Onboard Client WABA" which launches Meta Embedded Signup popup.',
          'Select or create the client Business Manager, verify OTP on the client SIM card, and accept Meta Cloud API terms.',
          'Meta will instantly grant 250 conversations/24h Tier. Submit legal business documents under Meta Business Settings > Security Center for permanent 1,000 - 100,000 limit.',
          'Webhook HMAC handshake is auto-completed by SimpleFloww backend with 0 code required.'
        ],
        tip: 'Always advise clients to use a dedicated SIM (e.g. Jio/Airtel ₹149 plan) rather than personal numbers to avoid personal WhatsApp data loss.'
      },
      {
        id: 'rpb-4',
        menuId: 'reseller',
        menuTitle: 'Reseller Agency',
        submenuId: 'sales',
        submenuTitle: 'Objection Handling',
        cat: 'sales',
        catLabel: '🎯 Sales & Closing',
        badgeClass: 'badge-orange',
        title: 'Objection Handling Playbook: Closing Against Wati, Interakt & Aisensy',
        duration: '4:50',
        summary: 'Proven scripts and counter-arguments to win SME deals when clients compare with competing tools.',
        steps: [
          'Objection: "Wati / Interakt charges ₹2,499/mo, why should I buy from you?" -> Response: "Wati charges per-user seat fees (₹1,000 extra per agent). With us, you get unlimited telecaller seats and automated round-robin lead distribution included."',
          'Objection: "Can I send 50,000 messages in 1 hour without getting banned?" -> Response: "No platform can guarantee zero ban if guidelines are violated. But we provide an algorithmic smart-throttling queue and warmed-up template rotators that keep your Meta number rating in High Green."',
          'Objection: "Who will train my sales staff?" -> Response: "Unlike self-serve tools where you talk to bots, you get a dedicated WhatsApp support group with our certified technical engineers for 1-on-1 team training."',
          'Objection: "Do you integrate with my website or Google Sheets?" -> Response: "Yes, we connect directly via Webhook, Zapier, Pabbly, or direct Google Sheet two-way sync within 5 minutes."'
        ],
        tip: 'Focus on lead response time: Show the prospect how answering leads within 60 seconds increases conversion by 391% compared to manual calling.'
      },
      {
        id: 'rpb-5',
        menuId: 'reseller',
        menuTitle: 'Reseller Agency',
        submenuId: 'compliance',
        submenuTitle: 'Number Warmup & Bans',
        cat: 'compliance',
        catLabel: '🛡️ Ban Prevention',
        badgeClass: 'badge-red',
        title: 'Meta Broadcast Ban Prevention & Number Warm-Up Schedule',
        duration: '3:45',
        summary: 'Strict step-by-step warmup protocol to protect client WhatsApp phone numbers and maintain High Green rating.',
        steps: [
          'Day 1 to 3: Maximum 50 messages/day. Send only high-intent utility or transaction messages to past buyers who have saved the business contact.',
          'Day 4 to 7: Scale to 250-500 messages/day. Ensure every marketing broadcast template has a clear "STOP" or "Unsubscribe" quick-reply button.',
          'Week 2: Scale to 1,000 - 2,500 messages/day across segmented lists. Monitor Meta Quality Rating in real time under WABA health.',
          'Week 3+: Once Meta promotes phone number to Tier 2 (10,000 msg/day) or Tier 3 (100,000 msg/day), run larger scheduled campaigns.',
          'Golden Rule: Never blast cold purchased contact lists. Meta algorithms detect rapid user blocks/reports and will downgrade quality to Red within 2 hours.'
        ],
        tip: 'Include client name and personalized details in parameters {{1}} and {{2}} to prevent Meta spam pattern heuristics from flagging identical bulk payloads.'
      },
      {
        id: 'rpb-6',
        menuId: 'reseller',
        menuTitle: 'Reseller Agency',
        submenuId: 'subtenants',
        submenuTitle: 'Client Tenancy & Seats',
        cat: 'subaccounts',
        catLabel: '👥 Sub-Accounts',
        badgeClass: 'badge-cyan',
        title: 'Managing Client Sub-Tenants, Telecaller Seats & Wallet Balances',
        duration: '4:10',
        summary: 'How to administer multiple businesses under one master partner command center.',
        steps: [
          'From Reseller Portal > Sub-Accounts, click "Add Organization" and assign the client their custom login URL.',
          'Set permission scopes: Admin (full access), Manager (campaigns & leads), Telecaller (assigned leads and live inbox chat only).',
          'Configure lead assignment rule: Round-Robin (equal distribution), Weighted (by closer seniority), or Region-wise routing.',
          'Recharge conversation wallet: Set automated low-balance email alerts when client wallet falls below ₹500.',
          'Export audit logs: Generate monthly telecaller activity reports and campaign conversion metrics with your agency logo.'
        ],
        tip: 'Restrict Telecallers from exporting full phone number CSVs in User Roles to prevent telecallers from stealing client lead databases.'
      }
    ];

    const resellerKbState = {
      cat: 'all',
      search: '',
      openPlaybookId: 'rpb-1'
    };

    function renderResellerPlaybooks() {
      const container = document.getElementById('reseller-accordion-list');
      if (!container) return;

      const filtered = resellerPlaybooksData.filter(pb => {
        const matchCat = resellerKbState.cat === 'all' || pb.cat === resellerKbState.cat;
        if (!matchCat) return false;
        if (!resellerKbState.search) return true;
        const q = resellerKbState.search.toLowerCase();
        return pb.title.toLowerCase().includes(q) ||
               pb.summary.toLowerCase().includes(q) ||
               pb.steps.some(s => s.toLowerCase().includes(q));
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="background:#fff; border:1px solid var(--sf-border); border-radius:12px; padding:40px 20px; text-align:center;">
            <div style="font-size:32px; margin-bottom:8px;">🔍</div>
            <h4 style="font-size:15px; font-weight:700; color:var(--sf-text-main); margin-bottom:4px;">No matching playbook found for "${resellerKbState.search}"</h4>
            <p style="font-size:12.5px; color:var(--sf-text-muted); margin-bottom:14px;">Try searching broader keywords like "domain", "pricing", or "warmup".</p>
            <button type="button" class="btn-secondary" id="btn-reset-rpb-search" style="font-size:12px;">Clear Search</button>
          </div>
        `;
        const btnReset = document.getElementById('btn-reset-rpb-search');
        if (btnReset) {
          btnReset.addEventListener('click', () => {
            resellerKbState.search = '';
            const inp = document.getElementById('reseller-search-input');
            if (inp) inp.value = '';
            renderResellerPlaybooks();
          });
        }
        return;
      }

      container.innerHTML = filtered.map(pb => {
        const isOpen = pb.id === resellerKbState.openPlaybookId;
        return `
          <div class="faq-item ${isOpen ? 'is-open' : ''}" data-pb-id="${pb.id}">
            <div class="faq-header" data-toggle-pb-id="${pb.id}">
              <div class="faq-header-left">
                <span class="faq-category-badge ${pb.badgeClass}">${pb.catLabel}</span>
                <h3 class="faq-title">${pb.title}</h3>
              </div>
              <div class="faq-header-right">
                <span class="faq-video-badge" style="background:#f5f3ff; color:#7c3aed; border:1px solid #ddd6fe;">
                  ⚡ Playbook
                </span>
                <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            <div class="faq-body" style="${isOpen ? 'display:block;' : 'display:none;'}">
              <p style="font-size:13px; color:#475569; margin: 0 0 12px 0; line-height: 1.5;">${pb.summary}</p>
              
              <div class="faq-steps-card">
                <div class="faq-steps-card-title" style="color:#4338ca;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                  Execution Steps & Protocol
                </div>
                ${pb.steps.map((st, i) => `
                  <div class="faq-step-item">
                    <div class="faq-step-num" style="background:#4338ca; color:#fff;">${i + 1}</div>
                    <div style="font-size:12.5px; line-height:1.5;">${st}</div>
                  </div>
                `).join('')}
              </div>

              <div style="margin-top:12px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; font-size:12.5px; color:#166534;">
                💡 <strong>${pb.tip}</strong>
              </div>

              <div class="faq-footer-bar" style="margin-top:14px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:12px; color:#64748b;">Useful for your agency?</span>
                  <button type="button" class="faq-feedback-btn" onclick="showToast('Thank you for partner feedback!')">👍 Helpful</button>
                </div>
                <button type="button" class="btn-primary" onclick="window.downloadPartnerAsset && window.downloadPartnerAsset('playbook')" style="font-size:12px; padding:6px 14px;">
                  Download Checklist PDF
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('[data-toggle-pb-id]').forEach(h => {
        h.addEventListener('click', () => {
          const id = h.getAttribute('data-toggle-pb-id');
          resellerKbState.openPlaybookId = resellerKbState.openPlaybookId === id ? null : id;
          renderResellerPlaybooks();
        });
      });
    }

    function initResellerKnowledgeBase() {
      renderResellerPlaybooks();

      // Category Tabs Filter
      const rpbTabs = document.querySelectorAll('#reseller-cat-tabs .helpdesk-tab-btn');
      rpbTabs.forEach(btn => {
        btn.addEventListener('click', () => {
          rpbTabs.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          resellerKbState.cat = btn.getAttribute('data-reseller-cat') || 'all';
          renderResellerPlaybooks();
        });
      });

      // Search Input
      const rpbSearch = document.getElementById('reseller-search-input');
      const rpbClear = document.getElementById('reseller-search-clear');
      if (rpbSearch) {
        rpbSearch.addEventListener('input', () => {
          resellerKbState.search = rpbSearch.value.trim();
          if (rpbClear) rpbClear.style.display = resellerKbState.search ? 'block' : 'none';
          renderResellerPlaybooks();
        });
      }
      if (rpbClear && rpbSearch) {
        rpbClear.addEventListener('click', () => {
          rpbSearch.value = '';
          resellerKbState.search = '';
          rpbClear.style.display = 'none';
          renderResellerPlaybooks();
        });
      }

      // Fast track queries
      document.querySelectorAll('[data-reseller-query]').forEach(pill => {
        pill.addEventListener('click', () => {
          const q = pill.getAttribute('data-reseller-query');
          if (rpbSearch && q) {
            rpbSearch.value = q;
            resellerKbState.search = q;
            if (rpbClear) rpbClear.style.display = 'block';
            renderResellerPlaybooks();
          }
        });
      });
    }

    // =========================================================================
    // RESELLER KNOWLEDGE BASE STUDIO: CUSTOM ARTICLES & CRUD ENGINE
    // =========================================================================
    function loadCustomKbArticles() {
      try {
        const raw = localStorage.getItem('sf_custom_kb_articles');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    function saveCustomKbArticles(articles) {
      try {
        localStorage.setItem('sf_custom_kb_articles', JSON.stringify(articles));
      } catch (e) {
        console.error('Failed to save custom articles to localStorage', e);
      }
    }

    function mergeCustomArticles() {
      const customArticles = loadCustomKbArticles();
      helpdeskFaqsData = helpdeskFaqsData.filter(f => !f.isCustom);
      resellerPlaybooksData = resellerPlaybooksData.filter(p => !p.isCustom);

      customArticles.forEach(item => {
        if (item.audience === 'reseller') {
          resellerPlaybooksData.unshift(item);
        } else {
          helpdeskFaqsData.unshift(item);
        }
      });
    }

    const rkbManageState = {
      search: '',
      audience: 'all' // 'all' | 'client' | 'reseller' | 'custom'
    };

    function renderResellerKbManageTable() {
      const tbody = document.getElementById('rkb-manage-tbody');
      if (!tbody) return;

      const customArticles = loadCustomKbArticles();
      const allArticles = [
        ...helpdeskFaqsData.map(f => ({ ...f, audience: f.audience || 'client' })),
        ...resellerPlaybooksData.map(p => ({ ...p, audience: p.audience || 'reseller' }))
      ];

      // Update Metric Numbers & Pills
      const totalCount = allArticles.length;
      const clientCount = helpdeskFaqsData.length;
      const resellerCount = resellerPlaybooksData.length;
      const customCount = customArticles.length;

      const elTot = document.getElementById('rkb-stat-total');
      const elCli = document.getElementById('rkb-stat-client');
      const elRes = document.getElementById('rkb-stat-reseller');
      const elCus = document.getElementById('rkb-stat-custom');
      if (elTot) elTot.textContent = totalCount;
      if (elCli) elCli.textContent = clientCount;
      if (elRes) elRes.textContent = resellerCount;
      if (elCus) elCus.textContent = customCount;

      const pAll = document.getElementById('rkb-cnt-pill-all');
      const pCli = document.getElementById('rkb-cnt-pill-client');
      const pRes = document.getElementById('rkb-cnt-pill-reseller');
      const pCus = document.getElementById('rkb-cnt-pill-custom');
      if (pAll) pAll.textContent = totalCount;
      if (pCli) pCli.textContent = clientCount;
      if (pRes) pRes.textContent = resellerCount;
      if (pCus) pCus.textContent = customCount;

      // Filter articles
      const filtered = allArticles.filter(item => {
        if (rkbManageState.audience === 'client' && item.audience !== 'client') return false;
        if (rkbManageState.audience === 'reseller' && item.audience !== 'reseller') return false;
        if (rkbManageState.audience === 'custom' && !item.isCustom) return false;

        if (!rkbManageState.search) return true;
        const q = rkbManageState.search.toLowerCase();
        return (item.title && item.title.toLowerCase().includes(q)) ||
               (item.catLabel && item.catLabel.toLowerCase().includes(q)) ||
               (item.summary && item.summary.toLowerCase().includes(q));
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 36px 20px; color: #64748b;">
              <div style="font-size: 26px; margin-bottom: 6px;">📄</div>
              <strong>No matching articles found for "${rkbManageState.search}".</strong>
              <div style="font-size: 12px; margin-top: 4px;">Click "+ Add New Article / Guide" to publish a new guide.</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(item => {
        const isClient = item.audience === 'client';
        const audBadge = isClient
          ? `<span class="rkb-badge-aud-client">👤 Client Portal</span>`
          : `<span class="rkb-badge-aud-reseller">💼 Reseller Portal</span>`;
        
        const typeBadge = item.type === 'troubleshoot'
          ? `<span style="font-size:11px; font-weight:600; color:#ea580c; background:#fff7ed; padding:2px 7px; border-radius:4px; border:1px solid #ffedd5;">⚡ Quick Fix</span>`
          : (item.type === 'playbook' 
             ? `<span style="font-size:11px; font-weight:600; color:#4338ca; background:#e0e7ff; padding:2px 7px; border-radius:4px; border:1px solid #c7d2fe;">💼 Playbook</span>`
             : `<span style="font-size:11px; font-weight:600; color:#0284c7; background:#f0f9ff; padding:2px 7px; border-radius:4px; border:1px solid #e0f2fe;">📖 Guide</span>`);

        const statusBadge = item.status === 'draft'
          ? `<span class="rkb-badge-draft">🟡 Draft</span>`
          : `<span class="rkb-badge-live">🟢 Live</span>`;

        const summaryText = item.summary || (item.steps && item.steps[0] ? item.steps[0].replace(/<[^>]*>?/gm, '') : 'Resolution guide and execution steps.');

        return `
          <tr>
            <td>
              <div class="rkb-article-cell">
                <div class="rkb-article-title" onclick="window.previewKbArticle && window.previewKbArticle('${item.id}', '${item.audience}')">
                  ${item.title}
                  ${item.isCustom ? '<span class="faq-custom-badge">✨ Custom</span>' : ''}
                </div>
                <div class="rkb-article-snippet">${summaryText}</div>
              </div>
            </td>
            <td>${audBadge}</td>
            <td><span class="faq-category-badge ${item.badgeClass || 'whatsapp'}">${item.catLabel || 'General'}</span></td>
            <td>${typeBadge}</td>
            <td>${statusBadge}</td>
            <td style="text-align: right;">
              <div class="rkb-action-group">
                <button type="button" class="rkb-action-btn" onclick="window.previewKbArticle && window.previewKbArticle('${item.id}', '${item.audience}')" title="Preview Article">
                  👁️
                </button>
                <button type="button" class="rkb-action-btn" onclick="window.openEditKbArticleModal && window.openEditKbArticleModal('${item.id}', '${item.audience}')" title="Edit Article">
                  ✏️
                </button>
                ${item.isCustom ? `
                  <button type="button" class="rkb-action-btn btn-delete" onclick="window.deleteCustomKbArticle && window.deleteCustomKbArticle('${item.id}')" title="Delete Article">
                    🗑️
                  </button>
                ` : `
                  <button type="button" class="rkb-action-btn" style="opacity:0.4; cursor:not-allowed;" title="Core Guide (Read-Only)">
                    🔒
                  </button>
                `}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Submenu mapping dictionary for modal dropdown
    const KB_CRM_SUBMENUS_CONFIG = {
      'comm': [
        { id: 'wa-accounts', label: 'WhatsApp Accounts' },
        { id: 'inbox', label: 'Live Inbox' },
        { id: 'quick-replies', label: 'Quick Replies' },
        { id: 'opt-mgmt', label: 'Opt Management & Media' }
      ],
      'campaigns': [
        { id: 'broadcast', label: 'Broadcast Campaigns' },
        { id: 'templates', label: 'Message Templates' }
      ],
      'crm': [
        { id: 'all-leads', label: 'All Leads' },
        { id: 'pipeline', label: 'Deals Pipeline' },
        { id: 'tags', label: 'Tags & Segments' }
      ],
      'automation': [
        { id: 'chatbot', label: 'Chatbot Builder' },
        { id: 'auto-assign', label: 'Auto Assign Rules' },
        { id: 'ai-agents', label: 'AI Agent & Training' }
      ],
      'team': [
        { id: 'roles', label: 'Roles & Permissions' },
        { id: 'team-members', label: 'Team Members' }
      ],
      'dev': [
        { id: 'webhooks', label: 'Webhooks & API Keys' },
        { id: 'integrations', label: 'Integrations & Apps' }
      ],
      'billing': [
        { id: 'wallet', label: 'Conversation Wallet' },
        { id: 'invoices', label: 'GST Invoices' }
      ],
      'reseller': [
        { id: 'cname', label: 'Custom Domain CNAME' },
        { id: 'pricing', label: 'Packaging & Margins' },
        { id: 'waba', label: 'Client WABA Onboarding' },
        { id: 'sales', label: 'Objection Handling' },
        { id: 'compliance', label: 'Number Warmup & Bans' },
        { id: 'subtenants', label: 'Client Tenancy & Seats' }
      ]
    };

    window.onKbMenuChange = function(menuId) {
      const subSelect = document.getElementById('kb-crm-submenu');
      if (!subSelect) return;
      const subs = KB_CRM_SUBMENUS_CONFIG[menuId] || [
        { id: 'default', label: 'General Screen' }
      ];
      subSelect.innerHTML = subs.map(s => `<option value="${s.id}">${s.label}</option>`).join('');
    };

    // Modal Operations
    window.openAddKbArticleModal = function() {
      const modal = document.getElementById('modal-add-kb-article');
      const form = document.getElementById('form-add-kb-article');
      if (!modal) return;
      if (form) form.reset();

      const elId = document.getElementById('kb-article-id');
      const modalTitle = document.getElementById('modal-kb-title');
      const submitBtn = document.getElementById('kb-submit-btn');
      const customWrap = document.getElementById('kb-custom-category-wrap');

      if (elId) elId.value = '';
      if (modalTitle) modalTitle.textContent = 'Add New Knowledge Base Article';
      if (submitBtn) submitBtn.innerHTML = '💾 Save & Publish Article ➔';
      if (customWrap) customWrap.style.display = 'none';

      // Default menu & submenu
      const menuSelect = document.getElementById('kb-crm-menu');
      if (menuSelect) {
        menuSelect.value = 'comm';
        window.onKbMenuChange('comm');
      }

      const durInp = document.getElementById('kb-duration');
      if (durInp) durInp.value = '0:45';

      modal.style.display = 'flex';
    };

    window.closeAddKbArticleModal = function() {
      const modal = document.getElementById('modal-add-kb-article');
      if (modal) modal.style.display = 'none';
    };

    window.openEditKbArticleModal = function(id, audience) {
      const customArticles = loadCustomKbArticles();
      let item = customArticles.find(a => a.id === id);
      if (!item) {
        if (audience === 'reseller') {
          item = resellerPlaybooksData.find(p => p.id === id);
        } else {
          item = helpdeskFaqsData.find(f => f.id === id);
        }
      }
      if (!item) return;

      const modal = document.getElementById('modal-add-kb-article');
      if (!modal) return;

      const elId = document.getElementById('kb-article-id');
      const elTitle = document.getElementById('kb-title');
      const elType = document.getElementById('kb-type');
      const elCat = document.getElementById('kb-category');
      const elCustomName = document.getElementById('kb-custom-category-name');
      const elCustomWrap = document.getElementById('kb-custom-category-wrap');
      const elSummary = document.getElementById('kb-summary');
      const elSteps = document.getElementById('kb-steps');
      const elTip = document.getElementById('kb-tip');
      const elDur = document.getElementById('kb-duration');
      const elAction = document.getElementById('kb-action-target');
      const modalTitle = document.getElementById('modal-kb-title');
      const submitBtn = document.getElementById('kb-submit-btn');
      const elMenu = document.getElementById('kb-crm-menu');
      const elSubmenu = document.getElementById('kb-crm-submenu');

      if (elId) elId.value = item.id;
      if (elTitle) elTitle.value = item.title || '';
      if (elType) elType.value = item.type || 'troubleshoot';
      if (elSummary) elSummary.value = item.summary || (item.steps ? item.steps[0].replace(/<[^>]*>?/gm, '') : '');
      if (elSteps) elSteps.value = item.steps ? item.steps.map(s => s.replace(/<[^>]*>?/gm, '')).join('\n') : '';
      if (elTip) elTip.value = item.tip || item.proTip || '';
      if (elDur) elDur.value = item.duration || '0:45';
      if (elAction) elAction.value = item.actionTarget || 'none';

      // Set Mapped Menu & Submenu
      if (elMenu) {
        elMenu.value = item.menuId || (item.audience === 'reseller' ? 'reseller' : 'comm');
        window.onKbMenuChange(elMenu.value);
        if (elSubmenu && item.submenuId) {
          elSubmenu.value = item.submenuId;
        }
      }

      // Set Audience Radio
      const aud = item.audience || audience || 'client';
      const radAud = document.querySelector(`input[name="kb-audience"][value="${aud}"]`);
      if (radAud) radAud.checked = true;

      // Set Category
      if (elCat) {
        const hasOption = Array.from(elCat.options).some(o => o.value === item.cat);
        if (hasOption) {
          elCat.value = item.cat;
          if (elCustomWrap) elCustomWrap.style.display = 'none';
        } else {
          elCat.value = 'custom';
          if (elCustomWrap) {
            elCustomWrap.style.display = 'block';
            if (elCustomName) elCustomName.value = item.catLabel || item.cat;
          }
        }
      }

      if (modalTitle) modalTitle.textContent = `Edit Article: ${item.title.substring(0, 32)}...`;
      if (submitBtn) submitBtn.innerHTML = '💾 Update & Save Changes ➔';

      modal.style.display = 'flex';
    };

    window.onKbAudienceChange = function(aud) {
      const lblClient = document.getElementById('lbl-aud-client');
      const lblReseller = document.getElementById('lbl-aud-reseller');
      if (lblClient && lblReseller) {
        if (aud === 'client') {
          lblClient.style.borderColor = '#2563eb';
          lblClient.style.background = '#eff6ff';
          lblReseller.style.borderColor = '#cbd5e1';
          lblReseller.style.background = '#f8fafc';
        } else {
          lblReseller.style.borderColor = '#7c3aed';
          lblReseller.style.background = '#faf5ff';
          lblClient.style.borderColor = '#cbd5e1';
          lblClient.style.background = '#f8fafc';
        }
      }
    };

    window.onKbCategoryChange = function(cat) {
      const wrap = document.getElementById('kb-custom-category-wrap');
      if (wrap) {
        wrap.style.display = cat === 'custom' ? 'block' : 'none';
      }
    };

    window.handleKbArticleSubmit = function(e) {
      e.preventDefault();
      const elId = document.getElementById('kb-article-id');
      const id = elId ? elId.value.trim() : '';

      const radAud = document.querySelector('input[name="kb-audience"]:checked');
      const audience = radAud ? radAud.value : 'client';

      const type = document.getElementById('kb-type') ? document.getElementById('kb-type').value : 'troubleshoot';
      const catVal = document.getElementById('kb-category') ? document.getElementById('kb-category').value : 'whatsapp';
      const customCatName = document.getElementById('kb-custom-category-name') ? document.getElementById('kb-custom-category-name').value.trim() : '';

      const elMenu = document.getElementById('kb-crm-menu');
      const elSubmenu = document.getElementById('kb-crm-submenu');
      const menuId = elMenu ? elMenu.value : (audience === 'reseller' ? 'reseller' : 'comm');
      const menuTitle = elMenu && elMenu.options[elMenu.selectedIndex] ? elMenu.options[elMenu.selectedIndex].text.replace(/^[^\w\s]+\s*/, '') : 'Communication';
      const submenuId = elSubmenu ? elSubmenu.value : 'inbox';
      const submenuTitle = elSubmenu && elSubmenu.options[elSubmenu.selectedIndex] ? elSubmenu.options[elSubmenu.selectedIndex].text : 'Live Inbox';

      const title = document.getElementById('kb-title') ? document.getElementById('kb-title').value.trim() : '';
      const summary = document.getElementById('kb-summary') ? document.getElementById('kb-summary').value.trim() : '';
      const stepsRaw = document.getElementById('kb-steps') ? document.getElementById('kb-steps').value : '';
      const tip = document.getElementById('kb-tip') ? document.getElementById('kb-tip').value.trim() : '';
      const duration = document.getElementById('kb-duration') ? document.getElementById('kb-duration').value.trim() : '0:45';
      const actionTarget = document.getElementById('kb-action-target') ? document.getElementById('kb-action-target').value : 'none';

      const radStatus = document.querySelector('input[name="kb-status"]:checked');
      const status = radStatus ? radStatus.value : 'published';

      if (!title || !summary || !stepsRaw.trim()) {
        alert('Please fill out Title, Summary, and Step-by-Step Resolution steps.');
        return;
      }

      const steps = stepsRaw
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Determine Category Label & Badge Class
      let cat = catVal;
      let catLabel = 'General';
      let badgeClass = 'whatsapp';

      if (catVal === 'custom') {
        cat = 'custom-' + (customCatName ? customCatName.toLowerCase().replace(/\s+/g, '-') : 'cat');
        catLabel = customCatName || 'Custom Guide';
        badgeClass = 'badge-purple';
      } else {
        const catMap = {
          'whatsapp': { label: 'WhatsApp & QR', badge: 'whatsapp' },
          'broadcast': { label: 'Broadcast & Campaigns', badge: 'broadcast' },
          'catalog': { label: 'Catalog & Commerce', badge: 'team' },
          'meta': { label: 'Meta Templates', badge: 'broadcast' },
          'automation': { label: 'Automation & Webhooks', badge: 'chatbot' },
          'billing': { label: 'Billing & Limits', badge: 'billing' },
          'whitelabel': { label: '🏢 White-Label & Domain', badge: 'badge-purple' },
          'pricing': { label: '💰 Pricing & Margins', badge: 'badge-green' },
          'sales': { label: '🎯 Sales & Closing', badge: 'badge-orange' },
          'compliance': { label: '🛡️ Ban Prevention', badge: 'badge-red' },
          'subaccounts': { label: '👥 Sub-Accounts', badge: 'badge-cyan' }
        };
        if (catMap[catVal]) {
          catLabel = catMap[catVal].label;
          badgeClass = catMap[catVal].badge;
        }
      }

      let customArticles = loadCustomKbArticles();

      if (id) {
        // Editing existing
        const idx = customArticles.findIndex(a => a.id === id);
        const updatedArticle = {
          id: id,
          audience: audience,
          menuId: menuId,
          menuTitle: menuTitle,
          submenuId: submenuId,
          submenuTitle: submenuTitle,
          cat: cat,
          catLabel: catLabel,
          type: type,
          title: title,
          summary: summary,
          duration: duration || '0:45',
          videoTitle: `Walkthrough: ${title}`,
          badgeClass: badgeClass,
          steps: steps,
          tip: tip,
          proTip: tip,
          actionLabel: actionTarget !== 'none' ? 'Open Module ➔' : '',
          actionTarget: actionTarget,
          status: status,
          isCustom: true,
          updatedAt: new Date().toISOString()
        };

        if (idx !== -1) {
          customArticles[idx] = updatedArticle;
        } else {
          customArticles.unshift(updatedArticle);
        }
        showToast(`✓ Article "${title}" updated successfully!`);
      } else {
        // Create new
        const newId = (audience === 'reseller' ? 'rpb-cust-' : 'faq-cust-') + Date.now();
        const newArticle = {
          id: newId,
          audience: audience,
          menuId: menuId,
          menuTitle: menuTitle,
          submenuId: submenuId,
          submenuTitle: submenuTitle,
          cat: cat,
          catLabel: catLabel,
          type: type,
          title: title,
          summary: summary,
          duration: duration || '0:45',
          videoTitle: `Walkthrough: ${title}`,
          badgeClass: badgeClass,
          steps: steps,
          tip: tip,
          proTip: tip,
          actionLabel: actionTarget !== 'none' ? 'Open Module ➔' : '',
          actionTarget: actionTarget,
          status: status,
          isCustom: true,
          createdAt: new Date().toISOString()
        };
        customArticles.unshift(newArticle);
        showToast(`🎉 Article "${title}" published to Knowledge Base!`);
      }

      saveCustomKbArticles(customArticles);
      mergeCustomArticles();
      updateHelpDeskCounts();
      if (window.renderKbNavTree) window.renderKbNavTree();
      if (window.renderKbActiveContent) window.renderKbActiveContent();
      renderHelpDeskFaqs();
      renderResellerPlaybooks();
      renderResellerKbManageTable();
      window.closeAddKbArticleModal();
    };

    window.deleteCustomKbArticle = function(id) {
      if (!confirm('Are you sure you want to delete this custom article? This action cannot be undone.')) return;
      let customArticles = loadCustomKbArticles();
      customArticles = customArticles.filter(a => a.id !== id);
      saveCustomKbArticles(customArticles);
      mergeCustomArticles();
      updateHelpDeskCounts();
      renderHelpDeskFaqs();
      renderResellerPlaybooks();
      renderResellerKbManageTable();
      showToast('🗑️ Article deleted successfully from Knowledge Base.');
    };

    window.previewKbArticle = function(id, audience) {
      if (audience === 'client') {
        window.switchKbPortal('client');
        setTimeout(() => {
          window.openFaqGuide(id);
        }, 100);
      } else {
        window.switchKbPortal('reseller');
        resellerKbState.openPlaybookId = id;
        renderResellerPlaybooks();
        setTimeout(() => {
          const el = document.querySelector(`[data-pb-id="${id}"]`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    };

    window.exportKbArticlesJson = function() {
      const allData = {
        exportedAt: new Date().toISOString(),
        clientFaqs: helpdeskFaqsData,
        resellerPlaybooks: resellerPlaybooksData,
        customArticles: loadCustomKbArticles()
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', 'simplefloww_knowledge_base_backup.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('📥 Knowledge Base articles exported successfully as JSON!');
    };

    initResellerKnowledgeBase();

    // =========================================================================
    // MENU-DRIVEN 2-PANE DOCUMENTATION ENGINE (Linear / Stripe Docs Style)
    // =========================================================================
    const KB_CRM_MENUS_STRUCTURE = [
      {
        id: 'comm',
        title: 'Communication',
        icon: '💬',
        submenus: [
          { id: 'wa-accounts', title: 'WhatsApp Accounts', hash: 'inbox' },
          { id: 'inbox', title: 'Live Inbox', hash: 'inbox' },
          { id: 'quick-replies', title: 'Quick Replies', hash: 'inbox' },
          { id: 'opt-mgmt', title: 'Opt Management & Media', hash: 'inbox' }
        ]
      },
      {
        id: 'campaigns',
        title: 'Campaigns & Marketing',
        icon: '📢',
        submenus: [
          { id: 'broadcast', title: 'Broadcast Campaigns', hash: 'campaigns' },
          { id: 'templates', title: 'Message Templates', hash: 'campaigns' }
        ]
      },
      {
        id: 'crm',
        title: 'CRM & Leads',
        icon: '🎯',
        submenus: [
          { id: 'all-leads', title: 'All Leads', hash: 'all-leads' },
          { id: 'pipeline', title: 'Deals Pipeline', hash: 'pipeline' },
          { id: 'tags', title: 'Tags & Segments', hash: 'tags' }
        ]
      },
      {
        id: 'automation',
        title: 'Automation & AI',
        icon: '⚡',
        submenus: [
          { id: 'chatbot', title: 'Chatbot Builder', hash: 'chatbot' },
          { id: 'auto-assign', title: 'Auto Assign Rules', hash: 'auto-assign' },
          { id: 'ai-agents', title: 'AI Agent & Training', hash: 'ai-agents' }
        ]
      },
      {
        id: 'team',
        title: 'Team Management',
        icon: '👥',
        submenus: [
          { id: 'roles', title: 'Roles & Permissions', hash: 'roles' },
          { id: 'team-members', title: 'Team Members', hash: 'team' }
        ]
      },
      {
        id: 'dev',
        title: 'Developer & Integrations',
        icon: '🔌',
        submenus: [
          { id: 'webhooks', title: 'Webhooks & API Keys', hash: 'webhooks' },
          { id: 'integrations', title: 'Integrations & Apps', hash: 'integrations' }
        ]
      },
      {
        id: 'billing',
        title: 'Billing & Credits',
        icon: '💳',
        submenus: [
          { id: 'wallet', title: 'Conversation Wallet', hash: 'billing' },
          { id: 'invoices', title: 'GST Invoices', hash: 'billing' }
        ]
      },
      {
        id: 'reseller',
        title: 'Reseller Agency',
        icon: '💼',
        submenus: [
          { id: 'cname', title: 'Custom Domain CNAME', hash: 'general-settings' },
          { id: 'pricing', title: 'Packaging & Margins', hash: 'referral' },
          { id: 'waba', title: 'Client WABA Onboarding', hash: 'inbox' },
          { id: 'sales', title: 'Objection Handling', hash: 'referral' },
          { id: 'compliance', title: 'Number Warmup & Bans', hash: 'campaigns' },
          { id: 'subtenants', title: 'Client Tenancy & Seats', hash: 'team' }
        ]
      }
    ];

    const kbDocsState = {
      portal: 'client', // 'client' | 'reseller'
      activeMenuId: 'comm',
      activeSubmenuId: 'wa-accounts',
      search: '',
      openGuideId: null,
      typeFilter: 'all' // 'all' | 'troubleshoot' | 'guide' | 'playbook'
    };

    function getAllDocsArticles() {
      const all = [
        ...helpdeskFaqsData.map(f => ({ ...f, audience: f.audience || 'client' })),
        ...resellerPlaybooksData.map(p => ({ ...p, audience: p.audience || 'reseller' }))
      ];
      return all;
    }

    function renderKbNavTree() {
      const container = document.getElementById('kb-tree-nav-container');
      if (!container) return;

      const allArticles = getAllDocsArticles();
      const currentAudience = kbDocsState.portal;

      // Filter articles relevant to the current portal
      const audienceArticles = allArticles.filter(a => a.audience === currentAudience);

      const totalCountEl = document.getElementById('kb-total-guides-count');
      if (totalCountEl) {
        totalCountEl.textContent = audienceArticles.length;
      }

      // Render menu groups
      container.innerHTML = KB_CRM_MENUS_STRUCTURE.map(menu => {
        // If in client portal, we can still show reseller as a section or keep all menus
        const isOpen = menu.id === kbDocsState.activeMenuId || menu.submenus.some(s => s.id === kbDocsState.activeSubmenuId);
        
        // Count guides in this menu
        const menuArticles = audienceArticles.filter(a => a.menuId === menu.id);
        const totalMenuCount = menuArticles.length;

        return `
          <div class="kb-menu-group ${isOpen ? 'open' : ''}" data-kb-menu-id="${menu.id}">
            <div class="kb-menu-parent" data-toggle-menu="${menu.id}">
              <div class="kb-menu-parent-left">
                <span>${menu.icon}</span>
                <span>${menu.title}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                ${totalMenuCount > 0 ? `<span class="kb-sub-badge">${totalMenuCount}</span>` : ''}
                <svg class="kb-menu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
            <div class="kb-submenu-list">
              ${menu.submenus.map(sub => {
                const isActive = sub.id === kbDocsState.activeSubmenuId && menu.id === kbDocsState.activeMenuId;
                const subArticles = audienceArticles.filter(a => a.menuId === menu.id && a.submenuId === sub.id);
                const subCount = subArticles.length;

                return `
                  <a href="javascript:void(0)" class="kb-sub-item ${isActive ? 'active' : ''}" data-sub-menu="${menu.id}" data-sub-id="${sub.id}">
                    <span>${sub.title}</span>
                    <span class="kb-sub-badge">${subCount}</span>
                  </a>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');

      // Attach clicks
      container.querySelectorAll('[data-toggle-menu]').forEach(parentEl => {
        parentEl.addEventListener('click', () => {
          const mId = parentEl.getAttribute('data-toggle-menu');
          const group = container.querySelector(`.kb-menu-group[data-kb-menu-id="${mId}"]`);
          if (group) {
            group.classList.toggle('open');
          }
        });
      });

      container.querySelectorAll('[data-sub-id]').forEach(subEl => {
        subEl.addEventListener('click', () => {
          const mId = subEl.getAttribute('data-sub-menu');
          const sId = subEl.getAttribute('data-sub-id');
          kbDocsState.activeMenuId = mId;
          kbDocsState.activeSubmenuId = sId;
          kbDocsState.search = '';
          const searchInp = document.getElementById('kb-universal-search');
          if (searchInp) searchInp.value = '';
          const clearBtn = document.getElementById('kb-universal-search-clear');
          if (clearBtn) clearBtn.style.display = 'none';

          renderKbNavTree();
          renderKbActiveContent();
        });
      });
    }

    function renderKbActiveContent() {
      const container = document.getElementById('kb-active-content-container');
      if (!container) return;

      const allArticles = getAllDocsArticles();
      const currentAudience = kbDocsState.portal;
      const audienceArticles = allArticles.filter(a => a.audience === currentAudience);

      // Search Mode vs Menu-Selected Mode
      if (kbDocsState.search.trim()) {
        const q = kbDocsState.search.toLowerCase().trim();
        const searchMatches = allArticles.filter(item => {
          return (item.title && item.title.toLowerCase().includes(q)) ||
                 (item.summary && item.summary.toLowerCase().includes(q)) ||
                 (item.catLabel && item.catLabel.toLowerCase().includes(q)) ||
                 (item.menuTitle && item.menuTitle.toLowerCase().includes(q)) ||
                 (item.submenuTitle && item.submenuTitle.toLowerCase().includes(q)) ||
                 (item.keywords && item.keywords.toLowerCase().includes(q)) ||
                 (item.steps && item.steps.some(st => st.toLowerCase().includes(q)));
        });

        if (searchMatches.length === 0) {
          container.innerHTML = `
            <div style="text-align: center; padding: 50px 20px;">
              <div style="font-size: 36px; margin-bottom: 12px;">🔍</div>
              <h3 style="font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">No guides or fixes found for "${kbDocsState.search}"</h3>
              <p style="font-size: 13px; color: #64748b; margin-bottom: 18px;">Try searching broader keywords like "QR", "Broadcast", "Template", or "Webhook".</p>
              <button type="button" class="btn-secondary" id="btn-clear-universal-search" style="font-size: 12.5px;">
                Clear Search & View Menu
              </button>
            </div>
          `;
          const btnClear = document.getElementById('btn-clear-universal-search');
          if (btnClear) {
            btnClear.addEventListener('click', () => {
              kbDocsState.search = '';
              const searchInp = document.getElementById('kb-universal-search');
              if (searchInp) searchInp.value = '';
              const clearBtn = document.getElementById('kb-universal-search-clear');
              if (clearBtn) clearBtn.style.display = 'none';
              renderKbActiveContent();
            });
          }
          return;
        }

        container.innerHTML = `
          <div class="kb-content-head">
            <div>
              <div class="kb-breadcrumb">
                <span>🔍 Search Results</span>
                <span>•</span>
                <span>${searchMatches.length} matching guides across all menus</span>
              </div>
              <h2 class="kb-content-title">Search for "${kbDocsState.search}"</h2>
              <p class="kb-content-desc">Click any guide below to open its step-by-step resolution or jump directly to its CRM screen.</p>
            </div>
          </div>

          <div class="kb-guides-list" id="kb-guides-list">
            ${searchMatches.map(guide => renderSingleKbGuideCard(guide)).join('')}
          </div>
        `;

        attachKbGuideCardEvents(container);
        return;
      }

      // Normal Menu Mode: Find Active Menu & Submenu metadata
      const currentMenu = KB_CRM_MENUS_STRUCTURE.find(m => m.id === kbDocsState.activeMenuId) || KB_CRM_MENUS_STRUCTURE[0];
      const currentSubmenu = currentMenu.submenus.find(s => s.id === kbDocsState.activeSubmenuId) || currentMenu.submenus[0];

      // Guides for this specific submenu
      let subGuides = audienceArticles.filter(a => a.menuId === currentMenu.id && a.submenuId === currentSubmenu.id);

      // If no subGuides mapped directly, fallback to menu guides
      if (subGuides.length === 0) {
        subGuides = audienceArticles.filter(a => a.menuId === currentMenu.id);
      }

      // Filter by type if set
      if (kbDocsState.typeFilter !== 'all') {
        subGuides = subGuides.filter(g => g.type === kbDocsState.typeFilter);
      }

      container.innerHTML = `
        <div class="kb-content-head">
          <div>
            <div class="kb-breadcrumb">
              <span>${currentMenu.icon} ${currentMenu.title}</span>
              <span>›</span>
              <span>${currentSubmenu.title}</span>
            </div>
            <h2 class="kb-content-title">
              <span>${currentSubmenu.title}</span>
              <span style="font-size: 13px; font-weight: 600; color: #64748b; background: #f1f5f9; padding: 2px 8px; border-radius: 999px;">
                ${subGuides.length} Guides & Fixes
              </span>
            </h2>
            <p class="kb-content-desc">
              Step-by-step resolution guides, screen walkthroughs, and error diagnostics for the <strong>${currentSubmenu.title}</strong> module.
            </p>
          </div>

          <div>
            <button type="button" class="kb-jump-btn" onclick="window.location.hash='#${currentSubmenu.hash || 'dashboard'}'" title="Jump to this CRM screen">
              <span>Open ${currentSubmenu.title} Screen ➔</span>
            </button>
          </div>
        </div>

        <!-- Filter Pills Bar (All / Quick Fixes / Guides) -->
        <div class="kb-content-filter-bar">
          <div class="kb-content-pills" id="kb-screen-filter-pills">
            <button type="button" class="kb-content-pill ${kbDocsState.typeFilter === 'all' ? 'active' : ''}" data-type="all">All Content (${subGuides.length})</button>
            <button type="button" class="kb-content-pill ${kbDocsState.typeFilter === 'troubleshoot' ? 'active' : ''}" data-type="troubleshoot">⚡ Quick Fixes</button>
            <button type="button" class="kb-content-pill ${kbDocsState.typeFilter === 'guide' ? 'active' : ''}" data-type="guide">📖 Step Guides</button>
            ${kbDocsState.portal === 'reseller' ? `<button type="button" class="kb-content-pill ${kbDocsState.typeFilter === 'playbook' ? 'active' : ''}" data-type="playbook">💼 SOPs</button>` : ''}
          </div>

          <div style="font-size: 12px; color: #64748b;">
            Mapped to: <code>#${currentSubmenu.hash}</code>
          </div>
        </div>

        <div class="kb-guides-list" id="kb-guides-list">
          ${subGuides.length === 0 ? `
            <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 36px 20px; text-align: center;">
              <div style="font-size: 28px; margin-bottom: 8px;">📝</div>
              <h4 style="font-size: 14.5px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">No guides published yet for this screen</h4>
              <p style="font-size: 12.5px; color: #64748b; margin-bottom: 14px;">Super admin can add resolution walkthroughs for ${currentSubmenu.title} in 1 click.</p>
              <button type="button" class="btn-primary" onclick="window.openAddKbArticleModal && window.openAddKbArticleModal()" style="font-size: 12px;">
                + Add Guide for ${currentSubmenu.title}
              </button>
            </div>
          ` : subGuides.map(guide => renderSingleKbGuideCard(guide)).join('')}
        </div>
      `;

      // Filter pills events
      container.querySelectorAll('#kb-screen-filter-pills .kb-content-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          kbDocsState.typeFilter = pill.getAttribute('data-type') || 'all';
          renderKbActiveContent();
        });
      });

      attachKbGuideCardEvents(container);
    }

    function renderSingleKbGuideCard(guide) {
      const isOpen = guide.id === kbDocsState.openGuideId;
      const typeBadgeText = guide.type === 'troubleshoot' ? '⚡ Quick Fix' : (guide.type === 'playbook' ? '💼 Playbook' : '📖 Step Guide');
      const typeBadgeClass = guide.type === 'troubleshoot' ? 'troubleshoot' : (guide.type === 'playbook' ? 'playbook' : 'guide');

      const quickSummary = guide.summary || (guide.steps && guide.steps[0] ? guide.steps[0].replace(/<[^>]*>?/gm, '') : 'Follow resolution steps below.');
      const customBadge = guide.isCustom ? `<span class="faq-custom-badge">✨ Partner Authored</span>` : '';

      return `
        <div class="kb-guide-card ${isOpen ? 'is-open' : ''}" data-guide-id="${guide.id}">
          <div class="kb-guide-header" data-toggle-guide="${guide.id}">
            <div class="kb-guide-header-left">
              <span class="faq-type-badge ${typeBadgeClass}">${typeBadgeText}</span>
              ${guide.catLabel ? `<span class="faq-category-badge ${guide.badgeClass || 'whatsapp'}">${guide.catLabel}</span>` : ''}
              <h3 class="faq-title" style="margin: 0;">${guide.title} ${customBadge}</h3>
            </div>
            <div class="kb-guide-header-right">
              <span class="faq-read-time">⏱️ ${guide.duration || '0:45'}</span>
              <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="${isOpen ? 'transform:rotate(180deg);' : ''}"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          <div class="kb-guide-body" style="${isOpen ? 'display:block;' : 'display:none;'}">
            <!-- 3-Second Quick Answer Card -->
            <div class="faq-quick-answer-card" style="margin-top: 14px;">
              <span class="faq-quick-answer-badge">⚡ Quick Fix</span>
              <span class="faq-quick-answer-text">${quickSummary}</span>
            </div>

            <!-- Resolution Steps -->
            <div class="faq-steps-card">
              <div class="faq-steps-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                Step-by-Step Resolution Guide
              </div>
              ${guide.steps.map((st, i) => `
                <div class="faq-step-item">
                  <div class="faq-step-num">${i + 1}</div>
                  <div style="font-size:12.5px; line-height:1.5;">${st}</div>
                </div>
              `).join('')}
            </div>

            ${(guide.tip || guide.proTip) ? `
              <div class="faq-pro-tip-box" style="margin-top: 12px;">
                💡 <strong>Pro Tip:</strong> ${guide.tip || guide.proTip}
              </div>
            ` : ''}

            <!-- Bottom Action & Feedback Bar -->
            <div class="faq-footer-bar" style="margin-top: 14px;">
              <div class="faq-feedback-group">
                <span>Did this resolve your issue?</span>
                <button type="button" class="faq-feedback-btn" onclick="showToast('👍 Thank you! Glad this fix resolved it.')">👍 Yes, Solved</button>
                <button type="button" class="faq-feedback-btn" onclick="window.openSupportWhatsApp && window.openSupportWhatsApp()">💬 Contact Line</button>
              </div>

              <div style="display: flex; gap: 8px;">
                ${guide.actionTarget && guide.actionTarget !== 'none' ? `
                  <button type="button" class="btn-primary" onclick="window.location.hash='#${guide.actionTarget}'" style="font-size: 12px; padding: 6px 14px;">
                    ${guide.actionLabel || 'Open Screen ➔'}
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function attachKbGuideCardEvents(container) {
      container.querySelectorAll('[data-toggle-guide]').forEach(header => {
        header.addEventListener('click', () => {
          const id = header.getAttribute('data-toggle-guide');
          kbDocsState.openGuideId = kbDocsState.openGuideId === id ? null : id;
          renderKbActiveContent();
        });
      });
    }

    window.switchKbPortal = function(portal) {
      const btnKbClient = document.getElementById('btn-kb-client');
      const btnKbReseller = document.getElementById('btn-kb-reseller');

      kbDocsState.portal = portal;

      if (portal === 'reseller') {
        if (btnKbReseller) btnKbReseller.classList.add('active');
        if (btnKbClient) btnKbClient.classList.remove('active');
        kbDocsState.activeMenuId = 'reseller';
        kbDocsState.activeSubmenuId = 'cname';
      } else {
        if (btnKbClient) btnKbClient.classList.add('active');
        if (btnKbReseller) btnKbReseller.classList.remove('active');
        kbDocsState.activeMenuId = 'comm';
        kbDocsState.activeSubmenuId = 'wa-accounts';
      }

      renderKbNavTree();
      renderKbActiveContent();
    };

    window.renderKbNavTree = renderKbNavTree;
    window.renderKbActiveContent = renderKbActiveContent;



  let helpdeskState = {
    cat: 'all',
    type: 'all',
    search: '',
    openFaqId: 'faq-wa-1'
  };

  const activeVideoTimers = {};

  function renderHelpDeskFaqs() {
    const container = document.getElementById('faq-accordion-list');
    if (!container) return;

    const filtered = helpdeskFaqsData.filter(faq => {
      const matchCat = helpdeskState.cat === 'all' || faq.cat === helpdeskState.cat;
      if (!matchCat) return false;
      const matchType = helpdeskState.type === 'all' || faq.type === helpdeskState.type;
      if (!matchType) return false;
      if (!helpdeskState.search) return true;
      const q = helpdeskState.search.toLowerCase();
      return faq.title.toLowerCase().includes(q) ||
             faq.keywords.toLowerCase().includes(q) ||
             faq.catLabel.toLowerCase().includes(q) ||
             faq.steps.some(s => s.toLowerCase().includes(q));
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="background:#fff; border:1px solid var(--sf-border); border-radius:12px; padding:40px 20px; text-align:center;">
          <div style="font-size:32px; margin-bottom:8px;">🔍</div>
          <h4 style="font-size:15px; font-weight:700; color:var(--sf-text-main); margin-bottom:4px;">No matching guide found for "${helpdeskState.search}"</h4>
          <p style="font-size:12.5px; color:var(--sf-text-muted); margin-bottom:14px;">Try searching broader keywords like "QR", "Broadcast", or "Template".</p>
          <button type="button" class="btn-secondary" id="btn-reset-hd-search" style="font-size:12px;">Clear Search</button>
        </div>
      `;
      const btnClear = document.getElementById('btn-reset-hd-search');
      if (btnClear) {
        btnClear.addEventListener('click', () => {
          helpdeskState.search = '';
          const inp = document.getElementById('helpdesk-search-input');
          if (inp) inp.value = '';
          renderHelpDeskFaqs();
        });
      }
      return;
    }

    container.innerHTML = filtered.map(faq => {
      const isOpen = faq.id === helpdeskState.openFaqId;
      const typeBadgeText = faq.type === 'troubleshoot' ? '⚡ Fix' : '📖 Guide';
      const typeBadgeClass = faq.type === 'troubleshoot' ? 'troubleshoot' : 'guide';

      const customBadge = faq.isCustom ? `<span class="faq-custom-badge">✨ Partner Authored</span>` : '';
      const quickSummary = faq.summary || (faq.steps && faq.steps[0] ? faq.steps[0].replace(/<[^>]*>?/gm, '') : 'Follow resolution steps below.');

      return `
        <div class="faq-item ${isOpen ? 'is-open' : ''}" data-faq-id="${faq.id}">
          <div class="faq-header" data-toggle-id="${faq.id}">
            <div class="faq-header-left">
              <span class="faq-category-badge ${faq.badgeClass}">${faq.catLabel}</span>
              <span class="faq-type-badge ${typeBadgeClass}">${typeBadgeText}</span>
              <h3 class="faq-title">${faq.title} ${customBadge}</h3>
            </div>
            <div class="faq-header-right">
              <span class="faq-read-time">⏱️ ${faq.duration || '0:45'}</span>
              <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>

          <div class="faq-body" style="${isOpen ? 'display:block;' : 'display:none;'}">
            
            <!-- Quick Answer Highlight (Instant 3-sec Resolution) -->
            <div class="faq-quick-answer-card">
              <span class="faq-quick-answer-badge">⚡ Quick Fix</span>
              <span class="faq-quick-answer-text">${quickSummary}</span>
            </div>

            <!-- Step By Step List -->
            <div class="faq-steps-card">
              <div class="faq-steps-card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                Step-by-Step Resolution Guide
              </div>
              ${faq.steps.map((st, i) => `
                <div class="faq-step-item">
                  <div class="faq-step-num">${i + 1}</div>
                  <div style="font-size:12.5px; line-height:1.5;">${st}</div>
                </div>
              `).join('')}
            </div>

            ${(faq.tip || faq.proTip) ? `
              <div class="faq-pro-tip-box">
                💡 <strong>Pro Tip:</strong> ${faq.tip || faq.proTip}
              </div>
            ` : ''}

            <!-- Optional Screen Walkthrough Trigger -->
            <div class="faq-video-trigger-wrap">
              <button type="button" class="faq-video-trigger-btn" data-toggle-video="${faq.id}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Watch 45-sec Screen Walkthrough</span>
                <span class="faq-video-badge-pill">${faq.duration}</span>
              </button>
            </div>

            <!-- Inline Video Walkthrough Player (Reveals only when user clicks watch) -->
            <div class="faq-video-card" id="video-card-${faq.id}" style="display: none;">
              <div class="faq-video-screen">
                <canvas class="faq-video-canvas" id="canvas-${faq.id}" width="640" height="360"></canvas>
                <div class="faq-video-overlay-poster" id="poster-${faq.id}" data-play-id="${faq.id}">
                  <div class="faq-video-play-btn">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                  </div>
                  <div style="font-size: 13.5px; font-weight: 700;">${faq.videoTitle}</div>
                  <div style="font-size: 11px; opacity: 0.8; margin-top: 3px;">Click to play inline screen walkthrough</div>
                </div>
              </div>

              <!-- Controls Bar -->
              <div class="faq-video-controls-bar">
                <button type="button" class="faq-video-ctrl-btn" data-btn-play="${faq.id}" title="Play / Pause">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" id="playicon-${faq.id}"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                </button>
                <div class="faq-video-timeline-wrap" data-seek-id="${faq.id}">
                  <div class="faq-video-timeline-progress" id="progress-${faq.id}"></div>
                </div>
                <span id="timer-${faq.id}">0:00 / ${faq.duration}</span>
                <button type="button" class="faq-video-ctrl-btn" data-btn-restart="${faq.id}" title="Replay">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                </button>
              </div>
            </div>

            <!-- Footer Action Bar -->
            <div class="faq-footer-bar">
              <div class="faq-feedback-group">
                <span>Was this guide helpful?</span>
                <button type="button" class="faq-feedback-btn" data-rating="yes" onclick="showToast('Thank you for your feedback!')" title="Mark helpful">👍 Yes</button>
                <button type="button" class="faq-feedback-btn" data-rating="no" onclick="showToast('Feedback noted. We will improve this guide!')" title="Mark not helpful">👎 No</button>
              </div>

              <div style="display: flex; gap: 8px;">
                <button type="button" class="btn-primary" data-action-target="${faq.actionTarget}" style="font-size: 12px; padding: 6px 14px;">
                  ${faq.actionLabel}
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
    }).join('');

    // Attach Accordion Toggle
    container.querySelectorAll('.faq-header').forEach(header => {
      header.addEventListener('click', () => {
        const id = header.getAttribute('data-toggle-id');
        helpdeskState.openFaqId = helpdeskState.openFaqId === id ? null : id;
        renderHelpDeskFaqs();
      });
    });

    // Attach Video Expand / Collapse toggles
    container.querySelectorAll('[data-toggle-video]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-toggle-video');
        const videoCard = document.getElementById(`video-card-${id}`);
        if (videoCard) {
          const isHidden = videoCard.style.display === 'none';
          videoCard.style.display = isHidden ? 'block' : 'none';
          if (isHidden) {
            btn.innerHTML = `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
              <span>Hide Screen Walkthrough</span>
            `;
            startFaqVideo(id);
          } else {
            const faqObj = helpdeskFaqsData.find(f => f.id === id);
            btn.innerHTML = `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Watch 45-sec Screen Walkthrough</span>
              <span class="faq-video-badge-pill">${faqObj ? faqObj.duration : '0:45'}</span>
            `;
            stopFaqVideo(id);
          }
        }
      });
    });

    // Attach Video Play triggers inside player
    container.querySelectorAll('[data-play-id]').forEach(poster => {
      poster.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = poster.getAttribute('data-play-id');
        playInlineVideoWalkthrough(id);
      });
    });

    container.querySelectorAll('[data-btn-play]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-btn-play');
        playInlineVideoWalkthrough(id);
      });
    });

    container.querySelectorAll('[data-btn-restart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-btn-restart');
        restartInlineVideoWalkthrough(id);
      });
    });

    // Attach Primary Module Action
    container.querySelectorAll('[data-action-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = btn.getAttribute('data-action-target');
        if (target) {
          window.location.hash = `#${target}`;
        }
      });
    });

    // Attach Feedback Rating
    container.querySelectorAll('.faq-feedback-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isYes = btn.getAttribute('data-rating') === 'yes';
        const parent = btn.parentElement;
        parent.querySelectorAll('.faq-feedback-btn').forEach(b => b.classList.remove('rated-yes', 'rated-no'));
        btn.classList.add(isYes ? 'rated-yes' : 'rated-no');
        showToast(isYes ? '✓ Thank you! Glad this guide helped.' : 'Thanks for the feedback. We will improve this walkthrough.');
      });
    });
  }

  // Visual Simulated Video Player on Canvas
  function playInlineVideoWalkthrough(faqId) {
    const poster = document.getElementById(`poster-${faqId}`);
    const canvas = document.getElementById(`canvas-${faqId}`);
    const progress = document.getElementById(`progress-${faqId}`);
    const timer = document.getElementById(`timer-${faqId}`);
    const playIcon = document.getElementById(`playicon-${faqId}`);
    if (!canvas) return;

    if (poster) poster.style.display = 'none';

    if (activeVideoTimers[faqId]) {
      // Toggle Pause
      if (activeVideoTimers[faqId].isPlaying) {
        activeVideoTimers[faqId].isPlaying = false;
        if (playIcon) playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        return;
      } else {
        activeVideoTimers[faqId].isPlaying = true;
        if (playIcon) playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        return;
      }
    }

    if (playIcon) playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';

    const ctx = canvas.getContext('2d');
    const totalDuration = 45; // 45 seconds walkthrough
    let currentTime = 0;

    const faqObj = helpdeskFaqsData.find(f => f.id === faqId) || { videoTitle: 'Interactive Walkthrough', catLabel: 'Guide' };

    activeVideoTimers[faqId] = {
      isPlaying: true,
      interval: setInterval(() => {
        if (!activeVideoTimers[faqId] || !activeVideoTimers[faqId].isPlaying) return;

        currentTime += 1;
        if (currentTime > totalDuration) {
          currentTime = totalDuration;
          clearInterval(activeVideoTimers[faqId].interval);
          activeVideoTimers[faqId] = null;
          if (playIcon) playIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
          showToast(`✓ Completed walkthrough: ${faqObj.videoTitle}`);
          return;
        }

        const pct = (currentTime / totalDuration) * 100;
        if (progress) progress.style.width = `${pct}%`;
        const mins = Math.floor(currentTime / 60);
        const secs = String(currentTime % 60).padStart(2, '0');
        if (timer) timer.textContent = `${mins}:${secs} / 0:${totalDuration}`;

        // Draw animated screen frame
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Header bar
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, 36);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(`▶ SimpleFloww Interactive Walkthrough • ${faqObj.catLabel}`, 18, 23);

        // Sidebar mock
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(16, 50, 140, 290);
        ctx.fillStyle = '#475569';
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(26, 70 + (i * 38), 120, 14);
        }

        // Active highlighted tab
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(26, 70 + (Math.floor(currentTime / 15) * 38), 120, 14);

        // Content Area simulation
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText(faqObj.videoTitle, 175, 80);

        // Step narration card
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(175, 105, 440, 120, 8);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 13px Inter, sans-serif';
        let stepText = 'Step 1: Open Target Module';
        let subText = 'Navigating to section and verifying connected credentials...';
        if (currentTime > 15 && currentTime <= 30) {
          stepText = 'Step 2: Configure Parameters & Filters';
          subText = 'Selecting verified Meta business settings and rate-limiting...';
        } else if (currentTime > 30) {
          stepText = 'Step 3: Verification & Live Activation';
          subText = 'Success! Settings applied and operational status confirmed.';
        }
        ctx.fillText(`✓ ${stepText}`, 195, 140);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(subText, 195, 170);

        // Live Simulated Metric pill
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.roundRect(195, 195, 200, 20, 4);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px monospace';
        ctx.fillText(`TIME: ${mins}:${secs} | SIMULATION: ACTIVE`, 205, 209);
      }, 1000)
    };
  }

  function restartInlineVideoWalkthrough(faqId) {
    if (activeVideoTimers[faqId]) {
      clearInterval(activeVideoTimers[faqId].interval);
      activeVideoTimers[faqId] = null;
    }
    const progress = document.getElementById(`progress-${faqId}`);
    const timer = document.getElementById(`timer-${faqId}`);
    if (progress) progress.style.width = '0%';
    if (timer) timer.textContent = '0:00 / 0:45';
    playInlineVideoWalkthrough(faqId);
  }

  function updateHelpDeskCounts() {
    const total = helpdeskFaqsData.length;
    const troubleshoots = helpdeskFaqsData.filter(f => f.type === 'troubleshoot').length;
    const guides = helpdeskFaqsData.filter(f => f.type === 'guide').length;

    const elTotal = document.getElementById('hd-type-all');
    const elTr = document.getElementById('hd-type-troubleshoot');
    const elGd = document.getElementById('hd-type-guide');
    if (elTotal) elTotal.textContent = total;
    if (elTr) elTr.textContent = troubleshoots;
    if (elGd) elGd.textContent = guides;

    const btnAll = document.querySelector('.helpdesk-subfilter-btn[data-type="all"]');
    const btnTr = document.querySelector('.helpdesk-subfilter-btn[data-type="troubleshoot"]');
    const btnGd = document.querySelector('.helpdesk-subfilter-btn[data-type="guide"]');
    if (btnAll) btnAll.textContent = `All Content (${total})`;
    if (btnTr) btnTr.textContent = `⚡ Troubleshooting & Fixes (${troubleshoots})`;
    if (btnGd) btnGd.textContent = `📖 Feature How-To Guides (${guides})`;
  }

    function initHelpDesk() {
      mergeCustomArticles();
      updateHelpDeskCounts();
      renderHelpDeskFaqs();
      renderResellerKbManageTable();

      // Initialize Menu-Driven 2-Pane Docs
      renderKbNavTree();
      renderKbActiveContent();

      // Universal Top Search Input Listener
      const kbUniSearch = document.getElementById('kb-universal-search');
      const kbUniClear = document.getElementById('kb-universal-search-clear');
      if (kbUniSearch) {
        kbUniSearch.addEventListener('input', () => {
          kbDocsState.search = kbUniSearch.value.trim();
          if (kbUniClear) kbUniClear.style.display = kbDocsState.search ? 'block' : 'none';
          renderKbActiveContent();
        });
      }
      if (kbUniClear && kbUniSearch) {
        kbUniClear.addEventListener('click', () => {
          kbUniSearch.value = '';
          kbDocsState.search = '';
          kbUniClear.style.display = 'none';
          renderKbActiveContent();
        });
      }

      // Reseller KB Directory Search & Filter Listeners
      const rkbSearchInp = document.getElementById('rkb-manage-search');
      if (rkbSearchInp) {
        rkbSearchInp.addEventListener('input', () => {
          rkbManageState.search = rkbSearchInp.value.trim();
          renderResellerKbManageTable();
        });
      }

      const rkbAudPills = document.querySelectorAll('#rkb-audience-filters .rkb-filter-pill');
      rkbAudPills.forEach(btn => {
        btn.addEventListener('click', () => {
          rkbAudPills.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          rkbManageState.audience = btn.getAttribute('data-aud') || 'all';
          renderResellerKbManageTable();
        });
      });

      // Category Tabs Filter (Supports .kb-cat-pill & .helpdesk-tab-btn)
      const catTabs = document.querySelectorAll('#helpdesk-cat-tabs .kb-cat-pill, #helpdesk-cat-tabs .helpdesk-tab-btn');
      catTabs.forEach(btn => {
        btn.addEventListener('click', () => {
          catTabs.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          helpdeskState.cat = btn.getAttribute('data-cat') || 'all';
          renderHelpDeskFaqs();
        });
      });

      // Sub-filters (All / Troubleshooting / Guides)
      const subfilterBtns = document.querySelectorAll('#helpdesk-type-filters .kb-type-btn, .helpdesk-subfilter-btn');
      subfilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          subfilterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          helpdeskState.type = btn.getAttribute('data-type') || 'all';
          renderHelpDeskFaqs();
        });
      });

      // Search Input
      const searchInput = document.getElementById('helpdesk-search-input');
      const searchClear = document.getElementById('helpdesk-search-clear');

      if (searchInput) {
        searchInput.addEventListener('input', () => {
          helpdeskState.search = searchInput.value.trim();
          if (searchClear) searchClear.style.display = helpdeskState.search ? 'block' : 'none';
          renderHelpDeskFaqs();
        });
      }

      if (searchClear && searchInput) {
        searchClear.addEventListener('click', () => {
          searchInput.value = '';
          helpdeskState.search = '';
          searchClear.style.display = 'none';
          renderHelpDeskFaqs();
        });
      }

      // Trending Pills Click
      document.querySelectorAll('.kb-trend-chip, .helpdesk-trend-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const query = pill.getAttribute('data-query');
          if (searchInput && query) {
            searchInput.value = query;
            helpdeskState.search = query;
            if (searchClear) searchClear.style.display = 'block';
            renderHelpDeskFaqs();
          }
        });
      });

      // 1-Click Fast FAQ Opener
      window.openFaqGuide = function(faqId) {
        const faq = helpdeskFaqsData.find(f => f.id === faqId);
        if (!faq) return;
        helpdeskState.cat = 'all';
        helpdeskState.type = 'all';
        helpdeskState.search = '';
        helpdeskState.openFaqId = faqId;

        document.querySelectorAll('#helpdesk-cat-tabs .kb-cat-pill, #helpdesk-cat-tabs .helpdesk-tab-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-cat') === 'all');
        });
        document.querySelectorAll('#helpdesk-type-filters .kb-type-btn, .helpdesk-subfilter-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-type') === 'all');
        });
        if (searchInput) {
          searchInput.value = '';
          if (searchClear) searchClear.style.display = 'none';
        }

        renderHelpDeskFaqs();

        setTimeout(() => {
          const el = document.querySelector(`[data-faq-id="${faqId}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 80);
      };

    // Modal: Feature Request
    const btnOpenFeatureReq = document.getElementById('btn-open-feature-request');
    const modalFeatureReq = document.getElementById('modal-feature-request');
    const modalCloseFeatureReq = document.getElementById('modal-close-feature-request');
    const modalCancelFeatureReq = document.getElementById('modal-cancel-feature-request');
    const formFeatureReq = document.getElementById('form-feature-request');

    function openFeatureRequestModal() {
      if (modalFeatureReq) modalFeatureReq.style.display = 'flex';
    }
    function closeFeatureRequestModal() {
      if (modalFeatureReq) modalFeatureReq.style.display = 'none';
      if (formFeatureReq) formFeatureReq.reset();
    }

    if (btnOpenFeatureReq) btnOpenFeatureReq.addEventListener('click', openFeatureRequestModal);
    if (modalCloseFeatureReq) modalCloseFeatureReq.addEventListener('click', closeFeatureRequestModal);
    if (modalCancelFeatureReq) modalCancelFeatureReq.addEventListener('click', closeFeatureRequestModal);

    if (formFeatureReq) {
      formFeatureReq.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('fr-title')?.value || 'Feature';
        const cat = document.getElementById('fr-category')?.value || 'General';
        showToast(`🚀 Feature request "${title}" (${cat}) received! Added to product roadmap.`);
        closeFeatureRequestModal();
      });
    }

    // Modal: Feedback
    const btnOpenFeedback = document.getElementById('btn-open-feedback');
    const modalFeedback = document.getElementById('modal-feedback');
    const modalCloseFeedback = document.getElementById('modal-close-feedback');
    const modalCancelFeedback = document.getElementById('modal-cancel-feedback');
    const formFeedback = document.getElementById('form-feedback');
    const starContainer = document.getElementById('feedback-star-container');
    const ratingInput = document.getElementById('feedback-rating-val');
    const ratingLabel = document.getElementById('feedback-rating-label');

    const ratingDescriptions = {
      '1': '1 - Disappointed (Needs work)',
      '2': '2 - Below Average',
      '3': '3 - Average / It is okay',
      '4': '4 - Very Good & Useful',
      '5': '5 - Excellent! Loves it'
    };

    function openFeedbackModal() {
      if (modalFeedback) modalFeedback.style.display = 'flex';
    }
    function closeFeedbackModal() {
      if (modalFeedback) modalFeedback.style.display = 'none';
      if (formFeedback) formFeedback.reset();
      updateStarRating(5);
    }

    function updateStarRating(rating) {
      if (ratingInput) ratingInput.value = rating;
      if (ratingLabel) ratingLabel.textContent = ratingDescriptions[rating] || `${rating} Stars`;
      if (starContainer) {
        starContainer.querySelectorAll('.feedback-star').forEach(star => {
          const r = parseInt(star.getAttribute('data-rating') || '0', 10);
          if (r <= rating) {
            star.classList.add('active');
          } else {
            star.classList.remove('active');
          }
        });
      }
    }

    if (starContainer) {
      starContainer.querySelectorAll('.feedback-star').forEach(star => {
        star.addEventListener('click', () => {
          const r = parseInt(star.getAttribute('data-rating') || '5', 10);
          updateStarRating(r);
        });
      });
    }

    if (btnOpenFeedback) btnOpenFeedback.addEventListener('click', openFeedbackModal);
    if (modalCloseFeedback) modalCloseFeedback.addEventListener('click', closeFeedbackModal);
    if (modalCancelFeedback) modalCancelFeedback.addEventListener('click', closeFeedbackModal);

    if (formFeedback) {
      formFeedback.addEventListener('submit', (e) => {
        e.preventDefault();
        const rating = ratingInput ? ratingInput.value : '5';
        showToast(`⭐ Thank you for your ${rating}-star feedback! Sent to product team.`);
        closeFeedbackModal();
      });
    }

    // WhatsApp Support Escalation Buttons
    const btnHeaderSupport = document.getElementById('btn-header-wa-support');
    const btnRepChat = document.getElementById('btn-rep-wa-chat');

    function openSupportWhatsApp() {
      const phone = '919518649420';
      const msg = encodeURIComponent('Hi SimpleFloww Support, I need assistance with our business account setup. Business ID: SF-9420.');
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    }

    if (btnHeaderSupport) btnHeaderSupport.addEventListener('click', openSupportWhatsApp);
    if (btnRepChat) btnRepChat.addEventListener('click', openSupportWhatsApp);

    window.downloadPartnerAsset = function(assetType) {
      if (assetType === 'deck') {
        showToast('📥 Downloading SimpleFloww SME Pitch Deck (Pitch_Deck_v4.pptx)...');
      } else if (assetType === 'agreement') {
        showToast('📥 Downloading Reseller Master Service Agreement (MSA_Draft.docx)...');
      } else if (assetType === 'calculator') {
        showToast('📥 Downloading Partner ROI & Client Margin Calculator (.xlsx)...');
      } else if (assetType === 'templates') {
        showToast('📥 Downloading 50 Meta Pre-Approved WhatsApp Templates (PDF)...');
      } else {
        showToast('📥 Downloading Partner Playbook Checklist (.pdf)...');
      }
    };

    window.renderKnowledgeBaseAll = function() {
      renderHelpDeskFaqs();
      renderResellerPlaybooks();
    };

    // =========================================================================
    // DUAL-PORTAL HELP DESK TICKETING SYSTEM ENGINE
    // =========================================================================
    const helpdeskTicketsData = [
      {
        id: 'TK-1082',
        subject: 'Meta Cloud API Webhook Signature Verification Failing (401 Mismatch)',
        clientName: 'TechNova Solutions',
        clientEmail: 'contact@technova.in',
        clientPhone: '+91 98201 44521',
        clientTier: 'Enterprise Pro Plan',
        category: 'WhatsApp Cloud API',
        categoryIcon: '📱',
        priority: 'Urgent',
        status: 'In Progress',
        assignedTo: 'Rahul Sharma',
        avatar: 'RS',
        createdAt: 'Today, 11:20 AM',
        createdTimestamp: Date.now() - 2 * 3600 * 1000,
        slaTargetMins: 120,
        slaRemainingMins: 38,
        slaStatus: 'warning',
        clientVisible: true,
        messages: [
          {
            id: 'msg-1',
            sender: 'client',
            author: 'Arjun Verma (TechNova)',
            avatar: 'AV',
            time: '11:20 AM',
            text: 'Hi Team, our WhatsApp webhook verification started failing today with HTTP 401 unauthorized. We updated our app secret key on Meta developer dashboard yesterday night. Incoming leads are not getting synced to the CRM!'
          },
          {
            id: 'msg-2',
            sender: 'agent',
            author: 'Rahul Sharma (Senior API Support)',
            avatar: 'RS',
            time: '11:28 AM',
            text: 'Hello Arjun! Thanks for reporting this. Looking into this right away with highest priority. Could you please confirm if you updated the SHA-256 HMAC verification key in Simplefloww Settings > Webhooks as well?'
          },
          {
            id: 'msg-3',
            sender: 'internal',
            author: 'Rahul Sharma',
            avatar: 'RS',
            time: '11:34 AM',
            text: '🔒 [INTERNAL NOTE]: Checked Meta webhook ping logs for TechNova. Payload has valid signature from AppID 819203810, but their CRM endpoint was returning 401 due to secret key mismatch. I generated a refreshed test challenge ping.'
          },
          {
            id: 'msg-4',
            sender: 'client',
            author: 'Arjun Verma (TechNova)',
            avatar: 'AV',
            time: '11:42 AM',
            text: 'Just checked, we had not updated it on the Simplefloww side! Doing it right now.'
          }
        ]
      },
      {
        id: 'TK-1081',
        subject: 'Diwali Festive Broadcast Template Rejected by Meta (Format Error #132000)',
        clientName: 'StyleAura Fashion',
        clientEmail: 'ops@styleaura.com',
        clientPhone: '+91 99342 11982',
        clientTier: 'Growth Plan',
        category: 'Broadcast & Campaigns',
        categoryIcon: '📢',
        priority: 'High',
        status: 'Waiting on Client',
        assignedTo: 'Priya Patel',
        avatar: 'PP',
        createdAt: 'Today, 09:45 AM',
        createdTimestamp: Date.now() - 4 * 3600 * 1000,
        slaTargetMins: 240,
        slaRemainingMins: 110,
        slaStatus: 'ok',
        clientVisible: true,
        messages: [
          {
            id: 'msg-1',
            sender: 'client',
            author: 'Kavita Roy (StyleAura)',
            avatar: 'KR',
            time: '09:45 AM',
            text: 'We submitted our Diwali Mega Sale marketing template with discount coupon code {{1}}, but Meta rejected it within 10 minutes citing parameter format guidelines.'
          },
          {
            id: 'msg-2',
            sender: 'agent',
            author: 'Priya Patel (Campaign Specialist)',
            avatar: 'PP',
            time: '10:02 AM',
            text: 'Hi Kavita! Meta requires sample values for all dynamic curly brackets {{1}} before submission. Also, ensure coupon code does not contain special characters. We have pre-fixed your template draft in your account. Please approve the preview so we can re-trigger fast Meta approval.'
          }
        ]
      },
      {
        id: 'TK-1080',
        subject: 'Request for Custom GST Tax Invoice for September Billing Cycle',
        clientName: 'Apex Real Estate LLP',
        clientEmail: 'accounts@apexrealty.in',
        clientPhone: '+91 98110 55219',
        clientTier: 'Enterprise Pro Plan',
        category: 'Billing & Invoices',
        categoryIcon: '💳',
        priority: 'Normal',
        status: 'Resolved',
        assignedTo: 'Aman Verma',
        avatar: 'AV',
        createdAt: 'Yesterday, 04:15 PM',
        createdTimestamp: Date.now() - 22 * 3600 * 1000,
        slaTargetMins: 480,
        slaRemainingMins: 0,
        slaStatus: 'ok',
        clientVisible: true,
        csat: 5,
        csatComment: 'Super fast turnaround! Received updated GST invoice in under 20 minutes.',
        messages: [
          {
            id: 'msg-1',
            sender: 'client',
            author: 'Suresh Singhania',
            avatar: 'SS',
            time: 'Yesterday 04:15 PM',
            text: 'Please provide updated GST tax invoice with our newly registered Maharashtra GSTIN 27AAACA9812K1Z9 for September ₹14,999 Enterprise renewal.'
          },
          {
            id: 'msg-2',
            sender: 'agent',
            author: 'Aman Verma (Billing Operations)',
            avatar: 'AV',
            time: 'Yesterday 04:35 PM',
            text: 'Hello Suresh ji! Your GSTIN has been updated in your company profile and the amended tax invoice #INV-2026-09-881 is now attached. Thank you for choosing Simplefloww!'
          }
        ]
      },
      {
        id: 'TK-1083',
        subject: 'AI Chatbot auto-fallback triggering on Hindi/Hinglish buyer queries',
        clientName: 'KwikCart E-Commerce',
        clientEmail: 'support@kwikcart.in',
        clientPhone: '+91 97120 33819',
        clientTier: 'Pro Business Plan',
        category: 'Chatbot & AI Agent',
        categoryIcon: '🤖',
        priority: 'Urgent',
        status: 'Open',
        assignedTo: 'Unassigned',
        avatar: 'UN',
        createdAt: 'Today, 12:40 PM',
        createdTimestamp: Date.now() - 40 * 60 * 1000,
        slaTargetMins: 60,
        slaRemainingMins: 20,
        slaStatus: 'warning',
        clientVisible: true,
        messages: [
          {
            id: 'msg-1',
            sender: 'client',
            author: 'Rohan Mehra (KwikCart)',
            avatar: 'RM',
            time: '12:40 PM',
            text: 'When customers write in Hinglish like "Order kab tak aayega", AI bot is directly forwarding to human agent queue instead of answering shipping tracking status.'
          }
        ]
      },
      {
        id: 'TK-1084',
        subject: 'Auto-Assign round-robin rule skipping inactive telecallers during lunch break',
        clientName: 'EduPro Learning Institute',
        clientEmail: 'admin@edupro.co',
        clientPhone: '+91 98450 11203',
        clientTier: 'Growth Plan',
        category: 'Auto Assign Rules',
        categoryIcon: '👥',
        priority: 'Normal',
        status: 'In Progress',
        assignedTo: 'Rahul Sharma',
        avatar: 'RS',
        createdAt: 'Today, 01:10 PM',
        createdTimestamp: Date.now() - 30 * 60 * 1000,
        slaTargetMins: 180,
        slaRemainingMins: 150,
        slaStatus: 'ok',
        clientVisible: true,
        messages: [
          {
            id: 'msg-1',
            sender: 'client',
            author: 'Pooja Hegde (EduPro)',
            avatar: 'PH',
            time: '01:10 PM',
            text: 'We want the auto-assign engine to check agent "Away / Lunch" status toggle so leads are only given to online sales reps.'
          },
          {
            id: 'msg-2',
            sender: 'agent',
            author: 'Rahul Sharma',
            avatar: 'RS',
            time: '01:18 PM',
            text: 'Hi Pooja! You can enable "Strict Presence Check" inside Automation > Auto Assign Rules. I am configuring this rule right now for your team workspace.'
          }
        ]
      },
      {
        id: 'TK-1085',
        subject: 'WhatsApp Business API Phone Number Migration from Wati to Simplefloww',
        clientName: 'HealthPlus Clinics',
        clientEmail: 'tech@healthplus.org',
        clientPhone: '+91 99100 88231',
        clientTier: 'Enterprise Pro Plan',
        category: 'WhatsApp Cloud API',
        categoryIcon: '📱',
        priority: 'High',
        status: 'Open',
        assignedTo: 'Unassigned',
        avatar: 'UN',
        createdAt: 'Today, 01:25 PM',
        createdTimestamp: Date.now() - 15 * 60 * 1000,
        slaTargetMins: 120,
        slaRemainingMins: 105,
        slaStatus: 'ok',
        clientVisible: true,
        messages: [
          {
            id: 'msg-1',
            sender: 'client',
            author: 'Dr. Sameer Kapoor',
            avatar: 'SK',
            time: '01:25 PM',
            text: 'We want to migrate our existing verified WhatsApp number (+91 99100 88231) with Green Tick from Wati to Simplefloww Meta Cloud API. Please provide the 2-step verification PIN reset guide.'
          }
        ]
      }
    ];

    const cannedTemplates = {
      'meta-template': `Hi! We noticed that dynamic parameter {{1}} was missing a sample value in your Meta template submission. To fix this:\n1. Go to Campaigns > WhatsApp Templates\n2. Click Edit on your draft\n3. Under 'Sample Values', enter an example text (e.g. 'DIWALI20')\n4. Re-submit. Meta approves 95% of sample-provided templates within 15 minutes!`,
      'qr-reconnect': `Hi! If your WhatsApp Web session got disconnected:\n1. Open Simplefloww Communication > WhatsApp Accounts\n2. Click 'Refresh QR Session'\n3. Open WhatsApp on your primary phone > Linked Devices > Link a Device\n4. Scan the QR code within 40 seconds. Your sync will immediately resume without lead loss.`,
      'gst-invoice': `Hello! We have updated your GSTIN in the system records. Your revised B2B tax invoice with 18% input credit has been regenerated and sent to your registered billing email. You can also download it directly under Settings > Billing & Plans.`,
      'webhook-verify': `Hi Team! The 401 Unauthorized webhook error happens when your application HMAC secret does not match the Meta app secret token. Please verify that the SHA-256 Secret Key under Developer > Webhooks matches the token set in your Meta App Dashboard > Webhooks > Edit Subscription.`,
      'auto-assign': `Hello! To ensure telecallers away on lunch break do not receive auto-assigned incoming leads, please enable 'Strict Presence Check' in Automation > Auto Assign Rules. This automatically skips agents whose status toggle is set to Away.`
    };

    let hdState = {
      role: 'team', // 'team' or 'client'
      activeTab: 'tickets', // 'tickets' or 'kb'
      teamViewMode: 'table', // 'table' or 'kanban'
      teamPill: 'all',
      clientPill: 'all',
      teamSearch: '',
      clientSearch: '',
      categoryFilter: 'all',
      priorityFilter: 'all',
      activeTicketId: null,
      composerMode: 'reply' // 'reply' or 'internal'
    };

    function initHelpDeskTicketing() {
      // 1. Main Navigation Tabs (Tickets vs Knowledge Base)
      const tabTickets = document.getElementById('tab-hd-tickets');
      const tabKb = document.getElementById('tab-hd-kb');
      const secTickets = document.getElementById('section-hd-tickets');
      const secKb = document.getElementById('section-hd-kb');

      function switchMainTab(target) {
        hdState.activeTab = target;
        if (target === 'tickets') {
          if (tabTickets) tabTickets.classList.add('active');
          if (tabKb) tabKb.classList.remove('active');
          if (secTickets) secTickets.style.display = 'block';
          if (secKb) secKb.style.display = 'none';
        } else {
          if (tabTickets) tabTickets.classList.remove('active');
          if (tabKb) tabKb.classList.add('active');
          if (secTickets) secTickets.style.display = 'none';
          if (secKb) secKb.style.display = 'block';
        }
      }

      if (tabTickets) tabTickets.addEventListener('click', () => switchMainTab('tickets'));
      if (tabKb) tabKb.addEventListener('click', () => switchMainTab('kb'));

      // 2. Dual-Role Switcher (Team vs Client)
      const btnSwitchTeam = document.getElementById('btn-switch-team');
      const btnSwitchClient = document.getElementById('btn-switch-client');
      const teamViewContainer = document.getElementById('hd-team-view');
      const clientViewContainer = document.getElementById('hd-client-view');
      const roleNameEl = document.getElementById('hd-role-name');

      function setRole(role) {
        hdState.role = role;
        const roleBadge = document.getElementById('hd-portal-status-pill');
        if (role === 'team' || role === 'reseller') {
          if (btnSwitchTeam) btnSwitchTeam.classList.add('active');
          if (btnSwitchClient) btnSwitchClient.classList.remove('active');
          if (teamViewContainer) teamViewContainer.style.display = 'block';
          if (clientViewContainer) clientViewContainer.style.display = 'none';
          if (roleNameEl) roleNameEl.textContent = 'Support Team Desk (Internal Queue)';
          if (roleBadge) {
            roleBadge.textContent = '🏢 Reseller Desk Active';
            roleBadge.style.color = '#7c3aed';
            roleBadge.style.background = '#f5f3ff';
            roleBadge.style.borderColor = '#ddd6fe';
          }
          renderTeamTickets();
        } else {
          if (btnSwitchTeam) btnSwitchTeam.classList.remove('active');
          if (btnSwitchClient) btnSwitchClient.classList.add('active');
          if (teamViewContainer) teamViewContainer.style.display = 'none';
          if (clientViewContainer) clientViewContainer.style.display = 'block';
          if (roleNameEl) roleNameEl.textContent = 'Client Portal (TechNova Solutions)';
          if (roleBadge) {
            roleBadge.textContent = '👤 Client Portal Active';
            roleBadge.style.color = '#2563eb';
            roleBadge.style.background = '#eff6ff';
            roleBadge.style.borderColor = '#bfdbfe';
          }
          renderClientTickets();
        }
      }

      if (btnSwitchTeam) btnSwitchTeam.addEventListener('click', () => setRole('team'));
      if (btnSwitchClient) btnSwitchClient.addEventListener('click', () => setRole('client'));

      // 3. Team Triage Filters & Search
      const teamSearchInp = document.getElementById('hd-team-search');
      if (teamSearchInp) {
        teamSearchInp.addEventListener('input', (e) => {
          hdState.teamSearch = e.target.value.toLowerCase().trim();
          renderTeamTickets();
        });
      }

      const catFilterSel = document.getElementById('hd-filter-category');
      if (catFilterSel) {
        catFilterSel.addEventListener('change', (e) => {
          hdState.categoryFilter = e.target.value;
          renderTeamTickets();
        });
      }

      const prioFilterSel = document.getElementById('hd-filter-priority');
      if (prioFilterSel) {
        prioFilterSel.addEventListener('change', (e) => {
          hdState.priorityFilter = e.target.value;
          renderTeamTickets();
        });
      }

      // Quick Filter Pills (Team)
      const teamPills = document.querySelectorAll('#hd-team-filter-pills .hd-pill-btn');
      teamPills.forEach(btn => {
        btn.addEventListener('click', () => {
          teamPills.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          hdState.teamPill = btn.getAttribute('data-pill') || 'all';
          renderTeamTickets();
        });
      });

      // View Mode Toggle (Table vs Kanban)
      const btnViewTable = document.getElementById('btn-view-table');
      const btnViewKanban = document.getElementById('btn-view-kanban');
      const tableWrap = document.getElementById('hd-team-table-container');
      const kanbanWrap = document.getElementById('hd-team-kanban-container');

      function setTeamViewMode(mode) {
        hdState.teamViewMode = mode;
        if (mode === 'table') {
          if (btnViewTable) btnViewTable.classList.add('active');
          if (btnViewKanban) btnViewKanban.classList.remove('active');
          if (tableWrap) tableWrap.style.display = 'block';
          if (kanbanWrap) kanbanWrap.style.display = 'none';
        } else {
          if (btnViewTable) btnViewTable.classList.remove('active');
          if (btnViewKanban) btnViewKanban.classList.add('active');
          if (tableWrap) tableWrap.style.display = 'none';
          if (kanbanWrap) kanbanWrap.style.display = 'block';
          renderKanbanBoard();
        }
      }

      if (btnViewTable) btnViewTable.addEventListener('click', () => setTeamViewMode('table'));
      if (btnViewKanban) btnViewKanban.addEventListener('click', () => setTeamViewMode('kanban'));

      // 4. Client Search & Status Pills
      const clientSearchInp = document.getElementById('hd-client-search');
      if (clientSearchInp) {
        clientSearchInp.addEventListener('input', (e) => {
          hdState.clientSearch = e.target.value.toLowerCase().trim();
          renderClientTickets();
        });
      }

      const clientPills = document.querySelectorAll('#hd-client-filter-pills .hd-pill-btn');
      clientPills.forEach(btn => {
        btn.addEventListener('click', () => {
          clientPills.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          hdState.clientPill = btn.getAttribute('data-client-pill') || 'all';
          renderClientTickets();
        });
      });

      // 5. Render Team Table
      function renderTeamTickets() {
        updateKPICounters();
        const tbody = document.getElementById('hd-team-tickets-tbody');
        if (!tbody) return;

        const filtered = helpdeskTicketsData.filter(ticket => {
          // Pill filter
          if (hdState.teamPill === 'assigned-me' && ticket.assignedTo !== 'Rahul Sharma') return false;
          if (hdState.teamPill === 'unassigned' && ticket.assignedTo !== 'Unassigned') return false;
          if (hdState.teamPill === 'urgent' && ticket.priority !== 'Urgent') return false;
          if (hdState.teamPill === 'sla-warning' && (ticket.slaRemainingMins > 40 || ticket.status === 'Resolved')) return false;
          if (hdState.teamPill === 'waiting' && ticket.status !== 'Waiting on Client') return false;
          if (hdState.teamPill === 'resolved' && ticket.status !== 'Resolved') return false;

          // Dropdowns
          if (hdState.categoryFilter !== 'all' && ticket.category !== hdState.categoryFilter) return false;
          if (hdState.priorityFilter !== 'all' && ticket.priority !== hdState.priorityFilter) return false;

          // Search
          if (hdState.teamSearch) {
            const q = hdState.teamSearch;
            const match = ticket.id.toLowerCase().includes(q) ||
                          ticket.subject.toLowerCase().includes(q) ||
                          ticket.clientName.toLowerCase().includes(q) ||
                          ticket.category.toLowerCase().includes(q) ||
                          ticket.assignedTo.toLowerCase().includes(q);
            if (!match) return false;
          }
          return true;
        });

        if (filtered.length === 0) {
          tbody.innerHTML = `
            <tr>
              <td colspan="8" style="text-align: center; padding: 36px 20px; color: #64748b;">
                <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>
                <div style="font-weight: 700; font-size: 14px; color: #0f172a;">No support tickets match your filter criteria</div>
                <div style="font-size: 12px; margin-top: 4px;">Try clearing filters or search keyword</div>
              </td>
            </tr>`;
          return;
        }

        tbody.innerHTML = filtered.map(t => {
          const prioClass = t.priority === 'Urgent' ? 'urgent' : (t.priority === 'High' ? 'high' : 'normal');
          const prioLabel = t.priority === 'Urgent' ? 'Urgent 🚨' : t.priority;
          
          let statusClass = 'open';
          if (t.status === 'In Progress') statusClass = 'in-progress';
          else if (t.status === 'Waiting on Client') statusClass = 'waiting';
          else if (t.status === 'Resolved') statusClass = 'resolved';

          const slaBadge = t.status === 'Resolved' 
            ? `<span class="hd-sla-badge ok">✓ Resolved</span>` 
            : (t.slaRemainingMins <= 30 
                ? `<span class="hd-sla-badge warning">⏰ ${t.slaRemainingMins}m left!</span>` 
                : `<span class="hd-sla-badge ok">${t.slaRemainingMins}m left</span>`);

          return `
            <tr>
              <td>
                <a href="javascript:void(0)" class="hd-ticket-id-tag btn-open-workspace" onclick="window.openTicketWorkspace && window.openTicketWorkspace('${t.id}')" data-ticket-id="${t.id}">${t.id}</a>
              </td>
              <td>
                <div style="font-weight: 600; color: #0f172a;">${t.clientName}</div>
                <div style="font-size: 11px; color: #64748b;">${t.clientTier}</div>
              </td>
              <td class="hd-ticket-subject-cell">
                <span class="hd-ticket-subject-link btn-open-workspace" onclick="window.openTicketWorkspace && window.openTicketWorkspace('${t.id}')" data-ticket-id="${t.id}" style="cursor: pointer;">
                  ${t.subject}
                </span>
                <span class="hd-ticket-meta-tag">
                  ${t.categoryIcon} ${t.category} • ${t.createdAt}
                </span>
              </td>
              <td>
                <span class="hd-prio-chip ${prioClass}">${prioLabel}</span>
              </td>
              <td>
                <select class="hd-status-select ${statusClass} inline-status-change" data-ticket-id="${t.id}">
                  <option value="Open" ${t.status === 'Open' ? 'selected' : ''}>Open</option>
                  <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Waiting on Client" ${t.status === 'Waiting on Client' ? 'selected' : ''}>Waiting on Client</option>
                  <option value="Resolved" ${t.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>
              </td>
              <td>
                <select class="hd-select-compact inline-assign-change" data-ticket-id="${t.id}" style="font-size: 11px; padding: 3px 6px;">
                  <option value="Rahul Sharma" ${t.assignedTo === 'Rahul Sharma' ? 'selected' : ''}>Rahul Sharma</option>
                  <option value="Priya Patel" ${t.assignedTo === 'Priya Patel' ? 'selected' : ''}>Priya Patel</option>
                  <option value="Aman Verma" ${t.assignedTo === 'Aman Verma' ? 'selected' : ''}>Aman Verma</option>
                  <option value="Unassigned" ${t.assignedTo === 'Unassigned' ? 'selected' : ''}>🚨 Unassigned</option>
                </select>
              </td>
              <td>
                ${slaBadge}
              </td>
              <td style="text-align: right;">
                <button type="button" class="btn-secondary btn-open-workspace" onclick="window.openTicketWorkspace && window.openTicketWorkspace('${t.id}')" data-ticket-id="${t.id}" style="font-size: 11.5px; padding: 4px 10px; font-weight: 600; cursor: pointer;">
                  Open 🚀
                </button>
              </td>
            </tr>
          `;
        }).join('');

        attachTicketActionListeners();
      }

      // 6. Render Team Kanban Board
      function renderKanbanBoard() {
        const colOpen = document.getElementById('kb-cards-open');
        const colProgress = document.getElementById('kb-cards-progress');
        const colWaiting = document.getElementById('kb-cards-waiting');
        const colResolved = document.getElementById('kb-cards-resolved');

        if (!colOpen || !colProgress || !colWaiting || !colResolved) return;

        colOpen.innerHTML = '';
        colProgress.innerHTML = '';
        colWaiting.innerHTML = '';
        colResolved.innerHTML = '';

        helpdeskTicketsData.forEach(t => {
          const prioBorder = t.priority === 'Urgent' ? 'urgent-border' : '';
          
          let moveButtons = '';
          if (t.status === 'Open') {
            moveButtons = `<button type="button" class="hd-kanban-move-btn" data-move-id="${t.id}" data-move-to="In Progress">➔ Start Working</button>`;
          } else if (t.status === 'In Progress') {
            moveButtons = `
              <button type="button" class="hd-kanban-move-btn" data-move-id="${t.id}" data-move-to="Waiting on Client">➔ Ask Client</button>
              <button type="button" class="hd-kanban-move-btn" data-move-id="${t.id}" data-move-to="Resolved" style="color: #15803d; border-color: #bbf7d0;">✓ Resolve</button>
            `;
          } else if (t.status === 'Waiting on Client') {
            moveButtons = `
              <button type="button" class="hd-kanban-move-btn" data-move-id="${t.id}" data-move-to="In Progress">➔ In Progress</button>
              <button type="button" class="hd-kanban-move-btn" data-move-id="${t.id}" data-move-to="Resolved" style="color: #15803d; border-color: #bbf7d0;">✓ Resolve</button>
            `;
          } else if (t.status === 'Resolved') {
            moveButtons = `<button type="button" class="hd-kanban-move-btn" data-move-id="${t.id}" data-move-to="In Progress">↺ Re-Open</button>`;
          }

          const cardHtml = `
            <div class="hd-kanban-card ${prioBorder}" data-ticket-id="${t.id}" onclick="if (!event.target.closest('button, a, input, select, textarea, .hd-kanban-move-btn')) { window.openTicketWorkspace && window.openTicketWorkspace('${t.id}'); }">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span class="hd-ticket-id-tag btn-open-workspace" onclick="window.openTicketWorkspace && window.openTicketWorkspace('${t.id}')" data-ticket-id="${t.id}" style="cursor: pointer;">${t.id}</span>
                <span class="hd-prio-chip ${t.priority.toLowerCase()}">${t.priority}</span>
              </div>
              <div class="btn-open-workspace" onclick="window.openTicketWorkspace && window.openTicketWorkspace('${t.id}')" data-ticket-id="${t.id}" style="font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.35; margin-bottom: 6px; cursor: pointer;">
                ${t.subject}
              </div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
                ${t.clientName} • ${t.category}
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 8px;">
                <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: #475569;">
                  <div class="hd-agent-avatar" style="width: 22px; height: 22px; font-size: 10px;">${t.avatar}</div>
                  <span>${t.assignedTo.split(' ')[0]}</span>
                </div>
                <span class="hd-sla-badge ${t.status === 'Resolved' ? 'ok' : (t.slaRemainingMins <= 30 ? 'warning' : 'ok')}" style="font-size: 10px; padding: 2px 6px;">
                  ${t.status === 'Resolved' ? '✓ Closed' : `${t.slaRemainingMins}m`}
                </span>
              </div>
              <div class="hd-kanban-quick-actions">
                ${moveButtons}
              </div>
            </div>
          `;

          if (t.status === 'Open') colOpen.insertAdjacentHTML('beforeend', cardHtml);
          else if (t.status === 'In Progress') colProgress.insertAdjacentHTML('beforeend', cardHtml);
          else if (t.status === 'Waiting on Client') colWaiting.insertAdjacentHTML('beforeend', cardHtml);
          else if (t.status === 'Resolved') colResolved.insertAdjacentHTML('beforeend', cardHtml);
        });

        // Update column counts
        const cntOpen = document.getElementById('kb-cnt-open');
        const cntProgress = document.getElementById('kb-cnt-progress');
        const cntWaiting = document.getElementById('kb-cnt-waiting');
        const cntResolved = document.getElementById('kb-cnt-resolved');
        if (cntOpen) cntOpen.textContent = helpdeskTicketsData.filter(t => t.status === 'Open').length;
        if (cntProgress) cntProgress.textContent = helpdeskTicketsData.filter(t => t.status === 'In Progress').length;
        if (cntWaiting) cntWaiting.textContent = helpdeskTicketsData.filter(t => t.status === 'Waiting on Client').length;
        if (cntResolved) cntResolved.textContent = helpdeskTicketsData.filter(t => t.status === 'Resolved').length;

        attachTicketActionListeners();
      }

      // 7. Render Client Portal Cards
      function renderClientTickets() {
        const container = document.getElementById('hd-client-cards-container');
        if (!container) return;

        const filtered = helpdeskTicketsData.filter(ticket => {
          if (hdState.clientPill === 'active' && ticket.status !== 'In Progress' && ticket.status !== 'Open') return false;
          if (hdState.clientPill === 'waiting' && ticket.status !== 'Waiting on Client') return false;
          if (hdState.clientPill === 'resolved' && ticket.status !== 'Resolved') return false;

          if (hdState.clientSearch) {
            const q = hdState.clientSearch;
            const match = ticket.id.toLowerCase().includes(q) ||
                          ticket.subject.toLowerCase().includes(q) ||
                          ticket.category.toLowerCase().includes(q);
            if (!match) return false;
          }
          return true;
        });

        if (filtered.length === 0) {
          container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px;">
              <div style="font-size: 32px; margin-bottom: 8px;">📋</div>
              <h4 style="margin: 0; color: #0f172a; font-size: 15px;">No tickets found</h4>
              <p style="margin: 4px 0 14px 0; color: #64748b; font-size: 12.5px;">You have no tickets matching this search.</p>
              <button type="button" class="btn-primary" id="btn-empty-raise" style="font-size: 12px;">+ Raise New Ticket</button>
            </div>
          `;
          const btnEmpty = document.getElementById('btn-empty-raise');
          if (btnEmpty) btnEmpty.addEventListener('click', openRaiseTicketModal);
          return;
        }

        container.innerHTML = filtered.map(t => {
          const prioClass = t.priority === 'Urgent' ? 'urgent' : (t.priority === 'High' ? 'high' : 'normal');
          
          let statusBadge = '<span class="status-chip in-progress">In Progress</span>';
          if (t.status === 'Open') statusBadge = '<span class="status-chip open">Open & Queued</span>';
          else if (t.status === 'Waiting on Client') statusBadge = '<span class="status-chip waiting">Action Required by You</span>';
          else if (t.status === 'Resolved') statusBadge = '<span class="status-chip resolved">✓ Resolved</span>';

          const lastMsg = t.messages[t.messages.length - 1];
          const lastMsgText = lastMsg ? (lastMsg.sender === 'internal' ? 'Support specialist updated ticket notes' : lastMsg.text) : 'Ticket initiated';

          return `
            <div class="hd-client-card" data-ticket-id="${t.id}" onclick="if (!event.target.closest('button, a, input, select, textarea')) { window.openTicketWorkspace && window.openTicketWorkspace('${t.id}'); }">
              <div>
                <div class="hd-client-card-top">
                  <span class="hd-ticket-id-tag btn-open-workspace" onclick="window.openTicketWorkspace && window.openTicketWorkspace('${t.id}')" data-ticket-id="${t.id}" style="cursor: pointer;">${t.id}</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="hd-prio-chip ${prioClass}">${t.priority}</span>
                    ${statusBadge}
                  </div>
                </div>

                <h4 class="hd-client-card-sub btn-open-workspace" onclick="window.openTicketWorkspace && window.openTicketWorkspace('${t.id}')" data-ticket-id="${t.id}">${t.subject}</h4>
                <div style="font-size: 11.5px; color: #64748b; margin-bottom: 12px;">
                  ${t.categoryIcon} ${t.category} • Created ${t.createdAt}
                </div>

                <div class="hd-client-agent-info">
                  <div class="hd-agent-avatar">${t.avatar}</div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 12px; font-weight: 700; color: #0f172a;">${t.assignedTo}</div>
                    <div style="font-size: 11px; color: #64748b; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                      "${lastMsgText}"
                    </div>
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 4px;">
                <div style="font-size: 11.5px; color: #475569;">
                  ${t.status === 'Resolved' ? '⭐ Rating: 5 Stars' : `⏰ SLA: <strong style="color: ${t.slaRemainingMins <= 30 ? '#dc2626' : '#16a34a'};">${t.slaRemainingMins} mins</strong> remaining`}
                </div>
                <button type="button" class="btn-primary btn-open-workspace" onclick="window.openTicketWorkspace && window.openTicketWorkspace('${t.id}')" data-ticket-id="${t.id}" style="font-size: 12px; padding: 6px 14px; cursor: pointer;">
                  ${t.status === 'Resolved' ? 'View Summary' : 'View & Chat 💬'}
                </button>
              </div>
            </div>
          `;
        }).join('');

        attachTicketActionListeners();
      }

      // 8. KPI Counter Updates
      function updateKPICounters() {
        const total = helpdeskTicketsData.length;
        const unassigned = helpdeskTicketsData.filter(t => t.assignedTo === 'Unassigned' && t.status !== 'Resolved').length;
        const active = helpdeskTicketsData.filter(t => t.status === 'In Progress').length;
        const slaWarning = helpdeskTicketsData.filter(t => t.slaRemainingMins <= 40 && t.status !== 'Resolved').length;
        const waiting = helpdeskTicketsData.filter(t => t.status === 'Waiting on Client').length;
        const resolved = helpdeskTicketsData.filter(t => t.status === 'Resolved').length;
        const assignedMe = helpdeskTicketsData.filter(t => t.assignedTo === 'Rahul Sharma' && t.status !== 'Resolved').length;

        // Header total badge
        const badgeTop = document.getElementById('hd-ticket-total-badge');
        if (badgeTop) badgeTop.textContent = total;

        // Team KPI cards
        const elUnassigned = document.getElementById('kpi-team-unassigned');
        const elActive = document.getElementById('kpi-team-active');
        const elWarning = document.getElementById('kpi-team-sla-warning');
        if (elUnassigned) elUnassigned.textContent = unassigned;
        if (elActive) elActive.textContent = active;
        if (elWarning) elWarning.textContent = slaWarning;

        // Team Filter Pill badges
        const pAll = document.getElementById('pill-cnt-all');
        const pMe = document.getElementById('pill-cnt-me');
        const pUn = document.getElementById('pill-cnt-unassigned');
        const pUrg = document.getElementById('pill-cnt-urgent');
        const pSla = document.getElementById('pill-cnt-sla');
        const pWait = document.getElementById('pill-cnt-waiting');
        const pRes = document.getElementById('pill-cnt-resolved');
        if (pAll) pAll.textContent = total;
        if (pMe) pMe.textContent = assignedMe;
        if (pUn) pUn.textContent = unassigned;
        if (pUrg) pUrg.textContent = helpdeskTicketsData.filter(t => t.priority === 'Urgent').length;
        if (pSla) pSla.textContent = slaWarning;
        if (pWait) pWait.textContent = waiting;
        if (pRes) pRes.textContent = resolved;

        // Client Stats
        const sCliAct = document.getElementById('stat-client-active');
        const sCliWait = document.getElementById('stat-client-waiting');
        const sCliRes = document.getElementById('stat-client-resolved');
        if (sCliAct) sCliAct.textContent = helpdeskTicketsData.filter(t => t.status === 'In Progress' || t.status === 'Open').length;
        if (sCliWait) sCliWait.textContent = waiting;
        if (sCliRes) sCliRes.textContent = resolved;
      }

      // =======================================================================
      // AUDIO SOUND EFFECTS ENGINE (Web Audio API - Zero Asset Dependency)
      // =======================================================================
      function playHelpdeskSound(type = 'message') {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          const ctx = new AudioCtx();
          const now = ctx.currentTime;

          if (type === 'message') {
            // Smooth harmonic two-tone notification chime (E5 -> A5)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(659.25, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.42);
          } else if (type === 'alert') {
            // Urgent double-pulse chime (880Hz)
            [0, 0.14].forEach(delay => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(880, now + delay);
              gain.gain.setValueAtTime(0.22, now + delay);
              gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + delay);
              osc.stop(now + delay + 0.12);
            });
          } else if (type === 'success') {
            // Tri-tone celebratory chime (C5 -> E5 -> G5)
            [523.25, 659.25, 783.99].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.09);
              gain.gain.setValueAtTime(0.18, now + idx * 0.09);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.38);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.09);
              osc.stop(now + idx * 0.09 + 0.38);
            });
          }
        } catch (e) {
          // AudioContext might be waiting for user gesture
        }
      }

      // =======================================================================
      // LIVE NOTIFICATION POPUP GENERATOR
      // =======================================================================
      function showHelpdeskNotification({ title, sender, text, ticketId, type = 'message' }) {
        playHelpdeskSound(type === 'alert' ? 'alert' : (type === 'success' ? 'success' : 'message'));

        // Update header bell badge
        const bellBadge = document.getElementById('header-bell-badge');
        if (bellBadge) {
          const cur = parseInt(bellBadge.textContent || '0', 10);
          bellBadge.textContent = cur + 1;
          bellBadge.style.display = 'inline-flex';
        }

        const container = document.getElementById('hd-notification-toast-container');
        if (!container) return;

        const card = document.createElement('div');
        card.className = `hd-notif-card ${type}`;
        card.innerHTML = `
          <div class="hd-notif-avatar">${sender ? sender.slice(0, 2).toUpperCase() : '🔔'}</div>
          <div class="hd-notif-content">
            <div class="hd-notif-header">
              <strong class="hd-notif-sender">${sender}</strong>
              <span class="hd-notif-ticket">${ticketId ? '#' + ticketId : ''}</span>
            </div>
            <div class="hd-notif-text">${text}</div>
            ${ticketId ? `<button type="button" class="hd-notif-action" data-ticket="${ticketId}">View Ticket 💬</button>` : ''}
          </div>
          <button type="button" class="hd-notif-close">&times;</button>
        `;

        container.appendChild(card);

        const viewBtn = card.querySelector('.hd-notif-action');
        if (viewBtn) {
          viewBtn.addEventListener('click', () => {
            openTicketWorkspace(ticketId);
            card.remove();
          });
        }

        const closeBtn = card.querySelector('.hd-notif-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => card.remove());
        }

        setTimeout(() => {
          if (card.parentNode) {
            card.classList.add('fade-out');
            setTimeout(() => card.remove(), 280);
          }
        }, 5500);
      }

      // Header Notification Bell Click Handler
      const headerBellBtn = document.getElementById('header-bell-btn');
      if (headerBellBtn) {
        headerBellBtn.addEventListener('click', () => {
          const bellBadge = document.getElementById('header-bell-badge');
          if (bellBadge) {
            bellBadge.textContent = '0';
            bellBadge.style.display = 'none';
          }
          showToast('🔔 Notification Center: All support ticket alerts marked as read.');
        });
      }

      // Context-aware Smart Auto-Reply Generator
      function getSmartAutoReply(ticket, userMsg, isClientRole) {
        const q = (userMsg || '').toLowerCase();
        const cat = (ticket.category || '').toLowerCase();

        if (isClientRole) {
          // Client sent a message -> Support Agent replies
          if (cat.includes('whatsapp') || q.includes('401') || q.includes('webhook') || q.includes('token')) {
            return `Hello Arjun! We ran a live diagnostic ping against Meta Graph API v21.0. Your webhook signature is now validated and returning HTTP 200 OK. Incoming leads from WhatsApp are syncing in real time!`;
          }
          if (cat.includes('broadcast') || q.includes('template') || q.includes('diwali') || q.includes('reject')) {
            return `Hi! We checked the template formatting. All variables {{1}} have been tagged with marketing sample previews and submitted to Meta's expedited approval pipeline. It will be active within 15 minutes!`;
          }
          if (cat.includes('billing') || q.includes('gst') || q.includes('invoice') || q.includes('tax')) {
            return `Hello! Your Maharashtra GSTIN 27AAACA9812K1Z9 is updated in company billing records. Amended tax invoice #INV-2026-09-881 is generated with 18% ITC credit.`;
          }
          if (cat.includes('chatbot') || q.includes('ai') || q.includes('hinglish') || q.includes('hindi')) {
            return `Hi! We enabled Multilingual NLU embedding for Hindi and Hinglish queries. The chatbot will now directly answer shipping and delivery queries in colloquial Hindi without triggering manual agent fallback.`;
          }
          return `Hello! Thank you for the update. Our support engineering team has reviewed your log trace and updated your account configuration. Please verify and let us know if any further help is needed.`;
        } else {
          // Agent sent a public message -> Customer replies
          if (q.includes('fixed') || q.includes('approve') || q.includes('updated') || q.includes('check')) {
            return `Thanks Rahul! We just tested it on our live customer dashboard and verified everything is working smoothly now. Appreciate the super fast turnaround!`;
          }
          return `Understood, thank you for looking into this so quickly! We will monitor the dashboard and let you know if anything else comes up.`;
        }
      }

      // 9. Attach Listeners for Table & Kanban Cards
      function attachTicketActionListeners() {
        // Direct click on any .btn-open-workspace or [data-open-ticket]
        document.querySelectorAll('.btn-open-workspace, [data-open-ticket]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const ticketId = btn.getAttribute('data-ticket-id') || btn.getAttribute('data-open-ticket');
            if (ticketId) openTicketWorkspace(ticketId);
          });
        });

        // Click anywhere on a client card (except inside buttons or inputs)
        document.querySelectorAll('.hd-client-card').forEach(card => {
          card.addEventListener('click', (e) => {
            if (e.target.closest('button, a, input, select, textarea')) return;
            const ticketId = card.getAttribute('data-ticket-id');
            if (ticketId) openTicketWorkspace(ticketId);
          });
        });

        // Click anywhere on a kanban card (except inside buttons or select)
        document.querySelectorAll('.hd-kanban-card').forEach(card => {
          card.addEventListener('click', (e) => {
            if (e.target.closest('button, a, input, select, textarea, .hd-kanban-move-btn')) return;
            const ticketId = card.getAttribute('data-ticket-id');
            if (ticketId) openTicketWorkspace(ticketId);
          });
        });

        // Inline status select
        document.querySelectorAll('.inline-status-change').forEach(sel => {
          sel.addEventListener('change', (e) => {
            const ticketId = sel.getAttribute('data-ticket-id');
            const newStatus = sel.value;
            const ticket = helpdeskTicketsData.find(t => t.id === ticketId);
            if (ticket) {
              ticket.status = newStatus;
              playHelpdeskSound('message');
              showHelpdeskNotification({
                title: 'Ticket Status Updated',
                sender: 'System Dispatcher',
                text: `Ticket #${ticketId} status changed to "${newStatus}"`,
                ticketId: ticketId,
                type: newStatus === 'Resolved' ? 'success' : 'message'
              });
              renderTeamTickets();
              if (hdState.teamViewMode === 'kanban') renderKanbanBoard();
            }
          });
        });

        // Inline assignee select
        document.querySelectorAll('.inline-assign-change').forEach(sel => {
          sel.addEventListener('change', (e) => {
            const ticketId = sel.getAttribute('data-ticket-id');
            const newAssignee = sel.value;
            const ticket = helpdeskTicketsData.find(t => t.id === ticketId);
            if (ticket) {
              ticket.assignedTo = newAssignee;
              ticket.avatar = newAssignee === 'Unassigned' ? 'UN' : newAssignee.split(' ').map(n => n[0]).join('');
              playHelpdeskSound('message');
              showHelpdeskNotification({
                title: 'Ticket Reassigned',
                sender: newAssignee,
                text: `Ticket #${ticketId} assigned to specialist ${newAssignee}`,
                ticketId: ticketId,
                type: 'message'
              });
              renderTeamTickets();
              if (hdState.teamViewMode === 'kanban') renderKanbanBoard();
            }
          });
        });

        // Kanban Quick Advance buttons
        document.querySelectorAll('.hd-kanban-move-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const ticketId = btn.getAttribute('data-move-id');
            const moveTo = btn.getAttribute('data-move-to');
            const ticket = helpdeskTicketsData.find(t => t.id === ticketId);
            if (ticket && moveTo) {
              ticket.status = moveTo;
              playHelpdeskSound(moveTo === 'Resolved' ? 'success' : 'message');
              showHelpdeskNotification({
                title: 'Kanban Move',
                sender: 'Support Queue',
                text: `Moved #${ticketId} to "${moveTo}"`,
                ticketId: ticketId,
                type: moveTo === 'Resolved' ? 'success' : 'message'
              });
              renderKanbanBoard();
              renderTeamTickets();
            }
          });
        });
      }

      // 10. Resolution Workspace Modal / Drawer Logic
      const modalWorkspace = document.getElementById('modal-ticket-workspace');
      const wsBtnClose = document.getElementById('ws-btn-close');
      const wsTabReply = document.getElementById('ws-tab-reply');
      const wsTabInternal = document.getElementById('ws-tab-internal');
      const wsReplyText = document.getElementById('ws-reply-text');
      const wsCannedSelect = document.getElementById('ws-canned-select');
      const wsCannedWrapper = document.getElementById('ws-canned-wrapper');
      const wsComposerTabs = document.getElementById('ws-composer-tabs');
      const wsBtnSend = document.getElementById('ws-btn-send');
      const wsBtnMarkResolved = document.getElementById('ws-btn-mark-resolved');
      const wsStatusSelect = document.getElementById('ws-ticket-status-select');
      const wsAssigneeSelect = document.getElementById('ws-assignee-select');
      const wsPrioritySelect = document.getElementById('ws-priority-select');
      const wsBtnAttachFile = document.getElementById('ws-btn-attach-file');
      const wsComposerAttWrap = document.getElementById('ws-composer-att-wrap');
      const wsBtnRemoveAtt = document.getElementById('ws-btn-remove-att');
      const wsBtnSubmitCsat = document.getElementById('ws-btn-submit-csat');
      const wsCsatReviewInp = document.getElementById('ws-csat-review-inp');

      let currentAttachment = null;

      function openTicketWorkspace(ticketId) {
        const ticket = helpdeskTicketsData.find(t => t.id === ticketId);
        if (!ticket) return;

        hdState.activeTicketId = ticketId;

        // Populate Workspace Header
        const wsId = document.getElementById('ws-ticket-id');
        const wsSubject = document.getElementById('ws-ticket-subject');
        const wsCategory = document.getElementById('ws-ticket-category');
        const wsPriority = document.getElementById('ws-ticket-priority');
        if (wsId) wsId.textContent = `#${ticket.id}`;
        if (wsSubject) wsSubject.textContent = ticket.subject;
        if (wsCategory) wsCategory.textContent = `${ticket.categoryIcon} ${ticket.category}`;
        if (wsPriority) {
          wsPriority.className = `hd-prio-chip ${ticket.priority.toLowerCase()}`;
          wsPriority.textContent = ticket.priority === 'Urgent' ? 'Urgent 🚨' : ticket.priority;
        }

        // Set status and properties dropdowns
        if (wsStatusSelect) wsStatusSelect.value = ticket.status;
        if (wsAssigneeSelect) wsAssigneeSelect.value = ticket.assignedTo;
        if (wsPrioritySelect) wsPrioritySelect.value = ticket.priority;

        // SLA Card
        const wsSlaBadge = document.getElementById('ws-sla-badge');
        const wsSlaProgress = document.getElementById('ws-sla-progress');
        const wsSlaCreated = document.getElementById('ws-sla-created-time');
        if (wsSlaBadge) {
          wsSlaBadge.textContent = ticket.status === 'Resolved' ? '✓ Resolved' : `${ticket.slaRemainingMins}m remaining`;
          wsSlaBadge.className = `hd-sla-badge ${ticket.status === 'Resolved' ? 'ok' : (ticket.slaRemainingMins <= 30 ? 'warning' : 'ok')}`;
        }
        if (wsSlaProgress) {
          const pct = Math.max(10, Math.min(100, Math.round((ticket.slaRemainingMins / ticket.slaTargetMins) * 100)));
          wsSlaProgress.style.width = `${pct}%`;
        }
        if (wsSlaCreated) wsSlaCreated.textContent = `Opened ${ticket.createdAt}`;

        // Customer details
        const wsClientCompany = document.getElementById('ws-client-company');
        const wsClientEmail = document.getElementById('ws-client-email');
        const wsClientPhone = document.getElementById('ws-client-phone');
        const wsClientTier = document.getElementById('ws-client-tier');
        const wsClientAvatar = document.getElementById('ws-client-avatar');
        if (wsClientCompany) wsClientCompany.textContent = ticket.clientName;
        if (wsClientEmail) wsClientEmail.textContent = ticket.clientEmail;
        if (wsClientPhone) wsClientPhone.textContent = ticket.clientPhone;
        if (wsClientTier) wsClientTier.textContent = ticket.clientTier;
        if (wsClientAvatar) wsClientAvatar.textContent = ticket.clientName.slice(0, 2).toUpperCase();

        // Dual-View Mode Adaptation
        if (hdState.role === 'client') {
          if (wsComposerTabs) wsComposerTabs.style.display = 'none';
          if (wsCannedWrapper) wsCannedWrapper.style.display = 'none';
          if (wsAssigneeSelect) wsAssigneeSelect.disabled = true;
          if (wsPrioritySelect) wsPrioritySelect.disabled = true;
        } else {
          if (wsComposerTabs) wsComposerTabs.style.display = 'flex';
          if (wsCannedWrapper) wsCannedWrapper.style.display = 'flex';
          if (wsAssigneeSelect) wsAssigneeSelect.disabled = false;
          if (wsPrioritySelect) wsPrioritySelect.disabled = false;
        }

        renderWorkspaceMessages(ticket);

        // CSAT Rating Card (shows in client mode if resolved)
        const csatWrap = document.getElementById('ws-csat-container');
        if (csatWrap) {
          csatWrap.style.display = (hdState.role === 'client' && ticket.status === 'Resolved') ? 'block' : 'none';
        }

        const modal = document.getElementById('modal-ticket-workspace');
        if (modal) {
          modal.style.setProperty('display', 'flex', 'important');
          modal.classList.add('show', 'open', 'active');
        }
      }

      function closeTicketWorkspace() {
        const modal = document.getElementById('modal-ticket-workspace');
        if (modal) {
          modal.style.setProperty('display', 'none', 'important');
          modal.classList.remove('show', 'open', 'active');
        }
        hdState.activeTicketId = null;
        currentAttachment = null;
        const attWrap = document.getElementById('ws-composer-att-wrap');
        if (attWrap) attWrap.style.display = 'none';
        const replyText = document.getElementById('ws-reply-text');
        if (replyText) {
          replyText.value = '';
          replyText.classList.remove('internal-mode');
        }
      }

      if (wsBtnClose) {
        wsBtnClose.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeTicketWorkspace();
        });
      }

      // Close modal when clicking outside on backdrop
      if (modalWorkspace) {
        modalWorkspace.addEventListener('click', (e) => {
          if (e.target === modalWorkspace) {
            closeTicketWorkspace();
          }
        });
      }

      // Document-level Click Delegation for Help Desk
      document.addEventListener('click', (e) => {
        // Ignore interactions inside form inputs, dropdowns, kanban move buttons, notification dismiss, or modal close buttons
        if (e.target.closest('select, input, textarea, .hd-kanban-move-btn, .hd-notif-close, #ws-btn-close, #modal-close-raise-ticket, #modal-cancel-raise-ticket')) {
          return;
        }

        if (e.target === modalWorkspace) {
          closeTicketWorkspace();
          return;
        }

        const trigger = e.target.closest('.btn-open-workspace, [data-open-ticket], .hd-client-card, .hd-kanban-card');
        if (trigger) {
          const ticketId = trigger.getAttribute('data-ticket-id') || 
                           trigger.getAttribute('data-open-ticket') ||
                           trigger.querySelector('[data-ticket-id]')?.getAttribute('data-ticket-id');
          if (ticketId) {
            e.preventDefault();
            e.stopPropagation();
            openTicketWorkspace(ticketId);
          }
        }
      });

      // Global Escape key dismiss for drawers
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (modalWorkspace && (modalWorkspace.style.display === 'flex' || modalWorkspace.classList.contains('show'))) {
            closeTicketWorkspace();
          }
          if (modalRaiseTicket && modalRaiseTicket.style.display === 'flex') {
            closeRaiseTicketModal();
          }
        }
      });

      // Composer Attachment button
      if (wsBtnAttachFile) {
        wsBtnAttachFile.addEventListener('click', () => {
          currentAttachment = 'webhook_trace_error.png (1.2 MB)';
          if (wsComposerAttWrap) {
            wsComposerAttWrap.style.display = 'block';
            const attName = document.getElementById('ws-composer-att-name');
            if (attName) attName.textContent = currentAttachment;
          }
          showToast('📎 Attached screenshot: webhook_trace_error.png');
        });
      }

      if (wsBtnRemoveAtt) {
        wsBtnRemoveAtt.addEventListener('click', () => {
          currentAttachment = null;
          if (wsComposerAttWrap) wsComposerAttWrap.style.display = 'none';
        });
      }

      // Composer Tab: Reply vs Private Note
      function setComposerMode(mode) {
        hdState.composerMode = mode;
        const hint = document.getElementById('ws-composer-hint');
        if (mode === 'internal') {
          if (wsTabReply) wsTabReply.className = 'hd-comp-tab-btn';
          if (wsTabInternal) wsTabInternal.className = 'hd-comp-tab-btn active-internal';
          if (wsReplyText) {
            wsReplyText.classList.add('internal-mode');
            wsReplyText.placeholder = '🔒 Type private note... (Visible ONLY to support team reps, hidden from customer)';
          }
          if (wsBtnSend) wsBtnSend.textContent = 'Save Internal Note 🔒';
          if (hint) hint.innerHTML = '<span style="color: #b45309; font-weight: 600;">🔒 Yellow Private Note: Confidential to team</span>';
        } else {
          if (wsTabReply) wsTabReply.className = 'hd-comp-tab-btn active-reply';
          if (wsTabInternal) wsTabInternal.className = 'hd-comp-tab-btn';
          if (wsReplyText) {
            wsReplyText.classList.remove('internal-mode');
            wsReplyText.placeholder = 'Type your reply... (Enter sends reply, supports markdown)';
          }
          if (wsBtnSend) wsBtnSend.textContent = 'Send Reply 🚀';
          if (hint) hint.textContent = 'Customer will receive email & WhatsApp alert';
        }
      }

      if (wsTabReply) wsTabReply.addEventListener('click', () => setComposerMode('reply'));
      if (wsTabInternal) wsTabInternal.addEventListener('click', () => setComposerMode('internal'));

      // Canned Response auto-populate
      if (wsCannedSelect) {
        wsCannedSelect.addEventListener('change', () => {
          const val = wsCannedSelect.value;
          if (val && cannedTemplates[val]) {
            if (wsReplyText) {
              wsReplyText.value = cannedTemplates[val];
              wsReplyText.focus();
            }
          }
        });
      }

      // Render Messages in Workspace
      function renderWorkspaceMessages(ticket) {
        const msgContainer = document.getElementById('ws-messages-container');
        if (!msgContainer) return;

        // If in Client mode, hide internal notes
        const visibleMsgs = ticket.messages.filter(m => {
          if (hdState.role === 'client' && m.sender === 'internal') return false;
          return true;
        });

        msgContainer.innerHTML = visibleMsgs.map(m => {
          if (m.sender === 'internal') {
            return `
              <div class="hd-msg-bubble internal">
                <div class="hd-msg-content">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <strong style="color: #854d0e;">🔒 Private Internal Note • ${m.author}</strong>
                    <span style="font-size: 11px; color: #a16207;">${m.time}</span>
                  </div>
                  <div>${m.text}</div>
                </div>
              </div>
            `;
          }

          const isClient = m.sender === 'client';
          const bubbleClass = isClient ? 'client' : 'agent';
          
          let attachmentHtml = '';
          if (m.attachments && m.attachments.length > 0) {
            attachmentHtml = m.attachments.map(att => `
              <div class="hd-msg-attachment" title="Click to view file">
                <span class="hd-att-icon">📎</span>
                <div>
                  <div class="hd-att-title">${att}</div>
                  <div class="hd-att-meta">Attached File • Click to preview</div>
                </div>
              </div>
            `).join('');
          }

          return `
            <div class="hd-msg-bubble ${bubbleClass}">
              <div class="hd-msg-meta">
                <strong>${m.author}</strong> • <span>${m.time}</span>
              </div>
              <div class="hd-msg-content">
                <div>${m.text}</div>
                ${attachmentHtml}
              </div>
            </div>
          `;
        }).join('');

        // Scroll to bottom
        msgContainer.scrollTop = msgContainer.scrollHeight;
      }

      // Send Message Handler with Real-Time Simulated Auto-Reply & Sound Chimes
      function handleSendMessage() {
        const text = wsReplyText ? wsReplyText.value.trim() : '';
        if (!text && !currentAttachment) {
          showToast('Please enter a message or attach a file before sending.');
          return;
        }

        const ticket = helpdeskTicketsData.find(t => t.id === hdState.activeTicketId);
        if (!ticket) return;

        const isInternal = hdState.composerMode === 'internal';
        const isClientRole = hdState.role === 'client';

        const newMsg = {
          id: `msg-${ticket.messages.length + 1}`,
          sender: isInternal ? 'internal' : (isClientRole ? 'client' : 'agent'),
          author: isInternal ? 'Rahul Sharma' : (isClientRole ? `${ticket.clientName} (Client)` : `${ticket.assignedTo} (Support Rep)`),
          avatar: isClientRole ? 'CL' : 'RS',
          time: 'Just now',
          text: text || '(Attachment sent)',
          attachments: currentAttachment ? [currentAttachment] : undefined
        };

        ticket.messages.push(newMsg);

        // Play sent sound
        playHelpdeskSound('message');

        // Reset composer & attachments
        if (wsReplyText) wsReplyText.value = '';
        currentAttachment = null;
        if (wsComposerAttWrap) wsComposerAttWrap.style.display = 'none';

        // Update ticket status
        if (isClientRole) {
          if (ticket.status === 'Waiting on Client' || ticket.status === 'Resolved') ticket.status = 'In Progress';
        } else if (!isInternal) {
          if (ticket.status === 'Open' || ticket.status === 'In Progress') ticket.status = 'Waiting on Client';
        }

        renderWorkspaceMessages(ticket);
        renderTeamTickets();
        renderClientTickets();
        if (hdState.teamViewMode === 'kanban') renderKanbanBoard();

        showToast(isInternal ? '🔒 Private internal note saved.' : '🚀 Reply sent successfully!');

        // TRIGGER SIMULATED LIVE AUTO-REPLY IF NOT INTERNAL NOTE
        if (!isInternal) {
          const msgContainer = document.getElementById('ws-messages-container');
          const responderName = isClientRole ? (ticket.assignedTo === 'Unassigned' ? 'Rahul Sharma (API Specialist)' : ticket.assignedTo) : ticket.clientName;
          const responderAvatar = isClientRole ? 'RS' : 'TN';

          // Show typing indicator
          if (msgContainer) {
            const typingEl = document.createElement('div');
            typingEl.className = 'hd-typing-wrap';
            typingEl.id = 'ws-typing-indicator';
            typingEl.innerHTML = `
              <div class="hd-agent-avatar" style="width: 26px; height: 26px; font-size: 11px;">${responderAvatar}</div>
              <div class="hd-typing-dots">
                <span class="hd-typing-dot"></span>
                <span class="hd-typing-dot"></span>
                <span class="hd-typing-dot"></span>
              </div>
              <span class="hd-typing-label">${responderName} is typing a reply...</span>
            `;
            msgContainer.appendChild(typingEl);
            msgContainer.scrollTop = msgContainer.scrollHeight;
          }

          // Delay for realistic typing
          const delayMs = isClientRole ? 2200 : 3200;
          setTimeout(() => {
            // Remove typing indicator
            const typingEl = document.getElementById('ws-typing-indicator');
            if (typingEl) typingEl.remove();

            const replyContent = getSmartAutoReply(ticket, text, isClientRole);

            const autoReplyMsg = {
              id: `msg-${ticket.messages.length + 1}`,
              sender: isClientRole ? 'agent' : 'client',
              author: isClientRole ? `${ticket.assignedTo} (Support Specialist)` : `${ticket.clientName} (Client)`,
              avatar: responderAvatar,
              time: 'Just now',
              text: replyContent
            };

            ticket.messages.push(autoReplyMsg);

            if (isClientRole) {
              ticket.status = 'Waiting on Client';
            } else {
              ticket.status = 'In Progress';
            }

            // Re-render chat
            renderWorkspaceMessages(ticket);
            renderTeamTickets();
            renderClientTickets();
            if (hdState.teamViewMode === 'kanban') renderKanbanBoard();

            // TRIGGER AUDIO CHIME & FLOATING NOTIFICATION BANNER!
            showHelpdeskNotification({
              title: isClientRole ? 'New Support Reply' : 'New Client Reply',
              sender: responderName,
              text: replyContent,
              ticketId: ticket.id,
              type: 'message'
            });
          }, delayMs);
        }
      }

      if (wsBtnSend) wsBtnSend.addEventListener('click', handleSendMessage);

      // Enter key shortcut in composer (Enter to send, Shift+Enter for newline)
      if (wsReplyText) {
        wsReplyText.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        });
      }

      // Mark Resolved Handler
      if (wsBtnMarkResolved) {
        wsBtnMarkResolved.addEventListener('click', () => {
          const ticket = helpdeskTicketsData.find(t => t.id === hdState.activeTicketId);
          if (!ticket) return;

          ticket.status = 'Resolved';
          if (wsStatusSelect) wsStatusSelect.value = 'Resolved';
          playHelpdeskSound('success');
          showHelpdeskNotification({
            title: 'Ticket Resolved',
            sender: 'Resolution Bot',
            text: `Ticket #${ticket.id} marked as resolved! Satisfaction rating survey unlocked.`,
            ticketId: ticket.id,
            type: 'success'
          });

          renderWorkspaceMessages(ticket);
          renderTeamTickets();
          renderClientTickets();
          if (hdState.teamViewMode === 'kanban') renderKanbanBoard();

          const csatWrap = document.getElementById('ws-csat-container');
          if (csatWrap && hdState.role === 'client') {
            csatWrap.style.display = 'block';
          }
        });
      }

      // CSAT Stars Click Handler
      let currentCsatRating = 5;
      const wsCsatStars = document.querySelectorAll('#ws-csat-stars .hd-csat-star');
      const wsCsatLabel = document.getElementById('ws-csat-label');
      const csatComments = {
        '1': '1 - Disappointed (Needs serious improvement)',
        '2': '2 - Below expectations',
        '3': '3 - Average resolution',
        '4': '4 - Great support & fast turnaround!',
        '5': '5 - Superb! Five-star experience.'
      };

      wsCsatStars.forEach(star => {
        star.addEventListener('click', () => {
          const r = parseInt(star.getAttribute('data-rating') || '5', 10);
          currentCsatRating = r;
          wsCsatStars.forEach(s => {
            const val = parseInt(s.getAttribute('data-rating') || '0', 10);
            if (val <= r) s.classList.add('active');
            else s.classList.remove('active');
          });
          if (wsCsatLabel) wsCsatLabel.textContent = csatComments[r] || `${r} Stars`;
        });
      });

      // CSAT Review Submit Handler
      if (wsBtnSubmitCsat) {
        wsBtnSubmitCsat.addEventListener('click', () => {
          const ticket = helpdeskTicketsData.find(t => t.id === hdState.activeTicketId);
          if (!ticket) return;

          const comment = wsCsatReviewInp ? wsCsatReviewInp.value.trim() : '';
          ticket.csat = currentCsatRating;
          ticket.csatComment = comment || 'Excellent support service!';

          playHelpdeskSound('success');
          showHelpdeskNotification({
            title: 'CSAT Rating Submitted',
            sender: 'Customer Feedback',
            text: `Client gave ${currentCsatRating}-Star rating on #${ticket.id}! "${ticket.csatComment}"`,
            ticketId: ticket.id,
            type: 'success'
          });

          const csatWrap = document.getElementById('ws-csat-container');
          if (csatWrap) {
            csatWrap.innerHTML = `
              <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 12px; text-align: center; color: #065f46;">
                <div style="font-weight: 700; font-size: 13.5px;">✓ Thank you! Rating of ${currentCsatRating} Stars Saved.</div>
                <div style="font-size: 11.5px; margin-top: 2px;">Your feedback helps us continuously improve our API and support response times.</div>
              </div>
            `;
          }

          // Recalculate and update team CSAT
          updateKPICounters();
        });
      }

      // Workspace Status Change
      if (wsStatusSelect) {
        wsStatusSelect.addEventListener('change', () => {
          const ticket = helpdeskTicketsData.find(t => t.id === hdState.activeTicketId);
          if (!ticket) return;
          ticket.status = wsStatusSelect.value;
          playHelpdeskSound(ticket.status === 'Resolved' ? 'success' : 'message');
          showToast(`Ticket status updated to "${ticket.status}"`);
          renderTeamTickets();
          renderClientTickets();
          if (hdState.teamViewMode === 'kanban') renderKanbanBoard();
        });
      }

      // Workspace Assignee Change
      if (wsAssigneeSelect) {
        wsAssigneeSelect.addEventListener('change', () => {
          const ticket = helpdeskTicketsData.find(t => t.id === hdState.activeTicketId);
          if (!ticket) return;
          ticket.assignedTo = wsAssigneeSelect.value;
          ticket.avatar = ticket.assignedTo === 'Unassigned' ? 'UN' : ticket.assignedTo.split(' ').map(n => n[0]).join('');
          playHelpdeskSound('message');
          showToast(`Assigned specialist changed to ${ticket.assignedTo}`);
          renderTeamTickets();
          if (hdState.teamViewMode === 'kanban') renderKanbanBoard();
        });
      }

      // Workspace Priority Change
      if (wsPrioritySelect) {
        wsPrioritySelect.addEventListener('change', () => {
          const ticket = helpdeskTicketsData.find(t => t.id === hdState.activeTicketId);
          if (!ticket) return;
          ticket.priority = wsPrioritySelect.value;
          ticket.slaTargetMins = ticket.priority === 'Urgent' ? 60 : (ticket.priority === 'High' ? 120 : 240);
          const wsPriority = document.getElementById('ws-ticket-priority');
          if (wsPriority) {
            wsPriority.className = `hd-prio-chip ${ticket.priority.toLowerCase()}`;
            wsPriority.textContent = ticket.priority === 'Urgent' ? 'Urgent 🚨' : ticket.priority;
          }
          playHelpdeskSound(ticket.priority === 'Urgent' ? 'alert' : 'message');
          showToast(`Priority updated to ${ticket.priority} (${ticket.slaTargetMins / 60}h SLA)`);
          renderTeamTickets();
          if (hdState.teamViewMode === 'kanban') renderKanbanBoard();
        });
      }

      // Quick WhatsApp client button in workspace
      const wsBtnWaClient = document.getElementById('ws-btn-wa-client');
      if (wsBtnWaClient) {
        wsBtnWaClient.addEventListener('click', () => {
          const ticket = helpdeskTicketsData.find(t => t.id === hdState.activeTicketId);
          if (ticket) {
            const phone = ticket.clientPhone.replace(/[^0-9]/g, '');
            const msg = encodeURIComponent(`Hello ${ticket.clientName}, Simplefloww Support is following up on your ticket ${ticket.id}: "${ticket.subject}".`);
            window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
          }
        });
      }

      // Escalate to Tier-2 Engineering
      const wsBtnEscalate = document.getElementById('ws-btn-escalate');
      if (wsBtnEscalate) {
        wsBtnEscalate.addEventListener('click', () => {
          const ticket = helpdeskTicketsData.find(t => t.id === hdState.activeTicketId);
          if (ticket) {
            ticket.priority = 'Urgent';
            ticket.messages.push({
              id: `msg-${ticket.messages.length + 1}`,
              sender: 'internal',
              author: 'Rahul Sharma',
              avatar: 'RS',
              time: 'Just now',
              text: '🛡️ [SYSTEM ESCALATION]: Ticket escalated to Tier-2 Cloud Infrastructure Engineering. Priority set to Urgent with expedited 30-min SLA timer.'
            });
            playHelpdeskSound('alert');
            showHelpdeskNotification({
              title: 'Incident Escalated',
              sender: 'Engineering Tier-2',
              text: `Ticket #${ticket.id} escalated to Cloud Infrastructure Engineering!`,
              ticketId: ticket.id,
              type: 'alert'
            });
            renderWorkspaceMessages(ticket);
            renderTeamTickets();
            if (hdState.teamViewMode === 'kanban') renderKanbanBoard();
          }
        });
      }

      // 11. Modal: Raise New Ticket
      const btnRaiseTop = document.getElementById('btn-raise-ticket-top');
      const btnRaiseClient = document.getElementById('btn-raise-ticket-client');
      const modalRaiseTicket = document.getElementById('modal-raise-ticket');
      const modalCloseRaiseTicket = document.getElementById('modal-close-raise-ticket');
      const modalCancelRaiseTicket = document.getElementById('modal-cancel-raise-ticket');
      const formRaiseTicket = document.getElementById('form-raise-ticket');
      const priorityPills = document.querySelectorAll('#nt-priority-options .hd-pill-btn');
      const priorityValInp = document.getElementById('nt-priority-val');

      function openRaiseTicketModal() {
        const modal = document.getElementById('modal-raise-ticket');
        if (modal) {
          modal.style.setProperty('display', 'flex', 'important');
          modal.classList.add('open', 'active', 'show');
        }
      }

      function closeRaiseTicketModal() {
        const modal = document.getElementById('modal-raise-ticket');
        if (modal) {
          modal.style.setProperty('display', 'none', 'important');
          modal.classList.remove('open', 'active', 'show');
        }
        if (formRaiseTicket) formRaiseTicket.reset();
        const attachedName = document.getElementById('nt-attached-filename');
        if (attachedName) attachedName.style.display = 'none';
      }

      if (btnRaiseTop) btnRaiseTop.addEventListener('click', openRaiseTicketModal);
      if (btnRaiseClient) btnRaiseClient.addEventListener('click', openRaiseTicketModal);
      if (modalCloseRaiseTicket) modalCloseRaiseTicket.addEventListener('click', closeRaiseTicketModal);
      if (modalCancelRaiseTicket) modalCancelRaiseTicket.addEventListener('click', closeRaiseTicketModal);
      if (modalRaiseTicket) {
        modalRaiseTicket.addEventListener('click', (e) => {
          if (e.target === modalRaiseTicket) {
            closeRaiseTicketModal();
          }
        });
      }

      // Priority pill selector in Raise Ticket modal
      priorityPills.forEach(pill => {
        pill.addEventListener('click', () => {
          priorityPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const prio = pill.getAttribute('data-priority') || 'High';
          if (priorityValInp) priorityValInp.value = prio;
        });
      });

      // Mock Dropzone in Raise Ticket
      const ntDropzone = document.getElementById('nt-dropzone');
      const ntAttachedName = document.getElementById('nt-attached-filename');
      if (ntDropzone) {
        ntDropzone.addEventListener('click', () => {
          if (ntAttachedName) {
            ntAttachedName.style.display = 'block';
            ntAttachedName.textContent = '✓ Attachment ready: error_screenshot_log.png (1.2 MB)';
          }
        });
      }

      // Form submit: Raise ticket
      if (formRaiseTicket) {
        formRaiseTicket.addEventListener('submit', (e) => {
          e.preventDefault();
          const category = document.getElementById('nt-category')?.value || 'WhatsApp Cloud API';
          const subject = document.getElementById('nt-subject')?.value || 'Issue Report';
          const priority = priorityValInp ? priorityValInp.value : 'High';
          const description = document.getElementById('nt-description')?.value || '';

          const newIdNumber = 1086 + helpdeskTicketsData.length - 6;
          const newTicketId = `TK-${newIdNumber}`;

          let catIcon = '📱';
          if (category.includes('Broadcast')) catIcon = '📢';
          else if (category.includes('Chatbot')) catIcon = '🤖';
          else if (category.includes('Billing')) catIcon = '💳';
          else if (category.includes('Auto Assign')) catIcon = '👥';

          const newTicket = {
            id: newTicketId,
            subject: subject,
            clientName: 'TechNova Solutions',
            clientEmail: 'contact@technova.in',
            clientPhone: '+91 98201 44521',
            clientTier: 'Enterprise Pro Plan',
            category: category,
            categoryIcon: catIcon,
            priority: priority,
            status: 'Open',
            assignedTo: 'Unassigned',
            avatar: 'UN',
            createdAt: 'Just now',
            createdTimestamp: Date.now(),
            slaTargetMins: priority === 'Urgent' ? 60 : (priority === 'High' ? 120 : 240),
            slaRemainingMins: priority === 'Urgent' ? 60 : (priority === 'High' ? 120 : 240),
            slaStatus: 'ok',
            clientVisible: true,
            messages: [
              {
                id: 'msg-1',
                sender: 'client',
                author: 'TechNova Solutions',
                avatar: 'TN',
                time: 'Just now',
                text: description,
                attachments: ntAttachedName && ntAttachedName.style.display !== 'none' ? ['error_screenshot_log.png (1.2 MB)'] : undefined
              }
            ]
          };

          helpdeskTicketsData.unshift(newTicket);
          closeRaiseTicketModal();

          playHelpdeskSound('alert');
          showHelpdeskNotification({
            title: 'New Ticket Raised',
            sender: 'TechNova Solutions',
            text: `New ${priority} Priority Ticket #${newTicketId}: "${subject}"`,
            ticketId: newTicketId,
            type: priority === 'Urgent' ? 'alert' : 'message'
          });

          renderTeamTickets();
          renderClientTickets();
          if (hdState.teamViewMode === 'kanban') renderKanbanBoard();
          openTicketWorkspace(newTicketId);
        });
      }

      // 12. REAL-TIME SLA TICKER & WARNING SYSTEM (Runs every 30s)
      setInterval(() => {
        let changed = false;
        helpdeskTicketsData.forEach(t => {
          if (t.status !== 'Resolved' && t.slaRemainingMins > 0) {
            t.slaRemainingMins -= 1;
            changed = true;
            if (t.slaRemainingMins === 30) {
              // Trigger SLA warning notification & sound!
              showHelpdeskNotification({
                title: 'SLA Breach Warning',
                sender: 'SLA Guard Engine',
                text: `Ticket #${t.id} has reached 30 mins to breach! Escalate immediately.`,
                ticketId: t.id,
                type: 'alert'
              });
            }
          }
        });
        if (changed) {
          renderTeamTickets();
          renderClientTickets();
          if (hdState.teamViewMode === 'kanban') renderKanbanBoard();

          // If active ticket is open, update SLA timer
          if (hdState.activeTicketId) {
            const ticket = helpdeskTicketsData.find(t => t.id === hdState.activeTicketId);
            if (ticket) {
              const wsSlaBadge = document.getElementById('ws-sla-badge');
              const wsSlaProgress = document.getElementById('ws-sla-progress');
              if (wsSlaBadge) {
                wsSlaBadge.textContent = ticket.status === 'Resolved' ? '✓ Resolved' : `${ticket.slaRemainingMins}m remaining`;
                wsSlaBadge.className = `hd-sla-badge ${ticket.status === 'Resolved' ? 'ok' : (ticket.slaRemainingMins <= 30 ? 'warning' : 'ok')}`;
              }
              if (wsSlaProgress) {
                const pct = Math.max(10, Math.min(100, Math.round((ticket.slaRemainingMins / ticket.slaTargetMins) * 100)));
                wsSlaProgress.style.width = `${pct}%`;
              }
            }
          }
        }
      }, 30000);

      // Initial Render
      renderTeamTickets();
      renderClientTickets();
      setRole('client');

      // Export methods to window for 100% click reliability
      window.openRaiseTicketModal = openRaiseTicketModal;
      window.closeRaiseTicketModal = closeRaiseTicketModal;
      window.openTicketWorkspace = openTicketWorkspace;
      window.closeTicketWorkspace = closeTicketWorkspace;
      window.switchHelpdeskMainTab = switchMainTab;
      window.switchHelpdeskRole = setRole;
      window.setHelpdeskViewMode = setTeamViewMode;
      window.setHelpdeskComposerMode = setComposerMode;
      window.handleHelpdeskSendMessage = handleSendMessage;
      window.handleHelpdeskMarkResolved = () => {
        if (wsBtnMarkResolved) wsBtnMarkResolved.click();
      };
      window.renderHelpDeskAll = () => {
        renderTeamTickets();
        renderClientTickets();
        if (hdState.teamViewMode === 'kanban') renderKanbanBoard();
      };
    }

    initHelpDeskTicketing();

    window.openSupportWhatsApp = openSupportWhatsApp;
    window.openFeatureRequestModal = openFeatureRequestModal;
    window.openFeedbackModal = openFeedbackModal;
  }

  // ==========================================================================
  // MODULE: REFER & EARN (Partner Dashboard & Reseller Control Panel)
  // ==========================================================================
  function initReferAndEarnHub() {
    const refState = {
      activeView: 'partner', // 'partner' or 'reseller'
      activeTableTab: 'clients', // 'clients', 'payouts', 'tiers'

      // Master Reseller Configuration (Mutually Exclusive: Pure 20% Recurring OR Pure Flat ₹500 Bounty)
      config: {
        activeModel: 'recurring', // 'recurring' | 'flat' (Mutually exclusive: only one applies!)
        recurringPercent: 20,
        flatBountyAmount: 500,
        minPayoutThreshold: 1000,
        welcomeBonus: 'discount' // 'discount' | 'credits' | 'extended-trial'
      },

      // Logged-in Partner Profile
      partner: {
        id: 'PARTNER-9082',
        name: 'Abhinandan Kumar',
        email: 'abhinandan@simplefloww.com',
        code: 'ak9082',
        chosenReward: 'recurring', // 'recurring' | 'flat'
        baseLink: 'https://connect.simplefloww.com/ref/ak9082',
        link: 'https://connect.simplefloww.com/ref/ak9082?reward=recurring',
        tier: 'Gold VIP (20%)',
        walletBalance: 3250.00,
        totalEarned: 18500.00,
        pendingClearance: 1000.00,
        totalClicks: 142
      },

      // Referred Clients with Full Funnel Tracking & 7-Day Refund Clearance Life-cycle
      referredClients: [
        {
          id: 'REF-101',
          name: 'Zenith Tech Solutions',
          contact: 'Karan Mehra',
          signupDate: '20 Sep 2026, 10:15 AM',
          stage: 'credited', // 'signup' | 'paid' | 'credited'
          plan: 'Enterprise CRM Annual',
          planValue: 24000,
          planDate: '21 Sep 2026, 03:00 PM',
          daysSincePlan: 11, // > 7 days => fully cleared!
          clearanceDate: '28 Sep 2026',
          commissionMode: 'recurring',
          recurringEarning: 4800,
          flatEarning: 500,
          status: 'Wallet Credited'
        },
        {
          id: 'REF-102',
          name: 'NextGen Marketing Agency',
          contact: 'Sneha Rao',
          signupDate: '28 Sep 2026, 09:20 AM',
          stage: 'paid', // in 7-day refund window
          plan: 'Growth Pro Monthly',
          planValue: 4999,
          planDate: '29 Sep 2026, 05:40 PM',
          daysSincePlan: 3, // 3 days since purchase, 4 days remaining in 7-day refund window!
          clearanceDate: '06 Oct 2026',
          commissionMode: 'recurring',
          recurringEarning: 1000,
          flatEarning: 500,
          status: 'In 7d Refund Window'
        },
        {
          id: 'REF-103',
          name: 'Apex Logistics Pvt Ltd',
          contact: 'Vikram Joshi',
          signupDate: '30 Sep 2026, 11:00 AM',
          stage: 'signup', // account created, plan purchase pending
          plan: 'Pending Purchase',
          planValue: 0,
          planDate: null,
          daysSincePlan: 0,
          clearanceDate: null,
          commissionMode: 'recurring',
          recurringEarning: 0,
          flatEarning: 0,
          status: 'Account Created'
        },
        {
          id: 'REF-104',
          name: 'FitPulse Wellness Club',
          contact: 'Ananya Deshmukh',
          signupDate: '01 Oct 2026, 04:30 PM',
          stage: 'signup', // only account created
          plan: 'None',
          planValue: 0,
          planDate: null,
          daysSincePlan: 0,
          clearanceDate: null,
          commissionMode: 'recurring',
          recurringEarning: 0,
          flatEarning: 0,
          status: 'Account Created'
        },
        {
          id: 'REF-105',
          name: 'Global Exim Corp',
          contact: 'Manish Chawla',
          signupDate: '12 Aug 2026, 10:00 AM',
          stage: 'credited',
          plan: 'Growth Pro Annual',
          planValue: 25000,
          planDate: '13 Aug 2026, 04:15 PM',
          daysSincePlan: 50,
          clearanceDate: '20 Aug 2026',
          commissionMode: 'recurring',
          recurringEarning: 5000,
          flatEarning: 500,
          status: 'Wallet Credited'
        }
      ],

      // Payout Requests (Managed by Reseller Desk)
      payoutRequests: [
        {
          id: 'PAY-9041',
          partnerName: 'Abhinandan Kumar',
          partnerEmail: 'abhinandan@simplefloww.com',
          date: '01 Oct 2026',
          amount: 4500,
          mode: 'UPI',
          details: 'abhinandan@okhdfcbank',
          status: 'Pending',
          utr: '-'
        },
        {
          id: 'PAY-8820',
          partnerName: 'Rahul Verma (Growth Partner)',
          partnerEmail: 'rahul.verma@growthpartners.in',
          date: '25 Sep 2026',
          amount: 8000,
          mode: 'Bank IMPS',
          details: 'A/C: 98127391823, HDFC000124',
          status: 'Paid',
          utr: 'CMS98217349182'
        },
        {
          id: 'PAY-8750',
          partnerName: 'Priya Sharma (Agency)',
          partnerEmail: 'priya@socialscale.in',
          date: '18 Sep 2026',
          amount: 3200,
          mode: 'UPI',
          details: 'priya@paytm',
          status: 'Paid',
          utr: 'UPI9823104928'
        }
      ],

      // All Registered Affiliates in Reseller Roster across the 3 Partnership Tracks
      partnersRoster: [
        {
          name: 'Abhinandan Kumar',
          email: 'abhinandan@simplefloww.com',
          phone: '+91 98201 44550',
          programTrack: 'Affiliate', // 'Affiliate' | 'Advisor' | 'Whitelabel'
          chosenModel: '20% Recurring',
          clicks: 142,
          referrals: 5,
          rate: '38.4%',
          lifetime: 18500,
          balance: 3250,
          status: 'Active'
        },
        {
          name: 'Rahul Verma',
          email: 'rahul.verma@growthpartners.in',
          phone: '+91 98112 88410',
          programTrack: 'Certified Advisor',
          chosenModel: '50% Commission (Advisor)',
          clicks: 310,
          referrals: 12,
          rate: '41.2%',
          lifetime: 42000,
          balance: 1200,
          status: 'Certified'
        },
        {
          name: 'Priya Sharma (SocialScale Agency)',
          email: 'priya@socialscale.in',
          phone: '+91 97654 11200',
          programTrack: 'Whitelabel Partner',
          chosenModel: '100% Brand Margin',
          clicks: 88,
          referrals: 4,
          rate: '32.1%',
          lifetime: 36000,
          balance: 850,
          status: 'Live WL'
        },
        {
          name: 'Devansh Oberoi',
          email: 'dev@saasrocket.io',
          phone: '+91 98450 33910',
          programTrack: 'Affiliate',
          chosenModel: 'Flat ₹500 Bounty',
          clicks: 34,
          referrals: 1,
          rate: '18.5%',
          lifetime: 500,
          balance: 0,
          status: 'Active'
        }
      ]
    };

    // Helper: Toast Notification
    function showRefToast(msg, isSuccess = true) {
      const container = document.getElementById('hd-notification-toast-container');
      if (!container) {
        alert(msg);
        return;
      }
      const toast = document.createElement('div');
      toast.className = 'hd-toast-card';
      toast.style.borderColor = isSuccess ? '#bbf7d0' : '#fecaca';
      toast.style.background = isSuccess ? '#f0fdf4' : '#fef2f2';
      toast.innerHTML = `
        <div style="font-size: 16px;">${isSuccess ? '✅' : '⚠️'}</div>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 13px; color: ${isSuccess ? '#15803d' : '#b91c1c'};">${msg}</div>
        </div>
      `;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    // Helper: Calculate Tier based on paid clients count
    function calculateAffiliateTier(paidCount) {
      if (paidCount >= 6) {
        return {
          tierName: 'Gold VIP (20%)',
          tierRate: 20,
          currentStep: 'gold',
          summaryText: `You have <strong>${paidCount} paid clients</strong>. You have unlocked the highest <strong>20% Recurring Gold VIP</strong> rate!`,
          nextTarget: 'Max Tier Unlocked: 20% Recurring Royalty 🏆',
          progressPercent: 100
        };
      } else if (paidCount >= 3) {
        const remaining = 6 - paidCount;
        return {
          tierName: 'Silver Tier (15%)',
          tierRate: 15,
          currentStep: 'silver',
          summaryText: `You have <strong>${paidCount} paid clients</strong>. Your active commission rate is <strong>15% Recurring</strong>!`,
          nextTarget: `Next: Refer ${remaining} more client${remaining > 1 ? 's' : ''} for 20% Gold VIP ➔`,
          progressPercent: Math.round((paidCount / 6) * 100)
        };
      } else {
        const remaining = 3 - paidCount;
        return {
          tierName: 'Bronze Tier (10%)',
          tierRate: 10,
          currentStep: 'bronze',
          summaryText: `You have <strong>${paidCount} paid client${paidCount === 1 ? '' : 's'}</strong>. Active commission rate is <strong>10% Recurring</strong>.`,
          nextTarget: `Next: Refer ${remaining} more client${remaining > 1 ? 's' : ''} to unlock 15% Silver ➔`,
          progressPercent: Math.round((paidCount / 6) * 100)
        };
      }
    }

    // 1. Update Partner Dynamic Hero Banner and Math based on Reseller Active Model & Tiers
    function updatePartnerHeroAndStats() {
      const m = refState.config.activeModel;
      const chip = document.getElementById('ref-active-model-chip');
      const title = document.getElementById('ref-hero-title');
      const sub = document.getElementById('ref-hero-sub');
      const tierVal = document.getElementById('ref-stat-tier');
      const tierSub = document.getElementById('ref-stat-tier-sub');
      const headerTag = document.getElementById('ref-header-active-model-tag');

      // Count paid referral clients
      const paidClients = refState.referredClients.filter(c => c.stage === 'paid' || c.stage === 'credited');
      const paidCount = paidClients.length;
      const tierInfo = calculateAffiliateTier(paidCount);

      // Synchronize partner state tier
      refState.partner.activeTierRate = tierInfo.tierRate;
      refState.partner.tier = tierInfo.tierName;

      // Update Affiliate Milestone Card UI
      const summaryTextEl = document.getElementById('ref-tier-summary-text');
      if (summaryTextEl) summaryTextEl.innerHTML = tierInfo.summaryText;

      const nextTargetEl = document.getElementById('ref-tier-next-target');
      if (nextTargetEl) nextTargetEl.textContent = tierInfo.nextTarget;

      const fillEl = document.getElementById('ref-tier-fill');
      if (fillEl) fillEl.style.width = `${tierInfo.progressPercent}%`;

      const boxBronze = document.getElementById('tier-box-bronze');
      const boxSilver = document.getElementById('tier-box-silver');
      const boxGold = document.getElementById('tier-box-gold');

      if (boxBronze && boxSilver && boxGold) {
        // Reset classes
        boxBronze.className = 'ref-tier-step-box';
        boxSilver.className = 'ref-tier-step-box';
        boxGold.className = 'ref-tier-step-box';

        if (tierInfo.currentStep === 'gold') {
          boxBronze.className = 'ref-tier-step-box unlocked';
          boxSilver.className = 'ref-tier-step-box unlocked';
          boxGold.className = 'ref-tier-step-box current';
        } else if (tierInfo.currentStep === 'silver') {
          boxBronze.className = 'ref-tier-step-box unlocked';
          boxSilver.className = 'ref-tier-step-box current';
        } else {
          boxBronze.className = 'ref-tier-step-box current';
        }
      }

      if (refState.partner.chosenReward === 'recurring') {
        const rate = tierInfo.tierRate;
        if (chip) chip.textContent = `${rate}% Recurring (${tierInfo.currentStep.toUpperCase()})`;
        if (title) title.textContent = `Your Referral Link`;
        if (sub) sub.textContent = `Clients receive a 10% welcome discount. ${rate}% recurring royalty credits after 7-day refund clearance.`;
        if (tierVal) tierVal.textContent = tierInfo.tierName;
        if (tierSub) tierSub.textContent = tierInfo.nextTarget.replace('Next: ', '');
        if (headerTag) headerTag.textContent = `${rate}% Recurring`;
      } else {
        const flat = refState.config.flatBountyAmount;
        if (chip) chip.textContent = `Flat ₹${flat.toLocaleString('en-IN')} Bounty`;
        if (title) title.textContent = `Your Referral Link`;
        if (sub) sub.textContent = `Earn pure ₹${flat.toLocaleString('en-IN')} cash bounty once per paid signup (no recurring). Credits after 7-day refund clearance.`;
        if (tierVal) tierVal.textContent = `Flat Bounty (₹${flat.toLocaleString('en-IN')})`;
        if (tierSub) tierSub.textContent = `One-time cash bounty active`;
        if (headerTag) headerTag.textContent = `₹${flat.toLocaleString('en-IN')} Bounty`;
      }

      // Update wallet balance values in DOM
      const walletEl = document.getElementById('ref-stat-wallet');
      if (walletEl) walletEl.textContent = `₹${refState.partner.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

      const modalWallet = document.getElementById('payout-modal-wallet-val');
      if (modalWallet) modalWallet.textContent = `₹${refState.partner.walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

      const minHint = document.getElementById('payout-min-hint');
      if (minHint) minHint.textContent = `Minimum withdrawal: ₹${refState.config.minPayoutThreshold.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

      const amtInput = document.getElementById('payout-amount-input');
      if (amtInput) {
        amtInput.min = refState.config.minPayoutThreshold;
        amtInput.max = refState.partner.walletBalance;
      }
    }

    // 2. Switch Between Partner View and Reseller Admin Controls
    function switchReferralView(view) {
      refState.activeView = view;
      const partnerView = document.getElementById('ref-partner-view');
      const resellerView = document.getElementById('ref-reseller-view');
      const tabPartner = document.getElementById('tab-ref-sub-partner');
      const tabReseller = document.getElementById('tab-ref-sub-reseller');
      const btnPartner = document.getElementById('btn-ref-switch-partner');
      const btnReseller = document.getElementById('btn-ref-switch-reseller');

      if (view === 'reseller') {
        if (partnerView) partnerView.style.display = 'none';
        if (resellerView) resellerView.style.display = 'block';
        if (tabPartner) tabPartner.classList.remove('active');
        if (tabReseller) tabReseller.classList.add('active');
        if (btnPartner) btnPartner.classList.remove('active');
        if (btnReseller) btnReseller.classList.add('active');
        renderResellerPayouts();
        renderResellerPartners();
      } else {
        if (partnerView) partnerView.style.display = 'block';
        if (resellerView) resellerView.style.display = 'none';
        if (tabPartner) tabPartner.classList.add('active');
        if (tabReseller) tabReseller.classList.remove('active');
        if (btnPartner) btnPartner.classList.add('active');
        if (btnReseller) btnReseller.classList.remove('active');
        renderPartnerClients();
        renderPartnerPayouts();
      }
    }

    // 3. Switch Table Tabs in Partner View
    function switchPartnerTableTab(tab) {
      refState.activeTableTab = tab;
      const btnClients = document.getElementById('tab-ref-clients');
      const btnPayouts = document.getElementById('tab-ref-payouts');
      const btnTiers = document.getElementById('tab-ref-tiers');
      const btnCalc = document.getElementById('tab-ref-calc');

      const panelClients = document.getElementById('panel-ref-clients');
      const panelPayouts = document.getElementById('panel-ref-payouts');
      const panelTiers = document.getElementById('panel-ref-tiers');
      const panelCalc = document.getElementById('panel-ref-calc');
      const searchWrap = document.getElementById('ref-client-search-wrapper');

      if (btnClients) btnClients.classList.toggle('active', tab === 'clients');
      if (btnPayouts) btnPayouts.classList.toggle('active', tab === 'payouts');
      if (btnTiers) btnTiers.classList.toggle('active', tab === 'tiers');
      if (btnCalc) btnCalc.classList.toggle('active', tab === 'calc');

      if (panelClients) panelClients.style.display = tab === 'clients' ? 'block' : 'none';
      if (panelPayouts) panelPayouts.style.display = tab === 'payouts' ? 'block' : 'none';
      if (panelTiers) panelTiers.style.display = tab === 'tiers' ? 'block' : 'none';
      if (panelCalc) {
        panelCalc.style.display = tab === 'calc' ? 'block' : 'none';
        if (tab === 'calc') updateCalcMath();
      }
      if (searchWrap) searchWrap.style.display = tab === 'clients' ? 'flex' : 'none';
    }

    // Partner Reward Choice (20% Recurring vs Flat Bounty)
    function setPartnerRewardChoice(choice) {
      refState.partner.chosenReward = choice;
      const btnRec = document.getElementById('btn-choice-recurring');
      const btnFlat = document.getElementById('btn-choice-flat');
      const chip = document.getElementById('ref-active-model-chip');
      const explain = document.getElementById('ref-choice-explain');
      const linkText = document.getElementById('ref-link-text');

      if (btnRec) btnRec.classList.toggle('active', choice === 'recurring');
      if (btnFlat) btnFlat.classList.toggle('active', choice === 'flat');

      if (choice === 'recurring') {
        refState.partner.link = `${refState.partner.baseLink}?reward=recurring`;
        if (chip) chip.textContent = `${refState.config.recurringPercent}% Recurring`;
        if (explain) explain.textContent = `Earn ${refState.config.recurringPercent}% recurring monthly royalty on renewals, auto-credited after 7-day refund clearance.`;
      } else {
        refState.partner.link = `${refState.partner.baseLink}?reward=flat`;
        if (chip) chip.textContent = `Flat ₹${refState.config.flatBountyAmount.toLocaleString('en-IN')} Bounty`;
        if (explain) explain.textContent = `Earn flat ₹${refState.config.flatBountyAmount.toLocaleString('en-IN')} one-time bounty per plan, auto-credited after 7-day refund clearance.`;
      }

      if (linkText) linkText.textContent = refState.partner.link;
      renderPartnerClients();
      showRefToast(`Commission model updated to ${choice === 'recurring' ? '20% Recurring' : 'Flat Bounty'}!`);
    }

    // 4. Render Partner Referred Clients Table with Full Funnel & 7-Day Refund Clearance
    function renderPartnerClients(searchQuery = '') {
      const tbody = document.getElementById('ref-clients-tbody');
      if (!tbody) return;

      const q = searchQuery.toLowerCase().trim();
      const filtered = refState.referredClients.filter(c => {
        if (!q) return true;
        return c.name.toLowerCase().includes(q) || c.plan.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q) || (c.status && c.status.toLowerCase().includes(q));
      });

      const badgeCnt = document.getElementById('badge-ref-clients-cnt');
      if (badgeCnt) badgeCnt.textContent = refState.referredClients.length;

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 32px 14px; color: #64748b;">
              <div style="font-size: 24px; margin-bottom: 6px;">🔍</div>
              <div style="font-weight: 600; color: #0f172a;">No referred clients match your search</div>
            </td>
          </tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(c => {
        // Calculate commission using tiered progression rate
        let earnVal = 0;
        let commLabel = '';
        const mode = c.commissionMode || refState.partner.chosenReward || 'recurring';
        const tierRate = refState.partner.activeTierRate || 15;

        if (mode === 'recurring') {
          earnVal = c.planValue > 0 ? Math.round((c.planValue * tierRate) / 100) : 0;
          commLabel = `${tierRate}% Recurring (${refState.partner.tier ? refState.partner.tier.split(' ')[0] : 'Tier'})`;
        } else {
          earnVal = c.planValue > 0 ? refState.config.flatBountyAmount : 0;
          commLabel = `Flat ₹${refState.config.flatBountyAmount.toLocaleString('en-IN')}`;
        }

        // Funnel Stage Pill
        let stageBadge = '';
        if (c.stage === 'credited') {
          stageBadge = `<span class="status-chip resolved" style="font-size: 11px; padding: 3px 8px;">✓ Wallet Credited</span>`;
        } else if (c.stage === 'paid') {
          stageBadge = `<span class="status-chip waiting" style="font-size: 11px; padding: 3px 8px; background: #fef3c7; color: #92400e;">⚡ Plan Activated</span>`;
        } else {
          stageBadge = `<span class="status-chip" style="font-size: 11px; padding: 3px 8px; background: #f1f5f9; color: #475569;">👤 Account Created</span>`;
        }

        // 7-Day Refund Policy Clearance Status
        let clearanceHtml = '';
        if (c.stage === 'credited') {
          clearanceHtml = `
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #16a34a;"></span>
              <span style="font-weight: 700; color: #15803d; font-size: 12px;">Cleared & In Wallet</span>
            </div>
            <div style="font-size: 11px; color: #64748b;">Refund window ended (${c.clearanceDate || 'Cleared'})</div>
          `;
        } else if (c.stage === 'paid') {
          const daysLeft = Math.max(1, 7 - (c.daysSincePlan || 0));
          clearanceHtml = `
            <div style="display: flex; align-items: center; gap: 5px;">
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #f59e0b;"></span>
              <span style="font-weight: 700; color: #b45309; font-size: 12px;">⏳ ${daysLeft}d Refund Window</span>
            </div>
            <div style="font-size: 11px; color: #64748b;">Auto-credits on ${c.clearanceDate || 'in a few days'}</div>
          `;
        } else {
          clearanceHtml = `
            <div style="font-size: 11.5px; color: #94a3b8; font-weight: 500;">Awaiting Plan Purchase</div>
            <div style="font-size: 11px; color: #cbd5e1;">Signup completed</div>
          `;
        }

        // Plan & Paid Display
        let planHtml = '';
        if (c.planValue > 0) {
          planHtml = `
            <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${c.plan}</div>
            <div style="font-size: 11.5px; color: #16a34a; font-weight: 600;">Paid: ₹${c.planValue.toLocaleString('en-IN')}</div>
          `;
        } else {
          planHtml = `
            <div style="font-weight: 500; color: #94a3b8; font-size: 12.5px;">No Plan Selected</div>
            <div style="font-size: 11px; color: #cbd5e1;">₹0</div>
          `;
        }

        return `
          <tr>
            <td>
              <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${c.name}</div>
              <div style="font-size: 11px; color: #64748b;">${c.contact} • <span style="font-family: monospace; color: #2563eb;">${c.id}</span></div>
            </td>
            <td>
              ${stageBadge}
            </td>
            <td>
              ${planHtml}
            </td>
            <td>
              ${earnVal > 0 ? `
                <div style="font-weight: 700; color: #16a34a; font-size: 13.5px;">+₹${earnVal.toLocaleString('en-IN')}</div>
                <div style="font-size: 10.5px; color: #64748b;">${commLabel}</div>
              ` : `
                <div style="font-size: 12px; color: #94a3b8;">₹0.00</div>
                <div style="font-size: 10.5px; color: #cbd5e1;">Pending paid plan</div>
              `}
            </td>
            <td>
              ${clearanceHtml}
            </td>
            <td style="text-align: right;">
              <button type="button" class="btn-secondary hd-clean-btn-secondary" onclick="window.openClientFunnelModal && window.openClientFunnelModal('${c.id}')" style="font-size: 11.5px; padding: 4px 10px;" title="View Complete Funnel Timeline">
                <span>Track Timeline ➔</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // 5. Render Partner Payout History Table
    function renderPartnerPayouts() {
      const tbody = document.getElementById('ref-payouts-tbody');
      if (!tbody) return;

      tbody.innerHTML = refState.payoutRequests.map(p => {
        const isPaid = p.status === 'Paid';
        return `
          <tr>
            <td><strong style="font-family: monospace; color: #2563eb;">${p.id}</strong></td>
            <td>${p.date}</td>
            <td style="font-weight: 800; font-size: 13.5px; color: #0f172a;">₹${p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td><span class="status-chip in-progress" style="font-size: 10.5px;">${p.mode}</span></td>
            <td style="font-family: monospace; font-size: 11.5px; color: #475569;">${p.details}</td>
            <td style="font-family: monospace; font-size: 11.5px; color: ${isPaid ? '#15803d' : '#94a3b8'};">
              ${isPaid ? `✓ ${p.utr}` : 'Pending processing'}
            </td>
            <td>
              <span class="status-chip ${isPaid ? 'resolved' : 'waiting'}">
                ${p.status}
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }

    // 6. Render Reseller Payouts Approval Table
    function renderResellerPayouts() {
      const tbody = document.getElementById('reseller-payouts-tbody');
      if (!tbody) return;

      const pendingCount = refState.payoutRequests.filter(p => p.status === 'Pending').length;
      const countBadge = document.getElementById('reseller-payout-pending-count');
      const tabBadge = document.getElementById('reseller-pending-badge');
      if (countBadge) countBadge.textContent = `${pendingCount} Pending`;
      if (tabBadge) tabBadge.textContent = pendingCount;

      tbody.innerHTML = refState.payoutRequests.map(p => {
        const isPending = p.status === 'Pending';
        return `
          <tr>
            <td><strong style="font-family: monospace; color: #2563eb;">${p.id}</strong></td>
            <td>
              <div style="font-weight: 700; color: #0f172a;">${p.partnerName}</div>
              <div style="font-size: 11px; color: #64748b;">${p.partnerEmail}</div>
            </td>
            <td>${p.date}</td>
            <td style="font-weight: 800; color: #16a34a; font-size: 14px;">₹${p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td><span class="status-chip in-progress">${p.mode}</span></td>
            <td style="font-family: monospace; font-size: 11.5px;">${p.details}</td>
            <td>
              <span class="status-chip ${p.status === 'Paid' ? 'resolved' : (p.status === 'Pending' ? 'waiting' : 'open')}">
                ${p.status}
              </span>
            </td>
            <td style="text-align: right;">
              ${isPending ? `
                <div style="display: inline-flex; align-items: center; gap: 6px;">
                  <button type="button" class="btn-primary" onclick="window.openApprovePayoutModal && window.openApprovePayoutModal('${p.id}')" style="font-size: 11px; padding: 4px 8px; background: #16a34a; border-color: #15803d;">
                    Approve & Pay ✓
                  </button>
                  <button type="button" class="btn-secondary" onclick="window.handleRejectPayout && window.handleRejectPayout('${p.id}')" style="font-size: 11px; padding: 4px 8px; color: #dc2626; border-color: #fca5a5;">
                    Reject
                  </button>
                </div>
              ` : `
                <span style="font-size: 11.5px; color: #64748b; font-family: monospace;">Ref: ${p.utr}</span>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }

    // 7. Render Reseller Partners Roster Table
    function renderResellerPartners() {
      const tbody = document.getElementById('reseller-partners-tbody');
      if (!tbody) return;

      tbody.innerHTML = refState.partnersRoster.map(prt => {
        let trackBadgeBg = '#eff6ff';
        let trackBadgeColor = '#1d4ed8';
        let trackBorder = '#bfdbfe';

        if (prt.programTrack === 'Certified Advisor') {
          trackBadgeBg = '#faf5ff';
          trackBadgeColor = '#7e22ce';
          trackBorder = '#e9d5ff';
        } else if (prt.programTrack === 'Whitelabel Partner') {
          trackBadgeBg = '#f0fdf4';
          trackBadgeColor = '#16a34a';
          trackBorder = '#bbf7d0';
        }

        return `
          <tr>
            <td>
              <div style="font-weight: 700; color: #0f172a; font-size: 13px;">${prt.name}</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                <span>${prt.email}</span> • <span style="font-family: monospace;">${prt.phone || ''}</span>
              </div>
            </td>
            <td>
              <span style="display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; background: ${trackBadgeBg}; color: ${trackBadgeColor}; border: 1px solid ${trackBorder};">
                ${prt.programTrack || 'Affiliate'}
              </span>
            </td>
            <td style="font-size: 12px; font-weight: 600; color: #334155;">
              ${prt.chosenModel || '20% Recurring'}
            </td>
            <td style="font-weight: 600; color: #475569; font-size: 12.5px;">${prt.clicks}</td>
            <td style="font-weight: 700; color: #1e3a8a; font-size: 12.5px;">${prt.referrals}</td>
            <td style="font-weight: 600; color: #16a34a; font-size: 12px;">${prt.rate}</td>
            <td style="font-weight: 700; color: #0f172a; font-size: 12.5px;">₹${prt.lifetime.toLocaleString('en-IN')}</td>
            <td style="font-weight: 700; color: #2563eb; font-size: 12.5px;">₹${prt.balance.toLocaleString('en-IN')}</td>
            <td>
              <span class="status-chip resolved" style="font-size: 10.5px; padding: 2px 7px;">${prt.status}</span>
            </td>
          </tr>
        `;
      }).join('');
    }

    // 8. Copy Partner Link with Visual Feedback
    function copyPartnerReferralLink() {
      const link = refState.partner.link;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
          showRefToast('Copied partner referral link to clipboard!');
        }).catch(() => {
          prompt('Copy your link:', link);
        });
      } else {
        prompt('Copy your link:', link);
      }
    }

    // 9. Share on WhatsApp
    function shareReferralOnWhatsApp() {
      const text = `Hey! 👋 Check out Simple Floww CRM for automated WhatsApp marketing, unified inbox & AI chatbots. Use my partner link to get 10% OFF:\n${refState.partner.link}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }

    // 10. Modals: Request Payout
    function openPayoutModal() {
      const modal = document.getElementById('modal-ref-payout');
      if (modal) modal.style.display = 'flex';
      updatePartnerHeroAndStats();
    }

    function closePayoutModal() {
      const modal = document.getElementById('modal-ref-payout');
      if (modal) modal.style.display = 'none';
    }

    function setPayoutMode(mode) {
      const btnUpi = document.getElementById('payout-btn-mode-upi');
      const btnBank = document.getElementById('payout-btn-mode-bank');
      const secUpi = document.getElementById('payout-section-upi');
      const secBank = document.getElementById('payout-section-bank');
      const hiddenVal = document.getElementById('payout-mode-val');

      if (hiddenVal) hiddenVal.value = mode;

      if (mode === 'upi') {
        if (btnUpi) btnUpi.classList.add('active');
        if (btnBank) btnBank.classList.remove('active');
        if (secUpi) secUpi.style.display = 'block';
        if (secBank) secBank.style.display = 'none';
      } else {
        if (btnUpi) btnUpi.classList.remove('active');
        if (btnBank) btnBank.classList.add('active');
        if (secUpi) secUpi.style.display = 'none';
        if (secBank) secBank.style.display = 'flex';
      }
    }

    function fillMaxPayoutAmount() {
      const amtInput = document.getElementById('payout-amount-input');
      if (amtInput) amtInput.value = Math.floor(refState.partner.walletBalance);
    }

    function handlePartnerPayoutSubmit(e) {
      e.preventDefault();
      const amtInput = document.getElementById('payout-amount-input');
      const amount = parseFloat(amtInput ? amtInput.value : 0);
      const minThreshold = refState.config.minPayoutThreshold;

      if (isNaN(amount) || amount < minThreshold) {
        showRefToast(`Withdrawal amount must be at least ₹${minThreshold}`, false);
        return;
      }

      if (amount > refState.partner.walletBalance) {
        showRefToast('Amount exceeds available wallet balance!', false);
        return;
      }

      const modeVal = document.getElementById('payout-mode-val')?.value || 'upi';
      let details = '';
      if (modeVal === 'upi') {
        details = document.getElementById('payout-upi-input')?.value.trim();
        if (!details) {
          showRefToast('Please enter your valid UPI ID', false);
          return;
        }
      } else {
        const acc = document.getElementById('payout-bank-acc')?.value.trim();
        const ifsc = document.getElementById('payout-bank-ifsc')?.value.trim();
        if (!acc || !ifsc) {
          showRefToast('Please fill all bank account details', false);
          return;
        }
        details = `A/C: ${acc}, ${ifsc.toUpperCase()}`;
      }

      // Deduct balance
      refState.partner.walletBalance -= amount;

      // Add payout request
      const newPayId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
      refState.payoutRequests.unshift({
        id: newPayId,
        partnerName: refState.partner.name,
        partnerEmail: refState.partner.email,
        date: 'Just now',
        amount: amount,
        mode: modeVal === 'upi' ? 'UPI' : 'Bank IMPS',
        details: details,
        status: 'Pending',
        utr: '-'
      });

      closePayoutModal();
      updatePartnerHeroAndStats();
      renderPartnerPayouts();
      renderResellerPayouts();
      showRefToast(`✅ Withdrawal request for ₹${amount.toLocaleString('en-IN')} submitted successfully!`);
    }

    // 11. Modals: Promo Kit
    function openPromoKitModal() {
      const modal = document.getElementById('modal-ref-promo-kit');
      if (modal) modal.style.display = 'flex';
    }

    function closePromoKitModal() {
      const modal = document.getElementById('modal-ref-promo-kit');
      if (modal) modal.style.display = 'none';
    }

    function copyPromoText(elementId) {
      const el = document.getElementById(elementId);
      if (el) {
        navigator.clipboard.writeText(el.innerText).then(() => {
          showRefToast('Promo text copied to clipboard!');
        });
      }
    }

    // 12. Reseller Config Settings Handlers (Mutually Exclusive: pure recurring vs pure flat)
    function selectResellerModel(model) {
      refState.config.activeModel = model;
      const cRec = document.getElementById('card-model-recurring');
      const cFlat = document.getElementById('card-model-flat');

      if (cRec) cRec.classList.toggle('active', model === 'recurring');
      if (cFlat) cFlat.classList.toggle('active', model === 'flat');
    }

    function saveResellerConfig() {
      const inRec = document.getElementById('reseller-cfg-recurring');
      const inFlat = document.getElementById('reseller-cfg-flat');
      const inMin = document.getElementById('reseller-cfg-minpayout');
      const inWelcome = document.getElementById('reseller-cfg-welcome');

      if (inRec) refState.config.recurringPercent = parseInt(inRec.value, 10) || 20;
      if (inFlat) refState.config.flatBountyAmount = parseInt(inFlat.value, 10) || 500;
      if (inMin) refState.config.minPayoutThreshold = parseInt(inMin.value, 10) || 1000;
      if (inWelcome) refState.config.welcomeBonus = inWelcome.value;

      // Update partner choice labels as well
      const lblFlat = document.getElementById('choice-lbl-flat');
      if (lblFlat) lblFlat.textContent = `Flat ₹${refState.config.flatBountyAmount.toLocaleString('en-IN')} Bounty`;

      updatePartnerHeroAndStats();
      renderPartnerClients();
      showRefToast('✅ Reseller reward engine updated & deployed to all partners!');
    }

    // 13. Reseller Approval Modal & Actions
    function openApprovePayoutModal(payId) {
      const p = refState.payoutRequests.find(item => item.id === payId);
      if (!p) return;

      const modal = document.getElementById('modal-ref-approve-payout');
      const inId = document.getElementById('approve-payout-id');
      const pName = document.getElementById('approve-modal-partner-name');
      const pAmt = document.getElementById('approve-modal-amount');
      const pDest = document.getElementById('approve-modal-dest');

      if (inId) inId.value = p.id;
      if (pName) pName.textContent = p.partnerName;
      if (pAmt) pAmt.textContent = `₹${p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
      if (pDest) pDest.textContent = `${p.mode}: ${p.details}`;

      if (modal) modal.style.display = 'flex';
    }

    function closeApprovePayoutModal() {
      const modal = document.getElementById('modal-ref-approve-payout');
      if (modal) modal.style.display = 'none';
    }

    function handleConfirmApprovePayout(e) {
      e.preventDefault();
      const inId = document.getElementById('approve-payout-id');
      const inUtr = document.getElementById('approve-utr-input');
      const payId = inId ? inId.value : '';
      const utr = inUtr ? inUtr.value.trim() : 'CMS' + Date.now();

      const p = refState.payoutRequests.find(item => item.id === payId);
      if (p) {
        p.status = 'Paid';
        p.utr = utr;
        closeApprovePayoutModal();
        renderResellerPayouts();
        renderPartnerPayouts();
        showRefToast(`✅ Payout ${payId} marked as Paid with UTR ${utr}!`);
      }
    }

    function handleRejectPayout(payId) {
      const p = refState.payoutRequests.find(item => item.id === payId);
      if (!p) return;
      if (confirm(`Reject payout request ${payId} for ₹${p.amount}? The amount will be refunded to the partner's wallet.`)) {
        p.status = 'Rejected';
        p.utr = 'Cancelled / Refunded';
        refState.partner.walletBalance += p.amount;
        updatePartnerHeroAndStats();
        renderResellerPayouts();
        renderPartnerPayouts();
        showRefToast(`Payout ${payId} rejected & refunded to partner's wallet.`, false);
      }
    }

    // 14. Filter Referred Clients
    function filterReferredClients() {
      const search = document.getElementById('ref-client-search');
      renderPartnerClients(search ? search.value : '');
    }

    // 15. Referred Client Funnel Modal (Visual 5-Step Stepper)
    function openClientFunnelModal(clientId) {
      const client = refState.referredClients.find(c => c.id === clientId);
      if (!client) return;

      const modal = document.getElementById('modal-ref-client-funnel');
      const nameEl = document.getElementById('funnel-modal-client-name');
      const idEl = document.getElementById('funnel-modal-client-id');
      const planAmtEl = document.getElementById('funnel-modal-plan-amt');
      const commAmtEl = document.getElementById('funnel-modal-comm-amt');
      const clearPillEl = document.getElementById('funnel-modal-clearance-pill');
      const stepperEl = document.getElementById('funnel-modal-stepper');

      if (!modal || !stepperEl) return;

      if (nameEl) nameEl.textContent = client.name;
      if (idEl) idEl.textContent = `${client.id} • ${client.contact}`;

      const mode = client.commissionMode || refState.partner.chosenReward || 'recurring';
      let earnVal = 0;
      if (mode === 'recurring') {
        earnVal = client.planValue > 0 ? Math.round((client.planValue * refState.config.recurringPercent) / 100) : 0;
      } else {
        earnVal = client.planValue > 0 ? refState.config.flatBountyAmount : 0;
      }

      if (planAmtEl) planAmtEl.textContent = client.planValue > 0 ? `₹${client.planValue.toLocaleString('en-IN')}` : '₹0 (Pending)';
      if (commAmtEl) commAmtEl.textContent = earnVal > 0 ? `+₹${earnVal.toLocaleString('en-IN')}` : '₹0.00';

      if (clearPillEl) {
        if (client.stage === 'credited') {
          clearPillEl.textContent = 'Cleared & In Wallet';
          clearPillEl.style.color = '#16a34a';
        } else if (client.stage === 'paid') {
          const daysLeft = Math.max(1, 7 - (client.daysSincePlan || 0));
          clearPillEl.textContent = `⏳ ${daysLeft}d Refund Window`;
          clearPillEl.style.color = '#d97706';
        } else {
          clearPillEl.textContent = 'Awaiting Plan';
          clearPillEl.style.color = '#64748b';
        }
      }

      // Build 4-step Lifecycle Stepper (WABA step removed as requested)
      const steps = [
        {
          key: 'signup',
          num: '1',
          title: 'Account Created',
          desc: `Signed up via your referral code (${refState.partner.code}).`,
          time: client.signupDate || 'Completed',
          badge: '10% Welcome Discount Activated',
          badgeBg: '#f1f5f9',
          badgeColor: '#475569',
          isDone: true,
          isActive: client.stage === 'signup'
        },
        {
          key: 'paid',
          num: '2',
          title: 'Plan Activated & Payment Confirmed',
          desc: client.planValue > 0 ? `Subscribed to ${client.plan} for ₹${client.planValue.toLocaleString('en-IN')}.` : 'Client is evaluating trial and selecting plan.',
          time: client.planDate || (client.stage === 'paid' || client.stage === 'credited' ? 'Completed' : 'Pending'),
          badge: client.planValue > 0 ? `Payment Received: ₹${client.planValue.toLocaleString('en-IN')}` : 'Awaiting Payment',
          badgeBg: client.planValue > 0 ? '#eff6ff' : '#f8fafc',
          badgeColor: client.planValue > 0 ? '#2563eb' : '#64748b',
          isDone: client.stage === 'paid' || client.stage === 'credited',
          isActive: client.stage === 'paid' && client.daysSincePlan < 7
        },
        {
          key: 'refund',
          num: '3',
          title: '7-Day Refund Policy Window',
          desc: client.planValue > 0 
            ? (client.daysSincePlan >= 7 ? `7-day window completed on ${client.clearanceDate} without refund.` : `Currently day ${client.daysSincePlan} of 7. Commission held in safety escrow.`)
            : 'Starts immediately after plan purchase.',
          time: client.clearanceDate ? `Ends: ${client.clearanceDate}` : 'Pending Plan',
          badge: client.daysSincePlan >= 7 ? '7-Day Clearance Complete ✓' : (client.stage === 'paid' ? `⏳ ${7 - (client.daysSincePlan || 0)} Days Remaining` : 'Escrow Protected'),
          badgeBg: client.daysSincePlan >= 7 ? '#ecfdf5' : (client.stage === 'paid' ? '#fffbeb' : '#f8fafc'),
          badgeColor: client.daysSincePlan >= 7 ? '#059669' : (client.stage === 'paid' ? '#b45309' : '#64748b'),
          isDone: client.stage === 'credited',
          isActive: client.stage === 'paid'
        },
        {
          key: 'credited',
          num: '4',
          title: 'Commission Credited to Partner Wallet',
          desc: client.stage === 'credited' 
            ? `+₹${earnVal.toLocaleString('en-IN')} added directly to your CRM wallet balance. Available for instant UPI/Bank payout withdrawal.`
            : `Will credit automatically upon day 8 of active subscription (+₹${earnVal.toLocaleString('en-IN')}).`,
          time: client.stage === 'credited' ? 'Credited ✅' : 'Pending 7d Clearance',
          badge: client.stage === 'credited' ? `Wallet Balance Updated (+₹${earnVal.toLocaleString('en-IN')})` : 'Auto-Credit Queued',
          badgeBg: client.stage === 'credited' ? '#f0fdf4' : '#f8fafc',
          badgeColor: client.stage === 'credited' ? '#15803d' : '#94a3b8',
          isDone: client.stage === 'credited',
          isActive: client.stage === 'credited'
        }
      ];

      stepperEl.innerHTML = steps.map(s => `
        <div class="ref-step-item ${s.isDone ? 'completed' : (s.isActive ? 'active' : '')}">
          <div class="ref-step-line"></div>
          <div class="ref-step-node">
            ${s.isDone ? '✓' : s.num}
          </div>
          <div class="ref-step-content">
            <div class="ref-step-title">
              <span>${s.title}</span>
              <span class="ref-step-time">${s.time}</span>
            </div>
            <div class="ref-step-desc">${s.desc}</div>
            <span class="ref-step-meta-badge" style="background: ${s.badgeBg}; color: ${s.badgeColor};">${s.badge}</span>
          </div>
        </div>
      `).join('');

      modal.style.display = 'flex';
    }

    function closeClientFunnelModal() {
      const modal = document.getElementById('modal-ref-client-funnel');
      if (modal) modal.style.display = 'none';
    }

    // 16. Simulate a New Referral Lead through the Funnel
    function simulateNewReferralLead() {
      const sampleCompanies = [
        { name: 'BlueStar Logistics Hub', contact: 'Deepak Patel', plan: 'Growth Pro Monthly', val: 4999 },
        { name: 'UrbanKart Retail Tech', contact: 'Kavita Sundaram', plan: 'Enterprise Annual Suite', val: 24000 },
        { name: 'QuickServe Cloud Kitchen', contact: 'Aakash Singhania', plan: 'Starter Monthly', val: 2499 }
      ];
      const pick = sampleCompanies[Math.floor(Math.random() * sampleCompanies.length)];
      const newId = `REF-${Math.floor(100 + Math.random() * 900)}`;

      const newRef = {
        id: newId,
        name: pick.name,
        contact: pick.contact,
        signupDate: 'Just now',
        stage: 'paid', // newly paid in 7-day refund window
        plan: pick.plan,
        planValue: pick.val,
        planDate: 'Just now',
        daysSincePlan: 1, // day 1 in 7-day refund window!
        clearanceDate: 'In 6 days',
        commissionMode: refState.partner.chosenReward,
        recurringEarning: Math.round((pick.val * refState.config.recurringPercent) / 100),
        flatEarning: refState.config.flatBountyAmount,
        status: 'In 7d Refund Window'
      };

      refState.referredClients.unshift(newRef);
      refState.partner.totalClicks += 4;
      const expectedEarn = refState.partner.chosenReward === 'recurring' ? newRef.recurringEarning : newRef.flatEarning;
      refState.partner.pendingClearance += expectedEarn;

      const pendingStat = document.getElementById('ref-stat-pending');
      if (pendingStat) pendingStat.textContent = `₹${refState.partner.pendingClearance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

      renderPartnerClients();
      showRefToast(`🎉 New referral lead "${pick.name}" simulated! Plan paid: ₹${pick.val.toLocaleString('en-IN')}. 7-day refund countdown started.`);
    }

    // 17. Advisor Application Modal Handlers
    function openAdvisorApplicationModal() {
      const modal = document.getElementById('modal-ref-advisor-app');
      if (modal) {
        modal.style.display = 'flex';
        const nameInput = document.getElementById('adv-name');
        if (nameInput && !nameInput.value) nameInput.value = 'Abhinandan Kumar';
      }
    }

    function closeAdvisorApplicationModal() {
      const modal = document.getElementById('modal-ref-advisor-app');
      if (modal) modal.style.display = 'none';
    }

    function handleAdvisorAppSubmit(e) {
      if (e) e.preventDefault();
      const name = document.getElementById('adv-name')?.value || 'New Advisor';
      const phone = document.getElementById('adv-phone')?.value || '+91 98765 43210';
      const role = document.getElementById('adv-role')?.value || 'Agency';
      const services = document.getElementById('adv-services')?.value || '';
      const clientCount = document.getElementById('adv-client-count')?.value || '5-15';
      const skills = document.getElementById('adv-skills')?.value || '';

      // Add to reseller partners roster as Certified Advisor
      const newAdvisor = {
        name: `${name} (Certified Advisor)`,
        email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@partner.in`,
        phone: phone,
        programTrack: 'Certified Advisor',
        chosenModel: '50% Commission (Advisor)',
        clicks: 0,
        referrals: 0,
        rate: '0.0%',
        lifetime: 0,
        balance: 0,
        status: 'Accredited'
      };

      refState.partnersRoster.unshift(newAdvisor);
      renderResellerPartners();

      // Update Reseller KPI active affiliates count
      const partKpi = document.getElementById('reseller-kpi-partners');
      if (partKpi) partKpi.textContent = refState.partnersRoster.length;

      closeAdvisorApplicationModal();
      showRefToast(`🎉 Certified Advisor registered! Welcome ${name}. Leads access & 50% commission active.`);
    }

    // 18. White-Label Application Modal Handlers
    function openWhitelabelApplicationModal() {
      const modal = document.getElementById('modal-ref-whitelabel-app');
      if (modal) modal.style.display = 'flex';
    }

    function closeWhitelabelApplicationModal() {
      const modal = document.getElementById('modal-ref-whitelabel-app');
      if (modal) modal.style.display = 'none';
    }

    function handleWhitelabelAppSubmit(e) {
      if (e) e.preventDefault();
      const brand = document.getElementById('wl-brand-name')?.value || 'Enterprise Partner';
      const domain = document.getElementById('wl-domain')?.value || 'crm.partnerdomain.com';
      const volume = document.getElementById('wl-volume')?.value || '10-25';
      const experience = document.getElementById('wl-experience')?.value || '';

      // Add to reseller partners roster as Whitelabel Partner
      const newWL = {
        name: brand,
        email: `ops@${domain.replace('crm.', '')}`,
        phone: '+91 99887 76655',
        programTrack: 'Whitelabel Partner',
        chosenModel: '100% Brand Margin',
        clicks: 0,
        referrals: 0,
        rate: '0.0%',
        lifetime: 0,
        balance: 0,
        status: 'Provisioning'
      };

      refState.partnersRoster.unshift(newWL);
      renderResellerPartners();

      const partKpi = document.getElementById('reseller-kpi-partners');
      if (partKpi) partKpi.textContent = refState.partnersRoster.length;

      closeWhitelabelApplicationModal();
      showRefToast(`🚀 White-Label instance request received for ${brand} (${domain})! Provisioning portal.`);
    }

    // 19. Interactive Earnings & ROI Calculator Engine
    let calcActiveTrack = 'affiliate'; // 'affiliate' | 'advisor' | 'whitelabel'

    function setCalcProgram(track) {
      calcActiveTrack = track;
      const btnAff = document.getElementById('calc-btn-affiliate');
      const btnAdv = document.getElementById('calc-btn-advisor');
      const btnWL = document.getElementById('calc-btn-whitelabel');

      const affGroup = document.getElementById('calc-affiliate-mode-group');
      const wlGroup = document.getElementById('calc-wl-markup-group');

      if (btnAff) btnAff.classList.toggle('active', track === 'affiliate');
      if (btnAdv) btnAdv.classList.toggle('active', track === 'advisor');
      if (btnWL) btnWL.classList.toggle('active', track === 'whitelabel');

      if (affGroup) affGroup.style.display = track === 'affiliate' ? 'block' : 'none';
      if (wlGroup) wlGroup.style.display = track === 'whitelabel' ? 'block' : 'none';

      const ctaBtn = document.getElementById('calc-cta-btn');
      if (ctaBtn) {
        if (track === 'affiliate') {
          ctaBtn.innerHTML = '<span>Start as Affiliate (Instant Free) ➔</span>';
          ctaBtn.onclick = () => switchPartnerTableTab('clients');
          ctaBtn.style.background = '#2563eb';
        } else if (track === 'advisor') {
          ctaBtn.innerHTML = '<span>Apply as Certified Advisor (₹5,000/yr) ➔</span>';
          ctaBtn.onclick = () => openAdvisorApplicationModal();
          ctaBtn.style.background = '#7e22ce';
        } else {
          ctaBtn.innerHTML = '<span>Request White-Label Portal ➔</span>';
          ctaBtn.onclick = () => openWhitelabelApplicationModal();
          ctaBtn.style.background = '#16a34a';
        }
      }

      updateCalcMath();
    }

    function updateCalcMath() {
      const clientsSlider = document.getElementById('calc-slider-clients');
      const priceSlider = document.getElementById('calc-slider-price');
      const wlPriceSlider = document.getElementById('calc-slider-wl-price');

      const clients = clientsSlider ? parseInt(clientsSlider.value, 10) : 5;
      const price = priceSlider ? parseInt(priceSlider.value, 10) : 4999;
      const wlPrice = wlPriceSlider ? parseInt(wlPriceSlider.value, 10) : 9999;

      const badgeClients = document.getElementById('calc-badge-clients');
      if (badgeClients) badgeClients.textContent = `${clients} Client${clients > 1 ? 's' : ''}`;

      const badgePrice = document.getElementById('calc-badge-price');
      if (badgePrice) badgePrice.textContent = `₹${price.toLocaleString('en-IN')} / mo`;

      const badgeWl = document.getElementById('calc-badge-wl-price');
      if (badgeWl) badgeWl.textContent = `₹${wlPrice.toLocaleString('en-IN')} / mo`;

      const gmvVal = clients * price;
      const heroLabel = document.getElementById('calc-hero-label');
      const monthlyEl = document.getElementById('calc-monthly-val');
      const annualEl = document.getElementById('calc-annual-val');
      const gmvEl = document.getElementById('calc-gmv-val');
      const rateSubEl = document.getElementById('calc-rate-sub');
      const formulaEl = document.getElementById('calc-formula-desc');

      if (gmvEl) gmvEl.textContent = `₹${gmvVal.toLocaleString('en-IN')}/mo`;

      if (calcActiveTrack === 'affiliate') {
        const rewardTypeRadio = document.querySelector('input[name="calc-reward-type"]:checked');
        const isFlat = rewardTypeRadio && rewardTypeRadio.value === 'flat';

        if (isFlat) {
          const flatEarn = clients * refState.config.flatBountyAmount;
          if (heroLabel) heroLabel.textContent = 'One-Time Cash Bounty Earnings';
          if (monthlyEl) {
            monthlyEl.textContent = `₹${flatEarn.toLocaleString('en-IN')}`;
            monthlyEl.className = 'calc-result-amount';
          }
          if (rateSubEl) rateSubEl.textContent = `Flat ₹${refState.config.flatBountyAmount} bounty per paid client (no renewals)`;
          if (annualEl) annualEl.textContent = `₹${flatEarn.toLocaleString('en-IN')} (One-Time)`;
          if (formulaEl) {
            formulaEl.innerHTML = `💡 <strong>Bounty Math:</strong> ₹${refState.config.flatBountyAmount} × ${clients} clients = ₹${flatEarn.toLocaleString('en-IN')} direct payout after 7-day refund clearance.`;
          }
        } else {
          // Tiered Recurring: 10% for 1-2, 15% for 3-5, 20% for 6+
          let pct = 10;
          let tierName = 'Bronze (10%)';
          if (clients >= 6) {
            pct = 20;
            tierName = 'Gold VIP (20%)';
          } else if (clients >= 3) {
            pct = 15;
            tierName = 'Silver (15%)';
          }

          const monthlyEarn = Math.round((gmvVal * pct) / 100);
          const annualEarn = monthlyEarn * 12;

          if (heroLabel) heroLabel.textContent = 'Estimated Monthly Recurring Royalty';
          if (monthlyEl) {
            monthlyEl.textContent = `₹${monthlyEarn.toLocaleString('en-IN')}`;
            monthlyEl.className = 'calc-result-amount';
          }
          if (rateSubEl) rateSubEl.textContent = `Applied Milestone: ${tierName} Royalty`;
          if (annualEl) annualEl.textContent = `₹${annualEarn.toLocaleString('en-IN')}/yr`;
          if (formulaEl) {
            formulaEl.innerHTML = `💡 <strong>Tiered Royalty:</strong> With ${clients} clients, you unlock ${tierName}. Earn <strong>${pct}% royalty</strong> every month on renewals as long as clients stay subscribed!`;
          }
        }
      } else if (calcActiveTrack === 'advisor') {
        // Advisor: 50% flat commission! Simple Floww handles all tech & onboarding
        const monthlyEarn = Math.round(gmvVal * 0.50);
        const annualEarn = monthlyEarn * 12;

        if (heroLabel) heroLabel.textContent = 'Certified Advisor Monthly Earnings';
        if (monthlyEl) {
          monthlyEl.textContent = `₹${monthlyEarn.toLocaleString('en-IN')}`;
          monthlyEl.className = 'calc-result-amount';
        }
        if (rateSubEl) rateSubEl.textContent = 'Huge 50% Revenue Share (Leads & Sales Training Provided)';
        if (annualEl) annualEl.textContent = `₹${annualEarn.toLocaleString('en-IN')}/yr`;
        if (formulaEl) {
          formulaEl.innerHTML = `💼 <strong>Advisor Model:</strong> You close deals using our sales training & qualified buyer leads. You pocket <strong>50% (₹${monthlyEarn.toLocaleString('en-IN')}/mo)</strong>, while we manage all tech support, onboarding, and servers!`;
        }
      } else {
        // White-Label: Retainer minus Simple Floww platform wholesale cost (e.g., base wholesale is price)
        // Partner charges wlPrice to clients, pays base price to platform, keeps 100% margin!
        const effectiveBilling = Math.max(wlPrice, price);
        const wholesaleCost = price * clients;
        const totalBilled = effectiveBilling * clients;
        const monthlyProfit = totalBilled - wholesaleCost;
        const annualProfit = monthlyProfit * 12;

        if (heroLabel) heroLabel.textContent = 'Your Monthly Agency SaaS Net Profit';
        if (monthlyEl) {
          monthlyEl.textContent = `₹${monthlyProfit.toLocaleString('en-IN')}`;
          monthlyEl.className = 'calc-result-amount green';
        }
        if (rateSubEl) rateSubEl.textContent = `100% Brand Margin • Charge ₹${effectiveBilling.toLocaleString('en-IN')}/client`;
        if (annualEl) annualEl.textContent = `₹${annualProfit.toLocaleString('en-IN')}/yr`;
        if (formulaEl) {
          formulaEl.innerHTML = `🏢 <strong>White-Label Freedom:</strong> You bill your clients directly at ₹${effectiveBilling.toLocaleString('en-IN')}/mo. After our fixed per-client wholesale fee, you keep <strong>₹${monthlyProfit.toLocaleString('en-IN')} pure monthly profit</strong>!`;
        }
      }
    }

    // Initial render
    updatePartnerHeroAndStats();
    renderPartnerClients();
    renderPartnerPayouts();
    renderResellerPayouts();
    renderResellerPartners();

    // Export to window for click handlers
    window.switchReferralView = switchReferralView;
    window.switchPartnerTableTab = switchPartnerTableTab;
    window.copyPartnerReferralLink = copyPartnerReferralLink;
    window.shareReferralOnWhatsApp = shareReferralOnWhatsApp;
    window.openPayoutModal = openPayoutModal;
    window.closePayoutModal = closePayoutModal;
    window.setPayoutMode = setPayoutMode;
    window.fillMaxPayoutAmount = fillMaxPayoutAmount;
    window.handlePartnerPayoutSubmit = handlePartnerPayoutSubmit;
    window.openPromoKitModal = openPromoKitModal;
    window.closePromoKitModal = closePromoKitModal;
    window.copyPromoText = copyPromoText;
    window.selectResellerModel = selectResellerModel;
    window.saveResellerConfig = saveResellerConfig;
    window.openApprovePayoutModal = openApprovePayoutModal;
    window.closeApprovePayoutModal = closeApprovePayoutModal;
    window.handleConfirmApprovePayout = handleConfirmApprovePayout;
    window.handleRejectPayout = handleRejectPayout;
    window.filterReferredClients = filterReferredClients;
    window.setPartnerRewardChoice = setPartnerRewardChoice;
    window.openClientFunnelModal = openClientFunnelModal;
    window.closeClientFunnelModal = closeClientFunnelModal;
    window.simulateNewReferralLead = simulateNewReferralLead;
    window.openAdvisorApplicationModal = openAdvisorApplicationModal;
    window.closeAdvisorApplicationModal = closeAdvisorApplicationModal;
    window.handleAdvisorAppSubmit = handleAdvisorAppSubmit;
    window.openWhitelabelApplicationModal = openWhitelabelApplicationModal;
    window.closeWhitelabelApplicationModal = closeWhitelabelApplicationModal;
    window.handleWhitelabelAppSubmit = handleWhitelabelAppSubmit;
    window.setCalcProgram = setCalcProgram;
    window.updateCalcMath = updateCalcMath;
  }

  initHelpDesk();
  initReferAndEarnHub();
  refreshDashboard(false);

});



