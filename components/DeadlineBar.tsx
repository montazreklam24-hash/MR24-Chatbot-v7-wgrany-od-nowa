
import React from 'react';
import { styles, DEADLINE_CONFIG } from '../constants';
import { DeadlineType } from '../types';

interface DeadlineBarProps {
  selectedDeadline: DeadlineType;
  onChange: (value: DeadlineType) => void;
}

export const DeadlineBar: React.FC<DeadlineBarProps> = ({ selectedDeadline, onChange }) => {
  const currentConfig = DEADLINE_CONFIG[selectedDeadline];

  return (
    <div style={styles.deadlineBar}>
      <label style={styles.deadlineLabel}>Wybierz termin realizacji:</label>
      <select 
        style={styles.deadlineSelect}
        value={selectedDeadline}
        onChange={(e) => onChange(e.target.value as DeadlineType)}
      >
        <option value="standard">{DEADLINE_CONFIG.standard.label}</option>
        <option value="express">{DEADLINE_CONFIG.express.label}</option>
        <option value="extended">{DEADLINE_CONFIG.extended.label}</option>
      </select>
      <div style={styles.deadlineInfo(currentConfig.color)}>
        {currentConfig.description}
      </div>
    </div>
  );
};
