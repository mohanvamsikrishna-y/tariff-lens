import '../styles/globals.css';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

function MyApp({ Component, pageProps }) {
  return (
    <main className={`${inter.variable} ${playfair.variable}`}>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
