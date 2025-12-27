// File: frontend/app/(protected)/admin/(crm)/_components/equipment-modals.tsx
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
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
import { DatePicker } from "@heroui/date-picker";
import { parseDate } from "@internationalized/date";

import { Equipment } from "../configs/equipment-config";
import { useTableContext } from "../_context/table-context";

import { formatZonedDate } from "@/lib/util";
import { Divider } from "@/components/ui/divider";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// ==================== VIEW MODAL ====================
export const EquipmentViewModal = ({
  item: equipment,
  isOpen,
  onOpenChange,
}: {
  item: Equipment;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const warrantyExpired = new Date(equipment.warranty_expiry) < new Date();

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
                View Equipment
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-1 text-2xl font-bold text-foreground">
                    {equipment.name}
                  </h1>
                  <p className="text-sm text-foreground/60">
                    SN: {equipment.serial_number}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Chip
                      color={equipment.is_scrapped ? "danger" : "success"}
                      startContent={<Wrench size={16} />}
                      variant="flat"
                    >
                      {equipment.is_scrapped ? "SCRAPPED" : "ACTIVE"}
                    </Chip>
                    {warrantyExpired && (
                      <Chip color="danger" variant="flat">
                        Warranty Expired
                      </Chip>
                    )}
                  </div>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <strong>Department:</strong>{" "}
                      {equipment.department_name || `#${equipment.department}`}
                    </p>
                    <p>
                      <strong>Location:</strong> {equipment.location}
                    </p>
                    <p>
                      <strong>Maintenance Team:</strong>{" "}
                      {equipment.maintenance_team_name ||
                        `#${equipment.maintenance_team}`}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">Assignment</h3>
                  {equipment.assigned_to ? (
                    equipment.assigned_to_name ? (
                      <HeroUIUser
                        avatarProps={{
                          name: equipment.assigned_to_name[0],
                          radius: "lg",
                        }}
                        description={equipment.assigned_to_email}
                        name={equipment.assigned_to_name}
                      />
                    ) : (
                      <p>User #{equipment.assigned_to}</p>
                    )
                  ) : (
                    <p className="text-foreground/40">Unassigned</p>
                  )}
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <p>
                  <strong>Purchase Date:</strong>{" "}
                  {formatZonedDate(new Date(equipment.purchase_date))}
                </p>
                <p>
                  <strong>Warranty Expiry:</strong>{" "}
                  {formatZonedDate(new Date(equipment.warranty_expiry))}
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
export const EquipmentEditModal = ({
  item: equipment,
  isOpen,
  onOpenChange,
}: {
  item: Equipment;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { updateItem, refresh } = useTableContext<Equipment>();
  const [form, setForm] = useState({
    name: equipment.name,
    serial_number: equipment.serial_number,
    location: equipment.location,
    purchase_date: parseDate(equipment.purchase_date),
    warranty_expiry: parseDate(equipment.warranty_expiry),
    is_scrapped: equipment.is_scrapped,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateItem(equipment.id, {
        name: form.name,
        serial_number: form.serial_number,
        location: form.location,
        purchase_date: form.purchase_date.toString(),
        warranty_expiry: form.warranty_expiry.toString(),
        is_scrapped: form.is_scrapped,
      });

      addToast({
        title: "Equipment updated",
        description: "Equipment details updated successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update equipment",
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
              <Pencil className="w-5 h-5 text-primary" /> Edit Equipment
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-content2 border-content3">
                <h4 className="mb-2 font-medium">Equipment Details</h4>
                <p>ID: {equipment.id}</p>
                <p>
                  Department:{" "}
                  {equipment.department_name || `#${equipment.department}`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  isRequired
                  label="Name"
                  value={form.name}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  isRequired
                  label="Serial Number"
                  value={form.serial_number}
                  variant="flat"
                  onChange={(e) =>
                    setForm({ ...form, serial_number: e.target.value })
                  }
                />
              </div>

              <Input
                isRequired
                label="Location"
                value={form.location}
                variant="flat"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  isRequired
                  label="Purchase Date"
                  value={form.purchase_date}
                  variant="flat"
                  onChange={(date) =>
                    date && setForm({ ...form, purchase_date: date })
                  }
                />
                <DatePicker
                  isRequired
                  label="Warranty Expiry"
                  value={form.warranty_expiry}
                  variant="flat"
                  onChange={(date) =>
                    date && setForm({ ...form, warranty_expiry: date })
                  }
                />
              </div>

              <Switch
                isSelected={form.is_scrapped}
                onValueChange={(checked) =>
                  setForm({ ...form, is_scrapped: checked })
                }
              >
                Mark as Scrapped
              </Switch>
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
export const EquipmentCreateModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { createItem, refresh } = useTableContext<Equipment>();
  const [form, setForm] = useState({
    name: "",
    serial_number: "",
    department: "",
    assigned_to: "",
    maintenance_team: "",
    location: "",
    purchase_date: parseDate(new Date().toISOString().split("T")[0]),
    warranty_expiry: parseDate(
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    ),
    is_scrapped: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments, users, and teams from your Django API
        const [deptRes, usersRes, teamsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/departments/`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/users/`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/maintenance-teams/`, {
            credentials: "include",
          }),
        ]);

        if (deptRes.ok) setDepartments(await deptRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
        if (teamsRes.ok) setTeams(await teamsRes.json());
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (
      !form.name ||
      !form.serial_number ||
      !form.department ||
      !form.maintenance_team ||
      !form.location
    ) {
      addToast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      await createItem({
        name: form.name,
        serial_number: form.serial_number,
        department: parseInt(form.department),
        assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
        maintenance_team: parseInt(form.maintenance_team),
        location: form.location,
        purchase_date: form.purchase_date.toString(),
        warranty_expiry: form.warranty_expiry.toString(),
        is_scrapped: form.is_scrapped,
      });

      addToast({
        title: "Equipment created",
        description: "New equipment added successfully",
        color: "success",
      });

      setForm({
        name: "",
        serial_number: "",
        department: "",
        assigned_to: "",
        maintenance_team: "",
        location: "",
        purchase_date: parseDate(new Date().toISOString().split("T")[0]),
        warranty_expiry: parseDate(
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        ),
        is_scrapped: false,
      });

      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to create equipment",
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
              <Pencil className="w-5 h-5 text-primary" /> Create Equipment
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter equipment name"
                  value={form.name}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  isRequired
                  label="Serial Number"
                  placeholder="Enter serial number"
                  value={form.serial_number}
                  variant="flat"
                  onChange={(e) =>
                    setForm({ ...form, serial_number: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  isRequired
                  label="Department"
                  placeholder="Select department"
                  selectedKeys={
                    form.department ? new Set([form.department]) : new Set()
                  }
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      department: Array.from(keys)[0] as string,
                    })
                  }
                >
                  {departments.map((dept) => (
                    <SelectItem key={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Assigned To"
                  placeholder="Select user (optional)"
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
                    <SelectItem key={user.id.toString()}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  isRequired
                  label="Maintenance Team"
                  placeholder="Select maintenance team"
                  selectedKeys={
                    form.maintenance_team
                      ? new Set([form.maintenance_team])
                      : new Set()
                  }
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      maintenance_team: Array.from(keys)[0] as string,
                    })
                  }
                >
                  {teams.map((team) => (
                    <SelectItem key={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  isRequired
                  label="Location"
                  placeholder="Enter location"
                  value={form.location}
                  variant="flat"
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker
                  isRequired
                  label="Purchase Date"
                  value={form.purchase_date}
                  variant="flat"
                  onChange={(date) =>
                    date && setForm({ ...form, purchase_date: date })
                  }
                />
                <DatePicker
                  isRequired
                  label="Warranty Expiry"
                  value={form.warranty_expiry}
                  variant="flat"
                  onChange={(date) =>
                    date && setForm({ ...form, warranty_expiry: date })
                  }
                />
              </div>

              <Switch
                isSelected={form.is_scrapped}
                onValueChange={(checked) =>
                  setForm({ ...form, is_scrapped: checked })
                }
              >
                Mark as Scrapped
              </Switch>
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
                Create Equipment
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== DELETE MODAL ====================
export const EquipmentDeleteModal = ({
  item: equipment,
  isOpen,
  onOpenChange,
}: {
  item: Equipment;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteItem, refresh } = useTableContext<Equipment>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(equipment.id);

      addToast({
        title: "Equipment deleted",
        description: "Equipment removed successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete equipment",
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
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{equipment.name}</strong>?
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-foreground/80">
                    Serial Number: {equipment.serial_number}
                  </p>
                  <p className="text-sm text-foreground/80">
                    Location: {equipment.location}
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
export const EquipmentBulkDeleteModal = ({
  items: equipment,
  isOpen,
  onOpenChange,
}: {
  items: Equipment[];
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { bulkDeleteItems, refresh } = useTableContext<Equipment>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await bulkDeleteItems(equipment.map((e) => e.id) as unknown as string[]);

      addToast({
        title: "Equipment deleted",
        description: "Equipment removed successfully",
        color: "success",
      });
      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete equipment",
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
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {equipment.length} equipment item
                    {equipment.length > 1 ? "s" : ""}
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
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
