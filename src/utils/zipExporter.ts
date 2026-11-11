import JSZip from 'jszip';
import { ApkConfig } from '../types/apkConfig';
import { generateAndroidProjectFiles } from './apkGenerator';

/**
 * Creates and downloads a ready-to-compile Android Studio project as a ZIP archive.
 */
export async function downloadAndroidProjectZip(config: ApkConfig): Promise<void> {
  const zip = new JSZip();
  const files = generateAndroidProjectFiles(config);

  // Add all source and configuration files
  files.forEach(file => {
    zip.file(file.path, file.content);
  });

  // Add custom progress drawable
  zip.file(
    'app/src/main/res/drawable/custom_progress.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:id="@android:id/background">
        <shape>
            <solid android:color="#20ffffff" />
        </shape>
    </item>
    <item android:id="@android:id/progress">
        <clip>
            <shape>
                <solid android:color="@color/primaryColor" />
            </shape>
        </clip>
    </item>
</layer-list>`
  );

  // Add gradle-wrapper properties
  zip.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  // Add root gradle wrapper script stub
  zip.file(
    'gradlew',
    `#!/bin/sh
exec gradle "$@"
`,
    { unixPermissions: '755' }
  );

  // Add basic proguard rules
  zip.file(
    'app/proguard-rules.pro',
    `# Reglas de Proguard para WebToApk
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class androidx.webkit.** { *; }
`
  );

  // Generate an SVG app launcher icon
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="112" fill="${config.themeColor}"/>
  <g transform="translate(96, 96)">
    <rect x="20" y="20" width="280" height="280" rx="36" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="8"/>
    <circle cx="160" cy="140" r="44" fill="#ffffff"/>
    <path d="M70 230 C 90 190, 230 190, 250 230" fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round"/>
    <path d="M120 70 L 100 40 M 200 70 L 220 40" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
  </g>
</svg>`;

  zip.file('app/src/main/res/drawable/ic_launcher_foreground.xml', iconSvg);

  // Generate the ZIP blob
  const content = await zip.generateAsync({ type: 'blob' });
  const filename = `${config.appName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}_android_project.zip`;

  // Trigger download
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
