import React from "react";
import { ModernLayout } from "@/components/layout/ModernLayout";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModernLayout role="TENANT">
      {children}
    </ModernLayout>
  );
}
