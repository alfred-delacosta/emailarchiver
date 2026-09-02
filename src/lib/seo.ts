import type { Metadata } from "next";

const site = "https://emailarchiver.app";
const brand = "EmailArchiver";

export function pageCanonical(pathname: string): Pick<Metadata, "alternates"> {
  const path =
    pathname === "/"
      ? "/"
      : `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  return {
    alternates: {
      canonical: path,
    },
  };
}

export function marketingMetadata(opts: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = opts.absoluteTitle
    ? opts.title
    : opts.title.includes(brand)
      ? opts.title
      : `${opts.title} | ${brand}`;

  return {
    title: opts.absoluteTitle ? { absolute: fullTitle } : opts.title,
    description: opts.description,
    ...pageCanonical(opts.path),
    openGraph: {
      title: fullTitle,
      description: opts.description,
      url: `${site}${opts.path === "/" ? "" : opts.path}`,
      siteName: brand,
      type: "website",
    },
  };
}
