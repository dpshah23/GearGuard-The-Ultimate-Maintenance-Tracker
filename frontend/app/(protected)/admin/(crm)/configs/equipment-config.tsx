// File: frontend/app/(protected)/admin/(crm)/configs/equipment-config.tsx
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
  EquipmentViewModal,
  EquipmentEditModal,
  EquipmentCreateModal,
  EquipmentDeleteModal,
  EquipmentBulkDeleteModal,
} from "../_components/equipment-modals";

import { formatZonedDate } from "@/lib/util";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Define the Equipment type
export interface Equipment extends BaseEntity {
  id: number;
  name: string;
  serial_number: string;
  department: number;
  assigned_to: number | null;
  maintenance_team: number;
  location: string;
  purchase_date: string;
  warranty_expiry: string;
  is_scrapped: boolean;
  // Extended fields for display (fetched with relations)
  department_name?: string;
  assigned_to_name?: string;
  assigned_to_email?: string;
  maintenance_team_name?: string;
}

// Server actions implementation using Django REST API
const equipmentActions = {
  findAll: async (): Promise<Equipment[]> => {
    const response = await fetch(`${API_BASE_URL}/equipment/list/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch equipment");
    }

    const data = await response.json();

    return data as Equipment[];
  },

  create: async (data: any): Promise<Equipment> => {
    const response = await fetch(`${API_BASE_URL}/equipment/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || "Failed to create equipment");
    }

    const result = await response.json();

    return result as Equipment;
  },

  update: async (id: string | number, data: any): Promise<Equipment> => {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || "Failed to update equipment");
    }

    const result = await response.json();

    return result as Equipment;
  },

  delete: async (id: string | number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/equipment/${id}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message || "Failed to delete equipment");
    }

    return;
  },

  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    // Call delete for each ID (or implement bulk delete endpoint in Django)
    const deletePromises = ids.map((id) =>
      fetch(`${API_BASE_URL}/equipment/${id}/delete/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    );

    const results = await Promise.all(deletePromises);
    const failed = results.filter((r) => !r.ok);

    if (failed.length > 0) {
      throw new Error(`Failed to delete ${failed.length} equipment items`);
    }

    return;
  },
};

export const equipmentConfig: TableConfig<Equipment> = {
  id: "equipment",
  name: "Equipment",
  columns: [
    {
      name: "Name",
      uid: "name",
      sortable: true,
      customRender: (equipment: Equipment) => (
        <div className="flex flex-col">
          <p className="font-medium">{equipment.name}</p>
          <p className="text-sm text-foreground/60">
            SN: {equipment.serial_number}
          </p>
        </div>
      ),
    },
    {
      name: "Department",
      uid: "department",
      sortable: true,
      customRender: (equipment: Equipment) => (
        <span>
          {equipment.department_name || `Dept #${equipment.department}`}
        </span>
      ),
    },
    {
      name: "Assigned To",
      uid: "assigned_to",
      sortable: true,
      customRender: (equipment: Equipment) => {
        if (!equipment.assigned_to) {
          return <span className="text-foreground/40">Unassigned</span>;
        }

        return equipment.assigned_to_name ? (
          <User
            avatarProps={{ radius: "lg", name: equipment.assigned_to_name[0] }}
            description={equipment.assigned_to_email}
            name={equipment.assigned_to_name}
          >
            {equipment.assigned_to_email}
          </User>
        ) : (
          <span>User #{equipment.assigned_to}</span>
        );
      },
    },
    {
      name: "Location",
      uid: "location",
      sortable: true,
    },
    {
      name: "Purchase Date",
      uid: "purchase_date",
      sortable: true,
      customRender: (equipment: Equipment) =>
        formatZonedDate(new Date(equipment.purchase_date)),
    },
    {
      name: "Warranty Expiry",
      uid: "warranty_expiry",
      sortable: true,
      customRender: (equipment: Equipment) => {
        const expiryDate = new Date(equipment.warranty_expiry);
        const isExpired = expiryDate < new Date();

        return (
          <div className="flex items-center gap-2">
            <span>{formatZonedDate(expiryDate)}</span>
            {isExpired && (
              <Chip color="danger" size="sm" variant="flat">
                Expired
              </Chip>
            )}
          </div>
        );
      },
    },
    {
      name: "Status",
      uid: "is_scrapped",
      sortable: true,
      customRender: (equipment: Equipment) => (
        <Chip
          color={equipment.is_scrapped ? "danger" : "success"}
          size="sm"
          variant="flat"
        >
          {equipment.is_scrapped ? "Scrapped" : "Active"}
        </Chip>
      ),
    },
    {
      name: "Maintenance Team",
      uid: "maintenance_team",
      sortable: true,
      customRender: (equipment: Equipment) => (
        <span>
          {equipment.maintenance_team_name ||
            `Team #${equipment.maintenance_team}`}
        </span>
      ),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (equipment: Equipment) => (
        <div className="relative flex items-center justify-end gap-2">
          <EquipmentActionsDropdown equipment={equipment} />
        </div>
      ),
    },
  ],
  filterOption: {
    name: "Status",
    column: "is_scrapped",
    options: [
      { name: "Active", uid: "false" },
      { name: "Scrapped", uid: "true" },
    ],
  },
  initialVisibleColumns: [
    "name",
    "department",
    "assigned_to",
    "location",
    "warranty_expiry",
    "is_scrapped",
    "actions",
  ],
  searchOption: {
    placeholder: "Search by name, serial number, or location...",
    searchableFields: [
      "name",
      "serial_number",
      "location",
      "department_name",
      "assigned_to_name",
    ],
  },
  actions: equipmentActions,
};

export const equipmentModalConfig: ModalConfig<Equipment> = {
  view: {
    component: EquipmentViewModal,
    title: "View Equipment",
  },
  edit: {
    component: EquipmentEditModal,
    title: "Edit Equipment",
  },
  create: {
    component: EquipmentCreateModal,
    title: "Create Equipment",
  },
  delete: {
    component: EquipmentDeleteModal,
    title: "Delete Equipment",
  },
  bulkDelete: {
    component: EquipmentBulkDeleteModal,
    title: "Bulk Delete Equipment",
  },
};

const EquipmentActionsDropdown = ({ equipment }: { equipment: Equipment }) => {
  const { handleView, handleEdit, handleDelete } = useModalActions<Equipment>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(equipment);
        break;
      case "edit":
        handleEdit(equipment);
        break;
      case "delete":
        handleDelete(equipment);
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
