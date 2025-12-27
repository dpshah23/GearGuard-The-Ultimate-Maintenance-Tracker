import { Spinner } from "@heroui/spinner";

export const LoadingSpinner = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <Spinner size={size} />
  </div>
);

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-foreground/60">Loading...</p>
    </div>
  </div>
);
