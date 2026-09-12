# Barkod Okuma Uygulaması

Bu uygulama, mobil cihazlarda çalışacak şekilde tasarlanmıştır. Kullanıcıdan müşteri adı alır, telefonun kamerasını açar ve barkod tarama imkanı sunar.

## Özellikler

- Müşteri adı giriş alanı
- Mobil telefon kamerayı başlatma
- Barkod tarama (arka kamera)
- Taranan barkodları listeleme
- E-posta gönderme butonu

## Kullanım Talimatları

1. HTML ve JavaScript dosyalarını bir web sunucusunda çalıştırın
2. Tarayıcıda "Kamerayı Başlat" butonuna tıklayarak kamera erişimini sağlayın
3. "Barkod Tara" butonu ile barkod tarama işlemini yapın
4. "E-posta Gönder" butonuyla gönderme işlemi simülasyonunu yapın

## Önemli Notlar

Bu örnek sadece frontend kısmını içerir çünkü e-posta gönderimi doğrudan tarayıcıda yapılamaz. Gerçek bir sistem için bir backend servisi gerekir.

Eğer bu uygulamayı çalıştırabilir hale getirmek isterseniz, aşağıdaki adımları izleyebilirsiniz:

1. Bir backend servis oluşturun (Node.js, Python vb.)
2. E-posta gönderme endpoint'ini ekleyin
3. Frontend kısmını bu API ile entegre edin

## Gereklilikler

- Mobil cihaz veya emülatör
- Kamera erişim izni veren tarayıcı