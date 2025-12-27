"use client";

// import type { SelectedItems } from "@heroui/react";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectedItems, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { Eye, Pencil, Trash, Package } from "lucide-react";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";

import { useTableContext } from "../../_context/table-context";
import { OrderWithRelations } from "../../configs/marketplace/orders-config";

import { Divider } from "@/components/ui/divider";
import { dateToCalendarDateTime, formatZonedDate } from "@/lib/util";
import { OrderStatus, User, Service } from "@/app/generated/prisma";
import { findAllUsers } from "@/lib/db/user";
import { searchServices } from "@/lib/db/marketplace/services";

// Status color map
const statusColorMap: Record<
  OrderStatus,
  "default" | "primary" | "success" | "warning" | "danger"
> = {
  PENDING: "warning",
  IN_PROGRESS: "primary",
  COMPLETED: "success",
  CANCELLED: "danger",
};

// ==================== VIEW MODAL ====================
export const OrderViewModal = ({
  item: order,
  isOpen,
  onOpenChange,
}: {
  item: OrderWithRelations;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      placement="auto"
      scrollBehavior="inside"
      size="3xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                View Order
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-1 text-2xl font-bold text-foreground">
                    Order #{order.id.slice(0, 8)}
                  </h1>
                  <Chip
                    color={statusColorMap[order.status]}
                    startContent={<Package size={16} />}
                    variant="flat"
                  >
                    {order.status.replace(/_/g, " ")}
                  </Chip>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    ₹{order.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-foreground/60">Total Amount</p>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Service Details
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Title:</strong> {order.service?.title || "N/A"}
                    </p>
                    <p>
                      <strong>Service ID:</strong>{" "}
                      <span className="font-mono text-xs">
                        {order.serviceId.slice(0, 12)}...
                      </span>
                    </p>
                    <p>
                      <strong>Price:</strong> ₹
                      {order.service?.price.toFixed(2) || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">Order Timeline</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Created:</strong>{" "}
                      {formatZonedDate(order.createdAt)}
                    </p>
                    <p>
                      <strong>Updated:</strong>{" "}
                      {formatZonedDate(order.updatedAt)}
                    </p>
                    <p>
                      <strong>Delivery Date:</strong>{" "}
                      {order.deliveryDate
                        ? formatZonedDate(order.deliveryDate)
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Buyer Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {order.buyer?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.buyer?.email || "N/A"}
                    </p>
                    <p>
                      <strong>ID:</strong>{" "}
                      <span className="font-mono text-xs">
                        {order.buyerId.slice(0, 12)}...
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Seller Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {order.seller?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.seller?.email || "N/A"}
                    </p>
                    <p>
                      <strong>ID:</strong>{" "}
                      <span className="font-mono text-xs">
                        {order.sellerId.slice(0, 12)}...
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

              {order.requirements && (
                <>
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Requirements</h3>
                    <p className="text-foreground/80">{order.requirements}</p>
                  </div>
                  <Divider />
                </>
              )}
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
export const OrderEditModal = ({
  item: order,
  isOpen,
  onOpenChange,
}: {
  item: OrderWithRelations;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { updateItem, refresh } = useTableContext<OrderWithRelations>();
  const [deliveryDate, setDeliveryDate] = useState<DateValue | null>(
    order.deliveryDate
      ? dateToCalendarDateTime(new Date(order.deliveryDate))
      : null,
  );
  const [form, setForm] = useState({
    status: order.status,
    amount: order.amount.toString(),
    requirements: order.requirements || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!form.amount || parseFloat(form.amount) <= 0) {
      addToast({
        title: "Validation Error",
        description: "Amount must be greater than 0",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      await updateItem(order.id, {
        status: form.status,
        amount: parseFloat(form.amount),
        requirements: form.requirements || null,
        deliveryDate: deliveryDate
          ? deliveryDate.toDate(getLocalTimeZone())
          : null,
      });

      addToast({
        title: "Order updated",
        description: "Order details updated successfully",
        color: "success",
      });

      setDeliveryDate(null);
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update order",
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
              <Pencil className="w-5 h-5 text-primary" /> Edit Order
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 rounded-lg bg-content2">
                <p className="text-sm text-foreground/60">
                  Order ID:{" "}
                  <span className="font-mono">{order.id.slice(0, 12)}...</span>
                </p>
                <p className="text-sm text-foreground/60">
                  Service: {order.service?.title || "N/A"}
                </p>
                <p className="text-sm text-foreground/60">
                  Buyer ID: {order.buyerId || "N/A"}
                </p>
                <p className="text-sm text-foreground/60">
                  Seller ID: {order.sellerId || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Select
                  isRequired
                  label="Status"
                  selectedKeys={new Set([form.status])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      status: Array.from(keys)[0] as OrderStatus,
                    })
                  }
                >
                  <SelectItem key={OrderStatus.PENDING}>Pending</SelectItem>
                  <SelectItem key={OrderStatus.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem key={OrderStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem key={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                </Select>

                <Input
                  isRequired
                  label="Amount"
                  placeholder="0.00"
                  startContent={<span className="text-foreground/60">₹</span>}
                  type="number"
                  value={form.amount}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />

                <DatePicker
                  defaultValue={dateToCalendarDateTime(
                    new Date(order.deliveryDate || ""),
                  )}
                  granularity="day"
                  label="Delivery Date"
                  minValue={today(getLocalTimeZone())}
                  value={deliveryDate}
                  onChange={(date) => setDeliveryDate(date)}
                />
              </div>

              <Textarea
                label="Requirements"
                placeholder="Enter order requirements"
                value={form.requirements}
                variant="flat"
                onChange={(e) =>
                  setForm({ ...form, requirements: e.target.value })
                }
              />
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
                Update Order
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== CREATE MODAL ====================
export const OrderCreateModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { createItem } = useTableContext<OrderWithRelations>();
  const [form, setForm] = useState({
    serviceId: "",
    buyerId: "",
    sellerId: "",
    amount: "",
    status: OrderStatus.PENDING as OrderStatus,
    requirements: "",
    // deliveryDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [buyers, setBuyers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch users and services when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [usersData, servicesData] = await Promise.all([
        findAllUsers(),
        searchServices(),
      ]);
      const sellersData = usersData.filter((user) => user.role === "SELLER");
      const buyersData = usersData.filter((user) => user.role === "USER");

      setBuyers(buyersData || []);
      setSellers(sellersData || []);
      if (servicesData.success && servicesData.data) {
        setServices(servicesData.data.services || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      addToast({
        title: "Error",
        description: "Failed to load users and services",
        color: "danger",
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSave = async () => {
    if (!form.serviceId || !form.buyerId || !form.sellerId || !form.amount) {
      addToast({
        title: "Validation Error",
        description: "Service, Buyer, Seller, and Amount are required",
        color: "danger",
      });

      return;
    }

    if (parseFloat(form.amount) <= 0) {
      addToast({
        title: "Validation Error",
        description: "Amount must be greater than 0",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      await createItem({
        serviceId: form.serviceId,
        buyerId: form.buyerId,
        sellerId: form.sellerId,
        amount: parseFloat(form.amount),
        status: form.status,
        requirements: form.requirements || null,
        deliveryDate: deliveryDate
          ? deliveryDate.toDate(getLocalTimeZone())
          : null,
      });

      addToast({
        title: "Order created",
        description: "New order added successfully",
        color: "success",
      });

      setForm({
        serviceId: "",
        buyerId: "",
        sellerId: "",
        amount: "",
        status: OrderStatus.PENDING,
        requirements: "",
      });

      setDeliveryDate(null);
      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to create order",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const selectedService = services.find((s) => s.id === form.serviceId);
  const [deliveryDate, setDeliveryDate] = useState<DateValue | null>(null);

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
              <Pencil className="w-5 h-5 text-primary" /> Create Order
            </ModalHeader>

            <ModalBody className="space-y-4">
              {loadingData ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-2 border-2 rounded-full border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-foreground/60">
                      Loading data...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Select
                    isRequired
                    classNames={{
                      trigger: "h-12",
                    }}
                    items={services}
                    label="Service"
                    labelPlacement="outside"
                    placeholder="Select a service"
                    renderValue={(items: SelectedItems<Service>) => {
                      return items.map((item) => (
                        <div key={item.key} className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span>{item.data?.title}</span>
                            <span className="text-tiny text-default-500">
                              ₹{item.data?.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ));
                    }}
                    selectedKeys={
                      form.serviceId ? new Set([form.serviceId]) : new Set()
                    }
                    variant="flat"
                    onSelectionChange={(keys) => {
                      const serviceId = Array.from(keys)[0] as string;
                      const service = services.find((s) => s.id === serviceId);

                      setForm({
                        ...form,
                        serviceId,
                        amount: service?.price.toString() || "",
                      });
                    }}
                  >
                    {(service) => (
                      <SelectItem key={service.id} textValue={service.title}>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="text-small">{service.title}</span>
                            <span className="text-tiny text-default-400">
                              ₹{service.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    )}
                  </Select>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Select
                      isRequired
                      classNames={{
                        trigger: "h-12",
                      }}
                      items={buyers}
                      label="Buyer"
                      labelPlacement="outside"
                      placeholder="Select a buyer"
                      renderValue={(items: SelectedItems<User>) => {
                        return items.map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center gap-2"
                          >
                            <Avatar
                              alt={item.data?.name || ""}
                              className="shrink-0"
                              size="sm"
                              src={item.data?.image || ""}
                            />
                            <div className="flex flex-col">
                              <span>{item.data?.name}</span>
                              <span className="text-tiny text-default-500">
                                ({item.data?.email})
                              </span>
                            </div>
                          </div>
                        ));
                      }}
                      selectedKeys={
                        form.buyerId ? new Set([form.buyerId]) : new Set()
                      }
                      variant="flat"
                      onSelectionChange={(keys) =>
                        setForm({
                          ...form,
                          buyerId: Array.from(keys)[0] as string,
                        })
                      }
                    >
                      {(user) => (
                        <SelectItem key={user.id} textValue={user.name || ""}>
                          <div className="flex items-center gap-2">
                            <Avatar
                              alt={user.name || ""}
                              className="shrink-0"
                              size="sm"
                              src={user.image || ""}
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
                        trigger: "h-12",
                      }}
                      items={sellers}
                      label="Seller"
                      labelPlacement="outside"
                      placeholder="Select a seller"
                      renderValue={(items: SelectedItems<User>) => {
                        return items.map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center gap-2"
                          >
                            <Avatar
                              alt={item.data?.name || ""}
                              className="shrink-0"
                              size="sm"
                              src={item.data?.image || ""}
                            />
                            <div className="flex flex-col">
                              <span>{item.data?.name}</span>
                              <span className="text-tiny text-default-500">
                                ({item.data?.email})
                              </span>
                            </div>
                          </div>
                        ));
                      }}
                      selectedKeys={
                        form.sellerId ? new Set([form.sellerId]) : new Set()
                      }
                      variant="flat"
                      onSelectionChange={(keys) =>
                        setForm({
                          ...form,
                          sellerId: Array.from(keys)[0] as string,
                        })
                      }
                    >
                      {(user) => (
                        <SelectItem key={user.id} textValue={user.name || ""}>
                          <div className="flex items-center gap-2">
                            <Avatar
                              alt={user.name || ""}
                              className="shrink-0"
                              size="sm"
                              src={user.image || ""}
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
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Input
                      isRequired
                      label="Amount"
                      placeholder="0.00"
                      startContent={
                        <span className="text-foreground/60">₹</span>
                      }
                      type="number"
                      value={form.amount}
                      variant="flat"
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                    />

                    <Select
                      isRequired
                      label="Status"
                      selectedKeys={new Set([form.status])}
                      variant="flat"
                      onSelectionChange={(keys) =>
                        setForm({
                          ...form,
                          status: Array.from(keys)[0] as OrderStatus,
                        })
                      }
                    >
                      <SelectItem key={OrderStatus.PENDING}>Pending</SelectItem>
                      <SelectItem key={OrderStatus.IN_PROGRESS}>
                        In Progress
                      </SelectItem>
                      <SelectItem key={OrderStatus.COMPLETED}>
                        Completed
                      </SelectItem>
                      <SelectItem key={OrderStatus.CANCELLED}>
                        Cancelled
                      </SelectItem>
                    </Select>

                    <DatePicker
                      defaultValue={today(getLocalTimeZone()).subtract({
                        days: 1,
                      })}
                      granularity="day"
                      label="Delivery Date"
                      minValue={today(getLocalTimeZone())}
                      value={deliveryDate}
                      onChange={(date) => setDeliveryDate(date)}
                    />
                  </div>
                  <Textarea
                    label="Requirements"
                    placeholder="Enter order requirements"
                    value={form.requirements}
                    variant="flat"
                    onChange={(e) =>
                      setForm({ ...form, requirements: e.target.value })
                    }
                  />
                </>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isDisabled={loadingData}
                isLoading={isLoading}
                onPress={handleSave}
              >
                Create Order
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== DELETE MODAL ====================
export const OrderDeleteModal = ({
  item: order,
  isOpen,
  onOpenChange,
}: {
  item: OrderWithRelations;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteItem } = useTableContext<OrderWithRelations>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(order.id);

      addToast({
        title: "Order deleted",
        description: "Order removed successfully",
        color: "success",
      });

      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete order",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Order
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete order{" "}
                  <strong className="font-mono">#{order.id.slice(0, 8)}</strong>
                  ?
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  This action cannot be undone.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-content2">
                <p className="text-sm">
                  <strong>Service:</strong> {order.service?.title || "N/A"}
                </p>
                <p className="text-sm">
                  <strong>Amount:</strong> ₹{order.amount.toFixed(2)}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <Chip
                    className="capitalize"
                    color={statusColorMap[order.status]}
                    size="sm"
                    variant="flat"
                  >
                    {order.status.replace(/_/g, " ")}
                  </Chip>
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
export const OrderBulkDeleteModal = ({
  items: orders,
  isOpen,
  onOpenChange,
}: {
  items: OrderWithRelations[];
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { bulkDeleteItems, refresh } = useTableContext<OrderWithRelations>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await bulkDeleteItems(orders as unknown as string[]);

      addToast({
        title: "Orders deleted",
        description: "Orders removed successfully",
        color: "success",
      });

      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete orders",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <Modal isOpen={isOpen} size="md" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-2">
              <Trash className="w-5 h-5 text-danger" /> Delete Orders
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {orders.length} order{orders.length > 1 ? "s" : ""}
                  </strong>
                  ?
                </p>
                <p className="mt-2 text-sm text-foreground/60">
                  This action cannot be undone.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-content2">
                <p className="text-sm">
                  <strong>Total Orders:</strong> {orders.length}
                </p>
                <p className="text-sm">
                  <strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}
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
