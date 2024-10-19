import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';
import { StyleSheet, SafeAreaView } from 'react-native';
import { AuthProvider } from '../hooks/useSession';

export default function HomeLayout() {
  return (
    <SafeAreaView style={styles.safeContiner}>
      <AuthProvider>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </AuthProvider>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeContiner: {
    flex: 1,
  },
});

