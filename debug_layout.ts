import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Layout } from './src/lib/models/layout';
import { User } from './src/lib/models/user';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Available environment variables:', Object.keys(process.env));
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

async function debugLayouts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected!');

        const layouts = await Layout.find({});
        console.log(`\nFound ${layouts.length} layouts in database:`);

        for (const layout of layouts) {
            const user = await User.findById(layout.userId);
            console.log(`\n--- Layout for User: ${user ? user.email : 'Unknown (ID: ' + layout.userId + ')'} ---`);
            console.log(`ID: ${layout._id}`);
            console.log(`Tile Count: ${layout.tiles.length}`);

            console.log('Tiles:');
            layout.tiles.forEach((tile: any, index: number) => {
                console.log(`  ${index + 1}. [${tile.type}] (x:${tile.x}, y:${tile.y}, w:${tile.w}, h:${tile.h})`);
                if (tile.type === 'profile') {
                    console.log(`     Content: Name=${tile.content.name}, Role=${tile.content.role}`);
                } else if (tile.type === 'link') {
                    console.log(`     Content: Label=${tile.content.label}, URL=${tile.content.url}`);
                } else if (tile.type === 'text') {
                    console.log(`     Content: Text=${tile.content.text?.substring(0, 20)}...`);
                }
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

debugLayouts();
