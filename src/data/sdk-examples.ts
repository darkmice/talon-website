export interface SdkExample {
  file: string;
  code: string;
  runCmd: string;
  output: string;
}

// --- Go Examples (Native SDK) ---
const go: SdkExample[] = [
  // Ex0: talon_execute JSON 综合
  { file: 'main.go', runCmd: '$ go run main.go',
    code: `<span class="tc-kw">package</span> main

<span class="tc-kw">import</span> (
    <span class="tc-str">"fmt"</span>
    <span class="tc-str">"log"</span>
    talon <span class="tc-str">"github.com/darkmice/talon/sdk/go"</span>
)

<span class="tc-ty">func</span> <span class="tc-fn">main</span>() &#123;
    db, err := talon.<span class="tc-ac">Open</span>(<span class="tc-str">"./my_data"</span>)
    <span class="tc-kw">if</span> err != <span class="tc-num">nil</span> &#123; log.Fatal(err) &#125;
    <span class="tc-kw">defer</span> db.<span class="tc-ac">Close</span>()

    <span class="tc-cm">// SQL 引擎</span>
    db.<span class="tc-ac">RunSQL</span>(<span class="tc-str">"CREATE TABLE users (id INT PRIMARY KEY, name TEXT, score REAL)"</span>)
    db.<span class="tc-ac">RunSQL</span>(<span class="tc-str">"INSERT INTO users VALUES (1, 'Alice', 95.5)"</span>)

    <span class="tc-cm">// KV 引擎</span>
    db.<span class="tc-ac">KvSet</span>([]<span class="tc-ty">byte</span>(<span class="tc-str">"session:u1"</span>), []<span class="tc-ty">byte</span>(<span class="tc-str">"active"</span>), <span class="tc-num">3600</span>)

    <span class="tc-cm">// talon_execute JSON 通用入口</span>
    result, _ := db.<span class="tc-ac">Execute</span>(<span class="tc-str">\`&#123;"module":"sql","action":"query",
        "params":&#123;"sql":"SELECT * FROM users LIMIT 10"&#125;&#125;\`</span>)
    fmt.Println(result)
&#125;`,
    output: `<span class="tc-info">[INFO]</span> Talon opened: ./my_data
<span class="tc-cm">SQL:</span> CREATE TABLE ok
<span class="tc-cm">SQL INSERT:</span> 1 row affected
<span class="tc-cm">KV SET:</span> session:u1 <span class="tc-ok">OK</span> (TTL=3600s)
<span class="tc-ac">&#123;"ok":true,"data":[[1,"Alice",95.5]]&#125;</span>

<span class="tc-ok">Process finished with exit code 0</span>` },

  // Ex1: SQL 查询
  { file: 'sql_demo.go', runCmd: '$ go run sql_demo.go',
    code: `<span class="tc-kw">package</span> main

<span class="tc-kw">import</span> (
    <span class="tc-str">"fmt"</span>
    talon <span class="tc-str">"github.com/darkmice/talon/sdk/go"</span>
)

<span class="tc-ty">func</span> <span class="tc-fn">main</span>() &#123;
    db, _ := talon.<span class="tc-ac">Open</span>(<span class="tc-str">"./my_data"</span>)
    <span class="tc-kw">defer</span> db.<span class="tc-ac">Close</span>()

    <span class="tc-cm">// DDL + DML</span>
    db.<span class="tc-ac">RunSQL</span>(<span class="tc-str">"CREATE TABLE users (id INT PRIMARY KEY, name TEXT, score REAL)"</span>)
    db.<span class="tc-ac">RunSQL</span>(<span class="tc-str">"INSERT INTO users VALUES (1, 'Alice', 95.5), (2, 'Bob', 88.0)"</span>)

    <span class="tc-cm">// 条件查询 + 聚合</span>
    rows, _ := db.<span class="tc-ac">Query</span>(<span class="tc-str">"SELECT * FROM users WHERE score &gt; 90"</span>)
    <span class="tc-kw">for</span> _, r := <span class="tc-kw">range</span> rows &#123;
        fmt.<span class="tc-ac">Printf</span>(<span class="tc-str">"id=%v name=%v score=%v\\n"</span>, r[<span class="tc-num">0</span>], r[<span class="tc-num">1</span>], r[<span class="tc-num">2</span>])
    &#125;

    avg, _ := db.<span class="tc-ac">Query</span>(<span class="tc-str">"SELECT AVG(score) FROM users"</span>)
    fmt.<span class="tc-ac">Printf</span>(<span class="tc-str">"avg=%.1f\\n"</span>, avg[<span class="tc-num">0</span>][<span class="tc-num">0</span>])
&#125;`,
    output: `<span class="tc-info">[INFO]</span> Talon opened: ./my_data
<span class="tc-cm">CREATE TABLE:</span> ok
<span class="tc-cm">INSERT:</span> 2 rows affected
id=1 name=Alice score=95.5
avg=91.8

<span class="tc-ok">Process finished with exit code 0</span>` },

  // Ex2: KV SET/GET
  { file: 'kv_demo.go', runCmd: '$ go run kv_demo.go',
    code: `<span class="tc-kw">package</span> main

<span class="tc-kw">import</span> (
    <span class="tc-str">"fmt"</span>
    talon <span class="tc-str">"github.com/darkmice/talon/sdk/go"</span>
)

<span class="tc-ty">func</span> <span class="tc-fn">main</span>() &#123;
    db, _ := talon.<span class="tc-ac">Open</span>(<span class="tc-str">"./my_data"</span>)
    <span class="tc-kw">defer</span> db.<span class="tc-ac">Close</span>()

    <span class="tc-cm">// SET with TTL</span>
    db.<span class="tc-ac">KvSet</span>([]<span class="tc-ty">byte</span>(<span class="tc-str">"user:1001"</span>), []<span class="tc-ty">byte</span>(<span class="tc-str">\`&#123;"name":"Alice"&#125;\`</span>), <span class="tc-num">3600</span>)
    db.<span class="tc-ac">KvSet</span>([]<span class="tc-ty">byte</span>(<span class="tc-str">"user:1002"</span>), []<span class="tc-ty">byte</span>(<span class="tc-str">\`&#123;"name":"Bob"&#125;\`</span>), <span class="tc-num">0</span>)

    <span class="tc-cm">// GET single key</span>
    val, _ := db.<span class="tc-ac">KvGet</span>([]<span class="tc-ty">byte</span>(<span class="tc-str">"user:1001"</span>))
    fmt.Println(<span class="tc-str">"GET:"</span>, <span class="tc-ty">string</span>(val))

    <span class="tc-cm">// MGET batch</span>
    keys := [][]<span class="tc-ty">byte</span>&#123;[]<span class="tc-ty">byte</span>(<span class="tc-str">"user:1001"</span>), []<span class="tc-ty">byte</span>(<span class="tc-str">"user:1002"</span>)&#125;
    vals, _ := db.<span class="tc-ac">KvMGet</span>(keys)
    <span class="tc-kw">for</span> _, v := <span class="tc-kw">range</span> vals &#123; fmt.Println(<span class="tc-ty">string</span>(v)) &#125;
&#125;`,
    output: `<span class="tc-info">[INFO]</span> Talon opened: ./my_data
<span class="tc-cm">KV SET:</span> user:1001 <span class="tc-ok">OK</span> (TTL=3600s)
<span class="tc-cm">KV SET:</span> user:1002 <span class="tc-ok">OK</span>
GET: &#123;"name":"Alice"&#125;
&#123;"name":"Alice"&#125;
&#123;"name":"Bob"&#125;

<span class="tc-ok">Process finished with exit code 0</span>` },

  // Ex3: 向量 KNN 搜索
  { file: 'vec_demo.go', runCmd: '$ go run vec_demo.go',
    code: `<span class="tc-kw">package</span> main

<span class="tc-kw">import</span> (
    <span class="tc-str">"fmt"</span>
    talon <span class="tc-str">"github.com/darkmice/talon/sdk/go"</span>
)

<span class="tc-ty">func</span> <span class="tc-fn">main</span>() &#123;
    db, _ := talon.<span class="tc-ac">Open</span>(<span class="tc-str">"./my_data"</span>)
    <span class="tc-kw">defer</span> db.<span class="tc-ac">Close</span>()

    vec := db.<span class="tc-ac">Vector</span>(<span class="tc-str">"embeddings"</span>)
    vec.<span class="tc-ac">Insert</span>(<span class="tc-str">"doc-1"</span>, []<span class="tc-ty">float32</span>&#123;<span class="tc-num">0.12</span>, <span class="tc-num">0.85</span>, <span class="tc-num">0.33</span>, <span class="tc-num">0.67</span>&#125;)
    vec.<span class="tc-ac">Insert</span>(<span class="tc-str">"doc-2"</span>, []<span class="tc-ty">float32</span>&#123;<span class="tc-num">0.45</span>, <span class="tc-num">0.21</span>, <span class="tc-num">0.78</span>, <span class="tc-num">0.54</span>&#125;)
    vec.<span class="tc-ac">Insert</span>(<span class="tc-str">"doc-3"</span>, []<span class="tc-ty">float32</span>&#123;<span class="tc-num">0.11</span>, <span class="tc-num">0.82</span>, <span class="tc-num">0.35</span>, <span class="tc-num">0.69</span>&#125;)

    <span class="tc-cm">// KNN top-2 search</span>
    results, _ := vec.<span class="tc-ac">Search</span>([]<span class="tc-ty">float32</span>&#123;<span class="tc-num">0.10</span>, <span class="tc-num">0.80</span>, <span class="tc-num">0.30</span>, <span class="tc-num">0.65</span>&#125;, <span class="tc-num">2</span>)
    <span class="tc-kw">for</span> _, r := <span class="tc-kw">range</span> results &#123;
        fmt.<span class="tc-ac">Printf</span>(<span class="tc-str">"id=%s score=%.4f\\n"</span>, r.ID, r.Score)
    &#125;
&#125;`,
    output: `<span class="tc-info">[INFO]</span> Talon opened: ./my_data
<span class="tc-cm">Vector:</span> 3 embeddings indexed (dim=4, HNSW)
<span class="tc-cm">KNN Search:</span> top-2 results
id=doc-3 score=0.9987
id=doc-1 score=0.9945

<span class="tc-ok">Process finished with exit code 0</span>` },

  // Ex4: AI 会话管理
  { file: 'ai_demo.go', runCmd: '$ go run ai_demo.go',
    code: `<span class="tc-kw">package</span> main

<span class="tc-kw">import</span> (
    <span class="tc-str">"fmt"</span>
    talon <span class="tc-str">"github.com/darkmice/talon/sdk/go"</span>
)

<span class="tc-ty">func</span> <span class="tc-fn">main</span>() &#123;
    db, _ := talon.<span class="tc-ac">Open</span>(<span class="tc-str">"./my_data"</span>)
    <span class="tc-kw">defer</span> db.<span class="tc-ac">Close</span>()

    ai := db.<span class="tc-ac">AI</span>()
    sess, _ := ai.<span class="tc-ac">CreateSession</span>(<span class="tc-str">"user-abc"</span>, <span class="tc-kw">map</span>[<span class="tc-ty">string</span>]<span class="tc-ty">string</span>&#123;
        <span class="tc-str">"model"</span>: <span class="tc-str">"gpt-4o"</span>,
    &#125;, <span class="tc-num">7200</span>)

    sess.<span class="tc-ac">AddContext</span>(<span class="tc-str">"user"</span>, <span class="tc-str">"How do I use Talon KV?"</span>)
    sess.<span class="tc-ac">AddContext</span>(<span class="tc-str">"assistant"</span>, <span class="tc-str">"Use db.KvSet() and db.KvGet()."</span>)

    history, _ := sess.<span class="tc-ac">GetHistory</span>(<span class="tc-num">10</span>)
    <span class="tc-kw">for</span> _, m := <span class="tc-kw">range</span> history &#123;
        fmt.<span class="tc-ac">Printf</span>(<span class="tc-str">"[%s] %s\\n"</span>, m.Role, m.Content)
    &#125;
&#125;`,
    output: `<span class="tc-info">[INFO]</span> Talon opened: ./my_data
<span class="tc-cm">AI Session:</span> user-abc created (TTL=7200s)
<span class="tc-cm">Context:</span> 2 messages stored
[user] How do I use Talon KV?
[assistant] Use db.KvSet() and db.KvGet().

<span class="tc-ok">Process finished with exit code 0</span>` },

  // Ex5: 时序写入查询
  { file: 'ts_demo.go', runCmd: '$ go run ts_demo.go',
    code: `<span class="tc-kw">package</span> main

<span class="tc-kw">import</span> (
    <span class="tc-str">"fmt"</span>
    <span class="tc-str">"time"</span>
    talon <span class="tc-str">"github.com/darkmice/talon/sdk/go"</span>
)

<span class="tc-ty">func</span> <span class="tc-fn">main</span>() &#123;
    db, _ := talon.<span class="tc-ac">Open</span>(<span class="tc-str">"./my_data"</span>)
    <span class="tc-kw">defer</span> db.<span class="tc-ac">Close</span>()

    ts := db.<span class="tc-ac">TS</span>(<span class="tc-str">"sensors"</span>)
    <span class="tc-kw">for</span> i := <span class="tc-num">0</span>; i &lt; <span class="tc-num">5</span>; i++ &#123;
        ts.<span class="tc-ac">Write</span>(talon.DataPoint&#123;
            Timestamp: time.Now().UnixMilli(),
            Tags:   <span class="tc-kw">map</span>[<span class="tc-ty">string</span>]<span class="tc-ty">string</span>&#123;<span class="tc-str">"device"</span>: <span class="tc-str">"temp-01"</span>&#125;,
            Fields: <span class="tc-kw">map</span>[<span class="tc-ty">string</span>]<span class="tc-ty">string</span>&#123;<span class="tc-str">"value"</span>: fmt.Sprintf(<span class="tc-str">"%.1f"</span>, <span class="tc-num">22.0</span>+<span class="tc-ty">float64</span>(i)*<span class="tc-num">0.5</span>)&#125;,
        &#125;)
    &#125;

    agg, _ := ts.<span class="tc-ac">Aggregate</span>(<span class="tc-str">"device='temp-01'"</span>, <span class="tc-str">"AVG"</span>, <span class="tc-str">"value"</span>, <span class="tc-str">"-1h"</span>)
    fmt.<span class="tc-ac">Printf</span>(<span class="tc-str">"Avg temp: %.2f°C\\n"</span>, agg)
&#125;`,
    output: `<span class="tc-info">[INFO]</span> Talon opened: ./my_data
<span class="tc-cm">TS Write:</span> 5 data points (metric=sensors)
<span class="tc-cm">TS Aggregate:</span> AVG(value) WHERE device='temp-01'
Avg temp: 23.00°C

<span class="tc-ok">Process finished with exit code 0</span>` },
];

