# Pines ESP32 WROO - Termometro_ESP32_LCD

## I2C (LCD y comunicación)
| Pin ESP32 | Función | Cable LCD |
|-----------|---------|-----------|
| GPIO 21   | SDA     | Cable azul |
| GPIO 22   | SCL     | Cable verde |

## Sensores
| Pin ESP32 | Función | Dispositivo |
|-----------|---------|-------------|
| GPIO 4    | DATA    | DHT22 (Temperatura/Humedad) |

## Botón
| Pin ESP32 | Función | Acción |
|-----------|---------|--------|
| GPIO 0    | BOOT    | Mantener presionado 3s para resetear WiFi |

## LCD I2C
| Componente | Dirección I2C | Tamaño |
|------------|---------------|--------|
| LCD 16x2   | 0x27 o 0x3F  | 16 columnas x 2 filas |

## Configuración WiFi
| Red | Contraseña |
|-----|------------|
| Termometro_ESP32 | password123 |

## Pines de alimentación
| Pin | Función |
|-----|---------|
| 3.3V | Alimentación (LCD, DHT22) |
| GND | Tierra común |
| 5V | Alimentación externa (si se usa) |
