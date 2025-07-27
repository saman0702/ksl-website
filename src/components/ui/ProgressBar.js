import React from "react";

export function ProgressBar({ value = 0 }) {
  return (
    <div style={{ width: '100%', background: '#eee', borderRadius: 4, height: 8 }}>
      <div
        style={{
          width: `${value}%`,
          background: '#e53e3e',
          height: '100%',
          borderRadius: 4,
          transition: 'width 0.3s',
        }}
      />
    </div>
  );
} 