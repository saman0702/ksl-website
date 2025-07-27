import React, { useState } from "react";

export function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  // On passe activeTab et setActiveTab via le contexte React
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

const TabsContext = React.createContext();

export function TabsList({ children }) {
  return <div style={{ display: "flex", gap: 8 }}>{children}</div>;
}

export function TabsTrigger({ value, children }) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  return (
    <button
      type="button"
      style={{ fontWeight: activeTab === value ? "bold" : "normal" }}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  const { activeTab } = React.useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div>{children}</div>;
} 