import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Slot />
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