// --- Rust Examples (Native SDK) ---
const rust: SdkExample[] = [
  { file: 'main.rs', runCmd: '$ cargo run --release',
    code: `<span class="tc-kw">use</span> talon::&#123;Store, sql, kv::KvEngine&#125;;

<span class="tc-ty">fn</span> <span class="tc-fn">main</span>() -&gt; <span class="tc-ty">Result</span>&lt;(), talon::Error&gt; &#123;
    <span class="tc-kw">let</span> store = Store::<span class="tc-ac">open</span>(<span class="tc-str">"./my_data"</span>)?;

    sql::<span class="tc-ac">run</span>(&amp;store, <span class="tc-str">"CREATE TABLE users (id INT PK, name TEXT, score REAL)"</span>)?;
    sql::<span class="tc-ac">run</span>(&amp;store, <span class="tc-str">"INSERT INTO users VALUES (1, 'Alice', 95.5)"</span>)?;

    <span class="tc-kw">let</span> kv = KvEngine::<span class="tc-ac">open</span>(&amp;store)?;
    kv.<span class="tc-ac">set</span>(<span class="tc-str">b"session:u1"</span>, <span class="tc-str">b"active"</span>, <span class="tc-num">3600</span>)?;

    <span class="tc-kw">let</span> rows = sql::<span class="tc-ac">run</span>(&amp;store, <span class="tc-str">"SELECT * FROM users"</span>)?;
    println!(<span class="tc-str">"&#123;:?&#125;"</span>, rows);
    <span class="tc-ty">Ok</span>(())
&#125;`,
    output: `<span class="tc-info">[INFO]</span> Compiling talon-demo v0.1.0
<span class="tc-info">[INFO]</span> Finished release [optimized]
[[1, "Alice", 95.5]]

<span class="tc-ok">Process finished with exit code 0</span>` },
  { file: 'sql_demo.rs', runCmd: '$ cargo run --release',
    code: `<span class="tc-kw">use</span> talon::&#123;Store, sql&#125;;

<span class="tc-ty">fn</span> <span class="tc-fn">main</span>() -&gt; <span class="tc-ty">Result</span>&lt;(), talon::Error&gt; &#123;
    <span class="tc-kw">let</span> store = Store::<span class="tc-ac">open</span>(<span class="tc-str">"./my_data"</span>)?;

    sql::<span class="tc-ac">run</span>(&amp;store, <span class="tc-str">"CREATE TABLE users (id INT PK, name TEXT, score REAL)"</span>)?;
    sql::<span class="tc-ac">run</span>(&amp;store, <span class="tc-str">"INSERT INTO users VALUES (1, 'Alice', 95.5), (2, 'Bob', 88.0)"</span>)?;

    <span class="tc-kw">let</span> rows = sql::<span class="tc-ac">run</span>(&amp;store, <span class="tc-str">"SELECT * FROM users WHERE score &gt; 90"</span>)?;
    <span class="tc-kw">for</span> row <span class="tc-kw">in</span> &amp;rows &#123; println!(<span class="tc-str">"&#123;:?&#125;"</span>, row); &#125;

    <span class="tc-kw">let</span> avg = sql::<span class="tc-ac">run</span>(&amp;store, <span class="tc-str">"SELECT AVG(score) FROM users"</span>)?;
    println!(<span class="tc-str">"avg: &#123;:?&#125;"</span>, avg);
    <span class="tc-ty">Ok</span>(())
&#125;`,
    output: `<span class="tc-cm">CREATE TABLE:</span> ok
<span class="tc-cm">INSERT:</span> 2 rows
[1, "Alice", 95.5]
avg: [[91.75]]

<span class="tc-ok">Process finished with exit code 0</span>` },
  { file: 'kv_demo.rs', runCmd: '$ cargo run --release',
    code: `<span class="tc-kw">use</span> talon::&#123;Store, kv::KvEngine&#125;;

<span class="tc-ty">fn</span> <span class="tc-fn">main</span>() -&gt; <span class="tc-ty">Result</span>&lt;(), talon::Error&gt; &#123;
    <span class="tc-kw">let</span> store = Store::<span class="tc-ac">open</span>(<span class="tc-str">"./my_data"</span>)?;
    <span class="tc-kw">let</span> kv = KvEngine::<span class="tc-ac">open</span>(&amp;store)?;

    kv.<span class="tc-ac">set</span>(<span class="tc-str">b"user:1001"</span>, <span class="tc-str">b"&#123;\\"name\\":\\"Alice\\"&#125;"</span>, <span class="tc-num">3600</span>)?;
    kv.<span class="tc-ac">set</span>(<span class="tc-str">b"user:1002"</span>, <span class="tc-str">b"&#123;\\"name\\":\\"Bob\\"&#125;"</span>, <span class="tc-num">0</span>)?;

    <span class="tc-kw">let</span> val = kv.<span class="tc-ac">get</span>(<span class="tc-str">b"user:1001"</span>)?;
    println!(<span class="tc-str">"GET: &#123;:?&#125;"</span>, val);

    <span class="tc-kw">let</span> vals = kv.<span class="tc-ac">mget</span>(&amp;[<span class="tc-str">b"user:1001"</span>, <span class="tc-str">b"user:1002"</span>])?;
    <span class="tc-kw">for</span> v <span class="tc-kw">in</span> vals &#123; println!(<span class="tc-str">"&#123;:?&#125;"</span>, v); &#125;
    <span class="tc-ty">Ok</span>(())
&#125;`,
    output: `GET: Some(b"&#123;\\"name\\":\\"Alice\\"&#125;")
Some(b"&#123;\\"name\\":\\"Alice\\"&#125;")
Some(b"&#123;\\"name\\":\\"Bob\\"&#125;")

<span class="tc-ok">Process finished with exit code 0</span>` },
  { file: 'vec_demo.rs', runCmd: '$ cargo run --release',
    code: `<span class="tc-kw">use</span> talon::&#123;Store, vector::VectorEngine&#125;;

<span class="tc-ty">fn</span> <span class="tc-fn">main</span>() -&gt; <span class="tc-ty">Result</span>&lt;(), talon::Error&gt; &#123;
    <span class="tc-kw">let</span> store = Store::<span class="tc-ac">open</span>(<span class="tc-str">"./my_data"</span>)?;
    <span class="tc-kw">let</span> vec = VectorEngine::<span class="tc-ac">open</span>(&amp;store, <span class="tc-str">"embeddings"</span>)?;

    vec.<span class="tc-ac">insert</span>(<span class="tc-str">"doc-1"</span>, &amp;[<span class="tc-num">0.12</span>, <span class="tc-num">0.85</span>, <span class="tc-num">0.33</span>, <span class="tc-num">0.67</span>])?;
    vec.<span class="tc-ac">insert</span>(<span class="tc-str">"doc-2"</span>, &amp;[<span class="tc-num">0.45</span>, <span class="tc-num">0.21</span>, <span class="tc-num">0.78</span>, <span class="tc-num">0.54</span>])?;
    vec.<span class="tc-ac">insert</span>(<span class="tc-str">"doc-3"</span>, &amp;[<span class="tc-num">0.11</span>, <span class="tc-num">0.82</span>, <span class="tc-num">0.35</span>, <span class="tc-num">0.69</span>])?;

    <span class="tc-kw">let</span> results = vec.<span class="tc-ac">search</span>(&amp;[<span class="tc-num">0.10</span>, <span class="tc-num">0.80</span>, <span class="tc-num">0.30</span>, <span class="tc-num">0.65</span>], <span class="tc-num">2</span>)?;
    <span class="tc-kw">for</span> r <span class="tc-kw">in</span> results &#123; println!(<span class="tc-str">"id=&#123;&#125; score=&#123;:.4&#125;"</span>, r.id, r.score); &#125;
    <span class="tc-ty">Ok</span>(())
&#125;`,
    output: `<span class="tc-cm">Vector:</span> 3 embeddings indexed (HNSW, dim=4)
id=doc-3 score=0.9987
id=doc-1 score=0.9945

<span class="tc-ok">Process finished with exit code 0</span>` },
  { file: 'ai_demo.rs', runCmd: '$ cargo run --release',
    code: `<span class="tc-kw">use</span> talon::&#123;Store, ai::AiEngine&#125;;
<span class="tc-kw">use</span> std::collections::BTreeMap;

<span class="tc-ty">fn</span> <span class="tc-fn">main</span>() -&gt; <span class="tc-ty">Result</span>&lt;(), talon::Error&gt; &#123;
    <span class="tc-kw">let</span> store = Store::<span class="tc-ac">open</span>(<span class="tc-str">"./my_data"</span>)?;
    <span class="tc-kw">let</span> ai = AiEngine::<span class="tc-ac">open</span>(&amp;store)?;

    <span class="tc-kw">let</span> <span class="tc-kw">mut</span> meta = BTreeMap::new();
    meta.insert(<span class="tc-str">"model"</span>.into(), <span class="tc-str">"gpt-4o"</span>.into());
    <span class="tc-kw">let</span> sess = ai.<span class="tc-ac">create_session</span>(<span class="tc-str">"user-abc"</span>, meta, Some(<span class="tc-num">7200</span>))?;

    sess.<span class="tc-ac">add_context</span>(<span class="tc-str">"user"</span>, <span class="tc-str">"How to use KV?"</span>)?;
    sess.<span class="tc-ac">add_context</span>(<span class="tc-str">"assistant"</span>, <span class="tc-str">"Use kv.set() and kv.get()."</span>)?;

    <span class="tc-kw">let</span> history = sess.<span class="tc-ac">get_history</span>(<span class="tc-num">10</span>)?;
    <span class="tc-kw">for</span> m <span class="tc-kw">in</span> history &#123; println!(<span class="tc-str">"[&#123;&#125;] &#123;&#125;"</span>, m.role, m.content); &#125;
    <span class="tc-ty">Ok</span>(())
&#125;`,
    output: `<span class="tc-cm">AI Session:</span> user-abc (TTL=7200s)
[user] How to use KV?
[assistant] Use kv.set() and kv.get().

<span class="tc-ok">Process finished with exit code 0</span>` },
  { file: 'ts_demo.rs', runCmd: '$ cargo run --release',
    code: `<span class="tc-kw">use</span> talon::&#123;Store, ts::&#123;TsEngine, DataPoint&#125;&#125;;
<span class="tc-kw">use</span> std::collections::BTreeMap;

<span class="tc-ty">fn</span> <span class="tc-fn">main</span>() -&gt; <span class="tc-ty">Result</span>&lt;(), talon::Error&gt; &#123;
    <span class="tc-kw">let</span> store = Store::<span class="tc-ac">open</span>(<span class="tc-str">"./my_data"</span>)?;
    <span class="tc-kw">let</span> ts = TsEngine::<span class="tc-ac">open</span>(&amp;store, <span class="tc-str">"sensors"</span>)?;

    <span class="tc-kw">for</span> i <span class="tc-kw">in</span> <span class="tc-num">0</span>..<span class="tc-num">5</span> &#123;
        <span class="tc-kw">let</span> <span class="tc-kw">mut</span> tags = BTreeMap::new();
        tags.insert(<span class="tc-str">"device"</span>.into(), <span class="tc-str">"temp-01"</span>.into());
        <span class="tc-kw">let</span> <span class="tc-kw">mut</span> fields = BTreeMap::new();
        fields.insert(<span class="tc-str">"value"</span>.into(), format!(<span class="tc-str">"&#123;:.1&#125;"</span>, <span class="tc-num">22.0</span> + i <span class="tc-kw">as</span> <span class="tc-ty">f64</span> * <span class="tc-num">0.5</span>));
        ts.<span class="tc-ac">write</span>(DataPoint &#123; timestamp: <span class="tc-num">0</span>, tags, fields &#125;)?;
    &#125;

    <span class="tc-kw">let</span> avg = ts.<span class="tc-ac">aggregate</span>(<span class="tc-str">"device='temp-01'"</span>, <span class="tc-str">"AVG"</span>, <span class="tc-str">"value"</span>, <span class="tc-str">"-1h"</span>)?;
    println!(<span class="tc-str">"Avg: &#123;:.2&#125;°C"</span>, avg);
    <span class="tc-ty">Ok</span>(())
&#125;`,
    output: `<span class="tc-cm">TS Write:</span> 5 points (sensors)
Avg: 23.00°C

<span class="tc-ok">Process finished with exit code 0</span>` },
];

