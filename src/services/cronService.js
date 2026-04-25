const cron = require('node-cron');
const db = require('../config/dbConnect');
const emailService = require('./emailService');

class CronService {
    static init() {
        console.log('🚀 License Sentinel Service Initialized. Monitoring expirations...');

        // Run every day at midnight (00:00)
        cron.schedule('0 0 * * *', async () => {
            console.log('⏰ Running daily license expiry check...');
            await this.checkLicenseExpirations();
        });

        // For immediate testing (development only)
        // cron.schedule('*/5 * * * *', () => console.log('Ping: License Sentinel is active.'));
    }

    static async checkLicenseExpirations() {
        try {
            // Find restaurants where license expires in exactly 30 days
            // or 7 days, or today.
            const query = `
                SELECT name, email, license_expiry 
                FROM restaurants 
                WHERE email IS NOT NULL 
                AND (
                    DATEDIFF(license_expiry, CURDATE()) = 30 OR 
                    DATEDIFF(license_expiry, CURDATE()) = 7  OR 
                    DATEDIFF(license_expiry, CURDATE()) = 0
                )
            `;

            const [expiringSoon] = await db.query(query);

            if (expiringSoon.length === 0) {
                console.log('✅ No licenses expiring in the target window today.');
                return;
            }

            console.log(`⚠️ Found ${expiringSoon.length} restaurants with upcoming expirations. Sending alerts...`);

            for (const rest of expiringSoon) {
                const expiryDateStr = new Date(rest.license_expiry).toLocaleDateString();
                await emailService.sendLicenseExpiryAlert(rest.email, rest.name, expiryDateStr);
            }

        } catch (err) {
            console.error('❌ Error during license expiry check:', err.message);
        }
    }
}

module.exports = CronService;
