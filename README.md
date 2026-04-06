
---

## 1. Resumen del Proyecto

### Descripción General

Este proyecto implementa un **sistema IoT de monitoreo de temperatura y humedad** desarrollado para el Politécnico. El sistema permite:

- **Medir temperatura y humedad** en diferentes zonas del campus (Cancha, Makerspace, Comedor, Zona Verde)
- **Mostrar datos en tiempo real** mediante dashboards web
- **Publicar datos vía MQTT** a un broker en la nube (HiveMQ Cloud)
- **Visualización local** en display LCD desde el dispositivo ESP32
- **Soporte multi-sensor** para monitoreo de múltiples ubicaciones

### Objetivos del Proyecto

1. Proporcionar monitoreo ambiental en tiempo real
2. Visualizar datos de temperatura y humedad de forma accesible
3. Integrar tecnologías IoT en el entorno educativo
4. Demonstrar comunicación M2M (Machine-to-Machine) con MQTT

---

## 2. Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   ESP32 + DHT22 │─────►│   HiveMQ Cloud  │─────►│  Dashboard Web  │
│   (Sensor)     │ MQTT │   (Broker)      │ MQTT │  (Cliente)      │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │
        ▼
┌─────────────────┐
│   Display LCD  │
│   (Visual local)│
└─────────────────┘
```

### Componentes del Sistema

| Componente | Descripción | Protocolo |
|------------|-------------|-----------|
| ESP32 | Microcontrolador con WiFi integrado | Arduino |
| DHT22 | Sensor de temperatura y humedad | Digital 1-wire |
| LCD 16x2 I2C | Display para visualización local | I2C |
| HiveMQ Cloud | Broker MQTT en la nube | MQTT over WebSocket |
| Dashboard | Interfaz web para visualización | HTTP/WS |

---

## 3. Componentes de Hardware

### ESP32

El microcontrolador ESP32 es el cerebro del sistema, responsable de:
- Leer datos del sensor DHT22
- Controlar el display LCD
- Conectarse a WiFi
- Publicar datos al broker MQTT

**Especificaciones:**
- Tensíon de operación: 3.3V
- WiFi: 802.11 b/g/n
- Bluetooth: BLE 4.2
- Procesador: Dual-core Xtensa LX6

### Sensor DHT22

El sensor DHT22 (AM2302) proporciona lecturas de:
- **Temperatura**: Rango de -40°C a 80°C, precisión ±0.5°C
- **Humedad**: Rango de 0% a 100% RH, precisión ±2% RH

**Conexiones:**
| Pin DHT22 | Función | Color |
|-----------|---------|-------|
| VCC | 3.3V | Rojo |
| DATA | GPIO 4 | Amarillo/Verde |
| GND | Ground | Negro |

### Display LCD 16x2 I2C

Display de cristal líquido con:
- 16 columnas x 2 filas
- Interfaz I2C (dirección 0x27)
- Backlight azul con texto blanco

**Conexiones:**
| Pin LCD | Función | Pin ESP32 |
|---------|---------|-----------|
| SDA | Datos I2C | GPIO 21 |
| SCL | Clock I2C | GPIO 22 |
| VCC | 5V | VIN |
| GND | Ground | GND |

### Diagrama de Conexiones

```
ESP32 Pinout:
┌─────────────────────────────┐
│  3.3V  GND   GPIO21  GPIO22 │  <- I2C (LCD)
│   │     │      │       │    │
│   └─────┴──────┴───────┘    │
│                         GPIO4│  <- DHT22
└─────────────────────────────┘
```

---

## 4. Software y Firmware

### Estructura del Proyecto

```
temperatura_polc/
├── README.md                      # Este archivo
├── Termometro_ESP32_LCD/          # Firmware del ESP32
│   ├── Termometro_ESP32_LCD.ino  # Código fuente principal
│   ├── pines.md                   # Documentación de pines
│   └── wifimanageruse.md          # Guía de WiFi Manager
├── dashboard-app/                 # Dashboard Next.js (principal)
│   ├── src/app/
│   │   ├── page.tsx              # Componente principal
│   │   ├── layout.tsx            # Layout de la aplicación
│   │   └── globals.css           # Estilos globales
│   ├── package.json              # Dependencias Node.js
│   ├── tsconfig.json             # Configuración TypeScript
│   ├── next.config.ts            # Configuración Next.js
│   ├── postcss.config.mjs        # Configuración PostCSS
│   └── tailwind.config.ts        # Configuración Tailwind
├── dashboard.html                 # Dashboard HTML simple
├── dashboardfunctional/            # Dashboard funcional anterior
│   └── index.html
└── docs/                          # Documentación adicional
```

### Firmware ESP32

El firmware está escrito en Arduino/C++ y se encuentra en `Termometro_ESP32_LCD/Termometro_ESP32_LCD.ino`.

**Librerías requeridas:**
- `Wire.h` - Comunicación I2C
- `LiquidCrystal_I2C.h` - Control del display LCD
- `DHT.h` - Lectura del sensor DHT22
- `WiFi.h` - Conexión a red WiFi
- `PubSubClient.h` - Cliente MQTT

**Funcionalidades del firmware:**
1. Inicialización de componentes (WiFi, LCD, DHT22, MQTT)
2. Lectura periódica de temperatura y humedad (cada 10 segundos)
3. Publicación de datos a broker MQTT
4. Display de datos en LCD local
5. Reconexión automática ante pérdida de conexión

**Código funcional (snippet):**
```cpp
// Lectura del sensor
float temperatura = dht.readTemperature();
float humedad = dht.readHumedad();

