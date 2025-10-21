import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReferralInfo, updateReferralAlias, messageClear as authMessageClear } from '../store/Reducers/authReducer';
import {
  createWithdrawRequest,
  getWithdrawRequests,
  messageClear as withdrawMessageClear
} from '../store/Reducers/withdrawReducer'; // NEW
import toast from 'react-hot-toast';

const MIN_WITHDRAW = 500;

const Referral = () => {
  const dispatch = useDispatch();
  const { referral, loader, successMessage, errorMessage } = useSelector(s => s.auth);
  const { requests, wLoader, successMessage: wSuccess, errorMessage: wError } = useSelector(s => s.withdraw || {});
  const [alias, setAlias] = useState('');
  const [aliasError, setAliasError] = useState('');
  const [copied, setCopied] = useState(false);

  // NEW: Withdraw modal states
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const balance = referral?.balance || 0;

  useEffect(() => {
    dispatch(getReferralInfo());
    dispatch(getWithdrawRequests()); // NEW: fetch user requests
  }, [dispatch]);

  // Toasts (auth)
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(authMessageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(authMessageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Toasts (withdraw)
  useEffect(() => {
    if (wSuccess) {
      toast.success(wSuccess);
      dispatch(withdrawMessageClear());
      // Success হলে modal close + list refresh
      setWithdrawOpen(false);
      setAmount('');
      dispatch(getWithdrawRequests());
      // চাইলে ব্যালেন্স রিফ্রেশ:
      dispatch(getReferralInfo());
    }
    if (wError) {
      toast.error(wError);
      dispatch(withdrawMessageClear());
    }
  }, [wSuccess, wError, dispatch]);

  useEffect(() => {
    setAlias(referral?.code || '');
  }, [referral?.code]);

  useEffect(() => {
    if (!alias) return setAliasError('');
    const valid = /^[a-z0-9-]{3,30}$/.test(alias);
    setAliasError(valid ? '' : 'Use 3–30 chars: lowercase letters, numbers, hyphen');
  }, [alias]);

  const onSave = () => {
    const next = alias.trim().toLowerCase();
    if (!next) return toast.error('Alias required');
    if (aliasError) return toast.error(aliasError);
    if (next === (referral?.code || '')) return toast('No changes to save');
    dispatch(updateReferralAlias(next));
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(referral?.link || '');
      setCopied(true);
      toast.success('Copied!');
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error('Copy failed');
    }
  };

  const isSaveDisabled = loader || !!aliasError || !alias || alias === (referral?.code || '');

  // Withdraw validations
  const amountNum = useMemo(() => Number(amount || 0), [amount]);
  const amountError = useMemo(() => {
    if (!withdrawOpen) return '';
    if (!amount) return 'Amount is required';
    if (Number.isNaN(amountNum)) return 'Invalid amount';
    if (amountNum < MIN_WITHDRAW) return `Minimum ৳${MIN_WITHDRAW}`;
    if (amountNum > balance) return 'Amount exceeds balance';
    return '';
  }, [amount, amountNum, balance, withdrawOpen]);

  const canWithdraw = balance >= MIN_WITHDRAW;
  const canSubmitWithdraw = !wLoader && !amountError && amountNum >= MIN_WITHDRAW;

  const openWithdraw = () => {
    setAmount(String(Math.min(balance, Math.max(MIN_WITHDRAW, MIN_WITHDRAW))));
    setWithdrawOpen(true);
  };

  const submitWithdraw = () => {
    if (amountError) {
      toast.error(amountError);
      return;
    }
    dispatch(createWithdrawRequest({ amount: amountNum }));
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="w-[95%] max-w-3xl mx-auto py-4">
        <h2 className="text-lg md:text-2xl font-semibold text-slate-900 mb-4">My Referral</h2>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-6">
          {/* Referral link */}
          <div className="space-y-2">
            <label htmlFor="referral-link" className="block text-sm font-medium text-slate-700">Referral link</label>
            <div className="relative">
              <input
              id="referral-link"
    name="referralLink"
                readOnly
                className="w-full px-3 py-2 pr-[92px] rounded-lg border border-slate-300 bg-slate-50 text-slate-800 font-mono text-sm tracking-tight truncate focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={referral?.link || ''}
              />
              <button
                onClick={onCopy}
                disabled={!referral?.link}
                title="Copy"
                className="absolute right-1 top-1.5 inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-60 cursor-pointer"
              >
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Alias */}
          <div className="space-y-2">
            <label htmlFor="alias" className="block text-sm font-medium text-slate-700">
             custom code
            </label>
            <div className="flex gap-2">
              <input
                id="alias"
                className={`flex-1 px-3 py-2 rounded-lg border ${aliasError ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-indigo-500'
                  } bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2`}
                value={alias}
                onChange={(e) =>
                  setAlias(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '') // অ্যালাওড নয় এমন ক্যারেক্টার সরিয়ে দিচ্ছি
                  )
                }
                placeholder="my-name-123"
                autoComplete="off"
                spellCheck="false"
                pattern="^[a-z0-9-]{3,30}$"
              />
              <button
                disabled={isSaveDisabled}
                onClick={onSave}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-emerald-700 disabled:opacity-60"
              >
                {loader && (
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loader ? 'Saving...' : 'Save'}
              </button>
            </div>
            <p className={`text-xs ${aliasError ? 'text-rose-600' : 'text-slate-500'}`}>
              {aliasError || 'Use 3–30 chars: lowercase letters, numbers, hyphen'}
            </p>
          </div>
        </div>

        {/* Stats + Withdraw */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            icon={<UsersIcon className="h-5 w-5 text-indigo-600" />}
            label="Total Signups"
            value={referral?.totalSignups || 0}
          />
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center h-10 w-10 rounded-lg bg-slate-100">
                  <WalletIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Referral Balance</div>
                  <div className="text-xl font-semibold text-slate-900">৳ {balance}</div>
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <button
                  onClick={openWithdraw}
                  disabled={!canWithdraw}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-white text-sm font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                  title={canWithdraw ? 'Request withdraw' : `Minimum ৳${MIN_WITHDRAW} required`}
                >
                  Withdraw Request
                </button>
                <h4>Or, Contact with admin</h4>
              </div>
            </div>
            {!canWithdraw && (
              <p className="mt-2 text-xs text-slate-500">Minimum balance to withdraw: ৳{MIN_WITHDRAW}</p>
            )}
          </div>
        </div>

        {/* Withdraw requests history */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-900">Withdraw Requests</h3>
            <button
              onClick={() => dispatch(getWithdrawRequests())}
              className="text-xs text-indigo-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          {(!requests || requests.length === 0) ? (
            <p className="text-sm text-slate-500">No withdraw requests yet.</p>
          ) : (
            <div className="space-y-2">
              {requests.slice(0, 8).map((r) => (
                <div key={r._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center gap-3">
                    <MoneyIcon className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">৳ {r.amount}</div>
                      <div className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Withdraw Modal */}
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => !wLoader && setWithdrawOpen(false)}
        amount={amount}
        setAmount={setAmount}
        minAmount={MIN_WITHDRAW}
        maxAmount={balance}
        error={amountError}
        loading={wLoader}
        onSubmit={submitWithdraw}
      />

    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="grid place-items-center h-10 w-10 rounded-lg bg-slate-100">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-xl font-semibold text-slate-900">{value}</div>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded border ${map[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {status?.toUpperCase()}
    </span>
  );
};

// Withdraw modal
const WithdrawModal = ({ open, onClose, amount, setAmount, minAmount, maxAmount, error, loading, onSubmit }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-base font-semibold text-slate-900">Withdraw Request</h4>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
          </div>
          <div className="p-5 space-y-3">
            <label className="text-sm text-slate-700">Amount</label>
            <input
              type="number"
              inputMode="numeric"
              min={minAmount}
              max={maxAmount}
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-indigo-500'} focus:outline-none focus:ring-2`}
              placeholder={`e.g. ${minAmount}`}
            />
            <p className={`text-xs ${error ? 'text-rose-600' : 'text-slate-500'}`}>
              {error || `Minimum ৳${minAmount}. Available: ৳${maxAmount}.`}
            </p>
          </div>
          <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button onClick={onClose} disabled={loading} className="px-3 py-2 text-sm rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-60">
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !!error}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Icons */
const CopyIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const UsersIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const WalletIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 7H5a3 3 0 0 0-3 3v5a3 3 0 0 0 3 3h15a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
    <path d="M16 11h4" />
  </svg>
);

const MoneyIcon = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default Referral;