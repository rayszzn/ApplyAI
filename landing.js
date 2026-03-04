// ApplyAI Landing Page JS — v1.2

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  await loadStats();
  initUpgradeButtons();
});

// ── Theme ──
function initTheme() {
  // Default is light — only switch if user previously chose dark
  const saved = localStorage.getItem('applyai-theme') || 'dark';
  applyTheme(saved);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('applyai-theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

// ── Stats ──
async function loadStats() {
  const data = await chrome.storage.local.get([
    'usageCount', 'isPro', 'apiKey', 'cvText', 'cvFileName', 'genericQA'
  ]);

  const usageCount = data.usageCount || 0;
  const isPro = data.isPro || false;
  const hasApiKey = !!(data.apiKey?.trim());
  const hasCV = !!(data.cvText?.trim());
  const qaCount = (data.genericQA || []).length;

  animateCount('statUsage', usageCount);
  animateCount('statQA', qaCount);

  document.getElementById('navPlan').textContent = isPro ? 'Pro Plan ✓' : 'Free Plan';

  updateSetupCard('apiKeyIcon', 'apiKeyCheck', 'apiKeyStatus', hasApiKey,
    hasApiKey ? 'Configured ✓' : 'Not configured — add in extension settings');
  updateSetupCard('cvIcon', 'cvCheck', 'cvStatus', hasCV,
    hasCV ? `Uploaded (${(data.cvText?.length || 0).toLocaleString()} chars) ✓` : 'Not uploaded — add in extension popup');
  updateSetupCard('qaIcon', 'qaCheck', 'qaStatus', qaCount > 0,
    qaCount > 0 ? `${qaCount} pair${qaCount !== 1 ? 's' : ''} stored ✓` : '0 pairs — add in Q&A Bank tab');
}

function updateSetupCard(iconId, checkId, statusId, isDone, statusText) {
  const icon = document.getElementById(iconId);
  const check = document.getElementById(checkId);
  const status = document.getElementById(statusId);
  const card = icon?.closest('.setup-card');
  if (isDone) {
    icon?.classList.replace('setup-icon-pending', 'setup-icon-done');
    if (check) check.textContent = '✓';
    card?.classList.add('done');
  }
  if (status) status.textContent = statusText;
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el || target === 0) return;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 30));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

// ── Upgrade ──
function initUpgradeButtons() {
  const STRIPE_LINK = 'https://buy.stripe.com/cNidR2ebb80Pfwl01r1sQ00';
  document.getElementById('navUpgrade')?.addEventListener('click', () => window.open(STRIPE_LINK, '_blank'));
  document.getElementById('pricingUpgrade')?.addEventListener('click', () => window.open(STRIPE_LINK, '_blank'));
}