// --- FFI Helper: generates examples for talon_execute-based languages ---
function ffiEx(
  hdr: string, call: (cmd: string, comment: string) => string, ftr: string,
  file: string, runCmd: string
): SdkExample[] {
  const cmds = [
    { c: 'SQL + KV + Execute 综合示例', j: `&#123;"module":"sql","action":"query","params":&#123;"sql":"SELECT * FROM users LIMIT 10"&#125;&#125;`,
      o: `<span class="tc-ac">&#123;"ok":true,"data":[[1,"Alice",95.5]]&#125;</span>\n\n<span class="tc-ok">Process finished with exit code 0</span>` },
    { c: 'SQL 建表 + 插入 + 查询', j: `&#123;"module":"sql","action":"exec","params":&#123;"sql":"CREATE TABLE users (id INT PK, name TEXT, score REAL)"&#125;&#125;`,
      j2: `&#123;"module":"sql","action":"query","params":&#123;"sql":"SELECT * FROM users"&#125;&#125;`,
      o: `&#123;"ok":true&#125;\n&#123;"ok":true,"data":[[1,"Alice",95.5]]&#125;\n\n<span class="tc-ok">Process finished with exit code 0</span>` },
    { c: 'KV SET/GET 操作', j: `&#123;"module":"kv","action":"set","params":&#123;"key":"user:1001","value":"&#123;\\\\"name\\\\":\\\\"Alice\\\\"&#125;","ttl":3600&#125;&#125;`,
      j2: `&#123;"module":"kv","action":"get","params":&#123;"key":"user:1001"&#125;&#125;`,
      o: `&#123;"ok":true&#125;\n&#123;"ok":true,"data":"&#123;\\\\"name\\\\":\\\\"Alice\\\\"&#125;"&#125;\n\n<span class="tc-ok">Process finished with exit code 0</span>` },
    { c: '向量 KNN 搜索', j: `&#123;"module":"vector","action":"insert","params":&#123;"collection":"emb","id":"doc-1","vector":[0.1,0.8,0.3]&#125;&#125;`,
      j2: `&#123;"module":"vector","action":"search","params":&#123;"collection":"emb","vector":[0.1,0.8,0.3],"top_k":2&#125;&#125;`,
      o: `&#123;"ok":true&#125;\n&#123;"ok":true,"data":[&#123;"id":"doc-1","score":1.0&#125;]&#125;\n\n<span class="tc-ok">Process finished with exit code 0</span>` },
    { c: 'AI 会话管理', j: `&#123;"module":"ai","action":"create_session","params":&#123;"user_id":"user-abc","ttl":7200&#125;&#125;`,
      j2: `&#123;"module":"ai","action":"add_context","params":&#123;"session_id":"user-abc","role":"user","content":"Hello"&#125;&#125;`,
      o: `&#123;"ok":true,"session_id":"user-abc"&#125;\n&#123;"ok":true&#125;\n\n<span class="tc-ok">Process finished with exit code 0</span>` },
    { c: '时序写入 + 聚合查询', j: `&#123;"module":"ts","action":"write","params":&#123;"metric":"sensors","tags":&#123;"device":"temp-01"&#125;,"fields":&#123;"value":23.5&#125;&#125;&#125;`,
      j2: `&#123;"module":"ts","action":"aggregate","params":&#123;"metric":"sensors","fn":"AVG","field":"value","range":"-1h"&#125;&#125;`,
      o: `&#123;"ok":true&#125;\n&#123;"ok":true,"data":23.50&#125;\n\n<span class="tc-ok">Process finished with exit code 0</span>` },
  ];
  return cmds.map((cmd, i) => ({
    file: i === 0 ? file : file.replace(/\./, `_ex${i}.`),
    runCmd,
    code: hdr + call(cmd.j, cmd.c) + ((cmd as any).j2 ? '\n' + call((cmd as any).j2, '') : '') + ftr,
    output: `<span class="tc-info">[INFO]</span> Loaded libtalon\n` + cmd.o,
  }));
}

