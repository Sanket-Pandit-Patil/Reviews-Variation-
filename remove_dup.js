const fs = require('fs');
const path = require('path');

const filePath = 's:/programing/FE_Intern_Task/client/src/components/ReviewsFeed.jsx';

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    // Lines to remove are 323 to 352 (1-indexed)
    // Arrays are 0-indexed, so we remove index 322 to 351
    const startIdx = 322;
    const endIdx = 351; // inclusive

    // Verify content before removing (sanity check)
    if (lines[startIdx].includes('{/* Threaded Replies Block */}') &&
        lines[endIdx].trim() === ')}') {

        console.log('Found duplicate block. Removing...');
        lines.splice(startIdx, endIdx - startIdx + 1);

        const newContent = lines.join('\n');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Successfully removed duplicate lines.');
    } else {
        console.log('Content mismatch. NOT removing to avoid errors.');
        console.log('Line 323:', lines[startIdx]);
        console.log('Line 352:', lines[endIdx]);
    }
} catch (err) {
    console.error('Error:', err);
}
