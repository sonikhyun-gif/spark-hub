FROM gradle:8.5-jdk17

# Android SDK 필수 컴포넌트 설치
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        wget unzip openjdk-17-jdk-headless \
        cmake ninja-build \
        fonts-liberation libnss3 libatk-bridge2.0-0 libgtk-3-0 \
        && rm -rf /var/lib/apt/lists/*

# Android SDK 설치
ENV ANDROID_HOME=/opt/android-sdk
RUN mkdir -p $ANDROID_HOME && \
    echo "y" | sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" 2>&1

ENV PATH=$PATH:$ANDROID_HOME/platform-tools
ENV ANDROID_SDK_ROOT=$ANDROID_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

WORKDIR /app

# Gradle 파일들 복사
COPY build.gradle settings.gradle gradlew variables.gradle ./
COPY gradle/ ./gradle/
COPY app/ ./app/

USER root

CMD ["./gradlew", "assembleDebug"]
