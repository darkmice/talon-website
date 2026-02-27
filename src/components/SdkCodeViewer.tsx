import { useState } from 'react';

interface LangConfig {
  file: string;
  badge: string;
  code: string;
  runCmd: string;
  output: string;
}

const langs: Record<string, LangConfig> = {
  Go: {
    file: 'main.go',
    badge: 'Go 1.21+',
    code: `<span class="tc-kw">package</span> main

<span class="tc-kw">import</span> (
    <span class="tc-str">"fmt"</span>
    <span class="tc-str">"log"</span>
    talon <span class="tc-str">"github.com/darkmice/talon/sdk/go"</span>
)

<span class="tc-ty">func</span> <span class="tc-fn">main</span>() {
    <span class="tc-cm">// 打开嵌入式数据库（零网络开销）</span>
    db, err := talon.<span class="tc-ac">Open</span>(<span class="tc-str">"./my_data"</span>)
    <span class="tc-kw">if</span> err != <span class="tc-num">nil</span> { log.Fatal(err) }
    <span class="tc-kw">defer</span> db.<span class="tc-ac">Close</span>()

    <span class="tc-cm">// SQL 引擎</span>
    db.<span class="tc-ac">RunSQL</span>(<span class="tc-str">\`CREATE TABLE users (
        id INT PRIMARY KEY, name TEXT, score REAL
    )\`</span>)
    db.<span class="tc-ac">RunSQL</span>(<span class="tc-str">\`INSERT INTO users VALUES (1, 'Alice', 95.5)\`</span>)

    <span class="tc-cm">// KV 引擎</span>
    db.<span class="tc-ac">KvSet</span>([]<span class="tc-ty">byte</span>(<span class="tc-str">"session:u1"</span>), []<span class="tc-ty">byte</span>(<span class="tc-str">\`{"state":"active"}\`</span>), <span class="tc-num">3600</span>)

    <span class="tc-cm">// talon_execute JSON 通用入口</span>
    result, _ := db.<span class="tc-ac">Execute</span>(<span class="tc-str">\`{
        "module": "sql", "action": "query",
        "params": {"sql": "SELECT * FROM users LIMIT 10"}
    }\`</span>)
    fmt.Println(result)
}`,
    runCmd: '$ go run main.go',
    output: `<span class="tc-info">[INFO]</span> Talon opened: ./my_data
<span class="tc-info">[INFO]</span> Storage engine: fjall LSM-Tree
<span class="tc-cm">SQL INSERT:</span> 1 row affected
<span class="tc-cm">KV SET:</span> session:u1 <span class="tc-ok">OK</span> (TTL=3600s)
<span class="tc-cm">Execute result:</span>
<span class="tc-ac">{"ok":true,"data":[[1,"Alice",95.5]]}</span>

<span class="tc-ok">Process finished with exit code 0</span>`,
  },
  Rust: {
    file: 'main.rs',
    badge: 'Rust 2021',
    code: `<span class="tc-kw">use</span> talon::{Store, sql, kv::KvEngine, vector::VectorEngine};

<span class="tc-ty">fn</span> <span class="tc-fn">main</span>() -> <span class="tc-ty">Result</span>&lt;(), talon::Error&gt; {
    <span class="tc-cm">// 打开存储（嵌入式，零开销）</span>
    <span class="tc-kw">let</span> store = Store::<span class="tc-ac">open</span>(<span class="tc-str">"./my_data"</span>)?;

    <span class="tc-cm">// SQL 引擎</span>
    sql::<span class="tc-ac">run</span>(&store, <span class="tc-str">"CREATE TABLE users (
        id INT PRIMARY KEY, name TEXT, score REAL
    )"</span>)?;
    sql::<span class="tc-ac">run</span>(&store, <span class="tc-str">"INSERT INTO users VALUES (1, 'Alice', 95.5)"</span>)?;
    <span class="tc-kw">let</span> rows = sql::<span class="tc-ac">run</span>(&store, <span class="tc-str">"SELECT * FROM users"</span>)?;
    println!(<span class="tc-str">"{:?}"</span>, rows);

    <span class="tc-cm">// KV 引擎</span>
    <span class="tc-kw">let</span> kv = KvEngine::<span class="tc-ac">open</span>(&store)?;
    kv.<span class="tc-ac">set</span>(<span class="tc-str">b"session:u1"</span>, <span class="tc-str">b"{\\"state\\":\\"active\\"}"</span>, <span class="tc-num">3600</span>)?;
    <span class="tc-kw">let</span> val = kv.<span class="tc-ac">get</span>(<span class="tc-str">b"session:u1"</span>)?;
    println!(<span class="tc-str">"KV: {:?}"</span>, val);

    <span class="tc-ty">Ok</span>(())
}`,
    runCmd: '$ cargo run --release',
    output: `<span class="tc-info">[INFO]</span> Compiling talon-demo v0.1.0
<span class="tc-info">[INFO]</span> Finished release [optimized]
<span class="tc-info">[INFO]</span> Running \`target/release/demo\`
[[1, "Alice", 95.5]]
KV: Some(b"{\\"state\\":\\"active\\"}")

<span class="tc-ok">Process finished with exit code 0</span>`,
  },
  Python: {
    file: 'main.py',
    badge: 'Python 3.9+',
    code: `<span class="tc-kw">import</span> ctypes, json

<span class="tc-cm"># 加载 Talon C ABI 动态库</span>
lib = ctypes.CDLL(<span class="tc-str">"./libtalon.dylib"</span>)

<span class="tc-cm"># 设置函数签名</span>
lib.talon_open.restype = ctypes.c_void_p
lib.talon_execute.argtypes = [
    ctypes.c_void_p, ctypes.c_char_p,
    ctypes.POINTER(ctypes.c_char_p)
]

<span class="tc-cm"># 打开数据库</span>
db = lib.<span class="tc-ac">talon_open</span>(<span class="tc-str">b"./my_data"</span>)

<span class="tc-cm"># 通过 talon_execute 调用全部引擎</span>
out = ctypes.c_char_p()

<span class="tc-cm"># SQL 建表</span>
cmd = json.dumps({
    <span class="tc-str">"module"</span>: <span class="tc-str">"sql"</span>, <span class="tc-str">"action"</span>: <span class="tc-str">"exec"</span>,
    <span class="tc-str">"params"</span>: {<span class="tc-str">"sql"</span>: <span class="tc-str">"CREATE TABLE users (id INT PRIMARY KEY, name TEXT)"</span>}
}).encode()
lib.<span class="tc-ac">talon_execute</span>(db, cmd, ctypes.byref(out))
print(out.value.decode())
lib.<span class="tc-ac">talon_free_string</span>(out)

lib.<span class="tc-ac">talon_close</span>(db)`,
    runCmd: '$ python main.py',
    output: `<span class="tc-info">[INFO]</span> Loaded libtalon.dylib
{"ok":true,"data":"CREATE TABLE ok"}
{"ok":true,"data":{"rows":1}}

<span class="tc-ok">Process finished with exit code 0</span>`,
  },
  'Node.js': {
    file: 'index.mjs',
    badge: 'Node 18+',
    code: `<span class="tc-kw">import</span> ffi <span class="tc-kw">from</span> <span class="tc-str">'ffi-napi'</span>;
<span class="tc-kw">import</span> ref <span class="tc-kw">from</span> <span class="tc-str">'ref-napi'</span>;

<span class="tc-kw">const</span> strPtr = ref.refType(<span class="tc-str">'string'</span>);

<span class="tc-kw">const</span> talon = ffi.<span class="tc-ac">Library</span>(<span class="tc-str">'./libtalon'</span>, {
  <span class="tc-str">'talon_open'</span>:        [<span class="tc-str">'pointer'</span>, [<span class="tc-str">'string'</span>]],
  <span class="tc-str">'talon_execute'</span>:     [<span class="tc-str">'int'</span>, [<span class="tc-str">'pointer'</span>, <span class="tc-str">'string'</span>, strPtr]],
  <span class="tc-str">'talon_free_string'</span>: [<span class="tc-str">'void'</span>, [<span class="tc-str">'pointer'</span>]],
  <span class="tc-str">'talon_close'</span>:       [<span class="tc-str">'void'</span>, [<span class="tc-str">'pointer'</span>]],
});

<span class="tc-kw">const</span> db = talon.<span class="tc-ac">talon_open</span>(<span class="tc-str">'./my_data'</span>);
<span class="tc-kw">const</span> out = ref.alloc(<span class="tc-str">'string'</span>);

talon.<span class="tc-ac">talon_execute</span>(db, JSON.stringify({
  module: <span class="tc-str">'sql'</span>, action: <span class="tc-str">'query'</span>,
  params: { sql: <span class="tc-str">'SELECT * FROM users LIMIT 10'</span> }
}), out);

console.log(out.deref());
talon.<span class="tc-ac">talon_close</span>(db);`,
    runCmd: '$ node index.mjs',
    output: `<span class="tc-info">[INFO]</span> Loaded libtalon via ffi-napi
{"ok":true,"data":[[1,"Alice",95.5]]}

<span class="tc-ok">Process finished with exit code 0</span>`,
  },
  Java: {
    file: 'Main.java',
    badge: 'Java 17+',
    code: `<span class="tc-kw">import</span> com.sun.jna.*;
<span class="tc-kw">import</span> com.sun.jna.ptr.PointerByReference;

<span class="tc-kw">public interface</span> <span class="tc-ty">Talon</span> <span class="tc-kw">extends</span> Library {
    Talon LIB = Native.load(<span class="tc-str">"talon"</span>, Talon.<span class="tc-kw">class</span>);

    Pointer <span class="tc-fn">talon_open</span>(String path);
    <span class="tc-ty">int</span> <span class="tc-fn">talon_execute</span>(Pointer h, String cmd, PointerByReference out);
    <span class="tc-ty">void</span> <span class="tc-fn">talon_close</span>(Pointer h);
    <span class="tc-ty">void</span> <span class="tc-fn">talon_free_string</span>(Pointer ptr);
}

<span class="tc-kw">public class</span> <span class="tc-ty">Main</span> {
    <span class="tc-kw">public static void</span> <span class="tc-fn">main</span>(String[] args) {
        Pointer db = Talon.LIB.<span class="tc-ac">talon_open</span>(<span class="tc-str">"./my_data"</span>);
        PointerByReference out = <span class="tc-kw">new</span> PointerByReference();

        String cmd = <span class="tc-str">"{\\"module\\":\\"sql\\",\\"action\\":\\"query\\","</span>
            + <span class="tc-str">"\\"params\\":{\\"sql\\":\\"SELECT * FROM users\\"}}"</span>;
        Talon.LIB.<span class="tc-ac">talon_execute</span>(db, cmd, out);
        System.out.println(out.getValue().getString(<span class="tc-num">0</span>));

        Talon.LIB.<span class="tc-ac">talon_free_string</span>(out.getValue());
        Talon.LIB.<span class="tc-ac">talon_close</span>(db);
    }
}`,
    runCmd: '$ javac Main.java && java Main',
    output: `<span class="tc-info">[INFO]</span> JNA loaded libtalon.dylib
{"ok":true,"data":[[1,"Alice",95.5]]}

<span class="tc-ok">Process finished with exit code 0</span>`,
  },
  'C/C++': {
    file: 'main.c',
    badge: 'C11 / C++17',
    code: `<span class="tc-kw">#include</span> <span class="tc-str">&lt;stdio.h&gt;</span>
<span class="tc-kw">#include</span> <span class="tc-str">"talon.h"</span>

<span class="tc-ty">int</span> <span class="tc-fn">main</span>() {
    <span class="tc-cm">// 打开数据库</span>
    TalonHandle *db = <span class="tc-ac">talon_open</span>(<span class="tc-str">"./my_data"</span>);
    <span class="tc-kw">if</span> (!db) { fprintf(stderr, <span class="tc-str">"Open failed\\n"</span>); <span class="tc-kw">return</span> <span class="tc-num">1</span>; }

    <span class="tc-ty">char</span> *json = <span class="tc-num">NULL</span>;

    <span class="tc-cm">// SQL: 建表 + 插入</span>
    <span class="tc-ac">talon_run_sql</span>(db, <span class="tc-str">"CREATE TABLE users (id INT PRIMARY KEY, name TEXT)"</span>, &json);
    <span class="tc-ac">talon_free_string</span>(json);

    <span class="tc-ac">talon_run_sql</span>(db, <span class="tc-str">"INSERT INTO users VALUES (1, 'Alice')"</span>, &json);
    <span class="tc-ac">talon_free_string</span>(json);

    <span class="tc-cm">// talon_execute: JSON 通用入口</span>
    <span class="tc-ac">talon_execute</span>(db,
        <span class="tc-str">"{\\"module\\":\\"sql\\",\\"action\\":\\"query\\","</span>
        <span class="tc-str">"\\"params\\":{\\"sql\\":\\"SELECT * FROM users\\"}}"</span>,
        &json);
    printf(<span class="tc-str">"%s\\n"</span>, json);
    <span class="tc-ac">talon_free_string</span>(json);

    <span class="tc-ac">talon_close</span>(db);
    <span class="tc-kw">return</span> <span class="tc-num">0</span>;
}`,
    runCmd: '$ gcc main.c -ltalon -o demo && ./demo',
    output: `<span class="tc-info">[INFO]</span> Talon opened: ./my_data
{"ok":true,"data":[[1,"Alice"]]}

<span class="tc-ok">Process finished with exit code 0</span>`,
  },
  '.NET': {
    file: 'Program.cs',
    badge: '.NET 8+',
    code: `<span class="tc-kw">using</span> System;
<span class="tc-kw">using</span> System.Runtime.InteropServices;

<span class="tc-kw">class</span> <span class="tc-ty">Talon</span>
{
    [DllImport(<span class="tc-str">"talon"</span>)] <span class="tc-kw">static extern</span> IntPtr <span class="tc-fn">talon_open</span>(<span class="tc-kw">string</span> path);
    [DllImport(<span class="tc-str">"talon"</span>)] <span class="tc-kw">static extern int</span> <span class="tc-fn">talon_execute</span>(
        IntPtr h, <span class="tc-kw">string</span> cmd, <span class="tc-kw">out</span> IntPtr json);
    [DllImport(<span class="tc-str">"talon"</span>)] <span class="tc-kw">static extern void</span> <span class="tc-fn">talon_close</span>(IntPtr h);
    [DllImport(<span class="tc-str">"talon"</span>)] <span class="tc-kw">static extern void</span> <span class="tc-fn">talon_free_string</span>(IntPtr p);

    <span class="tc-kw">static void</span> <span class="tc-fn">Main</span>()
    {
        <span class="tc-kw">var</span> db = <span class="tc-ac">talon_open</span>(<span class="tc-str">"./my_data"</span>);

        <span class="tc-kw">var</span> cmd = <span class="tc-str">@"{\""module\"":\""sql\"",\""action\"":\""query\"","</span>
            + <span class="tc-str">@"\""params\"":{\""sql\"":\""SELECT * FROM users\""}}"</span>;
        <span class="tc-ac">talon_execute</span>(db, cmd, <span class="tc-kw">out var</span> json);

        Console.WriteLine(Marshal.PtrToStringAnsi(json));
        <span class="tc-ac">talon_free_string</span>(json);
        <span class="tc-ac">talon_close</span>(db);
    }
}`,
    runCmd: '$ dotnet run',
    output: `<span class="tc-info">[INFO]</span> P/Invoke loaded libtalon
{"ok":true,"data":[[1,"Alice",95.5]]}

<span class="tc-ok">Process finished with exit code 0</span>`,
  },
};

