import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};
// Breadcrumb Component
export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <Breadcrumbs>
    {items.map((item, index) => (
      <BreadcrumbItem key={index} href={item.href}>
        {item.label}
      </BreadcrumbItem>
    ))}
  </Breadcrumbs>
);
