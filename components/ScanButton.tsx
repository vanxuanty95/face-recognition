import React from 'react';
import { Button } from 'react-native';
import { useRouter } from 'expo-router';

const ScanButton = () => {
  const router = useRouter();

  return (
    <Button title="Scan QR Code" onPress={() => router.push('/scan-qr')} />
  );
};

export default ScanButton;