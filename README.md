# Temperatura Polc - Dashboard MQTT

Dashboard estático para visualizar temperatura y humedad desde un ESP32 via MQTT (HiveMQ Cloud).

## Configuración en GitHub

### 1. Subir este repo a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USER/temperatura-polc.git
git push -u origin main
```

### 2. Agregar Variables y Secrets

En el repo de GitHub → **Settings** → **Vars and secrets** → **Actions**:

#### Repository Variables (no son sensibles):
- `MQTT_BROKER_URL` = `wss://74726e31dc8a45ed98a0516a78fb9dbd.s1.eu.hivemq.cloud:8884/mqtt`
- `MQTT_USERNAME` = `agrofloppy`

#### Repository Secrets:
- `MQTT_PASSWORD` = `Actuana110398.com`

### 3. Habilitar GitHub Pages
- Repo → **Settings** → **Pages** → **Source**: GitHub Actions

### 4. Hacer push
Cada vez que hagas push a `main`, el workflow reemplazará automáticamente los placeholders con los valores de GitHub y desplegará el dashboard.
