"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectedItems, SelectItem } from "@heroui/select";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { Eye, Pencil, Trash, Tag } from "lucide-react";
import { Checkbox } from "@heroui/checkbox";

import { useTableContext } from "../../_context/table-context";

import { Divider } from "@/components/ui/divider";
import { bgColorMap, formatZonedDate } from "@/lib/util";
import { Category, TailwindColor } from "@/app/generated/prisma";
import { iconMap, IconPicker } from "@/components/icon-picker";

// At the top of your file, outside the component
const COLOR_DATA: ColorData[] = [
  { id: "red", name: "Red", value: "red" },
  { id: "orange", name: "Orange", value: "orange" },
  { id: "amber", name: "Amber", value: "amber" },
  { id: "yellow", name: "Yellow", value: "yellow" },
  { id: "lime", name: "Lime", value: "lime" },
  { id: "green", name: "Green", value: "green" },
  { id: "emerald", name: "Emerald", value: "emerald" },
  { id: "teal", name: "Teal", value: "teal" },
  { id: "cyan", name: "Cyan", value: "cyan" },
  { id: "sky", name: "Sky", value: "sky" },
  { id: "blue", name: "Blue", value: "blue" },
  { id: "indigo", name: "Indigo", value: "indigo" },
  { id: "violet", name: "Violet", value: "violet" },
  { id: "purple", name: "Purple", value: "purple" },
  { id: "fuchsia", name: "Fuchsia", value: "fuchsia" },
  { id: "pink", name: "Pink", value: "pink" },
  { id: "rose", name: "Rose", value: "rose" },
  { id: "gray", name: "Gray", value: "gray" },
  { id: "slate", name: "Slate", value: "slate" },
  { id: "zinc", name: "Zinc", value: "zinc" },
  { id: "neutral", name: "Neutral", value: "neutral" },
  { id: "stone", name: "Stone", value: "stone" },
];

