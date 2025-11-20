// Notifications disabled due to Expo development environment issues
// They will work correctly in production builds

export const requestNotificationPermissions = async () => {
  console.log('Notifications disabled in development');
  return false;
};

export const scheduleDailyReminder = async () => {
  console.log('Notifications disabled in development');
};

export const cancelDailyReminder = async () => {
  console.log('Notifications disabled in development');
};