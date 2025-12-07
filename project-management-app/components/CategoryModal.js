import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';
import { textPresets, colors } from '@theme';
import { addCategory as addCategoryAPI, updateCategory as updateCategoryAPI } from '@api/categories';
import { useProjects } from '@contexts';

// Schema Zod pentru validare
const categorySchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters').nonempty('Category name cannot be empty'),
});

const CategoryModal = ({
  isVisible,
  onClose,
  initialCategoryName = '',
  categoryId = null, // pentru editare
  isEditing = false,
  onCategoryAddedOrUpdated, // callback către pagina părinte
}) => {
  const { addCategoryToContext, updateCategoryInContext } = useProjects();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: initialCategoryName },
  });

  useEffect(() => {
    if (isVisible) {
      reset({ name: initialCategoryName });
    }
  }, [isVisible, initialCategoryName, reset]);

  const onSave = async (data) => {
    try {
      let result;

      if (isEditing && categoryId) {
        // Editare categorie
        result = await updateCategoryAPI(categoryId, { title: data.name });
        updateCategoryInContext(result);
      } else {
        // Adăugare categorie
        result = await addCategoryAPI({ title: data.name });
        addCategoryToContext(result);
      }

      if (onCategoryAddedOrUpdated) onCategoryAddedOrUpdated(result);
      onClose();
    } catch (err) {
      console.error('Error saving category:', err);
      Alert.alert('Error', isEditing ? 'Failed to update category' : 'Failed to add category');
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={textPresets.headerLarge}>
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Category name"
                placeholder="Category name"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <View style={styles.buttonsContainer}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.darkBlue} style={{ width: '48%' }} />
            ) : (
              <CustomButton
                title={isEditing ? 'Update' : 'Save'}
                onPress={handleSubmit(onSave)}
                style={{ width: '48%' }}
              />
            )}
            <CustomButton
              title="Cancel"
              type="secondary"
              onPress={onClose}
              style={{ width: '48%' }}
            />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
});

export default CategoryModal;
