import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const navItems = [
  ['dashboard', 'Dashboard', 'Overview'],
  ['transactions', 'Transactions', 'XAI audit'],
  ['simulator', 'Live Demo', 'Test a payment'],
  ['analytics', 'Graph & Map', 'Network signals'],
  ['upload', 'Data Upload', 'CSV pipeline']
];

const transactions = [
  { id: '98412', merchant: 'CryptoExchange', country: 'Nigeria', device: 'Unknown Android', score: 94, action: 'Block', amount: '₸850,000', reason: 'Geo shift + amount ratio' },
  { id: '98413', merchant: 'Kaspi Market', country: 'Kazakhstan', device: 'iPhone 14', score: 8, action: 'Approve', amount: '₸12,000', reason: 'Normal profile' },
  { id: '98414', merchant: 'P2P_Unverified', country: 'Turkey', device: 'New Chrome', score: 67, action: 'Challenge', amount: '₸78,000', reason: 'New device + velocity' },
  { id: '98415', merchant: 'Local Store 21', country: 'Kazakhstan', device: 'Samsung S24', score: 21, action: 'Approve', amount: '₸9,500', reason: 'Low deviation' },
  { id: '98416', merchant: 'CryptoExchange', country: 'Brazil', device: 'VPN / Proxy', score: 88, action: 'Block', amount: '₸420,000', reason: 'VPN + merchant profile' }
];

function scoreFor(values) {
  let score = 9;
  if (Number(values.amount) > 250000) score += 34;
  else if (Number(values.amount) > 70000) score += 22;
  if (values.country !== 'Kazakhstan') score += 18;
  if (values.device === 'Unknown device') score += 18;
  if (values.device === 'VPN / Proxy') score += 24;
  if (Number(values.frequency) >= 5) score += 15;
  return Math.min(score, 99);
}

function App() {
  const [page, setPage] = useState('dashboard');
  const [selected, setSelected] = useState(transactions[0]);
  const [threshold, setThreshold] = useState(56);
  const [form, setForm] = useState({ amount: 850000, country: 'Nigeria', device: 'VPN / Proxy', frequency: 6 });
  const liveScore = useMemo(() => scoreFor(form), [form]);
  const liveAction = liveScore >= 72 ? 'Block' : liveScore >= 35 ? 'Challenge' : 'Approve';

  const updateForm = (key, value) => setForm(current => ({ ...current, [key]: value }));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">I</span><div><strong>Ichnora</strong><small>FRAUD HUNTER AI</small></div></div>
        <div className="workspace-label">WORKSPACE <span>LIVE</span></div>
        <nav>{navItems.map(([id, label, hint]) => <button key={id} className={page === id ? 'nav-item active' : 'nav-item'} onClick={() => setPage(id)}><span className="nav-icon">{id === 'dashboard' ? '◈' : id === 'transactions' ? '▤' : id === 'simulator' ? '⌁' : id === 'analytics' ? '◎' : '⇧'}</span><span><b>{label}</b><small>{hint}</small></span></button>)}</nav>
        <div className="side-footer"><div className="status-dot"></div><span>Model online</span><small>v0.1 demo</small></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div><p className="eyebrow">FINTECH RISK CONTROL / 18 SEP 2026</p><h1>{page === 'dashboard' ? 'Good morning, analyst.' : navItems.find(item => item[0] === page)?.[1]}</h1></div><div className="top-actions"><button className="icon-button">⌕</button><button className="icon-button">⌘</button><div className="avatar">AM</div></div></header>

        {page === 'dashboard' && <Dashboard threshold={threshold} setThreshold={setThreshold} />}
        {page === 'transactions' && <Transactions selected={selected} setSelected={setSelected} />}
        {page === 'simulator' && <Simulator form={form} updateForm={updateForm} liveScore={liveScore} liveAction={liveAction} />}
        {page === 'analytics' && <Analytics />}
        {page === 'upload' && <Upload />}
      </main>
    </div>
  );
}

