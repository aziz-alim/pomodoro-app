# React + Vite
# Responsive Pomodoro Timer Application

Bu proje; Pomodoro tekniğini temel alan, kullanıcıların çalışma ve mola seanslarını real-time yönetmesini sağlayan, mobil uyumlu (responsive) ve erişilebilirlik standartlarına uygun modern bir web uygulamasıdır. Proje, frontend geliştirme süreçlerinde durum yönetimi (state management) ve zamanlayıcı (timer loops) optimizasyonlarını pratik etmek amacıyla React mimarisiyle inşa edilmiştir.

## Öne Çıkan Özellikler

* **Dinamik Seans Yönetimi:** 25 dakikalık Çalışma (Work), 5 dakikalık Kısa Mola (Short Break) ve her 4 çalışma seansında bir tetiklenen 15 dakikalık Uzun Mola (Long Break) otomatik döngüsü.
* **Sesli Bildirim Sistemi:** Seanslar başarıyla sıfırlandığında HTML5 Audio API kullanılarak kullanıcıya proaktif sesli uyarı verilir.
* **Eyalet Odaklı Arayüz (State-Driven UI):** Seçilen seans moduna göre (Kırmızı, Yeşil, Mavi) yumuşak geçişlerle (CSS transitions) renk değiştiren akıllı tema yapısı.
* **Erişilebilirlik (Accessibility):** Ekran okuyucular için `aria-label` ve `aria-live` attributeları ile güçlendirilmiş semantik kodlama.

## Teknolojik Altyapı

* **Framework:** React (Vite tabanlı)
* **Hooks:** `useState`, `useEffect` (Interval lifecycle yönetimi için), `useRef` (DOM ve Audio persistence için)
* **Styling:** Vanilla CSS (Flexbox, CSS Variables, Backdrop-filtering)
* **Deployment:** Vercel Cloud Platform

---

## Kurulum ve Yerel Geliştirme

Proje bağımlılıklarını yüklemek ve yerel sunucuda (Localhost) çalıştırmak için:

    # Bağımlılıkları Kur
    npm install

    # Projeyi Ayağa Kaldır
    npm run dev

## Kazanımlar
* **Zamanlayıcı Kararlılığı:** React bileşen yaşam döngüsünde (component lifecycle) memory leak (bellek sızıntısı) oluşturmayacak şekilde güvenli `setInterval` ve `clearInterval` kurgusu.
* **Uzak Durum Yönetimi:** Birden fazla birbiriyle ilişkili state yapısının tek bir mantıksal döngü (Döngüsel Pomodoro Algoritması) altında birleştirilmesi.


https://roadmap.sh/projects/pomodoro-timer 
