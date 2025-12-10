# QA Checklist

## Functional Testing
- [ ] **Packshot Upload**: Uploading a JPG/PNG works and returns an ID.
- [ ] **Background Removal**: The processed image in `/data/packshots` has a transparent background.
- [ ] **Synthetic Gen**: 5 model variants are created in the job folder.
- [ ] **Makeup Application**: Lip color changes based on config intensity.
- [ ] **Composition**: Text is overlayed correctly on the canvas.
- [ ] **File Size**: All generated JPGs are under 500KB.

## API Testing
- [ ] `/generate` returns 400 if `consent_obtained` is false.
- [ ] `/status` correctly reports "processing" then "completed".

## UI/UX
- [ ] Frontend successfully displays the spinner while job is processing.
- [ ] Download buttons link to the correct backend URL.
