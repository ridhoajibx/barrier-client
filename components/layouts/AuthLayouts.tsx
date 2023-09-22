import React, { useState } from "react";
import Head from "next/head";

type Props = {
  children: any;
  title?: any;
  description?: any;
  logo?: string;
};

const AuthLayouts = ({ children, title, description, logo }: Props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="text-gray-6">
      <Head>
        <title>{title} | Barriergate</title>
        <link rel="icon" href={logo ? logo : `./images/logo.png`} />
        <meta name="description" content={`Barriergate - ${description}`} />
      </Head>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <div className="w-full flex lg:h-screen overflow-hidden">
          {children}
        </div>
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default AuthLayouts;
