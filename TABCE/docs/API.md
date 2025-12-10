# TABCE API Documentation

Base URL: `http://localhost:8000`

## Endpoints

### 1. Upload Packshot
**POST** `/upload/packshot`
*   **Body**: `multipart/form-data` with `file`.
*   **Response**:
    ```json
    {
        "id": "uuid_filename.jpg",
        "processed_url": "path/to/processed.png"
    }
    ```

### 2. Generate Variants
**POST** `/generate`
*   **Body**: JSON
    ```json
    {
        "product_id": "uuid_from_step_1",
        "theme": "diwali",
        "makeup_intensity": 70,
        "consent_obtained": true
    }
    ```
*   **Response**:
    ```json
    {
        "job_id": "job-uuid",
        "status": "processing"
    }
    ```

### 3. Check Status
**GET** `/status/{job_id}`
*   **Response**:
    ```json
    {
        "status": "completed",
        "variants": ["/download/job-id/variant1.jpg", ...],
        "count": 5
    }
    ```

### 4. Download Asset
**GET** `/download/{job_id}/{filename}`
*   Returns the image file.
