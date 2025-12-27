"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

import { BaseEntity } from "./table-context";

export type ModalAction = "view" | "edit" | "create" | "delete" | "bulkDelete";
type ViewModalProps<T> = {
  item: T;
  isOpen: boolean;
  onOpenChange: () => void;
};
type EditModalProps<T> = ViewModalProps<T>;
type CreateModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};
type DeleteModalProps<T> = ViewModalProps<T>;
type BulkDeleteModalProps<T> = {
  items: T[];
  isOpen: boolean;
  onOpenChange: () => void;
};
export type ModalConfig<T extends BaseEntity> = {
  view?: {
    component: React.ComponentType<ViewModalProps<T>>;
    title?: string;
  };
  edit?: {
    component: React.ComponentType<EditModalProps<T>>;
    title?: string;
  };
  create?: {
    component: React.ComponentType<CreateModalProps>;
    title?: string;
  };
  delete?: {
    component: React.ComponentType<DeleteModalProps<T>>;
    title?: string;
  };
  bulkDelete?: {
    component: React.ComponentType<BulkDeleteModalProps<T>>;
    title?: string;
  };
};

interface ModalContextValue<T extends BaseEntity> {
  // Modal states
  activeModal: ModalAction | null;
  selectedItem: T | T[] | null;
  isModalOpen: boolean;

  // Modal actions
  openModal: (action: ModalAction, item?: T | T[]) => void;
  closeModal: () => void;

  // Modal config
  setModalConfig: (config: ModalConfig<T>) => void;
  modalConfig: ModalConfig<T> | null;
}

const ModalContext = createContext<ModalContextValue<any> | null>(null);

export function useModalContext<T extends BaseEntity>(): ModalContextValue<T> {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }

  return context;
}

interface ModalProviderProps<T extends BaseEntity> {
  children: React.ReactNode;
  config?: ModalConfig<T>;
}

export function ModalProvider<T extends BaseEntity>({
  children,
  config,
}: ModalProviderProps<T>) {
  const [activeModal, setActiveModal] = useState<ModalAction | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | T[] | null>(null);
  const [modalConfig, setModalConfig] = useState<ModalConfig<T> | null>(
    config || null,
  );

  const openModal = useCallback((action: ModalAction, item?: T | T[]) => {
    setActiveModal(action);
    setSelectedItem(item || null);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelectedItem(null);
  }, []);

  const isModalOpen = activeModal !== null;

  const contextValue: ModalContextValue<T> = {
    activeModal,
    selectedItem,
    isModalOpen,
    openModal,
    closeModal,
    setModalConfig,
    modalConfig,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {/* Render active modal */}
      {activeModal && modalConfig && (
        <ModalRenderer<T>
          action={activeModal}
          config={modalConfig}
          isOpen={isModalOpen}
          item={selectedItem}
          onOpenChange={closeModal}
        />
      )}
    </ModalContext.Provider>
  );
}

// Modal Renderer Component
function ModalRenderer<T extends BaseEntity>({
  action,
  item,
  config,
  isOpen,
  onOpenChange,
}: {
  action: ModalAction;
  item: T | T[] | null;
  config: ModalConfig<T>;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const modalInfo = config[action];

  if (!modalInfo) return null;

  // Narrow props by action
  if (action === "create") {
    const Component =
      modalInfo.component as React.ComponentType<CreateModalProps>;

    return <Component isOpen={isOpen} onOpenChange={onOpenChange} />;
  }

  if (!item) return null;

  if (action === "bulkDelete") {
    const itemsArray: T[] = Array.isArray(item) ? item : [item as T];
    const Component = modalInfo.component as React.ComponentType<
      BulkDeleteModalProps<T>
    >;

    return (
      <Component
        isOpen={isOpen}
        items={itemsArray}
        onOpenChange={onOpenChange}
      />
    );
  }

  if (!Array.isArray(item)) {
    const Component = modalInfo.component as React.ComponentType<
      ViewModalProps<T>
    >;

    return (
      <Component isOpen={isOpen} item={item} onOpenChange={onOpenChange} />
    );
  }

  return null;
}

// Hook for easier modal management
export function useModalActions<T extends BaseEntity>() {
  const { openModal, closeModal } = useModalContext<T>();

  const handleView = useCallback(
    (item: T) => {
      openModal("view", item);
    },
    [openModal],
  );

  const handleEdit = useCallback(
    (item: T) => {
      openModal("edit", item);
    },
    [openModal],
  );

  const handleDelete = useCallback(
    (item: T) => {
      openModal("delete", item);
    },
    [openModal],
  );

  const handleBulkDelete = useCallback(
    (items: T[]) => {
      openModal("bulkDelete", items);
    },
    [openModal],
  );

  const handleCreate = useCallback(() => {
    openModal("create");
  }, [openModal]);

  return {
    handleView,
    handleEdit,
    handleDelete,
    handleBulkDelete,
    handleCreate,
    closeModal,
  };
}