interface Props {
  tabs: string[];
  examples: string[];
  linkLabel: string;
}

export default function SdkCodeViewer({ tabs, examples, linkLabel }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const tabKey = tabs[activeTab] || 'Go';
  const lang = langs[tabKey] || langs['Go'];

  return (
    <>
      {/* Language Tabs */}
      <div className="flex justify-center mb-8 border-b border-white/10 overflow-x-auto">
        <div className="flex space-x-8 px-4">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors whitespace-nowrap ${
                i === activeTab
                  ? 'text-white tab-active'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* IDE Layout */}
      <div className="rounded-xl border border-white/10 bg-[#0a0a0f] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[650px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#0c0c14] border-r border-white/10 flex-shrink-0 flex flex-col">
          <div className="p-4 text-xs font-mono text-slate-500 uppercase tracking-wider border-b border-white/10">
            Examples
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {examples.map((ex, i) => (
              <div
                key={ex}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  i === 0
                    ? 'text-white bg-[#16162a] border border-[#3713ec]/30 flex items-center justify-between'
                    : 'text-slate-400'
                }`}
              >
                {ex}
                {i === 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#3713ec] shadow-[0_0_8px_#3713ec]" />
                )}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10">
            <a
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-slate-400 border border-white/10 rounded hover:bg-white/5 transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              {linkLabel}
            </a>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0e1016]">
          <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-[#0a0a0f]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              <span className="ml-2 text-xs text-slate-500 font-mono">{lang.file}</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto code-scroll p-6 font-mono text-sm leading-relaxed relative group">
            <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-[#3713ec]/20 text-[#3713ec] text-[10px] px-2 py-1 rounded border border-[#3713ec]/30">
                {lang.badge}
              </span>
            </div>
            <pre>
              <code
                className="text-slate-300"
                dangerouslySetInnerHTML={{ __html: lang.code }}
              />
            </pre>
          </div>
        </div>

        {/* Output Console */}
        <div className="w-full md:w-80 bg-[#0d0d12] border-l border-white/10 flex-shrink-0 flex flex-col font-mono text-xs">
          <div className="h-10 border-b border-white/10 flex items-center px-4 bg-[#0a0a0f] text-slate-500">
            <span className="material-symbols-outlined text-[16px] mr-2">terminal</span>
            Output / Console
          </div>
          <div className="p-4 flex-1 overflow-y-auto code-scroll text-slate-300">
            <div className="mb-2 text-slate-500">{lang.runCmd}</div>
            <div dangerouslySetInnerHTML={{ __html: lang.output }} />
          </div>
        </div>
      </div>
    </>
  );
}
