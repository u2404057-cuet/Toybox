export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-border text-charcoal',
    primary: 'bg-cobalt text-white',
    accent: 'bg-yellow text-cobalt',
    success: 'bg-success/10 text-success',
    danger: 'bg-coral/10 text-coral',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
