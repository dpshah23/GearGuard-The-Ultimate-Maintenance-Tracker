import { Divider as HeroUIDivider } from "@heroui/divider";

export const Divider = ({ text }: { text?: string }) => {
  return (
    <div className="relative flex items-center py-1">
      <HeroUIDivider className="flex-1" orientation="horizontal" />
      {text && <span className="px-3 text-sm text-gray-500">{text}</span>}
      <HeroUIDivider className="flex-1" orientation="horizontal" />
    </div>
  );
};
