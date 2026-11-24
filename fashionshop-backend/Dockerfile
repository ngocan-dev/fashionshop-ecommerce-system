FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
RUN groupadd --system app && useradd --system --gid app app
COPY --from=build --chown=app:app /build/target/fashionshop-0.0.1-SNAPSHOT.jar /app/app.jar
USER app
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=65.0"
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
