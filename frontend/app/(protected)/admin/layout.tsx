import React from "react";

import { LayoutContextProvider } from "./(crm)/_context/layout-context";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  //TODO: role gate check

  return <LayoutContextProvider>{children}</LayoutContextProvider>;
};

export default AdminLayout;
