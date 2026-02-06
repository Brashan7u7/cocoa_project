# Generar APK

## Requisitos

- Java JDK 17 instalado
- Android Studio instalado (para el Android SDK)

## Pasos

### 1. Regenerar el proyecto Android

```bash
npx expo prebuild --platform android --clean
```

### 2. Aplicar configuraciones en `android/gradle.properties`

Abrir el archivo y cambiar:

```properties
# Más memoria para la JVM
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m

# Solo compilar para arm64 (la mayoría de teléfonos modernos)
reactNativeArchitectures=arm64-v8a

# Nueva arquitectura habilitada (requerido por Reanimated)
newArchEnabled=true
```

### 3. Aplicar fix en `android/build.gradle`

Agregar este bloque **después** de `allprojects { ... }` y **antes** de `apply plugin`:

```gradle
subprojects {
  afterEvaluate { project ->
    if (project.hasProperty('android')) {
      android {
        compileSdkVersion 36
      }
    }
  }
}
```

### 4. Compilar el APK

```bash
cd android && ./gradlew assembleRelease --no-daemon -x lint -x test
```

### 5. Ubicación del APK

El APK se genera en:

```
android/app/build/outputs/apk/release/app-release.apk
```

## Comando rápido (todo junto)

```bash
npx expo prebuild --platform android --clean && cd android && ./gradlew assembleRelease --no-daemon -x lint -x test
```

> **Importante:** Después del paso 1, siempre hay que repetir los pasos 2 y 3 porque `expo prebuild --clean` regenera esos archivos.






cd android
.\gradlew assembleRelease --no-daemon --no-build-cache -x lint -x test