export default {
  expo: {
    name: "Anchor - PTSD Support",
    slug: "anchor-ptsd-support",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2E8B57"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.anchor.ptsd-support",
      buildNumber: "2",
      config: {
        usesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#2E8B57"
      },
      package: "com.anchor.ptsdsupport",
      versionCode: 1
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      openaiApiKey: process.env.OPENAI_API_KEY || "",
      eas: {
        projectId: "4609714b-3491-4121-8a80-0a47549079d1"
      }
    }
  }
};
