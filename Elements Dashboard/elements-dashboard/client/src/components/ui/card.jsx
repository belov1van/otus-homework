import React from "react";

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow rounded-2xl p-4 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="mt-2">{children}</div>
);
