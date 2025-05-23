import React, {useEffect, useState} from 'react';
import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Box} from '@/components/ui/box';
import {Text} from '@/components/ui/text';
import {Button, ButtonText} from '@/components/ui/button';
import {usePlacesStore} from '@/stores/places-store';
import {HStack} from '@/components/ui/hstack';

interface PhotoPickerProps {
  existingPhotoIds?: string[];
  onPhotosSelected: (selectedPhotos: {
    existingPhotoIds: string[],
    newPhotos: Blob[],
    photosToDelete: string[]
  }) => void;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
                                                          existingPhotoIds = [],
                                                          onPhotosSelected
                                                        }) => {
  const {getPhotoUrl} = usePlacesStore();
  const [selectedExistingPhotoIds, setSelectedExistingPhotoIds] = useState<string[]>(existingPhotoIds);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<Blob[]>([]);
  const [newPhotoUris, setNewPhotoUris] = useState<string[]>([]);

  const pickImage = async () => {
    try {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        console.log(`Selected ${result.assets.length} images`);
        for (const asset of result.assets) {
          try {
            const response = await fetch(asset.uri);
            const blob = await response.blob();

            (blob as any).uri = asset.uri;

            setNewPhotos(prev => [...prev, blob]);
            setNewPhotoUris(prev => [...prev, asset.uri]);
          } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to process image. Please try again.');
          }
        }
      }
    } catch (error) {
      console.error('Error in pickImage function:', error);
      alert('An error occurred while picking images. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.8,
      });


      if (!result.canceled && result.assets.length > 0) {
        try {
          const asset = result.assets[0];

          const response = await fetch(asset.uri);
          const blob = await response.blob();

          (blob as any).uri = asset.uri;

          setNewPhotos(prev => [...prev, blob]);
          setNewPhotoUris(prev => [...prev, asset.uri]);
        } catch (error) {
          console.error('Error processing camera image:', error);
          alert('Failed to process image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error in takePhoto function:', error);
      alert('An error occurred while taking a photo. Please try again.');
    }
  };

  const toggleExistingPhoto = (photoId: string) => {
    setSelectedExistingPhotoIds(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const togglePhotoForDeletion = (photoId: string) => {
    setPhotosToDelete(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
    setNewPhotoUris(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onPhotosSelected({
      existingPhotoIds: selectedExistingPhotoIds,
      newPhotos,
      photosToDelete
    });
  }, [selectedExistingPhotoIds, newPhotos, photosToDelete, onPhotosSelected]);

  return (
    <Box className="w-full">
      <Text size="lg" bold className="mb-2">Photos</Text>

      {existingPhotoIds.length > 0 && (
        <>
          <Text size="md" className="mb-1">Existing Photos</Text>
          <ScrollView horizontal className="mb-4">
            {existingPhotoIds.map(photoId => (
              <View key={photoId} style={{marginRight: 8, position: 'relative'}}>
                <TouchableOpacity
                  onPress={() => toggleExistingPhoto(photoId)}
                  style={{
                    borderWidth: 2,
                    borderColor: selectedExistingPhotoIds.includes(photoId) ? '#4CAF50' : 'transparent',
                    borderRadius: 8,
                    overflow: 'hidden'
                  }}
                >
                  <Image
                    source={{uri: getPhotoUrl(photoId)}}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 6,
                      opacity: photosToDelete.includes(photoId) ? 0.5 : 1
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: photosToDelete.includes(photoId) ? 'rgba(255,0,0,0.7)' : 'rgba(0,0,0,0.5)',
                    borderRadius: 12,
                    width: 24,
                    height: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => togglePhotoForDeletion(photoId)}
                >
                  <Text style={{color: 'white', fontSize: 16}}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {newPhotoUris.length > 0 && (
        <>
          <Text size="md" className="mb-1">New Photos</Text>
          <ScrollView horizontal className="mb-4">
            {newPhotoUris.map((uri, index) => (
              <View key={index} style={{marginRight: 8, position: 'relative'}}>
                <Image
                  source={{uri}}
                  style={{width: 100, height: 100, borderRadius: 8}}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 12,
                    width: 24,
                    height: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => removeNewPhoto(index)}
                >
                  <Text style={{color: 'white', fontSize: 16}}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      <HStack space="md">
        <Button onPress={pickImage} className="flex-1">
          <ButtonText>Pick Images</ButtonText>
        </Button>
        <Button onPress={takePhoto} className="flex-1">
          <ButtonText>Take Photo</ButtonText>
        </Button>
      </HStack>
    </Box>
  );
};
