import { useEffect, useState } from "react";

type TitleProps = {
  title: string;
  subTitle: string;
};

const SITE_LOGOS = [
  {
    src: "/site_logos/baseball.png",
    favicon: "/site_logos/favicon-baseball.png",
    alt: "baseball",
  },
  {
    src: "/site_logos/basketball.png",
    favicon: "/site_logos/favicon-basketball.png",
    alt: "basketball",
  },
  {
    src: "/site_logos/football.png",
    favicon: "/site_logos/favicon-football.png",
    alt: "football",
  },
] as const;

const STORAGE_KEY = "wins-pool-site-logo-index";

function setFavicon(href: string) {
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
  }
  link.href = href;
}

function readVisitLogoIndex(): number {
  const href =
    document.querySelector<HTMLLinkElement>("link[rel='icon']")?.getAttribute(
      "href",
    ) ?? "";
  const fromFavicon = SITE_LOGOS.findIndex(
    (item) => href.endsWith(item.favicon) || href.endsWith(item.src),
  );
  if (fromFavicon >= 0) return fromFavicon;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw == null ? NaN : Number.parseInt(raw, 10);
    if (Number.isFinite(stored) && stored >= 0) {
      return stored % SITE_LOGOS.length;
    }
  } catch {
    // ignore
  }
  return 0;
}

function SportLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-12 w-12 object-contain sm:h-16 sm:w-16"
    />
  );
}

export default function Title({ title, subTitle }: TitleProps) {
  const [index, setIndex] = useState(0);
  const logo = SITE_LOGOS[index];

  useEffect(() => {
    const next = readVisitLogoIndex();
    setIndex(next);
    setFavicon(SITE_LOGOS[next].favicon);
  }, []);

  return (
    <div>
      <div className="mt-4 flex items-center justify-center gap-1">
        <SportLogo src={logo.src} alt={logo.alt} />
        <h1 className="mx-1 my-1 text-3xl leading-tight font-normal sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <SportLogo src={logo.src} alt={logo.alt} />
      </div>
      <p className="px-4 text-sm sm:text-base">{subTitle}</p>
    </div>
  );
}
