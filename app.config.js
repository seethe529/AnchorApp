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
      buildNumber: "9",
      config: {
        usesNonExemptEncryption: false
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Anchor uses your location to help you find nearby crisis centers and emergency rooms when you need immediate help. Your location is only used when you tap 'Find Local Crisis Centers' or 'Hospital Emergency Room' and is never stored or shared.",
        NSUserNotificationsUsageDescription: "Anchor sends optional reminders to help you check in with your mood and practice breathing exercises. All notifications can be disabled in Settings."
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
