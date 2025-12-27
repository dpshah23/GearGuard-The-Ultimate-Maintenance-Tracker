// File: frontend/app/(protected)/admin/(crm)/equipment-requests/page.tsx
"use client";

import React, { useEffect } from "react";

import { useLayoutContext } from "../../_context/layout-context";
import { TableProvider } from "../../_context/table-context";
import { ModalProvider } from "../../_context/modal-context";
import { GenericTable } from "../../_components/generic-table";
import {
  EquipmentRequest,
  equipmentRequestConfig,
  equipmentRequestModalConfig,
} from "../../configs/equipment-request-config";

export default function EquipmentRequestsPage() {
  const { setBreadcrumbs, setActiveMenuItem } = useLayoutContext();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: equipmentRequestConfig.name },
    ]);
    setActiveMenuItem(equipmentRequestConfig.id);
  }, [setBreadcrumbs, setActiveMenuItem]);

  return (
    <TableProvider<EquipmentRequest> config={equipmentRequestConfig}>
      <ModalProvider<EquipmentRequest> config={equipmentRequestModalConfig}>
        <GenericTable<EquipmentRequest>
          className="w-full"
          showBulkActions={true}
        />
      </ModalProvider>
    </TableProvider>
  );
}
