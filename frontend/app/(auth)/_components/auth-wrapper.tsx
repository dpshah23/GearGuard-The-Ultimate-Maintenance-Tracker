// AuthWrapper.tsx
"use client";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import Link from "next/link";
import { link as linkStyles } from "@heroui/theme";

type AuthWrapperProps = {
  title: string;
  subtitle?: string;
  backLinkText?: string;
  children: ReactNode;
  footerContent?: ReactNode;
} & (
  | { backLinkHref: string; backLinkAction?: never }
  | { backLinkHref?: never; backLinkAction: () => void }
  | { backLinkHref?: undefined; backLinkAction?: undefined }
);

export const AuthWrapper = ({
  title,
  subtitle,
  backLinkHref,
  backLinkAction,
  backLinkText = "Back",
  children,
  footerContent,
}: AuthWrapperProps) => {
  const BackLink = () => (
    <div className="pb-4 md:pt-4 md:pl-4">
      {backLinkHref ? (
        <Link
          className={linkStyles({
            className: "flex items-center text-sm",
            underline: "hover",
          })}
          href={backLinkHref}
        >
          <ArrowLeft className="mr-1" size={16} />
          {backLinkText}
        </Link>
      ) : (
        <button
          className={linkStyles({
            className: "flex items-center text-sm text-primary",
            underline: "hover",
          })}
          onClick={backLinkAction}
        >
          <ArrowLeft className="mr-1" size={16} />
          {backLinkText}
        </button>
      )}
    </div>
  );

  const Header = () => (
    <div className="flex flex-col items-center pt-6 pb-0 md:pt-6">
      <h1 className="text-3xl font-bold text-center md:text-4xl">{title}</h1>
      {subtitle && (
        <p className="px-4 mt-2 text-sm text-center text-gray-500 md:px-0">
          {subtitle}
        </p>
      )}
    </div>
  );

  const Content = () => (
    <div className="flex flex-col gap-4 px-4 py-4 md:px-6">{children}</div>
  );

  const Footer = () =>
    footerContent ? (
      <div className="flex justify-center px-4 pb-6 md:px-6">
        {footerContent}
      </div>
    ) : null;

  return (
    <>
      {/* Mobile Layout - Full Screen */}
      <div className="flex flex-col min-h-screen max-md:pb-48 md:hidden bg-background">
        {/* Safe area for status bar */}
        <div className="safe-area-top" />

        <div className="flex flex-col flex-1 w-full py-6">
          {(backLinkHref || backLinkAction) && <BackLink />}

          <div className="flex flex-col justify-center flex-1 w-full max-w-sm mx-auto">
            <Header />
            <Content />
            <Footer />
          </div>
        </div>
      </div>

      {/* Desktop Layout - Card */}
      <Card className="hidden w-full shadow-md md:block bg-content1">
        {(backLinkHref || backLinkAction) && <BackLink />}

        <CardHeader className="flex flex-col items-center pt-6 pb-0">
          <h1 className="text-4xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </CardHeader>

        <CardBody className="gap-4 px-6 py-4">{children}</CardBody>

        {footerContent && (
          <CardFooter className="flex justify-center pb-6">
            {footerContent}
          </CardFooter>
        )}
      </Card>
    </>
  );
};
