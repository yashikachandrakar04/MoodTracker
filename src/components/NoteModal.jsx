import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';

const NoteModal = ({
  visible,
  onClose,
  initialNote,
  initialTags,
  availableTags,
  onSave,
  theme,
}) => {
  const [note, setNote] = useState(initialNote);
  const [tags, setTags] = useState(initialTags);

  useEffect(() => {
    setNote(initialNote);
    setTags(initialTags);
  }, [initialNote, initialTags, visible]);

  const toggleTag = tag => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.modal, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.text }]}>Add a Note</Text>

          <TextInput
            style={[
              styles.input,
              { color: theme.text, backgroundColor: theme.secondary },
            ]}
            placeholder="How was your day? What happened?"
            placeholderTextColor={theme.subtext}
            multiline
            numberOfLines={5}
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />

          <Text style={[styles.label, { color: theme.text }]}>Tags</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tagsRow}>
              {availableTags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: tags.includes(tag)
                        ? theme.primary
                        : theme.secondary,
                    },
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: tags.includes(tag) ? '#FFF' : theme.text },
                    ]}
                  >
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.secondary }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => onSave(note, tags)}
            >
              <Text style={[styles.buttonText, { color: '#FFF' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: {
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    minHeight: 120,
    marginBottom: 15,
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
  tagsRow: { flexDirection: 'row', gap: 8, paddingBottom: 10 },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  tagText: { fontSize: 13, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 15 },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { fontSize: 15, fontWeight: '600' },
});

export default NoteModal;
