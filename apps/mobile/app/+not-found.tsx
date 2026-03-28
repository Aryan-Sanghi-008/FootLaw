import { Link, Stack } from 'expo-router';
import { View, Text } from '@/components/Themed';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-xl">
        <Text className="text-xl font-bold color-textPrimary">This screen doesn't exist.</Text>

        <Link href="/" className="mt-4 p-4">
          <Text className="text-sm color-primary font-bold">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

