import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type ActionResponse<T> = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  data?: T;
};
