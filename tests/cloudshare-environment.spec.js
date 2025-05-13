import { test, expect } from '@playwright/test';

test.describe('CloudeShare Login and Tabs Test', () => {    
    test.setTimeout(180000);

    test('should login and validate 4 types of tabs and remote access buttons', async ({ page }) => {
        await test.step('Navigate to login page', async () => {
            await page.goto('https://use.cloudshare.com/Class/COW8L9-2hdSDH5gS-H3SZFkw2');
        });

        await test.step('Login to CloudShare', async () => {
            await page.getByRole('textbox', { name: 'Email *' }).fill('shaked2020@gmail.com');
            await page.getByRole('textbox', { name: 'Passphrase *' }).fill('Betty the Jealous Flamingo');
            await page.getByRole('button', { name: 'Login' }).click();
            await page.waitForURL();
            await expect(page.getByText(' Platform Automation Class ')).toBeVisible({ timeout: 120000});
        });

        await test.step('Validate Overview tab', async () => {
            await checkTabContent({ page, tabTitle: 'Overview', expectedContent: 'Platform Automation BP' });
        });

        await test.step('Validate VM List tab', async () => {
            await checkTabContent({ page, tabTitle: 'VM List', expectedContent: ' 2 Virtual Machines ' });
        });

        await test.step('Validate Enxternal URL tab', async () => {
            await checkExternalURLTab({ page, tabTitle: 'External URL' });
        });

        await test.step('Validate Ubuntu VM tab', async () => {
            await checkVMTab({ page, tabTitle: 'Ubuntu 22.04 LTS Desktop', expectedButtons: [' SSH', ' CON']});
        });

        await test.step('Validate Windows VM tab', async () => {
            await checkVMTab({ page, tabTitle: 'Windows Server 2022 Standard', expectedButtons: [' RDP', ' RDP10', ' CON']});
        });
    });
});


async function activateTab({ page, tabTitle }) {
    const tab = page.locator(`[data-automation2="viewer-tab-${tabTitle}"]`);
    try {
        await tab.waitFor({ state: 'visible', timeout: 20000 });
        await expect(tab).toBeVisible();
        await tab.click();  
        await expect(tab).toHaveClass(/active/);
    } catch (error) {
        throw new Error(`Failed to activate tab "${tabTitle}": ${error}`);
    }
}

async function checkExternalURLTab({ page, tabTitle }) {
    await activateTab({ page, tabTitle });
    const iframe = page.locator('iframe[src*="disney"]');
    await expect(iframe).toBeVisible();

}

async function checkVMTab({ page, tabTitle, expectedButtons }){
    await activateTab({ page, tabTitle });

    const protocolSelector = page.locator('cs-env-viewer-panel-protocol-selector');

    // waiting for the VM to be ready
    await page.waitForSelector('cs-action-button[ng-reflect-text="Disconnect"]', {
        state: 'hidden', 
        timeout: 120000
    });

    for (const protocolButton of expectedButtons) {
        const button = protocolSelector.getByText(protocolButton, { exact: true });
        try {
            await expect(button).toBeVisible();
        } catch (error) {
            throw new Error(`${protocolButton} was not found : ${error}`);
        }
    }
}

async function checkTabContent({ page, tabTitle, expectedContent }) {
    await activateTab({ page, tabTitle });
    await expect(page.locator(`text=${expectedContent}`)).toBeVisible({ timeout: 120000 });
}


