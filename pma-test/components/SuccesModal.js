import React from 'react';
import { Modal, View, Text, StyleSheet, Button } from 'react-native';

const SuccessModal = ({ visible, onClose, entity, action }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.successText}>
            {`${entity} a fost ${action} cu succes.`}
          </Text>
          <Button title="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    elevation: 5,
    width: '80%',
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
  },
});

export default SuccessModal;
