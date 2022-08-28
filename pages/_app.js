import "../styles/globals.css";
import "../components/Button/Button.css";
import "../components/CenterButton/CenterButton.css";
import "../components/ColorWheel/ColorWheel.css";
import "../components/Light/Light.css";
import "../components/Modal/Modal.css";
import "../components/Player/Player.css";
import "../components/SearchField/SearchField.css";
import "../components/SettingsButton/SettingsButton.css";
import "../components/Slider/Slider.css";
import "../components/Tabs/Tabs.css";
import "../components/Thumb/Thumb.css";
import "../components/WelcomeModal/WelcomeModal.css";
import "../components/TextField/TextField.css";
import { SSRProvider } from "react-aria";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <Head>
        <title>[BETA] VIRTUAL STEM PLAYER</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Inspired by the Yeezy x Kano Stem Player."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://stemplayer.io" />
        <meta
          property="og:description"
          content="Inspired by the Yeezy x Kano Stem Player."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" value="https://stemplayer.io" />
        <meta
          name="twitter:description"
          value="Inspired by the Yeezy x Kano Stem Player."
        />
        <meta name="twitter:url" value="https://stemplayer.io" />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo_alt512.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Inter:wght@300;600&display=swap"
          rel="stylesheet"
        /> */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      <Component {...pageProps} />
    </SSRProvider>
  );
}

export default MyApp;
