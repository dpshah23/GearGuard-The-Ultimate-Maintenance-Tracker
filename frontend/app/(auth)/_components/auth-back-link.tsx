import { Link } from "@heroui/link";

type AuthBackLinkProps = {
  text: string;
  linkText: string;
  href: string;
};

export const AuthBackLink = ({ text, linkText, href }: AuthBackLinkProps) => {
  return (
    <div className="w-full mt-4 text-center">
      <span className="text-sm light:text-gray-500 dark:text-gray-300">
        {text}{" "}
      </span>
      <Link href={href} size="sm">
        {linkText}
      </Link>
    </div>
  );
};
