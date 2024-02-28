import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
// import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

const BACKGROUND_NOTIFICATIONS_TASK = 'BACKGROUND-NOTIFICATIONS-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATIONS_TASK, async () => {
  console.log('Start');
  const test = async function () {
    console.log('async func call');
  };
  await test();
  console.log('Is this ever reached');

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// register background notification task
// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATIONS_TASK);

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIFICATIONS_TASK, {
    minimumInterval: 10, // 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export default function App() {

  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATIONS_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>
        Background fetch status:{' '}
        <Text style={styles.boldText}>
          {status && BackgroundFetch.BackgroundFetchStatus[status]}
        </Text>
      </Text>
      <Text>
        Background fetch task name:{' '}
        <Text style={styles.boldText}>
          {isRegistered ? BACKGROUND_NOTIFICATIONS_TASK : 'Not registered yet!'}
        </Text>
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
