import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { MoreHorizontal, Eye, Pencil, Trash, Mail } from "lucide-react";

import { TableConfig, BaseEntity } from "../_context/table-context";
import { ModalConfig, useModalActions } from "../_context/modal-context";
import {
  NewsletterSubscriberViewModal,
  NewsletterSubscriberEditModal,
  NewsletterSubscriberCreateModal,
  NewsletterSubscriberDeleteModal,
  NewsletterSubscriberBulkDeleteModal,
} from "../_components/newsletter-modals";

import { formatZonedDate } from "@/lib/util";
import { findAllNewsletterSubscribers } from "@/lib/db/newsletter";
import {
  bulkDeleteNewsletterSubscribersAction,
  createNewsletterSubscriberAction,
  deleteNewsletterSubscriberAction,
  updateNewsletterSubscriberAction,
} from "@/actions/data/newsletter";

export interface NewsletterSubscriber extends BaseEntity {
  id: string;
  email: string;
  phone: string | null;
  subscribed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const newsletterActions = {
  findAll: async (): Promise<NewsletterSubscriber[]> => {
    const subscribers = await findAllNewsletterSubscribers();

    return subscribers as NewsletterSubscriber[];
  },
  create: async (data: any): Promise<NewsletterSubscriber> => {
    const res = await createNewsletterSubscriberAction(data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as NewsletterSubscriber;
  },
  update: async (
    id: string | number,
    data: any,
  ): Promise<NewsletterSubscriber> => {
    const res = await updateNewsletterSubscriberAction(String(id), data);

    if (!res.success || !res.data) throw new Error(res.message);

    return res.data as NewsletterSubscriber;
  },
  delete: async (id: string | number): Promise<void> => {
    const res = await deleteNewsletterSubscriberAction(String(id));

    if (!res.success) throw new Error(res.message);
  },
  bulkDelete: async (ids: (string | number)[]): Promise<void> => {
    const res = await bulkDeleteNewsletterSubscribersAction(ids.map(String));

    if (!res.success) throw new Error(res.message);
  },
};

export const newsletterConfig: TableConfig<NewsletterSubscriber> = {
  id: "newsletter-subscribers",
  name: "Newsletter Subscribers",
  columns: [
    {
      name: "Email",
      uid: "email",
      sortable: true,
      customRender: (subscriber: NewsletterSubscriber) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          <span className="font-medium">{subscriber.email}</span>
        </div>
      ),
    },
    {
      name: "Phone",
      uid: "phone",
      sortable: true,
      customRender: (subscriber: NewsletterSubscriber) => (
        <span className="text-foreground/80">{subscriber.phone || "—"}</span>
      ),
    },
    {
      name: "Status",
      uid: "subscribed",
      sortable: true,
      customRender: (subscriber: NewsletterSubscriber) => (
        <Chip
          color={subscriber.subscribed ? "success" : "default"}
          size="sm"
          variant="flat"
        >
          {subscriber.subscribed ? "Subscribed" : "Unsubscribed"}
        </Chip>
      ),
    },
    {
      name: "Subscribed At",
      uid: "createdAt",
      sortable: true,
      customRender: (subscriber: NewsletterSubscriber) =>
        formatZonedDate(subscriber.createdAt),
    },
    {
      name: "Updated At",
      uid: "updatedAt",
      sortable: true,
      customRender: (subscriber: NewsletterSubscriber) =>
        formatZonedDate(subscriber.updatedAt),
    },
    {
      name: "Actions",
      uid: "actions",
      customRender: (subscriber: NewsletterSubscriber) => (
        <div className="relative flex items-center justify-end gap-2">
          <NewsletterActionsDropdown subscriber={subscriber} />
        </div>
      ),
    },
  ],
  filterOption: {
    name: "Status",
    column: "subscribed",
    options: [
      { name: "Subscribed", uid: "true" },
      { name: "Unsubscribed", uid: "false" },
    ],
  },
  initialVisibleColumns: [
    "email",
    "phone",
    "subscribed",
    "createdAt",
    "actions",
  ],
  searchOption: {
    placeholder: "Search by email or phone...",
    searchableFields: ["email", "phone"],
  },
  actions: newsletterActions,
};

export const newsletterModalConfig: ModalConfig<NewsletterSubscriber> = {
  view: {
    component: NewsletterSubscriberViewModal,
    title: "View Subscriber",
  },
  edit: {
    component: NewsletterSubscriberEditModal,
    title: "Edit Subscriber",
  },
  create: {
    component: NewsletterSubscriberCreateModal,
    title: "Add Subscriber",
  },
  delete: {
    component: NewsletterSubscriberDeleteModal,
    title: "Delete Subscriber",
  },
  bulkDelete: {
    component: NewsletterSubscriberBulkDeleteModal,
    title: "Bulk Delete Subscribers",
  },
};

const NewsletterActionsDropdown = ({
  subscriber,
}: {
  subscriber: NewsletterSubscriber;
}) => {
  const { handleView, handleEdit, handleDelete } =
    useModalActions<NewsletterSubscriber>();

  const handleAction = (action: "view" | "edit" | "delete") => {
    switch (action) {
      case "view":
        handleView(subscriber);
        break;
      case "edit":
        handleEdit(subscriber);
        break;
      case "delete":
        handleDelete(subscriber);
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
