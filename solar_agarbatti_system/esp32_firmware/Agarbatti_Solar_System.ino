/*
 * Smart Solar-Powered Agarbatti Drying & Packaging System - ESP32 Firmware
 * 
 * Hardware Requirements:
 * - ESP32 Development Board
 * - DHT22 (Temperature & Humidity Sensor on GPIO 4)
 * - MQ-2 (Smoke Sensor Analog on GPIO 34)
 * - INA219 (I2C Voltage/Current Sensor for Battery on SDA=21, SCL=22)
 * - ADS1115 (I2C 16-Bit ADC for Solar Voltage on SDA=21, SCL=22)
 * - PWM Fan Motor (GPIO 25)
 * - Heating Element Relay / PWM (GPIO 26)
 * - Fragrance Spray Pump Relay (GPIO 27)
 * - Packaging Motor Relay (GPIO 14)
 * - Alarm Buzzer (GPIO 12)
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <DHT.h>
#include <EEPROM.h>
#include <esp_task_wdt.h>

// ==========================================
// PIN DEFINITIONS
// ==========================================
#define DHTPIN            4
#define DHTTYPE           DHT22
#define SMOKE_PIN         34
#define FAN_PWM_PIN       25
#define HEATER_PIN        26
#define PUMP_PIN          27
#define PACKAGING_PIN     14
#define BUZZER_PIN        12

// PWM Channels
#define FAN_PWM_CHANNEL   0
#define PWM_FREQ          5000
#define PWM_RES           8 // 0-255

// ==========================================
// BLE GATT SERVICE & CHARACTERISTIC UUIDs
// ==========================================
#define SERVICE_UUID           "4fa8c001-1234-5678-b5a3-f393d6985430"
#define SENSOR_CHAR_UUID       "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CONTROL_CHAR_UUID      "8ec90001-f315-4f60-9fb8-838830daea50"
#define BATTERY_CHAR_UUID      "00002a19-0000-1000-8000-00805f9b34fb"

// EEPROM Config
#define EEPROM_SIZE            4096
#define MAX_EEPROM_READINGS    100
#define READING_SIZE           32

// Watchdog Timeout (10 seconds)
#define WDT_TIMEOUT            10

// System Operating State
enum SystemState { IDLE, DRYING, COOLING, FRAGRANCE, PACKING, EMERGENCY_STOP };
SystemState currentState = IDLE;

// Global Sensor Metrics
float temperature = 0.0;
float humidity = 0.0;
float batteryVoltage = 25.2;
float batteryPercentage = 90.0;
float solarVoltage = 34.0;
float solarWattage = 180.0;
bool smokeDetected = false;
float targetTemperature = 45.0;

// BLE Server Handles
BLEServer* pServer = NULL;
BLECharacteristic* pSensorCharacteristic = NULL;
BLECharacteristic* pControlCharacteristic = NULL;
BLECharacteristic* pBatteryCharacteristic = NULL;

bool deviceConnected = false;
bool oldDeviceConnected = false;
unsigned long lastSensorReadTime = 0;
int eepromWritePointer = 0;

// Initialize DHT
DHT dht(DHTPIN, DHTTYPE);

// ==========================================
// BLE CALLBACKS
// ==========================================
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println(">>> Mobile App Connected via BLE <<<");
  };

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println(">>> Mobile App Disconnected <<<");
  }
};

class CommandCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    std::string rxValue = pCharacteristic->getValue();

    if (rxValue.length() > 0) {
      String command = String(rxValue.c_str());
      Serial.print("Received BLE Command: ");
      Serial.println(command);

      // Parse incoming commands
      if (command.indexOf("START_DRYING") >= 0) {
        currentState = DRYING;
        digitalWrite(HEATER_PIN, HIGH);
        ledcWrite(FAN_PWM_CHANNEL, 200); // 80% fan speed
        Serial.println("Action: Drying cycle started.");
      } else if (command.indexOf("STOP") >= 0) {
        currentState = IDLE;
        digitalWrite(HEATER_PIN, LOW);
        digitalWrite(PUMP_PIN, LOW);
        digitalWrite(PACKAGING_PIN, LOW);
        ledcWrite(FAN_PWM_CHANNEL, 0);
        Serial.println("Action: System stopped.");
      } else if (command.indexOf("EMERGENCY_SHUTDOWN") >= 0) {
        triggerEmergencyShutdown("BLE Emergency Command Received");
      } else if (command.indexOf("TARGET_TEMP:") >= 0) {
        int idx = command.indexOf("TARGET_TEMP:");
        targetTemperature = command.substring(idx + 12).toFloat();
        Serial.print("Target temp updated to: ");
        Serial.println(targetTemperature);
      }
    }
  }
};

// ==========================================
// HARDWARE SAFETY SHUTDOWN
// ==========================================
void triggerEmergencyShutdown(const char* reason) {
  currentState = EMERGENCY_STOP;
  digitalWrite(HEATER_PIN, LOW);
  digitalWrite(PUMP_PIN, LOW);
  digitalWrite(PACKAGING_PIN, LOW);
  ledcWrite(FAN_PWM_CHANNEL, 255); // Max fan to clear fumes/heat
  digitalWrite(BUZZER_PIN, HIGH);

  Serial.print("!!! EMERGENCY SHUTDOWN TRIGGERED: ");
  Serial.print(reason);
  Serial.println(" !!!");
}

// ==========================================
// EEPROM STORAGE FUNCTIONS
// ==========================================
void storeReadingInEEPROM(float t, float h, float b) {
  int addr = eepromWritePointer * READING_SIZE;
  EEPROM.put(addr, t);
  EEPROM.put(addr + 4, h);
  EEPROM.put(addr + 8, b);
  EEPROM.commit();

  eepromWritePointer = (eepromWritePointer + 1) % MAX_EEPROM_READINGS;
}

// ==========================================
// SENSOR READING & CONTROL LOGIC
// ==========================================
void readSensors() {
  // Read DHT22
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (!isnan(t)) temperature = t;
  if (!isnan(h)) humidity = h;

  // Read MQ-2 Smoke Sensor
  int rawSmoke = analogRead(SMOKE_PIN);
  smokeDetected = (rawSmoke > 600);

  // Simulated INA219 & ADS1115 Solar Metrics
  batteryVoltage = 25.2 - (millis() % 1000) * 0.0005;
  batteryPercentage = ((batteryVoltage - 21.0) / (29.4 - 21.0)) * 100.0;
  if (batteryPercentage > 100) batteryPercentage = 100;

  solarVoltage = 34.0 + (millis() % 500) * 0.002;
  solarWattage = solarVoltage * 5.2;

  // Safety Boundary Checks
  if (temperature > 60.0) {
    triggerEmergencyShutdown("Overheat Protection: Chamber Exceeded 60°C");
  }

  if (smokeDetected) {
    triggerEmergencyShutdown("Smoke Sensor Triggered Alarm");
  }

  // Automatic PWM Fan Speed adjustment based on Temperature
  if (currentState == DRYING) {
    if (temperature < targetTemperature) {
      digitalWrite(HEATER_PIN, HIGH);
      ledcWrite(FAN_PWM_CHANNEL, 150);
    } else {
      digitalWrite(HEATER_PIN, LOW);
      ledcWrite(FAN_PWM_CHANNEL, 255); // Maximum cooling airflow
    }
  }
}

void transmitBLETelemetry() {
  if (!deviceConnected) {
    // Store reading in EEPROM offline buffer
    storeReadingInEEPROM(temperature, humidity, batteryPercentage);
    return;
  }

  // Construct structured telemetry payload
  // Format: TEMP:38.5,HUM:24.0,BAT:88,BATV:25.4,SOLV:34.2,SOLW:180,SMK:0,PWR:Solar
  String payload = "TEMP:" + String(temperature, 1) +
                 ",HUM:" + String(humidity, 1) +
                 ",BAT:" + String(batteryPercentage, 0) +
                 ",BATV:" + String(batteryVoltage, 1) +
                 ",SOLV:" + String(solarVoltage, 1) +
                 ",SOLW:" + String(solarWattage, 0) +
                 ",SMK:" + String(smokeDetected ? 1 : 0) +
                 ",PWR:Solar";

  pSensorCharacteristic->setValue(payload.c_str());
  pSensorCharacteristic->notify();

  // Update battery characteristic
  uint8_t batLevel = (uint8_t)batteryPercentage;
  pBatteryCharacteristic->setValue(&batLevel, 1);
  pBatteryCharacteristic->notify();

  Serial.print("BLE Telemetry Sent: ");
  Serial.println(payload);
}

// ==========================================
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);
  Serial.println("Starting Solar Agarbatti System ESP32 Firmware...");

  // Initialize Pins
  pinMode(SMOKE_PIN, INPUT);
  pinMode(HEATER_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(PACKAGING_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(HEATER_PIN, LOW);
  digitalWrite(PUMP_PIN, LOW);
  digitalWrite(PACKAGING_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  // Setup PWM Fan Control
  ledcSetup(FAN_PWM_CHANNEL, PWM_FREQ, PWM_RES);
  ledcAttachPin(FAN_PWM_PIN, FAN_PWM_CHANNEL);
  ledcWrite(FAN_PWM_CHANNEL, 0);

  // Initialize Sensors & EEPROM
  dht.begin();
  EEPROM.begin(EEPROM_SIZE);

  // Initialize Hardware Watchdog
  esp_task_wdt_init(WDT_TIMEOUT, true);
  esp_task_wdt_add(NULL);

  // Initialize BLE GATT Server
  BLEDevice::init("Agarbatti-9482");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService* pService = pServer->createService(SERVICE_UUID);

  // Sensor Telemetry Characteristic (Read, Notify)
  pSensorCharacteristic = pService->createCharacteristic(
    SENSOR_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  pSensorCharacteristic->addDescriptor(new BLE2902());

  // Command Control Characteristic (Write)
  pControlCharacteristic = pService->createCharacteristic(
    CONTROL_CHAR_UUID,
    BLECharacteristic::PROPERTY_WRITE
  );
  pControlCharacteristic->setCallbacks(new CommandCallbacks());

  // Battery Characteristic (Read, Notify)
  pBatteryCharacteristic = pService->createCharacteristic(
    BATTERY_CHAR_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );
  pBatteryCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  // Start BLE Advertising
  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println("ESP32 BLE GATT Server Active. Advertising as 'Agarbatti-9482'");
}

// ==========================================
// MAIN LOOP
// ==========================================
void loop() {
  // Reset Hardware Watchdog Timer
  esp_task_wdt_reset();

  unsigned long currentMillis = millis();

  // Read sensors and transmit BLE telemetry every 10 seconds
  if (currentMillis - lastSensorReadTime >= 10000) {
    lastSensorReadTime = currentMillis;
    readSensors();
    transmitBLETelemetry();
  }

  // Handle BLE Re-advertising on disconnection
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    Serial.println("Restarted BLE advertising");
    oldDeviceConnected = deviceConnected;
  }
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }
}
