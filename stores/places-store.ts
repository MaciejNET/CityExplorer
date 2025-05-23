import {Place} from "@/schemas/place";
import {create} from "zustand/react";
import {placesApi} from "@/services/api";
import {PlaceDetailsDto} from "@/types/api-types";

type PlacesStore = {
  places: Place[],
  isLoading: boolean,
  error: string | null,
  fetchPlaces: () => Promise<void>,
  getPlaces: () => Place[],
  getPlaceById: (id: string) => Promise<Place | undefined>,
  addPlace: (place: Place, photos: Blob[]) => Promise<void>,
  updatePlace: (updatedPlace: Place, newPhotos: Blob[]) => Promise<void>,
  deletePlace: (id: string) => Promise<void>,
  deletePhoto: (placeId: string, photoId: string) => Promise<void>,
  getPhotoUrl: (photoId: string) => string,
}

const convertToPlace = (placeDetails: PlaceDetailsDto): Place => ({
  id: placeDetails.id,
  name: placeDetails.name,
  city: placeDetails.city,
  description: placeDetails.description,
  location: placeDetails.location,
  photoIds: placeDetails.photoIds,
});

export const usePlacesStore = create<PlacesStore>((set, get) => ({
  places: [],
  isLoading: false,
  error: null,

  fetchPlaces: async () => {
    set({isLoading: true, error: null});
    try {
      const placeDtos = await placesApi.getPlaces();
      const placeDetailsPromises = placeDtos.map(placeDto =>
        placesApi.getPlaceDetails(placeDto.id)
          .then(placeDetails => convertToPlace(placeDetails))
          .catch(error => {
            console.error(`Failed to fetch details for place ${placeDto.id}:`, error);
            return null;
          })
      );

      const placesWithDetails = (await Promise.all(placeDetailsPromises)).filter(place => place !== null) as Place[];
      set({places: placesWithDetails, isLoading: false});
    } catch (error) {
      console.error('Failed to fetch places:', error);
      set({error: 'Failed to fetch places', isLoading: false});
    }
  },

  getPlaces: () => get().places,

  getPlaceById: async (id: string) => {
    try {
      const placeDetails = await placesApi.getPlaceDetails(id);
      return convertToPlace(placeDetails);
    } catch (error) {
      console.error(`Failed to fetch place ${id}:`, error);
      set({error: `Failed to fetch place ${id}`});
      return undefined;
    }
  },

  addPlace: async (place: Place, photos: Blob[]) => {
    set({isLoading: true, error: null});
    try {
      const createCommand = {
        name: place.name,
        city: place.city,
        description: place.description,
        location: place.location,
      };

      const placeId = await placesApi.createPlace(createCommand);

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        try {
          if (!(photo as any).uri) {
            throw new Error('Photo URI is missing. Make sure the photo object has a uri property.');
          }
          const photoUri = (photo as any).uri;
          const mimeType = photo.type;
          await placesApi.addPhoto(placeId, photoUri, mimeType);
        } catch (photoError) {
          console.error(`Failed to upload photo ${i + 1}:`, photoError);
        }
      }

      await get().fetchPlaces(); // Refresh the places list
      set({isLoading: false});
    } catch (error) {
      console.error('Failed to add place:', error);
      set({error: 'Failed to add place', isLoading: false});
    }
  },

  updatePlace: async (updatedPlace: Place, newPhotos: Blob[]) => {
    set({isLoading: true, error: null});
    try {
      const updateCommand = {
        id: updatedPlace.id,
        name: updatedPlace.name,
        city: updatedPlace.city,
        description: updatedPlace.description,
        location: updatedPlace.location,
      };

      await placesApi.updatePlace(updatedPlace.id, updateCommand);

      if (newPhotos.length > 0) {
        for (let i = 0; i < newPhotos.length; i++) {
          const photo = newPhotos[i];
          try {
            if (!(photo as any).uri) {
              throw new Error('Photo URI is missing. Make sure the photo object has a uri property.');
            }
            const photoUri = (photo as any).uri;
            const mimeType = photo.type;
            await placesApi.addPhoto(updatedPlace.id, photoUri, mimeType);
          } catch (photoError) {
            console.error(`Failed to upload photo ${i + 1}:`, photoError);
          }
        }
      }

      await get().fetchPlaces(); // Refresh the places list
      set({isLoading: false});
    } catch (error) {
      console.error('Failed to update place:', error);
      set({error: 'Failed to update place', isLoading: false});
    }
  },

  deletePlace: async (id: string) => {
    set({isLoading: true, error: null});
    try {
      await placesApi.deletePlace(id);
      set((state) => ({
        places: state.places.filter(place => place.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to delete place:', error);
      set({error: 'Failed to delete place', isLoading: false});
    }
  },

  deletePhoto: async (placeId: string, photoId: string) => {
    set({isLoading: true, error: null});
    try {
      await placesApi.deletePhoto(placeId, photoId);

      set(state => {
        const updatedPlaces = state.places.map(place => {
          if (place.id === placeId) {
            return {
              ...place,
              photoIds: place.photoIds.filter(id => id !== photoId)
            };
          }
          return place;
        });
        return {places: updatedPlaces, isLoading: false};
      });
    } catch (error) {
      console.error('Failed to delete photo:', error);
      set({error: 'Failed to delete photo', isLoading: false});
    }
  },

  getPhotoUrl: (photoId: string) => placesApi.getPhotoUrl(photoId),
}))
