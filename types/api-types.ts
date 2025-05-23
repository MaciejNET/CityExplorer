// DTO types for API communication

// Geographical coordinates DTO
export interface GeographicalCoordinatesDto {
  latitude: number;
  longitude: number;
}

// Place DTO for list view
export interface PlaceDto {
  id: string;
  name: string;
  city: string;
}

// Place details DTO for detailed view
export interface PlaceDetailsDto {
  id: string;
  name: string;
  city: string;
  description: string;
  location: GeographicalCoordinatesDto;
  photoIds: string[];
}

// Create place command
export interface CreatePlaceCommand {
  name: string;
  city: string;
  description: string;
  location: GeographicalCoordinatesDto;
}

// Update place command
export interface UpdatePlaceCommand {
  id: string;
  name: string;
  city: string;
  description: string;
  location: GeographicalCoordinatesDto;
}

// Add photo command
export interface AddPhotoCommand {
  id: string;
  fileBytes: Uint8Array;
}

// Delete photo command
export interface DeletePhotoCommand {
  id: string;
  photoId: string;
}

// Get photo query
export interface GetPhotoQuery {
  id: string;
}
