import type { AppProps } from 'next/app';
import '../index.css';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/layout/Layout';
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={3000} />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;