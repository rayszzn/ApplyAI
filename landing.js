// ApplyAI Landing Page v1.3

const CHROME_STORE_URL    = 'https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID';
const STRIPE_LINK         = 'https://buy.stripe.com/cNidR2ebb80Pfwl01r1sQ00';

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initButtons();
  await loadStats();
});

// ── Theme ──
function initTheme() {
  const saved = localStorage.getItem('applyai-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  document.getElementById('themeToggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('applyai-theme', next);
  });
}

// ── CTA Buttons ──
function initButtons() {
  document.getElementById('tryNowBtn')?.addEventListener('click', () => {
    window.open(CHROME_STORE_URL, '_blank');
  });

  document.getElementById('downloadBtn')?.addEventListener('click', () => {
    window.open(CHROME_STORE_URL, '_blank');
  });

  document.getElementById('navUpgrade')?.addEventListener('click', (e) => {
    window.open(STRIPE_LINK, '_blank');
  });

  document.getElementById('pricingUpgrade')?.addEventListener('click', () => {
    window.open(STRIPE_LINK, '_blank');
  });
}

// ── Stats (only available when opened from inside the extension) ──
async function loadStats() {
  if (typeof chrome === 'undefined' || !chrome.storage) return;

  const data = await chrome.storage.local.get([
    'usageCount', 'isPro', 'cvProfiles', 'genericQA'
  ]);

  const usageCount  = data.usageCount || 0;
  const isPro       = data.isPro || false;
  const cvProfiles  = data.cvProfiles || [];
  const qaCount     = (data.genericQA || []).length;
  const hasCV       = cvProfiles.length > 0;

  animateCount('statUsage', usageCount);
  animateCount('statQA', qaCount);

  document.getElementById('navPlan').textContent = isPro ? 'Pro Plan ✓' : 'Free Plan';

  // Show setup section only when opened from extension
  const setupSection = document.getElementById('setupSection');
  if (setupSection) setupSection.style.display = 'block';

  updateSetupCard('cvIcon', 'cvCheck', 'cvStatus', hasCV,
    hasCV
      ? `${cvProfiles.length} CV${cvProfiles.length > 1 ? 's' : ''} uploaded ✓`
      : 'No CV uploaded — add in extension popup');

  updateSetupCard('qaIcon', 'qaCheck', 'qaStatus', qaCount > 0,
    qaCount > 0 ? `${qaCount} pair${qaCount !== 1 ? 's' : ''} stored ✓` : '0 pairs — add in Q&A Bank');
}

function updateSetupCard(iconId, checkId, statusId, isDone, statusText) {
  const icon   = document.getElementById(iconId);
  const check  = document.getElementById(checkId);
  const status = document.getElementById(statusId);
  const card   = icon?.closest('.setup-card');
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
  const step  = Math.max(1, Math.ceil(target / 30));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}
