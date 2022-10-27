import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import "../styles/globals.css";

const App = ({ Component, pageProps }) => {
  return (
    <SessionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
};

export default App;
