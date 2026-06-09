import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { COUNTER_INCREMENT } from '@template/contracts';
import { Env } from '../../env';

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <Text testID="home-title" className="text-xl font-bold text-foreground">{Env.APP_DISPLAY_NAME}</Text>
      <Text testID="counter-value" className="text-lg text-foreground">Count: {count}</Text>
      <Pressable
        testID="counter-increment-button"
        accessibilityRole="button"
        onPress={() => setCount((c) => c + COUNTER_INCREMENT)}
        className="rounded-xl bg-primary px-6 py-3"
      >
        <Text className="font-medium text-primary-foreground">Increment</Text>
      </Pressable>
    </View>
  );
}
