import { spawn } from 'node:child_process';

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
const url = process.argv[2] || 'http://localhost:5174/academics/ai-ds';
const waitMs = Number(process.argv[3] || 15000);

const step = (m) => { console.error('[step]', m); };

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--disable-extensions',
  `--remote-debugging-port=${PORT}`,
  '--user-data-dir=C:/Users/gurun/AppData/Local/Temp/opencode/chrome-repro-2',
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(path) {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}${path}`);
      if (res.ok) return await res.json();
    } catch {}
    await sleep(250);
  }
  throw new Error('CDP not ready');
}

const msgsOut = [];
let ws;
send.id = 0; send.handlers = {};
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++send.id;
    send.handlers[id] = { resolve, reject };
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function connect(wsUrl) {
  ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = (e)=>rej(new Error('ws err')); });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && send.handlers[msg.id]) {
      const h = send.handlers[msg.id];
      delete send.handlers[msg.id];
      msg.error ? h.reject(new Error(msg.error.message)) : h.resolve(msg.result);
      return;
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = (msg.params.args || []).map((a) => a.value ?? a.description ?? '').join(' ');
      msgsOut.push(`[console.${msg.params.type}] ${args}`);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails;
      const txt = d.exception?.description || d.text || '';
      const stack = (d.stackTrace?.callFrames || []).map((f) => `${f.url}:${f.lineNumber}:${f.columnNumber} (${f.functionName||''})`).join('\n    at ');
      msgsOut.push('[EXCEPTION] ' + txt + '\n    ' + stack);
    }
    if (msg.method === 'Log.entryAdded') {
      const l = msg.params.entry;
      if (l.level === 'error') msgsOut.push(`[log.error] ${l.text} ${l.url||''}`);
    }
  };
}

async function main() {
  step('waiting for CDP');
  await getJson('/json/version');
  step('CDP up, creating tab');
  let tab;
  try {
    tab = await getJson('/json/new?about%3Ablank').catch(()=>null);
  } catch {}
  if (!tab) {
    const tabs = await getJson('/json');
    tab = tabs.find((t)=>t.type==='page');
  }
  step('connecting ws: ' + (tab && tab.webSocketDebuggerUrl));
  await connect(tab.webSocketDebuggerUrl);
  step('enabling domains');
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Log.enable');
  step('navigating to ' + url);
  await send('Page.navigate', { url });
  step('waiting ' + waitMs + 'ms');
  await sleep(waitMs);
  step('evaluating snapshot');
  const snap = await send('Runtime.evaluate', { expression: `document.body ? document.body.innerText.slice(0, 700) : ''`, returnByValue: true });
  step('boundary check');
  const b = await send('Runtime.evaluate', { expression: `document.body.innerText.includes('Unable to Load Page') ? 'ERROR_BOUNDARY_SHOWN' : 'NO_ERROR_BOUNDARY'`, returnByValue: true });

  console.log('=== CONSOLE / ERRORS ===');
  console.log(msgsOut.join('\n') || '(none)');
  console.log('=== BOUNDARY ===');
  console.log(b.result?.value);
  console.log('=== BODY TEXT (first 700) ===');
  console.log(snap.result?.value || '(empty)');
}

main().catch((e) => console.error('FAILED:', e)).finally(() => {
  try { ws?.close(); } catch {}
  chrome.kill();
});
