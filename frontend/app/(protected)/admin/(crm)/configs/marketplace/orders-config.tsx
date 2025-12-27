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
  OrderViewModal,
  OrderEditModal,
  OrderCreateModal,
  OrderDeleteModal,
  OrderBulkDeleteModal,
} from "../../_components/marketplace/orders-modals";
import { ModalConfig, useModalActions } from "../../_context/modal-context";
import { BaseEntity, TableConfig } from "../../_context/table-context";

import {
  createOrderAction,
  updateOrderAction,
  deleteOrderAction,
  fetchAllOrdersAction,
  bulkDeleteOrdersAction,
} from "@/actions/data/marketplace/order";
import { formatZonedDate } from "@/lib/util";
import { OrderStatus } from "@/app/generated/prisma";

export interface OrderWithRelations extends BaseEntity {
  id: string;
  amount: number;
  status: OrderStatus;
  notes: string | null;
  requirements: string | null;
  deliveryDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  service?: {
    id: string;
    title: string;
    price: number;
    media?: Array<{
      id: string;
      url: string;
      type: string;
    }>;
  };
  buyer?: {
    id: string;
    name: string | null;
    email: string;
  };
  seller?: {
    id: string;
    name: string | null;
    email: string;
  };
}

const orderActions = {
  findAll: async (): Promise<OrderWithRelations[]> => {
    const res = await fetchAllOrdersAction();

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as OrderWithRelations[];
  },

  create: async (data: any): Promise<OrderWithRelations> => {
    const res = await createOrderAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as OrderWithRelations;
  },

  update: async (
    id: string | number,
    data: any,
  ): Promise<OrderWithRelations> => {
    const res = await updateOrderAction(String(id), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as OrderWithRelations;
  },

  delete: async (id: string | number): Promise<void> => {
    const res = await deleteOrderAction(String(id));

    if (!res.success) throw new Error(res.message);

    return;
  },

  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    const res = await bulkDeleteOrdersAction(ids.map(String));

    if (!res.success) throw new Error(res.message);

    return;
  },
};

const statusColorMap: Record<
  OrderStatus,
  "default" | "primary" | "success" | "warning" | "danger"
> = {
  PENDING: "warning",
  IN_PROGRESS: "primary",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export const orderConfig: TableConfig<OrderWithRelations> = {
  id: "orders",
  name: "Orders",
  columns: [
    {
      name: "Order ID",
      uid: "id",
      sortable: true,
      customRender: (order: OrderWithRelations) => (
        <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
      ),
    },
    {
      name: "Service",
      uid: "service",
      customRender: (order: OrderWithRelations) => (
        <div className="flex flex-col">
          <span className="font-medium">{order.service?.title || "N/A"}</span>
          <span className="text-xs text-foreground/60">
            ID: {order.serviceId.slice(0, 8)}...
          </span>
        </div>
      ),
    },
    {
      name: "Buyer",
      uid: "buyer",
      customRender: (order: OrderWithRelations) => (
        <div className="flex flex-col">
          <span className="font-medium">{order.buyer?.name || "N/A"}</span>
          <span className="text-xs text-foreground/60">
            {order.buyer?.email}
          </span>
        </div>
      ),
    },
    {
      name: "Seller",
      uid: "seller",
      customRender: (order: OrderWithRelations) => (
        <div className="flex flex-col">
          <span className="font-medium">{order.seller?.name || "N/A"}</span>
          <span className="text-xs text-foreground/60">
            {order.seller?.email}
          </span>
        </div>
      ),
    },
    {
      name: "Amount",
      uid: "amount",
      sortable: true,
      customRender: (order: OrderWithRelations) => (
        <span className="font-semibold">₹{order.amount.toFixed(2)}</span>
      ),
    },
    {
      name: "Status",
      uid: "status",
      sortable: true,
      customRender: (order: OrderWithRelations) => (
        <Chip
          className="capitalize"
          color={statusColorMap[order.status]}
          size="sm"
          variant="flat"
        >
          {order.status.replace(/_/g, " ")}
        </Chip>
      ),
    },
    {
      name: "Delivery Date",
      uid: "deliveryDate",
      sortable: true,
      customRender: (order: OrderWithRelations) =>
        order.deliveryDate ? formatZonedDate(order.deliveryDate) : "Not set",
    },
    {
      name: "Created At",
      uid: "createdAt",
      sortable: true,
      customRender: (order: OrderWithRelations) =>
        formatZonedDate(order.createdAt),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (order: OrderWithRelations) => (
        <div className="relative flex items-center justify-end gap-2">
          <OrderActionsDropdown order={order} />
        </div>
      ),
    },
  ],
  initialVisibleColumns: [
    "id",
    "service",
    "buyer",
    "seller",
    "amount",
    "status",
    "actions",
  ],
  searchOption: {
    placeholder: "Search by order ID, buyer, seller, or service...",
    searchableFields: [
      "id",
      "serviceId",
      "buyerId",
      "sellerId",
      "notes",
      "buyer.email",
      "seller.email",
      "buyer.name",
      "seller.name",
    ],
  },
  filterOption: {
    name: "Status",
    column: "status",
    options: [
      { name: "Pending", uid: "PENDING" },
      { name: "In Progress", uid: "IN_PROGRESS" },
      { name: "Completed", uid: "COMPLETED" },
      { name: "Cancelled", uid: "CANCELLED" },
      { name: "Refunded", uid: "REFUNDED" },
    ],
  },
  actions: orderActions,
};

export const orderModalConfig: ModalConfig<OrderWithRelations> = {
  view: {
    component: OrderViewModal,
    title: "View Order",
  },
  edit: {
    component: OrderEditModal,
    title: "Edit Order",
  },
  create: {
    component: OrderCreateModal,
    title: "Create Order",
  },
  delete: {
    component: OrderDeleteModal,
    title: "Delete Order",
  },
  bulkDelete: {
    component: OrderBulkDeleteModal,
    title: "Bulk Delete Orders",
  },
};

const OrderActionsDropdown = ({ order }: { order: OrderWithRelations }) => {
  const { handleView, handleEdit, handleDelete } =
    useModalActions<OrderWithRelations>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(order);
        break;
      case "edit":
        handleEdit(order);
        break;
      case "delete":
        handleDelete(order);
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
