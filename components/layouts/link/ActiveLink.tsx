import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ActiveLink = ({
  children,
  href,
  className,
  activeClassName,
  pages,
}: any) => {
  const router = useRouter();
  const { pathname, query } = router;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (pathname === href?.pathname || pathname.includes(pages as string))
      setActive(true);
    else setActive(false);
  }, [pathname, pages]);

  return (
    <Link
      href={{ pathname: href?.pathname, query: href?.query }}
      scroll={true}
      className={`group relative w-full lg:max-w-max flex items-center gap-2.5 rounded-sm py-2 px-4 text-bodydark1 duration-300 ease-in-out ${className} ${
        active ? `font-semibold ${activeClassName}` : "font-light"
      }`}>
      {children}
    </Link>
  );
};

export default ActiveLink;
