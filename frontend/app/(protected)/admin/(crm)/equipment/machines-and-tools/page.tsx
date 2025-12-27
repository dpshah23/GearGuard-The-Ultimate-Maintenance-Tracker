// File: frontend/app/(protected)/admin/(crm)/equipment-requests/page.tsx
"use client";

import React, { useEffect } from "react";

import { useLayoutContext } from "../../_context/layout-context";
import { TableProvider } from "../../_context/table-context";
import { ModalProvider } from "../../_context/modal-context";
import { GenericTable } from "../../_components/generic-table";
import {
  Equipment,
  equipmentConfig,
  equipmentModalConfig,
} from "../../configs/equipment-config";

export default function EquipmentRequestsPage() {
  const { setBreadcrumbs, setActiveMenuItem } = useLayoutContext();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: equipmentConfig.name },
    ]);
    setActiveMenuItem(equipmentConfig.id);
  }, [setBreadcrumbs, setActiveMenuItem]);

  return (
    <TableProvider<Equipment> config={equipmentConfig}>
      <ModalProvider<Equipment> config={equipmentModalConfig}>
        <GenericTable<Equipment> className="w-full" showBulkActions={true} />
      </ModalProvider>
    </TableProvider>
  );
}
