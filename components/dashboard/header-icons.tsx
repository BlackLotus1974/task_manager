"use client";

import React from 'react';

export function HeaderIcons() {
  return (
    <div className="header-icons">
      <i 
        style={{position: 'relative', cursor: 'pointer'}} 
        onClick={() => alert('Notifications feature coming soon!')}
      >
        🔔
        <span className="notification-badge">3</span>
      </i>
      <i 
        style={{cursor: 'pointer'}} 
        onClick={() => alert('Help feature coming soon!')}
      >
        ❓
      </i>
      <i 
        style={{cursor: 'pointer'}} 
        onClick={() => alert('Settings feature coming soon!')}
      >
        ⚙️
      </i>
    </div>
  );
} 