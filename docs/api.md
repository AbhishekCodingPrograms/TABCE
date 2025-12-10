# API Reference

Base URL: `http://localhost:8000`

## Endpoints

### 1. System Status
**GET** `/`
*   Returns service health.
```json
{ "status": "online", "service": "TABCE" }
```

### 2. Upload Packshot
**POST** `/upload`
*   **Body**: `multipart/form-data`
    *   `file`: The image file.
    *   `consent`: `true` (Boolean, required).
*   **Response**:
```json
{
  "success": true,
  "id": "uuid-string",
  "url": "/data/packshots/uuid.png"
}
```
*   **Errors**:
    *   `400`: Consent missing or Face detected in product image.

### 3. Generate Campaign
**POST** `/generate`
*   **Body**: JSON
```json
{
  "packshot_id": "uuid-string",
  "campaign_name": "My_Campaign",
  "num_variants": 10
}
```
*   **Response**:
```json
{
  "status": "started",
  "campaign_id": "My_Campaign_12345678"
}
```

### 4. Check Status
**GET** `/status/{campaign_id}`
*   Returns progress or final results.
*   **Response (Complete)**:
```json
{
  "status": "complete",
  "total": 10,
  "top_5": [
    {
      "id": "variant_0",
      "file_path": "...",
      "score": 88.5,
      "meta": { ... }
    }
  ]
}
```

### 5. Access Data
**GET** `/data/{path}`
*   Static file serving for generated images.
