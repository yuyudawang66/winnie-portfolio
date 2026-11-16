import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const home=readFileSync(new URL('./page.tsx',import.meta.url),'utf8');
const reader=readFileSync(new URL('./reader.tsx',import.meta.url),'utf8');

test('the legacy #works hash does not open the project panel on page load',()=>{
 assert.doesNotMatch(home,/location\.hash\s*===\s*['"]#works['"]/);
});

test('project reader return links explicitly request the works panel',()=>{
 assert.equal((reader.match(/href="\.\/\?panel=works"/g)||[]).length,2);
});
