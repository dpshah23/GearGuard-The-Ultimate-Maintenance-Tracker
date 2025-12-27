"use client";

import React, { useEffect } from "react";

import { useLayoutContext } from "../_context/layout-context";
import { TableProvider } from "../_context/table-context";
import { ModalProvider } from "../_context/modal-context";
import { GenericTable } from "../_components/generic-table";
import { userConfig, userModalConfig, User } from "../configs/user-config";

export default function UsersPage() {
  const { setBreadcrumbs, setActiveMenuItem } = useLayoutContext();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: userConfig.name },
    ]);
    setActiveMenuItem(userConfig.id);
  }, [setBreadcrumbs, setActiveMenuItem]);

  return (
    <TableProvider<User> config={userConfig}>
      <ModalProvider<User> config={userModalConfig}>
        <GenericTable<User> className="w-full" showBulkActions={true} />
      </ModalProvider>
    </TableProvider>
  );
}
