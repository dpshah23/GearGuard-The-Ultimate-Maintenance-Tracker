// File: app/(protected)/admin/(crm)/configs/utm-config.tsx
import React from "react";
import { Chip } from "@heroui/chip";
import { User } from "@heroui/user";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { MoreHorizontal, Eye, Pencil, Trash, TrendingUp } from "lucide-react";

import { TableConfig, BaseEntity } from "../_context/table-context";
import { ModalConfig, useModalActions } from "../_context/modal-context";
import {
  UTMViewModal,
  UTMEditModal,
  UTMCreateModal,
  UTMDeleteModal,
  UTMBulkDeleteModal,
} from "../_components/utm-modals";

import { formatZonedDate } from "@/lib/util";
import { findAllUTMs } from "@/lib/db/utm";
import {
  bulkDeleteUTMsAction,
  createUTMAction,
  deleteUTMAction,
  updateUTMAction,
} from "@/actions/data/utm";

// Define the UTM Campaign type
export interface UTMCampaign extends BaseEntity {
  id: number;
  name: string;
  description: string | null;
  source: string;
  medium: string;
  campaign: string;
  term: string | null;
  content: string | null;
  clicks: number;
  lastClickAt: Date | null;
  isActive: boolean;
  createdBy: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const statusColorMap: Record<string, "success" | "danger" | "default"> = {
  active: "success",
  inactive: "danger",
};

// Server actions implementation
const utmActions = {
  findAll: async (): Promise<UTMCampaign[]> => {
    const utms = await findAllUTMs();

    return utms as UTMCampaign[];
  },
  create: async (data: any): Promise<UTMCampaign> => {
    const res = await createUTMAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as UTMCampaign;
  },
  update: async (id: string | number, data: any): Promise<UTMCampaign> => {
    const res = await updateUTMAction(Number(id), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as UTMCampaign;
  },
  delete: async (id: string | number): Promise<void> => {
    console.log("Deleting UTM with ID:", id);
    const res = await deleteUTMAction(Number(id));

    if (!res.success) throw new Error(res.message);

    return;
  },
  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    const res = await bulkDeleteUTMsAction(ids.map(Number));

    if (!res.success) throw new Error(res.message);

    return;
  },
};

export const utmConfig: TableConfig<UTMCampaign> = {
  id: "campaigns",
  name: "Campaigns",
  columns: [
    {
      name: "Name",
      uid: "name",
      sortable: true,
      customRender: (utm: UTMCampaign) => (
        <div className="flex flex-col">
          <p className="font-medium">{utm.name}</p>
          {utm.description && (
            <p className="text-sm text-foreground/60">{utm.description}</p>
          )}
        </div>
      ),
    },
    {
      name: "Source",
      uid: "source",
      sortable: true,
      customRender: (utm: UTMCampaign) => (
        <Chip color="primary" size="sm" variant="flat">
          {utm.source}
        </Chip>
      ),
    },
    {
      name: "Medium",
      uid: "medium",
      sortable: true,
      customRender: (utm: UTMCampaign) => (
        <Chip color="secondary" size="sm" variant="flat">
          {utm.medium}
        </Chip>
      ),
    },
    {
      name: "Campaign",
      uid: "campaign",
      sortable: true,
      customRender: (utm: UTMCampaign) => (
        <span className="font-medium">{utm.campaign}</span>
      ),
    },
    {
      name: "Clicks",
      uid: "clicks",
      sortable: true,
      customRender: (utm: UTMCampaign) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="font-mono font-semibold">{utm.clicks}</span>
        </div>
      ),
    },
    {
      name: "Status",
      uid: "isActive",
      sortable: true,
      customRender: (utm: UTMCampaign) => (
        <Chip
          className="capitalize"
          color={statusColorMap[utm.isActive ? "active" : "inactive"]}
          size="sm"
          variant="flat"
        >
          {utm.isActive ? "Active" : "Inactive"}
        </Chip>
      ),
    },
    {
      name: "Created By",
      uid: "createdBy",
      customRender: (utm: UTMCampaign) =>
        utm.createdBy ? (
          <User
            avatarProps={{ radius: "lg", name: utm.createdBy.name[0] }}
            description={utm.createdBy.email}
            name={utm.createdBy.name}
          />
        ) : (
          <span className="text-foreground/40">N/A</span>
        ),
    },
    {
      name: "Last Click",
      uid: "lastClickAt",
      sortable: true,
      customRender: (utm: UTMCampaign) =>
        utm.lastClickAt ? (
          formatZonedDate(utm.lastClickAt)
        ) : (
          <span className="text-foreground/40">Never</span>
        ),
    },
    {
      name: "Created",
      uid: "createdAt",
      sortable: true,
      customRender: (utm: UTMCampaign) => formatZonedDate(utm.createdAt),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (utm: UTMCampaign) => (
        <div className="relative flex items-center justify-end gap-2">
          <UTMActionsDropdown utm={utm} />
        </div>
      ),
    },
  ],
  filterOption: {
    name: "Status",
    column: "isActive",
    options: [
      { name: "Active", uid: "active" },
      { name: "Inactive", uid: "inactive" },
    ],
  },
  initialVisibleColumns: [
    "name",
    "source",
    "medium",
    "campaign",
    "clicks",
    "isActive",
    "actions",
  ],
  searchOption: {
    placeholder: "Search by name, source, medium, or campaign...",
    searchableFields: ["name", "description", "source", "medium", "campaign"],
  },
  actions: utmActions,
};

export const utmModalConfig: ModalConfig<UTMCampaign> = {
  view: {
    component: UTMViewModal,
    title: "View UTM Campaign",
  },
  edit: {
    component: UTMEditModal,
    title: "Edit UTM Campaign",
  },
  create: {
    component: UTMCreateModal,
    title: "Create UTM Campaign",
  },
  delete: {
    component: UTMDeleteModal,
    title: "Delete UTM Campaign",
  },
  bulkDelete: {
    component: UTMBulkDeleteModal,
    title: "Bulk Delete UTM Campaigns",
  },
};

const UTMActionsDropdown = ({ utm }: { utm: UTMCampaign }) => {
  const { handleView, handleEdit, handleDelete } =
    useModalActions<UTMCampaign>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(utm);
        break;
      case "edit":
        handleEdit(utm);
        break;
      case "delete":
        handleDelete(utm);
        break;
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button isIconOnly size="sm" variant="flat">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="flat" onAction={(key) => handleAction(key as any)}>
        <DropdownItem key="view" startContent={<Eye className="w-4 h-4" />}>
          View
        </DropdownItem>
        <DropdownItem key="edit" startContent={<Pencil className="w-4 h-4" />}>
          Edit
        </DropdownItem>
        <DropdownItem
          key="delete"
          color="danger"
          startContent={<Trash className="w-4 h-4" />}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