// --- Python ---
const python = ffiEx(
  `<span class="tc-kw">import</span> ctypes, json

lib = ctypes.CDLL(<span class="tc-str">"./libtalon.dylib"</span>)
lib.talon_open.restype = ctypes.c_void_p
db = lib.<span class="tc-ac">talon_open</span>(<span class="tc-str">b"./my_data"</span>)
out = ctypes.c_char_p()
`,
  (cmd, comment) => `${comment ? `\n<span class="tc-cm"># ${comment}</span>` : ''}
cmd = json.dumps(${cmd}).encode()
lib.<span class="tc-ac">talon_execute</span>(db, cmd, ctypes.byref(out))
print(out.value.decode())
lib.<span class="tc-ac">talon_free_string</span>(out)`,
  `
lib.<span class="tc-ac">talon_close</span>(db)`,
  'main.py', '$ python main.py'
);

// --- Node.js ---
const nodejs = ffiEx(
  `<span class="tc-kw">import</span> ffi <span class="tc-kw">from</span> <span class="tc-str">'ffi-napi'</span>;
<span class="tc-kw">import</span> ref <span class="tc-kw">from</span> <span class="tc-str">'ref-napi'</span>;

<span class="tc-kw">const</span> talon = ffi.<span class="tc-ac">Library</span>(<span class="tc-str">'./libtalon'</span>, &#123;
  <span class="tc-str">'talon_open'</span>: [<span class="tc-str">'pointer'</span>, [<span class="tc-str">'string'</span>]],
  <span class="tc-str">'talon_execute'</span>: [<span class="tc-str">'int'</span>, [<span class="tc-str">'pointer'</span>, <span class="tc-str">'string'</span>, ref.refType(<span class="tc-str">'string'</span>)]],
  <span class="tc-str">'talon_close'</span>: [<span class="tc-str">'void'</span>, [<span class="tc-str">'pointer'</span>]],
&#125;);
<span class="tc-kw">const</span> db = talon.<span class="tc-ac">talon_open</span>(<span class="tc-str">'./my_data'</span>);
<span class="tc-kw">const</span> out = ref.alloc(<span class="tc-str">'string'</span>);
`,
  (cmd, comment) => `${comment ? `\n<span class="tc-cm">// ${comment}</span>` : ''}
talon.<span class="tc-ac">talon_execute</span>(db, JSON.stringify(${cmd}), out);
console.log(out.deref());`,
  `
talon.<span class="tc-ac">talon_close</span>(db);`,
  'index.mjs', '$ node index.mjs'
);

// --- Java ---
const java = ffiEx(
  `<span class="tc-kw">import</span> com.sun.jna.*;
<span class="tc-kw">import</span> com.sun.jna.ptr.PointerByReference;

<span class="tc-kw">public class</span> <span class="tc-ty">Main</span> &#123;
    <span class="tc-kw">public interface</span> <span class="tc-ty">Talon</span> <span class="tc-kw">extends</span> Library &#123;
        Talon LIB = Native.load(<span class="tc-str">"talon"</span>, Talon.<span class="tc-kw">class</span>);
        Pointer <span class="tc-fn">talon_open</span>(String p);
        <span class="tc-ty">int</span> <span class="tc-fn">talon_execute</span>(Pointer h, String cmd, PointerByReference out);
        <span class="tc-ty">void</span> <span class="tc-fn">talon_close</span>(Pointer h);
        <span class="tc-ty">void</span> <span class="tc-fn">talon_free_string</span>(Pointer p);
    &#125;
    <span class="tc-kw">public static void</span> <span class="tc-fn">main</span>(String[] args) &#123;
        Pointer db = Talon.LIB.<span class="tc-ac">talon_open</span>(<span class="tc-str">"./my_data"</span>);
        PointerByReference out = <span class="tc-kw">new</span> PointerByReference();
`,
  (cmd, comment) => `${comment ? `\n        <span class="tc-cm">// ${comment}</span>` : ''}
        Talon.LIB.<span class="tc-ac">talon_execute</span>(db, <span class="tc-str">"${cmd.replace(/"/g, '\\"')}"</span>, out);
        System.out.println(out.getValue().getString(<span class="tc-num">0</span>));
        Talon.LIB.<span class="tc-ac">talon_free_string</span>(out.getValue());`,
  `
        Talon.LIB.<span class="tc-ac">talon_close</span>(db);
    &#125;
&#125;`,
  'Main.java', '$ javac Main.java && java Main'
);

