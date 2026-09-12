// Global değişkenler
let video = document.getElementById('video');
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
let barcodeList = document.getElementById('barcodeList');
let barcodes = [];
let stream = null;

// DOM elementleri
const startCameraBtn = document.getElementById('startCamera');
const scanBarcodeBtn = document.getElementById('scanBarcode');
const sendEmailBtn = document.getElementById('sendEmail');

// Kamerayı başlat
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        startCameraBtn.textContent = 'Kamera Başlatıldı';
        startCameraBtn.disabled = true;
        scanBarcodeBtn.disabled = false;
    } catch (err) {
        console.error("Kamera erişimi sağlanamadı:", err);
        alert("Kamera erişimi reddedildi. Lütfen izin verdiğinizden emin olun.");
    }
}

// Barkod tarama
function scanBarcode() {
    // Video boyutlarını canvas'a ayarla
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Canvas'a video görüntüsünü çizer
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Resmi imageData olarak al
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // jsQR ile barkod tarama
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
    });
    
    if (code) {
        // Eğer barkod bulunursa listeye ekle
        addBarcodeToList(code.data);
    } else {
        alert("Barkod bulunamadı. Lütfen tekrar deneyin.");
    }
}

// Barkodu listeye ekle
function addBarcodeToList(barcodeData) {
    // Aynı barkodun tekrar eklenmesini önle
    if (barcodes.includes(barcodeData)) return;
    
    barcodes.push(barcodeData);
    
    const li = document.createElement('li');
    li.className = 'barcode-item';
    li.textContent = barcodeData;
    barcodeList.appendChild(li);
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

// Event listener'lar
startCameraBtn.addEventListener('click', startCamera);
scanBarcodeBtn.addEventListener('click', scanBarcode);
sendEmailBtn.addEventListener('click', sendEmail);

// Başlangıçta tarama butonunu devre dışı bırak
scanBarcodeBtn.disabled = true;