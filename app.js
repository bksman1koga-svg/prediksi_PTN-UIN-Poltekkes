/* Cek Peluang SNBP / SPAN-PTKIN / PMDP Poltekkes - berjalan di browser, tanpa server */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const g=id=>($('#'+id)||{}).value||'';
const num=id=>{const v=parseFloat(g(id));return isNaN(v)?null:v};
const cl=x=>Math.min(1,Math.max(0,x)),mean=a=>a.reduce((s,v)=>s+v,0)/a.length,pc=p=>Math.round(p*100)+'%';
const csv=t=>t.trim().split(/\r?\n/).slice(1).map(l=>{const r=[];let c='',q=0;for(const ch of l){if(ch=='"')q=!q;else if(ch==','&&!q){r.push(c);c=''}else c+=ch}r.push(c);return r.map(x=>x.trim())}).filter(r=>r.length>=5);
const P={snbp:{t:'Prediksi SNBP',ic:'🎓',d:'Seleksi Nasional Berdasarkan Prestasi ke PTN',pt:'PTN'},span:{t:'Prediksi SPAN-PTKIN',ic:'🕌',d:'Seleksi prestasi akademik ke PTKIN',pt:'PTKIN'},pmdp:{t:'Prediksi PMDP Poltekkes',ic:'🩺',d:'Penerimaan mahasiswa Poltekkes Kemenkes',pt:'Poltekkes'}};
let D={dt:[],al:[],sk:{nama:'SMAN 1 Kota Gajah',jumlah_lolos_2025:0,data_contoh:true},ok:true},S={prog:null};
const nk=s=>{const m=s.match(/\(([^)]*)\)/);return [s.replace(/\([^)]*\)/g,''),m?m[1]:''].map(x=>x.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()).filter(Boolean)},same=(a,b)=>nk(a).some(x=>nk(b).includes(x));
const lg=()=>'<span class="lg">🏫</span>';
async function boot(){try{const[a,b,c]=await Promise.all(['data/sekolah.json','data/daya-tampung.csv','data/alumni.csv'].map(u=>fetch(u).then(r=>{if(!r.ok)throw 0;return r.text()})));D.sk=JSON.parse(a);D.dt=csv(b);D.al=csv(c)}catch(e){D.ok=false}render()}
function render(){$('#app').innerHTML=S.prog?progView():home();scrollTo(0,0)}
function banner(){return (D.ok?'':'<div class="card warn">Data daya tampung dan alumni belum termuat, jadi isi Daya Tampung, Peminat, dan data alumni secara manual. Pastikan folder <code>data</code> ikut diunggah ke GitHub.</div>')+(D.ok&&D.sk.data_contoh?'<div class="card warn">Data daya tampung dan alumni masih <b>contoh</b>. Ganti file di folder <code>data/</code> dengan data resmi (lihat README).</div>':'')}
function home(){return `<header class="hero">${lg()}<h3>${esc(D.sk.nama)}</h3><h1>Cek Hasil Prediksi / Peluang</h1><p>Estimasi peluang lolos berdasarkan nilai, prestasi, keketatan program studi, dan rekam jejak alumni sekolah.</p></header>
<div class="wrap">${banner()}<div class="menu">${Object.entries(P).map(([k,p])=>`<a class="card mc" tabindex="0" onclick="S.prog='${k}';render()" onkeydown="if(event.key=='Enter')this.click()"><span>${p.ic}</span><h3>${p.t}</h3><p>${p.d}</p><b>Mulai →</b></a>`).join('')}</div><p class="disc">Hasil berupa estimasi, bukan jaminan kelulusan. Keputusan akhir ada pada panitia seleksi.</p></div>`}

