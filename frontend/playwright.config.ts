import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    workers: 1,
    fullyParallel: false,

    use: {
        baseURL: "http://localhost:5174",
        ...devices["Desktop Chrome"],
    },

    webServer: [
        {
            command: "npm run dev:e2e",
            cwd: "../backend",
            url: "http://localhost:11012/api/health",
            reuseExistingServer: false,
            timeout: 30_000,
        },
        {
            command: "npm run dev:e2e",
            url: "http://localhost:5174",
            reuseExistingServer: false,
            timeout: 30_000,
        },
    ],
});
