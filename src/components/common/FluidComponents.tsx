import React from 'react';

// 🎯 COMPOSANTS FLUIDES JUTRANS AVEC DAISYUI

interface FluidCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'jutrans';
  hover?: boolean;
  animation?: 'fade' | 'slide' | 'bounce' | 'scale';
}

export const FluidCard: React.FC<FluidCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  animation = 'fade'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-base-100 to-base-200 border border-base-300/50';
      case 'glass':
        return 'bg-base-100/80 backdrop-blur-sm border border-base-300/30';
      case 'jutrans':
        return 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200';
      default:
        return 'bg-base-100';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'slide':
        return 'animate-slide-in-left';
      case 'bounce':
        return 'animate-bounce-in';
      case 'scale':
        return 'animate-scale-in';
      default:
        return 'animate-fade-in-up';
    }
  };

  return (
    <div
      className={`
        card shadow-lg transition-all duration-300 ease-out
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]' : ''}
        ${getVariantClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface FluidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'jutrans';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  animation?: boolean;
}

export const FluidButton: React.FC<FluidButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon,
  animation = true
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'jutrans':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border-0';
      case 'secondary':
        return 'btn-secondary';
      case 'accent':
        return 'btn-accent';
      case 'ghost':
        return 'btn-ghost';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'btn-xs';
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-lg';
      default: return '';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        btn gap-2
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${animation ? 'transition-all duration-200 ease-out transform active:scale-95 hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {loading && <span className="loading loading-spinner loading-sm"></span>}
      {!loading && icon && icon}
      {children}
    </button>
  );
};

interface FluidInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'ghost' | 'jutrans';
  icon?: React.ReactNode;
  error?: boolean;
  success?: boolean;
}

export const FluidInput: React.FC<FluidInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  size = 'md',
  variant = 'bordered',
  icon,
  error = false,
  success = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'jutrans':
        return 'input-bordered border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
      case 'ghost':
        return 'input-ghost';
      case 'bordered':
        return 'input-bordered';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'input-xs';
      case 'sm': return 'input-sm';
      case 'lg': return 'input-lg';
      default: return '';
    }
  };

  const getStateClasses = () => {
    if (error) return 'input-error';
    if (success) return 'input-success';
    return '';
  };

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          input w-full transition-all duration-200 ease-out
          focus:scale-105 focus:shadow-lg
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${getStateClasses()}
          ${icon ? 'pl-10' : ''}
          ${className}
        `}
      />
    </div>
  );
};

interface FluidModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FluidModal: React.FC<FluidModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-sm';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      default: return 'max-w-lg';
    }
  };

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className={`modal-box ${getSizeClasses()} ${className} animate-scale-in`}>
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost hover:bg-base-200 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

interface FluidTableProps {
  headers: string[];
  data: any[];
  className?: string;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  loading?: boolean;
}

export const FluidTable: React.FC<FluidTableProps> = ({
  headers,
  data,
  className = '',
  striped = true,
  hover = true,
  compact = false,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className={`table w-full ${className}`}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="animate-pulse">
                  <div className="h-4 bg-base-300 rounded skeleton"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((_, colIndex) => (
                  <td key={colIndex} className="animate-pulse">
                    <div className="h-4 bg-base-300 rounded skeleton"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className={`
          table w-full
          ${striped ? 'table-zebra' : ''}
          ${compact ? 'table-compact' : ''}
          ${hover ? 'table-fluid' : ''}
          ${className}
        `}
      >
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="font-semibold text-base-content">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="animate-fade-in-up" style={{ animationDelay: `${rowIndex * 0.05}s` }}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="text-base-content/80">
                  {row[header] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface FluidStatsProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  variant?: 'default' | 'gradient' | 'jutrans';
}

export const FluidStats: React.FC<FluidStatsProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className = '',
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-primary to-primary-focus text-primary-content';
      case 'jutrans':
        return 'bg-gradient-to-br from-blue-600 to-blue-700 text-white';
      default:
        return 'bg-base-100';
    }
  };

  const getTrendClasses = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-error';
      default: return 'text-base-content/60';
    }
  };

  return (
    <div className={`stat ${getVariantClasses()} ${className} stat-fluid`}>
      {icon && (
        <div className="stat-figure">
          {icon}
        </div>
      )}
      <div className="stat-title opacity-80">{title}</div>
      <div className="stat-value">{value}</div>
      {description && (
        <div className="stat-desc opacity-70">{description}</div>
      )}
      {trend && trendValue && (
        <div className={`stat-desc ${getTrendClasses()}`}>
          {trend === 'up' ? '↗︎' : trend === 'down' ? '↘︎' : '→'} {trendValue}
        </div>
      )}
    </div>
  );
};

interface FluidAlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const FluidAlert: React.FC<FluidAlertProps> = ({
  type,
  title,
  message,
  onClose,
  className = '',
  icon
}) => {
  const getTypeClasses = () => {
    switch (type) {
      case 'success': return 'alert-success';
      case 'warning': return 'alert-warning';
      case 'error': return 'alert-error';
      default: return 'alert-info';
    }
  };

  return (
    <div className={`alert ${getTypeClasses()} ${className} alert-fluid`}>
      {icon && icon}
      <div>
        {title && <h3 className="font-bold">{title}</h3>}
        <div className="text-xs">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost hover:bg-base-200 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
};

interface FluidBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'jutrans';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const FluidBadge: React.FC<FluidBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'jutrans':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0';
      case 'primary': return 'badge-primary';
      case 'secondary': return 'badge-secondary';
      case 'accent': return 'badge-accent';
      case 'ghost': return 'badge-ghost';
      case 'outline': return 'badge-outline';
      default: return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'badge-xs';
      case 'sm': return 'badge-sm';
      case 'lg': return 'badge-lg';
      default: return '';
    }
  };

  return (
    <div
      className={`
        badge badge-fluid
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

interface FluidProgressProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'jutrans';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

export const FluidProgress: React.FC<FluidProgressProps> = ({
  value,
  max = 100,
  className = '',
  variant = 'primary',
  size = 'md',
  showValue = false
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const getVariantClasses = () => {
    switch (variant) {
      case 'jutrans':
        return 'progress-primary [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-blue-600 [&::-webkit-progress-value]:to-blue-700';
      case 'secondary': return 'progress-secondary';
      case 'accent': return 'progress-accent';
      case 'success': return 'progress-success';
      case 'warning': return 'progress-warning';
      case 'error': return 'progress-error';
      default: return 'progress-primary';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'h-1';
      case 'sm': return 'h-2';
      case 'lg': return 'h-6';
      default: return 'h-4';
    }
  };

  return (
    <div className="relative">
      <progress
        className={`
          progress w-full progress-fluid
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${className}
        `}
        value={value}
        max={max}
      />
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
};