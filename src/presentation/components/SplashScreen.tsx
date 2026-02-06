import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Imágenes
const LOADING_IMAGE = require("../../../assets/images/sc.png");
const START_IMAGE = require("../../../assets/images/sh.png");

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const transitionAnim = useRef(new Animated.Value(1)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada para imagen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de barra de progreso
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    // Después de 2.5 segundos, transicionar a la pantalla de inicio
    const timer = setTimeout(() => {
      // Fade out de la pantalla de carga
      Animated.timing(transitionAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
        // Animar la entrada de la pantalla de inicio
        Animated.parallel([
          Animated.timing(transitionAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(buttonAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleHelp = () => {
    Alert.alert("Ayuda", "Funcionalidad en desarrollo", [{ text: "OK" }]);
  };

  const handleStart = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  return (
    <View style={styles.container}>
      {/* Fondo */}
      <View style={styles.backgroundGradient} />

      {/* Pantalla de carga */}
      {isLoading && (
        <Animated.View
          style={[
            styles.screenContainer,
            {
              opacity: Animated.multiply(fadeAnim, transitionAnim),
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={LOADING_IMAGE}
            style={styles.splashImage}
            resizeMode="contain"
          />

          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando...</Text>
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      )}

      {/* Pantalla de inicio */}
      {!isLoading && (
        <Animated.View
          style={[
            styles.screenContainer,
            {
              opacity: Animated.multiply(fadeAnim, transitionAnim),
            },
          ]}
        >
          <Image
            source={START_IMAGE}
            style={styles.splashImage}
            resizeMode="contain"
          />

          <Animated.View
            style={[
              styles.buttonsContainer,
              {
                
                opacity: buttonAnim,
                transform: [
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }
                  ),
                  },
                ],
              },
            ]}
          >
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.helpButton}
                onPress={handleHelp}
                activeOpacity={0.8}
              >
                <Text style={styles.helpButtonText}>Ayuda</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStart}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Inicio</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FAFAFA",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  splashImage: {
    width: width*10,
    height: height * 0.6,
    maxWidth: 600,
  },
  // Estilos de carga
  loadingContainer: {
    position: "absolute",
    bottom: 100,
    width: "70%",
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "500",
  },
  loadingBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: "#C41E3A",
    borderRadius: 3,
  },
  // Estilos de botones
  buttonsContainer: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 16,
  },
  helpButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#E57539",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpButtonText: {
    color: "#E57539",
    fontSize: 16,
    fontWeight: "700",
  },
  startButton: {
    backgroundColor: "#E57539",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: "#E57539",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
