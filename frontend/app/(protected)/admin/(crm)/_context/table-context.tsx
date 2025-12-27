"use client";

import type { Selection, SortDescriptor } from "@heroui/table";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// Generic types for the table system
export interface BaseEntity {
  id: string | number;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface Column<T = any> {
  name: string;
  uid: keyof T | string;
  sortable?: boolean;
  customRender?: (data: T) => React.ReactNode;
}

export interface FilterOption {
  name: string;
  uid: string;
}

export interface FilterConfig {
  name: string;
  column: string;
  options: FilterOption[];
}

export interface SearchConfig {
  placeholder: string;
  searchableFields: string[];
}

export interface TableConfig<T extends BaseEntity> {
  id: string;
  name: string;
  columns: Column<T>[];
  filterOption?: FilterConfig;
  initialVisibleColumns: string[];
  searchOption: SearchConfig;
  actions: {
    findAll: () => Promise<T[]>;
    create?: (data: any) => Promise<T>;
    update?: (id: string | number, data: any) => Promise<T>;
    delete?: (id: string | number) => Promise<void>;
    bulkDelete?: (ids: (string | number)[]) => Promise<void>;
  };
}

export interface TableContextValue<T extends BaseEntity> {
  // Data
  items: T[];
  filteredItems: T[];
  paginatedItems: T[];
  isLoading: boolean;
  error: string | null;

  // Pagination
  page: number;
  pages: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;

  // Filtering & Search
  filterValue: string;
  setFilterValue: (value: string) => void;
  roleFilter: Selection;
  setRoleFilter: (filter: Selection) => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;

  // Sorting
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (descriptor: SortDescriptor) => void;

  // Selection
  selectedKeys: Selection;
  setSelectedKeys: (keys: Selection) => void;

  // Columns
  visibleColumns: Selection;
  setVisibleColumns: (columns: Selection) => void;
  headerColumns: Column<T>[];

  // Actions
  refresh: () => Promise<void>;
  createItem: (data: Partial<T>) => Promise<T>;
  updateItem: (id: string | number, data: Partial<T>) => Promise<void>;
  deleteItem: (id: string | number) => Promise<void>;
  bulkDeleteItems: (ids: (string | number)[]) => Promise<void>;

  // Config
  config: TableConfig<T>;

  // Cell rendering
  renderCell: (item: T, columnKey: string) => React.ReactNode;
}

const TableContext = createContext<TableContextValue<any> | null>(null);

export function useTableContext<T extends BaseEntity>(): TableContextValue<T> {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error("useTableContext must be used within a TableProvider");
  }

  return context;
}

interface TableProviderProps<T extends BaseEntity> {
  children: React.ReactNode;
  config: TableConfig<T>;
}

export function TableProvider<T extends BaseEntity>({
  children,
  config,
}: TableProviderProps<T>) {
  // State management
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filtering state
  const [filterValue, setFilterValue] = useState("");
  const [roleFilter, setRoleFilter] = useState<Selection>("all");

  // Sorting state
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  // Selection state
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(config.initialVisibleColumns),
  );

  // Computed values
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return config.columns;

    return config.columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid as string),
    );
  }, [visibleColumns, config.columns]);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filtered = [...items];

    if (hasSearchFilter) {
      filtered = filtered.filter((item) => {
        const searchTerm = filterValue.toLowerCase();

        return config.searchOption.searchableFields.some((fieldPath) => {
          // Support nested field paths like "user.name" or "webinar.title"
          const fieldValue = fieldPath
            .split(".")
            .reduce((obj, key) => obj?.[key], item);

          return fieldValue?.toString().toLowerCase().includes(searchTerm);
        });
      });
    }

    // Apply role/status filter - FIXED LOGIC
    if (
      config.filterOption &&
      roleFilter !== "all" &&
      Array.from(roleFilter).length !== config.filterOption.options.length
    ) {
      const filterColumn = config.filterOption.column;
      const selectedFilters = Array.from(roleFilter).map((filter) =>
        filter.toString().toLowerCase(),
      );

      filtered = filtered.filter((item) => {
        const itemValue = (item[filterColumn] as string)?.toLowerCase() || "";
        const shouldInclude = selectedFilters.includes(itemValue);

        return shouldInclude;
      });
    }

    return filtered;
  }, [items, filterValue, roleFilter, config.filterOption, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...paginatedItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, paginatedItems]);

  // Actions
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await config.actions.findAll();

      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [config.actions]);

  const createItem = useCallback(
    async (data: Partial<T>) => {
      if (!config.actions.create) {
        throw new Error("Create action not configured");
      }
      setIsLoading(true);
      try {
        const res = await config.actions.create(data as any);

        // If it's an ActionResponse<T>, unwrap it
        if ("success" in res) {
          if (!res.success) throw new Error(res.message || "Failed to create");
          await refresh();

          return res.data as T;
        }

        // If it's already T, just return it
        await refresh();

        return res as T;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create item");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [config.actions, refresh],
  );

  const updateItem = useCallback(
    async (id: string | number, data: Partial<T>) => {
      if (!config.actions.update) {
        throw new Error("Update action not configured");
      }
      setIsLoading(true);
      try {
        await config.actions.update(id, data);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update item");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [config.actions, refresh],
  );

  const deleteItem = useCallback(
    async (id: string | number) => {
      if (!config.actions.delete) {
        throw new Error("Delete action not configured");
      }
      setIsLoading(true);
      try {
        await config.actions.delete(id);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete item");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [config.actions, refresh],
  );

  const bulkDeleteItems = useCallback(
    async (ids: (string | number)[]) => {
      if (!config.actions.bulkDelete) {
        throw new Error("Bulk delete action not configured");
      }
      setIsLoading(true);
      try {
        await config.actions.bulkDelete(ids);
        await refresh();
        setSelectedKeys(new Set([]));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete items");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [config.actions, refresh],
  );

  // Pagination handlers
  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  // Search handlers
  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // Default cell renderer with basic cases
  const renderCell = useCallback(
    (item: T, columnKey: string) => {
      const column = config.columns.find((col) => col.uid === columnKey);

      // If column has custom render function, use it
      if (column?.customRender) {
        return column.customRender(item);
      }

      // Default rendering for common cases
      const cellValue = item[columnKey as keyof T];

      switch (columnKey) {
        case "createdAt":
        case "updatedAt":
          return cellValue
            ? new Date(cellValue as Date).toLocaleDateString()
            : "-";
        case "actions":
          // This should be handled by customRender in most cases
          return <span>Actions</span>;
        default:
          return cellValue?.toString() || "-";
      }
    },
    [config.columns],
  );

  // Initialize data on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  const contextValue: TableContextValue<T> = {
    // Data
    items,
    filteredItems,
    paginatedItems: sortedItems,
    isLoading,
    error,

    // Pagination
    page,
    pages,
    rowsPerPage,
    setPage,
    setRowsPerPage: (rows: number) => {
      setRowsPerPage(rows);
      setPage(1);
    },
    onNextPage,
    onPreviousPage,

    // Filtering & Search
    filterValue,
    setFilterValue,
    roleFilter,
    setRoleFilter,

    onSearchChange,
    onClear,

    // Sorting
    sortDescriptor,
    setSortDescriptor,

    // Selection
    selectedKeys,
    setSelectedKeys,

    // Columns
    visibleColumns,
    setVisibleColumns,
    headerColumns,

    // Actions
    refresh,
    createItem,
    updateItem,
    deleteItem,
    bulkDeleteItems,

    // Config
    config,

    // Cell rendering
    renderCell,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}
