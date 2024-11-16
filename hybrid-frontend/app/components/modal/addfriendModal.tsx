import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

type AddFriendModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onAddFriend: () => void;
  bars: Array<{ id: string; name: string }>;
  events: Array<{ id: string; name: string }>;
  selectedBarId: string | null;
  setSelectedBarId: (id: string) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string) => void;
};

const AddFriendModal: React.FC<AddFriendModalProps> = ({
  isVisible,
  onClose,
  onAddFriend,
  bars,
  events,
  selectedBarId,
  setSelectedBarId,
  selectedEventId,
  setSelectedEventId,
}) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecciona el bar donde se conocieron</Text>
          <View style={styles.optionsContainer}>
            {bars.map((bar) => (
              <TouchableOpacity
                key={bar.id}
                onPress={() => setSelectedBarId(bar.id)}
                style={[
                  styles.optionItem,
                  selectedBarId === bar.id && styles.selectedOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedBarId === bar.id && styles.selectedOptionText,
                  ]}
                >
                  {bar.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.modalTitle}>Selecciona el evento (opcional)</Text>
          <View style={styles.optionsContainer}>
            {events.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => setSelectedEventId(event.id)}
                style={[
                  styles.optionItem,
                  selectedEventId === event.id && styles.selectedOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedEventId === event.id && styles.selectedOptionText,
                  ]}
                >
                  {event.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={onAddFriend}>
              <Text style={styles.buttonText}>Seguir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 15,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionItem: {
    padding: 15,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#FF9800',
  },
  optionText: {
    fontSize: 16,
    color: '#FFF',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  addButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default AddFriendModal;