/* ---------- Form ---------- */
const F=(id,l,t='text',x='')=>`<label>${l}<input id="${id}" type="${t}" ${x}></label>`;
const SEL=(id,l,o)=>`<label>${l}<select id="${id}">${o.map(v=>`<option>${v}</option>`).join('')}</select></label>`;
const NV=s=>`class="nv" data-s="${s}" min="0" max="100" step="0.01"`;
const YT=['Tidak','Ya'];
const SUB={IPA:['Fisika','Kimia','Biologi'],IPS:['Ekonomi','Sosiologi','Geografi']};
const sub=(s,j)=>SUB[j].map((m,i)=>F(`m${s}_${j}${i}`,m+' ('+j+')','number',NV(s))).join('');
function jur(s,j){$('#sj'+s).innerHTML=sub(s,j)}
function nilai(k){if(k=='snbp')return `<div class="g">${[1,2,3,4,5].map(s=>F('s'+s,'Nilai Rata-rata Semester '+s,'number',NV(s))).join('')}</div>`;
return [1,2,3,4,5].map(s=>`<details ${s==1?'open':''}><summary>Nilai Semester ${s}</summary>${k=='span'?`<div class="seg"><label><input type="radio" name="j${s}" checked onchange="jur(${s},'IPA')">IPA</label><label><input type="radio" name="j${s}" onchange="jur(${s},'IPS')">IPS</label></div><div class="g">${['Bahasa Indonesia','Bahasa Inggris','Matematika','Pendidikan Agama'].map((m,i)=>F(`m${s}_c${i}`,m,'number',NV(s))).join('')}<span style="display:contents" id="sj${s}">${sub(s,'IPA')}</span></div>`:`<div class="g">${['Bahasa Indonesia','Bahasa Inggris','Matematika','Fisika','Kimia','Biologi'].map((m,i)=>F(`m${s}_c${i}`,m,'number',NV(s))).join('')}</div>`}</details>`).join('')}
const KAT=['-','Istimewa','Baik','Memadai','Kurang'];
const tka=()=>`<p class="sub">Opsional. Kosongkan jika belum ada.</p><div class="g">${[['tm','Matematika'],['ti','Bahasa Indonesia'],['te','Bahasa Inggris']].map(([i,n])=>F(i+'n','Nilai TKA '+n,'number','min=0 max=100')+SEL(i+'c','Kategori TKA '+n,KAT)).join('')}</div>`;
const kes=()=>`<div class="g">${SEL('k_sehat','Berbadan sehat',['Ya','Tidak'])}${SEL('k_buta','Buta warna',YT)}${SEL('k_dengar','Gangguan pendengaran',YT)}${SEL('k_hamil','Sedang hamil',YT)}${SEL('k_peny','Riwayat penyakit dalam',['Tidak','Ada'])}${SEL('k_obat','Konsumsi obat rutin',YT)}${F('k_tb','Tinggi badan (cm)','number','min=50 max=250')}${F('k_bb','Berat badan (kg)','number','min=10 max=250')}</div><p class="sub">Persyaratan kesehatan tiap prodi berbeda. Cek ketentuan resmi Poltekkes.</p>`;
const pres=()=>[1,2,3].map(i=>`<div class="g">${F('pr'+i,'Prestasi Siswa '+i)}${SEL('pl'+i,'Tingkat',['-','Kabupaten/Kota','Provinsi','Nasional','Internasional'])}</div>`).join('');
function pil(n){const k=S.prog,x=P[k],b=k!='snbp';return `<div class="pil"><h4>Pilihan ${n} ${n==2?'<small>(opsional)</small>':''}</h4><div class="g">
<label>${x.pt} ${n}<select id="p${n}_ptn" onchange="lookup(${n})"><option value="">- Pilih ${x.pt} -</option>${((window.LIST||{})[k]||[]).map(v=>`<option>${esc(v)}</option>`).join('')}</select></label><label>Prodi${b?' 1':''}<input id="p${n}_prodi" list="dl_pr${n}" oninput="lookup(${n})"></label>${b?`<label>Prodi 2<input id="p${n}_prodi2" list="dl_pr${n}"></label>`:''}
${SEL(`p${n}_lintas`,'Lintas Jurusan',YT)}${SEL(`p${n}_saing`,'Saingan (teman sekolah)',['Tidak','Ada'])}${F(`p${n}_mp`,'Mapel Pendukung')}${F(`p${n}_mn`,'Nilai Mapel Pendukung','number','min=0 max=100')}
${F(`p${n}_dt`,'Daya Tampung','number','min=0')}${F(`p${n}_pm`,'Peminat tahun lalu','number','min=0')}${F(`p${n}_ad`,'Alumni Yang Diterima','number','min=0')}${F(`p${n}_ap`,'Alumni di Prodi yang dipilih','number','min=0')}${F(`p${n}_au`,'Alumni yang tidak daftar ulang','number','min=0')}</div><div class="chip" id="chip${n}"></div></div>`}
function progView(){const k=S.prog,p=P[k];
const S_=[['Identitas Siswa',`<div class="g">${F('nisn','NISN','text','inputmode="numeric" maxlength="10"')}${F('nama','Nama Siswa')}${F('kelas','Kelas')}${SEL('status','Peringkat Eligible / Umum',['Eligible','Umum'])}<label>Rata-Rata Nilai Raport (Sem 1-5)<input id="avg" type="number" min="0" max="100" step="0.01" placeholder="Otomatis dari nilai semester, bisa diisi manual"></label><label>Jumlah Lolos Alumni 2025<input id="lolos" type="number" min="0" value="${esc(D.sk.jumlah_lolos_2025)}"></label></div>`]];
if(k=='pmdp')S_.push(['Kondisi Kesehatan',kes()]);
S_.push([k=='snbp'?'Nilai Rata-rata Raport':'Nilai Mata Pelajaran',nilai(k)]);if(k=='snbp')S_.push(['Nilai TKA (Opsional)',tka()]);
S_.push(['Prestasi Siswa',pres()],['Pilihan Prodi',`<datalist id="dl_pr1"></datalist><datalist id="dl_pr2"></datalist>${pil(1)}${pil(2)}`]);
return `<header class="hero sm noprint">${lg()}<h3>${esc(D.sk.nama)}</h3><h1>${p.t}</h1></header><div class="wrap"><div class="noprint"><button class="ghost" onclick="S.prog=null;render()">← Kembali</button>${banner()}<div id="form" oninput="upd(event)">${S_.map((s,i)=>`<section class="card sec"><h3><i>${'abcdefg'[i]}</i>${s[0]}</h3>${s[1]}</section>`).join('')}<div class="bar"><button class="btn" onclick="hitung()">Hitung Peluang</button></div></div></div><div id="res"></div></div>`}
function upd(ev){const t=ev&&ev.target,a=$('#avg');if(t&&t.id=='avg')a.dataset.m=a.value?'1':'';
if(!a.dataset.m){const v=[...document.querySelectorAll('.nv')].filter(e=>e.value!=='').map(e=>+e.value);a.value=v.length?mean(v).toFixed(2):''}
[1,2].forEach(n=>{const d=num(`p${n}_dt`),m=num(`p${n}_pm`);$('#chip'+n).textContent=d&&m?`Daya tampung ${d} • Peminat ${m} • Keketatan ${(m/d).toFixed(1)} peminat per kursi`:''})}
function lookup(n){const j=S.prog,ptn=g(`p${n}_ptn`).trim(),pr=g(`p${n}_prodi`).trim().toLowerCase(),set=(id,v)=>{$('#'+id).value=v},sum=(a,i)=>a.reduce((s,r)=>s+(+r[i]||0),0);
$('#dl_pr'+n).innerHTML=D.dt.filter(r=>r[0]==j&&same(r[1],ptn)).map(r=>`<option value="${esc(r[2])}">`).join('');
const r=D.dt.find(r=>r[0]==j&&same(r[1],ptn)&&r[2].toLowerCase()==pr);if(r){set(`p${n}_dt`,r[4]);set(`p${n}_pm`,r[5])}
const al=D.al.filter(a=>a[1]==j&&same(a[2],ptn)),ap=al.filter(a=>a[3].toLowerCase()==pr);if(al.length||r){set(`p${n}_ad`,sum(al,4));set(`p${n}_ap`,sum(ap,4));set(`p${n}_au`,sum(ap,5))}upd()}

