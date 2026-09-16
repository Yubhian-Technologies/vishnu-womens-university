import { readFileSync, writeFileSync } from 'node:fs';

const file = 'src/pages/Academics/DepartmentDetail.tsx';
let lines = readFileSync(file, 'utf8').split('\n');
// lines is 0-indexed; line numbers in editor are 1-indexed.
// Block to move: editor lines 371..454 inclusive -> indices 370..453
const startIdx = 370; // editor line 371
const endIdx = 453;   // editor line 454
const block = lines.slice(startIdx, endIdx + 1);

// Apply null-safe fixes within the moved block
const joined = block.join('\n')
  .replace('activeProgram.placementYears', 'activeProgram?.placementYears')
  .replace('activeProgram.shortName', 'activeProgram?.shortName');
const fixedBlock = joined.split('\n');

// Insertion point: after the scroll-spy effect closing line
// "  }, [progLoading, deptLoading, activeProgram?.slug]);" (editor line 295 -> index 294)
const insertAfterIdx = 294;

// Remove the original block
lines.splice(startIdx, endIdx - startIdx + 1);

// Now insert the fixed block after insertAfterIdx (indices may have shifted only if
// removal happened before insertion point — it didn't: startIdx > insertAfterIdx)
const out = [
  ...lines.slice(0, insertAfterIdx + 1),
  '',
  ...fixedBlock,
  ...lines.slice(insertAfterIdx + 1),
];

writeFileSync(file, out.join('\n'));
console.log('Moved block of', block.length, 'lines from editor 371-454 to after line 295.');
console.log('Verify no duplicate declarations remain below.');
