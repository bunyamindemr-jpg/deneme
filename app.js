// jsQR kütüphanesini yüklemek için CDN kullanıyoruz
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
document.head.appendChild(script);

let video = document.getElementById('video');
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
let barcodes = [];
let scanning = false;
let qrCodeData = null;

// Kamera erişimini başlat
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        video.srcObject = stream;
        document.getElementById('status').textContent = 'Kamera aktif - Barkod taramaya hazır';
        scanning = true;
        scanFrame();
    } catch (err) {
        console.error("Kamera erişimi hatası:", err);
        document.getElementById('status').textContent = 'Kamera erişimi reddedildi. Lütfen izin verin.';
        alert('Kameraya erişim için izin gerekiyor. Lütfen tarayıcı ayarlarından kamera erişimine izin verin.');
    }
}

// Her frame'te barkod tarama
function scanFrame() {
    if (!scanning) return;
    
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Canvas boyutlarını ayarla
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Videoyu canvas'a çiz
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Görüntüyü al
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // jsQR ile barkod tarama
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        
        if (code) {
            // Yeni barkod bulundu mu?
            if (!barcodes.includes(code.data)) {
                barcodes.push(code.data);
                updateBarcodeList();
                document.getElementById('status').textContent = 'Barkod bulundu: ' + code.data;
                
                // Gönder butonunu etkinleştir
                document.getElementById('sendButton').disabled = false;
            }
        } else {
            document.getElementById('status').textContent = 'Kamera aktif - Barkod taramaya hazır';
        }
    }
    
    requestAnimationFrame(scanFrame);
}

// Barkod listesini güncelle
function updateBarcodeList() {
    const barcodesElement = document.getElementById('barcodes');
    barcodesElement.innerHTML = '';
    
    barcodes.forEach(barcode => {
        const li = document.createElement('li');
        li.className = 'barcode-item';
        li.textContent = barcode;
        barcodesElement.appendChild(li);
    });
}

// E-posta gönderimi (simülasyon)
function sendEmail() {
    if (barcodes.length === 0) return;
    
    const customerName = document.getElementById('customerName').value || 'Bilinmeyen Müşteri';
    
    // Gerçek bir e-posta gönderme işlemi yerine, alert ile bilgilendirme
    alert(`E-posta gönderiliyor...\n\nMüşteri: ${customerName}\nTaranan Barkodlar:\n${barcodes.join('\n')}`);
    
    // Gerçek uygulamada burada bir API çağrısı olurdu:
    /*
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            customerName: customerName,
            barcodes: barcodes
        })
    });
    */
    
    // Gönderildikten sonra listeyi temizle
    barcodes = [];
    updateBarcodeList();
    document.getElementById('sendButton').disabled = true;
    document.getElementById('status').textContent = 'E-posta gönderildi. Yeni barkodlar için taramaya devam ediliyor.';
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    // Kamera başlat
    startCamera();
    
    // Gönder butonuna tıklama olayı
    document.getElementById('sendButton').addEventListener('click', sendEmail);
});

// Sayfa yenilendiğinde veya kamera izni reddedildiğinde hata yönetimi
window.addEventListener('error', function(e) {
    console.error("Hata:", e.error);
});