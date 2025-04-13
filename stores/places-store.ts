import {Place} from "@/schemas/place";
import {create} from "zustand/react";
import {initPlaces} from "@/constants/places-init-values";

type PlacesStore = {
  places: Place[],
  getPlaces: () => Place[],
  getPlaceById: (id: string) => Place | undefined,
  addPlace: (place: Place) => void,
  updatePlace: (updatedPlace: Place) => void,
  deletePlace: (id: string) => void,
}

export const usePlacesStore = create<PlacesStore>((set, get) => ({
  places: initPlaces,
  getPlaces: () => get().places,
  getPlaceById: (id: string) => get().places.find((place) => place.id === id),
  addPlace: (place: Place) => {
    set((state) => ({
      places: [...state.places, place]
    }))
  },
  updatePlace: (updatedPlace: Place) => {
    set((state) => ({
      places: state.places.map((place) =>
        place.id === updatedPlace.id ? updatedPlace : place
      )
    }))
  },
  deletePlace: (id: string) => {
    set((state) => ({
      places: state.places.filter(place => place.id !== id)
    }))
  }
}))
