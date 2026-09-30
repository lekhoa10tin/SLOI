const R=String.raw;
// n=tên, t=lý thuyết, c=ví dụ C++ có ghi chú, p=5 đề bài (có giới hạn để chấm độ phức tạp)
const D=[
{n:"Sắp xếp & Tìm kiếm nhị phân",
t:"Độ phức tạp: 10^8 phép tính đơn giản ≈ 1 giây. <b>sort</b> chạy O(n log n). <b>Tìm kiếm nhị phân</b> trên dãy đã sắp xếp mất O(log n): dùng <code>lower_bound</code>/<code>upper_bound</code>. Kỹ thuật <b>nhị phân đáp án</b>: khi bài toán có tính đơn điệu (đáp án x thỏa thì x+1 cũng thỏa), ta nhị phân trên đáp án và kiểm tra bằng hàm check().",
c:R`// Nhị phân đáp án: tìm x nhỏ nhất thỏa check(x)
long long lo = 0, hi = 1e9;        // đáp án nằm trong [lo, hi]
while (lo < hi) {
    long long mid = (lo + hi) / 2; // phần tử giữa
    if (check(mid)) hi = mid;      // mid thỏa -> thử nhỏ hơn
    else lo = mid + 1;             // mid chưa thỏa -> phải lớn hơn
}
cout << lo;                        // lo = đáp án`,
},
{n:"Cộng dồn, Mảng hiệu, Hai con trỏ",
t:"<b>Mảng cộng dồn</b> p[i]=a[1]+...+a[i]: tổng đoạn [l,r] = p[r]-p[l-1] trong O(1). <b>Mảng hiệu</b> d cho phép cộng x vào đoạn [l,r] trong O(1): d[l]+=x, d[r+1]-=x, cuối cùng cộng dồn d. <b>Hai con trỏ</b> (cửa sổ trượt) duyệt l, r chỉ tiến, tổng O(n).",
c:R`// Cộng x vào đoạn [l, r] bằng mảng hiệu
d[l] += x;          // từ l trở đi tăng x
d[r + 1] -= x;      // sau r thì trả lại
// sau mọi cập nhật: cộng dồn để ra mảng thật
for (int i = 1; i <= n; i++) {
    d[i] += d[i - 1];
    a[i] += d[i];
}`,
},
{n:"Tham lam (Greedy)",
t:"<b>Tham lam</b>: mỗi bước chọn phương án tốt nhất cục bộ. Cần chứng minh bằng phản chứng hoặc biến đổi tương đương. Các mẫu quen thuộc: sắp xếp rồi chọn (chọn hoạt động: sắp theo thời điểm kết thúc), ghép cặp nhỏ nhất với lớn nhất, dùng priority_queue để luôn lấy phần tử tốt nhất.",
c:R`// Chọn nhiều đoạn không giao nhau nhất
sort(v.begin(), v.end(), [](auto &x, auto &y){
    return x.second < y.second;      // sắp theo điểm kết thúc tăng dần
});
int cnt = 0, last = -1;
for (auto &[s, e] : v)
    if (s >= last) { cnt++; last = e; } // đoạn bắt đầu sau khi đoạn trước kết thúc`,
},
{n:"Vét cạn, Quay lui, Bitmask",
t:"<b>Vét cạn</b> thử mọi khả năng, dùng khi n nhỏ (n ≤ 20 với 2^n, n ≤ 10 với n!). <b>Quay lui</b> (backtracking) sinh nghiệm từng bước và cắt nhánh sớm khi không hợp lệ. <b>Bitmask</b> biểu diễn tập con bằng số nguyên: bit i bằng 1 nghĩa là chọn phần tử i.",
c:R`// Duyệt mọi tập con của n phần tử bằng bitmask
for (int mask = 0; mask < (1 << n); mask++) {
    long long sum = 0;
    for (int i = 0; i < n; i++)
        if (mask >> i & 1)       // bit i bằng 1 -> chọn phần tử i
            sum += a[i];
    if (sum == S) ans++;         // đếm tập con có tổng S
}`,
},
{n:"Toán học & Số học",
t:"<b>UCLN</b> Euclid O(log); BCNN = a/gcd·b. <b>Sàng Eratosthenes</b> O(n log log n). <b>Lũy thừa nhanh</b> a^b mod m O(log b). <b>Nghịch đảo modulo</b> khi m nguyên tố: a^(m-2) (định lý Fermat nhỏ). <b>Phân tích thừa số</b> thử chia đến √n. Nhớ dùng long long và lấy mod sau mỗi phép nhân.",
c:R`// Lũy thừa nhanh: a^b mod m
long long power(long long a, long long b, long long m) {
    long long r = 1;
    a %= m;
    while (b > 0) {
        if (b & 1) r = r * a % m;  // bit 1 -> nhân vào kết quả
        a = a * a % m;             // bình phương a
        b >>= 1;                   // sang bit tiếp
    }
    return r;
}`,
},
{n:"Quy hoạch động cơ bản",
t:"<b>QHĐ</b>: chia bài toán thành bài toán con gối nhau và lưu kết quả. Các bước: định nghĩa trạng thái dp, viết công thức truy hồi, khởi tạo, chọn thứ tự tính. Bài kinh điển: cái túi 0/1, dãy con tăng dài nhất (LIS, O(n log n) bằng nhị phân), dãy con chung dài nhất (LCS), đường đi trên bảng, đổi tiền.",
c:R`// Cái túi 0/1: dp[j] = giá trị lớn nhất với sức chứa j
vector<long long> dp(W + 1, 0);
for (int i = 0; i < n; i++)
    for (int j = W; j >= w[i]; j--)   // chạy ngược: mỗi món chỉ dùng 1 lần
        dp[j] = max(dp[j], dp[j - w[i]] + v[i]);
cout << dp[W];`,
},
{n:"QHĐ nâng cao: Bitmask & Cây",
t:"<b>QHĐ bitmask</b>: dp[mask] với mask là tập đã xử lý, dùng khi n ≤ 20, độ phức tạp O(2^n·n). Ví dụ: người bán hàng (TSP), ghép cặp. <b>QHĐ trên cây</b>: dfs từ gốc, dp[u] tính từ dp của các con (kích thước cây con, đường kính, tập độc lập lớn nhất). Cẩn thận đệ quy sâu khi n lớn.",
c:R`// dp trên cây: dp[u][0/1] = tập độc lập lớn nhất, u không chọn / có chọn
void dfs(int u, int p) {
    dp[u][1] = 1;                         // chọn u: được 1
    for (int v : adj[u]) if (v != p) {
        dfs(v, u);
        dp[u][0] += max(dp[v][0], dp[v][1]); // u không chọn: con tùy ý
        dp[u][1] += dp[v][0];                // u chọn: con không được chọn
    }
}`,
},
{n:"Đồ thị: BFS, DFS, Thành phần liên thông",
t:"Lưu đồ thị bằng <b>danh sách kề</b> vector<int> adj[N]. <b>DFS</b> đi sâu, <b>BFS</b> theo tầng dùng queue và cho đường đi ngắn nhất khi cạnh không trọng số, O(n+m). Ứng dụng: đếm thành phần liên thông, kiểm tra đồ thị hai phía, sắp xếp topo, BFS trên lưới, BFS đa nguồn.",
c:R`// BFS: d[v] = số cạnh ít nhất từ s tới v
vector<int> d(n + 1, -1);
queue<int> q;
d[s] = 0; q.push(s);
while (!q.empty()) {
    int u = q.front(); q.pop();       // lấy đỉnh đầu hàng đợi
    for (int v : adj[u])
        if (d[v] == -1) {             // chưa thăm
            d[v] = d[u] + 1;
            q.push(v);
        }
}`,
},
{n:"Đường đi ngắn nhất",
t:"<b>Dijkstra</b> với priority_queue: O((n+m) log n), chỉ dùng khi trọng số không âm. <b>Bellman-Ford</b> O(nm) xử lý trọng số âm và phát hiện chu trình âm. <b>Floyd-Warshall</b> O(n³) cho mọi cặp đỉnh, n ≤ 400. <b>0-1 BFS</b> dùng deque khi trọng số chỉ 0 hoặc 1. Nhớ dùng long long cho khoảng cách.",
c:R`// Dijkstra với hàng đợi ưu tiên (min-heap)
priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
dist[s] = 0; pq.push({0, s});
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;            // bản ghi cũ, bỏ qua
    for (auto [v, w] : adj[u])
        if (dist[u] + w < dist[v]) {      // tìm được đường ngắn hơn
            dist[v] = dist[u] + w;
            pq.push({dist[v], v});
        }
}`,
},
{n:"DSU & Cây khung nhỏ nhất",
t:"<b>DSU</b> (Disjoint Set Union) gộp và hỏi cùng tập gần như O(1) nhờ nén đường đi và gộp theo kích thước. <b>Cây khung nhỏ nhất</b>: Kruskal sắp xếp cạnh tăng dần rồi nối bằng DSU, O(m log m). Prim dùng priority_queue. Ứng dụng: kiểm tra liên thông động, gom nhóm, chu trình.",
c:R`// DSU với nén đường đi
int find(int x) {
    return p[x] == x ? x : p[x] = find(p[x]); // gán lại gốc để lần sau nhanh
}
bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;                 // đã cùng tập
    if (sz[a] < sz[b]) swap(a, b);
    p[b] = a; sz[a] += sz[b];                 // gắn cây nhỏ vào cây lớn
    return true;
}`,
},
{n:"Fenwick, Segment Tree, Sparse Table, LCA",
t:"<b>Fenwick (BIT)</b> cập nhật điểm và tổng tiền tố O(log n), code ngắn. <b>Segment Tree</b> xử lý min/max/tổng trên đoạn, cập nhật điểm hoặc cả đoạn (lazy propagation). <b>Sparse Table</b> trả lời min/max đoạn O(1) khi dữ liệu tĩnh, dựng O(n log n). <b>LCA</b> bằng binary lifting up[k][v] O(log n) mỗi truy vấn.",
c:R`// Fenwick tree: cập nhật điểm, tổng tiền tố
void update(int i, long long x) {
    for (; i <= n; i += i & -i) bit[i] += x;   // đi lên theo bit thấp nhất
}
long long query(int i) {                        // tổng a[1..i]
    long long s = 0;
    for (; i > 0; i -= i & -i) s += bit[i];     // đi xuống bỏ bit thấp nhất
    return s;
}`,
},
{n:"Xâu: Hash, KMP, Z, Trie",
t:"<b>Băm xâu</b> (polynomial hash) so sánh xâu con trong O(1) sau khi tiền xử lý; nên dùng mod 2^61-1 hoặc hai mod để tránh va chạm. <b>KMP</b> dùng mảng tiền tố-hậu tố pi, tìm mẫu trong O(n+m). <b>Z-function</b> tương tự cho tiền tố. <b>Trie</b> lưu tập xâu, hỏi tiền tố nhanh, dùng cả cho XOR lớn nhất trên bit.",
c:R`// KMP: pi[i] = độ dài tiền tố dài nhất (khác cả xâu) cũng là hậu tố của s[0..i]
vector<int> pi(n, 0);
for (int i = 1; i < n; i++) {
    int k = pi[i - 1];
    while (k > 0 && s[i] != s[k]) k = pi[k - 1]; // lùi về tiền tố ngắn hơn
    if (s[i] == s[k]) k++;                        // khớp thêm 1 ký tự
    pi[i] = k;
}`,
}
];
// Giải thích chi tiết cho 12 chuyên đề gốc (đúng thứ tự mảng D)
const XD=[
`<p><b>Hình dung:</b> giống tra từ điển. Mở giữa cuốn, đáp án ở nửa trước hay nửa sau thì bỏ nửa còn lại. Mỗi lần bỏ một nửa nên n = 10^9 chỉ cần khoảng 30 lần.</p><p><b>Điều kiện:</b> dãy đã sắp xếp, hoặc hàm check(x) có dạng "sai, sai, ..., đúng, đúng".</p><p><b>lower_bound</b> trả về vị trí đầu tiên có giá trị ≥ x, <b>upper_bound</b> trả về vị trí đầu tiên có giá trị &gt; x. Hiệu hai vị trí chính là số lần x xuất hiện.</p><p><b>Lỗi hay gặp:</b> chặn hi quá nhỏ; lặp vô hạn khi viết lo = mid thay vì lo = mid + 1; tràn int khi lo + hi lớn.</p>`,
`<p><b>Ví dụ:</b> a = [2,5,1,3] thì p = [0,2,7,8,11] (p[0] = 0). Tổng đoạn [2,3] = p[3] - p[1] = 8 - 2 = 6 = 5 + 1.</p><p><b>Mảng hiệu</b> là phép "ngược" của cộng dồn: đánh dấu chỗ bắt đầu tăng (+x) và chỗ kết thúc (-x), rồi cộng dồn để giá trị lan ra cả đoạn. Nhờ đó q lần cập nhật đoạn chỉ tốn O(q + n).</p><p><b>Hai con trỏ:</b> với dãy toàn số dương, tổng chưa đủ thì đẩy r, tổng đã đủ thì đẩy l. Mỗi con trỏ chỉ đi tới nên O(n). Nếu có số âm thì không dùng được, hãy dùng cộng dồn kết hợp map.</p>`,
`<p><b>Cách kiểm tra tham lam có đúng không:</b> so sánh với vét cạn trên dữ liệu nhỏ.</p><p><b>Ví dụ đúng:</b> đổi tiền với mệnh giá 1, 5, 10, 50 thì lấy tờ lớn nhất trước là tối ưu vì mệnh giá sau chia hết cho mệnh giá trước.</p><p><b>Ví dụ sai:</b> mệnh giá 1, 3, 4 đổi 6, tham lam lấy 4+1+1 (3 tờ) nhưng đúng là 3+3 (2 tờ). Trường hợp này phải dùng quy hoạch động.</p><p><b>Chọn hoạt động:</b> chọn đoạn kết thúc sớm nhất để chừa nhiều chỗ nhất cho các đoạn sau. Dấu hiệu nhận biết: đề hỏi "nhiều nhất / ít nhất" và có thể sắp xếp dữ liệu.</p>`,
`<p><b>Ước lượng trước khi code:</b> 2^20 ≈ 10^6 (ổn), 10! ≈ 3,6·10^6 (ổn), 20! (quá lớn).</p><p><b>Khung quay lui:</b> chọn một lựa chọn, gọi đệ quy, rồi bỏ lựa chọn để trả về trạng thái cũ. <b>Cắt nhánh:</b> nếu nhánh hiện tại chắc chắn không tốt hơn đáp án đang có thì dừng ngay.</p><p><b>Bitmask cần nhớ:</b> (1&lt;&lt;i) là số chỉ có bit i; mask | (1&lt;&lt;i) thêm phần tử i; mask &amp; (1&lt;&lt;i) kiểm tra; mask ^ (1&lt;&lt;i) đảo bit; __builtin_popcount(mask) đếm số phần tử.</p>`,
`<p><b>UCLN:</b> gcd(a,b) = gcd(b, a%b) vì mọi ước chung của a và b cũng chia hết a%b.</p><p><b>Sàng:</b> với mỗi số nguyên tố p, gạch các bội p·p, p·p+p, ... Bắt đầu từ p² vì các bội nhỏ hơn đã bị ước nhỏ hơn gạch rồi.</p><p><b>Lũy thừa nhanh:</b> 3^13 với 13 = 1101 (nhị phân) nên 3^13 = 3^8 · 3^4 · 3^1, chỉ cần 4 bước thay vì 13.</p><p><b>Tổ hợp mod p:</b> C(n,k) = n! · inv(k!) · inv((n-k)!), tính sẵn giai thừa và nghịch đảo.</p><p><b>Lỗi hay gặp:</b> a·b với a, b ~ 10^9 tràn int, phải dùng long long.</p>`,
`<p><b>Tự hỏi 3 câu:</b> (1) dp[i] nghĩa là gì? (2) dp[i] tính từ những trạng thái nhỏ hơn nào? (3) trạng thái nhỏ nhất bằng bao nhiêu?</p><p><b>Ví dụ:</b> Fibonacci dp[i] = dp[i-1] + dp[i-2]. Đệ quy thuần tính lặp lại hàng triệu lần, QHĐ chỉ tính mỗi giá trị một lần.</p><p><b>Cái túi:</b> chạy j từ lớn xuống nhỏ để dp[j - w] vẫn là giá trị "trước khi xét món i" nên mỗi món dùng đúng một lần. Chạy xuôi sẽ thành túi vô hạn.</p><p><b>LIS O(n log n):</b> giữ mảng tail[len] = giá trị cuối nhỏ nhất của dãy tăng độ dài len; với mỗi x, dùng lower_bound để thay phần tử đầu tiên ≥ x (hoặc thêm vào cuối).</p><p><b>LCS:</b> nếu s[i] = t[j] thì dp[i][j] = dp[i-1][j-1] + 1, ngược lại dp[i][j] = max(dp[i-1][j], dp[i][j-1]).</p>`,
`<p><b>TSP:</b> dp[mask][i] là chi phí nhỏ nhất khi đã thăm tập mask và đang đứng ở i. Chuyển sang j chưa thuộc mask: dp[mask | 1&lt;&lt;j][j] = min(dp[mask][i] + c[i][j]). Đáp án là min của dp[đủ][i] + c[i][đỉnh 1]. Độ phức tạp chính xác là O(2^n · n²), với n ≤ 16 vẫn chạy tốt.</p><p><b>QHĐ trên cây:</b> tính các con trước rồi mới tính cha. Với cây dạng "dây chuyền" 2·10^5 đỉnh, đệ quy có thể tràn stack; khi đó dùng thứ tự BFS rồi duyệt ngược lại để thay thế đệ quy.</p>`,
`<p><b>BFS</b> như vết dầu loang: các đỉnh cách nguồn 1 cạnh được xét hết rồi mới đến 2 cạnh, nên lần đầu chạm tới đỉnh v chính là đường ngắn nhất. <b>DFS</b> như đi mê cung: đâm sâu đến ngõ cụt rồi quay lui.</p><p><b>Đếm thành phần liên thông:</b> với mỗi đỉnh chưa thăm, tăng đếm rồi loang từ nó.</p><p><b>Đồ thị hai phía:</b> tô màu xen kẽ khi loang; gặp cạnh nối hai đỉnh cùng màu thì không phải hai phía.</p><p><b>Lưới:</b> dùng dx[] = {1,-1,0,0}, dy[] = {0,0,1,-1} để duyệt 4 ô kề, nhớ kiểm tra không ra ngoài biên.</p>`,
`<p><b>Dijkstra:</b> luôn chốt đỉnh chưa chốt có dist nhỏ nhất. Đúng vì trọng số không âm nên không đường vòng nào làm nó nhỏ hơn được. Dòng <code>if (d &gt; dist[u]) continue;</code> bỏ các bản ghi lỗi thời còn nằm trong heap.</p><p><b>Chọn thuật toán:</b> không trọng số → BFS; trọng số 0/1 → 0-1 BFS; không âm → Dijkstra; có cạnh âm → Bellman-Ford; mọi cặp với n ≤ 400 → Floyd-Warshall.</p><p><b>Lưu ý:</b> khởi tạo dist bằng số rất lớn (ví dụ 1e18) và không cộng INF + w khi chưa đến được đỉnh đó.</p>`,
`<p><b>DSU</b> giống các nhóm bạn: find(x) hỏi "trưởng nhóm của x là ai", unite(a,b) gộp hai nhóm. Nén đường đi: mọi đỉnh trên đường lên gốc được gắn thẳng vào gốc, lần sau hỏi gần như tức thì.</p><p><b>Kruskal:</b> duyệt cạnh từ nhẹ đến nặng, cạnh nào nối hai nhóm khác nhau thì lấy (không tạo chu trình). Lấy đủ n-1 cạnh là xong; nếu không đủ thì đồ thị không liên thông.</p>`,
`<p><b>Fenwick:</b> ô bit[i] quản lý đoạn có độ dài (i &amp; -i) kết thúc tại i. Ví dụ bit[6] quản lý a[5..6], bit[8] quản lý a[1..8].</p><p><b>Segment Tree:</b> nút gốc quản lý [1,n], mỗi nút chia đôi cho hai con. Một truy vấn đoạn được tách thành O(log n) nút. <b>Lazy:</b> ghi chú "chưa cộng cho các con" tại nút, chỉ đẩy xuống khi thật sự cần đi qua.</p><p><b>Sparse Table:</b> st[k][i] là min của 2^k phần tử bắt đầu từ i. Truy vấn [l,r]: k = log2(r-l+1), đáp án min(st[k][l], st[k][r-2^k+1]). Hai đoạn chồng nhau không sao vì min không bị đếm trùng.</p><p><b>LCA:</b> đưa hai đỉnh về cùng độ sâu, rồi cùng nhảy lên bằng các bước 2^k lớn trước khi hai tổ tiên còn khác nhau; cha chung là đích.</p>`,
`<p><b>Băm:</b> h(s) = s[0]·B^(k-1) + ... + s[k-1]. Hash đoạn [l,r] = H[r+1] - H[l]·P[r-l+1]. Hai hash khác nhau thì chắc chắn khác; giống nhau thì gần như chắc chắn giống.</p><p><b>KMP:</b> pi[i] cho biết khi so lệch thì lùi về đâu mà không phải so lại từ đầu. Tìm p trong t: xét xâu p + "#" + t, chỗ nào pi = |p| là một lần xuất hiện.</p><p><b>Chu kỳ nhỏ nhất:</b> d = n - pi[n-1]; nếu n chia hết cho d thì chu kỳ là d, ngược lại là n.</p><p><b>Trie:</b> mỗi nút có 2 con (nếu duyệt theo bit) hoặc 26 con (nếu duyệt theo chữ cái).</p>`
];

