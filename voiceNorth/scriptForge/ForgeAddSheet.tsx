import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, Animated } from 'react-native';
import { X } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FrostedPanel from '../sharedCrystal/FrostedPanel';
import GlowButton from '../sharedCrystal/GlowButton';
import { palette } from '../styleCurrent/palette';
import { typography } from '../styleCurrent/typography';
import { useFadeRise } from '../motionLayer/useFadeRise';
import { countWords } from '../dataRelay/libraryProvider';

type Props = {
  onCancel: () => void;
  onSave: (data: { title: string; body: string }) => void;
};

export default function ForgeAddSheet({ onCancel, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const enter = useFadeRise({ delay: 30, travel: 30 });

  const wordCount = countWords(body);
  const canSave = title.trim().length > 0 && body.trim().length > 0;

  return (
    <View style={styles.shell}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onCancel}>
        <LinearGradient colors={['rgba(4,10,26,0.4)', 'rgba(4,10,26,0.92)']} style={StyleSheet.absoluteFill} />
      </Pressable>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.kavWrap}>
        <Animated.View style={[styles.sheet, enter, { paddingBottom: insets.bottom + 18 }]}>
          <FrostedPanel style={styles.panel}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>Add New Text</Text>
                <Pressable onPress={onCancel} hitSlop={10} style={styles.closeBubble}>
                  <X size={18} color={palette.bone} strokeWidth={2.2} />
                </Pressable>
              </View>

              <Text style={styles.label}>Title<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. My Conference Speech"
                placeholderTextColor={palette.whisperText}
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
              />

              <Text style={styles.label}>Text Content<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                placeholder="Paste or type your speech, script, or practice text"
                placeholderTextColor={palette.whisperText}
                value={body}
                onChangeText={setBody}
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.wordCount}>{wordCount} words</Text>

              <View style={styles.actions}>
                <GlowButton label="Cancel" variant="frost" onPress={onCancel} style={{ flex: 1 }} />
                <GlowButton
                  label="Save Text"
                  onPress={() => onSave({ title: title.trim(), body: body.trim() })}
                  disabled={!canSave}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </FrostedPanel>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  kavWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingHorizontal: 16,
  },
  panel: {
    paddingTop: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    ...typography.sectionTitle,
    color: palette.bone,
  },
  closeBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(94,188,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...typography.caption,
    color: palette.fadedText,
    marginBottom: 6,
    marginTop: 8,
  },
  required: {
    color: palette.rubyRed,
  },
  input: {
    backgroundColor: 'rgba(20,38,70,0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.panelEdge,
    color: palette.bone,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 4,
  },
  multiline: {
    minHeight: 140,
  },
  wordCount: {
    ...typography.body,
    color: palette.fadedText,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
});
