// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: "sight-words",
  slug: "sight-words",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  extra: {
    googleApiKey: process.env.GOOGLE_API_KEY,
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
        UIBackgroundModes: ["audio"]
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  plugins: [
    "expo-font"
  ]
});
