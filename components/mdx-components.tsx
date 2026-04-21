import Link from "next/link";
import type { ComponentProps } from "react";

export const mdxComponents = {
  a: ({ href = "", ...props }: ComponentProps<"a">) => {
    if (href.startsWith("/")) {
      return <Link href={href} {...props} />;
    }

    return <a href={href} {...props} />;
  },
};