/* ---------- Perhitungan ---------- */
const LV={'Kabupaten/Kota':1,'Provinsi':2,'Nasional':3.5,'Internasional':5},KV={Istimewa:1,Baik:.8,Memadai:.5,Kurang:.25};
const cat=p=>p>=.65?['🟢','Peluang Tinggi','g']:p>=.4?['🟡','Peluang Sedang','y']:['🔴','Peluang Rendah','r'];
const bar=(l,v,t,c)=>`<div class="hb"><span>${l}</span><div class="tr"><div class="fi ${c}" style="width:${Math.max(2,Math.min(100,v))}%"></div></div><b>${t}</b></div>`;
function health(){const y=id=>g(id)=='Ya',n=[];if(g('k_sehat')=='Tidak')n.push(['Kondisi tidak sehat',.4]);if(y('k_buta'))n.push(['Buta warna',.4]);if(y('k_dengar'))n.push(['Gangguan pendengaran',.5]);if(y('k_hamil'))n.push(['Sedang hamil',.7]);if(g('k_peny')=='Ada')n.push(['Riwayat penyakit dalam',.7]);if(y('k_obat'))n.push(['Konsumsi obat rutin',.9]);
const tb=num('k_tb'),bb=num('k_bb');if(tb&&bb){const b=bb/((tb/100)**2);if(b<17||b>30)n.push(['IMT '+b.toFixed(1)+' tidak ideal',.85])}return n}
function hitung(){const k=S.prog,nv=[...document.querySelectorAll('.nv')].filter(e=>e.value!==''),vals=nv.map(e=>+e.value);
if(!g('nama').trim())return alert('Isi nama siswa.');const am=num('avg');if(vals.length<3&&am==null)return alert('Isi minimal 3 nilai raport, atau isi langsung kolom Rata-Rata Nilai Raport.');if(vals.some(v=>v<0||v>100)||(am!=null&&(am<0||am>100)))return alert('Nilai harus antara 0 dan 100.');if(!g('p1_ptn')||!g('p1_prodi'))return alert('Isi Pilihan 1 terlebih dahulu.');
const avg=am!=null?am:mean(vals),bySem=[1,2,3,4,5].map(s=>{const a=nv.filter(e=>e.dataset.s==s).map(e=>+e.value);return a.length?mean(a):null}).filter(x=>x!=null),tr=bySem.length>1?bySem[bySem.length-1]-bySem[0]:0;
const pr=[1,2,3].map(i=>g('pl'+i)).filter(l=>LV[l]),ps=pr.reduce((a,l)=>a+LV[l],0);
const tk=k=='snbp'?['tm','ti','te'].map(i=>g(i+'c')).filter(c=>KV[c]):[],hn=k=='pmdp'?health():[];
const one=n=>{const dt=num(`p${n}_dt`),pm=num(`p${n}_pm`),mn=num(`p${n}_mn`),ratio=dt&&pm?Math.max(1,pm/dt):null,rr=cl((avg-70)/25);
const parts=[['Nilai raport',45,rr],['Mapel pendukung',15,mn!=null?cl((mn-70)/25):rr],['Prestasi',15,cl(ps/6)]];if(tk.length)parts.push(['Nilai TKA',10,mean(tk.map(c=>KV[c]))]);
const W=parts.reduce((a,p)=>a+p[1],0),Sk=100*parts.reduce((a,p)=>a+p[1]*p[2],0)/W,R=ratio?45+35*cl(Math.log(ratio)/Math.log(40)):60;
let p=1/(1+Math.exp(-(Sk-R)/8));const mods=[],M=(l,m)=>{if(m!=1){mods.push([l,m]);p*=m}},al=num(`p${n}_ap`)||0,au=num(`p${n}_au`)||0;
M('Status Umum',g('status')=='Umum'?.85:1);M('Lintas jurusan',g(`p${n}_lintas`)=='Ya'?.8:1);M('Ada saingan satu sekolah',g(`p${n}_saing`)=='Ada'?.88:1);M('Rekam jejak alumni di prodi',al?1+Math.min(.12,.04*al):1);M('Alumni tidak daftar ulang',au?1+Math.min(.06,.02*au):1);hn.forEach(x=>M(x[0],x[1]));
p=Math.min(.97,Math.max(.02,p));return{n,ptn:g(`p${n}_ptn`),pr:g(`p${n}_prodi`)+(g(`p${n}_prodi2`)?' / '+g(`p${n}_prodi2`):''),Sk,R,ratio,p,parts,mods}};
const res=[1,2].filter(n=>n==1||g('p2_ptn')).map(one),a=res[0],b=res[1],tot=b?a.p+(1-a.p)*b.p*.95:a.p,c=cat(tot);
const an=[`Rata-rata raport ${avg.toFixed(2)}: ${avg>=90?'sangat kuat':avg>=85?'kuat':avg>=80?'cukup kompetitif':'perlu ditingkatkan untuk prodi ketat'}.`,bySem.length>1?`Tren nilai ${tr>=1?'naik':tr<=-1?'menurun':'stabil'} dari semester awal ke akhir (${tr>=0?'+':''}${tr.toFixed(1)}).`:'',ps?`Prestasi tercatat ${pr.length} dengan bobot ${ps} poin.`:'Belum ada prestasi; prestasi tingkat provinsi atau nasional dapat menambah daya saing.',tk.length?'Nilai TKA ikut diperhitungkan.':'',
...res.map(r=>`Pilihan ${r.n}: ${r.ratio?`keketatan ${r.ratio.toFixed(1)} peminat per kursi, skor profilmu ${r.Sk.toFixed(0)} dibanding skor yang dibutuhkan sekitar ${r.R.toFixed(0)}.`:'data daya tampung dan peminat belum diisi, sehingga dipakai ambang standar.'}${r.mods.length?' Faktor penyesuaian: '+r.mods.map(m=>m[0]).join(', ')+'.':''}`)].filter(Boolean);
const rec=tot>=.8?'Kombinasi pilihanmu kuat. Pertahankan urutan dan pastikan data nilai serta dokumen sudah benar.':a.p<.4&&(!b||b.p<.4)?'Kedua pilihan tergolong berisiko. Pertimbangkan prodi dengan keketatan lebih rendah pada salah satu pilihan, dan siapkan jalur cadangan seperti SNBT atau seleksi mandiri.':b&&b.p>a.p+.2?`Pilihan 2 jauh lebih aman (${pc(b.p)}). Pertahankan Pilihan 1 sebagai target dan Pilihan 2 sebagai cadangan.`:'Peluangmu cukup seimbang. Untuk lebih aman, pilih prodi dengan rasio peminat per daya tampung yang lebih rendah.';
const det=r=>{const q=cat(r.p);return `<div class="pd"><h4><span>Pilihan ${r.n}: ${esc(r.ptn)} - ${esc(r.pr)}</span><span class="tag ${q[2]}">${q[0]} ${q[1]} (${pc(r.p)})</span></h4>
<p class="sub">Skor profilmu dibanding skor yang dibutuhkan</p>${bar('Skor kamu',r.Sk,r.Sk.toFixed(0),'n')}${bar('Skor dibutuhkan',r.R,r.R.toFixed(0),'k')}
<p class="sub">Kekuatan profil (% dari maksimum)</p>${r.parts.map(p=>bar(p[0],p[2]*100,Math.round(p[2]*100)+'%',p[2]>=.6?'g':p[2]>=.35?'y':'r')).join('')}
${r.mods.length?`<p class="sub">Faktor penyesuaian terhadap peluang</p>${r.mods.map(m=>bar(m[0],Math.abs(m[1]-1)*100*2,(m[1]>1?'+':'')+Math.round((m[1]-1)*100)+'%',m[1]>1?'g':'r')).join('')}`:''}</div>`};
$('#res').innerHTML=`<section class="card"><div class="kop">${lg()}<div><b>${esc(D.sk.nama)}</b><br>Hasil ${P[k].t} - ${new Date().toLocaleDateString('id-ID')}</div></div>
<div class="idt">${[['NISN',g('nisn')],['Nama',g('nama')],['Kelas',g('kelas')],['Status',g('status')],['Rata-rata raport',avg.toFixed(2)],['Lolos alumni 2025',g('lolos')]].map(x=>`<div><small>${x[0]}</small>${esc(x[1])||'-'}</div>`).join('')}</div>
<div class="big ${c[2]}"><span>${c[0]}</span><div><small>Peluang gabungan</small><b>${pc(tot)}</b><em>${c[1]}</em></div></div>${res.map(det).join('')}
<h3 style="margin-top:1rem">Analisis Nilai</h3><ul>${an.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h3>Rekomendasi Pilihan</h3><p>${esc(rec)}</p><p class="disc">Analisis dibuat otomatis oleh aturan perhitungan aplikasi. Hasil berupa estimasi, bukan jaminan kelulusan.</p></section>
<div class="bar noprint"><button class="btn" onclick="print()">🖨️ Cetak / Simpan PDF</button></div>`;$('#res').scrollIntoView({behavior:'smooth'})}
boot();
