# StudyMate — Admission Planner PWA

একটি mobile-first Progressive Web App (PWA), যা তোমার `Study_Tracker_REBUILT_Fresh_Download_2026-10-28.pdf`-এর ৫৪টি Private class session, ৭৫টি Public task, Private readiness deadline check এবং ৫১-অধ্যায়ের syllabus checklist থেকে তৈরি।

## Features

- Dashboard: আজকের কাজ, overall progress, Private/Public completion, overdue count, upcoming 7 days এবং weekly momentum.
- Daily Tasks: `পড়েছি`, `এক্সাম দিয়েছি`, এবং `রিশিডিউল`.
- Rescheduling: অন্য তারিখে সরানো; নতুন তারিখ dashboard, Today এবং Upcoming Routine-তে দেখা যাবে.
- Upcoming Routine: ৭ দিনের agenda; খালি দিন catch-up-এর জন্য চিহ্নিত.
- Master Task List: search, track/status filters এবং task IDs.
- 51-Chapter Syllabus: পাঁচটি stage — Concept, MCQ/QB, Revision 1, Revision 2, Final Drill.
- Progress Report: track-wise, subject-wise ও week-wise summary.
- Backup / Restore: JSON backup download এবং import.
- Offline support: service worker cache; app একবার online লোড হওয়ার পর cached app offline-এ খোলা যায়.
- Install popup: প্রথম visit-এ StudyMate-এর custom install panel দেখায়; supported browsers-এ `Install app` চাপলে native PWA installation prompt চায়.

## GitHub Pages-এ Publish করার নিয়ম

1. ZIP extract করো। `index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `sw.js`, `assets/` একই project root-এ থাকবে।
2. GitHub-এ নতুন **public repository** তৈরি করো, যেমন `studymate-admission-planner`.
3. ZIP থেকে বের করা **সব ফাইল ও ফোল্ডার** repository-র root-এ upload করো (ZIP ফাইলটিকে একা upload কোরো না)।
4. Repository → **Settings → Pages** খুলে `Deploy from a branch` নির্বাচন করো; Branch `main`, folder `/(root)` দিয়ে Save করো।
5. GitHub Pages-এর HTTPS URL publish হলে Android Chrome-এ URL খুলে app-টি সম্পূর্ণ লোড হতে দাও। প্রথমবার service worker cache তৈরি হতে ইন্টারনেট দরকার।
6. প্রথম visit-এর Install panel-এ **Install app** চাপো। Chrome native prompt দিলে Install নিশ্চিত করো। এরপর হোম/অ্যাপ ড্রয়ারের StudyMate আইকন থেকে standalone app হিসেবে খুলবে।

## Important PWA limitation

Browser নিরাপত্তার কারণে একটি website নিজে থেকে Android-এর system-level install confirmation জোর করে খুলতে পারে না। Website custom install panel দেখাতে পারে; user-এর button press-এর পরে browser যদি `beforeinstallprompt` দেয়, তখন native install dialog খোলে। Browser prompt না দিলে Chrome-এর menu থেকে `Install app` বা `Add to Home screen` পাওয়া যেতে পারে। এটি সাধারণ browser tab shortcut-এর বদলে installable PWA হিসেবে configure করা হয়েছে (`display: standalone`, manifest, service worker, icons, HTTPS hosting).

## Data and privacy

- Task status, rescheduled dates, syllabus progress এবং notes ওই browser/device-এর local storage-এ থাকে.
- এই version-এ cloud sync বা account login নেই। অন্য device-এ progress নিতে `সেটিংস ও ব্যাকআপ` থেকে JSON export/import ব্যবহার করো.
- Browser data clear করার আগে backup download করে রাখো.
- PDF-র কিছু Bengali topic labels embedded font encoding-এর কারণে extraction-এ আংশিক বিকৃত ছিল; app-এ মূল chapter তালিকার অনেক নাম পরিষ্কার করে দেওয়া হয়েছে। Source IDs ও task dates বজায় রাখার চেষ্টা করা হয়েছে.

## Local preview

PWA install/service worker test করতে `file://` দিয়ে `index.html` খোলার বদলে localhost server চালাও:

```bash
python -m http.server 8000
```

তারপর `http://localhost:8000` খুলবে। GitHub Pages-এ HTTPS URL-এ installation পরীক্ষা করাই বাস্তব Android install-এর জন্য সবচেয়ে ভালো।
