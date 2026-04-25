#!/bin/bash

echo "Building .jar"
./mvnw clean package -DskipTests 

echo "Moving .jar"
mv target/furiosos-kid-0.0.1.jar furiosos.jar
