// Global değişkenler
let video = document.getElementById('video');
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
let barcodeList = document.getElementById('barcodeList');
let barcodes = [];
let stream = null;
let scanning = false;

// DOM elementleri
const startCameraBtn = document.getElementById('startCamera');
const scanBarcodeBtn = document.getElementById('scanBarcode');
const sendEmailBtn = document.getElementById('sendEmail');

// Kamerayı başlat
async function startCamera() {
    try {
        // Kamera izni iste
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        video.srcObject = stream;
        startCameraBtn.textContent = 'Kamera Başlatıldı';
        startCameraBtn.disabled = true;
        scanBarcodeBtn.disabled = false;
        
        // Kameranın yüklenmesini bekle
        video.addEventListener('loadeddata', () => {
            console.log("Kamera yüklendi");
        });
    } catch (err) {
        console.error("Kamera erişimi sağlanamadı:", err);
        alert("Kamera erişimi reddedildi. Lütfen izin verdiğinizden emin olun.\nHata: " + err.message);
    }
}

// Barkod tarama
function scanBarcode() {
    if (!stream) {
        alert("Lütfen önce kamerayı başlatın");
        return;
    }

    // Video boyutlarını canvas'a ayarla
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Canvas'a video görüntüsünü çizer
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Resmi imageData olarak al
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    try {
        // jsQR ile barkod tarama
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        
        if (code) {
            // Eğer barkod bulunursa listeye ekle
            addBarcodeToList(code.data);
            console.log("Barkod bulundu:", code.data);
            
            // Taramayı durdur
            scanning = false;
        } else {
            alert("Barkod bulunamadı. Lütfen daha net bir şekilde okutun veya tekrar deneyin.");
            console.log("Barkod bulunamadı");
        }
    } catch (error) {
        console.error("Tarama hatası:", error);
        alert("Tarama sırasında hata oluştu: " + error.message);
    }
}

// Barkodu listeye ekle
function addBarcodeToList(barcodeData) {
    // Aynı barkodun tekrar eklenmesini önle
    if (barcodes.includes(barcodeData)) {
        console.log("Aynı barkod zaten kayıtlı:", barcodeData);
        return;
    }
    
    barcodes.push(barcodeData);
    
    const li = document.createElement('li');
    li.className = 'barcode-item';
    li.textContent = barcodeData;
    barcodeList.appendChild(li);
    
    console.log("Yeni barkod eklendi:", barcodeData);
}

// E-posta gönderme fonksiyonu
async function sendEmail() {
    const customerName = document.getElementById('customerName').value.trim();
    
    if (!customerName) {
        alert("Lütfen müşteri adını girin.");
        return;
    }
    
    if (barcodes.length === 0) {
        alert("Lütfen en az bir barkod tarayın.");
        return;
    }
    
    // E-posta gönderme işlemi (bu örnek bir simülasyon)
    const emailContent = `
Müşteri Adı: ${customerName}
Taranan Barkodlar:
${barcodes.join('\n')}
`;
    
    try {
        // Gerçek e-posta gönderimi için backend servisi gerekebilir
        alert("E-posta gönderme işlemi simüle edildi.\nGerçek uygulamada bu veriler bir backend tarafından e-posta olarak gönderilir.");
        
        console.log("Gönderilecek e-posta içeriği:");
        console.log(emailContent);
        
        // Gönderilen barkodları sıfırla
        barcodes = [];
        barcodeList.innerHTML = '';
        
    } catch (error) {
        console.error("E-posta gönderilirken hata oluştu:", error);
        alert("E-posta gönderilirken bir hata oluştu.");
    }
}

// Otomatik tarama modu
function startAutoScan() {
    if (!scanning && stream) {
        scanning = true;
        scanBarcode();
        
        // 2 saniyede bir otomatik tarama yap
        setTimeout(startAutoScan, 2000);
    }
}

// Event listener'lar
startCameraBtn.addEventListener('click', startCamera);
scanBarcodeBtn.addEventListener('click', () => {
    if (scanning) {
        scanning = false;
        scanBarcodeBtn.textContent = "Barkod Tara";
    } else {
        scanBarcode();
    }
});
sendEmailBtn.addEventListener('click', sendEmail);

// Başlangıçta tarama butonunu devre dışı bırak
scanBarcodeBtn.disabled = true;

// Kamera durumu değiştiğinde kontrol et
video.addEventListener('play', () => {
    console.log("Kamera oynatılıyor");
});