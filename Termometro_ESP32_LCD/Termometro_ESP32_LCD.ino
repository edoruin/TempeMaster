#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

const char* ssid = "Edu";
const char* password = "cajita123";

const char* mqtt_server = "74726e31dc8a45ed98a0516a78fb9dbd.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_client_id = "ESP32-BOMBA-KAREN";
const char* mqtt_user = "useradmin";
const char* mqtt_password = "User123456";

const char* topic_datos = "sensor/datos_ambientales";
const char* topic_estado = "sensor/estado";

WiFiClientSecure espClient;
PubSubClient client(espClient);

#define DHTPIN 4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  Serial.begin(115200);
  delay(500);
  
  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();
  
  Serial.println("Iniciando...");
  lcd.print("Iniciando...");
  
  WiFi.begin(ssid, password);
  Serial.println("Conectando WiFi...");
  lcd.setCursor(0, 1);
  lcd.print("WiFi...");
  
  int counter = 0;
  while (WiFi.status() != WL_CONNECTED && counter < 30) {
    delay(500);
    Serial.print(".");
    counter++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi OK!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    lcd.clear();
    lcd.print("WiFi OK!");
    delay(1000);
  } else {
    Serial.println("\nWiFi FAIL!");
    lcd.clear();
    lcd.print("WiFi FAIL!");
    while(1);
  }

  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  
  Serial.println("Conectando a HiveMQ...");
  Serial.print("Server: ");
  Serial.println(mqtt_server);
  Serial.print("Port: ");
  Serial.println(mqtt_port);
  Serial.print("User: ");
  Serial.println(mqtt_user);
  
  lcd.clear();
  lcd.print("MQTT...");
  
  if (client.connect(mqtt_client_id, mqtt_user, mqtt_password)) {
    Serial.println("Conectado a HiveMQ!");
    lcd.clear();
    lcd.print("MQTT OK!");
    delay(1000);
  } else {
    Serial.print("Error MQTT estado: ");
    Serial.println(client.state());
    lcd.clear();
    lcd.print("MQTT FAIL!");
    lcd.setCursor(0, 1);
    lcd.print("Estado: ");
    lcd.print(client.state());
  }
  
  dht.begin();
  lcd.clear();
  lcd.print("Sistema listo");
}

void loop() {
  if (!client.connected()) {
    Serial.println("Reconectando MQTT...");
    if (client.connect(mqtt_client_id, mqtt_user, mqtt_password)) {
      Serial.println("Reconectado!");
    }
  }
  client.loop();

  float humedad = dht.readHumidity();
  float temperatura = dht.readTemperature();

  if (isnan(humedad) || isnan(temperatura)) {
    lcd.setCursor(0, 0);
    lcd.print("Error DHT       ");
    delay(2000);
    return;
  }

  lcd.setCursor(0, 0);
  lcd.print("Temp:");
  lcd.print(temperatura, 1);
  lcd.print((char)223);
  lcd.print("C");
  
  lcd.setCursor(0, 1);
  lcd.print("Hum:");
  lcd.print(humedad, 1);
  lcd.print("%");

  if (client.connected()) {
    String jsonPayload = "{\"temperatura\":" + String(temperatura, 1) + 
                         ",\"humedad\":" + String(humedad, 1) + "}";
    client.publish(topic_datos, jsonPayload.c_str());
    Serial.println("Enviado: " + jsonPayload);
  }

  delay(2000);
}
