export default function StatCard({ title, value, variant = 'primary' }) {
  const variants = {
    primary: 'bg-cobalt text-white',
    accent: 'bg-yellow text-cobalt',
    danger: 'bg-coral text-white',
  };

  return (
    <div className={`p-6 rounded-2xl shadow-sm ${variants[variant]}`}>
      <p className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">{title}</p>
      <h3 className="text-3xl font-black font-display">{value}</h3>
    </div>
  );
}
