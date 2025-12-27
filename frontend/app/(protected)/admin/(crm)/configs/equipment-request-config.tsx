// File: frontend/app/(protected)/admin/(crm)/configs/equipment-request-config.tsx
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
import { MoreHorizontal, Eye, Pencil, Trash } from "lucide-react";

import { TableConfig, BaseEntity } from "../_context/table-context";
import { ModalConfig, useModalActions } from "../_context/modal-context";
import {
  EquipmentRequestViewModal,
  EquipmentRequestEditModal,
  EquipmentRequestCreateModal,
  EquipmentRequestDeleteModal,
  EquipmentRequestBulkDeleteModal,
} from "../_components/equipment-request-modals";

import { formatZonedDate } from "@/lib/util";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Define the EquipmentRequest type
export interface EquipmentRequest extends BaseEntity {
  id: number;
  subject: string;
  description: string;
  request_type: string;
  status: string;
  scheduled_date: string;
  duration_hours: number;
  equipment: {
    id: number;
    name: string;
  };
  assigned_to: {
    id: number;
    username: string;
    email: string;
  } | null;
  assigned_team: {
    id: number;
    name: string;
  } | null;
  created_by: {
    id: number;
    username: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "default"
> = {
  new: "default",
  "in-progress": "warning",
  completed: "success",
  cancelled: "danger",
};

const requestTypeColorMap: Record<
  string,
  "primary" | "secondary" | "warning" | "default" | "danger"
> = {
  corrective: "danger",
  preventive: "primary",
  inspection: "secondary",
};

// API Service Layer
const equipmentRequestAPI = {
  getAll: async (): Promise<EquipmentRequest[]> => {
    const response = await fetch(`${API_BASE_URL}/maintenance/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
        // "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch equipment requests: ${response.statusText}`,
      );
    }

    return response.json();
  },

  getById: async (id: number): Promise<EquipmentRequest> => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch equipment request: ${response.statusText}`,
      );
    }

    return response.json();
  },

  create: async (data: any): Promise<EquipmentRequest> => {
    const response = await fetch(`${API_BASE_URL}/maintenance/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.detail || "Failed to create equipment request");
    }

    return response.json();
  },

  update: async (id: number, data: any): Promise<EquipmentRequest> => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.detail || "Failed to update equipment request");
    }

    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete equipment request: ${response.statusText}`,
      );
    }
  },

  bulkDelete: async (ids: number[]): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/maintenance/bulk-delete/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(
        error.detail || "Failed to bulk delete equipment requests",
      );
    }
  },
};

// Server actions implementation
const equipmentRequestActions = {
  findAll: async (): Promise<EquipmentRequest[]> => {
    return equipmentRequestAPI.getAll();
  },

  create: async (data: any): Promise<EquipmentRequest> => {
    return equipmentRequestAPI.create(data);
  },

  update: async (id: string | number, data: any): Promise<EquipmentRequest> => {
    return equipmentRequestAPI.update(Number(id), data);
  },

  delete: async (id: string | number): Promise<void> => {
    return equipmentRequestAPI.delete(Number(id));
  },

  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    return equipmentRequestAPI.bulkDelete(ids.map(Number));
  },
};

export const equipmentRequestConfig: TableConfig<EquipmentRequest> = {
  id: "equipment-request",
  name: "Equipment Requests",
  columns: [
    {
      name: "Subject",
      uid: "subject",
      sortable: true,
      customRender: (request: EquipmentRequest) => (
        <div className="flex flex-col">
          <p className="font-medium">{request.subject}</p>
          <p className="text-sm text-foreground/60 truncate max-w-[200px]">
            {request.description}
          </p>
        </div>
      ),
    },
    {
      name: "Equipment",
      uid: "equipment",
      sortable: true,
      customRender: (request: EquipmentRequest) => (
        <div className="flex items-center gap-2">
          {/* <span className="font-medium">{request.equipment.name}</span> */}
          <span className="font-medium">{JSON.stringify(request.equipment)}</span>
        </div>
      ),
    },
    {
      name: "Request Type",
      uid: "request_type",
      sortable: true,
      customRender: (request: EquipmentRequest) => (
        <Chip
          className="capitalize"
          color={
            requestTypeColorMap[request.request_type.toLowerCase()] || "default"
          }
          size="sm"
          variant="flat"
        >
          {request.request_type}
        </Chip>
      ),
    },
    {
      name: "Status",
      uid: "status",
      sortable: true,
      customRender: (request: EquipmentRequest) => (
        <Chip
          className="capitalize"
          color={statusColorMap[request.status.toLowerCase()] || "default"}
          size="sm"
          variant="flat"
        >
          {request.status}
        </Chip>
      ),
    },
    {
      name: "Assigned To",
      uid: "assigned_to",
      sortable: true,
      customRender: (request: EquipmentRequest) =>
        request.assigned_to ? (
          <User
            avatarProps={{
              radius: "lg",
              name: request.assigned_to.username[0].toUpperCase(),
            }}
            description={request.assigned_to.email}
            name={request.assigned_to.username}
          >
            {request.assigned_to.email}
          </User>
        ) : (
          <span className="text-foreground/60">Unassigned</span>
        ),
    },
    {
      name: "Team",
      uid: "assigned_team",
      sortable: true,
      customRender: (request: EquipmentRequest) =>
        request.assigned_team ? (
          <span className="font-medium">{request.assigned_team.name}</span>
        ) : (
          <span className="text-foreground/60">No team</span>
        ),
    },
    {
      name: "Scheduled Date",
      uid: "scheduled_date",
      sortable: true,
      customRender: (request: EquipmentRequest) =>
        formatZonedDate(new Date(request.scheduled_date)),
    },
    {
      name: "Duration",
      uid: "duration_hours",
      sortable: true,
      customRender: (request: EquipmentRequest) => (
        <span>{request.duration_hours} hrs</span>
      ),
    },
    {
      name: "Created By",
      uid: "created_by",
      customRender: (request: EquipmentRequest) => (
        <User
          avatarProps={{
            radius: "lg",
            name: request.created_by.username[0].toUpperCase(),
          }}
          description={request.created_by.email}
          name={request.created_by.username}
        >
          {request.created_by.email}
        </User>
      ),
    },
    {
      name: "Created At",
      uid: "created_at",
      sortable: true,
      customRender: (request: EquipmentRequest) =>
        formatZonedDate(new Date(request.created_at)),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (request: EquipmentRequest) => (
        <div className="relative flex items-center justify-end gap-2">
          <EquipmentRequestActionsDropdown request={request} />
        </div>
      ),
    },
  ],
  filterOption: {
    name: "Request type",
    column: "request_type",
    options: [
      { name: "Corrective", uid: "corrective" },
      { name: "Preventive", uid: "preventive" },
      { name: "Inspection", uid: "inspection" },
    ],
  },
  initialVisibleColumns: [
    "subject",
    "equipment",
    "request_type",
    "status",
    "assigned_to",
    "scheduled_date",
    "duration_hours",
    "actions",
  ],
  searchOption: {
    placeholder: "Search by subject, equipment, or description...",
    searchableFields: [
      "subject",
      "description",
      "equipment.name",
      "status",
      "request_type",
    ],
  },
  actions: equipmentRequestActions,
};

export const equipmentRequestModalConfig: ModalConfig<EquipmentRequest> = {
  view: {
    component: EquipmentRequestViewModal,
    title: "View Equipment Request",
  },
  edit: {
    component: EquipmentRequestEditModal,
    title: "Edit Equipment Request",
  },
  create: {
    component: EquipmentRequestCreateModal,
    title: "Create Equipment Request",
  },
  delete: {
    component: EquipmentRequestDeleteModal,
    title: "Delete Equipment Request",
  },
  bulkDelete: {
    component: EquipmentRequestBulkDeleteModal,
    title: "Bulk Delete Equipment Requests",
  },
};

const EquipmentRequestActionsDropdown = ({
  request,
}: {
  request: EquipmentRequest;
}) => {
  const { handleView, handleEdit, handleDelete } =
    useModalActions<EquipmentRequest>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(request);
        break;
      case "edit":
        handleEdit(request);
        break;
      case "delete":
        handleDelete(request);
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
