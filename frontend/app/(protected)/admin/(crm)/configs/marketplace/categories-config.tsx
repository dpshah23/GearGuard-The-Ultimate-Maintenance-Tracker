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
  CategoryViewModal,
  CategoryEditModal,
  CategoryCreateModal,
  CategoryDeleteModal,
  CategoryBulkDeleteModal,
} from "../../_components/marketplace/categories-modals";
import { ModalConfig, useModalActions } from "../../_context/modal-context";
import { BaseEntity, TableConfig } from "../../_context/table-context";

import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  fetchCategoriesAction,
  bulkDeleteCategoriesAction,
} from "@/actions/data/marketplace/category";
import { bgColorMapLight, formatZonedDate, textColorMap } from "@/lib/util";
import { TailwindColor } from "@/app/generated/prisma";
import { IconRenderer } from "@/components/icon-renderer";

//
// 1️⃣ Category Type Definition
//
export interface Category extends BaseEntity {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: keyof typeof TailwindColor;
  trending: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

//
// 2️⃣ Server Actions Implementation
//
const categoryActions = {
  findAll: async (): Promise<Category[]> => {
    const res = await fetchCategoriesAction();

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Category[];
  },

  create: async (data: any): Promise<Category> => {
    const res = await createCategoryAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Category;
  },

  update: async (id: string | number, data: any): Promise<Category> => {
    const res = await updateCategoryAction(String(id), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Category;
  },

  delete: async (id: string | number): Promise<void> => {
    const res = await deleteCategoryAction(String(id));

    if (!res.success) throw new Error(res.message);

    return;
  },

  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    const res = await bulkDeleteCategoriesAction(ids.map(String));

    if (!res.success) throw new Error(res.message);

    return;
  },
};

//
// 3️⃣ Table Configuration
//
export const categoryConfig: TableConfig<Category> = {
  id: "categories",
  name: "Categories",
  columns: [
    {
      name: "Name",
      uid: "name",
      sortable: true,
    },
    {
      name: "Slug",
      uid: "slug",
      sortable: true,
    },
    {
      name: "Icon",
      uid: "icon",
      customRender: (category: Category) => (
        <div className="flex items-center gap-2">
          <IconRenderer iconName={category.icon ?? "settings"} size={18} />
          <span>{category.icon ?? "settings"}</span>
        </div>
      ),
    },
    {
      name: "Color",
      uid: "color",
      customRender: (category: Category) => (
        <Chip
          className={`capitalize ${bgColorMapLight[category.color]} ${textColorMap[category.color]}`}
          color="primary"
          size="sm"
          variant="flat"
        >
          {category.color}
        </Chip>
      ),
    },
    {
      name: "Trending",
      uid: "trending",
      sortable: true,
      customRender: (category: Category) => (
        <Chip
          color={category.trending ? "success" : "default"}
          size="sm"
          variant="flat"
        >
          {category.trending ? "Yes" : "No"}
        </Chip>
      ),
    },
    {
      name: "Description",
      uid: "description",
      customRender: (category: Category) => (
        <p className="line-clamp-2 text-sm text-foreground/70">
          {category.description}
        </p>
      ),
    },
    {
      name: "Created At",
      uid: "createdAt",
      sortable: true,
      customRender: (category: Category) => formatZonedDate(category.createdAt),
    },
    {
      name: "Updated At",
      uid: "updatedAt",
      customRender: (category: Category) => formatZonedDate(category.updatedAt),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (category: Category) => (
        <div className="relative flex items-center justify-end gap-2">
          <CategoryActionsDropdown category={category} />
        </div>
      ),
    },
  ],
  initialVisibleColumns: ["name", "slug", "color", "trending", "actions"],
  searchOption: {
    placeholder: "Search by category name, slug, or description...",
    searchableFields: ["name", "slug", "description"],
  },
  actions: categoryActions,
  // filterOption:
};

//
// 4️⃣ Modal Configuration
//
export const categoryModalConfig: ModalConfig<Category> = {
  view: {
    component: CategoryViewModal,
    title: "View Category",
  },
  edit: {
    component: CategoryEditModal,
    title: "Edit Category",
  },
  create: {
    component: CategoryCreateModal,
    title: "Create Category",
  },
  delete: {
    component: CategoryDeleteModal,
    title: "Delete Category",
  },
  bulkDelete: {
    component: CategoryBulkDeleteModal,
    title: "Bulk Delete Categories",
  },
};

//
// 5️⃣ Actions Dropdown Component
//
const CategoryActionsDropdown = ({ category }: { category: Category }) => {
  const { handleView, handleEdit, handleDelete } = useModalActions<Category>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(category);
        break;
      case "edit":
        handleEdit(category);
        break;
      case "delete":
        handleDelete(category);
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
