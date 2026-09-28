import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';

export const scheduleReminder = async () => {
  try {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'mood-reminder',
      name: 'Mood Reminders',
    });

    // Cancel existing triggers
    const triggers = await notifee.getTriggerNotificationIds();
    for (const id of triggers) {
      await notifee.cancelTriggerNotification(id);
    }

    // Daily reminder at 8 PM
    const now = new Date();
    const trigger = new Date();
    trigger.setHours(20, 0, 0, 0);
    if (trigger <= now) trigger.setDate(trigger.getDate() + 1);

    await notifee.createTriggerNotification(
      {
        title: 'How are you feeling today? 🌈',
        body: 'Take a moment to log your mood.',
        android: { channelId, pressAction: { id: 'default' } },
        ios: { sound: 'default' },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: trigger.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      },
    );
  } catch (error) {
    console.log('Notification setup error:', error);
  }
};