// Các thuật toán bổ sung (chỉ hiện ở phần Lý thuyết)
const EXTRA=[
{n:"Stack, Queue, Deque & Stack đơn điệu",
t:"<b>Stack</b> (vào sau ra trước), <b>queue</b> (vào trước ra trước), <b>deque</b> (thêm/bớt cả hai đầu). <b>Stack đơn điệu</b> giữ các phần tử theo thứ tự tăng hoặc giảm để tìm 'phần tử lớn hơn gần nhất bên phải' cho mọi vị trí trong O(n): mỗi phần tử chỉ vào và ra stack đúng một lần. Cũng dùng cho bài hình chữ nhật lớn nhất trong biểu đồ cột và kiểm tra ngoặc hợp lệ.",
c:R`// nxt[i] = chỉ số j > i gần nhất có a[j] > a[i], không có thì -1
vector<int> nxt(n, -1);
stack<int> st;                        // lưu chỉ số, giá trị a giảm dần từ đáy lên
for (int i = 0; i < n; i++) {
    while (!st.empty() && a[st.top()] < a[i]) {
        nxt[st.top()] = i;            // a[i] là phần tử lớn hơn đầu tiên của nó
        st.pop();
    }
    st.push(i);
}`},
{n:"Deque: min/max cửa sổ trượt",
t:"Tìm min của mọi đoạn k phần tử liên tiếp trong O(n). Giữ deque các chỉ số sao cho giá trị tăng dần từ đầu đến cuối: phần tử mới lớn hơn sẽ đẩy các phần tử cũ lớn hơn ra khỏi cuối (chúng không bao giờ là min nữa), còn đầu deque luôn là min của cửa sổ; đầu nào ra khỏi cửa sổ thì bỏ.",
c:R`deque<int> dq;                                       // lưu chỉ số
for (int i = 0; i < n; i++) {
    while (!dq.empty() && a[dq.back()] >= a[i]) dq.pop_back(); // bỏ phần tử vô dụng
    dq.push_back(i);
    if (dq.front() <= i - k) dq.pop_front();           // đầu deque đã ra khỏi cửa sổ
    if (i >= k - 1) cout << a[dq.front()] << ' ';      // đầu deque = min cửa sổ
}`},
{n:"Rời rạc hóa (nén tọa độ)",
t:"Khi giá trị rất lớn (đến 10^9) nhưng chỉ có ít giá trị khác nhau, ta thay mỗi giá trị bằng thứ hạng của nó trong dãy đã sắp xếp và bỏ trùng. Thứ tự tương đối được giữ nguyên nên có thể dùng làm chỉ số cho Fenwick, mảng đếm, v.v.",
c:R`vector<int> b = a;
sort(b.begin(), b.end());
b.erase(unique(b.begin(), b.end()), b.end());  // b: các giá trị phân biệt, tăng dần
for (int &x : a)
    x = lower_bound(b.begin(), b.end(), x) - b.begin() + 1; // thứ hạng từ 1`},
{n:"Kadane: dãy con liên tiếp có tổng lớn nhất",
t:"Gọi cur là tổng lớn nhất của đoạn kết thúc tại i. Có hai lựa chọn: bắt đầu đoạn mới từ a[i], hoặc nối tiếp đoạn trước. Đây là QHĐ một chiều, chạy O(n), dùng được cả khi toàn số âm.",
c:R`long long cur = a[0], best = a[0];
for (int i = 1; i < n; i++) {
    cur = max((long long)a[i], cur + a[i]);  // bắt đầu mới hoặc nối tiếp
    best = max(best, cur);                   // cập nhật đáp án
}
cout << best;`},
{n:"Sắp xếp topo (Kahn)",
t:"Áp dụng cho đồ thị có hướng không chu trình (DAG): xếp các đỉnh sao cho mọi cạnh u→v đều có u đứng trước v. Lặp lại: lấy đỉnh có bậc vào bằng 0, xếp nó, rồi giảm bậc vào của các đỉnh kề. Nếu cuối cùng xếp được ít hơn n đỉnh thì có chu trình. Dùng priority_queue để được thứ tự từ điển nhỏ nhất.",
c:R`priority_queue<int, vector<int>, greater<int>> pq;
vector<int> order;
for (int i = 1; i <= n; i++) if (indeg[i] == 0) pq.push(i);
while (!pq.empty()) {
    int u = pq.top(); pq.pop();
    order.push_back(u);
    for (int v : adj[u])
        if (--indeg[v] == 0) pq.push(v);   // hết điều kiện chờ thì đưa vào
}
if ((int)order.size() < n) cout << -1;      // còn đỉnh kẹt => có chu trình`},
{n:"Bellman-Ford & 0-1 BFS",
t:"<b>Bellman-Ford</b> nới lỏng tất cả cạnh, lặp tối đa n vòng; nếu vòng thứ n vẫn còn cải thiện thì có chu trình âm. Khởi tạo mọi dist = 0 để phát hiện chu trình âm ở bất kỳ đâu. <b>0-1 BFS</b>: cạnh trọng số 0 đẩy vào đầu deque, cạnh trọng số 1 đẩy vào cuối, chạy O(n+m).",
c:R`// Bellman-Ford: có chu trình âm không?
vector<long long> dist(n + 1, 0);
bool neg = false;
for (int it = 1; it <= n; it++) {
    bool changed = false;
    for (auto &[u, v, w] : edges)
        if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; changed = true; }
    if (!changed) break;
    if (it == n) neg = true;          // vòng n vẫn đổi => chu trình âm
}
// 0-1 BFS: nới lỏng cạnh (u -> v, w) với w bằng 0 hoặc 1
if (dist[u] + w < dist[v]) {
    dist[v] = dist[u] + w;
    if (w == 0) dq.push_front(v); else dq.push_back(v);
}`},
{n:"Kruskal (cây khung nhỏ nhất)",
t:"Sắp xếp cạnh theo trọng số tăng dần, dùng DSU (hàm unite ở chuyên đề DSU) để chỉ lấy cạnh nối hai thành phần khác nhau. Số cạnh lấy được nhỏ hơn n-1 nghĩa là đồ thị không liên thông. Biến thể 'giảm cạnh lớn nhất trên đường đi' (minimax) cũng giải bằng cách dừng ngay khi 1 và n đã cùng tập.",
c:R`sort(edges.begin(), edges.end());        // edges: {w, u, v}, sắp theo w tăng
long long total = 0; int cnt = 0;
for (auto &[w, u, v] : edges)
    if (unite(u, v)) {                      // hai đầu ở hai nhóm khác nhau
        total += w; cnt++;
    }
if (cnt < n - 1) total = -1;                // không liên thông
cout << total;`},
{n:"LCA bằng Binary Lifting",
t:"up[k][v] là tổ tiên cách v đúng 2^k bước. Dựng bảng bằng up[k][v] = up[k-1][up[k-1][v]] (nhảy hai lần 2^(k-1)). Truy vấn: nâng đỉnh sâu hơn lên cùng độ sâu, nếu trùng thì xong; nếu không thì nhảy cả hai lên từ k lớn đến nhỏ khi hai tổ tiên còn khác nhau, cuối cùng LCA là cha của một trong hai. Dựng O(n log n), mỗi truy vấn O(log n).",
c:R`const int LOG = 18;                        // 2^18 > 2*10^5
// up[0][v] = cha của v (gốc trỏ về chính nó hoặc 0), depth[v] tính bằng dfs/bfs
for (int k = 1; k < LOG; k++)
    for (int v = 1; v <= n; v++)
        up[k][v] = up[k-1][up[k-1][v]];
int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);
    int diff = depth[u] - depth[v];
    for (int k = 0; k < LOG; k++)
        if (diff >> k & 1) u = up[k][u];    // đưa u lên cùng độ sâu với v
    if (u == v) return u;
    for (int k = LOG - 1; k >= 0; k--)
        if (up[k][u] != up[k][v]) { u = up[k][u]; v = up[k][v]; }
    return up[0][u];
}`},
{n:"Trie nhị phân: XOR lớn nhất",
t:"Lưu mỗi số như một đường đi theo các bit từ cao xuống thấp. Để tìm số cho XOR lớn nhất với x, ở mỗi bit ưu tiên rẽ sang nhánh có bit ngược với x (nếu có), vì bit cao quan trọng hơn mọi bit thấp cộng lại. Độ phức tạp O(30) cho mỗi số.",
c:R`int ch[200005 * 30][2], cnt = 1;            // nút 0 là gốc, 0 cũng nghĩa là 'chưa có'
void add(int x) {
    int u = 0;
    for (int b = 29; b >= 0; b--) {
        int c = x >> b & 1;
        if (!ch[u][c]) ch[u][c] = cnt++;    // tạo nút m   i nếu chưa có
        u = ch[u][c];
    }
}
int best(int x) {                            // max của x XOR y với y đã thêm
    int u = 0, r = 0;
    for (int b = 29; b >= 0; b--) {
        int c = x >> b & 1;
        if (ch[u][c ^ 1]) { r |= 1 << b; u = ch[u][c ^ 1]; } // rẽ ngược bit
        else u = ch[u][c];
    }
    return r;
}`},
{n:"Meet in the middle",
t:"Khi n ≈ 40 thì 2^n quá lớn nhưng 2^(n/2) ≈ 10^6 thì được. Chia dãy làm hai nửa, liệt kê tổng mọi tập con của từng nửa, sắp xếp một bên rồi với mỗi tổng x của nửa kia, tìm S - x b   ng nhị phân. Tổng độ phức tạp khoảng O(2^(n/2) · n).",
c:R`// L, Rr: tổng mọi tập con của nửa trái và nửa phải
sort(Rr.begin(), Rr.end());
long long ans = 0;
for (long long x : L)                        // đếm cặp có tổng bằng S
    ans += upper_bound(Rr.begin(), Rr.end(), S - x)
         - lower_bound(Rr.begin(), Rr.end(), S - x);`}
];
const $=s=>document.querySelector(s),app=$('#app'),esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
let best={};try{best=JSON.parse(localStorage.getItem('sloi_cpp')||'{}')}catch(e){}
const save=()=>{try{localStorage.setItem('sloi_cpp_'+USER,JSON.stringify(best))}catch(e){}};
const fmt=ms=>{const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
let R2=null;
const TPL="#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    \n    return 0;\n}\n";
// ===== ĐĂNG NHẬP / ĐĂNG KÝ (tài khoản lưu ngay trong trình duyệt) =====
let USER=null;
const UK='sloi_users',SK='sloi_session';
const getU=()=>{try{return JSON.parse(localStorage.getItem(UK)||'{}')}catch(e){return {}}};
const setU=u=>{try{localStorage.setItem(UK,JSON.stringify(u))}catch(e){}};
async function hashPw(s){
  try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  catch(e){let h=5381;for(const c of s)h=(h*33)^c.charCodeAt(0);return 'x'+(h>>>0).toString(16)}
}
function userBox(){
  let b=document.getElementById('uBox');
  if(!b){b=document.createElement('span');b.id='uBox';b.style.cssText='display:flex;align-items:center;gap:6px;margin-left:8px';document.querySelector('nav').appendChild(b)}
  b.innerHTML=USER?`<span class="mut">👤 ${esc(USER)}</span><button class="sec" onclick="logout()">Đăng xuất</button>`:'';
}
function loginAs(name){
  USER=name;try{localStorage.setItem(SK,name)}catch(e){}
  try{best=JSON.parse(localStorage.getItem('sloi_cpp_'+name)||'{}')}catch(e){best={}}
  userBox();
}
function logout(){
  if(R2)clearInterval(R2.iv);if(typeof simStop=='function')simStop();
  USER=null;best={};try{localStorage.removeItem(SK)}catch(e){}
  userBox();app.innerHTML='';
  const h=document.querySelector('.hero-section');if(h)h.style.display='';
  window.scrollTo(0,0);
}
function showAuth(cb,reg){
  let o=document.getElementById('authBox');if(o)o.remove();
  o=document.createElement('div');o.id='authBox';
  o.style.cssText='position:fixed;inset:0;background:#000a;z-index:200;display:flex;align-items:center;justify-content:center;padding:16px';
  o.innerHTML=`<div class="card" style="width:100%;max-width:380px;margin:0"><h2 style="text-align:center">${reg?'Đăng ký tài khoản':'Đăng nhập'}</h2><p class="mut" style="text-align:center">Hãy đăng nhập để sử dụng SLOI</p>
<p><input class="ans" id="au" placeholder="Tên tài khoản" autocomplete="username"></p>
<p><input class="ans" id="ap" type="password" placeholder="Mật khẩu" autocomplete="${reg?'new-password':'current-password'}"></p>
${reg?'<p><input class="ans" id="ap2" type="password" placeholder="Nhập lại mật khẩu" autocomplete="new-password"></p>':''}
<p id="ae" class="bad"></p>
<p><button id="ago" style="width:100%">${reg?'Đăng ký':'Đăng nhập'}</button></p>
<p style="text-align:center" class="mut">${reg?'Đã có tài khoản?':'Chưa có tài khoản?'} <a href="#" id="asw" style="color:var(--ac)">${reg?'Đăng nhập':'Đăng ký'}</a> · <a href="#" id="ax" style="color:var(--mut)">Đóng</a></p></div>`;
  document.body.appendChild(o);
  const q=s=>o.querySelector(s),err=m=>{q('#ae').textContent=m};
  q('#asw').onclick=e=>{e.preventDefault();showAuth(cb,!reg)};
  q('#ax').onclick=e=>{e.preventDefault();o.remove()};
  const go=async()=>{
    const name=q('#au').value.trim(),pw=q('#ap').value,key=name.toLowerCase(),U=getU();
    if(!/^[A-Za-z0-9_]{3,20}$/.test(name))return err('Tên tài khoản gồm 3-20 ký tự: chữ cái, số hoặc dấu _');
    if(reg){
      if(pw.length<6)return err('Mật khẩu cần ít nhất 6 ký tự');
      if(pw!==q('#ap2').value)return err('Mật khẩu nhập lại không khớp');
      if(U[key])return err('Tên tài khoản đã tồn tại');
      const salt=Math.random().toString(36).slice(2);
      U[key]={name,salt,hash:await hashPw(salt+pw)};setU(U);
    }else{
      const u=U[key];
      if(!u||u.hash!==await hashPw(u.salt+pw))return err('Sai tên tài khoản hoặc mật khẩu');
    }
    loginAs(U[key].name);o.remove();if(cb)cb();
  };
  q('#ago').onclick=go;
  o.querySelectorAll('input').forEach(i=>i.onkeydown=e=>{if(e.key=='Enter')go()});
  q('#au').focus();
}
function tab(k){if(!USER){showAuth(()=>tab(k));return}tabRaw(k)}
function tabRaw(k){if(R2)clearInterval(R2.iv);if(typeof simStop=='function')simStop();$('#b1').className=k==1?'':'sec';$('#b2').className=k==2?'':'sec';$('#b3').className=k==3?'':'sec';k==1?theory():k==2?menu():sim()}
$('#b1').onclick=()=>tab(1);$('#b2').onclick=()=>tab(2);$('#b3').onclick=()=>tab(3);
function theory(){
  const card=(d,i,x)=>`<section class="card"><h2>${i}. ${d.n}</h2><p>${d.t}</p>${x?`<div class="det"><b>💡 Giải thích dễ hiểu</b>${x}</div>`:''}<b>Ví dụ C++ (đọc ghi chú sau //):</b><pre>${esc(d.c)}</pre></section>`;
  app.innerHTML=D.map((d,i)=>card(d,i+1,XD[i])).join('')
    +'<h2 style="text-align:center;margin-top:28px">➕ Thuật toán bổ sung</h2><p class="mut" style="text-align:center">Mỗi thuật toán bổ sung đã có một vòng luyện tập riêng (Vòng 13 - 22) trong Trò chơi.</p>'
    +EXTRA.map((d,i)=>card(d,D.length+i+1,'')).join('');
}
function menu(){app.innerHTML='<p class="mut">Mỗi vòng ứng với một chuyên đề, gồm 5 bài. Mỗi bài cho đề và 3 bộ input nhỏ: bạn viết chương trình C++ và nộp; code được chạy trên máy chấm trực tuyến (Judge0) với 3 bộ input. Đúng cả 3 test thì qua bài. Cần có internet. Đồng hồ chạy từ 00:00 đến khi bạn giải xong bài thứ 5.</p><div class="grid">'+ALL.map((d,i)=>`<div class="card"><h3>Vòng ${i+1}</h3><div>${d.n}</div><p class="mut">Kỷ lục: ${best[i]!=null?fmt(best[i]):'chưa có'}</p><button onclick="start(${i})">Chơi</button></div>`).join('')+'</div>'}
function start(i){R2={i,k:0,t0:Date.now(),mark:Date.now(),sp:[]};show()}
const T=[[["Dòng 1: n. Dòng 2: n số nguyên. In dãy sắp xếp GIẢM dần trên một dòng, cách nhau dấu cách. (n ≤ 2·10^5)",[["7\n-28 17 -39 22 0 -14 10\n","MjIgMTcgMTAgMCAtMTQgLTI4IC0zOQ=="],["4\n-10 -40 38 -30\n","MzggLTEwIC0zMCAtNDA="],["4\n33 30 22 35\n","MzUgMzMgMzAgMjI="]]],["Dòng 1: n q. Dòng 2: n số nguyên tăng dần, đôi một khác nhau. Dòng 3: q số x. In trên một dòng q số: chỉ số (từ 1) của x trong dãy, hoặc -1 nếu không có. (n,q ≤ 2·10^5)",[["6 5\n-5 -2 4 9 13 14\n11 4 4 -21 14\n","LTEgMyAzIC0xIDY="],["5 4\n-7 -2 3 12 14\n10 -2 11 14\n","LTEgMiAtMSA1"],["6 1\n-12 -9 -4 9 12 16\n11\n","LTE="]]],["Dòng 1: n q. Dòng 2: n số nguyên tăng dần (có thể trùng nhau). Dòng 3: q số x. In trên một dòng q số: số phần tử ≤ x với mỗi x. (n,q ≤ 2·10^5)",[["4 5\n-3 -1 1 2\n6 4 0 -6 3\n","NCA0IDIgMCA0"],["3 4\n-5 -3 -1\n5 -4 6 -8\n","MyAxIDMgMA=="],["2 3\n3 3\n2 1 3\n","MCAwIDI="]]],["Dòng 1: n s. Dòng 2: n số nguyên. Đếm số cặp (i<j) có a[i]+a[j]=s. (n ≤ 2·10^5, |a[i]| ≤ 10^9)",[["6 12\n3 6 1 5 5 -4\n","MA=="],["5 0\n0 2 -5 2 7\n","MA=="],["3 6\n-3 -5 0\n","MA=="]]],["Dòng 1: n k. Dòng 2: n số nguyên dương là độ dài các thanh gỗ. Cắt các thanh để được ít nhất k đoạn có cùng độ dài nguyên dương L. In L lớn nhất, nếu không thể thì in 0. (n ≤ 10^5, a[i] ≤ 10^9, k ≤ 10^9)",[["6 44\n12 1 1 17 16 11\n","MQ=="],["4 25\n13 5 17 7\n","MQ=="],["2 6\n3 14\n","Mg=="]]]],[["Dòng 1: n q. Dòng 2: n số nguyên. Tiếp theo q dòng, mỗi dòng 'l r'. Với mỗi truy vấn in trên một dòng tổng a[l]+...+a[r]. (n,q ≤ 2·10^5)",[["7 7\n-13 -11 -40 -29 18 2 12\n4 6\n4 5\n3 7\n4 7\n1 5\n7 7\n7 7\n","LTkgLTExIC0zNyAzIC03NSAxMiAxMg=="],["3 4\n-18 -35 29\n3 3\n3 3\n3 3\n1 1\n","MjkgMjkgMjkgLTE4"],["3 4\n-7 19 23\n3 3\n1 2\n2 2\n2 2\n","MjMgMTIgMTkgMTk="]]],["Dòng 1: n k. Dòng 2: n số nguyên. In tổng lớn nhất của k phần tử liên tiếp (k ≤ n). (n ≤ 2·10^5)",[["6 5\n-24 -28 -7 -28 15 -19\n","LTY3"],["5 5\n-13 32 -3 32 -6\n","NDI="],["2 1\n39 -5\n","Mzk="]]],["Dòng 1: n q. Mảng a có n phần tử, ban đầu toàn 0. Tiếp theo q dòng 'l r x': cộng x vào a[l..r]. Sau mọi thao tác, in mảng a trên một dòng. (n,q ≤ 2·10^5)",[["3 6\n1 2 4\n2 2 8\n2 2 8\n1 3 -6\n1 3 -6\n1 1 -5\n","LTEzIDggLTEy"],["5 5\n3 4 5\n5 5 3\n3 5 -3\n5 5 4\n1 3 7\n","NyA3IDkgMiA0"],["4 3\n4 4 -8\n1 2 -9\n3 3 -6\n","LTkgLTkgLTYgLTg="]]],["Dòng 1: n s. Dòng 2: n số nguyên dương. In độ dài ngắn nhất của đoạn liên tiếp có tổng ≥ s, nếu không có in 0. (n ≤ 2·10^5)",[["5 10\n1 9 9 7 5\n","Mg=="],["5 6\n8 7 5 6 3\n","MQ=="],["4 6\n4 7 4 3\n","MQ=="]]],["Dòng 1: n k. Dòng 2: n số nguyên (có thể âm). Đếm số đoạn con liên tiếp (không rỗng) có tổng đúng bằng k. (n ≤ 2·10^5, đáp án có thể lớn, dùng long long)",[["6 -2\n0 -3 -2 2 1 3\n","Mw=="],["3 -3\n2 3 -3\n","MQ=="],["3 -1\n2 1 3\n","MA=="]]]],[["Một số nguyên x. Có các tờ tiền mệnh giá 1, 5, 10, 50, 100, 500 (mỗi loại không giới hạn số lượng). In số tờ ít nhất để đổi đúng x. (x ≤ 10^9)",[["1000\n","Mg=="],["168\n","Nw=="],["725\n","Ng=="]]],["Dòng 1: n. Tiếp theo n dòng 's e' (s < e) là đoạn [s,e]. Chọn nhiều đoạn nhất sao cho không hai đoạn nào giao nhau (hai đoạn chạm nhau ở đầu mút vẫn hợp lệ). In số đoạn nhiều nhất. (n ≤ 2·10^5)",[["5\n22 29\n25 26\n20 23\n2 7\n11 16\n","NA=="],["3\n6 9\n20 27\n4 12\n","Mg=="],["2\n10 14\n11 17\n","MQ=="]]],["Dòng 1: n (chẵn). Dòng 2: n số nguyên dương. Chia n số thành n/2 cặp sao cho giá trị lớn nhất của tổng một cặp là nhỏ nhất. In giá trị đó. (n ≤ 2·10^5)",[["6\n38 13 11 19 19 35\n","NDk="],["4\n36 17 20 3\n","Mzk="],["2\n38 20\n","NTg="]]],["Dòng 1: n. Dòng 2: n số nguyên dương t[i] là thời gian phục vụ người i. Sắp xếp thứ tự phục vụ sao cho tổng thời gian chờ nhỏ nhất, biết thời gian chờ của một người là tổng thời gian phục vụ của những người đứng trước họ. In tổng nhỏ nhất đó. (n ≤ 2·10^5)",[["5\n2 12 21 35 10\n","ODM="],["5\n1 24 5 24 20\n","ODM="],["4\n28 23 35 11\n","MTA3"]]],["Dòng 1: n. Dòng 2: n số nguyên không âm. Mỗi bước chọn hai vị trí khác nhau đều có giá trị dương và giảm mỗi giá trị đó 1. In số bước tối đa thực hiện được. (n ≤ 2·10^5)",[["4\n16 39 19 7\n","NDA="],["3\n30 31 7\n","MzQ="],["3\n31 6 4\n","MTA="]]]],[["Dòng 1: n S. Dòng 2: n số nguyên (n ≤ 20). Đếm số tập con (kể cả tập rỗng) có tổng đúng bằng S. Hai tập khác nhau nếu chọn khác vị trí.",[["4 4\n-1 7 5 -2\n","Mg=="],["5 5\n0 6 5 8 2\n","Mg=="],["3 3\n1 2 3\n","Mg=="]]],["Dòng 1: n k (n ≤ 8, 1 ≤ k ≤ n!). In hoán vị thứ k (đánh số từ 1) của 1..n theo thứ tự từ điển, trên một dòng, các số cách nhau dấu cách.",[["4 10\n","MiAzIDQgMQ=="],["4 17\n","MyA0IDEgMg=="],["3 4\n","MiAzIDE="]]],["Một số nguyên n (n ≤ 10). Đếm số cách đặt n quân hậu lên bàn cờ n×n sao cho không hai quân nào ăn nhau (cùng hàng, cột hoặc đường chéo).",[["4\n","Mg=="],["5\n","MTA="],["6\n","NA=="]]],["Dòng 1: n (n ≤ 8). Tiếp theo n dòng, mỗi dòng n số nguyên dương là ma trận c. Chọn hoán vị p của 0..n-1 sao cho tổng c[i][p[i]] nhỏ nhất. In tổng nhỏ nhất.",[["5\n5 18 4 9 10\n19 15 13 13 1\n18 11 14 11 4\n16 18 17 7 14\n12 11 2 13 6\n","MjY="],["4\n15 19 5 14\n9 11 4 11\n9 15 9 5\n18 9 8 11\n","Mjg="],["3\n15 8 12\n12 14 19\n13 7 5\n","MjU="]]],["Dòng 1: n (n ≤ 15). Dòng 2: n số nguyên dương. Chia n số vào hai nhóm (một nhóm có thể rỗng) sao cho chênh lệch tổng hai nhóm nhỏ nhất. In chênh lệch đó.",[["5\n13 4 20 7 1\n","Mw=="],["3\n16 11 11\n","Ng=="],["3\n6 3 18\n","OQ=="]]]],[["Hai số nguyên dương a b (a,b ≤ 10^9, lcm đảm bảo ≤ 10^18). In gcd và lcm, cách nhau dấu cách.",[["29 103\n","MSAyOTg3"],["71 127\n","MSA5MDE3"],["12 18\n","NiAzNg=="]]],["Một số nguyên n (n ≤ 10^6). In số lượng số nguyên tố không vượt quá n.",[["10\n","NA=="],["20\n","OA=="],["30\n","MTA="]]],["Ba số nguyên a b m (0 ≤ a,b ≤ 10^18, 1 ≤ m ≤ 10^9). In a^b mod m (quy ước 0^0=1).",[["2 10 1000\n","MjQ="],["4 10 26\n","MjI="],["8 10 24\n","MTY="]]],["Một số nguyên n (2 ≤ n ≤ 10^12). Phân tích n ra thừa số nguyên tố. In trên một dòng các cặp 'p k' (nghĩa là p^k) theo thứ tự p tăng dần. Ví dụ n=12 = 2^2·3^1 in '2 2 3 1'.",[["143\n","MTEgMSAxMyAx"],["360\n","MiAzIDMgMiA1IDE="],["12\n","MiAyIDMgMQ=="]]],["Hai số nguyên n k (0 ≤ k ≤ n ≤ 10^6). In C(n,k) mod 1 000 000 007.",[["10 0\n","MQ=="],["5 2\n","MTA="],["6 3\n","MjA="]]]],[["Một số nguyên n (0 ≤ n ≤ 90). In số Fibonacci thứ n với F(0)=0, F(1)=1.",[["12\n","MTQ0"],["15\n","NjEw"],["20\n","Njc2NQ=="]]],["Dòng 1: n W. Tiếp theo n dòng 'w v' (khối lượng, giá trị). Cái túi chứa tối đa khối lượng W, mỗi vật dùng tối đa 1 lần. In tổng giá trị lớn nhất. (n ≤ 100, W ≤ 10^4)",[["4 59\n35 4\n20 29\n33 47\n57 70\n","NzY="],["4 10\n6 19\n9 6\n8 1\n1 13\n","MzI="],["3 38\n17 43\n2 21\n33 25\n","NjQ="]]],["Dòng 1: n. Dòng 2: n số nguyên. In độ dài dãy con tăng NGẶT dài nhất. (n ≤ 10^5, cần O(n log n))",[["5\n14 14 18 6 -14\n","Mg=="],["3\n15 -15 -19\n","MQ=="],["5\n1 1 1 1 1\n","MQ=="]]],["Hai dòng, mỗi dòng một xâu s và t gồm chữ cái thường (độ dài từ 1 đến 2000). In độ dài dãy con chung dài nhất.",[["aggtab\ngxtxayb\n","NA=="],["bbabcb\nbba\n","Mw=="],["ba\naccbb\n","MQ=="]]],["Dòng 1: n m. Tiếp theo n dòng, mỗi dòng m số nguyên (|giá trị| ≤ 1000). Đi từ ô (1,1) đến ô (n,m), mỗi bước chỉ sang phải hoặc xuống dưới. In tổng các ô trên đường đi lớn nhất (tính cả hai đầu). (n,m ≤ 1000)",[["4 6\n9 5 6 8 -9 -5\n1 -5 -9 -6 3 -7\n-4 8 -1 -9 -8 -7\n7 -6 1 -5 0 6\n","MjM="],["2 3\n5 -2 3\n-2 7 1\n","MTE="],["5 1\n-7\n7\n5\n9\n-6\n","OA=="]]]],[["Dòng 1: n (n ≤ 16). Tiếp theo n dòng, mỗi dòng n số nguyên: ma trận chi phí c (c[i][i]=0, các số khác dương, không nhất thiết đối xứng). Tìm chu trình đi qua mỗi đỉnh đúng một lần, xuất phát và kết thúc ở đỉnh 1, tổng chi phí nhỏ nhất. In tổng đó (n=1 in 0).",[["5\n0 50 8 38 31\n38 0 25 31 34\n2 32 0 14 25\n47 3 34 0 30\n9 19 16 34 0\n","Njg="],["3\n0 32 16\n39 0 12\n29 13 0\n","Njg="],["2\n0 27\n3 0\n","MzA="]]],["Dòng 1: n (n ≤ 15). Tiếp theo n dòng, mỗi dòng n số 0/1: ma trận kề của đồ thị vô hướng đơn. Đếm số tập đỉnh độc lập (không hai đỉnh nào kề nhau), kể cả tập rỗng.",[["4\n0 0 1 1\n0 0 1 1\n1 1 0 1\n1 1 1 0\n","Ng=="],["2\n0 1\n1 0\n","Mw=="],["1\n0\n","Mg=="]]],["Dòng 1: n. Tiếp theo n-1 dòng 'u v' là các cạnh của một cây, gốc là đỉnh 1. In n số trên một dòng: kích thước cây con của đỉnh 1, 2, ..., n. (n ≤ 2·10^5, chú ý đệ quy sâu)",[["4\n2 1\n4 3\n1 3\n","NCAxIDIgMQ=="],["2\n1 2\n","MiAx"],["1\n","MQ=="]]],["Dòng 1: n. Tiếp theo n-1 dòng 'u v' là các cạnh của một cây. In đường kính của cây: số cạnh của đường đi dài nhất giữa hai đỉnh bất kỳ. (n ≤ 2·10^5)",[["7\n1 2\n4 6\n3 6\n2 7\n7 6\n3 5\n","NQ=="],["4\n4 2\n1 4\n3 2\n","Mw=="],["3\n1 3\n2 3\n","Mg=="]]],["Dòng 1: n. Tiếp theo n-1 dòng 'u v' là các cạnh của một cây. In số đỉnh nhiều nhất của một tập đỉnh độc lập (không có hai đỉnh nào kề nhau). (n ≤ 2·10^5)",[["4\n3 2\n3 4\n1 4\n","Mg=="],["3\n1 3\n3 2\n","Mg=="],["3\n1 2\n2 3\n","Mg=="]]]],[["Dòng 1: n m. Tiếp theo m dòng 'u v' là cạnh vô hướng (đồ thị đơn, đỉnh 1..n). In số thành phần liên thông. (n,m ≤ 2·10^5)",[["4 3\n3 4\n3 2\n2 1\n","MQ=="],["4 3\n4 3\n1 2\n4 2\n","MQ=="],["5 2\n5 3\n5 4\n","Mw=="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v' là cạnh vô hướng. Dòng cuối: s t. In số cạnh ít nhất trên đường đi từ s đến t, hoặc -1 nếu không đến được. (n,m ≤ 2·10^5)",[["3 3\n1 3\n2 3\n2 1\n2 2\n","MA=="],["2 1\n1 2\n2 1\n","MQ=="],["1 0\n1 1\n","MA=="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v' là cạnh vô hướng. In YES nếu đồ thị là đồ thị hai phía (tô được hai màu sao cho hai đỉnh kề nhau khác màu), ngược lại in NO. (n,m ≤ 2·10^5)",[["3 3\n1 2\n2 3\n1 3\n","bm8="],["3 3\n3 1\n1 2\n3 2\n","bm8="],["2 1\n2 1\n","eWVz"]]],["Dòng 1: n m. Tiếp theo n dòng, mỗi dòng m ký tự: '.' ô trống, '#' tường, 'S' xuất phát, 'T' đích (mỗi loại đúng một ô). Mỗi bước đi sang 1 trong 4 ô kề. In số bước ít nhất từ S đến T hoặc -1. (n,m ≤ 1000)",[["5 4\n.#..\nT#.#\n##S#\n....\n###.\n","LTE="],["7 2\n#.\n##\n#.\nT#\n..\n.S\n..\n","Mw=="],["2 3\n.TS\n#.#\n","MQ=="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v': cạnh có hướng u→v (không có cạnh lặp). In thứ tự topo có thứ tự từ điển nhỏ nhất (n số trên một dòng), hoặc -1 nếu đồ thị có chu trình. (n,m ≤ 2·10^5)",[["4 6\n3 2\n1 2\n3 1\n1 4\n3 4\n4 2\n","MyAxIDQgMg=="],["1 0\n","MQ=="],["5 0\n","MSAyIDMgNCA1"]]]],[["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh vô hướng trọng số w ≥ 0 (đồ thị đơn). In trên một dòng n số: khoảng cách ngắn nhất từ đỉnh 1 đến các đỉnh 1..n, in -1 nếu không đến được. (n,m ≤ 2·10^5, w ≤ 10^9, dùng long long)",[["6 3\n1 5 3\n2 5 16\n1 2 13\n","MCAxMyAtMSAtMSAzIC0x"],["4 2\n4 2 16\n3 4 2\n","MCAtMSAtMSAtMQ=="],["2 1\n2 1 10\n","MCAxMA=="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh CÓ HƯỚNG u→v trọng số w > 0. Dòng cuối: s t. In độ dài đường đi ngắn nhất từ s đến t, hoặc -1 nếu không có. (n,m ≤ 10^5, dùng long long)",[["3 2\n1 3 11\n3 2 16\n2 3\n","LTE="],["2 1\n1 2 3\n1 2\n","Mw=="],["3 1\n2 3 5\n3 1\n","LTE="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh vô hướng trọng số dương. Sau đó dòng q, rồi q dòng 'u v'. Với mỗi truy vấn in khoảng cách ngắn nhất giữa u và v (hoặc -1), mỗi truy vấn một dòng. (n ≤ 400, q ≤ 10^5, gợi ý Floyd-Warshall)",[["7 5\n3 1 16\n1 4 3\n2 3 16\n4 3 3\n1 5 4\n3\n7 7\n3 2\n2 6\n","MCAxNiAtMQ=="],["4 5\n3 4 17\n2 3 5\n3 1 4\n4 1 19\n2 4 13\n2\n2 1\n2 3\n","OSA1"],["3 2\n2 1 15\n3 1 1\n6\n1 2\n1 3\n1 3\n3 3\n3 3\n2 1\n","MTUgMSAxIDAgMCAxNQ=="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh có hướng u→v trọng số w (có thể âm, |w| ≤ 10^4, không có khuyên). In YES nếu đồ thị tồn tại chu trình có tổng trọng số âm (ở bất kỳ đâu trong đồ thị), ngược lại in NO. (n ≤ 1000, m ≤ 5000)",[["4 9\n1 3 -2\n1 4 0\n2 1 -2\n2 3 7\n3 1 2\n3 2 -2\n3 4 -1\n4 1 8\n4 2 1\n","eWVz"],["5 9\n1 3 6\n1 4 5\n1 5 0\n2 3 7\n2 4 0\n2 5 -1\n3 4 -1\n5 1 9\n5 4 3\n","bm8="],["2 2\n1 2 -1\n2 1 -1\n","eWVz"]]],["Dòng 1: n m. Tiếp theo n dòng, mỗi dòng m ký tự '0' hoặc '1'. Xuất phát ở ô (1,1) (không tính chi phí), mỗi bước đi sang 1 trong 4 ô kề và trả chi phí bằng giá trị của ô mới bước vào. In tổng chi phí nhỏ nhất để đến ô (n,m). (n,m ≤ 1000, gợi ý 0-1 BFS)",[["2 5\n01011\n01111\n","NA=="],["3 2\n10\n11\n10\n","MQ=="],["2 1\n1\n1\n","MQ=="]]]],[["Dòng 1: n q. Tiếp theo q dòng 't a b': nếu t=1 hợp nhất tập chứa a và tập chứa b; nếu t=2 hỏi a và b có cùng tập không, in YES/NO (mỗi câu trả lời một dòng). Ban đầu mỗi phần tử một tập riêng. (n,q ≤ 2·10^5)",[["6 7\n2 5 4\n2 5 3\n1 6 6\n2 1 1\n1 1 5\n2 4 6\n1 1 2\n","bm8gbm8geWVzIG5v"],["8 6\n2 3 3\n1 8 1\n1 7 3\n2 5 3\n2 3 1\n2 3 5\n","eWVzIG5vIG5vIG5v"],["4 5\n2 3 1\n1 4 2\n1 3 4\n1 2 4\n2 1 4\n","bm8gbm8="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh vô hướng trọng số w > 0 (đồ thị đơn). In tổng trọng số của cây khung nhỏ nhất, hoặc -1 nếu đồ thị không liên thông. (n,m ≤ 2·10^5)",[["5 9\n1 2 19\n1 5 9\n5 3 16\n1 3 3\n5 4 12\n5 2 1\n3 4 5\n1 4 20\n3 2 12\n","MTg="],["4 6\n2 3 20\n3 4 13\n3 1 15\n1 2 5\n2 4 12\n4 1 6\n","MjQ="],["2 1\n1 2 15\n","MTU="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v': các cạnh được thêm lần lượt vào đồ thị ban đầu không có cạnh nào. Sau mỗi cạnh, in số thành phần liên thông (mỗi số một dòng). (n,m ≤ 2·10^5)",[["5 10\n5 3\n1 5\n3 4\n1 2\n5 4\n4 2\n1 3\n3 2\n4 1\n2 5\n","NCAzIDIgMSAxIDEgMSAxIDEgMQ=="],["4 6\n1 2\n2 4\n3 2\n1 3\n1 4\n4 3\n","MyAyIDEgMSAxIDE="],["4 2\n2 1\n4 3\n","MyAy"]]],["Dòng 1: n m. Tiếp theo m dòng 'u v' là cạnh vô hướng. In số cạnh ít nhất cần thêm để đồ thị liên thông. (n,m ≤ 2·10^5)",[["4 2\n3 4\n1 3\n","MQ=="],["2 1\n2 1\n","MA=="],["6 1\n3 2\n","NA=="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh vô hướng trọng số w > 0. Với mỗi đường đi từ 1 đến n, xét cạnh có trọng số lớn nhất trên đường đó. In giá trị nhỏ nhất có thể của đại lượng này, hoặc -1 nếu không có đường đi (n=1 in 0). (n,m ≤ 2·10^5)",[["5 10\n5 4 30\n2 4 14\n1 3 24\n5 1 26\n3 2 25\n1 4 5\n5 3 25\n2 1 11\n4 3 6\n2 5 18\n","MTg="],["3 3\n1 3 13\n2 1 21\n3 2 20\n","MTM="],["3 3\n2 3 26\n2 1 10\n1 3 6\n","Ng=="]]]],[["Dòng 1: n q. Dòng 2: n số nguyên. Tiếp theo q dòng: '1 i x' đặt a[i]=x; '2 l r' in tổng a[l..r] (mỗi câu trả lời một dòng). (n,q ≤ 2·10^5, dùng long long)",[["3 7\n-39 -17 24\n2 1 3\n1 1 25\n1 2 4\n1 3 -26\n2 1 3\n1 2 11\n1 1 -22\n","LTMyIDM="],["7 4\n40 19 38 16 28 -32 22\n2 1 7\n2 2 7\n2 7 7\n2 6 7\n","MTMxIDkxIDIyIC0xMA=="],["2 4\n34 6\n2 1 2\n1 2 38\n2 2 2\n1 2 -16\n","NDAgMzg="]]],["Dòng 1: n q. Dòng 2: n số nguyên. Tiếp theo q dòng 'l r': in giá trị nhỏ nhất của a[l..r] (mỗi truy vấn một dòng). (n,q ≤ 2·10^5, dữ liệu tĩnh, gợi ý Sparse Table)",[["3 5\n-29 16 -19\n1 2\n3 3\n1 1\n1 1\n1 3\n","LTI5IC0xOSAtMjkgLTI5IC0yOQ=="],["7 2\n18 3 -36 0 27 -35 20\n5 5\n2 4\n","MjcgLTM2"],["5 3\n26 18 -32 22 17\n2 2\n4 4\n3 4\n","MTggMjIgLTMy"]]],["Dòng 1: n q. Dòng 2: n số nguyên. Tiếp theo q dòng: '1 l r x' cộng x vào a[l..r]; '2 l r' in tổng a[l..r] (mỗi câu trả lời một dòng). (n,q ≤ 2·10^5, dùng long long, gợi ý lazy propagation)",[["7 5\n-3 7 -6 0 1 6 0\n2 1 7\n2 3 4\n2 3 4\n1 3 4 9\n2 1 7\n","NSAtNiAtNiAyMw=="],["1 4\n-6\n2 1 1\n1 1 1 -7\n1 1 1 -6\n1 1 1 -6\n","LTY="],["3 3\n5 -3 -5\n2 1 3\n1 2 3 3\n1 2 3 0\n","LTM="]]],["Dòng 1: n. Dòng 2: n số nguyên. Đếm số cặp nghịch thế (i<j và a[i]>a[j]). (n ≤ 2·10^5, đáp án dùng long long)",[["6\n-11 5 3 -16 -15 4\n","OA=="],["4\n-16 -12 3 -11\n","MQ=="],["3\n4 5 -10\n","Mg=="]]],["Dòng 1: n q. Tiếp theo n-1 dòng 'u v' là cạnh của cây gốc 1. Sau đó q dòng 'u v'. In tổ tiên chung gần nhất (LCA) của u và v (mỗi truy vấn một dòng). (n,q ≤ 2·10^5, gợi ý binary lifting)",[["4 6\n1 4\n4 2\n3 4\n1 4\n1 2\n2 4\n3 3\n2 3\n3 2\n","MSAxIDQgMyA0IDQ="],["7 3\n7 6\n1 2\n5 6\n3 4\n7 4\n2 6\n4 2\n1 6\n2 4\n","MiAxIDI="],["3 4\n3 2\n3 1\n2 3\n3 3\n1 1\n1 1\n","MyAzIDEgMQ=="]]]],[["Một dòng chứa xâu s gồm chữ cái thường (độ dài ≤ 10^6). In YES nếu s đối xứng (đọc xuôi ngược giống nhau), ngược lại in NO.",[["bbccbb\n","eWVz"],["caac\n","eWVz"],["aba\n","eWVz"]]],["Hai dòng: xâu t rồi xâu p (chữ cái thường, độ dài ≤ 10^6). In số lần p xuất hiện trong t (các lần xuất hiện có thể chồng nhau). Gợi ý KMP.",[["bbba\nbaba\n","MA=="],["abaa\naba\n","MQ=="],["aaaa\naa\n","Mw=="]]],["Một dòng chứa xâu s (chữ cái thường, độ dài ≤ 10^6). In số d nhỏ nhất sao cho d chia hết |s| và s được tạo bằng cách lặp lại xâu con s[1..d] đúng |s|/d lần.",[["aaaa\n","MQ=="],["abab\n","Mg=="],["abc\n","Mw=="]]],["Dòng 1: xâu s (chữ cái thường, độ dài ≤ 10^5). Dòng 2: q. Tiếp theo q dòng 'l1 r1 l2 r2'. In YES nếu s[l1..r1] = s[l2..r2] (hai đoạn có thể khác độ dài, khi đó là NO), ngược lại NO. Mỗi truy vấn một dòng. (q ≤ 10^5, gợi ý băm)",[["aab\n6\n1 2 2 3\n3 3 2 2\n2 3 2 3\n1 1 1 1\n3 3 1 1\n2 3 2 3\n","bm8gbm8geWVzIHllcyBubyB5ZXM="],["b\n5\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1\n","eWVzIHllcyB5ZXMgeWVzIHllcw=="],["ab\n3\n1 2 2 2\n1 2 1 2\n1 1 1 1\n","bm8geWVzIHllcw=="]]],["Dòng 1: n (n ≥ 2). Dòng 2: n số nguyên không âm < 2^30. In giá trị lớn nhất của a[i] XOR a[j] với i < j. (n ≤ 2·10^5, gợi ý Trie theo bit)",[["6\n592 768 329 278 622 733\n","OTcx"],["8\n26 22 22 2 19 13 31 16\n","MzA="],["7\n0 4 7 1 4 0 7\n","Nw=="]]]]];
// Đề cho các vòng 13-22 (thuật toán bổ sung)
const T2=[[["Dòng 1: n. Dòng 2: n số nguyên. Với mỗi i, in GIÁ TRỊ của phần tử đầu tiên bên phải a[i] mà lớn hơn hẳn a[i], không có thì in -1. In n số trên một dòng. (n ≤ 2·10^5)",[["7\n14 1 16 17 1 5 5\n","MTYgMTYgMTcgLTEgNSAtMSAtMQ=="],["8\n20 17 20 1 3 5 7 18\n","LTEgMjAgLTEgMyA1IDcgMTggLTE="],["6\n9 18 11 18 17 20\n","MTggMjAgMTggMjAgMjAgLTE="]]],["Dòng 1: một xâu chỉ gồm các ký tự ( ) [ ] { }. In YES nếu dãy ngoặc hợp lệ (đóng mở đúng cặp, đúng thứ tự), ngược lại in NO. (độ dài ≤ 10^6)",[["([]{()})[]\n","eWVz"],["([)]{}\n","bm8="],["{[()()]}((\n","bm8="]]],["Dòng 1: n. Dòng 2: n số nguyên. Với mỗi i (đánh số từ 1), in chỉ số j < i LỚN NHẤT sao cho a[j] < a[i], không có thì in 0. In n số trên một dòng. (n ≤ 2·10^5)",[["7\n14 15 15 4 11 9 8\n","MCAxIDEgMCA0IDQgNA=="],["8\n2 1 2 11 10 9 10 1\n","MCAwIDIgMyAzIDMgNiAw"],["6\n9 3 8 10 2 8\n","MCAwIDIgMyAwIDU="]]],["Dòng 1: n. Dòng 2: nhiệt độ của n ngày. Với mỗi ngày i, in số ngày phải chờ đến ngày đầu tiên nóng hơn hẳn ngày i; nếu không có thì in 0. In n số trên một dòng. (n ≤ 2·10^5)",[["8\n24 20 24 27 23 21 29 35\n","MyAxIDEgMyAyIDEgMSAw"],["7\n25 31 22 34 32 29 32\n","MSAyIDEgMCAwIDEgMA=="],["8\n26 35 33 24 25 29 26 33\n","MSAwIDAgMSAxIDIgMSAw"]]],["Dòng 1: n. Dòng 2: chiều cao n cột trong biểu đồ, mỗi cột rộng 1. In diện tích hình chữ nhật lớn nhất nằm trọn trong biểu đồ. (n ≤ 2·10^5, h ≤ 10^9)",[["7\n2 7 1 5 2 1 5\n","Nw=="],["6\n5 9 8 2 1 1\n","MTY="],["8\n8 7 3 7 6 8 1 6\n","MTg="]]]],[["Dòng 1: n k. Dòng 2: n số nguyên. In trên một dòng min của mọi đoạn k phần tử liên tiếp, từ trái sang phải. (n ≤ 10^6)",[["8 3\n-12 -15 10 1 -15 -2 -14 5\n","LTE1IC0xNSAtMTUgLTE1IC0xNSAtMTQ="],["7 2\n19 8 -9 0 -20 -6 -2\n","OCAtOSAtOSAtMjAgLTIwIC02"],["9 4\n10 -15 4 -18 -12 -19 1 4 18\n","LTE4IC0xOCAtMTkgLTE5IC0xOSAtMTk="]]],["Dòng 1: n k. Dòng 2: n số nguyên. In trên một dòng max của mọi đoạn k phần tử liên tiếp, từ trái sang phải. (n ≤ 10^6)",[["8 3\n-8 18 1 -12 15 -13 9 12\n","MTggMTggMTUgMTUgMTUgMTI="],["9 4\n-4 -5 16 17 -6 10 -8 -12 -12\n","MTcgMTcgMTcgMTcgMTAgMTA="],["7 2\n9 -16 16 -17 -1 -18 1\n","OSAxNiAxNiAtMSAtMSAx"]]],["Dòng 1: n k. Dòng 2: n số nguyên. Với mọi đoạn k phần tử liên tiếp (từ trái sang phải), in hiệu max - min của đoạn đó, trên một dòng. (n ≤ 10^6)",[["8 3\n3 6 6 21 8 3 8 26\n","MyAxNSAxNSAxOCA1IDIz"],["7 3\n25 29 23 17 1 15 30\n","NiAxMiAyMiAxNiAyOQ=="],["9 4\n4 5 30 29 18 2 10 17 0\n","MjYgMjUgMjggMjcgMTYgMTc="]]],["Dòng 1: n k. Dòng 2: n số nguyên. In TỔNG các giá trị min của mọi đoạn k phần tử liên tiếp. (n ≤ 10^6)",[["9 3\n12 13 7 4 16 7 15 12 10\n","NDM="],["8 2\n1 20 14 9 14 9 12 14\n","NjM="],["10 4\n17 9 15 7 10 13 13 2 13 8\n","MzQ="]]],["Dòng 1: n d. Dòng 2: n số nguyên. In độ dài đoạn con liên tiếp DÀI NHẤT có max - min ≤ d. (n ≤ 10^6; gợi ý: hai con trỏ + hai deque)",[["9 3\n7 7 12 9 2 12 11 10 5\n","Mw=="],["8 5\n8 8 8 5 3 7 9 1\n","Ng=="],["10 4\n2 4 10 9 12 11 10 8 9 2\n","Nw=="]]]],[["Dòng 1: n. Dòng 2: n số nguyên (|a[i]| ≤ 10^9). Thay mỗi số bằng thứ hạng của nó trong các giá trị PHÂN BIỆT (nhỏ nhất có hạng 1, bằng nhau cùng hạng). In dãy mới trên một dòng. (n ≤ 2·10^5)",[["7\n470004201 8312345 8312345 933822301 336148859 485582474 933822301\n","MyAxIDEgNSAyIDQgNQ=="],["6\n464925528 350260497 466072801 350260497 624816659 624816657\n","MiAxIDMgMSA1IDQ="],["8\n125220180 125220183 690057103 518567086 518567086 690057103 125220180 125220180\n","MSAyIDQgMyAzIDQgMSAx"]]],["Dòng 1: n. Dòng 2: n số nguyên (|a[i]| ≤ 10^9). In số lượng giá trị phân biệt. (n ≤ 2·10^5)",[["8\n634350807 622866035 204836846 634350807 640824322 204836846 640824318 634350807\n","NQ=="],["7\n445696623 169057012 445696623 169057014 199409247 490158797 199409247\n","NQ=="],["9\n294053915 585688975 942672134 942672137 942672134 419054869 585688975 5354763 5354763\n","Ng=="]]],["Dòng 1: n. Dòng 2: n số nguyên (≤ 10^9). Với mỗi i, in số phần tử của cả dãy nhỏ hơn hẳn a[i]. In n số trên một dòng. (n ≤ 2·10^5)",[["7\n586754442 586754442 416131139 586754447 416131139 3297927 416131139\n","NCA0IDEgNiAxIDAgMQ=="],["8\n812782646 812782646 95940590 877798915 877798915 95940590 574229271 95940590\n","NCA0IDAgNiA2IDAgMyAw"],["6\n995172054 518544202 479684353 995172054 518544198 185258391\n","NCAzIDEgNCAyIDA="]]],["Dòng 1: n. Dòng 2: n số nguyên (≤ 10^9). Đếm số cặp nghịch thế (i < j và a[i] > a[j]). (n ≤ 2·10^5; gợi ý: rời rạc hóa + Fenwick)",[["7\n75763826 157127054 579149843 579149843 157127053 75763822 885933461\n","OA=="],["8\n184729338 522432089 522432093 301677466 301677466 301677468 301677466 525303603\n","OQ=="],["7\n970615864 742203236 401867390 401867390 742203236 970615864 979088307\n","Ng=="]]],["Dòng 1: n. Tiếp theo n dòng, mỗi dòng 'l r' (0 ≤ l < r ≤ 10^9) là một đoạn tô màu trên trục số. In tổng độ dài phần trục số được tô (phần chồng nhau chỉ tính một lần). (n ≤ 2·10^5)",[["4\n0 6\n10 14\n6 9\n5 11\n","MTQ="],["5\n8 12\n21 33\n28 36\n18 24\n2 4\n","MjQ="],["4\n20 27\n22 27\n20 29\n3 4\n","MTA="]]]],[["Dòng 1: n. Dòng 2: n số nguyên. In tổng lớn nhất của một đoạn con liên tiếp khác rỗng. (n ≤ 10^6)",[["8\n9 7 6 -6 -8 9 7 3\n","Mjc="],["7\n0 -5 5 9 -6 -5 5\n","MTQ="],["9\n-10 7 -9 9 -9 6 -1 9 -10\n","MTQ="]]],["Dòng 1: n. Dòng 2: n số nguyên. In tổng NHỎ nhất của một đoạn con liên tiếp khác rỗng. (n ≤ 10^6)",[["8\n3 -10 7 -10 -8 1 -2 9\n","LTIy"],["9\n-1 -4 9 -10 -5 -6 8 -8 -4\n","LTI1"],["7\n-1 3 -7 -9 8 -9 8\n","LTE3"]]],["Dòng 1: n. Dòng 2: n số nguyên xếp trên một VÒNG TRÒN (a[n] kề a[1]). In tổng lớn nhất của một đoạn liên tiếp khác rỗng trên vòng (mỗi phần tử dùng tối đa một lần). (n ≤ 10^6; gợi ý: tổng - đoạn min)",[["7\n-2 -7 -8 6 -5 -7 -5\n","Ng=="],["8\n8 10 -5 -4 5 -3 -1 -4\n","MTg="],["6\n-3 7 7 -1 -5 -6\n","MTQ="]]],["Dòng 1: n. Dòng 2: n số nguyên. Chọn một đoạn con liên tiếp, được phép XÓA tối đa một phần tử trong đoạn (sau khi xóa đoạn vẫn khác rỗng). In tổng lớn nhất có thể. (n ≤ 10^6)",[["8\n-4 10 2 -7 4 1 10 -6\n","Mjc="],["7\n0 8 3 6 -7 9 6\n","MzI="],["9\n0 -9 -3 -9 -8 1 -8 -4 -4\n","MQ=="]]],["Dòng 1: n m. Tiếp theo n dòng, mỗi dòng m số nguyên. In tổng lớn nhất của một hình chữ nhật con khác rỗng. (n, m ≤ 200; gợi ý: cố định 2 hàng rồi Kadane trên cột, O(n²m))",[["3 4\n0 6 8 -5\n6 3 8 5\n-5 4 4 -5\n","MzQ="],["3 3\n7 7 -4\n9 1 -9\n-6 1 2\n","MjQ="],["4 3\n7 9 -3\n-7 7 -6\n0 7 1\n-6 6 -6\n","Mjk="]]]],[["Dòng 1: n m. Tiếp theo m dòng 'u v' là cạnh có hướng u → v. In thứ tự topo có thứ tự từ điển NHỎ NHẤT trên một dòng; nếu đồ thị có chu trình thì in -1. (n, m ≤ 2·10^5)",[["6 6\n2 5\n4 1\n1 2\n6 3\n1 5\n4 2\n","NCAxIDIgNSA2IDM="],["7 8\n6 2\n3 1\n3 7\n2 5\n7 1\n3 5\n2 4\n3 2\n","MyA2IDIgNCA1IDcgMQ=="],["6 6\n5 6\n5 3\n6 3\n1 2\n1 5\n3 1\n","LTE="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v' là cạnh có hướng u → v. In YES nếu đồ thị KHÔNG có chu trình, ngược lại in NO. (n, m ≤ 2·10^5)",[["6 8\n3 4\n5 4\n6 3\n2 1\n3 2\n3 5\n6 2\n4 6\n","bm8="],["7 8\n2 5\n4 6\n1 3\n7 3\n7 5\n4 3\n6 7\n1 5\n","eWVz"],["5 7\n4 5\n4 2\n2 3\n2 1\n4 1\n2 5\n5 4\n","bm8="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v' là cạnh có hướng u → v, đảm bảo không có chu trình. In số ĐỈNH của đường đi dài nhất. (n, m ≤ 2·10^5)",[["7 8\n5 3\n4 3\n2 6\n7 6\n7 5\n2 3\n7 4\n1 6\n","Mw=="],["6 7\n1 5\n5 6\n3 1\n4 3\n3 5\n2 6\n4 2\n","NQ=="],["8 9\n2 5\n1 4\n7 6\n2 4\n3 5\n4 7\n2 3\n1 8\n5 7\n","NQ=="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v' là cạnh có hướng u → v, đảm bảo không có chu trình. Đếm số đường đi khác nhau từ đỉnh 1 đến đỉnh n, in kết quả mod 10^9+7. (n, m ≤ 2·10^5)",[["6 9\n5 6\n3 4\n3 5\n4 6\n2 4\n2 3\n1 4\n4 5\n2 6\n","Mg=="],["7 11\n1 6\n1 7\n1 2\n6 7\n1 3\n5 6\n4 5\n2 3\n4 7\n4 6\n2 4\n","NQ=="],["6 8\n4 6\n3 5\n5 6\n3 6\n4 5\n1 6\n2 5\n2 3\n","MQ=="]]],["Dòng 1: n m. Dòng 2: t[1..n] là thời gian làm công việc i. Tiếp theo m dòng 'u v': phải làm xong u mới được bắt đầu v. Có thể làm nhiều việc song song. In thời gian ít nhất để hoàn thành tất cả, đảm bảo không có chu trình. (n, m ≤ 2·10^5)",[["6 6\n8 9 2 3 5 5\n2 3\n3 6\n3 1\n5 4\n4 6\n3 5\n","MjQ="],["7 8\n7 8 6 5 7 7 5\n7 6\n7 3\n2 3\n1 4\n7 5\n1 5\n6 5\n3 6\n","Mjg="],["6 7\n3 5 9 8 9 4\n5 1\n4 6\n2 3\n4 1\n2 5\n6 3\n4 3\n","MjE="]]]],[["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh có hướng u → v trọng số w (có thể âm), đảm bảo không có chu trình âm. In khoảng cách ngắn nhất từ đỉnh 1 đến các đỉnh 1..n trên một dòng; đỉnh không đến được in INF. (n ≤ 2500, m ≤ 5000)",[["5 7\n2 3 -3\n5 2 1\n4 5 5\n2 4 6\n1 4 -3\n1 3 0\n5 1 1\n","MCAzIDAgLTMgMg=="],["6 8\n3 4 -3\n6 5 4\n4 2 6\n1 5 4\n1 4 1\n5 3 3\n2 3 -1\n3 1 1\n","MCA3IDYgMSA0IGluZg=="],["5 6\n5 2 8\n1 4 9\n1 3 8\n1 5 1\n3 2 2\n3 5 6\n","MCA5IDggOSAx"]]],["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh có hướng u → v trọng số w (có thể âm). In YES nếu đồ thị có chu trình âm, ngược lại in NO. (n ≤ 2500, m ≤ 5000)",[["4 6\n3 2 -5\n1 3 -4\n2 1 2\n4 3 5\n1 2 4\n3 4 -2\n","eWVz"],["5 7\n4 2 -1\n4 1 -3\n3 4 5\n4 5 5\n5 1 -6\n5 4 7\n5 3 6\n","bm8="],["4 6\n2 3 2\n3 2 -6\n3 1 4\n1 2 -6\n2 4 -2\n1 3 -5\n","eWVz"]]],["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh có hướng u → v với w bằng 0 hoặc 1. In khoảng cách ngắn nhất từ 1 đến n, không đến được thì in -1. (n, m ≤ 10^6)",[["6 10\n1 2 1\n2 1 1\n5 6 0\n2 3 0\n6 1 1\n5 4 1\n1 5 1\n4 6 0\n5 2 1\n6 4 1\n","MQ=="],["7 11\n5 1 0\n6 3 1\n4 6 0\n6 4 1\n2 5 0\n2 1 1\n4 5 1\n6 1 1\n4 2 0\n2 7 0\n5 3 1\n","LTE="],["6 6\n6 5 1\n1 5 0\n5 4 0\n1 6 1\n2 3 1\n5 1 1\n","MQ=="]]],["Dòng 1: n m. Tiếp theo n dòng, mỗi dòng m ký tự '.' (trống) hoặc '#' (tường). Đi từ ô (1,1) đến ô (n,m) theo 4 hướng; mỗi lần bước VÀO một ô '#' thì phải phá tường, tốn 1. In số tường ít nhất phải phá (ô xuất phát luôn là '.'). (n, m ≤ 1000)",[["4 5\n.###.\n#...#\n##.#.\n.####\n","Mw=="],["4 4\n..#.\n..##\n#.#.\n..##\n","Mg=="],["5 4\n...#\n####\n###.\n.#..\n..##\n","Mw=="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v': đường một chiều u → v. Được phép đảo chiều một số đường. In số đường ít nhất phải đảo chiều để đi được từ 1 đến n, không thể thì in -1. (n, m ≤ 2·10^5; gợi ý: cạnh thuận trọng số 0, cạnh ngược trọng số 1)",[["6 7\n3 1\n6 5\n3 2\n1 5\n1 3\n1 4\n4 3\n","MQ=="],["6 6\n5 2\n5 4\n2 5\n3 5\n5 6\n2 1\n","MQ=="],["7 8\n4 2\n6 3\n3 2\n6 5\n3 5\n2 5\n7 4\n5 7\n","LTE="]]]],[["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh vô hướng trọng số w. In tổng trọng số cây khung nhỏ nhất; nếu đồ thị không liên thông thì in -1. (n, m ≤ 2·10^5)",[["6 9\n4 5 2\n1 2 10\n2 6 19\n2 5 18\n3 5 19\n2 3 5\n1 4 11\n2 4 17\n3 6 16\n","NDQ="],["5 7\n1 2 3\n3 4 5\n2 5 14\n2 4 9\n3 5 19\n2 3 16\n1 4 16\n","MzE="],["6 5\n1 4 1\n1 3 1\n2 3 19\n4 5 4\n1 2 9\n","LTE="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v w': cạnh vô hướng trọng số w, đồ thị liên thông. In tổng trọng số cây khung LỚN nhất. (n, m ≤ 2·10^5)",[["6 9\n1 5 2\n1 3 8\n4 5 10\n1 2 10\n3 6 5\n4 6 16\n1 6 17\n1 4 6\n3 4 8\n","NjE="],["5 8\n1 5 8\n1 4 20\n1 3 5\n2 3 20\n1 2 16\n2 5 5\n3 4 18\n4 5 13\n","NzE="],["6 10\n1 3 6\n1 5 8\n3 4 4\n3 5 11\n3 6 9\n4 5 6\n2 4 6\n1 6 20\n1 2 20\n2 3 1\n","NjY="]]],["Dòng 1: n m. Tiếp theo m dòng 'u v w': đường hai chiều có độ dốc w. Tìm đường đi từ 1 đến n sao cho độ dốc LỚN NHẤT trên đường là nhỏ nhất, in giá trị đó; không có đường thì in -1. (n, m ≤ 2·10^5)",[["6 8\n1 2 12\n1 3 26\n1 4 6\n1 6 23\n5 6 2\n3 6 17\n4 5 15\n3 4 23\n","MTU="],["6 9\n1 2 24\n2 3 26\n1 4 22\n2 5 19\n2 6 28\n4 6 10\n1 5 24\n2 4 12\n1 6 30\n","MjI="],["5 7\n1 5 11\n4 5 20\n1 4 17\n2 4 20\n3 5 23\n1 2 10\n2 3 6\n","MTE="]]],["Dòng 1: n. Tiếp theo n dòng 'x y' là tọa độ các điểm. Chi phí nối hai điểm là |x1-x2| + |y1-y2|. In tổng chi phí nhỏ nhất để nối tất cả các điểm (trực tiếp hoặc gián tiếp). (n ≤ 1000)",[["5\n6 6\n6 8\n2 10\n3 1\n7 1\n","MTg="],["4\n3 6\n7 4\n2 7\n5 4\n","OA=="],["5\n2 4\n10 6\n2 6\n1 5\n3 6\n","MTI="]]],["Dòng 1: n m k. Tiếp theo m dòng 'u v w': cạnh vô hướng, đồ thị liên thông. Chọn một tập cạnh sao cho đồ thị thu được có ĐÚNG k thành phần liên thông và tổng trọng số nhỏ nhất. In tổng đó. (1 ≤ k ≤ n ≤ 2·10^5; gợi ý: dừng Kruskal sớm)",[["6 9 2\n2 6 20\n3 5 19\n1 4 15\n2 3 16\n4 5 4\n5 6 9\n1 2 5\n3 4 1\n2 4 11\n","MTk="],["7 10 3\n3 4 2\n4 6 15\n1 2 18\n3 6 4\n3 5 2\n2 6 16\n5 7 8\n5 6 18\n1 7 17\n2 3 1\n","OQ=="],["6 8 1\n4 5 15\n5 6 12\n2 4 20\n3 5 6\n4 6 9\n1 3 1\n1 2 6\n2 5 12\n","MzQ="]]]],[["Dòng 1: n q. Dòng 2: n-1 số p[2], ..., p[n] với p[i] là cha của đỉnh i (gốc là 1). Tiếp theo q dòng 'u v'. Với mỗi truy vấn in LCA(u, v), tất cả trên một dòng. (n, q ≤ 2·10^5)",[["8 4\n1 2 3 1 2 1 4\n4 7\n7 3\n1 7\n3 6\n","MSAxIDEgMg=="],["7 4\n1 2 1 1 4 6\n1 3\n7 7\n7 3\n5 5\n","MSA3IDEgNQ=="],["9 5\n1 2 1 4 3 3 6 1\n4 2\n4 5\n2 3\n7 1\n5 8\n","MSA0IDIgMSAx"]]],["Dòng 1: n q. Dòng 2: p[2..n] (p[i] là cha của i, gốc 1). Tiếp theo q dòng 'u v'. Với mỗi truy vấn in số cạnh trên đường đi từ u đến v, tất cả trên một dòng. (n, q ≤ 2·10^5)",[["8 4\n1 2 2 1 1 4 2\n3 4\n7 7\n1 8\n1 2\n","MiAwIDIgMQ=="],["9 5\n1 1 2 2 4 5 7 5\n9 3\n3 6\n7 6\n1 7\n8 2\n","NCA0IDQgMyAz"],["7 4\n1 2 1 4 5 4\n3 5\n1 5\n1 5\n2 4\n","NCAyIDIgMg=="]]],["Dòng 1: n q. Tiếp theo n-1 dòng 'p w' lần lượt cho các đỉnh i = 2..n: cha của i là p, cạnh (p, i) dài w. Tiếp theo q dòng 'u v'. Với mỗi truy vấn in độ dài đường đi từ u đến v, trên một dòng. (n, q ≤ 2·10^5)",[["7 4\n1 1\n1 6\n3 3\n3 9\n5 5\n6 7\n5 1\n1 1\n7 2\n7 5\n","MTUgMCAyOCAxMg=="],["8 4\n1 8\n1 5\n3 4\n3 4\n4 8\n2 8\n1 6\n4 8\n7 8\n6 3\n7 6\n","MTUgMjIgMTIgMzM="],["7 5\n1 9\n1 9\n2 6\n4 3\n4 6\n3 2\n5 1\n5 7\n6 7\n6 1\n2 5\n","MTggMjkgMzIgMjEgOQ=="]]],["Dòng 1: n q. Dòng 2: p[2..n] (p[i] là cha của i, gốc 1). Tiếp theo q dòng 'v k'. Với mỗi truy vấn in tổ tiên thứ k của v (k = 1 là cha), nếu không tồn tại thì in 0. In trên một dòng. (n, q ≤ 2·10^5)",[["9 5\n1 1 3 1 1 1 6 7\n4 1\n1 1\n5 2\n2 2\n1 1\n","MyAwIDAgMCAw"],["8 4\n1 2 1 2 3 2 2\n2 2\n1 1\n4 2\n7 1\n","MCAwIDAgMg=="],["9 5\n1 2 2 3 5 6 2 1\n1 1\n2 2\n2 2\n3 1\n2 2\n","MCAwIDAgMiAw"]]],["Dòng 1: n q. Dòng 2: p[2..n] (p[i] là cha của i, gốc 1). Tiếp theo q dòng 'u v w'. Với mỗi truy vấn in YES nếu đỉnh w nằm trên đường đi đơn từ u đến v, ngược lại NO. In trên một dòng. (n, q ≤ 2·10^5; gợi ý: dist(u,w) + dist(w,v) = dist(u,v))",[["8 4\n1 2 2 2 3 6 4\n2 7 4\n2 2 8\n6 6 4\n5 3 7\n","bm8gbm8gbm8gbm8="],["9 5\n1 2 1 4 4 6 1 6\n6 3 9\n3 5 6\n4 9 3\n1 5 3\n3 5 8\n","bm8gbm8gbm8gbm8gbm8="],["8 4\n1 2 1 2 1 1 7\n6 7 3\n3 6 7\n1 3 7\n6 8 3\n","bm8gbm8gbm8gbm8="]]]],[["Dòng 1: n. Dòng 2: n số nguy  n không âm (< 2^30). In giá trị lớn nhất của a[i] XOR a[j] với i < j. (n ≤ 2·10^5)",[["6\n25 7 39 16 21 10\n","NjI="],["5\n22 44 57 51 13\n","NjI="],["7\n49 39 4 29 59 21 17\n","NjM="]]],["Dòng 1: n. Dòng 2: n số nguyên không âm (< 2^30). In giá trị XOR lớn nhất của một đoạn con liên tiếp khác rỗng. (n ≤ 2·10^5; gợi ý: XOR tiền tố + trie)",[["6\n71 37 48 48 51 32\n","MTEz"],["7\n35 99 46 98 7 69 14\n","MTEw"],["5\n93 82 0 23 61\n","MTIw"]]],["Dòng 1: n q. Dòng 2: n số nguyên không âm. Dòng 3: q số x. Với mỗi x in max(x XOR a[i]) trên toàn bộ dãy, tất cả trên một dòng. (n, q ≤ 2·10^5, giá trị < 2^30)",[["5 4\n10 5 60 61 15\n51 62 31 7\n","NjAgNTkgMzUgNTk="],["6 3\n7 48 31 44 40 31\n20 38 27\n","NjAgNTcgNTU="],["5 4\n41 17 3 8 60\n28 55 33 5\n","NTMgNjMgNDggNTc="]]],["Dòng 1: n. Dòng 2: n số nguyên không âm (< 2^30). In giá trị NHỎ nhất của a[i] XOR a[j] với i < j. (n ≤ 2·10^5; gợi ý: ở mỗi bit ưu tiên đi cùng nhánh)",[["6\n22 21 35 33 5 57\n","Mg=="],["7\n38 0 53 17 61 21 32\n","NA=="],["5\n2 63 62 3 20\n","MQ=="]]],["Dòng 1: n k. Dòng 2: n số nguyên không âm (< 2^30). Đếm số cặp i < j có a[i] XOR a[j] < k. (n ≤ 10^5; gợi ý: trie có lưu số lượng ở mỗi nút)",[["6 10\n27 8 23 17 7 7\n","Mg=="],["7 16\n5 22 11 11 30 13 9\n","MTE="],["6 7\n17 6 2 23 1 9\n","Mw=="]]]],[["Dòng 1: n S. Dòng 2: n số nguyên. Đếm số tập con (kể cả tập rỗng) có tổng đúng bằng S. (n ≤ 40, |a[i]| ≤ 10^9)",[["7 15\n10 11 1 2 9 2 3\n","Nw=="],["8 20\n3 1 7 5 6 9 12 7\n","OA=="],["7 12\n12 3 3 5 9 1 12\n","NQ=="]]],["Dòng 1: n S. Dòng 2: n số nguyên dương. In tổng lớn nhất của một tập con (có thể rỗng) mà tổng không vượt quá S. (n ≤ 40, a[i], S ≤ 10^15)",[["6 50\n23 13 14 6 25 22\n","NTA="],["7 77\n5 16 40 10 40 30 28\n","NzU="],["6 61\n23 8 24 11 33 9\n","NjE="]]],["Dòng 1: n S. Dòng 2: n số nguyên dương. Đếm số tập con (kể cả tập rỗng) có tổng ≤ S. (n ≤ 40)",[["6 20\n9 2 3 1 10 1\n","NTE="],["7 25\n2 10 1 6 13 3 2\n","OTg="],["6 18\n15 7 12 9 8 1\n","MTg="]]],["Dòng 1: n. Dòng 2: n số nguyên dương. Chia các số thành hai nhóm (mỗi số thuộc đúng một nhóm, nhóm có thể rỗng). In hiệu nhỏ nhất giữa tổng hai nhóm. (n ≤ 40, a[i] ≤ 10^12)",[["6\n19 20 33 38 10 35\n","MQ=="],["7\n24 47 25 46 45 15 19\n","MQ=="],["7\n31 7 8 42 50 32 36\n","NA=="]]],["Dòng 1: n. Bốn dòng tiếp theo là bốn dãy A, B, C, D, mỗi dãy n số nguyên. Đếm số bộ (i, j, k, l) sao cho A[i] + B[j] + C[k] + D[l] = 0. (n ≤ 2000; gợi ý: liệt kê A+B và C+D rồi ghép)",[["3\n1 -3 3\n3 3 -3\n-2 -2 5\n0 -4 -1\n","NA=="],["3\n5 0 0\n0 1 0\n1 3 -2\n1 5 -1\n","Ng=="],["4\n4 -3 -5 2\n1 3 1 2\n-5 -3 -3 1\n1 2 1 5\n","MTg="]]]]];
T.push(...T2);
const ALL=D.concat(EXTRA);
const nz=s=>s.toLowerCase().split(/\s+/).filter(Boolean).join(' ');
const enc=s=>{try{return btoa(nz(s))}catch(e){return ''}};
const expOut=b=>{try{return atob(b).replace(/\b(yes|no)\b/g,m=>m.toUpperCase())}catch(e){return ''}};
// Bối cảnh (cốt truyện) cho từng vòng, đúng thứ tự các vòng chơi
const STORY=[
"Thư viện trường vừa nhập hàng nghìn cuốn sách với mã số lộn xộn. Thủ thư Lan cần sắp xếp và tra cứu mã sách thật nhanh, vì mỗi giờ có hàng trăm bạn đến mượn.",
"Câu lạc bộ Tin học ghi lại số bài tập mỗi bạn làm được trong từng ngày. Huấn luyện viên muốn trả lời thật nhanh các câu hỏi về tổng số bài trong một khoảng ngày, và cả những đợt cộng thưởng điểm cho nhiều ngày liên tiếp.",
"Nam phụ trách quầy phục vụ của hội chợ xuân, thời gian ít mà việc thì nhiều. Ở mỗi bước, Nam chọn phương án có lợi nhất ngay lúc đó và cần chắc chắn cách làm ấy cho kết quả tối ưu.",
"Trong buổi trại hè, đội của Minh phải mở chiếc hòm bí mật bằng cách thử các cách chọn vật phẩm. Số vật phẩm ít nên có thể thử mọi khả năng, nhưng phải thử có hệ thống và bỏ ngay những nhánh chắc chắn vô ích.",
"Bác Tư bán hàng ở chợ phiên, hay tính toán với những con số rất lớn: chia hết, số nguyên tố, lũy thừa. Bác cần chương trình cho kết quả chính xác mà không bị tràn số.",
"Hùng chuẩn bị đồ cho chuyến chinh phục đỉnh Fansipan. Mỗi món có khối lượng và giá trị sử dụng khác nhau, còn sức mang của anh thì có hạn, nên anh cần chọn phương án tối ưu.",
"Công ty giao hàng Gió Mới có nhiều điểm giao và mạng lưới cửa hàng dạng cây. Giám đốc muốn tìm phương án rẻ nhất và cách phân công nhân sự sao cho không hai cửa hàng kề nhau cùng bị chọn.",
"Thành phố Sương Mù gồm nhiều khu phố nối với nhau bằng các con đường. Bé Na là hướng dẫn viên và cần biết những khu nào đi được sang nhau, đường ngắn nhất giữa hai khu, và lối thoát khỏi mê cung trên bản đồ lưới.",
"Ứng dụng bản đồ Đường Xa cần chỉ đường cho tài xế. Mỗi con đường có độ dài hay chi phí riêng, đôi khi chi phí còn âm nhờ khuyến mãi, và ứng dụng phải luôn tìm ra hành trình ngắn nhất.",
"Vương quốc Ong Mật gồm nhiều tổ nối với nhau bằng cầu. Nhà vua muốn gộp các tổ thành khu vực, xây cầu với tổng chi phí thấp nhất để tất cả tổ đều liên lạc được với nhau.",
"Ban thống kê của giải đấu liên tục cập nhật điểm của các đội và bị hỏi tổng điểm hay điểm nhỏ nhất trong một đoạn bảng xếp hạng. Cần cấu trúc dữ liệu trả lời nhanh, kể cả khi có hàng trăm nghìn câu hỏi.",
"Nhà mật mã học An nhận được những bức thư mã hóa rất dài. Cô cần kiểm tra tính đối xứng, đếm số lần một mẫu xuất hiện, và so sánh nhanh các đoạn thư khác nhau.",
"Trong ngày hội trường, các bạn xếp đĩa và thùng hàng theo kiểu vào sau ra trước. Bình cần tìm thật nhanh, cho từng vị trí, phần tử lớn hơn gần nhất, và kiểm tra dãy ngoặc có hợp lệ hay không.",
"Trạm khí tượng ghi nhiệt độ mỗi ngày. Sau mỗi ngày, trạm phải báo nhiệt độ thấp nhất hoặc cao nhất trong k ngày liên tiếp gần nhất, và vẫn phải chạy nhanh khi chuỗi dữ liệu rất dài.",
"Ban tổ chức kỳ thi có mã số thí sinh lên tới hàng tỷ nhưng chỉ có vài nghìn thí sinh. Để xếp phòng và đếm nhanh, họ cần đánh số lại các mã theo thứ hạng.",
"Cửa hàng của cô Hoa ghi lãi lỗ theo từng ngày. Cô muốn biết dãy ngày liên tiếp nào cho tổng lãi cao nhất hoặc lỗ nhiều nhất, kể cả khi các ca làm việc xếp thành vòng lặp.",
"Sinh viên Khoa phải hoàn thành nhiều môn học, trong đó môn này là điều kiện tiên quyết của môn kia. Nhà trường cần xếp thứ tự học hợp lệ và phát hiện ngay nếu có vòng phụ thuộc.",
"Hệ thống tàu điện ngầm tính vé theo từng chặng: có chặng miễn phí, chặng đắt, và cả chặng được hoàn tiền. Kỹ sư cần tìm hành trình rẻ nhất và cảnh báo nếu có chuỗi chặng khiến tiền giảm mãi.",
"Công ty viễn thông muốn nối cáp quang giữa các trạm với tổng chi phí thấp nhất. Kỹ sư trưởng lần lượt xét những đường cáp rẻ nhất và bỏ những đường gây ra vòng thừa.",
"Gia phả dòng họ Nguyễn là một cây lớn với hàng vạn thành viên. Nhà nghiên cứu cần tìm ngay tổ tiên chung gần nhất của hai người bất kỳ, và phải làm việc đó hàng trăm nghìn lần.",
"Đội an ninh mạng muốn tìm hai mã khóa có độ khác biệt lớn nhất, đo bằng phép XOR. Họ lưu toàn bộ khóa dưới dạng nhị phân để tìm cặp khác biệt nhất thật nhanh.",
"Đội thám hiểm tìm thấy hơn bốn mươi món cổ vật, quá nhiều để thử hết mọi tổ hợp. Họ chia đội làm hai nửa, mỗi nửa tự tính rồi ghép kết quả hai bên lại."
];
function show(){
  const d=ALL[R2.i],[q,ts]=T[R2.i][R2.k];
  app.innerHTML=`<div class="card"><div class="row"><b>Vòng ${R2.i+1}: ${d.n} · Bài ${R2.k+1}/5</b><span class="timer" id="tm">00:00</span></div><div style="background:rgba(91,91,240,.09);border-left:4px solid var(--ac);padding:10px 14px;border-radius:8px;margin:10px 0"><b>📖 Bối cảnh</b><br>${STORY[R2.i]||''}</div><p><b>📝 Nhiệm vụ ${R2.k+1}:</b> ${esc(q)}</p><p class="mut">Viết chương trình C++ đọc từ <code>cin</code> và in ra <code>cout</code>. Khi nộp, code được biên dịch và chạy trên máy chấm trực tuyến với 3 input dưới đây (giới hạn 2 giây mỗi test). Cần có internet.</p>${ts.map((t,j)=>`<p><b>Input ${j+1}</b></p><pre>${esc(t[0])}</pre><p class="mut"><b>Output mong đợi ${j+1}</b></p><pre>${esc(expOut(t[1]))}</pre>`).join('')}<p><b>Code C++ của bạn</b></p><textarea id="code" spellcheck="false"></textarea><p><button id="sub">▶ Chạy &amp; Nộp bài</button> <button class="sec" onclick="tab(2)">Thoát</button></p><div id="res"></div></div>`;
  $('#code').value=TPL;$('#code').onkeydown=k=>{if(k.key=='Tab'){k.preventDefault();const t=k.target;t.setRangeText('    ',t.selectionStart,t.selectionEnd,'end')}};
  $('#sub').onclick=submit;
  document.querySelectorAll('.ans').forEach(e=>e.onkeydown=k=>{if(k.key=='Enter')submit()});
  clearInterval(R2.iv);R2.iv=setInterval(()=>{const e=$('#tm');if(e)e.textContent=fmt(Date.now()-R2.t0)},250);
}
// ===== MÁY CHẤM (Judge0). Đổi url/headers ở đây nếu bạn dùng server hoặc RapidAPI riêng =====
const J={url:'https://ce.judge0.com',lang:54,headers:{'Content-Type':'application/json'}};
const b64=s=>btoa(unescape(encodeURIComponent(s))),ub=s=>{try{return decodeURIComponent(escape(atob((s||'').replace(/\s/g,''))))}catch(e){return ''}};
async function judge(ts,res){
  const code=$('#code').value;
  const body={submissions:ts.map(t=>({source_code:b64(code),language_id:J.lang,stdin:b64(t[0]),compiler_options:'-O2 -std=c++17',cpu_time_limit:2,memory_limit:262144}))};
  try{
    let r=await fetch(J.url+'/submissions/batch?base64_encoded=true',{method:'POST',headers:J.headers,body:JSON.stringify(body)});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const tok=(await r.json()).map(x=>x.token).join(',');
    for(let n=0;n<40;n++){
      await new Promise(z=>setTimeout(z,1000));
      r=await fetch(J.url+'/submissions/batch?base64_encoded=true&fields=status,stdout,compile_output,time&tokens='+tok,{headers:J.headers});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const s=(await r.json()).submissions;
      if(s.every(x=>x.status.id>2))return s;
    }
    throw new Error('máy chấm phản hồi quá lâu');
  }catch(e){
    res.innerHTML='<p class="bad">⚠️ Không gọi được máy chấm ('+esc(e.message)+'). Kiểm tra mạng, thử lại sau ít phút (máy chấm công cộng có giới hạn số lần gọi).</p>';
    return null;
  }
}
let busy=false;
async function submit(){
  if(busy)return;
  const d=ALL[R2.i],ts=T[R2.i][R2.k][1],res=$('#res'),btn=$('#sub');
  busy=true;btn.disabled=true;res.innerHTML='<p class="mut">⏳ Đang biên dịch và chạy trên máy chấm...</p>';
  const S=await judge(ts,res);busy=false;btn.disabled=false;
  if(!S)return;
  const ok=S.map((x,j)=>x.status.id==3&&enc(ub(x.stdout))===ts[j][1]);
  if(!ok.every(Boolean)){
    const ce=S.find(x=>x.status.id==6);
    res.innerHTML='<p class="bad">❌ Đúng '+ok.filter(Boolean).length+'/3. '+S.map((x,j)=>'Input '+(j+1)+': '+(ok[j]?'✅ đúng':'❌ '+(x.status.id==3?'sai kết quả':x.status.id==5?'quá thời gian':x.status.id==6?'lỗi biên dịch':'lỗi lúc chạy'))+(x.time?' ('+x.time+'s)':'')).join(' · ')+'.</p>'+(ce?'<pre>'+esc(ub(ce.compile_output)).slice(0,1200)+'</pre>':'');
    return}
  const now=Date.now();R2.sp.push(now-R2.mark);R2.mark=now;fx();
  if(R2.k<4){res.innerHTML='<p class="ok">🎉 Chính xác cả 3 test! Bạn qua bài '+(R2.k+1)+'.</p><button onclick="R2.k++;R2.mark=Date.now();show()">Bài tiếp theo ▶</button>';$('#sub').disabled=true;return}
  clearInterval(R2.iv);const tot=now-R2.t0;
  if(best[R2.i]==null||tot<best[R2.i]){best[R2.i]=tot;save()}
  app.innerHTML=`<div class="card"><h2>🏆 Hoàn thành vòng ${R2.i+1}!</h2><p>${d.n}</p><p class="timer">${fmt(tot)}</p><table><tr><th>Bài</th><th>Thời gian giải</th></tr>${R2.sp.map((s,j)=>`<tr><td>Bài ${j+1}</td><td>${fmt(s)}</td></tr>`).join('')}</table><h3>Thời gian tốt nhất từng vòng</h3><table>${ALL.map((x,j)=>`<tr><td>Vòng ${j+1}: ${x.n}</td><td>${best[j]!=null?fmt(best[j]):'-'}</td></tr>`).join('')}</table><p><button onclick="tab(2)">Về danh sách vòng</button></p></div>`;
  fx();setTimeout(fx,500);
}
function fx(){const E=['🎉','🎊','⭐','✨','🏆','🥳'];for(let i=0;i<30;i++){const s=document.createElement('span');s.className='fx';s.textContent=E[i%6];s.style.left=Math.random()*95+'vw';s.style.animationDelay=Math.random()*.6+'s';document.body.appendChild(s);setTimeout(()=>s.remove(),2600)}}
function startExploring() {
    if(!USER){showAuth(startExploring);return}
    // Ẩn màn hình chào mừng đi và chuyển sang tab Lý thuyết
    const hero = document.querySelector('.hero-section');
    if (hero) hero.style.display = 'none';
    tab(1);
}


// ===== MÔ PHỎNG 2D =====
const F=o=>JSON.parse(JSON.stringify(o));
const P=(...kv)=>{const o={};for(let i=0;i<kv.length;i+=2){const k=kv[i];if(k==null||k<0)continue;o[k]=o[k]?o[k]+','+kv[i+1]:kv[i+1]}return o};
const rng=(a,b,c,o={})=>{for(let i=a;i<=b;i++)o[i]=c;return o};
const PAL=['#5b5bf0','#16a34a','#dc2626','#d97706','#0891b2','#db2777','#65a30d','#7c3aed'];

function* s_bs(){const a=[2,5,8,12,16,23,38,45,56,72,91],x=23;let lo=0,hi=a.length-1;
const fr=(m,mid,ok)=>{const c={};a.forEach((_,i)=>{if(i<lo||i>hi)c[i]='dim'});if(mid!=null)c[mid]=ok?'ok':'warn';return F({cells:[{label:'a[i]',a,c,p:P(lo,'lo',hi,'hi',mid,'mid'),ix:1}],msg:m,vars:{x,lo,hi,mid:mid??'-'}})};
yield fr(`Tìm x = ${x} trong dãy tăng dần. Ban đầu lo = 0, hi = ${hi}.`);
while(lo<=hi){const mid=(lo+hi)>>1;yield fr(`mid = (${lo} + ${hi}) / 2 = ${mid}. So sánh a[${mid}] = ${a[mid]} với x = ${x}.`,mid);
if(a[mid]==x){yield fr(`a[${mid}] = x. Tìm thấy tại vị trí ${mid}. Mỗi bước loại một nửa dãy nên chỉ mất O(log n).`,mid,1);return}
if(a[mid]<x){lo=mid+1;yield fr(`a[${mid}] < x nên x nằm bên phải: lo = mid + 1 = ${lo}.`)}else{hi=mid-1;yield fr(`a[${mid}] > x nên x nằm bên trái: hi = mid - 1 = ${hi}.`)}}
yield fr('Không tìm thấy x.')}

function* s_pre(){const a=[3,1,4,1,5,9,2,6],n=a.length,p=[0],S=12;
const fr=(m,ca={},cp={},pa={},v={})=>F({cells:[{label:'a[i]',a,off:1,c:ca,p:pa,ix:1,ixo:1},{label:'p[i]',a:p.concat(Array(n+1-p.length).fill('')),c:cp,ix:1}],msg:m,vars:v});
yield fr('Mảng cộng dồn: p[0] = 0, p[i] = p[i-1] + a[i].',{},{0:'ok'});
for(let i=1;i<=n;i++){p.push(p[i-1]+a[i-1]);yield fr(`p[${i}] = p[${i-1}] + a[${i}] = ${p[i-1]} + ${a[i-1]} = ${p[i]}`,{[i-1]:'warn'},{[i-1]:'info',[i]:'ok'})}
yield fr(`Tổng đoạn [3, 6] = p[6] - p[2] = ${p[6]} - ${p[2]} = ${p[6]-p[2]}, chỉ mất O(1).`,rng(2,5,'info'),{6:'ok',2:'bad'});
let l=0,sum=0,best=0,bl=0,br=-1;
yield fr(`Hai con trỏ: tìm đoạn con liên tiếp dài nhất có tổng ≤ ${S}.`,{},{},{},{S});
for(let r=0;r<n;r++){sum+=a[r];yield fr(`Mở rộng r = ${r+1}: tổng cửa sổ = ${sum}.`,rng(l,r,sum>S?'bad':'info'),{},P(l,'l',r,'r'),{S,sum,best});
while(sum>S){sum-=a[l];const o=l+1;l++;yield fr(`Tổng > ${S}: bỏ a[${o}] và tăng l. Tổng = ${sum}.`,rng(l,r,sum>S?'bad':'info'),{},P(l,'l',r,'r'),{S,sum,best})}
if(r-l+1>best){best=r-l+1;bl=l;br=r;yield fr(`Đoạn [${l+1}, ${r+1}] dài ${best} là tốt nhất hiện tại.`,rng(l,r,'ok'),{},P(l,'l',r,'r'),{S,sum,best})}}
yield fr(`Kết quả: đoạn [${bl+1}, ${br+1}] dài ${best}. Mỗi con trỏ chỉ tiến nên tổng O(n).`,rng(bl,br,'ok'),{},{},{S,best})}

function* s_greedy(){const iv=[[1,4],[3,5],[0,6],[5,7],[3,9],[5,9],[6,10],[8,11],[8,12],[2,14],[12,16]],col=iv.map(()=>null);let last=-1,cnt=0;
const fr=m=>F({segs:{s:iv.map((v,i)=>[v[0],v[1],col[i]]),max:16},msg:m,vars:{'kết thúc cuối':last<0?'-':last,'đã chọn':cnt}});
yield fr('Chọn nhiều hoạt động không giao nhau nhất. Các đoạn đã được sắp xếp theo thời điểm kết thúc tăng dần.');
for(let i=0;i<iv.length;i++){const[l,r]=iv[i];col[i]='warn';yield fr(`Xét đoạn [${l}, ${r}].`);
if(l>=last){const pv=last;col[i]='ok';last=r;cnt++;yield fr(pv<0?`Chưa chọn gì: chọn [${l}, ${r}] vì nó kết thúc sớm nhất.`:`Bắt đầu ${l} ≥ ${pv} nên chọn. Đoạn kết thúc sớm nhất để lại nhiều chỗ nhất cho phần sau.`)}
else{col[i]='bad';yield fr(`Bắt đầu ${l} < ${last}: giao với đoạn đã chọn, bỏ qua.`)}}
yield fr(`Xong: chọn được ${cnt} hoạt động, độ phức tạp O(n log n) do sắp xếp.`)}

function* s_nq(){const n=5,q=[];
const fr=(m,ex)=>{const v=[...Array(n)].map(()=>Array(n).fill('')),c={};q.forEach((cc,r)=>{v[r][cc]='Q';c[r+','+cc]='ac'});if(ex){c[ex[0]+','+ex[1]]=ex[2];v[ex[0]][ex[1]]='Q'}return F({grid:{v,c,rl:[1,2,3,4,5],cl:[1,2,3,4,5]},msg:m,vars:{'hậu đã đặt':q.length}})};
function* go(r){if(r==n){yield fr('Đặt đủ 5 quân hậu không ăn nhau. Tìm được lời giải!');return true}
for(let col=0;col<n;col++){const ok=q.every((cc,rr)=>cc!=col&&Math.abs(cc-col)!=r-rr);
yield fr(`Thử đặt hậu hàng ${r+1}, cột ${col+1}: ${ok?'an toàn':'bị ăn (trùng cột hoặc đường chéo)'}.`,[r,col,ok?'ok':'bad']);
if(!ok)continue;q.push(col);if(yield* go(r+1))return true;q.pop();yield fr(`Hàng dưới không đặt được: quay lui, bỏ hậu ở hàng ${r+1}, cột ${col+1}.`)}
return false}
yield fr('Quay lui: đặt 5 quân hậu trên bàn 5×5, mỗi hàng một quân, không quân nào ăn nhau.');yield* go(0)}

function* s_sieve(){const N=50,comp=Array(N+1).fill(0),c={},v=[];for(let r=0;r<5;r++)v.push([...Array(10)].map((_,j)=>r*10+j+1));
const K=x=>((x-1)/10|0)+','+((x-1)%10);c[K(1)]='dim';let pc=0;
const fr=(m,e={})=>F({grid:{v,c:Object.assign({},c,e)},msg:m,vars:{'số nguyên tố':pc}});
yield fr('Sàng Eratosthenes: tìm các số nguyên tố ≤ 50. Số 1 không phải số nguyên tố.');
for(let p=2;p*p<=N;p++){if(comp[p])continue;c[K(p)]='ok';pc++;yield fr(`${p} chưa bị gạch nên là số nguyên tố. Gạch các bội từ ${p}² = ${p*p}.`);
for(let j=p*p;j<=N;j+=p)if(!comp[j]){comp[j]=1;c[K(j)]='bad';yield fr(`Gạch ${j} = ${p} × ${j/p}.`,{[K(p)]:'warn'})}
for(const k in c)if(c[k]=='bad')c[k]='dim'}
for(let i=2;i<=N;i++)if(!comp[i]&&c[K(i)]!='ok'){c[K(i)]='ok';pc++}
yield fr(`Các số còn lại đều là số nguyên tố (${pc} số). Độ phức tạp O(n log log n).`)}

function* s_lcs(){const A='ABCBDAB',B='BDCABA',m=A.length,n=B.length,d=[...Array(m+1)].map(()=>Array(n+1).fill(0)),v=[...Array(m+1)].map((_,i)=>[...Array(n+1)].map((_,j)=>i&&j?'':0)),pc={};
const fr=(m_,e={})=>F({grid:{v,c:Object.assign({},pc,e),rl:['∅',...A],cl:['∅',...B]},msg:m_});
yield fr(`QHĐ xâu con chung dài nhất (LCS) của "${A}" và "${B}". dp[i][j] = LCS của i ký tự đầu A và j ký tự đầu B.`);
for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){const k=i+','+j;
if(A[i-1]==B[j-1]){d[i][j]=d[i-1][j-1]+1;v[i][j]=d[i][j];yield fr(`A[${i}] = B[${j}] = '${A[i-1]}': dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${d[i][j]}.`,{[k]:'ok',[(i-1)+','+(j-1)]:'warn'})}
else{d[i][j]=Math.max(d[i-1][j],d[i][j-1]);v[i][j]=d[i][j];yield fr(`'${A[i-1]}' ≠ '${B[j-1]}': dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${d[i][j]}.`,{[k]:'ac',[(i-1)+','+j]:'info',[i+','+(j-1)]:'info'})}}
let i=m,j=n,s='';yield fr(`Bảng xong, LCS dài ${d[m][n]}. Truy vết ngược từ ô cuối.`,{[m+','+n]:'ok'});
while(i&&j){if(A[i-1]==B[j-1]){s=A[i-1]+s;pc[i+','+j]='ok';i--;j--}else{pc[i+','+j]='warn';if(d[i-1][j]>=d[i][j-1])i--;else j--}yield fr(`Truy vết: xâu thu được "${s}".`)}
yield fr(`Kết quả LCS = "${s}" (độ dài ${s.length}). Độ phức tạp O(m·n).`)}

function* s_tree(){const N=[[.5,.05],[.2,.42],[.5,.42],[.8,.42],[.08,.9],[.32,.9],[.68,.9],[.92,.9]],w=[3,2,5,4,6,1,3,2],ch=[[1,2,3],[4,5],[],[6,7],[],[],[],[]],f0=Array(8).fill(null),f1=Array(8).fill(null),nc={};
const E=[];ch.forEach((cs,u)=>cs.forEach(v=>E.push([u,v])));
const fr=m=>F({g:{n:N.map(([x,y],i)=>[x,y,w[i],f0[i]==null?'':`C${f1[i]} K${f0[i]}`]),e:E,nc},msg:m});
yield fr('QHĐ trên cây: chọn tập đỉnh không kề nhau có tổng trọng số lớn nhất. Số trong đỉnh là trọng số. C = có chọn đỉnh, K = không chọn.');
function* dfs(u){nc[u]='ac';yield fr(`Vào đỉnh trọng số ${w[u]}, xử lý các con trước (DFS hậu thứ tự).`);
for(const v of ch[u]){yield* dfs(v);nc[u]='ac'}
f1[u]=w[u]+ch[u].reduce((s,v)=>s+f0[v],0);f0[u]=ch[u].reduce((s,v)=>s+Math.max(f0[v],f1[v]),0);nc[u]='ok';
yield fr(ch[u].length?`C = ${w[u]} + tổng K của con = ${f1[u]}; K = tổng max(C, K) của con = ${f0[u]}.`:`Lá: C = ${w[u]}, K = 0.`)}
yield* dfs(0);yield fr(`Đáp án = max(C, K) tại gốc = ${Math.max(f0[0],f1[0])}. Mỗi đỉnh xử lý một lần: O(n).`)}

function* s_bfs(){const N=[[.05,.5],[.3,.15],[.3,.85],[.55,.05],[.55,.5],[.7,.9],[.95,.3],[.95,.85]],E=[[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[5,7],[6,7]],dist=Array(8).fill(-1),nc={},ec={},q=[];
const fr=m=>F({g:{n:N.map((p,i)=>[p[0],p[1],i,dist[i]<0?'':'d='+dist[i]]),e:E,nc,ec},cells:[{label:'hàng đợi',a:q}],msg:m});
dist[0]=0;q.push(0);nc[0]='info';yield fr('BFS từ đỉnh 0: dùng hàng đợi, duyệt theo từng lớp khoảng cách.');
while(q.length){const u=q.shift();nc[u]='ac';yield fr(`Lấy đỉnh ${u} ra khỏi đầu hàng đợi, xét các đỉnh kề.`);
E.forEach(([a,b],i)=>{});for(let i=0;i<E.length;i++){const[a,b]=E[i];if(a!=u&&b!=u)continue;const v=a==u?b:a;
if(dist[v]<0){dist[v]=dist[u]+1;q.push(v);nc[v]='info';ec[i]='ok';yield fr(`Đỉnh ${v} chưa thăm: dist = ${dist[v]}, đẩy vào cuối hàng đợi.`)}}
nc[u]='ok'}
yield fr('Hoàn tất. dist là số cạnh ít nhất từ 0; cạnh xanh tạo thành cây BFS. Độ phức tạp O(n + m).')}

function* s_dij(){const N=[[.05,.5],[.35,.1],[.35,.9],[.65,.1],[.65,.9],[.95,.5]],E=[[0,1,4],[0,2,2],[2,1,1],[1,3,5],[2,3,8],[2,4,10],[3,4,2],[3,5,6],[4,5,3]],I=1e9,d=Array(6).fill(I),done=Array(6).fill(0),par=Array(6).fill(-1),nc={};let cur=-1;
const fr=(m,e)=>{const ec={};par.forEach(p=>{if(p>=0)ec[p]='info'});if(e!=null)ec[e]='warn';return F({g:{n:N.map((p,i)=>[p[0],p[1],i,d[i]>=I?'∞':d[i]]),e:E,nc,ec},msg:m,vars:{'đỉnh đang xét':cur<0?'-':cur}})};
d[0]=0;yield fr('Dijkstra từ đỉnh 0. Số dưới mỗi đỉnh là khoảng cách tạm thời.');
for(let t=0;t<6;t++){let u=-1;for(let i=0;i<6;i++)if(!done[i]&&(u<0||d[i]<d[u]))u=i;cur=u;nc[u]='ac';
yield fr(`Chọn đỉnh chưa chốt có dist nhỏ nhất: ${u} (dist = ${d[u]}). Khoảng cách của nó đã tối ưu.`);
for(let i=0;i<E.length;i++){const[a,b,w]=E[i];if(a!=u&&b!=u)continue;const v=a==u?b:a;if(done[v])continue;
if(d[u]+w<d[v]){d[v]=d[u]+w;par[v]=i;yield fr(`Nới lỏng cạnh ${u}-${v}: ${d[u]} + ${w} = ${d[v]} tốt hơn, cập nhật.`,i)}else yield fr(`Cạnh ${u}-${v}: ${d[u]} + ${w} không tốt hơn ${d[v]}.`,i)}
done[u]=1;nc[u]='ok'}
cur=-1;yield fr('Xong. Cạnh màu xanh dương tạo cây đường đi ngắn nhất. Dùng hàng đợi ưu tiên: O(m log n).')}

function* s_dsu(){const n=8,par=[...Array(n).keys()],sz=Array(n).fill(1),N=par.map(i=>[.5+.42*Math.cos(i/n*2*Math.PI-Math.PI/2),.5+.45*Math.sin(i/n*2*Math.PI-Math.PI/2)]);
const root=x=>{while(par[x]!=x)x=par[x];return x};
const fr=(m,hl={})=>{const E=[],nc={};for(let i=0;i<n;i++){if(par[i]!=i)E.push([i,par[i]]);nc[i]=PAL[root(i)]}Object.assign(nc,hl);return F({g:{n:N.map((p,i)=>[p[0],p[1],i]),e:E,nc,dir:1},cells:[{label:'parent',a:par,ix:1}],msg:m})};
function* find(x){const path=[];let r=x;while(par[r]!=r){path.push(r);r=par[r]}const hl={};path.forEach(y=>hl[y]='warn');hl[r]='ac';
yield fr(`find(${x}): đi theo mũi tên lên gốc ${r}.`,hl);if(path.length>1){path.forEach(y=>par[y]=r);yield fr(`Nén đường đi: nối thẳng ${path.join(', ')} vào gốc ${r}.`,{[r]:'ac'})}return r}
yield fr('DSU: mỗi tập là một cây, mũi tên chỉ tới cha. Cùng màu = cùng tập.');
for(const[u,v]of[[0,1],[2,3],[1,3],[4,5],[6,7],[5,7],[3,7],[0,6]]){yield fr(`Hợp nhất(${u}, ${v}).`,{[u]:'warn',[v]:'warn'});
let a=yield* find(u),b=yield* find(v);if(a==b){yield fr(`${u} và ${v} đã cùng gốc ${a}: không làm gì.`);continue}
if(sz[a]<sz[b])[a,b]=[b,a];par[b]=a;sz[a]+=sz[b];yield fr(`Nối gốc ${b} (cây nhỏ) vào gốc ${a} (cây lớn).`)}
yield fr('Tất cả đã về cùng một tập. Với nén đường đi + hợp theo kích thước, mỗi thao tác gần như O(1).')}

function* s_seg(){const a=[5,3,7,9,6,4,1,2],n=8,t=Array(16).fill(''),nc={},rg=Array(16).fill('');
const node=k=>{const d=Math.floor(Math.log2(k)),p=k-(1<<d);return[(p+.5)/(1<<d),d/3]};const E=[];for(let k=1;k<8;k++){E.push([k-1,2*k-1],[k-1,2*k])}
const fr=(m,ca={})=>F({g:{n:[...Array(15)].map((_,i)=>{const[x,y]=node(i+1);return[x,y,t[i+1],rg[i+1]]}),e:E,nc},cells:[{label:'a[i]',a,c:ca,ix:1}],msg:m});
yield fr('Segment Tree: mỗi nút lưu tổng một đoạn. Xây từ dưới lên.');
function* build(k,l,r){rg[k]=`[${l},${r}]`;nc[k-1]='ac';if(l==r){t[k]=a[l];nc[k-1]='ok';yield fr(`Lá [${l},${r}] = a[${l}] = ${a[l]}.`,{[l]:'warn'});return}
yield fr(`Nút [${l},${r}]: xây hai con trước.`,rng(l,r,'info'));const m=(l+r)>>1;yield* build(2*k,l,m);yield* build(2*k+1,m+1,r);
t[k]=t[2*k]+t[2*k+1];nc[k-1]='ok';yield fr(`Nút [${l},${r}] = ${t[2*k]} + ${t[2*k+1]} = ${t[k]}.`,rng(l,r,'info'))}
yield* build(1,0,n-1);for(const k in nc)delete nc[k];const L=2,R=6;let s=0;
yield fr(`Truy vấn tổng đoạn [${L}, ${R}].`,rng(L,R,'warn'));
function* q(k,l,r){if(r<L||l>R){nc[k-1]='dim';yield fr(`[${l},${r}] nằm ngoài: bỏ qua.`,rng(L,R,'warn'));return}
if(L<=l&&r<=R){nc[k-1]='ok';s+=t[k];yield fr(`[${l},${r}] nằm trọn trong truy vấn: lấy ${t[k]}, tổng = ${s}.`,rng(L,R,'warn'));return}
nc[k-1]='warn';yield fr(`[${l},${r}] giao một phần: đi xuống hai con.`,rng(L,R,'warn'));const m=(l+r)>>1;yield* q(2*k,l,m);yield* q(2*k+1,m+1,r)}
yield* q(1,0,n-1);yield fr(`Tổng [${L}, ${R}] = ${s}. Chỉ thăm O(log n) nút.`,rng(L,R,'ok'))}

function* s_kmp(){const T='ABABDABACDABABCABAB',Pt='ABABCABAB',m=Pt.length,lps=Array(m).fill('');lps[0]=0;const found=[];
const fr=(msg,ct={},cp={},off=0,pt={},pp={})=>F({cells:[{label:'văn bản',a:[...T],c:ct,p:pt,ix:1},{label:'mẫu',a:[...Pt],off,c:cp,p:pp},{label:'lps',a:lps,off}],msg,vars:{'vị trí khớp':found.join(', ')||'-'}});
yield fr('KMP bước 1: tính lps[i] = độ dài tiền tố dài nhất cũng là hậu tố của mẫu[0..i].');
let len=0,i=1;while(i<m){if(Pt[i]==Pt[len]){len++;lps[i]=len;yield fr(`mẫu[${i}] = mẫu[${len-1}] = '${Pt[i]}': lps[${i}] = ${len}.`,{},{[i]:'ok',[len-1]:'info'});i++}
else if(len){yield fr(`mẫu[${i}] ≠ mẫu[${len}]: lùi len = lps[${len-1}] = ${lps[len-1]}.`,{},{[i]:'bad',[len]:'bad'});len=lps[len-1]}
else{lps[i]=0;yield fr(`Không khớp và len = 0: lps[${i}] = 0.`,{},{[i]:'bad'});i++}}
yield fr('KMP bước 2: so khớp văn bản. Khi sai, dịch mẫu theo lps thay vì quay lại từ đầu.');
i=0;let j=0;while(i<T.length){const ok=T[i]==Pt[j],ct=rng(i-j,i-1,'ok'),cp=rng(0,j-1,'ok');ct[i]=cp[j]=ok?'ok':'bad';
yield fr(`So văn bản[${i}] = '${T[i]}' với mẫu[${j}] = '${Pt[j]}': ${ok?'khớp':'không khớp'}.`,ct,cp,i-j,{[i]:'i'},{[j]:'j'});
if(ok){i++;j++;if(j==m){found.push(i-m);yield fr(`Tìm thấy mẫu tại vị trí ${i-m}! Tiếp tục với j = lps[${m-1}] = ${lps[m-1]}.`,rng(i-m,i-1,'ok'),rng(0,m-1,'ok'),i-m);j=lps[j-1]}}
else if(j){j=lps[j-1];yield fr(`Dịch mẫu: j = lps[j-1] = ${j}, giữ nguyên i.`,rng(i-j,i-1,'ok'),rng(0,j-1,'ok'),i-j)}else i++}
yield fr(`Xong. Mẫu xuất hiện tại: ${found.join(', ')}. Độ phức tạp O(n + m).`)}

function* s_stack(){const a=[4,5,2,10,8,3,6,1],ans=Array(a.length).fill(''),st=[];
const fr=(m,c={})=>F({cells:[{label:'a[i]',a,c,ix:1},{label:'kết quả',a:ans},{label:'stack',a:st.map(i=>a[i]),p:Object.fromEntries(st.map((v,k)=>[k,'#'+v]))}],msg:m});
yield fr('Stack đơn điệu: tìm phần tử lớn hơn đầu tiên bên phải của mỗi a[i]. Stack giữ chỉ số có giá trị giảm dần.');
for(let i=0;i<a.length;i++){yield fr(`Xét a[${i}] = ${a[i]}.`,{[i]:'warn'});
while(st.length&&a[st[st.length-1]]<a[i]){const t=st.pop();ans[t]=a[i];yield fr(`a[${t}] = ${a[t]} < ${a[i]}: đáp án của vị trí ${t} là ${a[i]}, lấy ra khỏi stack.`,{[i]:'warn',[t]:'ok'})}
st.push(i);yield fr(`Đẩy chỉ số ${i} vào stack.`,{[i]:'info'})}
while(st.length){ans[st.pop()]=-1}yield fr('Các chỉ số còn trong stack không có phần tử lớn hơn bên phải: -1. Mỗi phần tử vào/ra stack 1 lần: O(n).')}

function* s_deque(){const a=[1,3,-1,-3,5,3,6,7],k=3,dq=[],out=[];
const fr=(m,c={})=>F({cells:[{label:'a[i]',a,c,ix:1},{label:'deque',a:dq.map(i=>a[i]),p:Object.fromEntries(dq.map((v,j)=>[j,'#'+v]))},{label:'min',a:out,off:k-1}],msg:m,vars:{k}});
yield fr(`Min của mọi cửa sổ độ dài ${k}. Deque giữ chỉ số có giá trị tăng dần, đầu deque luôn là min.`);
for(let i=0;i<a.length;i++){const w=rng(Math.max(0,i-k+1),i,'info');w[i]='warn';yield fr(`Xét a[${i}] = ${a[i]}.`,w);
while(dq.length&&a[dq[dq.length-1]]>=a[i]){const t=dq.pop();yield fr(`a[${t}] = ${a[t]} ≥ ${a[i]}: không bao giờ là min nữa, bỏ khỏi cuối deque.`,w)}
dq.push(i);if(dq[0]<=i-k){const t=dq.shift();yield fr(`Chỉ số ${t} đã ra khỏi cửa sổ: bỏ khỏi đầu deque.`,w)}else yield fr(`Đẩy ${i} vào cuối deque.`,w);
if(i>=k-1){out.push(a[dq[0]]);const c=Object.assign({},w,{[dq[0]]:'ok'});yield fr(`Cửa sổ [${i-k+1}, ${i}]: min = a[${dq[0]}] = ${a[dq[0]]}.`,c)}}
yield fr('Xong. Mỗi chỉ số vào/ra deque tối đa 1 lần: O(n).')}

function* s_comp(){const a=[100,5,2000,5,37,100,999],b=[],u=[],rk=Array(a.length).fill('');
const fr=(m,ca={},cb={},cu={})=>F({cells:[{label:'a',a,c:ca,ix:1},{label:'sắp xếp',a:b,c:cb},{label:'unique',a:u,c:cu,ix:1},{label:'hạng',a:rk}],msg:m});
yield fr('Rời rạc hóa: thay mỗi giá trị lớn bằng thứ hạng của nó (0, 1, 2, ...), giữ nguyên thứ tự so sánh.');
b.push(...[...a].sort((x,y)=>x-y));yield fr('Bước 1: sao chép và sắp xếp.',{},rng(0,b.length-1,'info'));
b.forEach((x,i)=>{if(!i||x!=b[i-1])u.push(x)});yield fr('Bước 2: xóa phần tử trùng (unique + erase).',{},{},rng(0,u.length-1,'info'));
for(let i=0;i<a.length;i++){const p=u.indexOf(a[i]);rk[i]=p;yield fr(`lower_bound(${a[i]}) trả về vị trí ${p}: hạng của a[${i}] là ${p}.`,{[i]:'warn'},{},{[p]:'ok'})}
yield fr('Xong: giá trị giờ nằm trong [0, số giá trị khác nhau), có thể dùng làm chỉ số mảng / Fenwick. O(n log n).')}

function* s_kad(){const a=[-2,1,-3,4,-1,2,1,-5,4];let cur=0,best=-1e9,s=0,bs=0,be=0;
const fr=(m,i)=>{const c=rng(s,i??-1,'info');if(best>-1e9)Object.assign(c,rng(bs,be,'ok'));if(i!=null)c[i]='warn';return F({cells:[{label:'a[i]',a,c,ix:1,p:P(s,'đầu',i,'i')}],msg:m,vars:{cur,best:best>-1e9?best:'-'}})};
yield fr('Kadane: cur = tổng lớn nhất của đoạn kết thúc tại i; best = đáp án.');
for(let i=0;i<a.length;i++){if(cur+a[i]<a[i]){cur=a[i];s=i;yield fr(`cur + a[${i}] < a[${i}]: bỏ đoạn cũ, bắt đầu lại từ ${i}. cur = ${cur}.`,i)}else{cur+=a[i];yield fr(`Nối a[${i}] = ${a[i]} vào đoạn: cur = ${cur}.`,i)}
if(cur>best){best=cur;bs=s;be=i;yield fr(`cur > best: cập nhật best = ${best}, đoạn [${bs}, ${be}].`,i)}}
yield fr(`Kết quả: tổng lớn nhất = ${best}, đoạn [${bs}, ${be}]. Độ phức tạp O(n).`)}

function* s_topo(){const N=[[.05,.2],[.05,.8],[.35,.2],[.35,.8],[.65,.3],[.65,.9],[.95,.55]],E=[[0,2],[1,2],[1,3],[2,4],[3,4],[3,5],[4,6],[5,6]],deg=Array(7).fill(0),nc={},ec={},q=[],ord=[];E.forEach(([,v])=>deg[v]++);
const fr=m=>F({g:{n:N.map((p,i)=>[p[0],p[1],i,'deg '+deg[i]]),e:E,nc,ec,dir:1},cells:[{label:'hàng đợi',a:q},{label:'thứ tự',a:ord}],msg:m});
yield fr('Kahn: deg = bậc vào. Đỉnh có deg = 0 không phụ thuộc ai, có thể làm trước.');
deg.forEach((d,i)=>{if(!d){q.push(i);nc[i]='info'}});yield fr(`Đẩy các đỉnh bậc vào 0 vào hàng đợi: ${q.join(', ')}.`);
while(q.length){const u=q.shift();ord.push(u);nc[u]='ac';yield fr(`Lấy ${u}, thêm vào thứ tự topo. Xóa các cạnh đi ra từ ${u}.`);
for(let i=0;i<E.length;i++)if(E[i][0]==u){const v=E[i][1];deg[v]--;ec[i]='dim';if(!deg[v]){q.push(v);nc[v]='info';yield fr(`deg(${v}) giảm về 0: đẩy ${v} vào hàng đợi.`)}else yield fr(`deg(${v}) giảm còn ${deg[v]}.`)}
nc[u]='ok'}
yield fr(`Thứ tự topo: ${ord.join(' → ')}. Nếu còn đỉnh chưa lấy được thì đồ thị có chu trình. O(n + m).`)}

function* s_bf(){const N=[[.05,.5],[.38,.1],[.38,.9],[.72,.1],[.95,.6]],E=[[0,1,6],[0,2,7],[1,2,8],[1,3,5],[3,1,-2],[1,4,-4],[2,3,-3],[2,4,9],[4,3,7],[4,0,2]],I=1e9,d=[0,I,I,I,I],n=5;let rd=0;
const fr=(m,e,c)=>F({g:{n:N.map((p,i)=>[p[0],p[1],i,d[i]>=I?'∞':d[i]]),e:E,nc:{0:'ac'},ec:e!=null?{[e]:c}:{},dir:1},msg:m,vars:{'vòng':rd}});
yield fr('Bellman-Ford từ đỉnh 0: lặp n - 1 vòng, mỗi vòng thử nới lỏng mọi cạnh. Cho phép cạnh âm.');
for(rd=1;rd<n;rd++){let ch=0;for(let i=0;i<E.length;i++){const[u,v,w]=E[i];if(d[u]>=I){continue}
if(d[u]+w<d[v]){d[v]=d[u]+w;ch=1;yield fr(`Cạnh ${u}→${v} (${w}): ${d[u]} + (${w}) = ${d[v]}, cập nhật.`,i,'ok')}else yield fr(`Cạnh ${u}→${v} (${w}): không cải thiện.`,i,'warn')}
if(!ch){yield fr(`Vòng ${rd} không có thay đổi: dừng sớm.`);break}}
yield fr('Kiểm tra thêm 1 vòng: không cạnh nào giảm được nữa nên không có chu trình âm. Độ phức tạp O(n·m).')}

function* s_kru(){const N=[[.05,.3],[.35,.05],[.35,.6],[.62,.3],[.62,.95],[.95,.08],[.95,.65]],E=[[0,1,7],[0,2,5],[1,2,9],[1,3,8],[2,3,7],[2,4,6],[3,4,8],[3,5,5],[3,6,9],[4,6,11],[5,6,10]],par=[...Array(7).keys()],ec={};let tot=0,cnt=0;
const fd=x=>par[x]==x?x:(par[x]=fd(par[x]));const S=E.map((e,i)=>i).sort((x,y)=>E[x][2]-E[y][2]),sc={};
const fr=(m,cur)=>{const nc={};for(let i=0;i<7;i++)nc[i]=PAL[fd(i)];const e=Object.assign({},ec);if(cur!=null)e[cur]='warn';return F({g:{n:N.map((p,i)=>[p[0],p[1],i]),e:E,nc,ec:e},cells:[{label:'cạnh (w)',a:S.map(i=>E[i][2]),c:sc,p:Object.fromEntries(S.map((i,k)=>[k,E[i][0]+'-'+E[i][1]]))}],msg:m,vars:{'tổng':tot,'số cạnh':cnt}})};
yield fr('Kruskal: sắp xếp cạnh tăng dần, lần lượt thêm cạnh nếu không tạo chu trình (kiểm tra bằng DSU). Cùng màu = cùng thành phần.');
for(let k=0;k<S.length;k++){const i=S[k],[u,v,w]=E[i];sc[k]='warn';yield fr(`Xét cạnh ${u}-${v} trọng số ${w}.`,i);
const a=fd(u),b=fd(v);if(a!=b){par[a]=b;ec[i]='ok';sc[k]='ok';tot+=w;cnt++;yield fr(`${u} và ${v} khác thành phần: chọn cạnh, tổng = ${tot}.`)}
else{ec[i]='dim';sc[k]='bad';yield fr(`${u} và ${v} đã cùng thành phần: bỏ qua (sẽ tạo chu trình).`)}
if(cnt==6){yield fr(`Đã đủ n - 1 = 6 cạnh. Tổng cây khung nhỏ nhất = ${tot}. O(m log m).`);return}}}

function* s_lca(){const N=[[.5,.04],[.25,.28],[.75,.28],[.12,.52],[.38,.52],[.75,.52],[.04,.76],[.2,.76],[.38,.76],[.64,.76],[.88,.76],[.2,1]],pa=[-1,0,0,1,1,2,3,3,4,5,5,7],dep=pa.map(function f(p,i){return p<0?0:1+f(pa[p],p)}),E=pa.map((p,i)=>[p,i]).filter(e=>e[0]>=0),nc={};
const up=[pa.map((p,i)=>p<0?i:p)];for(let k=1;k<3;k++)up.push(up[k-1].map(x=>up[k-1][x]));
let u=11,v=10;const fr=(m,vv={})=>F({g:{n:N.map((p,i)=>[p[0],p[1],i,'d='+dep[i]]),e:E,nc:Object.assign({},nc,{[u]:'ac',[v]:'warn'},vv)},msg:m,vars:{u,v,'depth u':dep[u],'depth v':dep[v]}});
yield fr('LCA bằng Binary Lifting. Tiền xử lý up[k][x] = tổ tiên thứ 2^k của x: up[k][x] = up[k-1][ up[k-1][x] ].');
yield fr(`Tìm LCA(${u}, ${v}). u sâu hơn v ${dep[u]-dep[v]} mức: nâng u lên trước.`);
let diff=dep[u]-dep[v];for(let k=2;k>=0;k--)if(diff>>k&1){const o=u;u=up[k][u];yield fr(`Bit ${k} của ${dep[o]-dep[v]} bật: nhảy 2^${k} = ${1<<k} bước, u: ${o} → ${u}.`,{[o]:'dim'})}
yield fr(`Giờ u và v cùng độ sâu ${dep[u]}. Nhảy cả hai với k giảm dần, chỉ nhảy khi tổ tiên khác nhau.`);
for(let k=2;k>=0;k--){const a=up[k][u],b=up[k][v];if(a!=b){const ou=u,ov=v;u=a;v=b;yield fr(`k = ${k}: up[${k}][${ou}] = ${a} ≠ up[${k}][${ov}] = ${b} → nhảy cả hai.`,{[ou]:'dim',[ov]:'dim'})}else yield fr(`k = ${k}: tổ tiên thứ ${1<<k} trùng nhau (${a}) → không nhảy (có thể vượt quá LCA).`,{[a]:'info'})}
const l=up[0][u];yield fr(`LCA = cha của u = ${l}. Mỗi truy vấn O(log n).`,{[l]:'ok'})}

function* s_trie(){const nums=[2,5,7,1],B=3,ids={'0,0':0},N=[[.5,0,'gốc']],E=[],nc={};const x0=6;let xr=0;
const bin=x=>x.toString(2).padStart(B,'0');
const fr=(m,v={})=>F({g:{n:N,e:E,nc},msg:m,vars:v});
yield fr(`Trie nhị phân ${B} bit: chèn ${nums.join(', ')}, sau đó tìm số cho XOR lớn nhất với x = ${x0} (${bin(x0)}).`);
for(const a of nums){for(const k in nc)delete nc[k];let pre=0;nc[0]='ac';
for(let d=1;d<=B;d++){const bit=a>>(B-d)&1,np=pre*2+bit,key=d+','+np;let neu=0;
if(ids[key]==null){ids[key]=N.length;N.push([(np+.5)/(1<<d),d/B,d==B?a:bit]);E.push([ids[(d-1)+','+pre],ids[key],bit]);neu=1}
nc[ids[key]]='ac';pre=np;yield fr(`Chèn ${a} (${bin(a)}): bit thứ ${d} = ${bit}, ${neu?'tạo nút mới':'nút đã có, đi tiếp'}.`,{số:a,bin:bin(a)})}
nc[ids[B+','+a]]='ok';yield fr(`Đã chèn ${a}.`)}
for(const k in nc)delete nc[k];let pre=0;nc[0]='ac';
for(let d=1;d<=B;d++){const bit=x0>>(B-d)&1,want=1-bit;let key=d+','+(pre*2+want),g=want;
if(ids[key]==null){g=bit;key=d+','+(pre*2+bit)}pre=pre*2+g;if(g!=bit)xr|=1<<(B-d);nc[ids[key]]=g!=bit?'ok':'warn';
yield fr(`Bit ${d} của x = ${bit}: muốn đi nhánh ${want} để XOR = 1. ${g==want?'Có nhánh đó!':'Không có, đành đi nhánh '+bit+'.'}`,{x:bin(x0),'XOR hiện tại':bin(xr)})}
yield fr(`Số tốt nhất là ${pre}: ${x0} XOR ${pre} = ${x0^pre}. Mỗi truy vấn O(số bit).`,{x:bin(x0),'kết quả':x0^pre})}

function* s_mitm(){const a=[3,5,-2,8,1,4],T=6,h=3,sums=arr=>[...Array(1<<arr.length)].map((_,m)=>arr.reduce((s,x,i)=>m>>i&1?s+x:s,0));
const L=sums(a.slice(0,h)),R=sums(a.slice(h)).sort((x,y)=>x-y);let cnt=0;
const fr=(m,cl={},cr={},v={})=>F({cells:[{label:'dãy a',a},{label:'tổng trái',a:L,c:cl,ix:1},{label:'phải (sắp)',a:R,c:cr,ix:1}],msg:m,vars:Object.assign({T,'đếm':cnt},v)});
yield fr(`Đếm tập con có tổng = ${T}. Vét cạn 2^6 = 64 tập; Meet in the middle chia đôi: mỗi nửa chỉ 2^3 = 8 tập.`);
yield fr(`Liệt kê tổng mọi tập con của nửa trái [${a.slice(0,h)}] và nửa phải [${a.slice(h)}], sắp xếp nửa phải.`,rng(0,7,'info'),rng(0,7,'info'));
for(let i=0;i<L.length;i++){const need=T-L[i];let lo=R.findIndex(x=>x>=need);if(lo<0)lo=R.length;let hi=lo;while(hi<R.length&&R[hi]==need)hi++;cnt+=hi-lo;
yield fr(hi>lo?`Tổng trái ${L[i]} cần ${need} ở bên phải: tìm nhị phân được ${hi-lo} cách.`:`Tổng trái ${L[i]} cần ${need}: không có bên phải.`,{[i]:hi>lo?'ok':'warn'},hi>lo?rng(lo,hi-1,'ok'):{},{cần:need})}
yield fr(`Kết quả: ${cnt} tập con có tổng ${T}. Độ phức tạp O(2^(n/2) · n) thay vì O(2^n).`)}

const SIMS=[s_bs,s_pre,s_greedy,s_nq,s_sieve,s_lcs,s_tree,s_bfs,s_dij,s_dsu,s_seg,s_kmp,s_stack,s_deque,s_comp,s_kad,s_topo,s_bf,s_kru,s_lca,s_trie,s_mitm];
const SUB=['Tìm kiếm nhị phân','Cộng dồn + Hai con trỏ','Chọn hoạt động (Greedy)','Quay lui: 5 quân hậu','Sàng Eratosthenes','QHĐ: xâu con chung dài nhất','QHĐ trên cây: tập độc lập','BFS trên đồ thị','Dijkstra','DSU: hợp nhất và nén đường','Segment Tree: xây và truy vấn','KMP so khớp xâu','Stack đơn điệu','Deque: min cửa sổ trượt','Rời rạc hóa','Kadane','Sắp xếp topo (Kahn)','Bellman-Ford','Kruskal','LCA Binary Lifting','Trie nhị phân: XOR lớn nhất','Meet in the middle'];

// Đề bài cho từng mô phỏng (cùng thứ tự với SIMS/SUB)
const PROB=[
'Cho dãy n số nguyên đã sắp xếp tăng dần và một giá trị x. Hãy cho biết x có trong dãy không; nếu có thì ở vị trí nào.',
'Cho dãy n số. (1) Trả lời nhanh tổng của một đoạn [l, r] bất kỳ. (2) Tìm đoạn con liên tiếp dài nhất có tổng ≤ S.',
'Cho n hoạt động, mỗi hoạt động có thời điểm bắt đầu và kết thúc. Chọn được nhiều hoạt động nhất sao cho không hai hoạt động nào chồng thời gian nhau.',
'Đặt 5 quân hậu lên bàn cờ 5×5 sao cho không quân nào ăn được quân nào (không cùng hàng, cột hoặc đường chéo).',
'Liệt kê tất cả các số nguyên tố nhỏ hơn hoặc bằng 50.',
'Cho hai xâu ký tự. Tìm xâu con chung dài nhất — dãy ký tự xuất hiện theo đúng thứ tự trong cả hai xâu nhưng không nhất thiết liên tiếp.',
'Cho một cây có trọng số trên mỗi đỉnh. Chọn một tập đỉnh đôi một không kề nhau sao cho tổng trọng số lớn nhất.',
'Cho đồ thị không trọng số. Tính số cạnh ít nhất để đi từ đỉnh 0 tới mỗi đỉnh còn lại.',
'Cho đồ thị có trọng số không âm. Tìm độ dài đường đi ngắn nhất từ đỉnh 0 tới mọi đỉnh khác.',
'Cho một dãy thao tác hợp nhất hai phần tử vào cùng nhóm. Sau mỗi thao tác, cần biết hai phần tử bất kỳ có thuộc cùng một nhóm hay không.',
'Cho dãy n số. Trả lời nhanh nhiều truy vấn tổng của một đoạn [l, r] bất kỳ.',
'Cho văn bản T và xâu mẫu P. Tìm tất cả các vị trí mà P xuất hiện trong T.',
'Với mỗi phần tử của dãy, tìm phần tử đầu tiên ở bên phải có giá trị lớn hơn nó (nếu không có thì -1).',
'Cho dãy n số và số k. Tìm giá trị nhỏ nhất của mỗi đoạn gồm k phần tử liên tiếp.',
'Cho dãy số có giá trị rất lớn nhưng ít giá trị khác nhau. Thay mỗi giá trị bằng thứ hạng của nó (giữ nguyên thứ tự so sánh) để dùng làm chỉ số mảng.',
'Cho dãy n số (có thể âm). Tìm đoạn con liên tiếp có tổng lớn nhất.',
'Cho đồ thị có hướng không chu trình. Sắp thứ tự các đỉnh sao cho mọi cạnh u→v đều có u đứng trước v.',
'Cho đồ thị có hướng, có thể có cạnh trọng số âm. Tìm đường đi ngắn nhất từ đỉnh 0 và phát hiện chu trình âm nếu có.',
'Cho đồ thị liên thông có trọng số. Chọn tập cạnh nối tất cả các đỉnh với tổng trọng số nhỏ nhất (cây khung nhỏ nhất).',
'Cho một cây có gốc và hai đỉnh u, v. Tìm tổ tiên chung gần nhất (LCA) của u và v.',
'Cho một tập số nguyên. Với giá trị x cho trước, tìm số y trong tập sao cho x XOR y lớn nhất.',
'Cho dãy n số và giá trị T. Đếm số tập con có tổng đúng bằng T.'
];
const SC={ok:'#16a34a',bad:'#dc2626',warn:'#d97706',info:'#0891b2'};
const cssv=k=>getComputedStyle(document.documentElement).getPropertyValue(k).trim();
function drawSim(f){const cv=document.getElementById('cv');if(!cv||!f)return;
const dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=Math.round(Math.min(480,Math.max(340,W*.6)));cv.style.height=H+'px';cv.width=W*dpr;cv.height=H*dpr;
const x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,H);
const TX=cssv('--tx'),MU=cssv('--mut'),CA=cssv('--card'),AC=cssv('--ac'),col=c=>c=='ac'?AC:SC[c]||c,fil=c=>c&&c!='dim';
const txt=(s,cx,cy,mw,size,color,bold,al='center')=>{s=String(s);let fs=size;const set=()=>x.font=`${bold?'700 ':''}${fs}px ui-monospace,Menlo,Consolas,monospace`;set();while(fs>7&&x.measureText(s).width>mw){fs--;set()}x.textAlign=al;x.textBaseline='middle';x.fillStyle=color;x.fillText(s,cx,cy)};
const tag=(s,cx,cy,color)=>{s=String(s);x.font='700 11px ui-monospace,Menlo,Consolas,monospace';const w=x.measureText(s).width+8;x.fillStyle=CA;x.globalAlpha=Math.max(x.globalAlpha,.85);x.fillRect(cx-w/2,cy-8,w,16);txt(s,cx,cy,w,11,color,1)};
const rr=(bx,by,w,h,r)=>{x.beginPath();if(x.roundRect)x.roundRect(bx,by,w,h,r);else x.rect(bx,by,w,h)};
const box=(bx,by,w,h,v,c)=>{x.globalAlpha=c=='dim'?.3:1;rr(bx,by,w,h,Math.min(6,w/5));if(fil(c)){x.fillStyle=col(c);x.fill()}x.strokeStyle=fil(c)?col(c):MU;x.lineWidth=1.5;x.stroke();txt(v,bx+w/2,by+h/2+1,w-4,Math.min(15,h*.42),fil(c)?'#fff':TX,1);x.globalAlpha=1};
let top=10,bot=H-8;
if(f.segs){const s=f.segs.s,mx=f.segs.max,rh=Math.min(28,(H-50)/s.length),L0=24,sc=(W-40)/mx;
s.forEach(([l,r,c],i)=>box(L0+l*sc,top+i*rh,(r-l)*sc,rh-5,`[${l}, ${r}]`,c));const ay=top+s.length*rh+6;
x.strokeStyle=MU;x.lineWidth=1;x.beginPath();x.moveTo(L0,ay);x.lineTo(L0+mx*sc,ay);x.stroke();for(let t=0;t<=mx;t+=2){txt(t,L0+t*sc,ay+12,30,11,MU)}}
const rows=f.cells||[];
if(rows.length){const LW=86,ml=Math.max(1,...rows.map(r=>r.a.length+(r.off||0))),cs=Math.max(16,Math.min(46,(W-LW-12)/ml)),rh=rows.map(r=>cs+(r.ix?14:0)+(r.p?16:6)),tot=rh.reduce((a,b)=>a+b,0);
let y=f.g||f.grid?bot-tot:Math.max(top,(top+bot-tot)/2);const ox=LW+Math.max(0,(W-LW-12-ml*cs)/2);
rows.forEach((r,ri)=>{const yy=y+(r.ix?14:0);txt(r.label||'',ox-10,yy+cs/2-2,LW-6,13,MU,1,'right');
if(!r.a.length)txt('(rỗng)',ox+4,yy+cs/2-2,120,13,MU,0,'left');
r.a.forEach((v,i)=>{const bx=ox+(i+(r.off||0))*cs;if(r.ix)txt(i+(r.ixo||0),bx+cs/2,yy-7,cs,10,MU);box(bx+2,yy,cs-4,cs-4,v,r.c&&r.c[i]);if(r.p&&r.p[i]!=null)txt(r.p[i],bx+cs/2,yy+cs+5,cs*1.8,11,AC,1)});y+=rh[ri]});
if(f.g||f.grid)bot-=tot+8}
if(f.grid){const g=f.grid,R=g.v.length,C=g.v[0].length,lw=g.rl?24:0,lt=g.cl?22:0,cs=Math.min(46,(W-20-lw)/C,(bot-top-lt)/R),gx=(W-cs*C-lw)/2+lw,gy=top+lt+Math.max(0,(bot-top-lt-cs*R)/2);
if(g.cl)g.cl.forEach((s,j)=>txt(s,gx+j*cs+cs/2,gy-11,cs,13,MU,1));if(g.rl)g.rl.forEach((s,i)=>txt(s,gx-13,gy+i*cs+cs/2,22,13,MU,1));
g.v.forEach((row,i)=>row.forEach((v,j)=>box(gx+j*cs+1,gy+i*cs+1,cs-2,cs-2,v,g.c&&g.c[i+','+j])))}
if(f.g){const g=f.g,gh=bot-top,r=Math.max(11,Math.min(20,gh/13,W/38)),Pn=g.n.map(([nx,ny])=>[r+10+nx*(W-2*r-20),top+r+2+ny*(gh-2*r-20)]);
g.e.forEach(([u,v,w],i)=>{const c=g.ec&&g.ec[i];const[x1,y1]=Pn[u],[x2,y2]=Pn[v];const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,off=g.dir&&g.e.some(e=>e[0]==v&&e[1]==u)?7:0,nx=-uy*off,ny=ux*off;
const sx=x1+ux*r+nx,sy=y1+uy*r+ny,ex=x2-ux*(r+2)+nx,ey=y2-uy*(r+2)+ny;x.globalAlpha=c=='dim'?.18:1;x.strokeStyle=fil(c)?col(c):MU;x.lineWidth=fil(c)?3.5:1.6;
x.beginPath();x.moveTo(sx,sy);x.lineTo(ex,ey);x.stroke();if(g.dir){x.fillStyle=x.strokeStyle;x.beginPath();x.moveTo(ex,ey);x.lineTo(ex-ux*10-uy*5,ey-uy*10+ux*5);x.lineTo(ex-ux*10+uy*5,ey-uy*10-ux*5);x.closePath();x.fill()}
if(w!=null)tag(w,(sx+ex)/2+nx*1.6,(sy+ey)/2+ny*1.6,fil(c)?col(c):TX);x.globalAlpha=1});
g.n.forEach(([,,lab,sub],i)=>{const c=g.nc&&g.nc[i],[px,py]=Pn[i];x.globalAlpha=c=='dim'?.35:1;x.beginPath();x.arc(px,py,r,0,7);x.fillStyle=fil(c)?col(c):CA;x.fill();x.strokeStyle=fil(c)?col(c):MU;x.lineWidth=2;x.stroke();
txt(lab??'',px,py+1,2*r-4,Math.min(14,r*.8),fil(c)?'#fff':TX,1);if(sub!=null&&sub!=='')tag(sub,px,py+r+10,AC);x.globalAlpha=1})}}

const SM={i:0,gen:null,f:null,t:null,done:false};
const simDelay=()=>{const e=document.getElementById('sSp');return 1800-160*(e?+e.value:5)};
function simStop(){clearInterval(SM.t);SM.t=null;const b=document.getElementById('sGo');if(b)b.textContent=SM.done?'Chạy lại':'Start'}
function simRender(){drawSim(SM.f);$('#sMsg').textContent=SM.f.msg||'';const v=SM.f.vars||{};$('#sVars').innerHTML=Object.keys(v).map(k=>`<span class="chip">${esc(k)} = ${esc(String(v[k]))}</span>`).join('')}
function simNext(){if(SM.done)return;const r=SM.gen.next();if(r.done){SM.done=true;simStop();$('#sStep').disabled=true;return}SM.f=r.value;simRender()}
function simReset(){SM.done=false;simStop();SM.gen=SIMS[SM.i]();$('#sStep').disabled=false;simNext()}
function simPlay(){if(SM.done)simReset();if(SM.t){simStop();return}$('#sGo').textContent='Tạm dừng';SM.t=setInterval(simNext,simDelay())}
function sim(){
  const L=[['ac','Đang xử lý'],['warn','Đang xét'],['ok','Đã chốt / đúng'],['bad','Loại / sai'],['info','Trong hàng đợi / cửa sổ']];
  app.innerHTML=`<div class="card"><h2>Mô phỏng thuật toán</h2><p class="mut">Chọn một thuật toán rồi bấm Start để xem chạy tự động, hoặc bấm Bước tiếp để xem từng bước. Reset để chạy lại từ đầu.</p>
  <label for="simSel" class="sr-only">Chọn thuật toán</label><select id="simSel" class="ans">${ALL.map((d,i)=>`<option value="${i}">${i+1}. ${esc(d.n)} — ${SUB[i]}</option>`).join('')}</select>
  <div id="sProb" class="prob"><b>Đề bài</b><span id="sProbText"></span></div>
  <div class="row" style="margin-top:12px"><div class="row" style="gap:8px"><button id="sGo">Start</button><button id="sStep" class="sec">Bước tiếp</button><button id="sRs" class="sec">Reset</button></div>
  <label class="mut" style="display:flex;align-items:center;gap:8px">Tốc độ <input id="sSp" type="range" min="1" max="10" value="5"></label></div>
  <canvas id="cv" role="img" aria-label="Khung mô phỏng thuật toán"></canvas>
  <div id="sMsg" class="det" aria-live="polite"></div><div id="sVars" class="chips"></div>
  <div class="mut">${L.map(([c,t])=>`<span class="lg"><i style="background:${c=='ac'?'var(--ac)':SC[c]}"></i>${t}</span>`).join('')}</div></div>`;
  const sel=$('#simSel');sel.value=SM.i;const setProb=()=>{const e=$('#sProbText');if(e)e.textContent=PROB[SM.i]||''};setProb();sel.onchange=()=>{SM.i=+sel.value;setProb();simReset()};
  $('#sGo').onclick=simPlay;$('#sStep').onclick=()=>{if(SM.t)simStop();simNext()};$('#sRs').onclick=simReset;
  $('#sSp').oninput=()=>{if(SM.t){clearInterval(SM.t);SM.t=setInterval(simNext,simDelay())}};
  simReset();
}
window.addEventListener('resize',()=>{if(SM.f&&document.getElementById('cv'))drawSim(SM.f)});

// ===== KHỞI ĐỘNG (chạy sau khi mọi hàm đã được khai báo) =====
try{const s=localStorage.getItem(SK);if(s&&getU()[s.toLowerCase()])loginAs(getU()[s.toLowerCase()].name)}catch(e){}
userBox();if(USER)tabRaw(1);