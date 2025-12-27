// File: app/(protected)/admin/(crm)/_components/payment-modals.tsx
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Eye, Pencil, Trash, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { User as HeroUIUser } from "@heroui/user";
import { getLocalTimeZone } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";
import { Avatar } from "@heroui/avatar";
import { Selection } from "@heroui/table";

import { Payment } from "../configs/payment-config";
import { useTableContext } from "../_context/table-context";

import { dateToCalendarDateTime, formatZonedDate } from "@/lib/util";
import { Divider } from "@/components/ui/divider";
import { findAllUsers } from "@/lib/db/user";
import { findAllWebinars } from "@/lib/db/webinar";

// Status options
const statusOptions = [
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "failed", label: "Failed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "refunded", label: "Refunded" },
];

// ==================== VIEW MODAL ====================
export const PaymentViewModal = ({
  item: payment,
  isOpen,
  onOpenChange,
}: {
  item: Payment;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      placement="auto"
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                View Payment
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-1 text-2xl font-bold text-foreground">
                    Payment #{payment.id}
                  </h1>
                  <Chip
                    color={
                      payment.status.toLowerCase() === "completed"
                        ? "success"
                        : payment.status.toLowerCase() === "pending"
                          ? "warning"
                          : "danger"
                    }
                    startContent={<DollarSign size={16} />}
                    variant="flat"
                  >
                    {payment.status.toUpperCase()}
                  </Chip>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ₹{payment.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {formatZonedDate(payment.time)}
                  </p>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">User Details</h3>
                  <HeroUIUser
                    avatarProps={{
                      name: payment.user.name[0],
                      radius: "lg",
                    }}
                    description={payment.user.email}
                    name={payment.user.name}
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Webinar Details
                  </h3>
                  <div>
                    <p className="font-medium">{payment.webinar.title}</p>
                    <p className="text-sm text-foreground/60">
                      Price: ₹{payment.webinar.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <p>
                  <strong>Created:</strong> {formatZonedDate(payment.createdAt)}
                </p>
                <p>
                  <strong>Updated:</strong> {formatZonedDate(payment.updatedAt)}
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== EDIT MODAL ====================
export const PaymentEditModal = ({
  item: payment,
  isOpen,
  onOpenChange,
}: {
  item: Payment;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { updateItem, refresh } = useTableContext<Payment>();
  const [form, setForm] = useState({
    amount: payment.amount.toString(),
    status: payment.status,
    time: dateToCalendarDateTime(new Date(payment.time)), // Format for datetime-local input
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateItem(payment.id, {
        amount: parseFloat(form.amount),
        status: form.status.toUpperCase(),
        time: form.time.toDate(getLocalTimeZone()),
      });

      addToast({
        title: "Payment updated",
        description: "Payment details updated successfully",
        color: "success",
      });
      onOpenChange(); // Close modal
      refresh();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to update payment",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" /> Edit Payment
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-content2 border-content3">
                <h4 className="mb-2 font-medium">Payment Details</h4>
                <p>
                  User: {payment.user.name} ({payment.user.email})
                </p>
                <p>Webinar: {payment.webinar.title}</p>
              </div>

              <div className="flex gap-4">
                <Input
                  label="Amount"
                  startContent="₹"
                  type="number"
                  value={form.amount}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <Select
                  label="Status"
                  selectedKeys={new Set([form.status.toLowerCase()])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, status: Array.from(keys)[0] as string })
                  }
                >
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={form.time}
                  label="Payment Time"
                  variant="flat"
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={handleSave}
              >
                Save Changes
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== CREATE MODAL ====================
export const PaymentCreateModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { createItem } = useTableContext<Payment>();
  const [userId, setUserId] = useState<Selection>(new Set([]));
  const [webinarId, setWebinarId] = useState<Selection>(new Set([]));

  const [form, setForm] = useState({
    userId: "",
    webinarId: "",
    amount: "",
    status: "pending",
    time: dateToCalendarDateTime(new Date()),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [webinars, setWebinars] = useState<any[]>([]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      userId: Array.from(userId)[0]?.toString() || "",
      webinarId: Array.from(webinarId)[0]?.toString() || "",
    }));
  }, [userId, webinarId]);
  // Fetch users and webinars for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await findAllUsers({
          where: { role: "USER" },
          select: { id: true, name: true, email: true, image: true },
        });
        const webinarsData = await findAllWebinars();

        setUsers(usersData);
        setWebinars(webinarsData);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        addToast({
          title: "Error occurred",
          description: "Failed to fetch users and webinars",
          color: "danger",
        });
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!form.userId || !form.webinarId || !form.amount) {
      addToast({
        title: "Validation Error",
        description: "User, webinar, and amount are required",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      await createItem({
        userId: form.userId,
        webinarId: parseInt(form.webinarId),
        amount: parseFloat(form.amount),
        status: form.status.toUpperCase(),
        time: form.time.toDate(getLocalTimeZone()),
      });

      addToast({
        title: "Payment created",
        description: "New payment added successfully",
        color: "success",
      });

      // Reset form
      setForm({
        userId: "",
        webinarId: "",
        amount: "",
        status: "pending",
        time: dateToCalendarDateTime(new Date()),
      });

      onOpenChange(); // Close modal
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to create payment",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Pencil className="w-5 h-5 text-primary" /> Create Payment
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="flex gap-4">
                <Select
                  isRequired
                  classNames={{
                    label: "group-data-[filled=true]:-translate-y-5",
                    trigger: "min-h-16",
                  }}
                  items={users}
                  label="Users"
                  listboxProps={{
                    itemClasses: {
                      base: [
                        "rounded-md",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "data-[hover=true]:bg-default-100",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[selectable=true]:focus:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    },
                  }}
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "p-0 border-small border-divider bg-background",
                    },
                  }}
                  renderValue={(items) => {
                    return items.map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <Avatar
                          alt={item.data.name}
                          className="shrink-0"
                          size="sm"
                          src={item.data.avatar}
                        />
                        <div className="flex flex-col">
                          <span>{item.data.name}</span>
                          <span className="text-default-500 text-tiny">
                            ({item.data.email})
                          </span>
                        </div>
                      </div>
                    ));
                  }}
                  variant="flat"
                  onSelectionChange={setUserId}
                >
                  {(user) => (
                    <SelectItem key={user.id} textValue={user.name}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={user.name}
                          className="shrink-0"
                          size="sm"
                          src={user.avatar}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{user.name}</span>
                          <span className="text-tiny text-default-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                <Select
                  isRequired
                  classNames={{
                    label: "group-data-[filled=true]:-translate-y-5",
                    trigger: "min-h-16",
                  }}
                  items={webinars}
                  label="Webinars"
                  listboxProps={{
                    itemClasses: {
                      base: [
                        "rounded-md",
                        "text-default-500",
                        "transition-opacity",
                        "data-[hover=true]:text-foreground",
                        "data-[hover=true]:bg-default-100",
                        "dark:data-[hover=true]:bg-default-50",
                        "data-[selectable=true]:focus:bg-default-50",
                        "data-[pressed=true]:opacity-70",
                        "data-[focus-visible=true]:ring-default-500",
                      ],
                    },
                  }}
                  popoverProps={{
                    classNames: {
                      base: "before:bg-default-200",
                      content: "p-0 border-small border-divider bg-background",
                    },
                  }}
                  renderValue={(items) => {
                    return items.map((item) => (
                      <div
                        key={item.data.id}
                        className="flex items-center gap-2"
                      >
                        <Avatar
                          alt={item.data.title}
                          className="shrink-0"
                          size="sm"
                          src={item.data.thumbnail}
                        />
                        <span>{item.data.title}</span>
                      </div>
                    ));
                  }}
                  variant="flat"
                  onSelectionChange={setWebinarId}
                >
                  {(webinar) => (
                    <SelectItem key={webinar.id} textValue={webinar.title}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={webinar.title}
                          className="shrink-0"
                          size="sm"
                          src={webinar.thumbnail}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{webinar.title}</span>
                          <span className="text-tiny text-default-400">
                            {webinar.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              </div>

              <div className="flex gap-4">
                <Input
                  isRequired
                  label="Amount"
                  placeholder="Enter amount"
                  startContent="₹"
                  type="number"
                  value={form.amount}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <Select
                  isRequired
                  label="Status"
                  selectedKeys={new Set([form.status])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, status: Array.from(keys)[0] as string })
                  }
                >
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>

                <DatePicker
                  hideTimeZone
                  isRequired
                  showMonthAndYearPickers
                  defaultValue={form.time}
                  label="Payment Time"
                  variant="flat"
                  onChange={(date) => date && setForm({ ...form, time: date })}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onPress={handleSave}
              >
                Create Payment
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== DELETE MODAL ====================
export const PaymentDeleteModal = ({
  item: payment,
  isOpen,
  onOpenChange,
}: {
  item: Payment;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteItem } = useTableContext<Payment>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(payment.id);

      addToast({
        title: "Payment deleted",
        description: "Payment removed successfully",
        color: "success",
      });
      onOpenChange(); // Close modal
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete payment",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Trash className="w-5 h-5 text-danger" /> Delete Payment
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>Payment #{payment.id}</strong>?
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-foreground/80">
                    User: {payment.user.name} ({payment.user.email})
                  </p>
                  <p className="text-sm text-foreground/80">
                    Webinar: {payment.webinar.title}
                  </p>
                  <p className="text-sm text-foreground/80">
                    Amount: ₹{payment.amount.toFixed(2)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-foreground/60">
                  This action cannot be undone.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isLoading}
                onPress={handleDelete}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== BULK DELETE MODAL ====================
export const PaymentBulkDeleteModal = ({
  items: [...payments],
  isOpen,
  onOpenChange,
}: {
  items: Payment[];
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { bulkDeleteItems, refresh } = useTableContext<Payment>();
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await bulkDeleteItems(payments.map((p) => p.id) as unknown as string[]);

      addToast({
        title: "Payments deleted",
        description: "Payments removed successfully",
        color: "success",
      });
      onOpenChange(); // Close modal
      refresh(); // Refresh table data
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete payments",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Trash className="w-5 h-5 text-danger" /> Delete Payments
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {payments.length} payment{payments.length > 1 ? "s" : ""}
                  </strong>
                  ?
                </p>
                <p className="mt-2 text-sm text-foreground/80">
                  Total amount: ₹{totalAmount.toFixed(2)}
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  This action cannot be undone.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                isLoading={isLoading}
                onPress={handleDelete}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
