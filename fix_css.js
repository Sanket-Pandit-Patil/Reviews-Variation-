const fs = require('fs');
const path = require('path');

const indexPath = 's:/programing/FE_Intern_Task/client/src/index.css';
const repliesPath = 's:/programing/FE_Intern_Task/client/src/styles/replies.css';

try {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    let repliesContent = fs.readFileSync(repliesPath, 'utf8');

    const marker = '.reply-actions {';
    const markerIndex = indexContent.lastIndexOf(marker);

    if (markerIndex !== -1) {
        const closeBraceIndex = indexContent.indexOf('}', markerIndex);
        if (closeBraceIndex !== -1) {
            // Keep everything up to and including the closing brace
            const cleanContent = indexContent.substring(0, closeBraceIndex + 1);
            const newContent = cleanContent + '\n\n' + repliesContent;
            fs.writeFileSync(indexPath, newContent, 'utf8');
            console.log('Fixed index.css');
        } else {
            console.log('Could not find closing brace for reply-actions');
        }
    } else {
        console.log('Could not find reply-actions block');
    }
} catch (err) {
    console.error('Error:', err);
}
