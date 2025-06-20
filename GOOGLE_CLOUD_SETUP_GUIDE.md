# 🎯 GUÍA COMPLETA: CONFIGURACIÓN GOOGLE CLOUD PARA ANÁLISIS HÍBRIDO

## 📋 PASO A PASO PARA CONFIGURAR GOOGLE CLOUD

### 1️⃣ CREAR PROYECTO EN GOOGLE CLOUD

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea una cuenta si no tienes (incluye $300 de créditos gratis)
3. Crea un nuevo proyecto:
   - Nombre: `genius-script-video-analysis`
   - Anota el **Project ID** (lo necesitarás)

### 2️⃣ HABILITAR APIS NECESARIAS

En Google Cloud Console, ve a "APIs & Services" > "Library" y habilita:
- ✅ **Video Intelligence API**
- ✅ **Cloud Storage API**

### 3️⃣ CREAR SERVICE ACCOUNT

1. Ve a "IAM & Admin" > "Service Accounts"
2. Clic en "Create Service Account"
3. Nombre: `video-analysis-service`
4. Descripción: `Service account for video analysis`
5. Asigna estos roles:
   - **Video Intelligence API User**
   - **Storage Object Admin**
   - **Storage Bucket Reader**

### 4️⃣ GENERAR CREDENCIALES JSON

1. En la lista de Service Accounts, clic en el que creaste
2. Ve a la pestaña "Keys"
3. Clic "Add Key" > "Create new key"
4. Selecciona "JSON"
5. **DESCARGA EL ARCHIVO JSON** (lo necesitarás para Vercel)

### 5️⃣ CREAR BUCKET DE STORAGE

1. Ve a "Cloud Storage" > "Buckets"
2. Clic "Create Bucket"
3. Nombre: `genius-script-temp-videos` (debe ser único globalmente)
4. Región: Elige la más cercana a ti
5. Storage class: "Standard"
6. Access control: "Uniform"

### 6️⃣ CONFIGURAR VARIABLES EN VERCEL

En tu dashboard de Vercel:

1. **GOOGLE_CLOUD_PROJECT_ID**
   - Valor: Tu Project ID de Google Cloud

2. **GOOGLE_CLOUD_STORAGE_BUCKET**
   - Valor: `genius-script-temp-videos` (o el nombre que elegiste)

3. **GOOGLE_APPLICATION_CREDENTIALS**
   - Valor: **TODO EL CONTENIDO** del archivo JSON descargado
   - ⚠️ Copia y pega todo el JSON completo

### 7️⃣ VERIFICAR CONFIGURACIÓN

Las variables deben verse así en Vercel:
```
GOOGLE_CLOUD_PROJECT_ID = tu-project-id-123
GOOGLE_CLOUD_STORAGE_BUCKET = genius-script-temp-videos
GOOGLE_APPLICATION_CREDENTIALS = {"type":"service_account","project_id":"tu-project"...}
GEMINI_API_KEY = tu-gemini-key (ya configurada)
```

## 💰 COSTOS ESTIMADOS

**Video Intelligence API:**
- Primeros 1,000 minutos/mes: **GRATIS**
- Después: ~$0.10 por minuto

**Cloud Storage:**
- Primeros 5GB: **GRATIS**
- Videos temporales se eliminan automáticamente

**Total estimado:** $0-5/mes para uso moderado

## 🚀 DESPUÉS DE CONFIGURAR

1. Todas las variables configuradas en Vercel
2. Hacer push al repositorio
3. Vercel detectará automáticamente los cambios
4. ¡API híbrida funcionando!

¿Necesitas ayuda con algún paso específico?

