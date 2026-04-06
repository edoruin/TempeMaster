# Configuración de Secrets para GitHub Actions

## Crear secrets en GitHub

1. Ir a **Settings** → **Secrets and variables** → **Actions**
2. Crear los siguientes secrets:

| Secret Name | Value |
|-------------|-------|
| MQTT_BROKER | 74726e31dc8a45ed98a0516a78fb9dbd.s1.eu.hivemq.cloud |
| MQTT_USER | useradmin |
| MQTT_PASS | User123456 |

## Notes

- El workflow de GitHub Actions reemplazará automáticamente estas credenciales en el archivo `docs/index.html` durante el build
- Las credenciales no будут visibles en el código fuente publicado
- El archivo `.github/workflows/deploy.yml` se encarga de hacer el reemplazo en tiempo de deploy