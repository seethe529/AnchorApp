# EAS Build Version Caching Fix

## Problem
EAS builds were showing incorrect version numbers (e.g., 1.2.11 build 93) even after updating `app.config.js` and `package.json` to newer versions (1.2.12 build 94). This wasted multiple build credits trying to fix the issue.

## Root Cause
Starting with EAS CLI v12.0.0, Expo changed how version numbers are managed:
1. **Remote version source (new default)**: Versions stored on EAS servers, can cause caching issues
2. **Local version source (old behavior)**: Versions read from your project files

When using "remote" source or when `ios/` folder is gitignored, EAS may cache old version numbers from previous builds.

## Solution

### Step 1: Set Version Source to "Local"
Update `eas.json` to explicitly use local version source:

```json
{
  "cli": {
    "version": ">= 13.2.0",
    "appVersionSource": "local"
  },
  "build": {
    "production": {
      "autoIncrement": false,
      "ios": {
        "image": "latest"
      }
    }
  }
}
```

**Key settings:**
- `"appVersionSource": "local"` - Always read from project files
- `"autoIncrement": false` - Don't auto-increment from previous builds

### Step 2: Update All Version Files
Ensure version is consistent across all files:

**app.config.js:**
```javascript
export default {
  expo: {
    version: "1.2.12",
    ios: {
      buildNumber: "94"
    },
    android: {
      versionCode: 94
    }
  }
};
```

**package.json:**
```json
{
  "version": "1.2.12"
}
```

### Step 3: Verify Configuration
Run this command to verify Expo is reading the correct version:

```bash
npx expo config --type public | grep -A 1 "version:\|buildNumber:"
```

Should output:
```
version: '1.2.12'
buildNumber: '94'
```

### Step 4: Clear Caches and Regenerate iOS Folder
```bash
# Clear all caches
rm -rf .expo
rm -rf node_modules/.cache

# Regenerate iOS folder with correct version
npx expo prebuild --clean --platform ios
```

### Step 5: Verify iOS Info.plist
Check that the iOS folder has the correct version:

```bash
grep -A 2 "CFBundleShortVersionString\|CFBundleVersion" ios/AnchorPTSDSupport/Info.plist
```

Should show:
```xml
<key>CFBundleShortVersionString</key>
<string>1.2.12</string>
...
<key>CFBundleVersion</key>
<string>94</string>
```

### Step 6: Commit iOS Folder (Temporary)
If `ios/` is in `.gitignore`, temporarily track it:

```bash
# Comment out ios/ in .gitignore
# Then commit
git add ios/ .gitignore
git commit -m "fix: Track ios/ folder with correct version"
git push origin main
```

### Step 7: Build with EAS
```bash
eas build --platform ios --profile production
```

The build should now show the correct version!

## Prevention for Future Builds

### Option A: Keep ios/ Tracked (Recommended for Version Control)
- Keep `ios/` folder in git
- EAS will always use the correct version from Info.plist
- Downside: Larger repo size

### Option B: Always Regenerate Before Building
If you prefer to keep `ios/` gitignored:

1. Before each build, run:
```bash
rm -rf ios/
npx expo prebuild --clean --platform ios
```

2. Verify version:
```bash
grep "CFBundleVersion" ios/AnchorPTSDSupport/Info.plist
```

3. Then build:
```bash
eas build --platform ios --profile production
```

## Quick Build Command (Run Every Time)

Before triggering an EAS build, **always** run this sequence:

### iOS Only
```bash
rm -rf .expo node_modules/.cache
npx expo prebuild --clean --platform ios
git add ios/ && git commit -m "fix: regenerate ios/ with correct build number" && git push
eas build --platform ios --profile production --non-interactive
```

### Android Only
```bash
rm -rf .expo node_modules/.cache
eas build --platform android --profile production --non-interactive
```
Note: `android/` is gitignored so EAS runs prebuild automatically and reads versionCode from `app.config.js`. No need to commit the android folder.

### Both Platforms
```bash
rm -rf .expo node_modules/.cache
npx expo prebuild --clean --platform ios
git add ios/ && git commit -m "fix: regenerate ios/ with correct build number" && git push
eas build --platform ios --profile production --non-interactive
eas build --platform android --profile production --non-interactive
```

### Verify Builds After Completion
```bash
eas build:list --platform ios --limit 1
eas build:list --platform android --limit 1
```
Confirm both show the correct version and build number before submitting.

This ensures the native files match your `app.config.js` version and prevents wasted build credits.

---

## Quick Checklist for Version Updates

- [ ] Update `app.config.js` (buildNumber, versionCode — only bump version for App Store releases)
- [ ] Update `package.json` (version — only for App Store releases)
- [ ] Verify with `npx expo config --type public`
- [ ] Clear caches: `rm -rf .expo node_modules/.cache`
- [ ] Regenerate iOS: `npx expo prebuild --clean --platform ios`
- [ ] Verify Info.plist has correct version
- [ ] Commit ios/ folder (if tracked)
- [ ] Build both platforms
- [ ] Verify builds with `eas build:list`
- [ ] Build: `eas build --platform ios --profile production`

## Troubleshooting

### Build still shows wrong version?
1. Check `eas.json` has `"appVersionSource": "local"`
2. Check `eas.json` has `"autoIncrement": false`
3. Delete and regenerate ios/ folder
4. Make sure ios/ folder is committed to git

### EAS CLI prompts about version source?
- Choose "Update eas.json to use 'local' version source"
- Say "No" when asked to set to remote

### Want to use remote version source?
Run this to sync EAS remote version:
```bash
eas build:version:set --platform ios
# Enter your desired build number when prompted
```

## Cost Savings
This fix prevents wasting build credits on failed version updates. With proper configuration:
- ✅ Version updates work on first build
- ✅ No trial-and-error builds needed
- ✅ Predictable version management

## Related Issues
- EAS CLI v12.0.0 breaking change: https://github.com/expo/eas-cli/releases/tag/v12.0.0
- Expo versioning docs: https://docs.expo.dev/build-reference/app-versions/

## Summary
The key insight: **EAS needs the version in the native iOS files (Info.plist), not just in app.config.js**. By tracking the `ios/` folder or regenerating it before each build, you ensure EAS always has the correct version.