// Publicación MQTT
String payload = "{\"temperatura\":" + String(temperatura) + 
                 ",\"humedad\":" + String(humedad) + "}";
client.publish("sensor/datos_ambientales", payload.c_str());
```

---

## 5. Configuración MQTT

### Broker MQTT

El proyecto utiliza **HiveMQ Cloud** como broker MQTT.

**Configuración de conexión:**
| Parámetro | Valor |
|-----------|-------|
| Host | `ce6bb88c4eeb4bdc8bc96560b645b95e.s1.eu.hivemq.cloud` |
| Puerto | `8884` (WebSocket TLS) |
| Protocolo | `wss://` (WebSocket Secure) |
| Username | `testadmin` |
| Password | `test123456` |

### Topics MQTT

El sistema utiliza los siguientes topics:

| Topic | Descripción | Formato |
|-------|-------------|---------|
| `sensor/datos_ambientales` | Datos completos (temp + humedad) | JSON |
| `sensor/temperatura` | Solo temperatura | String |
| `sensor/humedad` | Solo humedad | String |

**Formato de mensaje JSON:**
```json
{
  "temperatura": 25.5,
  "humedad": 60.2
}
```

### Suscriptor MQTT (Dashboard)

El dashboard se suscribe a los topics para recibir datos en tiempo real.

---

## 6. Dashboards

### Dashboard Principal (Next.js)

Ubicación: `dashboard-app/`

El dashboard principal está desarrollado con:
- **Framework**: Next.js 16.2.0
- **UI Library**: React 19.2.4
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Cliente MQTT**: mqtt.js 5.15.0

**Características:**
- Visualización en tiempo real de temperatura y humedad
- Diseño responsive
- Actualización automática de datos
- Soporte para múltiples zonas de monitoreo

**Instalación y ejecución:**
```bash
cd dashboard-app
npm install
npm run dev
```

El dashboard estará disponible en `http://localhost:3000`

### Dashboard HTML Simple

Ubicación: `dashboard.html`

Dashboard alternativo basado en HTML5 y JavaScript vanilla.
- No requiere servidor Node.js
- Funciona directamente en el navegador
- Uso de MQTT.js para conexión al broker

**Uso:**
Simplemente abrir `dashboard.html` en un navegador web.

### Dashboard Funcional

Ubicación: `dashboardfunctional/index.html`

Versión funcional anterior del dashboard.

---

## 7. Guía de Instalación

### Requisitos Previos

1. **Hardware:**
   - Placa ESP32
   - Sensor DHT22
   - Display LCD 16x2 con interfaz I2C
   - Cables de conexión
   - Fuente de alimentación 5V/1A

2. **Software:**
   - Arduino IDE o PlatformIO
   - Node.js 18+ (para dashboard Next.js)
   - Navegador web moderno

### Instalación del Firmware

1. **Instalar Arduino IDE:**
   - Descargar desde https://www.arduino.cc/en/software

2. **Agregar soporte ESP32:**
   - Ir a File > Preferences > Additional Boards Manager URLs
   - Agregar: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Ir a Tools > Board > Boards Manager
   - Instalar "ESP32 by Espressif Systems"

3. **Instalar librerías:**
   - Ir a Sketch > Include Library > Manage Libraries
   - Instalar: DHT sensor library, PubSubClient, LiquidCrystal I2C

4. **Subir código:**
   - Abrir `Termometro_ESP32_LCD.ino`
   - Seleccionar placa: Tools > Board > ESP32 Dev Module
   - Seleccionar puerto: Tools > Port
   - Subir: Sketch > Upload

### Instalación del Dashboard Next.js

1. **Instalar Node.js:**
   - Descargar desde https://nodejs.org (versión LTS)

2. **Configurar dashboard:**
   ```bash
   cd dashboard-app
   npm install
   ```

3. **Ejecutar:**
   ```bash
   npm run dev
   ```

4. **Producción:**
   ```bash
   npm run build
   npm start
   ```

---

## 8. Configuración y Credenciales

### Credenciales WiFi

**Configuradas en el firmware:**
```
SSID: Edu
Password: cajita123
```

