'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, Layers, AlertTriangle, Cpu, FileText, CheckCircle, DollarSign, Clock, ExternalLink, Save, Download, Eye 
} from 'lucide-react';
import styles from '../admin.module.css';

export default function TeamTrackerManager({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info') => void }) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Main Tab selection: 'orders_tracker' | 'project_issues' | 'workload_metrics'
  const [mainTab, setMainTab] = useState<'orders_tracker' | 'project_issues' | 'workload_metrics'>('orders_tracker');
  
  // Secondary toggle filter for NRA, Delivery, Cancel status tabs
  const [trackerFilter, setTrackerFilter] = useState<'all' | 'nra' | 'delivery' | 'cancel'>('all');
  
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dropdown filter multi-select lists
  const [selectedServiceLines, setSelectedServiceLines] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [deliDateSort, setDeliDateSort] = useState<'none' | 'newest' | 'oldest'>('none');
  
  // Active open dropdown panel name
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Custom visible columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'Profile Name', 'Amount', 'Client name', 'Order ID', 'Assign Team', 'Status', 'Value', 'Deadline'
  ]);

  const allAvailableColumns = [
    'Employee Name', 'Sales Team', 'Date', 'Profile Name', 'Amount', 'Client name', 'Order ID', 
    'Remarks', 'Assign Team', 'Status', 'Service Line', 'Service Type', 'Deli_Date', 'Value', 'Deadline', 'Incoming Time', 'Order Source'
  ];

  // Seconds ticking state for real-time countdowns
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/team-data');
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to fetch team data');
        showToast(errData.error || 'Failed to load team data', 'error');
      }
    } catch (err) {
      console.error(err);
      setError('Error connecting to team server');
      showToast('Error connecting to team server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
    // Load config from localStorage
    const savedCols = localStorage.getItem('team_visible_cols');
    if (savedCols) {
      try { setVisibleColumns(JSON.parse(savedCols)); } catch(e) {}
    }
    const savedFilters = localStorage.getItem('team_active_filters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        if (parsed.serviceLines) setSelectedServiceLines(parsed.serviceLines);
        if (parsed.statuses) setSelectedStatuses(parsed.statuses);
        if (parsed.teams) setSelectedTeams(parsed.teams);
        if (parsed.names) setSelectedNames(parsed.names);
        if (parsed.search) setSearchQuery(parsed.search);
        if (parsed.sort) setDeliDateSort(parsed.sort);
      } catch (e) {}
    }
  }, []);

  const handleSaveFilters = () => {
    const filters = {
      serviceLines: selectedServiceLines,
      statuses: selectedStatuses,
      teams: selectedTeams,
      names: selectedNames,
      search: searchQuery,
      sort: deliDateSort
    };
    localStorage.setItem('team_active_filters', JSON.stringify(filters));
    localStorage.setItem('team_visible_cols', JSON.stringify(visibleColumns));
    showToast('Active filters & columns configurations saved successfully!', 'success');
  };

  // Helper parsing values
  const getCleanVal = (valStr: string) => {
    if (!valStr) return 0;
    return parseFloat(valStr.replace(/[\$,]/g, '')) || 0;
  };

  // Helper parsing team and names from cell value (e.g. "Saiful/Asfaq/CC/CM")
  const parseTeamAndNames = (assignTeamStr: string) => {
    if (!assignTeamStr) return { teams: [], names: [] };
    const tokens = assignTeamStr.split('/').map(t => t.trim()).filter(Boolean);
    const teams: string[] = [];
    const names: string[] = [];
    
    tokens.forEach(token => {
      // If token is all uppercase and 2-4 chars, assume it's a team code (like CC, CW, CM, CS, AA, WC, etc.)
      if (token === token.toUpperCase() && token.length >= 2 && token.length <= 4) {
        teams.push(token);
      } else {
        names.push(token);
      }
    });
    return { teams, names };
  };

  // Dynamic filter values parsed from raw data records
  const uniqueServiceLines = useMemo(() => {
    return Array.from(new Set(records.map(r => r['Service Line']).filter(Boolean))).sort();
  }, [records]);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(records.map(r => r['Status']).filter(Boolean))).sort();
  }, [records]);

  // Compute active team hierarchy (Teams -> Member Names) based on selected Service Line
  const teamHierarchy = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    records.forEach(r => {
      // Filter by selected service lines if checked
      if (selectedServiceLines.length > 0 && !selectedServiceLines.includes(r['Service Line'])) {
        return;
      }
      const { teams, names } = parseTeamAndNames(r['Assign Team']);
      teams.forEach(t => {
        if (!map[t]) map[t] = new Set();
        names.forEach(n => map[t].add(n));
      });
      // Fallback for assignments without team codes
      if (teams.length === 0 && names.length > 0) {
        if (!map['UNASSIGNED']) map['UNASSIGNED'] = new Set();
        names.forEach(n => map['UNASSIGNED'].add(n));
      }
    });

    return Object.entries(map).map(([teamCode, namesSet]) => ({
      teamCode,
      names: Array.from(namesSet).sort()
    })).sort((a, b) => a.teamCode.localeCompare(b.teamCode));
  }, [records, selectedServiceLines]);

  // Flat list of unique names corresponding to selected service line
  const uniqueNames = useMemo(() => {
    const set = new Set<string>();
    teamHierarchy.forEach(t => t.names.forEach(n => set.add(n)));
    return Array.from(set).sort();
  }, [teamHierarchy]);

  // Filtering records logic
  const filteredRecords = useMemo(() => {
    let list = records;

    // Filter by Main tab rules
    if (mainTab === 'project_issues') {
      // Filter by orders with issues/hold/cancellation remarks
      list = list.filter(r => 
        r['Status']?.toUpperCase() === 'CANCELLED' || 
        r['Remarks']?.toLowerCase()?.includes('hold') || 
        r['Remarks']?.toLowerCase()?.includes('cancel') ||
        r['Remarks']?.toLowerCase()?.includes('issue')
      );
    }

    // Filter by secondary toggle (NRA, Delivery, Cancel status tabs)
    if (mainTab === 'orders_tracker') {
      if (trackerFilter === 'nra') {
        list = list.filter(r => 
          r['Service Line']?.toUpperCase() === 'NRA' || 
          r['Service Type']?.toUpperCase()?.includes('NRA') ||
          r['Status']?.toUpperCase() === 'NRA'
        );
      } else if (trackerFilter === 'delivery') {
        list = list.filter(r => r['Status']?.toUpperCase() === 'DELIVERED');
      } else if (trackerFilter === 'cancel') {
        list = list.filter(r => r['Status']?.toUpperCase() === 'CANCELLED');
      } else {
        // Default: WIP/Active tracking
        list = list.filter(r => r['Status']?.toUpperCase() === 'WIP');
      }
    }

    // Filter by Service Line select
    if (selectedServiceLines.length > 0) {
      list = list.filter(r => selectedServiceLines.includes(r['Service Line']));
    }

    // Filter by Status select
    if (selectedStatuses.length > 0) {
      list = list.filter(r => selectedStatuses.includes(r['Status']));
    }

    // Filter by Team select
    if (selectedTeams.length > 0) {
      list = list.filter(r => {
        const { teams } = parseTeamAndNames(r['Assign Team']);
        return teams.some(t => selectedTeams.includes(t));
      });
    }

    // Filter by Names select
    if (selectedNames.length > 0) {
      list = list.filter(r => {
        const { names } = parseTeamAndNames(r['Assign Team']);
        return names.some(n => selectedNames.includes(n));
      });
    }

    // Apply search query text search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => 
        r['Profile Name']?.toLowerCase()?.includes(q) ||
        r['Client name']?.toLowerCase()?.includes(q) ||
        r['Order ID']?.toLowerCase()?.includes(q) ||
        r['Assign Team']?.toLowerCase()?.includes(q) ||
        r['Remarks']?.toLowerCase()?.includes(q) ||
        r['Service Type']?.toLowerCase()?.includes(q)
      );
    }

    // Sorting by Delivery Date
    if (deliDateSort === 'newest') {
      list = [...list].sort((a, b) => {
        const tA = Date.parse(a['Delivery Date'] || a['Deli_Date']) || 0;
        const tB = Date.parse(b['Delivery Date'] || b['Deli_Date']) || 0;
        return tB - tA;
      });
    } else if (deliDateSort === 'oldest') {
      list = [...list].sort((a, b) => {
        const tA = Date.parse(a['Delivery Date'] || a['Deli_Date']) || 0;
        const tB = Date.parse(b['Delivery Date'] || b['Deli_Date']) || 0;
        return tA - tB;
      });
    }

    return list;
  }, [records, mainTab, trackerFilter, selectedServiceLines, selectedStatuses, selectedTeams, selectedNames, searchQuery, deliDateSort]);

  // Overall database count statistics
  const totalFiltered = filteredRecords.length;
  const activeWip = records.filter(r => r.Status?.toUpperCase() === 'WIP').length;
  const totalWipValue = records
    .filter(r => r.Status?.toUpperCase() === 'WIP')
    .reduce((acc, r) => acc + getCleanVal(r['Value'] || r['Amount']), 0);

  // Group workloads for active WIP dynamically (Workload Tab)
  const wipByAssignee: Record<string, number> = {};
  const wipValueByAssignee: Record<string, number> = {};
  const wipMembersByAssignee: Record<string, string[]> = {};
  
  records.forEach(r => {
    if (r.Status?.toUpperCase() === 'WIP') {
      const { teams, names } = parseTeamAndNames(r['Assign Team']);
      const teamLabel = teams.join('/') || 'UNASSIGNED';
      
      wipByAssignee[teamLabel] = (wipByAssignee[teamLabel] || 0) + 1;
      wipValueByAssignee[teamLabel] = (wipValueByAssignee[teamLabel] || 0) + getCleanVal(r['Value'] || r['Amount']);
      if (!wipMembersByAssignee[teamLabel]) {
        wipMembersByAssignee[teamLabel] = names;
      }
    }
  });

  const overloadedAssignees = Object.entries(wipByAssignee).filter(([_, count]) => count >= 5);

  const getDeadlineCountdown = (deliveryDateStr: string, status: string) => {
    if (status?.toUpperCase() === 'DELIVERED') return 'Order Done';
    if (status?.toUpperCase() === 'CANCELLED') return 'Order Cancelled';
    if (!deliveryDateStr) return 'No Delivery Date';

    try {
      const cleanStr = deliveryDateStr.replace(/\s+/g, ' ');
      const targetTime = Date.parse(cleanStr);
      if (isNaN(targetTime)) return deliveryDateStr;

      const diff = targetTime - Date.now();
      if (diff <= 0) return 'Late / Overdue';

      const totalSecs = Math.floor(diff / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      return (days > 0 ? days + 'D ' : '') + hours + 'H ' + mins + 'M ' + secs + 'S';
    } catch (e) {
      return deliveryDateStr;
    }
  };

  const printTeamPDF = (title: string, list: any[]) => {
    const rowsHtml = list.map(r =>
      '<tr style="border-bottom: 1px solid #e2e8f0;">' +
        '<td style="padding: 8px;">' + (r['Order ID'] || '') + '</td>' +
        '<td style="padding: 8px;">' + (r['Profile Name'] || '') + '</td>' +
        '<td style="padding: 8px;">' + (r['Client name'] || '') + '</td>' +
        '<td style="padding: 8px;">' + (r['Assign Team'] || '') + '</td>' +
        '<td style="padding: 8px;">' + (r['Service Line'] || '') + '</td>' +
        '<td style="padding: 8px; text-align: right; font-weight: 600;">' + (r['Value'] || r['Amount'] || '') + '</td>' +
        '<td style="padding: 8px; text-align: center;">' + (r['Status'] || '') + '</td>' +
      '</tr>'
    ).join('');

    const htmlContent =
      '<div style="font-family: sans-serif; color: #1e293b; background: #fff; padding: 24px; line-height: 1.5;">' +
        '<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">' +
          '<div>' +
            '<h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #4f46e5;">RIFAT TEAM CONSOLE</h1>' +
            '<p style="margin: 4px 0 0; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Google Sheet Live Database Sync</p>' +
          '</div>' +
          '<div style="text-align: right;">' +
            '<h2 style="margin: 0; font-size: 15px; font-weight: 700; color: #0f172a;">' + title + '</h2>' +
            '<p style="margin: 4px 0 0; font-size: 11px; color: #64748b;">Records: ' + list.length + '</p>' +
          '</div>' +
        '</div>' +
        '<table style="width: 100%; border-collapse: collapse; font-size: 10px;">' +
          '<thead>' +
            '<tr style="background: #f1f5f9; border-bottom: 2px solid #e2e8f0;">' +
              '<th style="padding: 8px; text-align: left;">Order ID</th>' +
              '<th style="padding: 8px; text-align: left;">Profile</th>' +
              '<th style="padding: 8px; text-align: left;">Client</th>' +
              '<th style="padding: 8px; text-align: left;">Assign Team</th>' +
              '<th style="padding: 8px; text-align: left;">Service</th>' +
              '<th style="padding: 8px; text-align: right;">Value</th>' +
              '<th style="padding: 8px; text-align: center;">Status</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>' + rowsHtml + '</tbody>' +
        '</table>' +
      '</div>';

    const filename = 'Team_Tracker_' + title.replace(/\s+/g, '_') + '.pdf';
    const opt = {
      margin: 10,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const runPDF = () => {
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      (window as any).html2pdf().from(element).set(opt).save();
    };

    if ((window as any).html2pdf) {
      runPDF();
    } else {
      showToast('Loading PDF engine...', 'info');
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = runPDF;
      document.body.appendChild(script);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#fff', position: 'relative' }}>
      
      {/* Visual background atmospheric enhancements - Space orbs */}
      <div style={{ position: 'absolute', top: '100px', left: '20%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(129,140,248,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '400px', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      
      {/* ─── HEADER AREA ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '18px', zIndex: 1 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #f43f5e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'uppercase' }}>
            ORDER TRACKER
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Central dashboard for tracking orders and project issues.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchTeamData}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <Database size={16} style={{ color: '#00e5ff' }} /> Sync Sheet
          </button>
        </div>
      </div>

      {/* ─── MAIN TABS NAVIGATION (Orders Tracker, Project Issues, Workload Metrics) ─── */}
      <div style={{ display: 'flex', gap: '10px', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '6px', width: 'fit-content', zIndex: 1 }}>
        {[
          { id: 'orders_tracker', label: 'Orders Tracker', icon: Layers },
          { id: 'project_issues', label: 'Project Issues', icon: AlertTriangle },
          { id: 'workload_metrics', label: 'Workload Metrics', icon: Cpu }
        ].map(t => {
          const Icon = t.icon;
          const isActive = mainTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setMainTab(t.id as any);
                setActiveDropdown(null);
              }}
              style={{
                background: isActive ? 'linear-gradient(135deg, #a855f7 0%, #818cf8 100%)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 4px 15px rgba(168, 85, 247, 0.3)' : 'none'
              }}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ─── DYNAMIC STATISTICS HUD MATRIX ─── */}
      <div className={styles.grid3} style={{ zIndex: 1 }}>
        <div style={{ background: 'rgba(7, 8, 15, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Filtered Records</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{totalFiltered}</div>
          </div>
        </div>

        <div style={{ background: 'rgba(7, 8, 15, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Active (WIP)</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{activeWip}</div>
          </div>
        </div>

        <div style={{ background: 'rgba(7, 8, 15, 0.45)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Total Value (WIP)</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#eab308', marginTop: '4px' }}>
              ${totalWipValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)', background: 'rgba(15, 23, 42, 0.1)', border: '1px dashed rgba(255,255,255,0.03)', borderRadius: '16px', zIndex: 1 }}>
          <Clock size={36} style={{ color: '#00e5ff', animation: 'spin 2s linear infinite', marginBottom: '12px' }} />
          <div>Retrieving live operational pipeline...</div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ff6b6b', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', zIndex: 1 }}>
          {error}
        </div>
      ) : (
        <>
          {/* ─── ORDERS TRACKER TAB & PROJECT ISSUES TAB VIEW ─── */}
          {mainTab !== 'workload_metrics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1 }}>
              
              {/* Secondary Status toggle sub-tabs (only inside Orders Tracker) */}
              {mainTab === 'orders_tracker' && (
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  {[
                    { id: 'all', label: 'All Orders' },
                    { id: 'nra', label: 'NRA' },
                    { id: 'delivery', label: 'Delivery' },
                    { id: 'cancel', label: 'Cancel' }
                  ].map(sf => {
                    const isActive = trackerFilter === sf.id;
                    return (
                      <button
                        key={sf.id}
                        onClick={() => setTrackerFilter(sf.id as any)}
                        style={{
                          background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                          color: isActive ? '#00e5ff' : 'var(--text-secondary)',
                          border: isActive ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid transparent',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                      >
                        {sf.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ─── DYNAMIC CUSTOM DROPDOWN FILTERS BAR ─── */}
              <div style={{ background: 'rgba(15, 23, 42, 0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, marginRight: '6px' }}>Filters:</span>
                  
                  {/* Service Line Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'service_line' ? null : 'service_line')}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      Service Line {selectedServiceLines.length > 0 && <span style={{ background: '#818cf8', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>{selectedServiceLines.length}</span>} <ExternalLink size={12} style={{ opacity: 0.5 }} />
                    </button>
                    {activeDropdown === 'service_line' && (
                      <div style={{ position: 'absolute', left: 0, top: '38px', background: '#0e1017', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', width: '220px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', color: selectedServiceLines.length === 0 ? '#00e5ff' : '#fff' }}>
                            <input
                              type="checkbox"
                              checked={selectedServiceLines.length === 0}
                              onChange={() => setSelectedServiceLines([])}
                            />
                            All (No Filter)
                          </label>
                          {uniqueServiceLines.map(sl => {
                            const isChecked = selectedServiceLines.includes(sl);
                            return (
                              <label key={sl} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setSelectedServiceLines(prev => prev.filter(x => x !== sl));
                                    } else {
                                      setSelectedServiceLines(prev => [...prev, sl]);
                                    }
                                    // Reset team / name selections when service line shifts to keep hierarchy logical
                                    setSelectedTeams([]);
                                    setSelectedNames([]);
                                  }}
                                />
                                {sl}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      Status {selectedStatuses.length > 0 && <span style={{ background: '#818cf8', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>{selectedStatuses.length}</span>} <ExternalLink size={12} style={{ opacity: 0.5 }} />
                    </button>
                    {activeDropdown === 'status' && (
                      <div style={{ position: 'absolute', left: 0, top: '38px', background: '#0e1017', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', width: '200px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', color: selectedStatuses.length === 0 ? '#00e5ff' : '#fff' }}>
                            <input
                              type="checkbox"
                              checked={selectedStatuses.length === 0}
                              onChange={() => setSelectedStatuses([])}
                            />
                            All (No Filter)
                          </label>
                          {uniqueStatuses.map(s => {
                            const isChecked = selectedStatuses.includes(s);
                            return (
                              <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setSelectedStatuses(prev => prev.filter(x => x !== s));
                                    } else {
                                      setSelectedStatuses(prev => [...prev, s]);
                                    }
                                  }}
                                />
                                {s}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hierarchical Team & Names Dropdown Popover */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'team' ? null : 'team')}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      Team & Names {(selectedTeams.length + selectedNames.length) > 0 && <span style={{ background: '#818cf8', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>{selectedTeams.length + selectedNames.length}</span>} <ExternalLink size={12} style={{ opacity: 0.5 }} />
                    </button>
                    {activeDropdown === 'team' && (
                      <div style={{ position: 'absolute', left: 0, top: '38px', background: '#0e1017', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', width: '280px', zIndex: 100, maxHeight: '350px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px', color: (selectedTeams.length === 0 && selectedNames.length === 0) ? '#00e5ff' : '#fff' }}>
                            <input
                              type="checkbox"
                              checked={selectedTeams.length === 0 && selectedNames.length === 0}
                              onChange={() => {
                                setSelectedTeams([]);
                                setSelectedNames([]);
                              }}
                            />
                            All Teams & Names
                          </label>

                          {/* Dynamic Hierarchical Tree Structure: Teams -> Underneath Names */}
                          {teamHierarchy.map(teamNode => {
                            const isTeamChecked = selectedTeams.includes(teamNode.teamCode);
                            return (
                              <div key={teamNode.teamCode} style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '2px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', color: '#fff' }}>
                                  <input
                                    type="checkbox"
                                    checked={isTeamChecked}
                                    onChange={() => {
                                      if (isTeamChecked) {
                                        setSelectedTeams(prev => prev.filter(x => x !== teamNode.teamCode));
                                        // Also clear child selected names
                                        setSelectedNames(prev => prev.filter(x => !teamNode.names.includes(x)));
                                      } else {
                                        setSelectedTeams(prev => [...prev, teamNode.teamCode]);
                                        // Check all child names as well
                                        setSelectedNames(prev => Array.from(new Set([...prev, ...teamNode.names])));
                                      }
                                    }}
                                  />
                                  <span>{teamNode.teamCode}</span>
                                </label>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '24px', borderLeft: '1px dashed rgba(255,255,255,0.08)', marginLeft: '6px', marginTop: '2px' }}>
                                  {teamNode.names.map(name => {
                                    const isNameChecked = selectedNames.includes(name);
                                    return (
                                      <label key={name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                                        <input
                                          type="checkbox"
                                          checked={isNameChecked}
                                          onChange={() => {
                                            if (isNameChecked) {
                                              setSelectedNames(prev => prev.filter(x => x !== name));
                                              // Uncheck parent team checkbox if a single name is unchecked
                                              setSelectedTeams(prev => prev.filter(x => x !== teamNode.teamCode));
                                            } else {
                                              const updatedNames = [...selectedNames, name];
                                              setSelectedNames(updatedNames);
                                              // Check if all sibling names are checked to auto-check parent
                                              const allSiblingsChecked = teamNode.names.every(n => updatedNames.includes(n));
                                              if (allSiblingsChecked) {
                                                setSelectedTeams(prev => Array.from(new Set([...prev, teamNode.teamCode])));
                                              }
                                            }
                                          }}
                                        />
                                        <span>{name}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Delivery Date Sorting Option */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'deli_date' ? null : 'deli_date')}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      Deli_Date {deliDateSort !== 'none' && <span style={{ background: '#818cf8', borderRadius: '4px', padding: '0 4px', fontSize: '0.65rem' }}>Active</span>} <ExternalLink size={12} style={{ opacity: 0.5 }} />
                    </button>
                    {activeDropdown === 'deli_date' && (
                      <div style={{ position: 'absolute', left: 0, top: '38px', background: '#0e1017', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', width: '180px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button
                            onClick={() => { setDeliDateSort('none'); setActiveDropdown(null); }}
                            style={{ background: deliDateSort === 'none' ? 'rgba(255,255,255,0.08)' : 'transparent', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: '4px', textAlign: 'left', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            No Sorting
                          </button>
                          <button
                            onClick={() => { setDeliDateSort('newest'); setActiveDropdown(null); }}
                            style={{ background: deliDateSort === 'newest' ? 'rgba(255,255,255,0.08)' : 'transparent', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: '4px', textAlign: 'left', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Newest First
                          </button>
                          <button
                            onClick={() => { setDeliDateSort('oldest'); setActiveDropdown(null); }}
                            style={{ background: deliDateSort === 'oldest' ? 'rgba(255,255,255,0.08)' : 'transparent', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: '4px', textAlign: 'left', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            Oldest First
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Columns Filter Selector Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === 'columns' ? null : 'columns')}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                      Columns <span style={{ background: '#818cf8', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>{visibleColumns.length}</span> <ExternalLink size={12} style={{ opacity: 0.5 }} />
                    </button>
                    {activeDropdown === 'columns' && (
                      <div style={{ position: 'absolute', left: 0, top: '38px', background: '#0e1017', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', width: '220px', zIndex: 100, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Toggle Visible Columns</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {allAvailableColumns.map(col => {
                            const isChecked = visibleColumns.includes(col);
                            return (
                              <label key={col} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setVisibleColumns(prev => prev.filter(c => c !== col));
                                    } else {
                                      setVisibleColumns(prev => [...prev, col]);
                                    }
                                  }}
                                />
                                {col}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Text Input Field */}
                <div style={{ display: 'flex', alignItems: 'center', background: '#07070b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '2px 10px', width: '260px' }}>
                  <Eye size={14} style={{ color: 'var(--text-secondary)', marginRight: '6px' }} />
                  <input
                    type="text"
                    placeholder="Search filtered records..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', width: '100%', padding: '6px 0', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Reset/Action Buttons Panel */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedServiceLines([]);
                      setSelectedStatuses([]);
                      setSelectedTeams([]);
                      setSelectedNames([]);
                      setSearchQuery('');
                      setDeliDateSort('none');
                    }}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  >
                    Reset Active Filters
                  </button>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleSaveFilters}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                  >
                    <Save size={14} /> Save Filters
                  </button>

                  <button
                    onClick={() => printTeamPDF(mainTab.toUpperCase() + ' Ledger', filteredRecords)}
                    style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.25)' }}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              </div>

              {/* Data Table Ledger display */}
              <div style={{ background: 'rgba(15, 23, 42, 0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', minHeight: '300px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Operational Ledger Database</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Matching entries: {filteredRecords.length} orders found</span>
                </div>

                {filteredRecords.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 10px', color: 'var(--text-secondary)', background: 'rgba(7, 8, 15, 0.1)', border: '1px dashed rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.82rem' }}>
                    No matching ledger tracking entries found. Clean filters configuration.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', background: 'rgba(7, 8, 15, 0.2)', border: '1px solid rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)' }}>
                          {visibleColumns.map(col => (
                            <th key={col} style={{ padding: '12px 14px', textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map((r, rIdx) => (
                          <tr key={(r['Order ID'] || rIdx) + '-' + rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.01)'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                            {visibleColumns.map(col => {
                              const val = r[col] || '';
                              if (col === 'Status') {
                                const isWip = val.toUpperCase() === 'WIP';
                                const isDel = val.toUpperCase() === 'DELIVERED';
                                const isCan = val.toUpperCase() === 'CANCELLED';
                                const badgeColor = isWip ? '#ff9800' : isDel ? '#4caf50' : isCan ? '#ef4444' : '#607d8b';
                                return (
                                  <td key={col} style={{ padding: '12px 14px' }}>
                                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, background: `${badgeColor}15`, color: badgeColor, border: `1px solid ${badgeColor}30` }}>
                                      {val}
                                    </span>
                                  </td>
                                );
                              }
                              if (col === 'Deadline') {
                                // Calculate countdown specifically from "Delivery Date" column as requested
                                const deliveryDateVal = r['Delivery Date'] || r['Deli_Date'];
                                const statusVal = r['Status'] || '';
                                const timerText = getDeadlineCountdown(deliveryDateVal, statusVal);
                                
                                const isOverdue = timerText === 'Late / Overdue';
                                const isDone = timerText === 'Order Done';
                                const isCancel = timerText === 'Order Cancelled';
                                const clockColor = isOverdue ? '#ef4444' : (isDone ? '#4caf50' : (isCancel ? '#ef4444' : '#00e5ff'));
                                
                                return (
                                  <td key={col} style={{ padding: '12px 14px', fontWeight: 700, color: clockColor }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                      <Clock size={12} /> {timerText}
                                    </span>
                                  </td>
                                );
                              }
                              if (col === 'Order ID') {
                                const link = r['Order Link'] || r['Order Sheet'];
                                return (
                                  <td key={col} style={{ padding: '12px 14px' }}>
                                    {link ? (
                                      <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        {val} <ExternalLink size={10} />
                                      </a>
                                    ) : (
                                      <span style={{ color: '#fff', fontWeight: 600 }}>{val}</span>
                                    )}
                                  </td>
                                );
                              }
                              if (col === 'Amount' || col === 'Value') {
                                return (
                                  <td key={col} style={{ padding: '12px 14px', fontWeight: 700, color: '#fff' }}>
                                    {val}
                                  </td>
                                );
                              }
                              return (
                                <td key={col} style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{val}</td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── WORKLOAD METRICS TAB VIEW ─── */}
          {mainTab === 'workload_metrics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 1 }}>
              
              {/* Owner Portal Greetings Panel */}
              <div style={{ background: 'rgba(15, 23, 42, 0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Owner Portal</span>
                  <h3 style={{ margin: '8px 0 4px', fontSize: '1.25rem', fontWeight: 800 }}>Welcome Back, Refayet Hossen</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Directly managing team workloads, bottleneck alerts, and secure NRA project pipelines.</p>
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', borderRadius: '10px', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total WIP Load</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00e5ff', marginTop: '2px' }}>{activeWip} Tasks</div>
                  </div>
                  <div style={{ background: 'rgba(7, 8, 15, 0.4)', borderRadius: '10px', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>NRA Pipeline</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a855f7', marginTop: '2px' }}>
                      {records.filter(r => r['Service Line']?.toUpperCase() === 'NRA' && r.Status?.toUpperCase() === 'WIP').length} Projects
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline Bottleneck Detected Banner Alert */}
              {overloadedAssignees.length > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle style={{ color: '#ef4444' }} size={20} />
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 700, color: '#ff6b6b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Pipeline Bottleneck Detected</h4>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        One or more teams have exceeded the target WIP threshold (5 orders). Workload redistribution is highly recommended to optimize turnaround time.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const peak = Object.entries(wipByAssignee).sort((a,b)=>b[1]-a[1])[0];
                      if (peak) showToast(`Reallocate active workload away from "${peak[0]}"`, 'info');
                    }}
                    style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ff8a8a', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}
                  >
                    Action Required
                  </button>
                </div>
              )}

              {/* Workload Index bar chart */}
              <div style={{ background: 'rgba(15, 23, 42, 0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 16px', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Visual Team Workload Spread</h3>
                <div style={{ display: 'flex', height: '220px', alignItems: 'flex-end', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', overflowX: 'auto' }}>
                  {Object.entries(wipByAssignee).sort((a,b)=>b[1]-a[1]).map(([team, count]) => {
                    const maxVal = Math.max(...Object.values(wipByAssignee), 1);
                    const barHeightPct = (count / maxVal) * 100;
                    const isOver = count >= 5;
                    const barColor = isOver ? '#ef4444' : count >= 3 ? '#ff9800' : '#10b981';
                    return (
                      <div key={team} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '70px', flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: barColor, marginBottom: '6px' }}>{count}</span>
                        <div style={{ width: '100%', height: `${160 * (barHeightPct/100)}px`, minHeight: '6px', background: `linear-gradient(0deg, ${barColor}15 0%, ${barColor} 100%)`, borderRadius: '4px 4px 0 0', border: `1px solid ${barColor}aa`, boxShadow: `0 0 15px ${barColor}20` }} />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'center', wordBreak: 'break-all', height: '32px', overflow: 'hidden' }}>{team}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Workload Optimization Advisor */}
              <div style={{ background: 'rgba(15, 23, 42, 0.2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#a855f7', textTransform: 'uppercase', fontWeight: 700 }}>Workload Optimization Advisor</h4>
                <div className={styles.grid3}>
                  <div style={{ background: 'rgba(7, 8, 15, 0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>RESOURCE ALLOCATION</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '4px', color: overloadedAssignees.length > 0 ? '#ff6b6b' : '#10b981' }}>
                      {overloadedAssignees.length} Overloaded / {Object.keys(wipByAssignee).length - overloadedAssignees.length} Balanced
                    </div>
                  </div>
                  <div style={{ background: 'rgba(7, 8, 15, 0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>HIGH VALUE PIPELINE</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '4px', color: '#eab308' }}>
                      {(() => {
                        const highestVal = Object.entries(wipValueByAssignee).sort((a,b)=>b[1]-a[1])[0];
                        return highestVal ? `Team ${highestVal[0]} ($${highestVal[1].toLocaleString()})` : 'None';
                      })()}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(7, 8, 15, 0.3)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>OPTIMIZATION SUGGESTION</div>
                    <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '4px', lineHeight: '1.3' }}>
                      {overloadedAssignees.length > 0 ? (
                        <span>Redistribute tasks from overloaded teams to balance throughput.</span>
                      ) : (
                        <span style={{ color: '#10b981' }}>Operational workloads are currently fully optimized!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Workload grid cards detail */}
              <div className={styles.grid4}>
                {Object.entries(wipByAssignee).sort((a, b) => b[1] - a[1]).map(([team, count]) => {
                  const val = wipValueByAssignee[team] || 0;
                  const members = wipMembersByAssignee[team] || [];
                  const isOver = count >= 5;
                  const pct = Math.min(100, (count / 5) * 100);
                  const loadColor = isOver ? '#ef4444' : count >= 3 ? '#ff9800' : '#10b981';
                  
                  return (
                    <div key={team} style={{ background: 'rgba(15, 23, 42, 0.25)', border: `1px solid ${isOver ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
                      {isOver && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: '#ef4444' }} />
                      )}
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>TEAM {team}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: loadColor }}>{count} Active</span>
                        </div>
                        <h4 style={{ margin: '8px 0 4px', fontSize: '0.95rem', fontWeight: 800 }}>{team}</h4>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Members: {members.length > 0 ? members.join(', ') : 'Unspecified'}
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Load Factor</span>
                          <span style={{ fontWeight: 700, color: loadColor }}>{pct === 100 ? '100% (Overloaded)' : `${pct.toFixed(0)}%`}</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: loadColor, borderRadius: '2px' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Active Value</span>
                        <span style={{ fontWeight: 700, color: '#4caf50' }}>৳{val.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
