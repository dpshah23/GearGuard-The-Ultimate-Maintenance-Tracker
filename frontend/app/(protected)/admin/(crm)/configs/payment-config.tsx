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
  PaymentViewModal,
  PaymentEditModal,
  PaymentCreateModal,
  PaymentDeleteModal,
  PaymentBulkDeleteModal,
} from "../_components/payment-modals";

import { formatZonedDate } from "@/lib/util";
import { findAllPayments } from "@/lib/db/payment";
import {
  bulkDeletePaymentsAction,
  createPaymentAction,
  deletePaymentAction,
  updatePaymentAction,
} from "@/actions/data/payment";

// Define the Payment type with relations
export interface Payment extends BaseEntity {
  id: number;
  userId: string;
  webinarId: number;
  time: Date;
  amount: number;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  webinar: {
    id: number;
    title: string;
    price: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const statusColorMap: Record<
  string,
  "success" | "danger" | "warning" | "default"
> = {
  completed: "success",
  pending: "warning",
  failed: "danger",
  cancelled: "default",
  refunded: "default",
};

// Server actions implementation
const paymentActions = {
  findAll: async (): Promise<Payment[]> => {
    const payments = await findAllPayments();

    return payments as Payment[];
  },
  create: async (data: any): Promise<Payment> => {
    const res = await createPaymentAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Payment;
  },
  update: async (id: string | number, data: any): Promise<Payment> => {
    const res = await updatePaymentAction(Number(id), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as Payment;
  },
  delete: async (id: string | number): Promise<void> => {
    const res = await deletePaymentAction(Number(id));

    if (!res.success) throw new Error(res.message);

    return;
  },
  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    const res = await bulkDeletePaymentsAction(ids.map(Number));

    if (!res.success) throw new Error(res.message);

    return;
  },
};

export const paymentConfig: TableConfig<Payment> = {
  id: "payment",
  name: "Payments",
  columns: [
    {
      name: "User",
      uid: "user",
      sortable: true,
      customRender: (payment: Payment) => (
        <User
          avatarProps={{ radius: "lg", name: payment.user.name[0] }}
          description={payment.user.email}
          name={payment.user.name}
        >
          {payment.user.email}
        </User>
      ),
    },
    {
      name: "Webinar",
      uid: "webinar",
      sortable: true,
      customRender: (payment: Payment) => (
        <div>
          <p className="font-medium">{payment.webinar.title}</p>
          <p className="text-sm text-foreground/60">₹{payment.webinar.price}</p>
        </div>
      ),
    },
    {
      name: "Amount",
      uid: "amount",
      sortable: true,
      customRender: (payment: Payment) => (
        <span className="font-mono">₹{payment.amount.toFixed(2)}</span>
      ),
    },
    {
      name: "Status",
      uid: "status",
      sortable: true,
      customRender: (payment: Payment) => (
        <Chip
          className="capitalize"
          color={statusColorMap[payment.status.toLowerCase()] || "default"}
          size="sm"
          variant="flat"
        >
          {payment.status}
        </Chip>
      ),
    },
    {
      name: "Payment Time",
      uid: "time",
      sortable: true,
      customRender: (payment: Payment) => formatZonedDate(payment.time),
    },
    {
      name: "Created at",
      uid: "createdAt",
      customRender: (payment: Payment) => formatZonedDate(payment.createdAt),
    },
    {
      name: "Updated at",
      uid: "updatedAt",
      customRender: (payment: Payment) => formatZonedDate(payment.updatedAt),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (payment: Payment) => (
        <div className="relative flex items-center justify-end gap-2">
          <PaymentActionsDropdown payment={payment} />
        </div>
      ),
    },
  ],
  filterOption: {
    name: "Status",
    column: "status",
    options: [
      { name: "Completed", uid: "completed" },
      { name: "Pending", uid: "pending" },
      { name: "Failed", uid: "failed" },
      { name: "Cancelled", uid: "cancelled" },
      { name: "Refunded", uid: "refunded" },
    ],
  },
  initialVisibleColumns: [
    "user",
    "webinar",
    "amount",
    "status",
    "time",
    "actions",
  ],
  searchOption: {
    placeholder: "Search by user name, email, or webinar title...",
    searchableFields: [
      "user.name",
      "user.email",
      "webinar.title",
      "status",
      "amount",
    ],
  },
  actions: paymentActions,
};

export const paymentModalConfig: ModalConfig<Payment> = {
  view: {
    component: PaymentViewModal,
    title: "View Payment",
  },
  edit: {
    component: PaymentEditModal,
    title: "Edit Payment",
  },
  create: {
    component: PaymentCreateModal,
    title: "Create Payment",
  },
  delete: {
    component: PaymentDeleteModal,
    title: "Delete Payment",
  },
  bulkDelete: {
    component: PaymentBulkDeleteModal,
    title: "Bulk Delete Payments",
  },
};

const PaymentActionsDropdown = ({ payment }: { payment: Payment }) => {
  const { handleView, handleEdit, handleDelete } = useModalActions<Payment>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(payment);
        break;
      case "edit":
        handleEdit(payment);
        break;
      case "delete":
        handleDelete(payment);
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
