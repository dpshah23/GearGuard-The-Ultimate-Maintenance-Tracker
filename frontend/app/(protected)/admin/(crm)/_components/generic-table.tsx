"use client";

import React from "react";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import {
  ChevronDownIcon,
  PlusIcon,
  RotateCw,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";

import {
  BaseEntity,
  Column,
  FilterOption,
  useTableContext,
} from "../_context/table-context";
import { useModalActions } from "../_context/modal-context";

// Table Actions Component
interface TableActionsProps {
  onAddNew?: () => void;
  onBulkDelete?: () => void;
  showBulkActions?: boolean;
}

export function TableActions<T extends BaseEntity>({
  onAddNew,
  showBulkActions = true,
}: TableActionsProps) {
  const {
    filterValue,
    roleFilter,
    visibleColumns,
    selectedKeys,
    config,
    onSearchChange,
    onClear,
    setRoleFilter,
    setVisibleColumns,
    refresh,
    setPage,
  } = useTableContext<T>();
  const { handleCreate, handleBulkDelete: handleBulkDeleteAction } =
    useModalActions<T>();

  const handleAddClick = () => {
    if (onAddNew) {
      onAddNew();
    } else {
      handleCreate();
    }
  };

  const handleBulkDelete = () => {
    handleBulkDeleteAction(Array.from(selectedKeys) as unknown as T[]);
  };

  const hasSelection = selectedKeys !== "all" && selectedKeys.size > 0;
  const deleteLabel = selectedKeys === "all" ? "all" : selectedKeys.size;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-center ">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder={config.searchOption.placeholder}
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Button
            isIconOnly
            aria-label="refresh-button"
            variant="flat"
            onPress={refresh}
          >
            <RotateCw size={16} />
          </Button>
          {/* Bulk Actions */}
          {showBulkActions && hasSelection && (
            <Button
              aria-labelledby="bulk-delete-button"
              className="hidden sm:flex"
              color="danger"
              startContent={<Trash2Icon className="h-4 w-4" />}
              variant="flat"
              onPress={handleBulkDelete}
            >
              Delete ({deleteLabel})
            </Button>
          )}
          {/* Mobile Bulk Delete - Icon only */}
          {showBulkActions && hasSelection && (
            <Button
              isIconOnly
              className="sm:hidden"
              color="danger"
              variant="flat"
              onPress={handleBulkDelete}
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          )}
          {/* Role Filter Dropdown */}
          {config.filterOption && (
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  {config.filterOption.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Filter Options"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                variant="flat"
                onSelectionChange={(selected) => {
                  setRoleFilter(selected);
                  setPage(1);
                }}
              >
                {config.filterOption.options.map((option: FilterOption) => (
                  <DropdownItem key={option.uid} className="capitalize">
                    {option.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
          {/* Column Visibility Dropdown */}
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="flat"
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              variant="flat"
              onSelectionChange={setVisibleColumns}
            >
              {config.columns.map((column: Column<T>) => (
                <DropdownItem key={column.uid as string} className="capitalize">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {/* Add New Button */}
          <Button
            color="primary"
            endContent={<PlusIcon className="hidden sm:block" />}
            onPress={handleAddClick}
          >
            <span className="sm:inline">Add New</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Table Info Component
export function TableInfo<T extends BaseEntity>() {
  const { items, rowsPerPage, setRowsPerPage } = useTableContext<T>();

  return (
    <div className="flex justify-between items-center">
      <span className="text-default-400 text-small">
        Total {items.length} items
      </span>
      <div className="flex items-center gap-2">
        <span className="text-small text-default-400 whitespace-nowrap">
          Rows per page:
        </span>
        <Select
          aria-label="Rows per page"
          className="w-20"
          defaultSelectedKeys={[rowsPerPage.toString()]}
          items={[
            { key: "5", label: "5" },
            { key: "10", label: "10" },
            { key: "15", label: "15" },
            { key: "20", label: "20" },
          ]}
          selectionMode="single"
          size="sm"
          variant="underlined"
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
        >
          {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
        </Select>
      </div>
    </div>
  );
}

// Table Pagination Component
export function TablePagination<T extends BaseEntity>() {
  const {
    selectedKeys,
    filteredItems,
    page,
    pages,
    setPage,
    onPreviousPage,
    onNextPage,
  } = useTableContext<T>();

  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <span className="w-[30%] text-small text-default-400">
        {selectedKeys === "all"
          ? "All items selected"
          : `${selectedKeys.size} of ${filteredItems.length} selected`}
      </span>
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          onPress={onPreviousPage}
        >
          Previous
        </Button>
        <Button
          isDisabled={pages === 1}
          size="sm"
          variant="flat"
          onPress={onNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// Main Generic Table Component
interface GenericTableProps {
  onAddNew?: () => void;
  onBulkDelete?: () => void;
  showBulkActions?: boolean;
  className?: string;
}

export function GenericTable<T extends BaseEntity>({
  onAddNew,
  onBulkDelete,
  showBulkActions = true,
  className,
}: GenericTableProps) {
  const {
    paginatedItems,
    headerColumns,
    selectedKeys,
    setSelectedKeys,
    sortDescriptor,
    setSortDescriptor,
    renderCell,
    isLoading,
  } = useTableContext<T>();

  return (
    <div className={`${className} flex flex-col gap-4 h-full  overflow-hidden`}>
      {/* Top Actions */}
      <div className="flex-shrink-0">
        <TableActions<T>
          showBulkActions={showBulkActions}
          onAddNew={onAddNew}
          onBulkDelete={onBulkDelete}
        />
      </div>

      {/* Table Info */}
      <div className="flex-shrink-0">
        <TableInfo<T> />
      </div>

      {/* Main Table Container - This will scroll */}
      {/* <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-divider"> */}
      <Table
        aria-label="Generic data table with pagination and sorting"
        bottomContent={
          <div className="flex-shrink-0">
            <TablePagination<T> />
          </div>
        }
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px] overflow-auto max-w-screen",
          table: "min-w-full",
          thead: "sticky top-0 z-10 bg-content1",
          tbody: "divide-y divide-divider",
        }}
        isHeaderSticky={true}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={(sort) =>
          setSortDescriptor({
            column: sort.column as string,
            direction: sort.direction,
          })
        }
      >
        <TableHeader columns={headerColumns}>
          {(column: Column<T>) => (
            <TableColumn
              key={column.uid as string}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
              className="bg-content2 text-foreground font-semibold"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={
            <div className="text-center py-8">
              <p className="text-default-400">No data found</p>
            </div>
          }
          isLoading={isLoading}
          items={paginatedItems}
          loadingContent={
            <div className="flex items-center justify-center py-8">
              <Spinner label="Loading..." />
            </div>
          }
        >
          {(item: T) => (
            <TableRow
              key={item.id}
              className="hover:bg-content2/50 transition-colors"
            >
              {(columnKey) => (
                <TableCell
                  aria-labelledby={columnKey as string}
                  className="py-3"
                >
                  {renderCell(item, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* </div> */}
    </div>
  );
}
