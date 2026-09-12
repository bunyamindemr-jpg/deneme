let barcodeList = document.getElementById('barcodeList');
let barcodes = [];
let stream = null;
let scanning = false;

// DOM elementleri
const startCameraBtn = document.getElementById('startCamera');
// Kamerayı başlat
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
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
        alert("Kamera erişimi reddedildi. Lütfen izin verdiğinizden emin olun.");
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
    if (barcodes.includes(barcodeData)) return;
    if (barcodes.includes(barcodeData)) {
        console.log("Aynı barkod zaten kayıtlı:", barcodeData);
        return;
    }
    
    barcodes.push(barcodeData);
    
    li.className = 'barcode-item';
    li.textContent = barcodeData;
    barcodeList.appendChild(li);
    
    console.log("Yeni barkod eklendi:", barcodeData);
}

// E-posta gönderme fonksiyonu
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
scanBarcodeBtn.addEventListener('click', scanBarcode);
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
scanBarcodeBtn.disabled = true;

// Kamera durumu değiştiğinde kontrol et
video.addEventListener('play', () => {
    console.log("Kamera oynatılıyor");
});
