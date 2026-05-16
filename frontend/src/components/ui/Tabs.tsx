'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (key: string) => void;
  className?: string;
}

export function Tabs({ items, defaultTab, onChange, className = '' }: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultTab ?? items[0]?.key ?? '');

  const handleChange = (key: string) => {
    setActiveKey(key);
    onChange?.(key);
  };

  const activeItem = items.find((item) => item.key === activeKey);

  return (
    <div className={className}>
      {/* Tab list */}
      <div role="tablist" className="flex border-b border-ut-surface-dark">
        {items.map((item) => (
          <button
            key={item.key}
            role="tab"
            aria-selected={activeKey === item.key}
            aria-controls={`tabpanel-${item.key}`}
            id={`tab-${item.key}`}
            onClick={() => handleChange(item.key)}
            className={`
              relative px-4 py-2.5 text-small font-medium transition-colors
              ${activeKey === item.key ? 'text-ut-accent' : 'text-ut-text-muted hover:text-ut-text'}
            `}
          >
            {item.label}
            {activeKey === item.key && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-ut-accent"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab panel */}
      {activeItem && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeItem.key}`}
          aria-labelledby={`tab-${activeItem.key}`}
          className="pt-4"
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}

export default Tabs;
