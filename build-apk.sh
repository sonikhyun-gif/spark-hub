#!/bin/bash
set -e

echo "=== [1/5] Capacitor 프로젝트 초기화 ==="
cd /home/desktop_0410/workspace/spark-app

# package.json 생성
if [ ! -f package.json ]; then
  npm init -y --silent 2>/dev/null || true
fi

# Capacitor 의존성 설치
npm install @capacitor/core@6 @capacitor/cli@6 @capacitor/android@6 2>&1 | tail -3

echo ""
echo "=== [2/5] capacitor.config.json 생성 ==="
cat > capacitor.config.json << 'EOF'
{
  "appId": "com.spark.hub",
  "appName": "Spark Hub",
  "webDir": "www",
  "server": {
    "androidScheme": "https"
  }
}
EOF

echo ""
echo "=== [3/5] web assets 복사 ==="
mkdir -p www
cp index.html manifest.json sw.js style.css app.js www/
mkdir -p www/assets
cp -r assets/* www/assets/

# Capacitor Android 플랫폼 추가
npx cap init SparkHub com.spark.hub --web-dir=www 2>&1 | tail -3

echo ""
echo "=== [4/5] Docker 컨테이너에서 Gradle 빌드 ==="

# 기존 platforms/android가 있으면 제거 (Docker 빌드가 덮어씀)
rm -rf android

# Capacitor sync (Android 프로젝트 생성)
npx cap add android 2>&1 | tail -5
npx cap sync 2>&1 | tail -3

echo ""
echo "=== [5/5] Gradle로 APK 빌드 ==="

cd /home/desktop_0410/workspace/spark-app/android

# Gradle Wrapper가 없으면 생성 (Capacitor가 보통 제공함)
if [ ! -f gradlew ]; then
  echo "ERROR: gradlew not found!"
  exit 1
fi

chmod +x gradlew
./gradlew assembleDebug --no-daemon 2>&1 | tail -30

# 빌드 결과 확인
APK_FILE=$(find /home/desktop_0410/workspace/spark-app/android/app/build/outputs/apk/debug/ -name "*.apk" 2>/dev/null | head -1)
if [ -n "$APK_FILE" ]; then
  echo ""
  echo "=== BUILD SUCCESS ==="
  echo "APK: $APK_FILE"
  ls -lh "$APK_FILE"
else
  echo ""
  echo "ERROR: APK not found!"
  exit 1
fi
