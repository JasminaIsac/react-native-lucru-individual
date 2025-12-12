import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Alert } from 'react-native';
import { changePassword, getUserById } from '@api/users';
import { textPresets, colors } from '@theme/index';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { validatePasswords } from '@utils/index';

const ChangePasswordModal = ({ visible, onClose, userId }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const response = await getUserById(userId);
    setUser(response);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const validatePasswordsFields = async () => {
    const errors = validatePasswords(newPassword, oldPassword, confirmPassword);
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleChangePassword = async () => {
    const isValid = await validatePasswordsFields();

    console.log(errors);

    if (!isValid) return;

    setLoading(true);
    setErrors([]);
    
    try {
      const response = await changePassword(userId, oldPassword, newPassword, confirmPassword);

    if (response.success) {
      Alert.alert('Succes', 'Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors([]);
      onClose();
    } else {
      if (response.status === 401) {
        setErrors({...errors, oldPassword: response.message});
      } else if (response.status === 400) {
        setErrors({...errors, newPassword: response.message});
      } else {
        setErrors({...errors, oldPassword: response.message});
      }
    }

    } catch (error) {
      setErrors({ apiError: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={textPresets.headerLarge}>Change Password</Text>

          {/* Old Password */}
          <CustomInput
            label="Old Password"
            placeholder="Enter your old password"
            value={oldPassword}
            onChangeText={setOldPassword}
            isPassword={true}
            error={errors.oldPassword}
          />

          {/* New Password */}
          <CustomInput
            label="New Password"
            placeholder="Enter your new password"
            value={newPassword}
            onChangeText={setNewPassword}
            isPassword={true}
            error={errors.newPassword}
          />

          {/* Confirm New Password */}
          <CustomInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword={true}
            error={errors.confirmPassword}
          />

          <CustomButton
            title={loading ? "Changing..." : "Change Password"}
            type={loading ? "disabled" : "primary"}
            onPress={handleChangePassword}
            disabled={loading}
            style={{ width: '100%' }} 
          />
          <CustomButton title="Cancel" onPress={onClose} type="secondary" style={{ width: '100%' }} />

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
    backgroundColor: colors.background.overlay,
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.background.primary,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
});

export default ChangePasswordModal;
