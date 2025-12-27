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
import { Eye, Pencil, Trash, Check } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { User as HeroUIUser } from "@heroui/user";

import { User } from "../configs/user-config";
import { useTableContext } from "../_context/table-context";

import { formatZonedDate } from "@/lib/util";
import { Divider } from "@/components/ui/divider";

// Gender & Role options - these could be moved to config
const genderOptions = [
  { key: "MALE", label: "Male" },
  { key: "FEMALE", label: "Female" },
  { key: "OTHER", label: "Other" },
];

const roleOptions = [
  { key: "USER", label: "User" },
  { key: "ADMIN", label: "Admin" },
  { key: "STAFF", label: "Staff" },
];

// ==================== VIEW MODAL ====================
export const UserViewModal = ({
  item: user,
  isOpen,
  onOpenChange,
}: {
  item: User;
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
                View User
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              <div className="flex items-center gap-4">
                <HeroUIUser
                  avatarProps={{
                    src:
                      user.image ||
                      "https://i.pravatar.cc/150?u=a04258114e29026702d",
                  }}
                  description={user.email}
                  name={user.name}
                />
                {user.image && (
                  <Image
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border border-content3"
                    height={64}
                    src={user.image}
                    width={64}
                  />
                )}

                <div>
                  <h1 className="mb-1 text-2xl font-bold text-foreground">
                    {user.name}
                  </h1>
                  <Chip
                    color={user.emailVerified ? "success" : "warning"}
                    startContent={<Check size={16} />}
                    variant="faded"
                  >
                    {user.emailVerified ? "Verified" : "Not Verified"}
                  </Chip>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone || "—"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Gender:</strong> {user.gender || "—"}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>
                </div>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <p>
                  <strong>Created:</strong> {formatZonedDate(user.createdAt)}
                </p>
                <p>
                  <strong>Updated:</strong> {formatZonedDate(user.updatedAt)}
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
export const UserEditModal = ({
  item: user,
  isOpen,
  onOpenChange,
}: {
  item: User;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { updateItem, refresh } = useTableContext<User>();
  const [form, setForm] = useState({
    name: user.name,
    gender: user.gender || "",
    email: user.email,
    phone: user.phone || "",
    image: user.image || "",
    role: user.role,
    emailVerified: user.emailVerified,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateItem(user.id, {
        ...form,
        gender: form.gender.toUpperCase() as any,
      });

      addToast({
        title: "User updated",
        description: "User details updated successfully",
        color: "success",
      });
      onOpenChange(); // Close modal
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update user",
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
              <Pencil className="w-5 h-5 text-primary" /> Edit User
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="flex gap-4">
                <Input
                  label="Name"
                  // className="w-50"
                  value={form.name}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Select
                  label="Gender"
                  selectedKeys={new Set(form.gender ? [form.gender] : [])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, gender: Array.from(keys)[0] as string })
                  }
                >
                  {genderOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-4">
                <Input
                  label="Email"
                  value={form.email}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <Input
                  label="Image URL"
                  value={form.image}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                <Select
                  label="Role"
                  // className="w-60"
                  selectedKeys={new Set([form.role])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, role: Array.from(keys)[0] as any })
                  }
                >
                  {roleOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-content2 border-content3">
                  <span className="text-sm font-medium text-foreground/50 text-nowrap">
                    Email Verified:
                  </span>
                  <Button
                    className="text-nowrap"
                    color={form.emailVerified ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      setForm({ ...form, emailVerified: !form.emailVerified })
                    }
                  >
                    {form.emailVerified ? "Verified" : "Not Verified"}
                  </Button>
                </div>
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
export const UserCreateModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { createItem } = useTableContext<User>();
  const [form, setForm] = useState({
    name: "",
    gender: "",
    email: "",
    phone: "",
    image: "",
    role: "USER",
    emailVerified: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.email) {
      addToast({
        title: "Validation Error",
        description: "Name and email are required",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      await createItem({
        ...form,
        gender: form.gender ? (form.gender.toUpperCase() as any) : null,
        role: form.role.toUpperCase() as any,
      });

      addToast({
        title: "User created",
        description: "New user added successfully",
        color: "success",
      });

      // Reset form
      setForm({
        name: "",
        gender: "",
        email: "",
        phone: "",
        image: "",
        role: "USER",
        emailVerified: false,
      });

      onOpenChange(); // Close modal
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to create user",
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
              <Pencil className="w-5 h-5 text-primary" /> Create User
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="flex gap-4">
                <Input
                  label="Name"
                  placeholder="Enter user name"
                  value={form.name}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Select
                  label="Gender"
                  placeholder="Select gender"
                  selectedKeys={new Set(form.gender ? [form.gender] : [])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, gender: Array.from(keys)[0] as string })
                  }
                >
                  {genderOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex gap-4">
                <Input
                  label="Email"
                  placeholder="Enter email address"
                  type="email"
                  value={form.email}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  label="Phone"
                  placeholder="Enter phone number"
                  value={form.phone}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <Input
                  label="Image URL"
                  placeholder="Enter image URL"
                  value={form.image}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                <Select
                  label="Role"
                  selectedKeys={new Set([form.role])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({ ...form, role: Array.from(keys)[0] as string })
                  }
                >
                  {roleOptions.map((opt) => (
                    <SelectItem key={opt.key}>{opt.label}</SelectItem>
                  ))}
                </Select>
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-content2 border-content3">
                  <span className="text-sm font-medium text-foreground/50 text-nowrap">
                    Email Verified:
                  </span>
                  <Button
                    className="text-nowrap"
                    color={form.emailVerified ? "success" : "warning"}
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      setForm({ ...form, emailVerified: !form.emailVerified })
                    }
                  >
                    {form.emailVerified ? "Verified" : "Not Verified"}
                  </Button>
                </div>
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
                Create User
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== DELETE MODAL ====================
export const UserDeleteModal = ({
  item: user,
  isOpen,
  onOpenChange,
}: {
  item: User;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteItem } = useTableContext<User>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(user.id);

      addToast({
        title: "User deleted",
        description: "User removed successfully",
        color: "success",
      });
      onOpenChange(); // Close modal
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete user",
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
              <Trash className="w-5 h-5 text-danger" /> Delete User
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete <strong>{user.name}</strong>?
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

// ==================== BULK DELETE MODAL ====================
export const UserBulkDeleteModal = ({
  items: [...users],
  isOpen,
  onOpenChange,
}: {
  items: User[];
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { bulkDeleteItems, refresh } = useTableContext<User>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await bulkDeleteItems(users as unknown as string[]);

      addToast({
        title: "Users deleted",
        description: "Users removed successfully",
        color: "success",
      });
      onOpenChange(); // Close modal
      refresh(); // Refresh table data
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete user",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Users
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {users.length} user{users.length > 1 ? "s" : ""}
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
