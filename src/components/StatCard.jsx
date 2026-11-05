import React from 'react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  badgeText,
  badgeType = 'default', // 'success', 'warning', 'info'
  accentColor = 'navy', // 'navy', 'green', 'amber', 'purple'
  onClick
}) => {
  return (
    <div
      className={`stat-card stat-accent-${accentColor} ${onClick ? 'stat-clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className={`stat-icon-wrapper stat-icon-${accentColor}`}>
            <Icon size={22} />
          </div>
        )}
      </div>

      <div className="stat-card-body">
        <h3 className="stat-card-value">{value}</h3>
      </div>

      {(subtitle || badgeText) && (
        <div className="stat-card-footer">
          {badgeText && (
            <span className={`stat-badge badge-${badgeType}`}>
              {badgeText}
            </span>
          )}
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
