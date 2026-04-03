import React from "react";
import { ModernLayout } from "@/components/layout/ModernLayout";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModernLayout role="VENDOR">
      {children}
    </ModernLayout>
  );
}