function Dashboard({ threshold, setThreshold }) {
  return <section className="page-grid">
    <div className="hero-card"><div><p className="eyebrow light">MODEL SNAPSHOT</p><h2>Protection is a<br /><em>moving target.</em></h2><p className="muted-light">Ichnora watches behavior, not just rules.</p></div><div className="hero-orbit"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="orbit-core">94<span>%</span><small>HIGH RISK</small></div></div></div>
    <div className="kpi-grid"><Kpi label="Fraud loss saved" value="₸18.7M" delta="+14.8%" positive /><Kpi label="False positive rate" value="2.4%" delta="−0.8%" positive /><Kpi label="Processed today" value="100,000" delta="+4.2%" positive /><Kpi label="Avg. risk score" value="31%" delta="−3.1%" positive /></div>
    <div className="panel chart-panel"><div className="panel-head"><div><p className="eyebrow">RISK ACTIVITY</p><h3>Risk signals over time</h3></div><span className="period-pill">Last 24 hours⌄</span></div><div className="chart"><div className="chart-y"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><svg viewBox="0 0 700 220" preserveAspectRatio="none" role="img" aria-label="Risk activity line chart"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7be0b4" stopOpacity=".24"/><stop offset="1" stopColor="#7be0b4" stopOpacity="0"/></linearGradient></defs><path d="M0 172 C45 164 62 148 95 157 S150 135 184 143 S234 122 271 139 S315 93 348 119 S400 112 435 124 S490 78 520 95 S565 50 595 79 S650 32 700 55 L700 220 L0 220Z" fill="url(#area)"/><path d="M0 172 C45 164 62 148 95 157 S150 135 184 143 S234 122 271 139 S315 93 348 119 S400 112 435 124 S490 78 520 95 S565 50 595 79 S650 32 700 55" fill="none" stroke="#7be0b4" strokeWidth="3"/><path d="M0 188 C60 182 85 177 130 181 S205 171 255 178 S335 154 390 171 S490 147 545 159 S630 130 700 138" fill="none" stroke="#f2bc79" strokeWidth="2" strokeDasharray="5 8"/></svg></div><div className="chart-legend"><span><i className="legend-green"></i>Suspicious activity</span><span><i className="legend-amber"></i>Baseline</span></div></div>
    <div className="panel action-panel"><div className="panel-head"><div><p className="eyebrow">ACTION BREAKDOWN</p><h3>Decisions today</h3></div><span className="score-badge">Live</span></div><div className="donut-wrap"><div className="donut"><div><strong>100K</strong><small>transactions</small></div></div><div className="donut-legend"><Legend color="green" label="Approve" value="91.5%" /><Legend color="amber" label="Challenge" value="5.8%" /><Legend color="red" label="Block" value="2.7%" /></div></div></div>
    <div className="panel trade-panel"><div className="panel-head"><div><p className="eyebrow">COST FUNCTION</p><h3>Safety / friction balance</h3></div><span className="score-badge">{threshold}% sensitivity</span></div><p className="panel-note">Move the threshold to see how the business trade-off changes.</p><input type="range" min="20" max="85" value={threshold} onChange={e => setThreshold(e.target.value)} /><div className="trade-values"><div><span className="value-red">₸2.1M</span><small>fraud exposure</small></div><div><span className="value-amber">2.4%</span><small>customer friction</small></div><div><span className="value-green">₸18.7M</span><small>saved this month</small></div></div></div>
  </section>;
}

function Kpi({ label, value, delta, positive }) { return <div className="kpi"><span>{label}</span><strong>{value}</strong><small className={positive ? 'positive' : ''}>{delta} <em>vs last period</em></small></div>; }
function Legend({ color, label, value }) { return <div className="legend-row"><i className={`legend-${color}`}></i><span>{label}</span><strong>{value}</strong></div>; }

