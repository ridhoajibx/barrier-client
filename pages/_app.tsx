import "@/styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import NextNProgress from "nextjs-progressbar";
import axios from "axios";
import type { AppProps } from "next/app";
import { wrapper } from "../redux/store";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { useRouter } from "next/router";
import { FC } from "react";

const MyApp: FC<AppProps> = ({ Component, ...pageProps }) => {
  const router = useRouter();
  const { pathname, query } = router;
  const { store, props } = wrapper.useWrappedStore(pageProps);
  axios.defaults.baseURL = process.env.API_ENDPOINT;

  // console.log(store, "store");

  return (
    <Provider store={store}>
      <NextNProgress
        color="#0E5CBE"
        startPosition={0.3}
        stopDelayMs={200}
        height={4}
        showOnShallow={true}
      />
      <Component {...props} />
      <ToastContainer position="top-right" limit={500} />
    </Provider>
  );
};

export default MyApp;
