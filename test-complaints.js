const db = require('./src/config/dbConnect');

async function test() {
    try {
        const [complaintsRaw] = await db.query(`
      SELECT c.*, r.name AS restaurant_name 
      FROM complaints c
      JOIN restaurants r ON c.restaurant_id = r.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

        console.log("Raw complaints rows:", complaintsRaw.length);

        const complaints = complaintsRaw.map(c => {
            let parsedImages = [];
            if (c.images) {
                try {
                    parsedImages = typeof c.images === 'string' ? JSON.parse(c.images) : c.images;
                } catch (e) {
                    console.error("Failed to parse complaint images for ID:", c.id, " - Error:", e);
                }
            }
            return {
                ...c,
                images: parsedImages
            };
        });

        console.log("Successfully parsed complaints!", complaints.map(c => c.images));
        process.exit(0);
    } catch (err) {
        console.error("DB error:", err);
        process.exit(1);
    }
}
test();
