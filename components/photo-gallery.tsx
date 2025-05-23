import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import {Box} from '@/components/ui/box';
import {Text} from '@/components/ui/text';
import {usePlacesStore} from '@/stores/places-store';
import {Spinner} from '@/components/ui/spinner';
import {Gesture, GestureDetector, GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming} from 'react-native-reanimated';

interface PhotoGalleryProps {
  photoIds: string[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({photoIds}) => {
  const {getPhotoUrl} = usePlacesStore();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [loadedPhotos, setLoadedPhotos] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const startX = useSharedValue(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    setIsLoading(true);
    setLoadedPhotos({});

    if (!photoIds || photoIds.length === 0) {
      setIsLoading(false);
    }
  }, [photoIds]);

  if (!photoIds || photoIds.length === 0) {
    return (
      <Box className="w-full py-2">
        <Text size="md" className="text-gray-500">No photos available</Text>
      </Box>
    );
  }

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {scale: scale.value}
      ],
      opacity: opacity.value,
    };
  });


  const openPhoto = (index: number) => {
    translateX.value = 0;
    opacity.value = 1;
    scale.value = 1;
    setSelectedPhotoIndex(index);
  };

  const closePhoto = () => {
    if (isAnimating.current) return;

    opacity.value = withTiming(0, {duration: 200}, () => {
      runOnJS(handleClosePhoto)();
    });
  };

  const handleClosePhoto = () => {
    setSelectedPhotoIndex(null);
  };

  const animateToNextPhoto = () => {
    if (isAnimating.current || selectedPhotoIndex === null) return;
    isAnimating.current = true;

    translateX.value = withTiming(-screenWidth, {duration: 250}, () => {
      translateX.value = screenWidth;

      runOnJS(updateToNextPhoto)();

      translateX.value = withTiming(0, {duration: 250}, () => {
        runOnJS(finishAnimation)();
      });
    });
  };

  const updateToNextPhoto = () => {
    setSelectedPhotoIndex(prev => {
      if (prev !== null && prev < photoIds.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  };

  const animateToPreviousPhoto = () => {
    if (isAnimating.current || selectedPhotoIndex === null) return;
    isAnimating.current = true;

    translateX.value = withTiming(screenWidth, {duration: 250}, () => {
      translateX.value = -screenWidth;

      runOnJS(updateToPreviousPhoto)();

      translateX.value = withTiming(0, {duration: 250}, () => {
        runOnJS(finishAnimation)();
      });
    });
  };

  const updateToPreviousPhoto = () => {
    setSelectedPhotoIndex(prev => {
      if (prev !== null && prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  const finishAnimation = () => {
    isAnimating.current = false;
  };

  const goToNextPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photoIds.length - 1 && !isAnimating.current) {
      animateToNextPhoto();
    } else {
      translateX.value = withSpring(0);
      opacity.value = withSpring(1);
      scale.value = withSpring(1);
    }
  };

  const goToPreviousPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0 && !isAnimating.current) {
      animateToPreviousPhoto();
    } else {
      translateX.value = withSpring(0);
      opacity.value = withSpring(1);
      scale.value = withSpring(1);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      if (isAnimating.current) return;
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      if (isAnimating.current) return;

      const atFirstPhoto = selectedPhotoIndex === 0;
      const atLastPhoto = selectedPhotoIndex === photoIds.length - 1;

      let translation = event.translationX;
      if ((atFirstPhoto && translation > 0) || (atLastPhoto && translation < 0)) {
        translation = translation / 3;
      }

      translateX.value = startX.value + translation;

      const distance = Math.abs(translation);
      opacity.value = Math.max(0.7, 1 - distance / (screenWidth * 1.5));
      scale.value = Math.max(0.9, 1 - distance / (screenWidth * 5));
    })
    .onEnd((event) => {
      if (isAnimating.current) return;

      const swipeDistance = event.translationX;
      const swipeThreshold = screenWidth * 0.2;
      const atFirstPhoto = selectedPhotoIndex === 0;
      const atLastPhoto = selectedPhotoIndex === photoIds.length - 1;

      if (swipeDistance < -swipeThreshold && !atLastPhoto) {
        runOnJS(goToNextPhoto)();
      } else if (swipeDistance > swipeThreshold && !atFirstPhoto) {
        runOnJS(goToPreviousPhoto)();
      } else if (Math.abs(swipeDistance) > screenWidth * 0.5) {
        runOnJS(closePhoto)();
      } else {
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
        scale.value = withSpring(1);
      }
    });

  return (
    <Box className="w-full">
      <Text size="lg" bold className="mb-2">Photos</Text>

      {isLoading && (
        <Box className="w-full py-4">
          <Spinner size="small" text="Loading photos..."/>
        </Box>
      )}

      <ScrollView horizontal className="mb-4">
        {photoIds.map((photoId, index) => (
          <TouchableOpacity
            key={photoId}
            onPress={() => openPhoto(index)}
            style={{marginRight: 8}}
          >
            <Image
              source={{uri: getPhotoUrl(photoId)}}
              style={{width: 100, height: 100, borderRadius: 8}}
              onLoad={() => {
                setLoadedPhotos(prev => {
                  const newState = {...prev, [photoId]: true};

                  if (photoIds.every(id => newState[id])) {
                    setIsLoading(false);
                  }

                  return newState;
                });
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={selectedPhotoIndex !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closePhoto}
      >
        <GestureHandlerRootView style={{flex: 1}}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {selectedPhotoIndex !== null && (
              <View>
                <GestureDetector gesture={panGesture}>
                  <Animated.View style={{width: screenWidth, height: screenHeight * 0.7}}>
                    <Animated.Image
                      source={{uri: getPhotoUrl(photoIds[selectedPhotoIndex])}}
                      style={[
                        {
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain'
                        },
                        animatedImageStyle
                      ]}
                    />
                  </Animated.View>
                </GestureDetector>
              </View>
            )}

            <View style={{
              position: 'absolute',
              top: 20,
              width: '100%',
              alignItems: 'center'
            }}>
              <Text style={{color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 5}}>
                Swipe left or right to navigate
              </Text>
              {selectedPhotoIndex !== null && (
                <Text style={{color: 'white', fontSize: 16}}>
                  {selectedPhotoIndex + 1} / {photoIds.length}
                </Text>
              )}
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              position: 'absolute',
              bottom: 50,
              paddingHorizontal: 20
            }}>
              <TouchableOpacity
                onPress={goToPreviousPhoto}
                disabled={selectedPhotoIndex === 0 || isAnimating.current}
                style={{
                  opacity: selectedPhotoIndex === 0 ? 0.5 : 1,
                  padding: 10
                }}
              >
                <Text style={{color: 'white', fontSize: 18}}>Previous</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={closePhoto}
                style={{padding: 10}}
              >
                <Text style={{color: 'white', fontSize: 18}}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={goToNextPhoto}
                disabled={selectedPhotoIndex === photoIds.length - 1 || isAnimating.current}
                style={{
                  opacity: selectedPhotoIndex === photoIds.length - 1 ? 0.5 : 1,
                  padding: 10
                }}
              >
                <Text style={{color: 'white', fontSize: 18}}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GestureHandlerRootView>
      </Modal>
    </Box>
  );
};