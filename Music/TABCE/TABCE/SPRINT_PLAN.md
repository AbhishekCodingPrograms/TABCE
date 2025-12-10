# 7-Day Sprint Plan (Sprint 1)

**Sprint Goal**: Finalize the "Creative Studio" MVP, stabilizing the integration of AI models and enabling file export.

| Day | Task ID | Owner | Description | Acceptance Criteria |
|-----|---------|-------|-------------|---------------------|
| **Day 1** | TASK-004 | Frontend Dev | **Fix Face Mesh Alignment** (Completed) | Mesh points align perfectly with eyes/lips regardless of window size. |
| **Day 2** | TASK-005 | ML Engineer | **Integrate MobileNet** (Completed) | Uploaded product is correctly identified (e.g., "groom", "lipstick") in logs/UI. |
| **Day 3** | TASK-009 | UX Des | **Micro-interactions & Polish** | Loaders appear during AI processing; Buttons react to hover; Animations are smooth (60fps). |
| **Day 4** | TASK-008 | Frontend Dev | **Export Functionality (Part 1)** | "Export All" button generates a basic JSON dump of the creative config. |
| **Day 5** | TASK-008 | Frontend Dev | **Export Functionality (Part 2 - ZIP)** | "Export All" downloads a ZIP containing generated PNGs of the Top 3 variants. |
| **Day 6** | TASK-QA | QA Lead | **End-to-End Testing** | Full walkthrough from Upload -> Generate -> Export works without console errors. |
| **Day 7** | DEMO | PM | **Sprint Demo & Retro** | Working demo presented to stakeholders. |

## Roles
*   **PM**: Project Manager (Planning & Unblocking)
*   **Frontend Dev**: UI/UX Implementation (React)
*   **ML Engineer**: TensorFlow Model Integration
*   **QA Lead**: Validation
