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
  UserViewModal,
  UserEditModal,
  UserCreateModal,
  UserDeleteModal,
  UserBulkDeleteModal,
} from "../_components/user-modals";

// Adjust path as needed
import { formatZonedDate } from "@/lib/util";
import { findAllUsers } from "@/lib/db/user";
import { Role } from "@/app/generated/prisma";
import {
  bulkDeleteUsersAction,
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "@/actions/data/user";

// Define the User type (adjust according to your Prisma schema)
export interface User extends BaseEntity {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  gender?: string | null;
  // role: "admin" | "staff" | "user";
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const roleColorMap: Record<string, "success" | "danger" | "warning"> = {
  admin: "warning",
  staff: "danger",
  user: "success",
};

// Server actions implementation
const userActions = {
  findAll: async () => await findAllUsers(),
  create: async (data: any) => {
    const res = await createUserAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data;
  },
  update: async (id: string | number, data: any) => {
    const res = await updateUserAction(id.toString(), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data;
  },
  delete: async (id: string | number) => {
    const res = await deleteUserAction(id.toString());

    if (!res.success) throw new Error(res.message);

    return;
  },
  bulkDelete: async (ids: (string | number)[]) => {
    const res = await bulkDeleteUsersAction(ids.map(String));

    if (!res.success) throw new Error(res.message);

    return;
  },
};

export const userConfig: TableConfig<User> = {
  id: "user",
  name: "Users",
  columns: [
    {
      name: "Name",
      uid: "name",
      sortable: true,
      customRender: (user: User) => (
        <User
          avatarProps={{ radius: "lg", src: user.image || "" }}
          description={user.email}
          name={user.name}
        >
          {user.email}
        </User>
      ),
    },
    {
      name: "Gender",
      uid: "gender",
      sortable: true,
    },
    {
      name: "Role",
      uid: "role",
      sortable: true,
      customRender: (user: User) => (
        <Chip
          className="capitalize"
          color={roleColorMap[user.role.toLowerCase()]}
          size="sm"
          variant="flat"
        >
          {user.role}
        </Chip>
      ),
    },
    {
      name: "Phone",
      uid: "phone",
    },
    {
      name: "Email",
      uid: "email",
    },
    {
      name: "Created at",
      uid: "createdAt",
      customRender: (user: User) => formatZonedDate(user.createdAt),
    },
    {
      name: "Updated at",
      uid: "updatedAt",
      customRender: (user: User) => formatZonedDate(user.updatedAt),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (user: User) => (
        <div className="relative flex items-center justify-end gap-2">
          <UserActionsDropdown user={user} />
        </div>
      ),
    },
  ],
  filterOption: {
    name: "Role",
    column: "role",
    options: [
      { name: "Admin", uid: "admin" },
      { name: "Staff", uid: "staff" },
      { name: "User", uid: "user" },
    ],
  },
  searchOption: {
    placeholder: "Search by name, email, or phone...",
    searchableFields: ["name", "email", "phone"],
  },
  initialVisibleColumns: ["name", "role", "actions", "phone", "email"],
  actions: userActions,
};

export const userModalConfig: ModalConfig<User> = {
  view: {
    component: UserViewModal,
    title: "View User",
  },
  edit: {
    component: UserEditModal,
    title: "Edit User",
  },
  create: {
    component: UserCreateModal,
    title: "Create User",
  },
  delete: {
    component: UserDeleteModal,
    title: "Delete User",
  },
  bulkDelete: {
    component: UserBulkDeleteModal,
    title: "Bulk Delete Users",
  },
};

const UserActionsDropdown = ({ user }: { user: User }) => {
  const { handleView, handleEdit, handleDelete } = useModalActions<User>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(user);
        break;
      case "edit":
        handleEdit(user);
        break;
      case "delete":
        handleDelete(user);
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
          className="text-danger"
          color="danger"
          startContent={<Trash className="w-4 h-4" />}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
