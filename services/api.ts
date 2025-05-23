import axios from 'axios';
import {CreatePlaceCommand, PlaceDetailsDto, PlaceDto, UpdatePlaceCommand} from '@/types/api-types';

const api = axios.create({
  baseURL: 'http://localhost:5049',
});

export const placesApi = {
  getPhoto: async (id: string): Promise<Blob> => {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  getPlaces: async (): Promise<PlaceDto[]> => {
    const response = await api.get('/places');
    return response.data;
  },

  getPlaceDetails: async (id: string): Promise<PlaceDetailsDto> => {
    const response = await api.get(`/places/${id}`);
    return response.data;
  },

  createPlace: async (command: CreatePlaceCommand): Promise<string> => {
    const response = await api.post('/places', command);
    return response.data;
  },

  updatePlace: async (id: string, command: UpdatePlaceCommand): Promise<void> => {
    command = {...command, id};
    await api.put(`/places/${id}`, command);
  },

  addPhoto: async (placeId: string, photoUri: string, mimeType: string): Promise<void> => {
    console.log(`Adding photo to place ${placeId}, uri: ${photoUri}, type: ${mimeType}`);

    try {
      const fileData = {
        uri: photoUri,
        name: 'photo.jpg',
        type: mimeType,
      };

      console.log('File data prepared:', fileData);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${api.defaults.baseURL}/places/${placeId}/photo`);

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Photo uploaded successfully');
            resolve();
          } else {
            console.error('Upload failed with status:', xhr.status);
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          console.error('XHR error occurred during upload');
          reject(new Error('Network error occurred during upload'));
        };

        const formData = new FormData();
        formData.append('file', fileData as any);

        xhr.send(formData);
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  },

  deletePhoto: async (placeId: string, photoId: string): Promise<void> => {
    await api.delete(`/places/${placeId}/photo/${photoId}`);
  },

  deletePlace: async (id: string): Promise<void> => {
    await api.delete(`/places/${id}`);
  },

  getPhotoUrl: (photoId: string): string => {
    return `${api.defaults.baseURL}/files/${photoId}`;
  },
};
