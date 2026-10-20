const COLORS = {
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  observed: "bg-orange-100 text-orange-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  delivered: "bg-purple-100 text-purple-700",
};

export default function StatusBadge({ state, label }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${COLORS[state] || "bg-slate-100 text-slate-700"}`}>
      {label || state}
    </span>
  );
}
