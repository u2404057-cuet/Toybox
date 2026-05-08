export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200';
  
  const variants = {
    primary: 'bg-yellow text-cobalt hover:bg-[#E5B515] px-6 py-3',
    secondary: 'bg-cobalt text-white hover:bg-[#152D54] px-6 py-3',
    outline: 'border-2 border-cobalt text-cobalt hover:bg-cobalt hover:text-white px-6 py-3',
    danger: 'bg-coral text-white hover:bg-[#D43B2E] px-6 py-3',
    ghost: 'text-muted hover:text-charcoal px-4 py-2',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
