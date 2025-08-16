import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const tsPath = path.join(process.cwd(), 'lib/nextService.ts');
const tsSource = fs.readFileSync(tsPath, 'utf8');
const jsSource = ts.transpileModule(tsSource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 }
}).outputText;
const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(jsSource).toString('base64');
const { nextServiceDate, countdownParts, upcomingSundays } = await import(moduleUrl);

test('nextServiceDate returns Sunday at 10:00', () => {
  const d = nextServiceDate();
  assert.equal(d.getDay(), 0);
  assert.equal(d.getHours(), 10);
  assert.equal(d.getMinutes(), 0);
});

test('countdownParts computes days, hours, minutes', () => {
  const future = new Date(Date.now() + (3*24*60*60 + 2*60*60 + 15*60)*1000);
  const parts = countdownParts(future);
  assert.deepEqual(parts, { days: 3, hours: 2, minutes: 15 });
});

test('upcomingSundays creates events of two hours', () => {
  const events = upcomingSundays(3);
  assert.equal(events.length, 3);
  for (const ev of events) {
    assert.equal(ev.date.getDay(), 0);
    assert.equal(ev.date.getHours(), 10);
    assert.equal(ev.end.getTime() - ev.date.getTime(), 2 * 60 * 60 * 1000);
  }
});
