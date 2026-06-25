.app {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

h1.app-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.02em;
}
h1.app-title .accent { color: var(--lime); font-style: italic; font-weight: 600; }
h1.app-title svg { color: var(--lime); }

.label {
  font-family: var(--font);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.top-panel {
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 1.1rem 1.25rem;
  margin-bottom: 1.2rem;
}

.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 1.2rem;
  overflow-x: auto;
  padding: 5px;
  background: var(--bg-panel);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-soft);
}
.tabbtn {
  flex: 1;
  min-width: 64px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  padding: 8px 2px;
  font-family: var(--font);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-secondary);
  transition: background 0.15s, color 0.15s;
}
.tabbtn svg { display: block; margin: 0 auto 3px; width: 18px; height: 18px; }
.tabbtn:hover { color: var(--text-primary); }
.tabbtn.active { background: var(--lime); color: var(--lime-text); }

input:not([type="checkbox"]), select, textarea {
  font-size: 14px;
  padding: 9px 11px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-primary);
  width: 100%;
}
input::placeholder, textarea::placeholder { color: var(--text-tertiary); }
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--lime);
  box-shadow: 0 0 0 2px var(--lime-dim);
}
input[type="checkbox"] {
  width: 15px;
  height: 15px;
  accent-color: var(--lime);
  flex-shrink: 0;
}

button {
  font-size: 13px;
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s, transform 0.05s, border-color 0.15s;
}
button:hover { background: var(--bg-card-hover); border-color: var(--text-tertiary); }
button:active { transform: scale(0.98); }
.btn-primary {
  background: var(--lime) !important;
  color: var(--lime-text) !important;
  border-color: var(--lime) !important;
  font-weight: 700;
}
.btn-primary:hover { background: #c4e23c !important; }

.row { display: flex; gap: 8px; }
.field { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
.field label { font-size: 12px; color: var(--text-secondary); }

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.1rem;
  margin-bottom: 10px;
}
.card.is-favorite { border-color: var(--lime); }

.badge {
  font-family: var(--font);
  font-size: 11px;
  background: var(--cyan);
  color: #06262a;
  padding: 3px 9px;
  border-radius: var(--radius-md);
  display: inline-block;
  font-weight: 700;
}
.badge.salt { background: var(--coral); color: #2c0a08; }

.tag {
  font-family: var(--font);
  font-size: 10px;
  background: var(--bg-pill);
  color: var(--purple);
  padding: 3px 9px;
  border-radius: var(--radius-md);
  display: inline-block;
  border: 1px solid var(--purple);
}

.star { font-size: 17px; cursor: default; }
.star.interactive { cursor: pointer; }
.star.filled { color: var(--gold); }
.star.empty { color: var(--border); }

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1rem;
}
.metric-card p:first-child { font-family: var(--font); font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-secondary); margin: 0 0 6px; }
.metric-card p:last-child { font-size: 22px; font-weight: 600; margin: 0; color: var(--lime); }
.metric-card.c1 p:last-child { color: var(--lime); }
.metric-card.c2 p:last-child { color: var(--cyan); }
.metric-card.c3 p:last-child { color: var(--coral); }
.metric-card.c4 p:last-child { color: var(--purple); }
.metric-card.c5 p:last-child { color: var(--gold); }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin-bottom: 1.5rem;
}

.muted { color: var(--text-secondary); font-size: 13px; }
.tiny { color: var(--text-tertiary); font-size: 12px; font-family: var(--font); }
a { color: var(--cyan); text-decoration: none; }
a:hover { text-decoration: underline; }
.empty-state { text-align: center; padding: 2rem 0; color: var(--text-secondary); font-size: 14px; }
.icon-btn { padding: 6px 8px; border-color: var(--border); color: var(--text-secondary); }
.icon-btn:hover { color: var(--text-primary); border-color: var(--text-tertiary); }

.angler-group { margin-bottom: 14px; }
.angler-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: var(--bg-panel);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  cursor: pointer;
  color: var(--text-primary);
  text-align: left;
}
.angler-group-header:hover { background: var(--bg-card-hover); }
.angler-group-header .chev { transition: transform 0.15s; color: var(--text-secondary); }
.angler-group-header.collapsed .chev { transform: rotate(-90deg); }
.angler-group-name { font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; }
.angler-group-count { font-family: var(--font); font-size: 11px; color: var(--text-secondary); background: var(--bg-card); padding: 2px 8px; border-radius: 10px; }
.angler-group-body { padding-top: 10px; }

.footnote { text-align: center; margin-top: 1.5rem; margin-bottom: 0; }
