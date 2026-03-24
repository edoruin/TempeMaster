# Guía de Uso WiFiManager - Termometro_ESP32_LCD

## Instalación de la librería

1. Abre **Arduino IDE**
2. Ve a **Sketch** > **Include Library** > **Manage Libraries**
3. Busca **WiFiManager** y haz clic en instalar

## Primera conexión

### Opción Automática
1. Sube el código a tu ESP32
2. El ESP32 intentará conectarse a la última red guardada
3. Si no puede conectar, arrancará un **Portal de Configuración**

### Portal de Configuración
1. Busca la red WiFi **"Termometro_ESP32"** desde tu celular/computadora
2. La contraseña es: **password123**
3. Se abrirá una página web de configuración
4. Ingresa tu red WiFi y contraseña
5. **Importante**: Completa también los campos MQTT:
   - MQTT Server: `74726e31dc8a45ed98a0516a78fb9dbd.s1.eu.hivemq.cloud`
   - MQTT Port: `8883`
   - MQTT User: `agrofloppy`
   - MQTT Password: `Actuana110398.com`
6. Clic en **Save**
7. El ESP32 se reiniciará y conectará

## Cambiar WiFi

### Método 1: Botón Reset (GPIO0)
1. Mantén presionado el botón **BOOT** (GPIO0) por ~3 segundos
2. El ESP32 borrará las credenciales guardadas
3. Se reiniciará y mostrará la red "Termometro_ESP32"

### Método 2: Via serie
1. Abre el Monitor Serie (115200 baudios)
2. Envía cualquier texto o presiona el botón BOOT
3. Repite los pasos del Portal de Configuración

## Estructura del código

| Sección | Descripción |
|---------|-------------|
| `WiFiManager wm` | Objeto principal para gestión WiFi |
| `WiFiManagerParameter` | Parámetros personalizables en el portal |
| `wm.autoConnect()` | Conexión automática o inicia portal |
| `wm.resetSettings()` | Borra credenciales guardadas |

## Troubleshooting

| Problema | Solución |
|----------|----------|
| No aparece red "Termometro_ESP32" | Presiona el botón BOOT al iniciar |
| No guarda configuración MQTT | Verifica que los campos no estén vacíos |
| Se conecta a WiFi pero no a MQTT | Verifica credenciales MQTT en el portal |
| Portal no carga | Conéctate a la red y abre 192.168.4.1 |