// --- C/C++ ---
const cpp = ffiEx(
  `<span class="tc-kw">#include</span> <span class="tc-str">&lt;stdio.h&gt;</span>
<span class="tc-kw">#include</span> <span class="tc-str">"talon.h"</span>

<span class="tc-ty">int</span> <span class="tc-fn">main</span>() &#123;
    TalonHandle *db = <span class="tc-ac">talon_open</span>(<span class="tc-str">"./my_data"</span>);
    <span class="tc-ty">char</span> *json = <span class="tc-num">NULL</span>;
`,
  (cmd, comment) => `${comment ? `\n    <span class="tc-cm">// ${comment}</span>` : ''}
    <span class="tc-ac">talon_execute</span>(db, <span class="tc-str">"${cmd.replace(/"/g, '\\"')}"</span>, &amp;json);
    printf(<span class="tc-str">"%s\\n"</span>, json);
    <span class="tc-ac">talon_free_string</span>(json);`,
  `
    <span class="tc-ac">talon_close</span>(db);
    <span class="tc-kw">return</span> <span class="tc-num">0</span>;
&#125;`,
  'main.c', '$ gcc main.c -ltalon -o demo && ./demo'
);

// --- .NET ---
const dotnet = ffiEx(
  `<span class="tc-kw">using</span> System;
<span class="tc-kw">using</span> System.Runtime.InteropServices;

<span class="tc-kw">class</span> <span class="tc-ty">Talon</span> &#123;
    [DllImport(<span class="tc-str">"talon"</span>)] <span class="tc-kw">static extern</span> IntPtr <span class="tc-fn">talon_open</span>(<span class="tc-kw">string</span> p);
    [DllImport(<span class="tc-str">"talon"</span>)] <span class="tc-kw">static extern int</span> <span class="tc-fn">talon_execute</span>(IntPtr h, <span class="tc-kw">string</span> cmd, <span class="tc-kw">out</span> IntPtr json);
    [DllImport(<span class="tc-str">"talon"</span>)] <span class="tc-kw">static extern void</span> <span class="tc-fn">talon_close</span>(IntPtr h);
    [DllImport(<span class="tc-str">"talon"</span>)] <span class="tc-kw">static extern void</span> <span class="tc-fn">talon_free_string</span>(IntPtr p);

    <span class="tc-kw">static void</span> <span class="tc-fn">Main</span>() &#123;
        <span class="tc-kw">var</span> db = <span class="tc-ac">talon_open</span>(<span class="tc-str">"./my_data"</span>);
        IntPtr json;
`,
  (cmd, comment) => `${comment ? `\n        <span class="tc-cm">// ${comment}</span>` : ''}
        <span class="tc-ac">talon_execute</span>(db, <span class="tc-str">@"${cmd.replace(/"/g, '""')}"</span>, <span class="tc-kw">out</span> json);
        Console.WriteLine(Marshal.PtrToStringAnsi(json));
        <span class="tc-ac">talon_free_string</span>(json);`,
  `
        <span class="tc-ac">talon_close</span>(db);
    &#125;
&#125;`,
  'Program.cs', '$ dotnet run'
);

export const sdkExamples: Record<string, SdkExample[]> = {
  Go: go,
  Rust: rust,
  Python: python,
  'Node.js': nodejs,
  Java: java,
  'C/C++': cpp,
  '.NET': dotnet,
};
