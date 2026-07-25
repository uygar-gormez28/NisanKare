# NişanKare - Google Drive OAuth 2.0 Kurulum Rehberi

Bu rehber, fotoğrafların **doğrudan kişisel Google Drive hesabınıza** sorunsuz şekilde yüklenebilmesi için gerekli 4 adet ortam değişkenini (`.env.local`) adım adım nasıl alacağınızı anlatır.

---

## 1. Adım: Google Drive Klasör ID'sini Alma (`GOOGLE_DRIVE_FOLDER_ID`)

1. Bilgisayarınızda veya telefonunuzda [Google Drive](https://drive.google.com)'a girin.
2. Fotoğrafların birikmesini istediğiniz yeni bir klasör oluşturun (örneğin: **"Nişan Fotoğrafları - 20 Ağustos"**).
3. Klasörün içine girin ve tarayıcının adres çubuğundaki URL'ye bakın:
   `https://drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0j...`
4. `folders/` kelimesinden sonra gelen rastgele karakter dizisi sizin **`GOOGLE_DRIVE_FOLDER_ID`** bilginizdir.

---

## 2. Adım: Google Cloud Console'da Proje ve Client Credentials Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com)'a gidin ve Google hesabınızla giriş yapın.
2. Üst menüden **"Select a project" -> "New Project"** diyerek **"NişanKare"** adında ücretsiz bir proje oluşturun.
3. Sol menüden **APIs & Services -> Library** sekmesine gidin.
4. Arama kutusuna **"Google Drive API"** yazın, tıklayın ve **"Enable" (Etkinleştir)** butonuna basın.

### OAuth Consent Screen (Yetkilendirme Ekranı) Ayarı:
5. Sol menüden **APIs & Services -> OAuth consent screen** sekmesine gelin.
6. **User Type** seçeneğini **"External"** seçip **Create**'e basın.
7. **App name**: `NişanKare`, **User support email**: Kendi e-postanız. **Developer contact information**: Kendi e-postanız yazıp kaydedin.
8. **Scopes** adımını değiştirmeden geçin (Save and Continue).
9. **Test users** adımına gelin ve **"+ ADD USERS"** butonuna basarak kendi Google e-posta adresinizi ekleyin (Bu adım önemlidir!).

### Client ID ve Client Secret Alımı:
10. Sol menüden **APIs & Services -> Credentials** sekmesine gidin.
11. **"+ CREATE CREDENTIALS" -> "OAuth client ID"** seçeneğine tıklayın.
12. **Application type**: **"Web application"** seçin.
13. **Name**: `NişanKare Web App`
14. **Authorized redirect URIs** kısmına `https://developers.google.com/oauthplayground` ekleyin.
15. **CREATE** butonuna basın. Ekrana çıkan:
    - **Client ID** -> `GOOGLE_CLIENT_ID`
    - **Client Secret** -> `GOOGLE_CLIENT_SECRET`
    bilgilerini kopyalayın.

---

## 3. Adım: Süresiz Refresh Token Alma (`GOOGLE_REFRESH_TOKEN`)

1. Tarayıcınızda [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground) adresini açın.
2. Sağ üstteki ⚙️ (Ayarlar/Çark) simgesine tıklayın:
   - **"Use your own OAuth credentials"** kutusunu işaretleyin.
   - **OAuth Client ID**: (2. Adımdaki Client ID)
   - **OAuth Client Secret**: (2. Adımdaki Client Secret)
3. Sol taraftaki listeden **"Drive API v3"** başlığını bulun ve genişletin.
4. `https://www.googleapis.com/auth/drive.file` iznini işaretleyin.
5. **"Authorize APIs"** butonuna basın. Kendi Google hesabınızı seçip izin verin ("Unverified App" uyarısı çıkarsa Advanced -> Go to NişanKare deyin).
6. Playground ekranına geri döndüğünüzde **Step 2** otomatik açılacaktır.
7. **"Exchange authorization code for tokens"** butonuna basın.
8. Sağdaki JSON çıktısında görünen **`refresh_token`** değerini kopyalayın (`GOOGLE_REFRESH_TOKEN`).

---

## 4. Adım: `.env.local` Dosyasını Doldurma

Proje kök dizinindeki `.env.local` dosyasını açın ve aldığınız bilgileri yapıştırın:

```env
GOOGLE_CLIENT_ID="xxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxx"
GOOGLE_REFRESH_TOKEN="1//04xxxxxxx"
GOOGLE_DRIVE_FOLDER_ID="1A2b3C4d5E6f7G8h9I0j"
```

---

## 5. Adım: Uygulamayı Çalıştırma ve Vercel'e Dağıtma

### Yerel Ortamda Test Etmek İçin:
```bash
npm run dev
```
Tarayıcıda `http://localhost:3000` adresine gidin. Fotoğrafları seçip yüklemeyi test edin.

### Vercel Ortamına Dağıtım (Deploy):
1. Projeyi GitHub'a yükleyin veya Vercel CLI ile `vercel` komutunu çalıştırın.
2. Vercel Dashboard -> Project Settings -> Environment Variables kısmına yukarıdaki 4 adet `.env.local` değişkenini ekleyin.
3. Projeniz canlıya alındıktan sonra QR kodu oluşturup masalara yerleştirebilirsiniz! 🎉
