#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define RELAY_PIN 3
int TEMPERATURE_THRESHOLD = 30.0;


char* ssid = "su red wifi";
char* password = "su contraseña";
String url = "su endpoint. ejemplo: https://miapi.com/guardar_datos";
String host = "su host. ejemplo: https://miapi.com/";
const int httpsPort = 8080;


float temperature = 0;
float humidity = 0;

const int buttonPin = 4;
const int potentiometerPin = A0;
int buttonState = HIGH;
int lastButtonState = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;
int newSetpoint = 30;
bool readingMode = false;
unsigned long lastprint = 0;
unsigned long lastActivationTime = 0;
const unsigned long activationDuration = 60000;  // 10 minutos en milisegundos
const unsigned long cooldownDuration = 30000;    // 5 minutos en milisegundos
bool relayActive = false;
bool cooldownActive = false;
unsigned long cooldownStartTime = 0;

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(buttonPin, INPUT);

  // Conectar a la red Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a WiFi...");
  }
  Serial.println("Conexión exitosa a WiFi");
}

void loop() {
  //int reading = digitalRead(buttonPin);
  //changeStatus(reading);
  if (readingMode) {
    int mappedValue = map(analogRead(potentiometerPin), 0, 1023, 0, 50);
    if (mappedValue != newSetpoint) {
      newSetpoint = mappedValue;
      Serial.print("Nuevo valor de potenciómetro: ");
      Serial.println(newSetpoint);
    }
  }

  if (!readingMode) {
    unsigned long currentTime = millis();
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();
    if (isnan(temperature)) {
      Serial.println("Error al leer la temperatura");
      delay(1000);
      return;
    }
    if (millis() - lastprint > 1000) {
      Serial.print("Temperatura: ");
      Serial.println(temperature);
      Serial.print("humedad: ");
      Serial.println(humidity);
      Serial.print("estado: ");
      Serial.println(relayActive);
      lastprint = millis();
      subir_datos();
    }
    if (!cooldownActive && temperature > TEMPERATURE_THRESHOLD && !relayActive) {
      activateRelay(currentTime);
    }

    if (relayActive && currentTime - lastActivationTime >= activationDuration) {
      deactivateRelay(currentTime);
    }

    if (cooldownActive && currentTime - cooldownStartTime >= cooldownDuration) {
      cooldownActive = false;
    }
  }


}


void changeStatus(int reading) {
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;
      if (buttonState == LOW) {
        if (!readingMode) {
          readingMode = true;
          Serial.println("Modo lectura activado");
        } else {
          readingMode = false;
          TEMPERATURE_THRESHOLD = newSetpoint;
          Serial.print("Modo lectura desactivado. Nuevo setpoint: ");
          Serial.println(TEMPERATURE_THRESHOLD);
        }
      }
    }
  }

  lastButtonState = reading;
}

void activateRelay(unsigned long currentTime) {
  digitalWrite(RELAY_PIN, HIGH);
  relayActive = true;
  lastActivationTime = currentTime;
  Serial.println("Rele activado");
}

void deactivateRelay(unsigned long currentTime) {
  digitalWrite(RELAY_PIN, LOW);
  cooldownActive = true;
  cooldownStartTime = currentTime;
  relayActive = false;
  Serial.println("Rele desactivado");
}

void subir_datos() {
  if ((WiFi.status() == WL_CONNECTED)) {

    std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);

    // Ignore SSL certificate validation
    client->setInsecure();

    //create an HTTPClient instance
    HTTPClient https;

    //Initializing an HTTPS communication using the secure client
    float voltaje = 24.7;
    int consumo = 1000;
    String control = "Encendido";
    if (https.begin(*client, url)) {  // HTTPS
      https.addHeader("Content-Type", "application/x-www-form-urlencoded");
      
      
      String postData = "temperatura=" + String(temperature) +
                        "&humedad=" + String(humidity) +
                        "&voltaje=" + String(voltaje) +
                        "&consumo=" + String(consumo) +
                        "&control=" + String(control);
      https.addHeader("Content-Length", String(postData.length()));
      // Send HTTP POST request
      int httpCode = https.POST(postData);
      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled
        Serial.printf("[HTTPS] GET... code: %d\n", httpCode);
        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = https.getString();
          Serial.println(payload);
        }
      } else {
        String payload = https.getString();
        Serial.println(payload);
        Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
      }

      https.end();
    } else {
      Serial.printf("[HTTPS] Unable to connect\n");
    }
  }
}
