"use client";

import React, { useEffect } from "react";

import { useLayoutContext } from "../_context/layout-context";
import { TableProvider } from "../_context/table-context";
import { ModalProvider } from "../_context/modal-context";
import { GenericTable } from "../_components/generic-table";
import {
  Payment,
  paymentConfig,
  paymentModalConfig,
} from "../configs/payment-config";

export default function PaymentsPage() {
  const { setBreadcrumbs, setActiveMenuItem } = useLayoutContext();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: paymentConfig.name },
    ]);
    setActiveMenuItem(paymentConfig.id);
  }, [setBreadcrumbs, setActiveMenuItem]);

  return (
    <TableProvider<Payment> config={paymentConfig}>
      <ModalProvider<Payment> config={paymentModalConfig}>
        <GenericTable<Payment> className="w-full" showBulkActions={true} />
      </ModalProvider>
    </TableProvider>
  );
}
