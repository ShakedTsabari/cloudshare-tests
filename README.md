# Playwright Test that:
1. Logs in using the provided credentials. (Keep in mind the environment may take a few minutes to fully load, as the VMs might be suspended.)
2. Verifies that all four tab types are present and open correctly when clicked.
3. Confirms the VM tabs display the following remote access protocol buttons in the side panel:
Windows: RDP, RDP10, CON
Ubuntu: SSH, CON

# Requirements:

Node.js,

Playwright (@playwright/test),

Internet access (for logging in and testing)

# How to Run the Test

Install dependencies:
npm install

Run the test:
npx playwright test