type ColorData = {
  id: string;
  name: string;
  value: string;
};
// ==================== VIEW MODAL ====================
export const CategoryViewModal = ({
  item: category,
  isOpen,
  onOpenChange,
}: {
  item: Category;
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
                View Category
              </div>
            </ModalHeader>

            <ModalBody className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="mb-1 text-2xl font-bold text-foreground">
                    {category.name}
                  </h1>
                  <Chip
                    color={category.trending ? "success" : "default"}
                    startContent={<Tag size={16} />}
                    variant="flat"
                  >
                    {category.trending ? "TRENDING" : "NORMAL"}
                  </Chip>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground/60">
                    Slug: {category.slug}
                  </p>
                  <p className="text-sm text-foreground/60">
                    Color: {category.color}
                  </p>
                </div>
              </div>

              <Divider />

              <div>
                <h3 className="mb-3 text-lg font-semibold">Description</h3>
                <p className="text-foreground/80">{category.description}</p>
              </div>

              <Divider />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <p>
                  <strong>Created:</strong>{" "}
                  {formatZonedDate(category.createdAt)}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {formatZonedDate(category.updatedAt)}
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
export const CategoryEditModal = ({
  item: category,
  isOpen,
  onOpenChange,
}: {
  item: Category;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(true);

  const { updateItem, refresh } = useTableContext<Category>();
  const [form, setForm] = useState({
    name: category.name,
    slug: category.slug,
    icon: category.icon || "",
    color: category.color,
    trending: category.trending,
    description: category.description,
  });
  const SelectedIconComponent = form.icon
    ? iconMap[form.icon as keyof typeof iconMap]
    : null;
  const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateItem(category.id, {
        name: form.name,
        slug: form.slug,
        icon: form.icon,
        color: form.color,
        trending: form.trending,
        description: form.description,
      });

      addToast({
        title: "Category updated",
        description: "Category details updated successfully",
        color: "success",
      });

      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to update category",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCheckboxSelected = (value: boolean) => {
    setIsCheckboxSelected(value);
    if (value) {
      setForm({
        ...form,
        slug: form.name.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  };
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, slug: e.target.value });
  };

  const handleSlugBlur = () => {
    let value = form.slug.trim().toLowerCase();

    // Replace spaces with hyphens for readability
    value = value.replace(/\s+/g, "-");

    // Encode special characters except "-" and "_"
    value = value
      .split("")
      .map((char) =>
        /^[a-z0-9-_]$/.test(char) ? char : encodeURIComponent(char),
      )
      .join("");

    setForm({ ...form, slug: value });
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
              <Pencil className="w-5 h-5 text-primary" /> Edit Category
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                isRequired
                label="Name"
                placeholder="Category name"
                value={form.name}
                variant="flat"
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: isCheckboxSelected
                      ? e.target.value.toLowerCase().replace(/\s+/g, "-")
                      : form.slug,
                  })
                }
              />
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  isDisabled={isCheckboxSelected}
                  label="Slug"
                  placeholder="unique-slug"
                  value={form.slug}
                  variant="flat"
                  onBlur={handleSlugBlur}
                  onChange={handleSlugChange}
                />
                <Checkbox
                  isSelected={isCheckboxSelected}
                  size="sm"
                  onValueChange={(value) => handleCheckboxSelected(value)}
                >
                  Same as name
                </Checkbox>
              </div>
              <div className="flex gap-4 justify-stretch items-center">
                {/* <Input
                  label="Icon"
                  placeholder="e.g. settings"
                  value={form.icon}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                /> */}
                <div className="w-40 flex items-center gap-3 p-3  rounded-xl bg-content2">
                  <span className="text-sm font-medium text-foreground/50 text-nowrap min-w-12">
                    Icon:
                  </span>
                  <Popover
                    isOpen={isPopoverOpen}
                    placement="bottom-start"
                    onOpenChange={setIsPopoverOpen}
                  >
                    <PopoverTrigger>
                      <Button
                        isIconOnly
                        className="w-full"
                        size="sm"
                        variant="flat"
                      >
                        {SelectedIconComponent ? (
                          <SelectedIconComponent size={16} />
                        ) : (
                          "Select Icon"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <IconPicker
                        onSelect={(name) => {
                          setForm({ ...form, icon: name });
                          setIsPopoverOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Select
                  className="w-full"
                  classNames={{
                    base: "max-w-sm",
                    trigger: "min-h-12",
                  }}
                  items={COLOR_DATA}
                  label="Color"
                  placeholder="Select a color"
                  renderValue={(items: SelectedItems<ColorData>) => {
                    return items.map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <span
                          className={`block w-4 h-4 rounded-md shadow-sm border border-gray-200 ${
                            bgColorMap[item.data?.value as TailwindColor]
                          }`}
                        />
                        <span className="font-medium text-foreground">
                          {item.data?.name}
                        </span>
                      </div>
                    ));
                  }}
                  selectedKeys={new Set([form.color])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      color: Array.from(keys)[0] as TailwindColor,
                    })
                  }
                >
                  {(color) => (
                    <SelectItem key={color.value} textValue={color.name}>
                      <div className="flex items-center gap-3 py-1">
                        <span
                          className={`block w-6 h-6 rounded-md shadow-sm border border-gray-200 ${
                            bgColorMap[color.value as TailwindColor]
                          }`}
                        />
                        <div className="flex flex-col">
                          <span className="text-small font-medium">
                            {color.name}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                {/* <Select
                  label="Trending"
                  selectedKeys={new Set([form.trending ? "true" : "false"])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      trending: Array.from(keys)[0] === "true",
                    })
                  }
                >
                  <SelectItem key="true">Yes</SelectItem>
                  <SelectItem key="false">No</SelectItem>
                </Select> */}
                <div className="flex items-center gap-3 p-3  rounded-xl bg-content2">
                  <span className="text-sm font-medium text-foreground/50 text-nowrap">
                    Trending:
                  </span>
                  <Button
                    className="text-nowrap"
                    color={form.trending ? "success" : "default"}
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      setForm({ ...form, trending: !form.trending })
                    }
                  >
                    {form.trending ? "Yes" : "No"}
                  </Button>
                </div>
              </div>
              <Input
                isRequired
                label="Description"
                placeholder="Describe the category"
                value={form.description}
                variant="flat"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
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
                Update Category
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== CREATE MODAL ====================
export const CategoryCreateModal = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const [isCheckboxSelected, setIsCheckboxSelected] = useState(true);
  const { createItem } = useTableContext<Category>();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon: "settings",
    color: "blue" as TailwindColor,
    trending: false,
    description: "",
  });
  const SelectedIconComponent = form.icon
    ? iconMap[form.icon as keyof typeof iconMap]
    : null;
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.description) {
      addToast({
        title: "Validation Error",
        description: "Name, slug, and description are required",
        color: "danger",
      });

      return;
    }

    setIsLoading(true);
    try {
      await createItem(form);

      addToast({
        title: "Category created",
        description: "New category added successfully",
        color: "success",
      });

      setForm({
        name: "",
        slug: "",
        icon: "settings",
        color: "blue",
        trending: false,
        description: "",
      });

      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to create category",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxSelected = (value: boolean) => {
    setIsCheckboxSelected(value);
    if (value) {
      setForm({
        ...form,
        slug: form.name.replace(/\s+/g, "-"),
      });
      // } else {
      //   setForm({ ...form, slug: "" });
    }
  };
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, slug: e.target.value });
  };

  const handleSlugBlur = () => {
    let value = form.slug.trim().toLowerCase();

    // Replace spaces with hyphens for readability
    value = value.replace(/\s+/g, "-");

    // Encode special characters except "-" and "_"
    value = value
      .split("")
      .map((char) =>
        /^[a-z0-9-_]$/.test(char) ? char : encodeURIComponent(char),
      )
      .join("");

    setForm({ ...form, slug: value });
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
              <Pencil className="w-5 h-5 text-primary" /> Create Category
            </ModalHeader>

            <ModalBody className="space-y-4">
              <Input
                isRequired
                label="Name"
                placeholder="Category name"
                value={form.name}
                variant="flat"
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: isCheckboxSelected
                      ? e.target.value.toLowerCase().replace(/\s+/g, "-")
                      : form.slug,
                  })
                }
              />
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  isDisabled={isCheckboxSelected}
                  label="Slug"
                  placeholder="unique-slug"
                  value={form.slug}
                  variant="flat"
                  onBlur={handleSlugBlur}
                  onChange={handleSlugChange}
                />
                <Checkbox
                  isSelected={isCheckboxSelected}
                  size="sm"
                  onValueChange={(value) => handleCheckboxSelected(value)}
                >
                  Same as name
                </Checkbox>
              </div>
              <div className="flex gap-4">
                {/* <Input
                  label="Icon"
                  placeholder="e.g. settings"
                  value={form.icon}
                  variant="flat"
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                /> */}

                <Popover placement="bottom-start">
                  <PopoverTrigger>
                    <Button variant="bordered">
                      {SelectedIconComponent ? (
                        <SelectedIconComponent size={16} />
                      ) : (
                        "Select Icon"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <IconPicker
                      onSelect={(name) =>
                        setForm({ ...form, icon: name.toLowerCase() })
                      }
                    />
                  </PopoverContent>
                </Popover>

                <Select
                  classNames={{
                    base: "max-w-xs",
                    trigger: "min-h-12",
                  }}
                  items={COLOR_DATA}
                  label="Color"
                  placeholder="Select a color"
                  renderValue={(items: SelectedItems<ColorData>) => {
                    return items.map((item) => (
                      <div key={item.key} className="flex items-center gap-3">
                        <span
                          className={`block w-4 h-4 rounded-md shadow-sm border border-gray-200 ${
                            bgColorMap[item.data?.value as TailwindColor]
                          }`}
                        />
                        <span className="font-medium text-foreground">
                          {item.data?.name}
                        </span>
                      </div>
                    ));
                  }}
                  selectedKeys={new Set([form.color])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      color: Array.from(keys)[0] as TailwindColor,
                    })
                  }
                >
                  {(color) => (
                    <SelectItem key={color.value} textValue={color.name}>
                      <div className="flex items-center gap-3 py-1">
                        <span
                          className={`block w-6 h-6 rounded-md shadow-sm border border-gray-200 ${
                            bgColorMap[color.value as TailwindColor]
                          }`}
                        />
                        <div className="flex flex-col">
                          <span className="text-small font-medium">
                            {color.name}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
                {/* <Select
                  label="Trending"
                  selectedKeys={new Set([form.trending ? "true" : "false"])}
                  variant="flat"
                  onSelectionChange={(keys) =>
                    setForm({
                      ...form,
                      trending: Array.from(keys)[0] === "true",
                    })
                  }
                >
                  <SelectItem key="true">Yes</SelectItem>
                  <SelectItem key="false">No</SelectItem>
                </Select> */}
                <div className="flex items-center gap-3 p-3  rounded-xl bg-content2">
                  <span className="text-sm font-medium text-foreground/50 text-nowrap">
                    Trending:
                  </span>
                  <Button
                    className="text-nowrap"
                    color={form.trending ? "success" : "default"}
                    size="sm"
                    variant="flat"
                    onPress={() =>
                      setForm({ ...form, trending: !form.trending })
                    }
                  >
                    {form.trending ? "Yes" : "No"}
                  </Button>
                </div>
              </div>
              <Input
                isRequired
                label="Description"
                placeholder="Describe the category"
                value={form.description}
                variant="flat"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
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
                Create Category
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ==================== DELETE MODAL ====================
export const CategoryDeleteModal = ({
  item: category,
  isOpen,
  onOpenChange,
}: {
  item: Category;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { deleteItem } = useTableContext<Category>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteItem(category.id);

      addToast({
        title: "Category deleted",
        description: "Category removed successfully",
        color: "success",
      });

      onOpenChange();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete category",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Category
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{category.name}</strong>?
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
export const CategoryBulkDeleteModal = ({
  items: categories,
  isOpen,
  onOpenChange,
}: {
  items: Category[];
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const { bulkDeleteItems, refresh } = useTableContext<Category>();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await bulkDeleteItems(categories as unknown as string[]);

      addToast({
        title: "Categories deleted",
        description: "Categories removed successfully",
        color: "success",
      });

      onOpenChange();
      refresh();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete categories",
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
              <Trash className="w-5 h-5 text-danger" /> Delete Categories
            </ModalHeader>

            <ModalBody className="space-y-4">
              <div className="p-4 border rounded-lg bg-danger/10 border-danger/20">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>
                    {categories.length} categor
                    {categories.length > 1 ? "ies" : "y"}
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
