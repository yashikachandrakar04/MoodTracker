# 🌈 MoodTracker — React Native CLI

A beautiful, feature-rich mood tracking app built with **React Native CLI**. Log your daily mood as colored grid cells, add journal notes and tags, view 30-day trends, and export your data — all stored locally on your device.

![React Native](https://img.shields.io/badge/React%20Native-CLI-61DAFB?logo=react&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-lightgrey)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Mood Levels](#-mood-levels)
- [Data Model](#-data-model)
- [Configuration](#-configuration)
- [Exporting Data](#-exporting-data)
- [Notifications](#-notifications)
- [Theming](#-theming)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### Core
- 🗓️ **Color Grid Calendar** — Each day is a colored cell representing your mood
- 😊 **6 Mood Levels** — From "Terrible" 😢 to "Amazing" 🤩
- 💾 **Local Persistence** — All data stored offline via AsyncStorage
- 🎯 **Date Selection** — Tap any day to log or update your mood

### Enhanced
- 📝 **Journal Notes** — Add text notes to each day's mood
- 🏷️ **Tags** — Categorize entries (`#work`, `#family`, `#health`, etc.)
- 🔍 **Search & Filter** — Search notes by keyword or filter by tag
- 📊 **Trend Chart** — SVG-based 30-day mood trend visualization
- 🔥 **Streak Tracking** — Milestone celebrations every 7 days
- 🏆 **Best / Worst Day** — Insight highlight cards
- 📈 **Mood Distribution** — Percentage breakdown with animated bars
- 🌙 **Dark / Light Theme** — Toggle with persistent preference
- 📤 **CSV Export** — Share your data via native share sheet
- 🔔 **Daily Reminders** — Push notification at 8 PM (configurable)
- ✨ **Animations** — Spring-in grid cells, smooth modal transitions
- 🟦 **Note Indicator** — Dots on grid cells that have notes

---

## 🛠 Tech Stack

- **React Native CLI** (bare workflow)
- **JavaScript (ES6+)**
- **AsyncStorage** — Local key-value storage
- **Moment.js** — Date manipulation
- **React Native SVG** — Chart rendering
- **Notifee** — Local notifications
- **React Native Share** — Native share sheet

---

## 📦 Installation

### Prerequisites

- Node.js **≥ 18**
- React Native CLI environment set up ([official guide](https://reactnative.dev/docs/environment-setup))
- Xcode (for iOS) with CocoaPods
- Android Studio + JDK **11+** (for Android)

### 1. Clone the Repository

```bash
git clone https://github.com/yashikachandrakar04/MoodTracker.git
cd MoodTracker
```

### 2. Install Dependencies

```bash
npm install @react-native-async-storage/async-storage moment react-native-vector-icons react-native-svg react-native-linear-gradient @notifee/react-native react-native-share react-native-fs react-native-modal @react-native-community/datetimepicker
```

Or install each individually:

```bash
npm install @react-native-async-storage/async-storage
npm install moment
npm install react-native-vector-icons
npm install react-native-svg
npm install react-native-linear-gradient
npm install @notifee/react-native
npm install react-native-share
npm install react-native-fs
npm install react-native-modal
npm install @react-native-community/datetimepicker
```

### 3. iOS Setup

```bash
cd ios && pod install && cd ..
```

Add to `ios/YourApp/Info.plist`:

```xml
<key>NSUserNotificationsUsageDescription</key>
<string>Get daily reminders to log your mood</string>
```

### 4. Android Setup

**a) Vector Icons** — Add to `android/app/build.gradle`:

```gradle
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

**b) Notification Permission** — Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

**c) Buffer Polyfill** — Add to the top of `index.js`:

```javascript
import { Buffer } from 'buffer';
global.Buffer = Buffer;
```

### 5. Run the App

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

---

## 📁 Project Structure

```
MoodTrackerApp/
├── App.tsx                         # Root component
├── index.js                        # Entry point (+ Buffer polyfill)
├── package.json
├── src/
│   ├── components/
│   ├── theme/
│   └── utils/
...
```

---

## 🎮 Usage

1. **Launch** the app — today's date is auto-selected.
2. **Tap a mood** from the horizontal selector to log how you feel.
3. **Add a note & tags** in the modal that appears (optional).
4. **Browse the grid** — colored cells show your history at a glance.
5. **Tap any date** to view or edit that day's mood.
6. **Switch to Stats** (📊) to see trends, streaks, and best/worst days.
7. **Search** notes 🔍 or filter by **tags** 🏷️.
8. **Export** your data 📤 via the native share sheet.
9. **Toggle theme** 🌙/☀️ — your preference is remembered.

---

## 🎨 Mood Levels

| Emoji | Label | Value | Color |
|:---:|:---|:---:|:---|
| 😢 | Terrible | 1 | `#8B0000` |
| 😔 | Bad | 2 | `#FF6B6B` |
| 😐 | Okay | 3 | `#FFD93D` |
| 🙂 | Good | 4 | `#6BCB77` |
| 😊 | Great | 5 | `#4D96FF` |
| 🤩 | Amazing | 6 | `#9D4EDD` |

---

## 🗃 Data Model

All mood entries are stored in AsyncStorage under the key `moodData`:

```json
{
  "2025-01-15": {
    "mood": "great",
    "color": "#4D96FF",
    "emoji": "😊",
    "value": 5,
    "note": "Shipped a big feature at work!",
    "tags": ["work", "hobby"],
    "timestamp": "2025-01-15T20:14:32.000Z"
  }
}
```

Theme preference is stored under `theme` with values `"light"` or `"dark"`.

---

## ⚙️ Configuration

| Setting | Location | Default |
|---|---|---|
| Reminder time | `src/utils/notifications.jsx` | 8:00 PM |
| Mood levels | `App.tsx` (`moodTypes`) | 6 levels |
| Available tags | `App.tsx` (`allTags`) | 8 tags |
| Chart window | `src/components/StatsView.jsx` | 30 days |

---

## 📤 Exporting Data

Tap the **📤** icon in the header. The app:

1. Builds a CSV of all entries (`Date, Mood, Value, Emoji, Tags, Note`).
2. Encodes it as base64.
3. Opens the native share sheet (save, email, message, etc.).

Example CSV:

```csv
Date,Mood,Value,Emoji,Tags,Note
2025-01-15,great,5,😊,work|hobby,Shipped a big feature at work!
```

---

## 🔔 Notifications

Daily reminder scheduled with **Notifee**:

- Fires at **8:00 PM** local time
- Repeats **daily**
- Uses a dedicated Android channel (`mood-reminder`)
- Canceled and rescheduled on each app launch to avoid duplicates

To change the time, edit `src/utils/notifications.jsx`:

```javascript
trigger.setHours(20, 0, 0, 0); // 8 PM → change as needed
```

---

## 🎨 Theming

Palettes are defined in `src/theme/themes.jsx`:

```javascript
export const lightTheme = {
  background: '#F5F5F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  primary: '#4D96FF',
  // ...
};

export const darkTheme = {
  background: '#0F0F14',
  card: '#1C1C22',
  text: '#F5F5F7',
  primary: '#6BA6FF',
  // ...
};
```

To add a custom palette:

1. Add a new export (`sepiaTheme`, etc.).
2. Update `App.js` to select between `lightTheme`, `darkTheme`, and your new one.

---

## 🐛 Troubleshooting

### iOS: "Pod install failed"
```bash
cd ios && pod repo update && pod install && cd ..
```

### Android: "Unable to load script"
```bash
npx react-native start --reset-cache
```

### Vector icons not showing
Ensure the `apply from` line is present in `android/app/build.gradle`, then:
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### Notifee build error (Android)
Ensure your project uses **JDK 11+**. Check with:
```bash
java -version
```

### Export fails with Buffer error
Make sure `index.js` contains:
```javascript
import { Buffer } from 'buffer';
global.Buffer = Buffer;
```

### Dark mode not persisting
Verify AsyncStorage is correctly linked:
```bash
npx react-native link @react-native-async-storage/async-storage
```

---

## 🗺 Roadmap

- [ ] Cloud sync (Firebase / Supabase)
- [ ] Home screen widget (iOS + Android)
- [ ] Photo attachments per entry
- [ ] Apple Health / Google Fit integration
- [ ] AI-powered mood insights
- [ ] Weekly & monthly email summaries
- [ ] Multi-language support (i18n)
- [ ] Face ID / fingerprint lock for journal
- [ ] Backup & restore from JSON
- [ ] Mood-based ambient soundscapes

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please follow the existing code style and include tests where applicable.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/)
- [Moment.js](https://momentjs.com/)
- [Notifee](https://notifee.app/)
- [React Native SVG](https://github.com/software-mansion/react-native-svg)
- The open-source community 💙

---

## 📬 Author

**Yashika** — [@yashikachandrakar04](https://github.com/yashikachandrakar04/MoodTracker) 

---

<p align="center">Made with ❤️</p>