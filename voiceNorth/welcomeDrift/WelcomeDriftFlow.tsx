import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import DriftSlide from './DriftSlide';
import { driftSequence } from './driftCopy';
import { markWelcomeFinished } from '../storageBridge/onboardingVault';
import { useCrossFade } from '../motionLayer/useCrossFade';

type Props = {
  onDone: () => void;
};

export default function WelcomeDriftFlow({ onDone }: Props) {
  const [index, setIndex] = useState(0);
  const fade = useCrossFade(index, 380);

  const handleFinish = useCallback(async () => {
    await markWelcomeFinished();
    onDone();
  }, [onDone]);

  const next = () => {
    if (index < driftSequence.length - 1) {
      setIndex(index + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <View style={styles.shell}>
      <Animated.View style={[styles.layer, fade]}>
        <DriftSlide
          entry={driftSequence[index]}
          index={index}
          total={driftSequence.length}
          onNext={next}
          onSkip={handleFinish}
          visible
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  layer: { flex: 1 },
});
