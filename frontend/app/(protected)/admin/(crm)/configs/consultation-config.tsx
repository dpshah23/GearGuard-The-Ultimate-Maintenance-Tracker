"use client";

import React from "react";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";

import {
  ConsultationViewModal,
  ConsultationEditModal,
  ConsultationCreateModal,
  ConsultationDeleteModal,
  ConsultationBulkDeleteModal,
} from "../_components/consultation-modals";
import { ModalConfig, useModalActions } from "../_context/modal-context";
import { BaseEntity, TableConfig } from "../_context/table-context";

import {
  createConsultationAction,
  updateConsultationAction,
  deleteConsultationAction,
  fetchAllConsultationsAction,
  bulkDeleteConsultationsAction,
} from "@/actions/data/consultations";
import { formatZonedDate } from "@/lib/util";
import { ConsultationStatus } from "@/app/generated/prisma";

export interface ConsultationWithRelations extends BaseEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  message: string | null;
  status: ConsultationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const consultationActions = {
  findAll: async (): Promise<ConsultationWithRelations[]> => {
    const res = await fetchAllConsultationsAction();

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as ConsultationWithRelations[];
  },

  create: async (data: any): Promise<ConsultationWithRelations> => {
    const res = await createConsultationAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as ConsultationWithRelations;
  },

  update: async (
    id: string | number,
    data: any,
  ): Promise<ConsultationWithRelations> => {
    const res = await updateConsultationAction(String(id), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as ConsultationWithRelations;
  },

  delete: async (id: string | number): Promise<void> => {
    const res = await deleteConsultationAction(String(id));

    if (!res.success) throw new Error(res.message);

    return;
  },

  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    const res = await bulkDeleteConsultationsAction(ids.map(String));

    if (!res.success) throw new Error(res.message);

    return;
  },
};

const statusColorMap: Record<
  ConsultationStatus,
  "default" | "primary" | "success" | "warning" | "danger"
> = {
  NEW: "default",
  IN_PROGRESS: "primary",
  COMPLETED: "success",
  CONTACTED: "warning",
  NO_SHOW: "danger",
};

export const consultationConfig: TableConfig<ConsultationWithRelations> = {
  id: "consultations",
  name: "Consultations",
  columns: [
    {
      name: "Name",
      uid: "name",
      sortable: true,
    },
    {
      name: "Email",
      uid: "email",
      sortable: true,
    },
    {
      name: "Phone",
      uid: "phone",
    },
    {
      name: "Date",
      uid: "date",
      sortable: true,
      customRender: (consultation: ConsultationWithRelations) =>
        formatZonedDate(consultation.date),
    },
    {
      name: "Time",
      uid: "time",
    },
    {
      name: "Message",
      uid: "message",
      customRender: (consultation: ConsultationWithRelations) => (
        <span className="text-sm line-clamp-2">
          {consultation.message
            ? consultation.message.slice(0, 50) + "..."
            : "N/A"}
        </span>
      ),
    },
    {
      name: "Status",
      uid: "status",
      sortable: true,
      customRender: (consultation: ConsultationWithRelations) => (
        <Chip
          className="capitalize"
          color={statusColorMap[consultation.status]}
          size="sm"
          variant="flat"
        >
          {consultation.status.replace(/_/g, " ")}
        </Chip>
      ),
    },
    {
      name: "Created At",
      uid: "createdAt",
      sortable: true,
      customRender: (consultation: ConsultationWithRelations) =>
        formatZonedDate(consultation.createdAt),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (consultation: ConsultationWithRelations) => (
        <div className="relative flex items-center justify-end gap-2">
          <ConsultationActionsDropdown consultation={consultation} />
        </div>
      ),
    },
  ],
  initialVisibleColumns: [
    "name",
    "email",
    "date",
    "time",
    "message",
    "status",
    "actions",
  ],
  searchOption: {
    placeholder: "Search by name, email, or phone...",
    searchableFields: ["name", "email", "phone"],
  },
  filterOption: {
    name: "Status",
    column: "status",
    options: [
      { name: "Pending", uid: "PENDING" },
      { name: "Scheduled", uid: "SCHEDULED" },
      { name: "Completed", uid: "COMPLETED" },
      { name: "Cancelled", uid: "CANCELLED" },
      { name: "No Show", uid: "NO_SHOW" },
    ],
  },
  actions: consultationActions,
};

export const consultationModalConfig: ModalConfig<ConsultationWithRelations> = {
  view: {
    component: ConsultationViewModal,
    title: "View Consultation",
  },
  edit: {
    component: ConsultationEditModal,
    title: "Edit Consultation",
  },
  create: {
    component: ConsultationCreateModal,
    title: "Create Consultation",
  },
  delete: {
    component: ConsultationDeleteModal,
    title: "Delete Consultation",
  },
  bulkDelete: {
    component: ConsultationBulkDeleteModal,
    title: "Bulk Delete Consultations",
  },
};

const ConsultationActionsDropdown = ({
  consultation,
}: {
  consultation: ConsultationWithRelations;
}) => {
  const { handleView, handleEdit, handleDelete } =
    useModalActions<ConsultationWithRelations>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(consultation);
        break;
      case "edit":
        handleEdit(consultation);
        break;
      case "delete":
        handleDelete(consultation);
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
