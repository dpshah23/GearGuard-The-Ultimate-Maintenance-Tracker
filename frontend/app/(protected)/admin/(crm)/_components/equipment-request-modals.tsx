// File: frontend/app/(protected)/admin/(crm)/_components/equipment-request-modals.tsx
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Textarea } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { Eye, Pencil, Trash, Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import { User as HeroUIUser } from "@heroui/user";
import { getLocalTimeZone } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";

import { EquipmentRequest } from "../configs/equipment-request-config";
import { useTableContext } from "../_context/table-context";

import { dateToCalendarDateTime } from "@/lib/util";
import { Divider } from "@/components/ui/divider";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// Status options
const statusOptions = [
  { key: "new", label: "New" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// Request type options
const requestTypeOptions = [
  { key: "corrective", label: "Corrective" },
  { key: "preventive", label: "Preventive" },
  { key: "inspection", label: "Inspection" },
];

// API helper functions
const fetchEquipment = async () => {
  // const response = await fetch(`${API_BASE_URL}/equipment/list`, {
  //   headers: { "Content-Type": "application/json" },
  // });

  // if (!response.ok) throw new Error("Failed to fetch equipment");

  // return response.json();
  return;
};

const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users/list`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to fetch users");

  return response.json();
};

const fetchTeams = async () => {
  const response = await fetch(`${API_BASE_URL}/teams/list`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error("Failed to fetch teams");

  return response.json();
};

// ==================== VIEW MODAL ====================
export const EquipmentRequestViewModal = ({
  item: request,
  isOpen,
  onOpenChange,
}: {
  item: EquipmentRequest;
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
                View Equipment Request
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="mb-2 text-2xl font-bold text-foreground">
                    {request.subject}
                  </h1>
                  <div className="flex gap-2">
                    <Chip
                      color={
                        request.status.toLowerCase() === "completed"
                          ? "success"
                          : request.status.toLowerCase() === "in-progress"
                            ? "warning"
                            : request.status.toLowerCase() === "cancelled"
                              ? "danger"
                              : "default"
                      }
                      startContent={<Wrench size={16} />}
                      variant="flat"
                    >
                      {request.status.toUpperCase()}
                    </Chip>
                    <Chip
                      color={
                        request.request_type.toLowerCase() === "corrective"
                          ? "danger"
                          : request.request_type.toLowerCase() === "preventive"
                            ? "primary"
                            : "secondary"
                      }
                      variant="flat"
                    >
                      {request.request_type.toUpperCase()}
                    </Chip>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground/60">
                    Request #{request.id}
                  </p>
                  <p className="text-sm font-medium">
                    Duration: {request.duration_hours} hours
                  </p>
                </div>
              </div>

              <Divider />

              <div>
                <h3 className="mb-2 text-lg font-semibold">Description</h3>
                <p className="text-foreground/80">{request.description}</p>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Equipment</h3>
                  <div className="p-3 rounded-lg bg-content2">
                    <p className="font-medium">{request.equipment_name}</p>
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Scheduled Date</h3>
                  <div className="p-3 rounded-lg bg-content2">
                    <p className="font-medium">
                      {/* {formatZonedDate(new Date(request.scheduled_date))} */}
                      {request.scheduled_date}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Assigned To</h3>
                  {request.assigned_to ? (
                    <HeroUIUser
                      avatarProps={{
                        name: request.assigned_to.username[0].toUpperCase(),
                        radius: "lg",
                      }}
                      description={request.assigned_to.email}
                      name={request.assigned_to.username}
                    />
                  ) : (
                    <p className="text-foreground/60">Unassigned</p>
                  )}
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Team</h3>
                  {request.assigned_team ? (
                    <div className="p-3 rounded-lg bg-content2">
                      <p className="font-medium">
                        {request.assigned_team.name}
                      </p>
                    </div>
                  ) : (
                    <p className="text-foreground/60">No team assigned</p>
                  )}
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Created By</h3>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Timestamps</h3>
                  <p className="text-sm">
                    <strong>Created:</strong>{" "}
                    {/* {formatZonedDate(new Date(request.created_at))} */}
                    {request.created_at}
                  </p>
                  <p className="text-sm">
                    <strong>Updated:</strong>{" "}
                    {/* {formatZonedDate(new Date(request.updated_at))} */}
                    {request.updated_at}
                  </p>
                </div>
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
export const EquipmentRequestEditModal = ({
  item: request,
  isOpen,
  onOpenChange,
}: {
  item: EquipmentRequest;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { updateItem, refresh } = useTableContext<EquipmentRequest>();
  const [form, setForm] = useState({
    subject: request.subject,
    description: request.description,
    request_type: request.request_type,
    status: request.status,
    scheduled_date: dateToCalendarDateTime(new Date(request.scheduled_date)),
    duration_hours: request.duration_hours.toString(),
    assigned_to: request.assigned_to?.id.toString() || "",
    assigned_team: request.assigned_team?.id.toString() || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, teamsData] = await Promise.all([
          fetchUsers(),
          fetchTeams(),
        ]);

        setUsers(usersData);
        setTeams(teamsData);
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to load users and teams",
          color: "danger",
        });
      }
    };

    if (isOpen) loadData();
  }, [isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateItem(request.id, {
        subject: form.subject,
        description: form.description,
        request_type: form.request_type,
        status: form.status,
        scheduled_date: form.scheduled_date
          .toDate(getLocalTimeZone())
          .toISOString(),
        duration_hours: parseFloat(form.duration_hours),
        assigned_to_id: form.assigned_to ? parseInt(form.assigned_to) : null,
        assigned_team_id: form.assigned_team
          ? parseInt(form.assigned_team)
          : null,
      });

      addToast({
        title: "Request updated",
        description: "Equipment request updated successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update request",
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
              <Pencil className="w-5 h-5 text-primary" /> Edit Equipment Request
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                isRequired
                label="Subject"
                value={form.subject}
                variant="flat"
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />

              <Textarea
                isRequired
                label="Description"
                value={form.description}
                variant="flat"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  isRequired
                  label="Request Type"
                  selectedKeys={new Set([form.request_type])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      request_type: Array.from(keys)[0] as string,
                    })
                  }
                >
                  {requestTypeOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>

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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  hideTimeZone
                  isRequired
                  showMonthAndYearPickers
                  defaultValue={form.scheduled_date}
                  label="Scheduled Date"
                  variant="flat"
                  onChange={(date) =>
                    date && setForm({ ...form, scheduled_date: date })
                  }
                />

                <Input
                  isRequired
                  label="Duration (hours)"
                  type="number"
                  value={form.duration_hours}
                  variant="flat"
                  onChange={(e) =>
                    setForm({ ...form, duration_hours: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Assigned To"
                  placeholder="Select user"
                  selectedKeys={
                    form.assigned_to ? new Set([form.assigned_to]) : new Set()
                  }
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      assigned_to: Array.from(keys)[0] as string,
                    })
                  }
                >
                  {users.map((user) => (
                    <SelectItem
                      key={user.id.toString()}
                      textValue={user.username}
                    >
                      {user.username} ({user.email})
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Assigned Team"
                  placeholder="Select team"
                  selectedKeys={
                    form.assigned_team
                      ? new Set([form.assigned_team])
                      : new Set()
                  }
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      assigned_team: Array.from(keys)[0] as string,
                    })
                  }
                >
                  {teams.map((team) => (
                    <SelectItem key={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </Select>
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
export const EquipmentRequestCreateModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { createItem, refresh } = useTableContext<EquipmentRequest>();
  const [form, setForm] = useState({
    subject: "",
    description: "",
    request_type: "corrective",
    status: "new",
    scheduled_date: dateToCalendarDateTime(new Date()),
    duration_hours: "2",
    equipment: "",
    assigned_to: "",
    assigned_team: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [equipmentData, usersData, teamsData] = await Promise.all([
          fetchEquipment(),
          fetchUsers(),
          fetchTeams(),
        ]);

        setEquipment(equipmentData);
        setUsers(usersData);
        setTeams(teamsData);
      } catch (error) {
        addToast({
          title: "Error",
          description: "Failed to load form data",
          color: "danger",
        });
      }
    };

    if (isOpen) loadData();
  }, [isOpen]);

  const handleSave = async () => {
    if (!form.subject || !form.equipment) {
      addToast({
        title: "Validation Error",
        description: "Subject and equipment are required",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    // try {
    //   await createItem({
    //     subject: form.subject,
    //     description: form.description,
    //     request_type: form.request_type,
    //     status: form.status,
    //     scheduled_date: form.scheduled_date
    //       .toDate(getLocalTimeZone())
    //       .toISOString(),
    //     duration_hours: parseFloat(form.duration_hours),
    //     equipment_id: parseInt(form.equipment),
    //     assigned_to_id: form.assigned_to ? parseInt(form.assigned_to) : null,
    //     assigned_team_id: form.assigned_team
    //       ? parseInt(form.assigned_team)
    //       : null,
    //   });

    //   addToast({
    //     title: "Request created",
    //     description: "Equipment request created successfully",
    //     color: "success",
    //   });

    //   setForm({
    //     subject: "",
    //     description: "",
    //     request_type: "corrective",
    //     status: "new",
    //     scheduled_date: dateToCalendarDateTime(new Date()),
    //     duration_hours: "2",
    //     equipment: "",
    //     assigned_to: "",
    //     assigned_team: "",
    //   });

    //   onOpenChange();
    //   refresh();
    // } catch (error: any) {
    //   addToast({
    //     title: "Error",
    //     description: error.message || "Failed to create request",
    //     color: "danger",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }

    await new Promise((resolve) => setTimeout(resolve, 500));
    addToast({
      title: "Request created",
      description: "Equipment request created successfully",
      color: "success",
    });

    setIsLoading(false);
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
              <Pencil className="w-5 h-5 text-primary" /> Create Equipment
              Request
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                isRequired
                label="Subject"
                placeholder="Enter request subject"
                value={form.subject}
                variant="flat"
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />

              <Textarea
                isRequired
                label="Description"
                placeholder="Enter detailed description"
                value={form.description}
                variant="flat"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <Select
                isRequired
                label="Equipment"
                placeholder="Select equipment"
                selectedKeys={
                  form.equipment ? new Set([form.equipment]) : new Set()
                }
                variant="flat"
                onSelectionChange={(keys) =>
                  setForm({ ...form, equipment: Array.from(keys)[0] as string })
                }
              >
                {[
                  {
                    id: 1,
                    name: "Computer",
                    serial_number: "123",
                    department: 6,
                    assigned_to: 2,
                    maintenance_team: 1,
                    location: "India",
                    purchase_date: "2025-12-27",
                    warranty_expiry: "2026-05-30",
                    is_scrapped: false,
                  },
                  {
                    id: 3,
                    name: "Motor",
                    serial_number: "1111",
                    department: 6,
                    assigned_to: 3,
                    maintenance_team: 1,
                    location: "Ahmedabad, Gujarat, India",
                    purchase_date: "2025-12-27",
                    warranty_expiry: "2025-12-29",
                    is_scrapped: false,
                  },
                  {
                    id: 2,
                    name: "Laptop",
                    serial_number: "124",
                    department: 6,
                    assigned_to: 3,
                    maintenance_team: 1,
                    location: "India",
                    purchase_date: "2025-12-27",
                    warranty_expiry: "2026-05-30",
                    is_scrapped: true,
                  },
                ].map((eq) => (
                  <SelectItem key={eq.id.toString()}>{eq.name}</SelectItem>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  isRequired
                  label="Request Type"
                  selectedKeys={new Set([form.request_type])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      request_type: Array.from(keys)[0] as string,
                    })
                  }
                >
                  {requestTypeOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>

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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  hideTimeZone
                  isRequired
                  showMonthAndYearPickers
                  defaultValue={form.scheduled_date}
                  label="Scheduled Date"
                  variant="flat"
                  onChange={(date) =>
                    date && setForm({ ...form, scheduled_date: date })
                  }
                />

                <Input
                  isRequired
                  label="Duration (hours)"
                  placeholder="Enter duration"
                  type="number"
                  value={form.duration_hours}
                  variant="flat"
                  onChange={(e) =>
                    setForm({ ...form, duration_hours: e.target.value })
                  }
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
                Create Request
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== DELETE MODAL ====================
export const EquipmentRequestDeleteModal = ({
  item: request,
  isOpen,
  onOpenChange,
}: {
  item: EquipmentRequest;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteItem, refresh } = useTableContext<EquipmentRequest>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(request.id);

      addToast({
        title: "Request deleted",
        description: "Equipment request removed successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete request",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Equipment Request
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{request.subject}</strong>?
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-foreground/80">
                    Equipment: {request.equipment_name}
                  </p>
                  <p className="text-sm text-foreground/80">
                    Status: {request.status}
                  </p>
                  <p className="text-sm text-foreground/80">
                    Type: {request.request_type}
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
export const EquipmentRequestBulkDeleteModal = ({
  items: requests,
  isOpen,
  onOpenChange,
}: {
  items: EquipmentRequest[];
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { bulkDeleteItems, refresh } = useTableContext<EquipmentRequest>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await bulkDeleteItems(requests.map((r) => r.id) as unknown as string[]);

      addToast({
        title: "Requests deleted",
        description: "Equipment requests removed successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete requests",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Equipment
              Requests
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {requests.length} request{requests.length > 1 ? "s" : ""}
                  </strong>
                  ?
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
                Delete All
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