function Transactions({ selected, setSelected }) { return <section className="content-stack"><div className="section-intro"><div><p className="eyebrow">XAI AUDIT / 100,000 RECORDS</p><h2>Transaction monitor</h2><p>Review the signals behind every decision.</p></div><button className="outline-button">↓ Export report</button></div><div className="panel table-panel"><div className="table-toolbar"><div className="search">⌕ <input placeholder="Search transaction or merchant" /></div><button className="filter-button">All actions⌄</button><button className="filter-button">Risk: any⌄</button></div><div className="table-scroll"><table><thead><tr><th>TRANSACTION</th><th>MERCHANT</th><th>LOCATION</th><th>AMOUNT</th><th>RISK SCORE</th><th>ACTION</th></tr></thead><tbody>{transactions.map(tx => <tr key={tx.id} onClick={() => setSelected(tx)} className={selected.id === tx.id ? 'selected-row' : ''}><td><b>#{tx.id}</b><small>Today, 14:32</small></td><td>{tx.merchant}<small>{tx.device}</small></td><td>{tx.country}</td><td>{tx.amount}</td><td><div className="risk-cell"><div className="mini-bar"><span className={tx.score > 70 ? 'high' : tx.score > 35 ? 'medium' : 'low'} style={{ width: `${tx.score}%` }}></span></div><b>{tx.score}%</b></div></td><td><span className={`action-pill ${tx.action.toLowerCase()}`}>{tx.action}</span></td></tr>)}</tbody></table></div></div><div className="panel xai-panel"><div className="xai-score"><span>SELECTED RISK</span><strong>{selected.score}%</strong><small>{selected.action.toUpperCase()}</small></div><div className="xai-copy"><p className="eyebrow">EXPLAINABLE AI / #{selected.id}</p><h3>Why this transaction was flagged</h3><p>{selected.reason}. The model compares the event with the customer's behavioral baseline before choosing an action.</p><div className="factor-list"><Factor label="Geo_Speed" value="+42%" width="82%" /><Factor label="Amount_Ratio" value="+35%" width="68%" /><Factor label="Device novelty" value="+17%" width="42%" /></div></div></div></section>; }
function Factor({ label, value, width }) { return <div className="factor"><span>{label}</span><div><i style={{ width }}></i></div><b>{value}</b></div>; }

function Simulator({ form, updateForm, liveScore, liveAction }) { return <section className="content-stack"><div className="section-intro"><div><p className="eyebrow">REAL-TIME TRANSACTION CHECK</p><h2>Live simulator</h2><p>Try three fraud scenarios with one click.</p></div><span className="api-status"><i></i>API response: 84ms</span></div><div className="sim-grid"><div className="panel form-panel"><div className="preset-row"><button onClick={() => { updateForm('amount', 12000); updateForm('country', 'Kazakhstan'); updateForm('device', 'iPhone 14'); updateForm('frequency', 1); }}>Safe purchase</button><button onClick={() => { updateForm('amount', 850000); updateForm('country', 'Nigeria'); updateForm('device', 'VPN / Proxy'); updateForm('frequency', 6); }}>Account takeover</button><button onClick={() => { updateForm('amount', 350000); updateForm('country', 'Kazakhstan'); updateForm('device', 'iPhone 14'); updateForm('frequency', 8); }}>Social engineering</button></div><div className="form-grid"><label>Amount (₸)<input type="number" value={form.amount} onChange={e => updateForm('amount', e.target.value)} /></label><label>Country<select value={form.country} onChange={e => updateForm('country', e.target.value)}><option>Kazakhstan</option><option>Nigeria</option><option>Brazil</option><option>Turkey</option></select></label><label>Device<select value={form.device} onChange={e => updateForm('device', e.target.value)}><option>iPhone 14</option><option>Unknown device</option><option>VPN / Proxy</option></select></label><label>Transactions / 10 min<input type="number" value={form.frequency} onChange={e => updateForm('frequency', e.target.value)} /></label></div><button className="analyze-button">Analyze transaction <span>↗</span></button></div><div className={`panel verdict-panel ${liveAction.toLowerCase()}`}><p className="eyebrow">MODEL VERDICT</p><div className="verdict-score"><strong>{liveScore}%</strong><span>risk score</span></div><div className={`verdict-action ${liveAction.toLowerCase()}`}>{liveAction === 'Challenge' ? 'Challenge / 2FA' : liveAction}</div><p className="verdict-text">{liveAction === 'Block' ? 'Hold this transaction. The combination of device, location and amount is outside the expected profile.' : liveAction === 'Challenge' ? 'Ask for biometric confirmation before releasing the funds.' : 'The transaction matches the customer’s normal behavioral profile.'}</p><div className="confidence"><span>Model confidence</span><b>0.91</b></div></div></div></section>; }

function Analytics() { return <section className="content-stack"><div className="section-intro"><div><p className="eyebrow">BONUS MODULE</p><h2>Graph & map signals</h2><p>See how devices, IPs and merchants connect.</p></div><button className="outline-button">RU / KZ / EN</button></div><div className="analytics-grid"><div className="panel network-panel"><div className="panel-head"><div><p className="eyebrow">LINK ANALYSIS</p><h3>Suspicious network</h3></div><span className="score-badge">12 nodes</span></div><div className="network"><span className="node center">IP<br />185.2</span><span className="node n1">U-104</span><span className="node n2">U-208</span><span className="node n3">D-77</span><span className="node n4">M-42</span><i className="line l1"></i><i className="line l2"></i><i className="line l3"></i><i className="line l4"></i></div></div><div className="panel map-panel"><div className="panel-head"><div><p className="eyebrow">GEO ANOMALIES</p><h3>Activity by location</h3></div></div><div className="map"><span className="map-dot kz">KZ</span><span className="map-dot br">BR</span><span className="map-dot ng">NG</span><span className="map-line"></span><div className="map-land"></div></div><div className="map-caption"><span><i className="legend-red"></i>High-risk regions</span><span>Geo-shift detected: 14</span></div></div></div></section>; }
function Upload() { return <section className="content-stack"><div className="section-intro"><div><p className="eyebrow">DATA PIPELINE</p><h2>Upload transactions</h2><p>Load a CSV or Parquet file to refresh the model snapshot.</p></div></div><div className="panel upload-panel"><div className="upload-icon">⇧</div><h3>Drop your transaction file here</h3><p>CSV or Parquet · up to 100,000 rows for the MVP</p><button className="analyze-button">Choose file <span>↗</span></button><small className="upload-note">Demo mode keeps your data local until the FastAPI pipeline is connected.</small></div></section>; }

createRoot(document.getElementById('root')).render(<App />);
