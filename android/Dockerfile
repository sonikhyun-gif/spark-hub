FROM gradle:8.5-jdk17

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        wget unzip openjdk-17-jdk-headless cmake ninja-build \
        fonts-liberation libnss3 libatk-bridge2.0-0 libgtk-3-0 \
        && rm -rf /var/lib/apt/lists/*

ENV ANDROID_HOME=/opt/android-sdk
RUN mkdir -p $ANDROID_HOME/cmdline-tools/latest

WORKDIR /tmp
RUN wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip \
    && unzip -q commandlinetools-linux-11076708_latest.zip \
    && mkdir -p $ANDROID_HOME/cmdline-tools/latest \
    && mv cmdline-tools/* $ANDROID_HOME/cmdline-tools/latest/ \
    && rm -rf commandlinetools-linux-11076708_latest.zip cmd

ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64

# Android SDK 컴포넌트 설치 (라이선스 동의 + 플랫폼/빌드툴)
RUN yes | sdkmanager --licenses 2>&1 && \
    sdkmanager "platforms;android-34" "build-tools;34.0.0" 2>&1

WORKDIR /app

# Capacitor Android 모듈 복사 (필수 의존성)
COPY capacitor-android/ ./capacitor-android/

# Gradle 파일들 복사
COPY build.gradle settings.gradle gradlew variables.gradle capacitor.settings.gradle ./
COPY gradle/ ./gradle/
COPY app/ ./app/

USER root

CMD ["./gradlew", "assembleDebug"]
