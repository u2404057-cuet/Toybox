import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-bold text-charcoal">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-cobalt/20 transition-all ${
          error ? 'border-coral focus:border-coral' : 'border-border focus:border-cobalt'
        }`}
        {...props}
      />
      {error && <span className="text-sm text-coral">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
