import React from "react";
import { ModernLayout } from "@/components/layout/ModernLayout";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModernLayout role="MANAGER">
      {children}
    </ModernLayout>
  );
}