> **Nota:** Para cambiar las credenciales WiFi, editar las siguientes líneas en `Termometro_ESP32_LCD.ino`:
> ```cpp
> const char* ssid = "Tu_SSID";
> const char* password = "Tu_Password";
> ```

### Credenciales MQTT

```
Username: testadmin
Password: test123456
Broker: wss://ce6bb88c4eeb4bdc8bc96560b645b95e.s1.eu.hivemq.cloud:8884/mqtt
```

> **Advertencia:** Estas credenciales están hardcodeadas. Para un entorno de producción, se recomienda usar variables de entorno o un sistema de gestión de secretos.

### Configuración de Pines ESP32

| GPIO | Función |
|------|---------|
| GPIO 21 | SDA (I2C LCD) |
| GPIO 22 | SCL (I2C LCD) |
| GPIO 4 | DATA (DHT22) |

---

## 9. Solución de Problemas

### Problemas Comunes

#### No conecta al WiFi
- Verificar que el SSID y password sean correctos
- Verificar que el ESP32 esté dentro del rango del router
- Revisar la intensidad de la señal WiFi

#### No conecta al broker MQTT
- Verificar credenciales MQTT
- Verificar conexión a internet
- Revisar firewall que pueda bloquear el puerto 8884

#### Sensor DHT22 no responde
- Verificar conexiones (VCC, DATA, GND)
- Asegurar que el pin DATA esté conectado a GPIO 4
- Verificar que el sensor no esté dañado

#### LCD no muestra nada
- Verificar conexiones I2C (SDA, SCL)
- Ajustar contraste del LCD (potenciómetro en el módulo I2C)
- Verificar dirección I2C (por defecto 0x27)

#### Dashboard no recibe datos
- Verificar que el broker MQTT esté funcionando
- Revisar consola del navegador para errores
- Verificar topics suscritos

### Códigos de LED Indicador

El ESP32 incluye un LED en el pin GPIO 2 que indica el estado:
- **Encendido constante**: Conectando a WiFi
- **Parpadeo rápido**: Enviando datos
- **Apagado**: Error de conexión

---

## 10. Mantenimiento

### Tareas de Mantenimiento Regular

1. **Limpieza del sensor:** Limpiar el DHT22 periódicamente para evitar acumulación de polvo
2. **Verificación de conexiones:** Revisar cables y conexiones cada 3 meses
3. **Actualización de firmware:** Mantener el firmware actualizado con las últimas correcciones
4. **Monitoreo de credenciales:** Rotar credenciales MQTT periódicamente
5. **Respaldo de código:** Mantener backups del código fuente

### Monitoreo

- Revisar logs del broker MQTT para detectar desconexiones
- Monitorear el dashboard para verificar recepción de datos
- Verificar voltaje de alimentación (debe ser 5V estable)

---

## 11. Futuras Mejoras

### Mejoras Propuestas

1. **Multi-sensor:**
   - Agregar más sensores DHT22 para diferentes zonas
   - Implementar red de sensores con topic por zona

2. **Alertas:**
   - Notificaciones cuando la temperatura/humedad superen umbrales
   - Alertas por email o Telegram

3. **Almacenamiento:**
   - Guardar datos históricos en base de datos
   - Gráficos de tendencias a lo largo del tiempo

4. **Autenticación:**
   - Implementar autenticación en el dashboard
   - API REST para acceso programático

5. **Mejora de hardware:**
   - Usar sensor BME280 (presión barométrica adicional)
   - Batería backup para operación durante cortes de energía

6. **OTA Updates:**
   - Actualizaciones de firmware over-the-air
   - Sistema de versión automático

---

## Anexo: Esquema Eléctrico

```
┌─────────────────┐              ┌─────────────────┐
│     ESP32       │              │     DHT22       │
│                 │              │                 │
│  3.3V  ─────────┼──────────────┼─── VCC          │
│  GPIO4 ─────────┼──────────────┼─── DATA         │
│  GND   ─────────┼──────────────┼─── GND          │
│                 │              │                 │
└─────────────────┘              └─────────────────┘

┌─────────────────┐              ┌─────────────────┐
│     ESP32       │              │   LCD I2C       │
│                 │              │                 │
│  5V    ─────────┼──────────────┼─── VCC          │
│  GPIO21 ────────┼──────────────┼─── SDA          │
│  GPIO22 ────────┼──────────────┼─── SCL          │
│  GND   ─────────┼──────────────┼─── GND          │
│                 │              │                 │
└─────────────────┘              └─────────────────┘
```

---

## Licencia y Contacto

Este proyecto fue desarrollado para uso educativo en el Politécnico.

**Versión:** 1.0  
**Última actualización:** Marzo 2026

---

*Documentación generada automáticamente para el proyecto de Monitoreo de Temperatura y Humedad.*
