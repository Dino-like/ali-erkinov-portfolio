import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import worker from './worker.mjs';
const db = new DatabaseSync(':memory:');db.exec(readFileSync(new URL('./migrations/0001_notes.sql',import.meta.url),'utf8'));
export const adapter = db => ({prepare(sql){let values=[];return {bind(...args){values=args;return this;},async all(){return {results:db.prepare(sql).all(...values)};},async run(){return {meta:{changes:db.prepare(sql).run(...values).changes}};}};}});
const env={DB:adapter(db),ALLOWED_ORIGINS:'http://localhost:4180',IP_SALT:'local-test-only'};
function req(body,origin='http://localhost:4180',ip='test-ip'){return new Request('http://localhost:4180/api/notes',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,'CF-Connecting-IP':ip},body:JSON.stringify({text:'Снять портреты в Петербурге',name:'Гость',color:'mint',startedAt:Date.now()-3000,website:'',...body})});}
assert.equal((await worker.fetch(req({},'https://example.com'),env)).status,403);
assert.equal((await worker.fetch(req({text:'a'}),env)).status,400);
assert.equal((await worker.fetch(req({website:'spam'}),env)).status,400);
assert.equal((await worker.fetch(req({startedAt:Date.now()}),env)).status,400);
const post=await worker.fetch(req({}),env);assert.equal(post.status,201);const result=await post.json();assert.ok(result.note.id);assert.equal(result.note.ip_hash,undefined);
assert.equal((await worker.fetch(req({text:'Ещё один стикер'}),env)).status,429);
const get=await worker.fetch(new Request('http://localhost:4180/api/notes'),env);const list=await get.json();assert.equal(list.notes.length,1);assert.equal(list.notes[0].text,'Снять портреты в Петербурге');assert.equal(list.notes[0].ip_hash,undefined);
const cors=await worker.fetch(new Request('http://localhost:4180/api/notes',{method:'OPTIONS',headers:{Origin:'http://localhost:4180'}}),env);assert.equal(cors.status,204);assert.equal(cors.headers.get('Access-Control-Allow-Origin'),'http://localhost:4180');
console.log('Passed: shared persistence, validation, spam trap, rate limit, CORS, privacy.');
