import React from "react";

export function Select({ value, onChange, children, ...props }) {
  return (
    <select value={value} onChange={onChange} {...props}>
      {children}
    </select>
  );
} 