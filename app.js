
// ---- Typing + strikethrough ----
var lead = "Я снимаю людей, музыку и всё, что между ними. Я",
    words = ["снимаю,", "путешествую,", "ловлю свет,", "создаю дизайн,", "знакомлюсь с людьми,", "сохраняю моменты…"],
    sayEl = document.getElementById("say"), pol = document.getElementById("polaroid"), timers = [];
function later(fn, ms){ timers.push(setTimeout(fn, ms)); }
function play(){
  timers.forEach(clearTimeout); timers = [];
  sayEl.innerHTML = "";
  var t = 400;
  function typeInto(el, text, speed, onChar){
    text.split("").forEach(function(ch){ t += speed; var at = t; later(function(){ el.appendChild(document.createTextNode(ch)); if(onChar) onChar(at); }, at); });
  }
  var intro = document.createElement("span"); sayEl.appendChild(intro);
  typeInto(intro, lead + " ", 12);
  var fin = document.createElement("span"); fin.className = "final on"; sayEl.appendChild(fin);
  words.forEach(function(w, wi){
    var s = document.createElement("span"); s.className = "w";
    var line = document.createElement("i"); s.appendChild(line);
    later(function(){ sayEl.insertBefore(s, fin); }, t);
    var last = wi === words.length - 1;
    // the trailing space belongs to the word, so the line fills the gap before the next word
    typeInto(s, last ? w : w + " ", 26, function(at){
      later(function(){ line.style.width = s.offsetWidth + "px"; }, 70);   // line trails the typing
    });
    if(last){ t += 140; later(function(){ line.style.width = s.offsetWidth + 8 + "px"; s.classList.add("last"); }, t); }
    t += 15;
  });
  t += 120;
  var itEl = document.createElement("span"); itEl.className = "it";
  var plain = document.createElement("span"); fin.appendChild(plain); fin.appendChild(itEl);
  typeInto(plain, "Я люблю ", 32); typeInto(itEl, "людей и фотографию.", 32);
  later(function(){ sayEl.classList.add("done"); }, t + 500);   // strikes soften once everything is said
  later(function(){ pol.classList.add("on"); }, 250);
}
// ---- Still life: public photographic cutouts from the requested reference ----
var POOL = [["", "Искусство замечать", "Прогулка по Аптекарскому огороду: люблю растения, свет и детали.", "assets/objects/object-00.jpg"], ["", "Дороги", "В июле оказался в Китае. И только там вспомнил, что забыл объектив.", "assets/objects/object-01.png"], ["", "Сохранить момент", "Мне хочется сохранить такие моменты и однажды к ним вернуться.", "assets/objects/object-02.png"], ["", "Между съёмками", "Концерты, поездки, новые знакомства. Иногда хочется остановиться и всё это записать.", "assets/objects/object-03.png"], ["", "Пробовать новое", "Мне нравится брать на себя то, чего раньше не делал, и разбираться по ходу.", "assets/objects/object-04.png"], ["", "В пути", "Снимаю в Москве и Петербурге. А в личном канале остаются истории из поездок.", "assets/objects/object-05.png"], ["", "Музыка рядом", "Восемь лет следил за творчеством артистки. А потом получил приглашение снять её концерт.", "assets/objects/object-06.png"], ["", "Смотреть внимательнее", "Взгляд, жест, маленькая деталь. Ради этого люблю портреты и репортаж.", "assets/objects/object-07.png"], ["", "Работа с визуальным", "Фотографии, паттерны, визуализации и графика проектов.", "assets/objects/object-08.png"], ["", "Личный дневник", "В канале сохраняю съёмки, поездки и моменты, к которым хочется вернуться.", "assets/objects/object-09.png"], ["", "Жизнь в движении", "Мне нравится, когда задач много и приходится пробовать то, чего раньше не делал.", "assets/objects/object-10.png"], ["", "Люди и фотография", "Люблю людей. Люблю фотографию. Люблю такие моменты.", "assets/objects/object-11.png"], ["", "Из идеи в проект", "От визуального стиля до организации и фотосъёмки – разные части одной работы.", "assets/objects/object-12.png"]];
var desk = document.getElementById("desk"), shown = [];
function rnd(a,b){ return a + Math.random()*(b-a); }
// every shuffle is an independent random draw: six distinct objects, repeats across shuffles are fine
function shuf(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function pick(n){ return shuf(POOL.map(function(_,i){return i})).slice(0, n); }
function build(i, idx){
  var it = POOL[i], b = document.createElement("button");
  b.className = "obj s" + idx; b.type = "button"; b.setAttribute("aria-label", it[1]);
  b.style.animationDelay = (idx * 0.12) + "s";
  var bob = document.createElement("span"); bob.className = "bob";
  if(it[3]){ var im = document.createElement("img"); im.className = "cut"; im.src = it[3]; im.alt = ""; im.draggable = false; bob.appendChild(im); }
  else { var g = document.createElement("span"); g.className = "glyph"; g.textContent = it[0]; bob.appendChild(g); }
  var cap = document.createElement("span"); cap.className = "cap";
  var t = document.createElement("b"); t.textContent = it[1];
  var d = document.createElement("span"); d.className = "d"; d.textContent = it[2] || "";
  cap.appendChild(t); cap.appendChild(d); b.appendChild(bob); b.appendChild(cap);
  bob.style.setProperty("--d", rnd(5.5,9).toFixed(1) + "s");
  bob.style.setProperty("--dl", (-rnd(0,6)).toFixed(1) + "s");
  bob.style.setProperty("--y", -rnd(10,22).toFixed(0) + "px");
  bob.style.setProperty("--r1", rnd(-6,0).toFixed(1) + "deg");
  bob.style.setProperty("--r2", rnd(0,6).toFixed(1) + "deg");
  function side(){
    var rc = b.getBoundingClientRect(), need = cap.offsetWidth + 18,
        toLeft = rc.left + rc.width/2 < window.innerWidth/2;      // toward the nearest screen edge
    if(toLeft && rc.left < need) toLeft = false;                  // no room there: use the other side
    if(!toLeft && window.innerWidth - rc.right < need) toLeft = true;
    b.classList.toggle("toL", toLeft);
  }
  b.addEventListener("mouseenter", side); b.addEventListener("focus", side);
  return b;
}
function refresh(){
  var old = Array.prototype.slice.call(desk.children);
  old.forEach(function(el){ el.classList.add("leave"); });
  setTimeout(function(){
    desk.innerHTML = "";
    shown = pick(6);
    shown.forEach(function(i, idx){ desk.appendChild(build(i, idx)); });
  }, old.length ? 450 : 0);
}
document.getElementById("shuffle").onclick = refresh;
// The still life is bundled locally so its images do not depend on an external API.
refresh();
play();

// ---- Cursor: objects lean gently away ----
var mx = -9999, my = -9999, state = new WeakMap(), calm = window.matchMedia("(prefers-reduced-motion: reduce)");
window.addEventListener("pointermove", function(e){ if(e.pointerType !== "touch"){ mx = e.clientX; my = e.clientY; } });
document.documentElement.addEventListener("mouseleave", function(){ mx = my = -9999; });
function tick(){
  Array.prototype.slice.call(desk.children).concat([pol]).forEach(function(el){
    var k = el === pol ? 0.28 : 1;   // the polaroid leans much less than the objects
    var o = state.get(el); if(!o){ o = {x:0,y:0,r:0}; state.set(el, o); }
    var rc = el.getBoundingClientRect(),
        dx = rc.left + rc.width/2 - o.x - mx, dy = rc.top + rc.height/2 - o.y - my,
        d = Math.hypot(dx, dy) || 1, R = 240, tx = 0, ty = 0, tr = 0;
    if(!calm.matches && d < R && !el.matches(":hover") && !el.classList.contains("leave")){
      var f = Math.pow(1 - d/R, 1.5);
      tx = dx/d*f*48*k; ty = dy/d*f*48*k; tr = (dx > 0 ? 1 : -1)*f*10*k;
    }
    o.x += (tx - o.x)*.08; o.y += (ty - o.y)*.08; o.r += (tr - o.r)*.08;
    el.style.translate = o.x.toFixed(2) + "px " + o.y.toFixed(2) + "px";
    el.style.rotate = o.r.toFixed(2) + "deg";
  });
  requestAnimationFrame(tick);
}
// open the About note on whichever side of the polaroid has room
var aboutEl = document.getElementById("about");
function placeAbout(){ aboutEl.classList.toggle("flip", pol.getBoundingClientRect().right + 18 + 280 > window.innerWidth); }
pol.addEventListener("mouseenter", placeAbout); pol.addEventListener("focus", placeAbout);
// one-time hover nudges: gone after the first hover, and remembered when storage is available
function seen(id, key){ var el = document.getElementById(id); if(el) el.classList.add("gone"); try{ localStorage.setItem(key, "1"); }catch(e){} }
try{ if(localStorage.getItem("h1")) document.getElementById("hint1").style.display = "none"; if(localStorage.getItem("h2")) document.getElementById("hint2").style.display = "none"; }catch(e){}
desk.addEventListener("mouseover", function(e){ if(e.target.closest && e.target.closest(".obj")) seen("hint1", "h1"); });
pol.addEventListener("mouseenter", function(){ seen("hint2", "h2"); });
pol.addEventListener("focus", function(){ seen("hint2", "h2"); });
requestAnimationFrame(tick);

// ---- Portfolio projects and curated photo selections ----
// project: [title, zone, role label, client, year, line, still ratio, hue, link, [sticky notes], bts count]
var P = [["Ольга Сычёва · «Красная нить»", "director", "Концертная фотография", "", "", "Фотосерия концерта Ольги Сычёвой «Красная нить». Сценический свет, выступление и люди в кадре. Полная серия опубликована в моём фотопортфолио.\n\nЗа кулисами концерта.\nВосемь лет я следил за её творчеством. А потом она написала и предложила поснимать концерт.\n\nЯ оказался рядом с людьми, которых раньше видел только на сцене или слушал в наушниках. На концерте был и Владимир Понкин. Мы шутили, общались и очень быстро нашли общий язык.\n\nМне нравится, когда после съёмки мы не просто расходимся, а продолжаем общаться. Люблю людей. Люблю фотографию. Люблю такие моменты.", "720/1280", 210, "https://chebuzavrrrrr.wfolio.pro/olga-sycheva-krasnaya-nit", ["сцена, свет и голос", "сохранить атмосферу вечера", "полная серия в портфолио"], ["assets/content/sycheva-00.webp", "assets/content/sycheva-01.webp", "assets/content/sycheva-02.webp", "assets/content/sycheva-03.webp", "assets/content/sycheva-04.webp", "assets/content/sycheva-05.webp", "assets/content/sycheva-06.webp", "assets/content/sycheva-07.webp", "assets/content/sycheva-added-01.webp", "assets/content/sycheva-added-02.webp", "assets/content/sycheva-added-03.webp", "assets/content/sycheva-added-04.webp", "assets/content/sycheva-added-05.webp", "assets/content/sycheva-added-06.webp", "assets/content/sycheva-added-07.webp", "assets/content/sycheva-added-08.webp", "assets/content/sycheva-added-09.webp", "assets/content/concert-story-00.webp", "assets/content/concert-story-01.webp", "assets/content/concert-story-02.webp", "assets/content/concert-story-03.webp", "assets/content/concert-story-04.webp", "assets/content/concert-story-05.webp", "assets/content/concert-story-06.webp", "assets/content/concert-story-07.webp", "assets/content/concert-story-08.webp", "assets/content/concert-story-09.webp"], "assets/video/sycheva-concert.mp4"], ["МАИ-МБА", "director", "Спортивный портрет", "", "", "Портретная фотосерия команды МАИ-МБА. Студийная съёмка игроков с баскетбольным мячом.", "720/1280", 210, "https://chebuzavrrrrr.wfolio.pro/fotosessiya-mai-mba", ["команда в кадре", "баскетбол и характер", "портретная серия"], ["assets/content/mba-00.webp", "assets/content/mba-01.webp", "assets/content/mba-02.webp", "assets/content/mba-03.webp", "assets/content/mba-04.webp", "assets/content/mba-05.webp"], "assets/video/mba-backstage.mp4"], ["10-я летняя Универсиада · Сочи", "director", "Спортивная фотография", "", "", "Спортивная фотосерия с 10-й летней Универсиады в Сочи. Кадры с баскетбольной площадки и участники соревнований.", "1280/720", 210, "https://chebuzavrrrrr.wfolio.pro/h-letnyaya-universiada-g-sochi", ["спорт в движении", "событие изнутри", "Сочи"], ["assets/content/sochi-00.webp", "assets/content/sochi-01.webp", "assets/content/sochi-02.webp", "assets/content/sochi-03.webp", "assets/content/sochi-04.webp", "assets/content/sochi-05.webp"], "assets/video/sochi-basketball.mp4"], ["Дарья", "director", "Портретная фотография", "", "", "Портретная серия Дарья из моего фотопортфолио. Лицо, свет, настроение и детали.", "1280/720", 210, "https://chebuzavrrrrr.wfolio.pro/daria", ["портрет и настроение", "увидеть человека", "работа со светом"], ["assets/content/daria-00.webp", "assets/content/daria-01.webp", "assets/content/daria-02.webp", "assets/content/daria-03.webp", "assets/content/daria-04.webp", "assets/content/daria-05.webp"], "assets/video/daria-film.mp4"], ["Ольга Краснова · сольный концерт", "director", "Концертная фотография", "", "", "Фотосерия сольного концерта Ольги Красновой. Музыка, свет и живые моменты вечера.", "720/1280", 210, "https://chebuzavrrrrr.wfolio.pro/olga-krasnova-solnyy-kontsert", ["живая музыка", "люди и эмоции", "концертная история"], ["assets/content/krasnova-00.webp", "assets/content/krasnova-01.webp", "assets/content/krasnova-02.webp", "assets/content/krasnova-03.webp", "assets/content/krasnova-04.webp", "assets/content/krasnova-05.webp"], "assets/video/krasnova-concert.mp4"], ["Графика Волонтёрского центра", "strategist", "Визуальные материалы", "", "", "Графика Волонтёрского центра МАИ и макеты мерча из материалов моего портфолио.", "108/192", 210, "", ["визуальный язык инициатив", "графика и мерч"], ["assets/merch-shirt.webp", "assets/merch-detail.webp", "assets/good-vector.webp", "assets/volunteer-centre.webp"], "assets/volunteer-centre.webp"], ["Закулисье", "promos", "Фотография за кадром", "", "", "За кадром съёмки: свет, оборудование, люди и работа между дублями. Фотосерия «Закулисье» опубликована в моём фотопортфолио.", "506/380", 210, "https://chebuzavrrrrr.wfolio.pro/zakulisie", ["по другую сторону камеры", "люди, свет, процесс", "между дублями"], ["assets/content/backstage-01.webp", "assets/content/backstage-02.webp", "assets/content/backstage-03.webp", "assets/content/backstage-04.webp", "assets/content/backstage-05.webp"], "assets/content/backstage-00.webp"], ["58 ЮТС · за кадром", "promos", "Репортажная фотография", "", "", "Фотосерия 58 ЮТС · за кадром. Закулисные кадры и атмосфера съёмки.", "720/1280", 210, "https://chebuzavrrrrr.wfolio.pro/58-yts-backstage", ["внутри процесса", "моменты за кадром", "за кадром"], ["assets/content/yts-00.webp", "assets/content/yts-01.webp", "assets/content/yts-02.webp", "assets/content/yts-03.webp", "assets/content/yts-04.webp", "assets/content/yts-05.webp"], "assets/video/backstage-shoot.mp4"], ["Добрый вектор", "social", "Организация · дизайн · фото", "", "", "Организовывал проект, разрабатывал визуальный стиль и занимался фотосъёмкой. Проект собрал более 250 участников.", "384/288", 210, "", ["250+ участников", "организация, дизайн и фотосъёмка"], ["assets/good-vector.webp", "assets/volunteer-centre.webp", "assets/merch-detail.webp", "assets/merch-shirt.webp"], "assets/good-vector.webp"], ["Волонтёрский центр МАИ", "social", "Графика и мерч", "", "", "Визуальные материалы Волонтёрского центра МАИ: графика, макет футболки и детали оформления.", "384/288", 210, "", ["идеи для носителей", "графика, которая объединяет"], ["assets/merch-shirt.webp", "assets/merch-detail.webp", "assets/volunteer-centre.webp", "assets/good-vector.webp"], "assets/merch-shirt.webp"], ["Китай · личный дневник", "personal", "Поездки и наблюдения", "", "июль 2026", "В июле я оказался в Китае. Из плюсов – я в Китае. Из минусов – забыл объектив.\n\nВ этом альбоме – фотографии и наблюдения из поездки: улицы, люди, вечерний свет и моменты между ними.", "1280/546", 210, "https://t.me/Chebuzavrrrr/1686", ["из плюсов – я в Китае", "из минусов – забыл объектив", "сохраняю эту поездку"], ["assets/content/china-1686.webp", "assets/content/china-01.webp", "assets/content/china-02.webp", "assets/content/china-03.webp", "assets/content/china-04.webp", "assets/content/china-05.webp", "assets/content/china-added-01.webp", "assets/content/china-added-02.webp", "assets/content/china-added-03.webp", "assets/content/china-added-04.webp", "assets/content/china-added-05.webp", "assets/content/china-added-06.webp", "assets/content/china-added-07.webp", "assets/content/china-added-08.webp", "assets/content/china-added-09.webp", "assets/content/china-added-10.webp", "assets/content/china-added-11.webp", "assets/content/china-added-12.webp", "assets/content/china-added-13.webp", "assets/content/china-added-14.webp", "assets/content/china-added-15.webp", "assets/content/china-added-16.webp", "assets/content/china-added-17.webp", "assets/content/china-added-18.webp"], "assets/video/china-diary.mp4"], ["Аптекарский огород", "personal", "Визуальный дневник", "", "июнь 2026", "Как же я люблю растения.\n\nПрогулка по Аптекарскому огороду: зелень, свет, небо и детали, на которые хочется смотреть подольше. Фотографии из личного канала.", "1280/544", 210, "https://t.me/Chebuzavrrrr/1493", ["как же я люблю растения", "Аптекарский огород", "просто замечать детали"], ["assets/content/garden-00.webp", "assets/content/garden-01.webp", "assets/content/garden-02.webp", "assets/content/garden-03.webp", "assets/content/garden-04.webp", "assets/content/garden-05.webp"], "assets/video/garden-therapy.mp4"], ["Аглая", "personal", "Портретная фотография", "", "", "Портретная серия Аглая. Чёрно-белые кадры и внимание к человеку.", "328/584", 210, "https://chebuzavrrrrr.wfolio.pro/aglaya", ["чёрно-белый портрет", "взгляд и характер", "портретная серия"], ["assets/content/aglaya-01.webp", "assets/content/aglaya-02.webp", "assets/content/aglaya-03.webp", "assets/content/aglaya-04.webp", "assets/content/aglaya-05.webp"], "assets/content/aglaya-00.webp"], ["Влада", "personal", "Портретная фотография", "", "", "Портретная фотосерия Влада из моего фотопортфолио. Свет и пространство вокруг человека.", "328/584", 210, "https://chebuzavrrrrr.wfolio.pro/vlada", ["свет и пространство", "человек в кадре", "портретная история"], ["assets/content/vlada-01.webp", "assets/content/vlada-02.webp", "assets/content/vlada-03.webp", "assets/content/vlada-04.webp", "assets/content/vlada-05.webp"], "assets/content/vlada-00.webp"], ["Марсело", "personal", "Портретная фотография", "", "", "Серия Марсело. Цвет, свет и портретное настроение. Полная подборка – в моём фотопортфолио.", "328/584", 210, "https://chebuzavrrrrr.wfolio.pro/martsello", ["портрет и цвет", "экспериментировать со светом", "замечать настроение"], ["assets/content/martselo-01.webp", "assets/content/martselo-02.webp", "assets/content/martselo-03.webp", "assets/content/martselo-04.webp", "assets/content/martselo-05.webp"], "assets/content/martselo-00.webp"], ["Стендап в кадре", "personal", "Репортажная фотография", "", "", "Фотосерия Стендап в кадре: выступления и участники вечера. Полная серия опубликована в моём фотопортфолио.", "506/380", 210, "https://chebuzavrrrrr.wfolio.pro/standap-still", ["вечер в кадрах", "истории и люди", "репортажная серия"], ["assets/content/standup-01.webp", "assets/content/standup-02.webp", "assets/content/standup-03.webp", "assets/content/standup-04.webp", "assets/content/standup-05.webp"], "assets/content/standup-00.webp"]];
var RECT = {all:[0,0,4000,2200], professional:[0,0,2000,2200], personal:[2000,0,2000,2180], director:[0,100,2000,720], strategist:[0,820,1700,1380], social:[1000,820,1000,640], promos:[0,1500,1700,700]};
var ZLAB = {director:"Фотограф", strategist:"Дизайнер", social:"Организатор"};
var T1 = [["all","Всё"],["professional","Рабочее"],["personal","Личное"]], T2 = [["director","Фотография"],["strategist","Дизайн"],["social","Организация"]];
var BT = [[-10,-20,3,120],[120,10,-4,118],[236,-40,5,100],[250,30,6,96]], NT = [[-14,22,-5],[232,130,4],[-16,170,-3]], TINTS = ["#fff3a8","#ffd6dd","#d6ecd2","#d3e6f7"];
var stage = document.getElementById("stage"), world = document.getElementById("world"), tabs = document.getElementById("tabs"), tabs2 = document.getElementById("tabs2"), sheet = document.getElementById("sheet");
var view = {x:0, y:0, s:1}, current = "all", lastPin = null, moved = false, start = null;
function el(tag, cls, txt){ var e = document.createElement(tag); if(cls) e.className = cls; if(txt != null) e.textContent = txt; return e; }
var MOBILE = window.matchMedia("(max-width: 700px)").matches || (window.matchMedia("(pointer: coarse)").matches && window.innerHeight < 500);   // phones get the lighter layout
function thumb(ar, h, txt, src, play){ var t = el("div", "th", src ? null : (txt || "work still")); t.style.setProperty("--ar", ar); t.style.setProperty("--h", h); if(src){ if(/\.mp4$/.test(src) && !(MOBILE && !play)){ var v = document.createElement("video"); v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.controls = !!play; v.preload = play ? "auto" : "metadata"; v.poster = src.replace(/\.mp4$/, ".jpg"); v.src = src; t.appendChild(v); var pl = v.play(); if(pl && pl.catch) pl.catch(function(){}); } else { var im = el("img"); im.src = /\.mp4$/.test(src) ? src.replace(/\.mp4$/, ".jpg") : src; im.alt = ""; t.appendChild(im); } } return t; }
function put(e, x, y, rot, par){ e.style.left = x + "px"; e.style.top = y + "px"; e.style.setProperty("--rot", rot + "deg"); (par || world).appendChild(e); return e; }
function zlabel(txt, k, x, y, big){ var b = el("button", "zl" + (big ? " big" : ""), txt); b.type = "button"; b.onclick = function(){ if(!moved) go(k); }; return put(b, x, y, -2); }
function openSheet(p, idx, opener){
  lastPin = opener;
  document.getElementById("sTh").replaceWith(thumb(p[6], p[7], null, p[11], true)); document.querySelector(".box .th").id = "sTh";
  document.getElementById("sT").textContent = p[0];
  document.getElementById("sM").textContent = [p[2], p[3], p[4]].filter(Boolean).join(" · ");
  var D = document.getElementById("sD"); D.textContent = p[5]; D.hidden = !p[5];
  var L = document.getElementById("sL");
  if(p[8]){ L.href = p[8]; L.textContent = /t\.me/.test(p[8]) ? "читать в Телеграме ↗" : /youtu/.test(p[8]) ? "смотреть на Ютубе ↗" : "смотреть всю серию ↗"; L.hidden = false; } else { L.hidden = true; }
  var S = document.getElementById("sS"), pics = Array.isArray(p[10]) ? p[10] : [];
  S.textContent = ""; pics.forEach(function(src){ var im = el("img"); im.src = src; im.alt = "За кадром, " + p[0]; im.draggable = false; S.appendChild(im); });
  S.hidden = document.getElementById("sBh").hidden = !pics.length; S.scrollLeft = 0;
  sheet.hidden = false;
  if(idx > 0 && S.children[idx]) S.scrollLeft = S.children[idx].offsetLeft - S.offsetLeft;
  document.getElementById("sX").focus({preventScroll: true}); sheet.querySelector(".box").scrollTop = 0;
}
function mainCard(p){
  var c = el("button", "pin"); c.type = "button";
  c.appendChild(thumb(p[6], p[7], null, p[11])); c.appendChild(el("b", null, p[0])); c.appendChild(el("small", null, [p[2], p[4]].filter(Boolean).join(" · ")));
  c.onclick = function(){ if(!moved) openSheet(p, 0, c); };
  return c;
}
// thread: a red string from each main card's pin to the pins on its BTS photos
var thread = document.createElementNS("http://www.w3.org/2000/svg", "svg"), tpaths = "";
thread.setAttribute("class", "thread"); thread.setAttribute("width", 4000); thread.setAttribute("height", 2200);
function cluster(p, ox, oy, n, K){
  var i, rot = n % 2 ? 2 : -2, imgs = Array.isArray(p[10]) ? p[10] : null, nb = Math.min(imgs ? imgs.length : p[10], BT.length), par = world, X = ox, Y = oy, paths = "";
  if(K){   // scaled cluster: everything inside one wrapper that is enlarged as a unit
    par = el("div", "cl"); par.style.cssText = "position:absolute;left:" + ox + "px;top:" + oy + "px;width:340px;height:1px;transform-origin:0 0;transform:scale(" + K + ")";
    world.appendChild(par); X = 0; Y = 0;
  }
  var sx = X + 165, sy = Y + 44, card = put(mainCard(p), X + 60, Y + 44, rot, par), mb = 44 + card.offsetHeight;   // mb: bottom edge of the main card
  for(i = 0; i < nb; i++){
    var b = el("button", "bts"), by = i < 3 ? mb + BT[i][1] : BT[i][1]; b.type = "button"; b.style.width = BT[i][3] + "px"; b.setAttribute("aria-label", "Фото со съёмок " + (i + 1) + ", " + p[0]);
    if(imgs){ var ph = el("img"); ph.src = imgs[i]; ph.alt = ""; ph.loading = "lazy"; ph.decoding = "async"; ph.draggable = false; b.appendChild(ph); }
    else b.appendChild(thumb("4/3", (p[7] + 40*(i+1)) % 360, "За кадром"));
    (function(i, b){ b.onclick = function(){ if(!moved) openSheet(p, i, b); }; })(i, b);
    put(b, X + BT[i][0], Y + by, BT[i][2], par);
    var ex = X + BT[i][0] + BT[i][3]/2, ey = Y + by, cx = (sx + ex)/2, cy = (sy + ey)/2 + Math.hypot(ex - sx, ey - sy)*0.18;
    paths += '<path d="M' + sx + ' ' + sy + ' Q' + cx.toFixed(0) + ' ' + cy.toFixed(0) + ' ' + ex.toFixed(0) + ' ' + ey.toFixed(0) + '"/>';
  }
  if(K){ var sv = document.createElementNS("http://www.w3.org/2000/svg", "svg"); sv.setAttribute("class", "thread"); sv.setAttribute("width", 420); sv.setAttribute("height", 760); sv.innerHTML = paths; par.appendChild(sv); }
  else tpaths += paths;
  var NS = card.querySelector(".th").offsetHeight < 230 ? [[-14,-10,-5],[232,60,4],[-16,70,-3]] : NT;   // short cards: keep stickies off the title
  p[9].forEach(function(t, j){ var st = el("div", "sticky", t); st.style.fontSize = (t.length <= 12 ? 1.8 : t.length <= 22 ? 1.45 : t.length <= 36 ? 1.2 : t.length <= 52 ? 1.04 : 0.92) + "rem"; st.style.setProperty("--tint", TINTS[(n + j) % TINTS.length]); put(st, X + NS[j][0], Y + NS[j][1], NS[j][2], par); });
}
if(!MOBILE){
var ZORG = {director:[0,100], strategist:[0,820], social:[1040,820], promos:[0,1506]}, cnt = {}, pi = 0;
Object.keys(ZLAB).forEach(function(k){ zlabel(ZLAB[k], k, ZORG[k][0] + 40, ZORG[k][1] + 28); });
function sub(txt, k, x, y){ var b = el("button", "sh", txt); b.type = "button"; b.onclick = function(){ if(!moved) go(k); }; return put(b, x, y, 0); }
zlabel("За кадром и на площадке", "promos", 40, 1514).classList.add("sm");
sub("Рабочее", "professional", 1000, 8); sub("Личное", "personal", 3000, 8);
P.forEach(function(p, n){
  var k = p[1], c = cnt[k] = (cnt[k] || 0) + 1, i = c - 1, ox, oy;
  if(k === "personal"){ ox = 2050 + (i % 3)*660; oy = i < 3 ? 170 : 1180; }
  else if(k === "social"){ ox = 1050 + i*470; oy = 920; }
  else { ox = ZORG[k][0] + 20 + i*(k === "director" ? 270 : 320); oy = ZORG[k][1] + 74; }
  cluster(p, ox, oy, n, k === "social" ? 1.3 : k === "personal" ? 1.65 : 0);
});
thread.innerHTML = tpaths; world.appendChild(thread);
// hand-drawn dashed dividers between the roles and between the two halves
var sd = 11; function rn(){ sd = (sd*9301 + 49297) % 233280; return sd/233280; }
function wob(x1, y1, x2, y2){
  var len = Math.hypot(x2 - x1, y2 - y1), n = Math.max(2, Math.round(len/45)), nx = -(y2 - y1)/len, ny = (x2 - x1)/len, d = "M" + x1 + " " + y1, i;
  for(i = 1; i <= n; i++){ var t = i/n, j = i === n ? 0 : rn()*5 - 2.5; d += " L" + (x1 + (x2 - x1)*t + nx*j).toFixed(0) + " " + (y1 + (y2 - y1)*t + ny*j).toFixed(0); }
  return '<path d="' + d + '"/>';
}
var divs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
divs.setAttribute("class", "divs"); divs.setAttribute("width", 4000); divs.setAttribute("height", 2200);
divs.innerHTML = wob(30, 812, 1980, 812) + wob(1020, 840, 1020, 1470) + wob(2000, 20, 2000, 2180);
world.appendChild(divs);
var note = el("div", "sticky note", "Люблю людей. Люблю фотографию. Люблю такие моменты.\n\nМне нравится, когда после съёмки мы не просто расходимся, а продолжаем общаться. Когда приходишь работать, а в итоге получаешь столько эмоций, что ещё несколько дней ходишь с дурацкой улыбкой.");
note.style.setProperty("--tint", "#fff3a8"); note.style.width = "1100px"; note.style.fontSize = "1.5rem"; note.style.whiteSpace = "pre-line"; note.style.padding = "24px 28px"; put(note, 2060, 900, -1);
var more = el("a", "zl", "Другие проекты"); more.href = "https://chebuzavrrrrr.wfolio.pro/"; more.target = "_blank"; more.rel = "noopener";
more.onclick = function(e){ if(moved) e.preventDefault(); }; more.style.translate = "-50% -50%"; more.style.fontSize = "2.6rem"; put(more, 3560, 900 + note.offsetHeight/2, 0);
}
var BOARD_PHOTOS = [["Вместе после концерта", "assets/content/board-snapshot-01.webp", "1280/866", [100, 625, -4]], ["За столом", "assets/content/board-snapshot-02.webp", "1280/853", [3260, 1080, -3]], ["Рабочее место", "assets/content/board-snapshot-03.webp", "1280/853", [3485, 1080, 3]], ["Портрет", "assets/content/board-snapshot-04.webp", "1280/853", [3710, 1080, -3]], ["Собака на прогулке", "assets/content/board-snapshot-05.webp", "1280/853", 3020, 1100, -3]];
BOARD_PHOTOS.forEach(function(it){
  var p = [it[0], "personal", "", "", "", "", it[2], 210, "", [], [], it[1]];
  var card = el("button", "bts board-snapshot"); card.type = "button"; card.setAttribute("aria-label", it[0]);
  card.style.width = "205px"; var im = el("img"); im.src = it[1]; im.alt = it[0]; im.draggable = false; card.appendChild(im);
  card.onclick = function(){ if(!moved) openSheet(p, 0, card); };
  if(!MOBILE) put(card, it[3], it[4], it[5]);
  else { card.style.cssText = "position:relative;width:min(90%,380px);display:block;margin:24px auto;transform:rotate("+it[5]+"deg)"; document.getElementById("repository").appendChild(card); }
});
var mobileGroups = {};
function mfilter(k, quiet){
  current = k; Array.prototype.forEach.call(tabs.children, function(b){ b.setAttribute("aria-pressed", b.dataset.k === k ? "true" : "false"); });
  var show = {all: ["director","strategist","promos","social","personal"], director: ["director"], strategist: ["strategist","promos"], social: ["social"], personal: ["personal"]}[k] || [];
  Object.keys(mobileGroups).forEach(function(g){ mobileGroups[g].hidden = show.indexOf(g) < 0; });
  if(!quiet) document.getElementById("repository").scrollIntoView({behavior: "smooth", block: "start"});
}
function buildMobile(){
  var sec = document.getElementById("repository"); sec.classList.add("mob");
  var list = el("div", "mbl"); sec.appendChild(list);
  [["director","Фотограф"],["strategist","Дизайнер"],["promos","За кадром и на площадке"],["social","Организатор"],["personal","Личное"]].forEach(function(g){
    var box = el("section", "mbg"); list.appendChild(box); box.appendChild(el("h3", "mbt", g[1])); mobileGroups[g[0]] = box;
    P.forEach(function(p, n){
      if(p[1] !== g[0]) return;
      var w = el("div", "mbc"); box.appendChild(w);
      var keep = world; world = w; cluster(p, 0, 0, n, 1); world = keep;   // the same collage, in its own small box
      var host = w.firstChild, maxY = 0, kids = host.children, i;
      for(i = 0; i < kids.length; i++){ var c = kids[i]; if(c.tagName && c.tagName.toLowerCase() === "svg") continue; maxY = Math.max(maxY, c.offsetTop + c.offsetHeight); }
      var s = Math.min(1, (Math.min(window.innerWidth, 520) - 16)/380);
      w.style.width = (380*s) + "px"; w.style.height = ((maxY + 36)*s) + "px"; host.style.left = (24*s) + "px"; host.style.top = "0px"; host.style.transform = "scale(" + s + ")";
    });
  });
  var pb = mobileGroups.personal;
  pb.appendChild(el("div", "mbn", "Люблю людей. Люблю фотографию. Люблю такие моменты.\n\nМне нравится, когда после съёмки мы не просто расходимся, а продолжаем общаться. Когда приходишь работать, а в итоге получаешь столько эмоций, что ещё несколько дней ходишь с дурацкой улыбкой."));
  var more = el("a", "mbm", "Другие проекты"); more.href = "https://chebuzavrrrrr.wfolio.pro/"; more.target = "_blank"; more.rel = "noopener"; pb.appendChild(more);
}
if(MOBILE) buildMobile();
function apply(){ world.style.transform = "translate(" + view.x.toFixed(1) + "px," + view.y.toFixed(1) + "px) scale(" + view.s.toFixed(4) + ")"; }
function cam(k){
  if(MOBILE) return;
  var W = stage.clientWidth, H = stage.clientHeight, r = RECT[k], top = document.querySelector(".rhead").offsetHeight - 14, Ha = H - top;
  var s = k === "all" ? W/r[2]*0.98 : Math.min(W/r[2]*0.94, Ha/r[3]*0.94);
  view.s = s; view.x = W/2 - (r[0] + r[2]/2)*s; view.y = k === "all" ? top + 12 : top + Ha/2 - (r[1] + r[3]/2)*s; apply();
}
function zoomAt(cx, cy, f){
  var ns = Math.min(2.5, Math.max(0.15, view.s*f)), k = ns/view.s;
  view.x = cx - (cx - view.x)*k; view.y = cy - (cy - view.y)*k; view.s = ns; apply();
}
function go(k, quiet){
  if(MOBILE){ mfilter(k, quiet); return; }
  current = k;
  [tabs, tabs2].forEach(function(g){ Array.prototype.forEach.call(g.children, function(b){ b.setAttribute("aria-pressed", b.dataset.k === k ? "true" : "false"); }); });
  tabs2.style.opacity = (k === "all" || k === "personal") ? "0.35" : "1";
  cam(k);
  if(!quiet) document.getElementById("repository").scrollIntoView({behavior: "smooth", block: "start"});
}
function mk(g, list){ list.forEach(function(c){ var b = el("button", "tab", c[1]); b.type = "button"; b.dataset.k = c[0]; b.onclick = function(){ go(c[0]); }; g.appendChild(b); }); }
mk(tabs, MOBILE ? [["all","Всё"],["director","Фотография"],["strategist","Дизайн"],["social","Организация"],["personal","Личное"]] : T1); mk(tabs2, MOBILE ? [] : T2);
// wander: drag to pan, +/- or pinch (ctrl/cmd + wheel) to zoom; plain scrolling still moves the page
stage.addEventListener("pointerdown", function(e){ if(e.button !== 0 || e.target.closest(".zoomc")) return; start = {x:e.clientX, y:e.clientY, vx:view.x, vy:view.y}; moved = false; });
window.addEventListener("pointermove", function(e){
  if(!start) return;
  var dx = e.clientX - start.x, dy = e.clientY - start.y;
  if(!moved && Math.hypot(dx, dy) > 5){ moved = true; world.classList.add("drag"); stage.style.cursor = "grabbing"; }
  if(moved){ view.x = start.vx + dx; view.y = start.vy + dy; apply(); }
});
window.addEventListener("pointerup", function(){ if(!start) return; start = null; world.classList.remove("drag"); stage.style.cursor = ""; setTimeout(function(){ moved = false; }, 0); });
var wt; stage.addEventListener("wheel", function(e){
  if(!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault(); world.classList.add("drag"); clearTimeout(wt); wt = setTimeout(function(){ world.classList.remove("drag"); }, 160);
  var r = stage.getBoundingClientRect(); zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY*0.01));
}, {passive:false});
document.getElementById("zi").onclick = function(){ zoomAt(stage.clientWidth/2, stage.clientHeight/2, 1.35); };
document.getElementById("zo").onclick = function(){ zoomAt(stage.clientWidth/2, stage.clientHeight/2, 1/1.35); };
document.getElementById("zf").onclick = function(){ go(current, true); };
window.addEventListener("resize", function(){ cam(current); });
if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ cam(current); });
go("all", true);
document.getElementById("sN").onclick = function(){ var S = document.getElementById("sS"); S.scrollBy({left: S.clientWidth*0.8, behavior: "smooth"}); };
document.getElementById("sP").onclick = function(){ var S = document.getElementById("sS"); S.scrollBy({left: -S.clientWidth*0.8, behavior: "smooth"}); };
function closeSheet(){ sheet.querySelectorAll("video").forEach(function(v){ v.pause(); }); sheet.hidden = true; if(lastPin) lastPin.focus(); }
document.getElementById("sX").onclick = closeSheet;
sheet.addEventListener("click", function(e){ if(e.target === sheet) closeSheet(); });
document.addEventListener("keydown", function(e){ if(e.key === "Escape" && !sheet.hidden) closeSheet(); });
// ---- The Exhibition: 3D room, art from art.json, track lights, look-around drag, camera ----
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var stage = $("xs"), xv = $("xv"), room = $("xroom"), dim = $("xdim"), beam = $("xbeam"), card = $("xcard");
  var WALLS = ["left", "centre", "right"], YAW = [-90, 0, 90], P = 400, K = 0.5, idx = 1, zf = 1, px = 0, py = 0, pan = null, moved = false, lamps = [[], [], []], on = null;
  // ceiling track with spot fixtures along each wall, hanging in front of it
  [0, 1, 2].forEach(function(w){
    var rail = document.createElement("div"); rail.className = "xrail";
    for(var i = 0; i < 7; i++){ var f = document.createElement("div"); f.className = "xlt"; f.style.left = (130 + i*173) + "px"; f.innerHTML = "<i></i><b></b>"; rail.appendChild(f); lamps[w].push({el: f, x: 130 + i*173}); }
    $("xw" + w).appendChild(rail);
  });
  var loaded = {}, nearEx = false;
  function loadWall(w){ if(loaded[w] || w < 0 || w > 2) return; var ims = $("xw" + w).querySelectorAll("img[data-src], video[data-src]"); if(!ims.length) return; loaded[w] = 1; Array.prototype.forEach.call(ims, function(im){ im.src = im.dataset.src; if(im.tagName === "VIDEO"){ var play = im.play(); if(play && play.catch) play.catch(function(){}); } }); }   // only counts as done once the paintings exist
  if("IntersectionObserver" in window) new IntersectionObserver(function(es){ if(es[0].isIntersecting && !nearEx){ nearEx = true; loadWall(idx); setTimeout(function(){ loadWall(0); loadWall(1); loadWall(2); }, 3000); } }, {rootMargin: "1400px 0px"}).observe(stage); else { nearEx = true; loadWall(0); loadWall(1); loadWall(2); }
  function place(x, y){ card.style.left = Math.min(x + 18, window.innerWidth - 250) + "px"; card.style.top = Math.min(y + 18, window.innerHeight - 120) + "px"; }
  function lit(a, info, e){   // the nearest track light switches on and throws a soft warm beam onto the piece; the room dims gently
    var w = +a.dataset.w, cxw = parseFloat(a.style.left) + parseFloat(a.style.width)/2, best = lamps[w][0];
    lamps[w].forEach(function(l){ if(Math.abs(l.x - cxw) < Math.abs(best.x - cxw)) best = l; });
    if(on && on !== best) on.el.classList.remove("on"); on = best; best.el.classList.add("on");
    var r = a.getBoundingClientRect(), lr = best.el.querySelector("b").getBoundingClientRect(), sx = lr.left + lr.width/2, sy = lr.bottom - 4;
    var cx = r.left + r.width/2, cy = r.top + r.height/2, big = Math.max(r.width, r.height);
    dim.style.setProperty("--cx", cx + "px"); dim.style.setProperty("--cy", cy + "px"); dim.style.setProperty("--rx", big*1.2 + 160 + "px"); dim.style.setProperty("--ry", big*1.0 + 150 + "px");
    var cs = [[r.left, r.top], [r.right, r.top], [r.right, r.bottom], [r.left, r.bottom]].map(function(c){ return {c: c, a: Math.atan2(c[1] - sy, c[0] - sx)}; }).sort(function(u, v){ return u.a - v.a; });
    var u = cs[0].c, v = cs[3].c, d = Math.hypot(cx - sx, cy - sy) + big;
    beam.style.clipPath = "polygon(" + sx + "px " + sy + "px," + u[0] + "px " + u[1] + "px," + v[0] + "px " + v[1] + "px)";
    beam.style.background = "radial-gradient(circle at " + sx + "px " + sy + "px,rgba(255,232,176,.3) 0,rgba(255,232,176,0) " + d + "px)";
    dim.classList.add("on"); beam.classList.add("on");
    if(info.t || info.m || info.n){   // the card shows only what has been filled in
      $("xct").textContent = info.t; $("xcm").textContent = info.m; $("xcd").textContent = info.n;
      $("xct").style.display = info.t ? "" : "none"; $("xcm").style.display = info.m ? "" : "none";
      if(e) place(e.clientX, e.clientY); else place(r.right, r.top);
      card.classList.add("on");
    }
  }
  function unlit(){ dim.classList.remove("on"); beam.classList.remove("on"); card.classList.remove("on"); if(on){ on.el.classList.remove("on"); on = null; } }
  // salon-style patches: groups of 3-4 pieces packed tightly, with open white wall between the groups (works for any number of pieces)
  function pack(items){
    var n = items.length, out = new Array(n); if(!n) return out;
    var np = Math.min(5, Math.ceil(n/4)), gap = 64, pw = Math.min(n <= 4 ? 560 : 440, (1140 - (np - 1)*gap)/np), rowH = n <= 4 ? 250 : n <= 10 ? 190 : 160, base = Math.floor(n/np), extra = n % np, start = 0, x00 = (1300 - (np*pw + (np - 1)*gap))/2;
    for(var p = 0; p < np; p++){
      var cnt = base + (p < extra ? 1 : 0), rows = [], cur = [], curW = 0;
      for(var i = start; i < start + cnt; i++){
        var h = rowH*[1, 0.8, 1.15, 0.9][i % 4], w = h*items[i].ar; if(w > pw){ w = pw; h = w/items[i].ar; }
        if(cur.length && curW + 14 + w > pw){ rows.push(cur); cur = []; curW = 0; }
        cur.push({i: i, w: w, h: h}); curW += (cur.length > 1 ? 14 : 0) + w;
      }
      if(cur.length) rows.push(cur); start += cnt;
      var rh = rows.map(function(r){ return Math.max.apply(null, r.map(function(q){ return q.h; })); }), ph = rh.reduce(function(a, b){ return a + b; }, 0) + 16*(rows.length - 1), sc = Math.min(1, 440/ph);
      var y = Math.max(50, Math.min(560 - ph*sc, 300 + [-20, 25, -10, 30, 0][p % 5] - ph*sc/2)), x0 = x00 + p*(pw + gap);
      rows.forEach(function(r, k){
        var rw = r.reduce(function(a, q){ return a + q.w*sc; }, 0) + 14*sc*(r.length - 1), x = x0 + (pw - rw)/2;
        r.forEach(function(q){ out[q.i] = {x: x, y: y + (rh[k]*sc - q.h*sc)/2, w: q.w*sc, h: q.h*sc}; x += q.w*sc + 14*sc; });
        y += rh[k]*sc + 16*sc;
      });
    }
    return out;
  }
  function build(list){
    var k = 0;
    WALLS.forEach(function(name, w){
      var items = list.filter(function(a){ return a.wall === name; }), rects = pack(items.map(function(a){ return {ar: a.w/a.h}; })), wall = $("xw" + w);
      items.forEach(function(it, i){
        var rc = rects[i], a = document.createElement("div"), info = {t: it.title || "", m: [it.year, it.medium].filter(Boolean).join(" · "), n: it.note || ""};
        a.className = "xa"; a.tabIndex = 0; a.dataset.w = w; a.setAttribute("aria-label", info.t || "Работа");
        a.style.cssText = "left:" + rc.x.toFixed(1) + "px;top:" + rc.y.toFixed(1) + "px;width:" + rc.w.toFixed(1) + "px;height:" + rc.h.toFixed(1) + "px;--d:" + (8 + (k*1.3) % 5).toFixed(1) + "s;--dl:" + (-k*1.7).toFixed(1) + "s"; k++;
        a.innerHTML = '<div class="xi"><div class="xim"><img alt="" loading="lazy" decoding="async" draggable="false"></div></div>';
        var pim = a.querySelector("img");
        if(it.video){ var video = document.createElement("video"); video.muted = true; video.loop = true; video.autoplay = true; video.playsInline = true; video.setAttribute("muted", ""); video.setAttribute("playsinline", ""); video.preload = "none"; video.poster = it.file; video.dataset.src = it.video; video.setAttribute("aria-label", info.t || "Видео"); pim.replaceWith(video); }
        else { pim.dataset.src = it.file; pim.alt = info.t || "Работа"; }
        a.addEventListener("pointerenter", function(e){ if(!pan) lit(a, info, e); });
        a.addEventListener("pointermove", function(e){ if(!pan) place(e.clientX, e.clientY); });
        a.addEventListener("pointerleave", function(){ if(!pan) unlit(); });
        a.addEventListener("focus", function(){ lit(a, info); }); a.addEventListener("blur", unlit);
        wall.appendChild(a);
      });
    });
  }
  function start(list){   // pieces without a width/height get it from the image itself
    var wait = list.filter(function(a){ return !(a.w && a.h); }).map(function(a){ return new Promise(function(res){ var im = new Image(); im.onload = function(){ a.w = im.naturalWidth; a.h = im.naturalHeight; res(); }; im.onerror = function(){ a.w = 4; a.h = 3; res(); }; im.src = a.file; }); });
    Promise.all(wait).then(function(){ build(list); if(nearEx) loadWall(idx); });
  }
  if(window.XART) start(window.XART); else fetch("art.json", {cache: "no-cache"}).then(function(r){ return r.json(); }).then(start).catch(function(){ start([]); });
  window.addEventListener("scroll", function(){ if(!pan) unlit(); }, {passive: true});
  // camera: turn to a wall, walk closer/further, drag to look around the wall you are facing
  function limits(){ return {x: Math.max(40, (1300*K - stage.clientWidth)/2 + 90), y: Math.max(30, (620*K - stage.clientHeight)/2 + 70)}; }
  function ap(){
    var s = Math.min(0.9*stage.clientWidth/1300, 0.78*stage.clientHeight/620); P = 650*s; xv.style.perspective = P.toFixed(1) + "px";
    var d = 650 - 650/zf; K = s*zf;
    var L = limits(); px = Math.max(-L.x, Math.min(L.x, px)); py = Math.max(-L.y, Math.min(L.y, py));
    room.style.transform = "translateZ(" + (P + d).toFixed(1) + "px) rotateY(" + YAW[idx] + "deg)";
    xv.style.transform = "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px)";
  }
  function show(i){
    idx = Math.max(0, Math.min(2, i)); px = py = 0; unlit(); ap(); if(nearEx){ loadWall(idx); loadWall(idx - 1); loadWall(idx + 1); }
    $("xl").disabled = idx === 0; $("xr").disabled = idx === 2;
    Array.prototype.forEach.call($("xd").children, function(b, k){ b.setAttribute("aria-current", k === idx ? "true" : "false"); });
  }
  function zoom(f){ zf = Math.max(0.65, Math.min(2.6, zf*f)); unlit(); ap(); }
  ["левую стену", "центральную стену", "правую стену"].forEach(function(t, k){ var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Показать " + t); b.onclick = function(){ show(k); }; $("xd").appendChild(b); });
  $("xl").onclick = function(){ show(idx - 1); }; $("xr").onclick = function(){ show(idx + 1); };
  $("xzi").onclick = function(){ zoom(1.25); }; $("xzo").onclick = function(){ zoom(0.8); }; $("xzf").onclick = function(){ zf = 1; px = py = 0; ap(); };
  stage.addEventListener("keydown", function(e){
    if(e.key === "ArrowLeft") show(idx - 1); else if(e.key === "ArrowRight") show(idx + 1);
    else if(e.key === "+" || e.key === "=") zoom(1.25); else if(e.key === "-") zoom(0.8);
  });
  var wt; stage.addEventListener("wheel", function(e){
    if(!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); room.classList.add("drag"); xv.classList.add("drag"); clearTimeout(wt); wt = setTimeout(function(){ room.classList.remove("drag"); xv.classList.remove("drag"); }, 160); zoom(Math.exp(-e.deltaY*0.01));
  }, {passive: false});
  stage.addEventListener("pointerdown", function(e){ if(e.button !== 0 || e.target.closest("button, .xnote-wall")) return; pan = {x: e.clientX, y: e.clientY, px: px, py: py}; moved = false; });
  window.addEventListener("pointermove", function(e){
    if(!pan) return; var dx = e.clientX - pan.x, dy = e.clientY - pan.y;
    if(!moved && Math.hypot(dx, dy) > 4){ moved = true; xv.classList.add("drag"); stage.classList.add("grabbing"); unlit(); var h = $("xhint"); if(h) h.classList.add("gone"); }
    if(moved){ px = pan.px + dx; py = pan.py + dy; ap(); }
  });
  function end(){ if(!pan) return; pan = null; xv.classList.remove("drag"); stage.classList.remove("grabbing"); }
  window.addEventListener("pointerup", end); window.addEventListener("pointercancel", end);
  window.addEventListener("resize", ap);
  room.classList.add("drag"); show(1);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ room.classList.remove("drag"); }); });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(ap);
})();
// ---- The Film Roll: negatives to scratch, unspooling on scroll, a viewer for each roll (rolls come from film.json) ----
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var host = $("fl"), PER = 5, MW = 300, MH = 200, DPR = Math.min(2, window.devicePixelRatio || 1), still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var done = {}; try{ localStorage.removeItem("xfilm"); }catch(e){}   // developed frames last for one visit only: reload and the negatives are back
  var strips = [], rolls = [], dalls = [];
  function el(t, c){ var e = document.createElement(t); if(c) e.className = c; return e; }
  function saveDone(){}
  // a frame's scratch state is a small mask shared by every view of it (the strip and the viewer)
  function mkFrame(f){
    var F = {file: f.file, thumb: f.thumb || f.file, caption: f.caption || "", views: [], dev: !!done[f.file], img: new Image(), mask: document.createElement("canvas"), n: 0};
    F.mask.width = MW; F.mask.height = MH; F.mc = F.mask.getContext("2d");
    F.img.onload = function(){ F.views.forEach(render); }; F.img.src = F.thumb; return F;
  }
  function render(v){
    var F = v.F, c = v.canvas; if(F.dev || !F.img.naturalWidth) return;
    var w = v.el.clientWidth, h = v.el.clientHeight; if(!w) return;
    if(c.width !== Math.round(w*DPR)){ c.width = Math.round(w*DPR); c.height = Math.round(h*DPR); }
    var x = c.getContext("2d"), iw = F.img.naturalWidth, ih = F.img.naturalHeight, s = Math.max(c.width/iw, c.height/ih);
    x.globalCompositeOperation = "source-over"; x.clearRect(0, 0, c.width, c.height);
    x.drawImage(F.img, (c.width - iw*s)/2, (c.height - ih*s)/2, iw*s, ih*s);
    x.globalCompositeOperation = "destination-out"; x.drawImage(F.mask, 0, 0, c.width, c.height);
  }
  function stamp(F, nx, ny){
    var mx = nx*MW, my = ny*MH, r = MW*0.085, g = F.mc.createRadialGradient(mx, my, 0, mx, my, r);
    g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.6, "rgba(0,0,0,.92)"); g.addColorStop(1, "rgba(0,0,0,0)");
    F.mc.fillStyle = g; F.mc.fillRect(mx - r, my - r, 2*r, 2*r);
  }
  function coverage(F){
    var d = F.mc.getImageData(0, 0, MW, MH).data, c = 0, t = 0;
    for(var i = 3; i < d.length; i += 16){ t++; if(d[i] > 110) c++; } return c/t;
  }
  function refreshDall(){ dalls.forEach(function(d){ d.b.style.display = d.f.every(function(F){ return F.dev; }) ? "none" : ""; }); }
  function develop(F){ if(F.dev) return; F.dev = true; done[F.file] = 1; saveDone(); F.views.forEach(function(v){ v.el.classList.add("dev"); }); if(big && big.F === F) $("lbd").style.display = "none"; refreshDall(); }
  function wire(v, onclick){   // scratch with the pointer; a plain click opens the viewer
    var e = v.el, down = null, moved = false, last = null;
    function pt(ev){ var r = e.getBoundingClientRect(); return [(ev.clientX - r.left)/r.width, (ev.clientY - r.top)/r.height, ev.clientX, ev.clientY]; }
    e.addEventListener("pointerdown", function(ev){ if(ev.button !== 0) return; down = pt(ev); last = down; moved = false; e.setPointerCapture(ev.pointerId); });
    e.addEventListener("pointermove", function(ev){
      if(!down || v.F.dev) return; var p = pt(ev);
      if(!moved && Math.hypot(p[2] - down[2], p[3] - down[3]) < 5) return;
      if(!moved){ moved = true; var h = $("fhint"); if(h) h.classList.add("gone"); stamp(v.F, down[0], down[1]); }
      var steps = Math.max(1, Math.ceil(Math.hypot(p[0] - last[0], p[1] - last[1])*MW/6));
      for(var i = 1; i <= steps; i++) stamp(v.F, last[0] + (p[0] - last[0])*i/steps, last[1] + (p[1] - last[1])*i/steps);
      last = p; v.F.views.forEach(render); if(++v.F.n % 6 === 0 && coverage(v.F) > 0.6) develop(v.F);
    });
    function up(){ if(!down) return; var was = moved; down = null; if(!was && onclick) onclick(); else if(was && !v.F.dev && coverage(v.F) > 0.6) develop(v.F); }
    e.addEventListener("pointerup", up); e.addEventListener("pointercancel", function(){ down = null; });
    e.addEventListener("keydown", function(ev){ if((ev.key === "Enter" || ev.key === " ") && onclick){ ev.preventDefault(); onclick(); } });
  }
  function view(F, cls, big){
    var e = el("div", "fr" + (cls ? " " + cls : "")), im = el("img"), c = el("canvas"), v = {F: F, el: e, canvas: c};
    im.alt = ""; im.draggable = false; im.decoding = "async"; im.src = F.thumb; if(big){ var hi = new Image(); hi.onload = function(){ im.src = F.file; }; hi.src = F.file; } else im.loading = "lazy"; e.appendChild(im); e.appendChild(c); if(F.dev) e.classList.add("dev");
    F.views.push(v); if("ResizeObserver" in window) new ResizeObserver(function(){ render(v); }).observe(e); return v;
  }
  // ---- rolls and strips ----
  function build(d){
    (d.rolls || []).forEach(function(r, ri){
      var frames = (r.frames || []).map(mkFrame), box = el("section", "roll"), t = el("div", "rt"); rolls.push(frames);
      t.innerHTML = "<b></b><span></span>"; t.firstChild.textContent = r.title || ("Плёнка " + (ri + 1)); t.lastChild.textContent = [r.stock, r.camera, r.year].filter(Boolean).join("  ·  ");
      var db = el("button", "dall"); db.type = "button"; db.textContent = "проявить всё"; db.setAttribute("aria-label", "Проявить все кадры: " + (r.title || "эта плёнка"));
      db.onclick = function(){ frames.forEach(function(F, i){ setTimeout(function(){ develop(F); }, i*110); }); };   // one after another
      t.appendChild(db); dalls.push({b: db, f: frames}); box.appendChild(t);
      var k = 0, s = 0;
      while(k < frames.length){
        var strip = el("div", "fs"), et = el("div", "et"), slots = PER, lead = (s === 0);
        strip.style.setProperty("--rot", ((s % 2 ? 1 : -1)*(0.25 + ((ri*3 + s*7) % 6)/10)).toFixed(2) + "deg"); strip.style.marginLeft = ((s*37 + ri*11) % 28 - 14) + "px";
        et.textContent = Array(14).join((r.stock || "ПЛЁНКА · 160").toUpperCase() + "      "); strip.appendChild(et);
        if(lead){ strip.appendChild(el("div", "fr ld")); slots--; }
        for(var i = 0; i < slots; i++){
          if(k < frames.length){
            (function(idx){ var v = view(frames[idx]); v.el.tabIndex = 0; v.el.setAttribute("role", "button"); v.el.setAttribute("aria-label", "Открыть кадр " + (idx + 1) + " из " + (r.title || "эта плёнка"));
              var n = el("span", "fn"); n.textContent = "→ " + (idx + 1) + "А"; v.el.appendChild(n); n.style.cssText = "position:absolute;top:calc(100% + 4px)"; v.el.style.overflow = "visible";
              wire(v, function(){ open(ri, idx, v.el); }); strip.appendChild(v.el); })(k); k++;
          } else { strip.appendChild(el("div", "fr em")); }
        }
        box.appendChild(strip);
        strips.push(strip); s++;
      }
      host.appendChild(box);
    });
    spool(); refreshDall();
  }
  // ---- unspooling: each strip rolls out from the left as it scrolls into view ----
  var ticking = false;
  function spool(){
    ticking = false; var vh = window.innerHeight;
    strips.forEach(function(s){
      var r = still ? 1 : Math.max(0, Math.min(1, (vh*0.96 - s.getBoundingClientRect().top)/(vh*0.42))), e = r*r*(3 - 2*r);
      s.style.clipPath = e >= 1 ? "none" : "inset(0 " + ((1 - e)*100).toFixed(1) + "% 0 0)"; s.style.setProperty("--tx", (-(1 - e)*70).toFixed(1) + "px");
    });
  }
  function tick(){ if(!ticking){ ticking = true; requestAnimationFrame(spool); } }
  window.addEventListener("scroll", tick, {passive: true}); window.addEventListener("resize", tick);
  // ---- the viewer: every frame of the roll, still scratchable ----
  var lb = $("lb"), lbf = $("lbf"), cur = {r: 0, i: 0}, big = null;
  function jump(rc, target){   // transform that makes the viewer's frame sit exactly over rc
    var s = rc.width/target.width, dx = rc.left + rc.width/2 - (target.left + target.width/2), dy = rc.top + rc.height/2 - (target.top + target.height/2);
    return "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + s.toFixed(4) + ")";
  }
  function open(r, i, src){   // the viewer grows out of the frame that was clicked
    cur.r = r; cur.i = i; lb.hidden = false; show();
    if(src && !still && lbf.animate){
      lbf.animate([{transform: jump(src.getBoundingClientRect(), big.el.getBoundingClientRect())}, {transform: "none"}], {duration: 560, easing: "cubic-bezier(.2,.8,.2,1)"});
      lb.animate([{opacity: 0}, {opacity: 1}], {duration: 320});
    }
    $("lbx").focus({preventScroll: true});
  }
  function show(){
    var fr = rolls[cur.r], F = fr[cur.i];
    if(big){ var k = big.F.views.indexOf(big); if(k > -1) big.F.views.splice(k, 1); }
    lbf.textContent = ""; big = view(F, "", true); big.el.style.cursor = "crosshair"; wire(big, null); lbf.appendChild(big.el);
    $("lbc").textContent = (cur.i + 1) + " / " + fr.length; $("lbk").textContent = F.caption; $("lbd").style.display = F.dev ? "none" : "";
    $("lbp").disabled = cur.i === 0; $("lbn").disabled = cur.i === fr.length - 1; requestAnimationFrame(function(){ render(big); });
  }
  var closing = false;
  function close(){   // ...and shrinks back into its frame in the strip
    if(lb.hidden || closing) return;
    var home = rolls[cur.r][cur.i].views[0], rc = home && home.el.getBoundingClientRect();
    if(still || !lbf.animate || !rc || rc.bottom < 0 || rc.top > window.innerHeight){ lb.hidden = true; return; }
    closing = true;
    var a = lbf.animate([{transform: "none"}, {transform: jump(rc, big.el.getBoundingClientRect())}], {duration: 420, easing: "cubic-bezier(.5,0,.75,.4)", fill: "forwards"});
    lb.animate([{opacity: 1}, {opacity: 0}], {duration: 420, fill: "forwards"});
    a.onfinish = function(){ lb.hidden = true; closing = false; lb.getAnimations().forEach(function(x){ x.cancel(); }); lbf.getAnimations().forEach(function(x){ x.cancel(); }); };
  }
  $("lbp").onclick = function(){ if(cur.i > 0){ cur.i--; show(); } }; $("lbn").onclick = function(){ if(cur.i < rolls[cur.r].length - 1){ cur.i++; show(); } };
  $("lbx").onclick = close; $("lbd").onclick = function(){ develop(rolls[cur.r][cur.i]); $("lbd").style.display = "none"; };
  lb.addEventListener("click", function(e){ if(e.target === lb) close(); });
  document.addEventListener("keydown", function(e){
    if(lb.hidden) return; if(e.key === "Escape") close(); else if(e.key === "ArrowLeft") $("lbp").click(); else if(e.key === "ArrowRight") $("lbn").click();
  });
  setInterval(function(){ if(!lb.hidden && big && big.F.dev) $("lbd").style.display = "none"; }, 400);
  if(window.XFILM) build(window.XFILM); else fetch("film.json", {cache: "no-cache"}).then(function(r){ return r.json(); }).then(build).catch(function(){ build({rolls: []}); });
})();
// ---- Contents tab: lists every section that exists on the page, jumps there, and marks where you are ----
(function(){
  // add a section here (id on its <section>) and it appears in the menu automatically
  var LIST = [["top", "Знакомство"], ["repository", "Мои проекты"], ["exhibition", "Выставка"], ["film", "Фотоплёнка"], ["shelf", "Книжная полка"], ["max", "ЛОВИ МОМЕНТ"]];
  var box = document.getElementById("toc"), btn = document.getElementById("tocb"), panel = document.getElementById("tocp"), items = [];
  LIST.forEach(function(s){
    var el = document.getElementById(s[0]); if(!el || el.hidden) return;
    var a = document.createElement("a"); a.href = "#" + s[0]; a.innerHTML = "<span>" + String(items.length + 1).padStart(2, "0") + "</span>"; a.appendChild(document.createTextNode(s[1]));
    a.addEventListener("click", function(e){ e.preventDefault(); close(); el.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"}); try{ history.replaceState(null, "", s[0] === "top" ? location.pathname : "#" + s[0]); }catch(x){} });
    panel.appendChild(a); items.push({el: el, a: a});
  });
  function open(){ box.classList.add("on"); btn.setAttribute("aria-expanded", "true"); }
  function close(){ box.classList.remove("on"); btn.setAttribute("aria-expanded", "false"); }
  var canHover = window.matchMedia("(hover: hover)").matches, tm = 0;
  box.addEventListener("pointerenter", function(e){ if(canHover && e.pointerType === "mouse"){ clearTimeout(tm); open(); } });   // drops down as soon as the pointer is on it
  box.addEventListener("pointerleave", function(e){ if(canHover && e.pointerType === "mouse"){ clearTimeout(tm); tm = setTimeout(close, 240); } });
  box.addEventListener("focusout", function(e){ if(!box.contains(e.relatedTarget)) close(); });
  btn.addEventListener("click", function(){ if(canHover) open(); else box.classList.contains("on") ? close() : open(); });   // touch screens: tap to open and close
  document.addEventListener("click", function(e){ if(!box.contains(e.target)) close(); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape" && box.classList.contains("on")){ close(); btn.focus(); } });
  var ticking = false;
  function spy(){   // the section whose top has passed the upper part of the screen is the one you are in
    ticking = false; var line = window.innerHeight*0.4, cur = items[0];
    items.forEach(function(it){ if(it.el.getBoundingClientRect().top <= line) cur = it; });
    items.forEach(function(it){ it.a.setAttribute("aria-current", it === cur ? "true" : "false"); });
  }
  window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(spy); } }, {passive: true}); window.addEventListener("resize", spy);
  spy();
})();
// ---- corner buttons soften while you are away from the top of the page ----
(function(){
  var root = document.documentElement, t = false;
  function f(){ t = false; root.classList.toggle("away", (window.pageYOffset || root.scrollTop) > 60); }
  window.addEventListener("scroll", function(){ if(!t){ t = true; requestAnimationFrame(f); } }, {passive: true}); f();
})();
// ---- The Consumption Shelf: spines on one long shelf, pull one out, read it as a flipbook (issues come from shelf.json) ----
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var host = $("shv"), row = $("shr"), ov = $("shov"), fbs = $("fbs"), fbw = $("fbw"), still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var issues = [], busy = false, cur = null, moved = false, dn = null;
  function el(t, c){ var e = document.createElement(t); if(c) e.className = c; return e; }
  function lum(hex){ var n = parseInt((hex || "#cccccc").slice(1), 16); return (0.299*(n >> 16) + 0.587*((n >> 8) & 255) + 0.114*(n & 255))/255; }
  function ink(hex){ return lum(hex) > 0.58 ? "#1c1a17" : "#f6f1e7"; }
  // one page of an issue: a real image when there is one, otherwise a drawn placeholder (idx 0 is the cover)
  function page(it, idx, w){
    if(idx === "blank"){ var bl = el("div", "pg"); bl.style.background = "#f4efe6"; return bl; }
    var src = idx === 0 ? (it.cover || "") : idx === "back" ? (it.back || "") : (typeof idx === "number" && it.pages && it.pages[idx - 1]) || "", p = el("div", "pg");
    if(src){ var im = el("img"); p.style.background = it.color || "#f4efe6"; im.style.opacity = "0"; im.style.transition = "opacity .35s"; im.onload = function(){ im.style.opacity = "1"; }; im.decoding = "async"; im.alt = idx === 0 ? it.month + " " + it.year + " обложка" : idx === "back" ? "Задняя обложка" : "Страница " + idx; im.draggable = false; im.src = src; p.appendChild(im); if(im.complete && im.naturalWidth) im.style.opacity = "1"; return p; }
    p.className = "pg ph"; p.style.background = it.color || "#cdbfa8"; p.style.color = ink(it.color); p.style.fontSize = (w*0.12) + "px";
    p.innerHTML = "<small></small><b></b><i>страница</i>"; p.firstChild.textContent = it.month + " " + it.year + (idx ? "" : " · " + it.title); p.children[1].textContent = idx === 0 ? it.title : idx === "back" ? "Задняя обложка" : "Страница " + idx;
    return p;
  }
  function count(it){ return (it.pages && it.pages.length) || it.n || 8; }
  // a book as a little 3D object: the spine faces out, the cover hangs off its right edge
  function book(it, i, W, H){
    var b = el("div", "bk"), sp = el("div", "sp"), cv = el("div", "cv"), D = Math.round(H*0.8), fam = ["'Lastik',Georgia,serif", "'Bodoni 72 OS',Georgia,serif", "'Helvetica Neue',Arial,sans-serif"][i % 3];
    b.style.width = W + "px"; b.style.height = H + "px"; if(!it.spine){ sp.style.background = it.color || "#cdbfa8"; sp.style.color = ink(it.color); }
    if(it.spine){ sp.style.background = "url(\"" + it.spine + "\") center/100% 100% no-repeat"; }
    else { sp.innerHTML = "<span class='sy'></span><span class='st'></span><span class='sb'>эркинов</span>"; sp.children[0].textContent = it.month + " " + it.year; sp.children[1].textContent = it.title; sp.children[1].style.fontFamily = fam; if(i % 3 === 1) sp.children[1].style.fontStyle = "italic"; }
    cv.style.width = D + "px"; cv.appendChild(page(it.coverSm ? Object.assign({}, it, {cover: it.coverSm}) : it, 0, D)); b.appendChild(sp); b.appendChild(cv); return b;
  }
  function build(d){
    issues = d.issues || [];
    var wait = issues.map(function(it){ return new Promise(function(res){ if(!it.spine || it.sw){ res(); return; } var im = new Image(); im.onload = function(){ it.sw = im.naturalWidth; it.sh = im.naturalHeight; res(); }; im.onerror = function(){ it.spine = ""; res(); }; im.src = it.spine; }); });
    Promise.all(wait).then(function(){ draw(); });
  }
  function draw(){
    issues.forEach(function(it, i){
      var H = 330 + ((i*53) % 90), W = it.spine && it.sw ? Math.round(H*it.sw/it.sh) : 54 + ((i*37) % 30), b = book(it, i, W, H);
      b.setAttribute("role", "button"); b.tabIndex = 0; b.setAttribute("aria-label", "Открыть " + it.month + " " + it.year + ", " + it.title);
      b.addEventListener("click", function(){ if(!moved) open(i, b); });
      b.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); open(i, b); } });
      function prefetch(){ if(it._pf) return; it._pf = 1; [it.cover, it.back].concat(it.pages || []).forEach(function(u){ if(u){ var i = new Image(); i.decoding = "async"; i.src = u; } }); }
      b.addEventListener("pointerenter", function(){ var h = $("shhint"); if(h) h.classList.add("gone"); prefetch(); }); b.addEventListener("focus", prefetch);
      it._el = b; row.appendChild(b);
    });
  }
  // ---- drag the shelf sideways (touch and trackpad scroll natively) ----
  host.addEventListener("pointerdown", function(e){ if(e.button !== 0 || e.pointerType !== "mouse") return; dn = {x: e.clientX, s: host.scrollLeft}; moved = false; });
  window.addEventListener("pointermove", function(e){
    if(!dn) return; var dx = e.clientX - dn.x;
    if(!moved && Math.abs(dx) > 5){ moved = true; host.classList.add("gr"); var h = $("shhint"); if(h) h.classList.add("gone"); }
    if(moved) host.scrollLeft = dn.s - dx;
  });
  function release(){ if(!dn) return; dn = null; host.classList.remove("gr"); setTimeout(function(){ moved = false; }, 0); }
  window.addEventListener("pointerup", release); window.addEventListener("pointercancel", release);
  host.addEventListener("keydown", function(e){ if(e.target !== host) return; if(e.key === "ArrowRight") host.scrollBy({left: 240, behavior: "smooth"}); else if(e.key === "ArrowLeft") host.scrollBy({left: -240, behavior: "smooth"}); });
  // ---- take an issue out of the shelf, and read it ----
  var fx = null, geo = null, k = 0, L = 0, leaves = [], P = 0, pw = 0, ph = 0;
  function pose(g, t){ return "translate(" + t[0].toFixed(1) + "px," + t[1].toFixed(1) + "px) perspective(1700px) scale(" + t[2].toFixed(3) + ") rotateY(" + t[3] + "deg)"; }
  function open(i, b){
    if(busy) return; busy = true; cur = issues[i];
    var rr = row.getBoundingClientRect(), W = b.offsetWidth, H = b.offsetHeight, Lf = rr.left + b.offsetLeft, Tp = rr.top + b.offsetTop;
    ph = Math.min(window.innerHeight*0.72, window.innerWidth*0.56); pw = ph*0.8;
    var s = ph/H, tx = window.innerWidth/2 - pw/2 - Lf - W, ty = window.innerHeight/2 - (Tp + H/2);
    geo = {b: b, W: W, H: H, L: Lf, T: Tp, s: s, tx: tx, ty: ty};
    ov.hidden = false; requestAnimationFrame(function(){ ov.classList.add("on"); });
    fx = book(cur, i, W, H); fx.classList.add("fx"); fx.style.cssText += ";left:" + Lf + "px;top:" + Tp + "px;transform-origin:" + W + "px 50%;transform:none"; fx.style.transition = "none"; fx.style.pointerEvents = "none"; ov.appendChild(fx); b.style.visibility = "hidden";
    var from = [0, 0, 1, 0], mid = [tx*0.3, ty*0.3 - 30, 1 + (s - 1)*0.35, -28], to = [tx, ty, s, -90];
    if(still || !fx.animate){ fx.style.transform = pose(geo, to); read(); return; }
    var a = fx.animate([{transform: pose(geo, from)}, {transform: pose(geo, mid), offset: 0.4}, {transform: pose(geo, to)}], {duration: 560, easing: "cubic-bezier(.3,.7,.25,1)", fill: "forwards"});
    a.onfinish = read;
  }
  function read(){   // the flipbook takes over from the moving book, starting on the cover
    var n = count(cur), pages = [0]; for(var j = 1; j <= n; j++) pages.push(j); if(cur.back){ if(pages.length % 2 === 0) pages.push("blank"); pages.push("back"); }   /* the back cover always lands on the last face */ P = pages.length; L = Math.ceil(P/2); k = 0; leaves = []; fbw.textContent = "";
    for(var q = 0; q < L; q++){
      var lf = el("div", "lf"), f = el("div", "lf-f"), bk = el("div", "lf-b");
      lf.style.cssText = "width:" + pw + "px;height:" + ph + "px;top:" + (-ph/2) + "px"; f.appendChild(page(cur, pages[2*q], pw));
      bk.appendChild(2*q + 1 < P ? page(cur, pages[2*q + 1], pw) : endPage()); lf.appendChild(f); lf.appendChild(bk);
      (function(node){ node.addEventListener("click", function(){ if(node.classList.contains("fl")) prev(); else next(); }); })(lf);   // left page goes back, right page goes on
      fbw.appendChild(lf); leaves.push(lf);
    }
    fbw.style.transition = "none"; settle(); fbw.offsetWidth; fbw.style.transition = ""; fbs.classList.add("on");
    if(fx) fx.style.opacity = "0"; busy = false;
  }
  function endPage(){ var p = el("div", "pg ph"); p.style.background = cur.color || "#cdbfa8"; p.style.color = ink(cur.color); p.style.fontSize = (pw*0.12) + "px"; p.innerHTML = "<small>эркинов</small><b>конец</b>"; return p; }
  function settle(){   // stacking order + where the book sits (cover alone is centred, back cover alone is centred)
    leaves.forEach(function(lf, i){ lf.style.zIndex = i < k ? i : L - i; });
    fbw.style.transform = "translateX(" + (k === 0 ? -pw/2 : k === L ? pw/2 : 0) + "px)";
    var a = Math.min(2*k - 1, P - 1), z = Math.min(2*k, P - 1);
    $("shn").textContent = cur.title + " · " + (k === 0 ? "обложка" : k === L ? "конец" : "страницы " + a + (z > a ? "–" + z : "") + " из " + (P - 1));
    $("shp").disabled = k === 0; $("shnx").disabled = k === L;
  }
  function next(){ if(k >= L) return; var lf = leaves[k]; lf.style.zIndex = 99; lf.classList.add("fl"); k++; setTimeout(function(){ settle(); }, 300); }
  function prev(){ if(k <= 0) return; k--; var lf = leaves[k]; lf.style.zIndex = 99; lf.classList.remove("fl"); setTimeout(function(){ settle(); }, 300); }
  function close(){
    if(!cur || busy) return; busy = true; fbs.classList.remove("on");
    var g = geo, a;
    if(fx) fx.style.opacity = "1";
    setTimeout(function(){
      ov.classList.remove("on");
      var done = function(){ if(fx){ fx.remove(); fx = null; } g.b.style.visibility = ""; ov.hidden = true; cur = null; busy = false; };
      if(still || !fx || !fx.animate){ done(); return; }
      a = fx.animate([{transform: pose(g, [g.tx, g.ty, g.s, -90])}, {transform: pose(g, [g.tx*0.3, g.ty*0.3 - 30, 1 + (g.s - 1)*0.35, -28]), offset: 0.6}, {transform: pose(g, [0, 0, 1, 0])}], {duration: 430, easing: "cubic-bezier(.4,.1,.3,1)", fill: "forwards"});
      a.onfinish = done;
    }, 120);
  }
  ov.addEventListener("wheel", function(e){ e.preventDefault(); }, {passive: false});
  $("shnx").onclick = next; $("shp").onclick = prev; $("shx").onclick = close;
  ov.addEventListener("click", function(e){ if(e.target === ov || e.target === fbs) close(); });
  document.addEventListener("keydown", function(e){ if(ov.hidden) return; if(e.key === "Escape") close(); else if(e.key === "ArrowRight") next(); else if(e.key === "ArrowLeft") prev(); });
  if(window.XSHELF) build(window.XSHELF); else fetch("shelf.json", {cache: "no-cache"}).then(function(r){ return r.json(); }).then(build).catch(function(){ build({issues: []}); });
})();

// ---- Contact: drops down on hover (tap on touch screens), with the email to copy or write to ----
(function(){
  var EMAIL = "https://t.me/Chebuzavrrrrr";
  var box = document.getElementById("ct"), btn = document.getElementById("ctb"), m = document.getElementById("ctm"), w = document.getElementById("ctw"), c = document.getElementById("ctc");
  m.textContent = "@Chebuzavrrrrr"; m.href = EMAIL; w.href = EMAIL; w.textContent = "написать";
  function open(){ box.classList.add("on"); btn.setAttribute("aria-expanded", "true"); }
  function close(){ box.classList.remove("on"); btn.setAttribute("aria-expanded", "false"); }
  var canHover = window.matchMedia("(hover: hover)").matches, tm = 0;
  box.addEventListener("pointerenter", function(e){ if(canHover && e.pointerType === "mouse"){ clearTimeout(tm); open(); } });
  box.addEventListener("pointerleave", function(e){ if(canHover && e.pointerType === "mouse"){ clearTimeout(tm); tm = setTimeout(close, 240); } });
  box.addEventListener("focusout", function(e){ if(!box.contains(e.relatedTarget)) close(); });
  btn.addEventListener("click", function(){ if(canHover) open(); else box.classList.contains("on") ? close() : open(); });
  document.addEventListener("click", function(e){ if(!box.contains(e.target)) close(); });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape" && box.classList.contains("on")){ close(); btn.focus(); } });
  c.addEventListener("click", function(){
    var done = function(){ c.textContent = "скопировано"; setTimeout(function(){ c.textContent = "скопировать"; }, 1600); };
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(done, function(){ c.textContent = "попробуй ещё раз"; }); else done();
  });
})();
// ---- Max the Moment: Type Garden's roses, stems and leaves grow out of the sticker's letters as the pointer moves over them ----
(function(){
  var SRC = window.XSTICKER || "assets/lovi-moment-sticker.png";
  // name, background, flower, stem & leaf, flower line, type  (same ten as Type Garden)
  var PAL = [
    ['Чёрная роза', '#000000', '#FF1400', '#3257FF', '#FFB4A8', '#FFFFFF'], ['Бумага', '#F3EEE4', '#FF3B1F', '#1C2B8F', '#FFD2C4', '#111111'],
    ['Полночь', '#0D1B4C', '#FF5A4E', '#9FB4FF', '#FFD6CF', '#FFFFFF'], ['Цитрус', '#0E1A12', '#FF8A00', '#1FA463', '#FFE2B8', '#FFF6E8'],
    ['Орхидея', '#140A1F', '#E63CFF', '#2FB8A6', '#F9D1FF', '#FFFFFF'], ['Мох', '#133A2A', '#FFB7C5', '#7FD18B', '#FFFFFF', '#F6F1E7'],
    ['Томат', '#FF1400', '#FFF1E0', '#0B0B0B', '#FF1400', '#000000'], ['Сливочный', '#FFE9A8', '#E4002B', '#0F5132', '#FFC2C2', '#1A1A1A'],
    ['Румянец', '#FAD4D8', '#C8102E', '#274690', '#FFE3E6', '#1A1A1A'], ['Монохром', '#000000', '#F2F2F2', '#6E6E6E', '#000000', '#FFFFFF']
  ];
  // each letter of the sticker: [char, word, centre x, baseline y, width], measured on the 1308 x 697 artwork
  var U = 410, IW = 1308, IH = 697;   // U: the type size (in artwork pixels) the garden is scaled to
  var LET = [["Л", 0, 336, 332, 242], ["О", 0, 541, 332, 168], ["В", 0, 723, 332, 196], ["И", 0, 957, 332, 272], ["М", 1, 221, 537, 234], ["О", 1, 404, 537, 131], ["М", 1, 586, 537, 234], ["Е", 1, 780, 537, 154], ["Н", 1, 940, 537, 167], ["Т", 1, 1114, 537, 180]];
  var el = document.getElementById("mg"), sec = document.getElementById("max"), hint = document.getElementById("mgh"), pal = document.getElementById("mgp");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches, touchy = window.matchMedia("(hover: none)").matches;
  var G = {
    letters: [], uid: 1, cache: {}, pi: 1, flies: [], perch: [], fa: {}, mx: null, my: null, W: 0, H: 0, S: 100, running: false, boot: performance.now(),
    // ---------- math ----------
    h(n){ var x = Math.sin(n)*43758.5453; return x - Math.floor(x); },
    spr(t, k, w){ k = k || 7; w = w || 16; if(t <= 0) return 0; return 1 - Math.exp(-t*k)*Math.cos(t*w); },
    eo(t){ if(t <= 0) return 0; if(t >= 1) return 1; return 1 - Math.pow(1 - t, 3); },
    rng(seed){ var s = seed | 0; return function(){ s = (s + 0x6D2B79F5) | 0; var t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0)/4294967296; }; },
    bez(a, b, c, d, n){ var P = []; for(var i = 0; i <= n; i++){ var t = i/n, u = 1 - t; P.push([u*u*u*a[0] + 3*u*u*t*b[0] + 3*u*t*t*c[0] + t*t*t*d[0], u*u*u*a[1] + 3*u*u*t*b[1] + 3*u*t*t*c[1] + t*t*t*d[1]]); } return P; },
    at(P, u){ var n = P.length, i = Math.min(n - 2, Math.max(1, Math.round(u*(n - 1)))); return [P[i], Math.atan2(P[i+1][1] - P[i-1][1], P[i+1][0] - P[i-1][0])]; },
    jit(id, f, amp){ if(!amp) return [0, 0, 0]; return [(this.h(id*1.37 + f*7.13)*2 - 1)*amp, (this.h(id*2.71 + f*3.11)*2 - 1)*amp, (this.h(id*5.3 + f*1.7)*2 - 1)*0.035]; },
    path(c, p, closed){
      var n = p.length; if(n < 2) return; var m = function(a, b){ return [(a[0] + b[0])/2, (a[1] + b[1])/2]; };
      if(closed){ var s = m(p[n-1], p[0]); c.moveTo(s[0], s[1]); for(var i = 0; i < n; i++){ var q = m(p[i], p[(i+1) % n]); c.quadraticCurveTo(p[i][0], p[i][1], q[0], q[1]); } c.closePath(); }
      else { c.moveTo(p[0][0], p[0][1]); for(var j = 1; j < n - 1; j++){ var q2 = m(p[j], p[j+1]); c.quadraticCurveTo(p[j][0], p[j][1], q2[0], q2[1]); } c.lineTo(p[n-1][0], p[n-1][1]); }
    },
    backend(g){ var self = this; return {
      fill(p, col){ g.beginPath(); self.path(g, p, true); g.fillStyle = col; g.fill(); },
      stroke(p, col, w){ g.beginPath(); self.path(g, p, false); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); },
      rect(x, y, w, h, col){ g.fillStyle = col; g.fillRect(x, y, w, h); } }; },
    vine(base, dir, len, amp, waves, ph, bend, n){ n = n || 40; var P = [[base[0], base[1]]], step = len/n, x = base[0], y = base[1]; for(var i = 1; i <= n; i++){ var u = i/n, a = dir + bend*u + amp*Math.sin(u*Math.PI*waves + ph)*Math.min(1, u*3); x += Math.cos(a)*step; y += Math.sin(a)*step; P.push([x, y]); } return P; },
    curl(P, sign, rad){ var n = P.length, e = P[n-1], a = Math.atan2(e[1] - P[n-2][1], e[0] - P[n-2][0]), c = [e[0] - Math.sin(a)*sign*rad, e[1] + Math.cos(a)*sign*rad], a0 = Math.atan2(e[1] - c[1], e[0] - c[0]); for(var i = 1; i <= 14; i++){ var u = i/14, t = a0 + sign*u*Math.PI*1.6, rr = rad*(1 - 0.5*u); P.push([c[0] + Math.cos(t)*rr, c[1] + Math.sin(t)*rr]); } return P; },
    weave(r, startLayer){
      var cuts = [], nc = 1 + Math.floor(r()*3); for(var i = 0; i < nc; i++) cuts.push(0.15 + r()*0.7); cuts.sort(function(a, b){ return a - b; });
      var segs = [], u0 = 0, layer = startLayer;
      cuts.forEach(function(c){ if(c <= u0) return; segs.push({u0: u0, u1: c, layer: layer}); if(r() < 0.3){ var g = 0.02 + r()*0.03; u0 = Math.min(0.98, c + g); } else u0 = c; layer = 1 - layer; });
      segs.push({u0: u0, u1: 1, layer: layer}); return segs;
    },
    layerAt(segs, u){ for(var i = 0; i < segs.length; i++) if(u >= segs[i].u0 && u <= segs[i].u1) return segs[i].layer; return segs[segs.length - 1].layer; },
    // ---------- growth ----------
    wordParams(ws){ var r = this.rng(ws*7 + 13), dens = 1; return {roseP: 0.3 + r()*0.3, leafy: (0.6 + r()*0.8)*dens, dens: dens, lean: (r() - 0.5)*0.6, big: 0.85 + r()*0.45, curvy: 0.8 + r()*0.6, bridgeP: Math.min(0.95, (0.45 + r()*0.35)*dens), w: 0.5}; },
    grow(r, E, nid, p, o){
      var tip = o.tip || (r() < p.roseP ? 'rose' : r() < 0.45 ? 'fan' : r() < 0.6 ? 'leaf' : 'curl');
      var P = o.pts || this.vine(o.base, o.dir, o.len, (0.35 + r()*0.45)*p.curvy, 1 + r()*1.6, r()*6.28, (r() - 0.5)*1.2, 40);
      if(tip === 'curl') P = this.curl(P, r() < 0.5 ? -1 : 1, 0.05 + r()*0.05);
      var segs = this.weave(r, o.layer0 != null ? o.layer0 : (r() < 0.5 ? 0 : 1)), dur = Math.max(320, (o.len || 0.8)*620), thorns = [], nt = Math.floor(r()*2.5), i;
      for(i = 0; i < nt; i++) thorns.push({u: 0.15 + r()*0.65, s: r() < 0.5 ? -1 : 1});
      E.push({t: 'stem', id: nid(), pts: P, segs: segs, d0: o.d0, dur: dur, w: o.depth ? 0.82 : 1, thorns: thorns});
      var nl = Math.floor(r()*2.8*p.leafy), sd = r() < 0.5 ? -1 : 1;
      for(i = 0; i < nl; i++){ var u = 0.25 + r()*0.6, qa = this.at(P, u), q = qa[0], a = qa[1]; sd = -sd;
        E.push({t: 'leaf', id: nid(), x: q[0], y: q[1], a: a + sd*(0.55 + r()*0.5), L: (0.14 + r()*0.2)*(o.depth ? 0.8 : 1), bend: (r() - 0.5)*1.2, layer: this.layerAt(segs, u), d0: o.d0 + dur*u}); }
      var tt = this.at(P, 1), tp = tt[0], ta = tt[1], td = o.d0 + dur*0.8, tl = this.layerAt(segs, 1);
      if(tip === 'rose'){
        var R = (0.13 + r()*0.15)*p.big*(o.depth ? 0.75 : 1), over = tp[1] > -0.78 && tp[1] < 0.05 && Math.abs(tp[0]) < p.w*0.5, layer = over ? (r() < 0.22 ? 1 : 0) : (r() < 0.6 ? 1 : tl);
        E.push({t: 'rose', id: nid(), x: tp[0], y: tp[1], R: R, rot: (r() - 0.5)*1.0, ph1: r()*6.28, ph2: r()*6.28, turns: 1.8 + r()*1, layer: layer, d0: td});
        if(r() < 0.2){ var oo = ta + (r() < 0.5 ? 1 : -1)*1.3; E.push({t: 'rose', id: nid(), x: tp[0] + Math.cos(oo)*R*1.4, y: tp[1] + Math.sin(oo)*R*1.4, R: R*(0.6 + r()*0.3), rot: (r() - 0.5)*1.2, ph1: r()*6.28, ph2: r()*6.28, turns: 1.8 + r(), layer: layer, d0: td + 120}); }
      } else if(tip === 'fan'){
        var spread = 0.6 + r()*0.3; for(var j = 0; j < 2; j++) E.push({t: 'leaf', id: nid(), x: tp[0], y: tp[1], a: ta + (j - 0.5)*spread, L: 0.2 + r()*0.2, bend: (j - 0.5)*0.8, layer: tl, d0: td + j*60});
      } else if(tip === 'leaf'){
        E.push({t: 'leaf', id: nid(), x: tp[0], y: tp[1], a: ta + (r() - 0.5)*0.3, L: 0.16 + r()*0.16, bend: (r() - 0.5), layer: tl, d0: td});
      }
      if(!o.depth && r() < 0.3){ var u2 = 0.35 + r()*0.35, qb = this.at(P, u2); this.grow(r, E, nid, p, {base: qb[0], dir: qb[1] + (r() < 0.5 ? -1 : 1)*(0.7 + r()*0.4), len: (o.len || 0.8)*(0.35 + r()*0.2), d0: o.d0 + dur*u2, depth: 1, layer0: this.layerAt(segs, u2)}); }
      return P;
    },
    gen(l){
      var r = this.rng((l.ws ^ Math.imul(l.wi + 1, 2654435761)) + Math.floor(Math.random()*1e6)), p = this.wordParams(l.ws), E = [], k0 = 0, nid = function(){ return l.id*100 + (k0++); };
      var w = l.wS, inX = function(){ return (r() - 0.5)*w*0.7; }; p.w = w;
      var nUp = 1 + (r() < 0.45*p.dens ? 1 : 0), i;
      for(i = 0; i < nUp; i++) this.grow(r, E, nid, p, {base: [inX(), -r()*0.3], dir: -Math.PI/2 + p.lean*0.5 + (r() - 0.5)*0.7, len: 0.6 + r()*0.5, d0: 40 + i*130, tip: l.wi === 0 && i === 0 ? 'rose' : null});
      if(r() < 0.4*p.dens) this.grow(r, E, nid, p, {base: [inX(), -0.1 - r()*0.35], dir: Math.PI/2 + (r() - 0.5)*0.8, len: 0.35 + r()*0.35, d0: 160});
      if(l.prev && r() < p.bridgeP){
        var px = (l.prev.cx - l.cx)/U, a = [inX(), -0.05 - r()*0.55], b = [px + (r() - 0.5)*0.25, -0.05 - r()*0.55], bulge = (r() < 0.55 ? -1 : 1)*(0.4 + r()*0.4), dx = b[0] - a[0];
        var P = this.bez(a, [a[0] + dx*0.15, a[1] + bulge], [b[0] - dx*0.15, b[1] + bulge*0.9], b, 40);
        if(r() < 0.45) P = P.slice(0, Math.floor(P.length*(0.7 + r()*0.2)));
        this.grow(r, E, nid, p, {pts: P, len: Math.abs(dx) + Math.abs(bulge), d0: 90, tip: r() < 0.5 ? 'curl' : r() < 0.5 ? 'leaf' : 'rose'});
      }
      if(l.wi === 0) this.grow(r, E, nid, p, {base: [-w*0.3, -0.15 - r()*0.4], dir: Math.PI + (r() - 0.5)*1.2, len: 0.45 + r()*0.3, d0: 120, tip: 'curl'});
      l.els = E; l.endEls = null;
      var T = [], tr = this.rng(l.id*977 + Math.floor(Math.random()*1e6));
      this.grow(tr, T, function(){ return l.id*100 + 90 + T.length; }, p, {base: [w*0.25, -0.1 - tr()*0.45], dir: (tr() - 0.5)*1.4, len: 0.45 + tr()*0.25, d0: 0, tip: 'curl', depth: 1});
      l.tend = T.filter(function(e){ return e.t === 'stem'; }).slice(0, 1);
    },
    genEnd(l, rel){
      var r = this.rng(l.ws + l.wi*31 + Math.floor(Math.random()*1e6)), p = this.wordParams(l.ws), E = [], k0 = 50, nid = function(){ return l.id*100 + (k0++); };
      var w = l.wS, n = 1 + Math.floor(r()*2.5); p.w = w;
      for(var i = 0; i < n; i++){ var dir = -Math.PI/2 + 0.6 + (i - (n - 1)/2)*0.9 + (r() - 0.5)*0.4;
        this.grow(r, E, nid, p, {base: [(r() - 0.2)*w*0.6, -r()*0.5], dir: dir, len: 0.4 + r()*0.45, d0: rel + 40 + i*90, depth: 1, tip: i === 0 || r() < 0.5 ? 'rose' : 'fan'}); }
      l.endEls = E;
    },
    bloom(l, now){ if(l.els) return; l.birth = now; l.tb = now; this.gen(l); if(!l.nextL) this.genEnd(l, 700); },   // the last letter of a word also flowers at its end
    // ---------- drawing ----------
    strokeRange(B, P, a, b, col, w){
      var n = P.length - 1, ia = a*n, ib = b*n, lerp = function(t){ var i = Math.min(n - 1, Math.floor(t)), f = t - i; return [P[i][0] + (P[i+1][0] - P[i][0])*f, P[i][1] + (P[i+1][1] - P[i][1])*f]; };
      var pts = [lerp(ia)]; for(var i = Math.floor(ia) + 1; i < ib; i++) pts.push(P[i]); pts.push(lerp(ib)); if(pts.length >= 2) B.stroke(pts, col, w);
    },
    thorn(B, P, u, s, S){ var pa = this.at(P, u), p = pa[0], d = pa[1] + s*2.3, L = S*0.045; B.stroke([p, [p[0] + Math.cos(d)*L, p[1] + Math.sin(d)*L]], this.cc.blue, S*0.022); },
    leaf(B, bx, by, a, L, bend){
      if(L < 0.5) return;
      var ca = Math.cos(a), sa = Math.sin(a), px = -sa, py = ca;
      var ax = function(u){ var b = Math.sin(Math.PI*u)*bend*0.15*L; return [bx + ca*u*L + px*b, by + sa*u*L + py*b]; };
      var hw = function(u){ return L*0.18*Math.sin(Math.PI*Math.pow(u, 0.8)); }, N = 12, s1 = [], s2 = [];
      for(var i = 0; i <= N; i++){ var u = i/N, c = ax(u), w = hw(u); s1.push([c[0] + px*w, c[1] + py*w]); s2.push([c[0] - px*w, c[1] - py*w]); }
      var tip = ax(1), base = ax(0);
      B.fill([base].concat(s1.slice(1, N), [tip, tip], s2.slice(1, N).reverse(), [base]), this.cc.blue);
      if(L > 6){ var v = []; for(var k = 0; k <= 8; k++) v.push(ax(0.08 + 0.72*k/8)); B.stroke(v, this.cc.vein, Math.max(0.8, L*0.03)); }
    },
    rose(B, cx, cy, R, rot, e, a, tl){
      var self = this, cr = Math.cos(rot), sr = Math.sin(rot), tm = tl ? Math.hypot(tl[0], tl[1]) : 0, ux = tm ? tl[0]/tm : 0, uy = tm ? tl[1]/tm : 0, sq = -0.28*tm;
      var T = function(x, y, z){ z = z || 0; var dx = x*cr - y*sr, dy = x*sr + y*cr; if(tm){ var k = (dx*ux + dy*uy)*sq; dx += k*ux + tl[0]*R*z; dy += k*uy + tl[1]*R*z; } return [cx + dx, cy + dy]; };
      var P = [[0, -0.36, 0.56, 0.54, 0, 0, 0], [-0.5, -0.06, 0.6, 0.6, -0.35, 0, 0], [0.52, -0.06, 0.6, 0.6, 0.35, 0, 0], [-0.42, 0.3, 0.62, 0.48, 0.2, 0.12, 1], [0.47, 0.3, 0.62, 0.48, -0.2, 0.12, 1], [0.05, 0.42, 0.56, 0.38, 0, 0.14, 0]];
      var ax0 = 0, ay0 = 0.5, lw = Math.max(0.8, R*0.045), st = 85;
      P.forEach(function(q, i){
        var s = self.spr((a - i*st)/1000, 8, 14); if(s <= 0.001) return;
        var open = (1 - Math.min(1, s))*(q[0] < 0 ? 0.5 : -0.5), ang = q[4] + open, ca = Math.cos(ang), sa = Math.sin(ang);
        var pt = function(th){ var rr = 1 + 0.08*Math.sin(3*th + e.ph1 + i) + 0.04*Math.sin(5*th + e.ph2), lx = Math.cos(th)*q[2]*rr, ly = Math.sin(th)*q[3]*rr, px = q[0] + lx*ca - ly*sa, py = q[1] + lx*sa + ly*ca; return T((ax0 + (px - ax0)*s)*R, (ay0 + (py - ay0)*s)*R, q[5]); };
        var pts = []; for(var k = 0; k < 26; k++) pts.push(pt(k/26*Math.PI*2));
        B.fill(pts, self.cc.red);
        if(q[6] && R >= 12 && s > 0.4){ var arc = []; for(var m = 0; m <= 14; m++) arc.push(pt(Math.PI*(1.18 + 0.64*m/14))); self.strokeRange(B, arc, 0, Math.min(1, (s - 0.4)/0.5), self.cc.line, lw*0.8); }
      });
      var fr = this.eo((a - P.length*st - 80)/520);
      if(fr > 0 && R > 3){
        var sp = [], scl = [], turns = R < 20 ? Math.min(e.turns, 1.3) : R < 32 ? e.turns*0.8 : e.turns, i2;
        for(i2 = 0; i2 <= 70; i2++){ var u = i2/70, th = e.ph1 + u*turns*Math.PI*2, rr = R*(0.08 + 0.57*u); sp.push(T(Math.cos(th)*rr*1.05, Math.sin(th)*rr*0.72 - 0.12*R, 0.34 - 0.24*u)); }
        this.strokeRange(B, sp, 0, fr, this.cc.line, lw);
        if(R >= 14){ for(i2 = 0; i2 <= 36; i2++){ var v = i2/36; scl.push(T((-0.72 + 1.5*v)*R, 0.36*R + 0.16*R*Math.abs(Math.sin(v*Math.PI*3)), 0.18)); } this.strokeRange(B, scl, 0, fr, this.cc.line, lw); }
      }
    },
    near(x, y){ return this.mx != null ? [this.mx, this.my] : null; },
    faceTurn(e, x, y){
      var wx = 0, wy = 0, A = this.near(x, y);
      if(A){ var dx = A[0] - x, dy = A[1] - y, d = Math.hypot(dx, dy), reach = 300; if(d < reach && d > 0.001){ var w = 1 - d/reach, s = w*w*(3 - 2*w)*Math.min(1, d/40); wx = dx/d*s; wy = dy/d*s; } }
      var c = this.fa[e.id] || [0, 0]; c[0] += (wx - c[0])*0.09; c[1] += (wy - c[1])*0.09; this.fa[e.id] = c; return c;
    },
    wpt(st, l, x, y){
      if(l.birth != null && this._now != null){
        var t = (this._now - l.birth)*(st.speed || 1)/1000;
        if(t > 0 && t < 2.5){ var hh = Math.max(0, (l.y - y)/st.S), dmp = Math.exp(-t*3.2), dir = (l.id % 2 ? 1 : -1); x += st.S*0.07*hh*dmp*Math.sin(t*11)*dir; y += st.S*0.035*hh*dmp*Math.sin(t*11 + 1.2); }
      }
      if(st.face && l.lean){ var h2 = Math.min(2.5, Math.max(0, (l.y - y)/st.S)), f = h2*h2*0.5 + h2*0.5; x += l.lean[0]*st.S*0.1*f; y += l.lean[1]*st.S*0.05*f; }
      return [x, y];
    },
    drawStem(B, e, l, age, kk, st, f, amp, layer, frO){
      var S = st.S, fr = frO != null ? frO : this.eo((age - e.d0)/e.dur)*kk; if(fr <= 0) return;
      var j = this.jit(e.id, f, amp), self = this, P = e.pts.map(function(p){ return self.wpt(st, l, l.x + p[0]*S + j[0], l.y + p[1]*S + j[1]); });
      e.segs.forEach(function(sg){ if(sg.layer !== layer) return; var b = Math.min(sg.u1, fr); if(b <= sg.u0) return; self.strokeRange(B, P, sg.u0, b, st.C.blue, S*0.022*(e.w || 1)); });
      e.thorns.forEach(function(th){ if(fr > th.u && self.layerAt(e.segs, th.u) === layer) self.thorn(B, P, th.u, th.s, S); });
    },
    drawEl(B, e, l, age, kk, st, f, amp){
      var S = st.S, j = this.jit(e.id, f, amp), self = this, wx = function(x, y){ return self.wpt(st, l, l.x + x*S + j[0], l.y + y*S + j[1]); };
      if(e.t === 'leaf'){ var sc = this.spr((age - e.d0)/1000, 7, 15)*kk; if(sc <= 0) return; var p = wx(e.x, e.y); this.leaf(B, p[0], p[1], e.a + j[2], e.L*S*sc, e.bend); }
      else if(e.t === 'rose'){
        var a = age - e.d0; if(a < 0 || kk <= 0.001) return;
        var p2 = wx(e.x, e.y), tl = st.face ? this.faceTurn(e, p2[0], p2[1]) : null;
        if(st.face && a > 700) this.perch.push({id: e.id, x: p2[0], y: p2[1], R: e.R*S*kk});
        this.rose(B, p2[0], p2[1], e.R*S*kk, e.rot + j[2] + (tl ? tl[0]*0.22 : 0), e, a, tl);
      }
    },
    render(B, now, st){
      var S = st.S, L = st.letters, self = this; this.cc = st.C; this._now = now; this.perch = [];
      L.forEach(function(l){
        var tx = 0, ty = 0, A = self.near(l.x, l.y - S*0.6);
        if(A){ var dx = A[0] - l.x, dy = A[1] - (l.y - S*0.6), d = Math.hypot(dx, dy), reach = Math.max(260, S*3.2); if(d < reach && d > 1){ var w = 1 - d/reach, s = w*w*(3 - 2*w); tx = dx/d*s; ty = dy/d*s; } }
        var c = l.lean || (l.lean = [0, 0]); c[0] += (tx - c[0])*0.07; c[1] += (ty - c[1])*0.07;
      });
      var f = st.boil ? Math.floor(now/120) : 0, amp = st.boil ? Math.max(0.8, S*0.01) : 0;
      var draw = function(layer){
        L.forEach(function(l){
          if(!l.els) return;
          var age = (now - l.birth), each = function(e){ if(e.t === 'stem') self.drawStem(B, e, l, age, 1, st, f, amp, layer); else if(e.layer === layer) self.drawEl(B, e, l, age, 1, st, f, amp); };
          l.els.forEach(each); if(l.endEls) l.endEls.forEach(each);
          if(l.tend && (!l.nextL || !l.nextL.els)){ var fr = self.eo(((now - l.tb) - 150)/450); for(var i = 0; i < l.tend.length; i++) self.drawStem(B, l.tend[i], l, age, 1, st, f, amp, layer, fr); }
        });
      };
      draw(0); st.drawType(); draw(1);
    },
    // ---------- butterflies ----------
    spawnFly(cx, cy){
      if(this.flies.length >= 6){ var o = this.flies.filter(function(f){ return f.st !== 'leave'; })[0]; if(o) this.flyOff(o); }
      var taken = {}; this.flies.forEach(function(f){ if(f.st !== 'leave') taken[f.pid] = 1; });
      var best = null, bd = 1e9; this.perch.forEach(function(p){ if(taken[p.id]) return; var d = Math.hypot(p.x - cx, p.y - cy); if(d < bd){ bd = d; best = p; } });
      var left = cx < this.W/2, sz = Math.max(9, this.S*0.09);
      this.flies.push({x: left ? -40 : this.W + 40, y: cy + (Math.random() - 0.5)*this.H*0.4, vx: 0, vy: 0, st: best ? 'fly' : 'wander', pid: best ? best.id : null, hx: cx, hy: cy, t0: performance.now(), ph: Math.random()*6, sz: sz, seed: Math.random()*100, ang: 0});
    },
    flyOff(f){ f.st = 'leave'; f.pid = null; f.ex = f.x < this.W/2 ? -80 : this.W + 80; f.ey = f.y - this.H*0.3; },
    drawFlies(B, now, C){
      var dt = Math.min(48, now - (this._fl || now)); this._fl = now; var byId = {}, self = this; this.perch.forEach(function(p){ byId[p.id] = p; });
      this.flies = this.flies.filter(function(f){
        var t = (now - f.t0)/1000, tx, ty;
        if(f.st === 'sit' || f.st === 'fly'){ var p = byId[f.pid]; if(!p) self.flyOff(f); else { tx = p.x + p.R*0.05; ty = p.y - p.R*0.55; } }
        if(f.st === 'wander'){ tx = f.hx + Math.sin(t*1.3 + f.seed)*70; ty = f.hy + Math.sin(t*2.1 + f.seed)*40; if(t > 3.5) self.flyOff(f); }
        if(f.st === 'leave'){ tx = f.ex; ty = f.ey; }
        if(f.st === 'sit'){
          f.x += (tx - f.x)*0.35; f.y += (ty - f.y)*0.35; f.ang *= 0.85; f.ph += dt*0.004;
          var burst = Math.sin(now/1000*0.9 + f.seed) > 0.75; f.open = burst ? 0.2 + 0.8*Math.abs(Math.cos(now/1000*9 + f.seed)) : 0.25 + 0.15*Math.sin(f.ph);
        } else {
          var dx = tx - f.x, dy = ty - f.y, d = Math.hypot(dx, dy) || 1, sp = f.st === 'leave' ? 0.42 : Math.min(0.34, 0.06 + d*0.0016), flut = Math.sin(t*7 + f.seed)*0.12, wob = Math.cos(t*4.3 + f.seed)*0.1;
          var ax = (dx/d*sp + wob) - f.vx, ay = (dy/d*sp + flut) - f.vy; f.vx += ax*0.06*dt/16; f.vy += ay*0.06*dt/16; f.x += f.vx*dt; f.y += f.vy*dt + Math.sin(t*13 + f.seed)*0.6;
          f.ang += (Math.max(-0.5, Math.min(0.5, f.vx*1.4)) - f.ang)*0.1; f.open = Math.abs(Math.cos(t*17 + f.seed));
          if(f.st === 'fly' && d < 5){ f.st = 'sit'; f.ph = 0; }
          if(f.st === 'leave' && (f.x < -60 || f.x > self.W + 60 || f.y < -60)) return false;
        }
        self.butterfly(B, f.x, f.y, f.sz, f.ang, f.open, C); return true;
      });
    },
    butterfly(B, x, y, s, ang, o, C){
      var ca = Math.cos(ang), sa = Math.sin(ang), T = function(px, py){ return [x + (px*ca - py*sa)*s, y + (px*sa + py*ca)*s]; };
      var wing = function(cx, cy, rx, ry, a, side){ var pts = [], c = Math.cos(a), sn = Math.sin(a); for(var k = 0; k < 22; k++){ var th = k/22*Math.PI*2, r = 1 + 0.08*Math.sin(th*3), lx = Math.cos(th)*rx*r, ly = Math.sin(th)*ry*r; pts.push(T(side*(cx + lx*c - ly*sn)*(0.12 + 0.88*o), cy + lx*sn + ly*c)); } return pts; };
      [-1, 1].forEach(function(sd){ B.fill(wing(0.46, 0.28, 0.36, 0.3, 0.5, sd), C.text); B.fill(wing(0.55, -0.32, 0.55, 0.36, -0.55, sd), C.text); if(o > 0.35) B.fill(wing(0.66, -0.4, 0.13, 0.11, 0, sd), C.red); });
      var body = []; for(var k = 0; k < 18; k++){ var th = k/18*Math.PI*2; body.push(T(Math.cos(th)*0.08, Math.sin(th)*0.48)); }
      B.fill(body, C.blue); var lw = Math.max(0.8, s*0.05);
      B.stroke([T(0, -0.42), T(-0.14, -0.72), T(-0.24, -0.86)], C.blue, lw); B.stroke([T(0, -0.42), T(0.14, -0.72), T(0.24, -0.86)], C.blue, lw);
    },
    // ---------- sticker, layout, pointer, loop ----------
    colors(){ var p = PAL[this.pi]; return {bg: p[1], C: {red: p[2], blue: p[3], line: p[4], text: p[5], vein: p[1]}}; },
    tinted(){   // the sticker's ink in the palette's type colour (so it reads on every background)
      var key = this.pi; if(this.cache[key]) return this.cache[key];
      var c = document.createElement("canvas"); c.width = IW; c.height = IH; var x = c.getContext("2d"); x.drawImage(this.mask, 0, 0);
      x.globalCompositeOperation = "source-in"; x.fillStyle = PAL[this.pi][5]; x.fillRect(0, 0, IW, IH); return (this.cache[key] = c);
    },
    layout(){
      var r = el.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); if(!r.width) return;
      this.W = r.width; this.H = r.height; this.dpr = d; el.width = Math.round(r.width*d); el.height = Math.round(r.height*d);
      var Dw = Math.min(this.W*0.68, this.H*0.425*(IW/IH)), k = Dw/IW; this.k = k; this.sx = (this.W - Dw)/2; this.sy = (this.H - IH*k)/2 + this.H*0.03; this.S = U*k;
      this.letters.forEach(function(l){ l.x = G.sx + l.cx*k; l.y = G.sy + l.base*k; l.tw = l.bw*k; });
    },
    init(){
      var words = [[], [], []], ws = [Math.floor(Math.random()*1e9), Math.floor(Math.random()*1e9), Math.floor(Math.random()*1e9)];
      LET.forEach(function(q){ var w = words[q[1]], l = {ch: q[0], id: G.uid++, ws: ws[q[1]], wi: w.length, prev: w[w.length - 1] || null, cx: q[2], base: q[3], bw: q[4], wS: q[4]/U, els: null}; if(l.prev) l.prev.nextL = l; w.push(l); G.letters.push(l); });
      this.layout(); this.mkPalette(); this.setPal(this.pi, true);
      window.addEventListener("resize", function(){ G.layout(); });
      var pos = function(e){ var r = el.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      el.addEventListener("pointermove", function(e){ var p = pos(e); G.mx = p[0]; G.my = p[1]; G.probe(); });
      el.addEventListener("pointerdown", function(e){ var p = pos(e); G.mx = p[0]; G.my = p[1]; G.probe(); G.spawnFly(p[0], p[1]); });
      el.addEventListener("pointerleave", function(){ G.mx = null; });
      el.addEventListener("pointerup", function(e){ if(e.pointerType && e.pointerType !== "mouse") G.mx = null; });
      el.addEventListener("pointercancel", function(){ G.mx = null; });
      document.getElementById("mgx").addEventListener("click", function(){ G.letters.forEach(function(l){ l.els = null; l.endEls = null; l.tend = null; l.birth = null; l.lean = null; }); G.flies = []; G.perch = []; hint.classList.remove("gone"); });
      hint.textContent = touchy ? "коснись стикера · нажми, чтобы появилась бабочка" : "проведи по стикеру · нажми, чтобы появилась бабочка";
      var sticker = new Image(); sticker.onload = function(){
        var c = document.createElement("canvas"); c.width = IW; c.height = IH; var x = c.getContext("2d"); x.drawImage(sticker, 0, 0, IW, IH);
        var d = x.getImageData(0, 0, IW, IH), px = d.data;
        for(var i = 0; i < px.length; i += 4){ var lum = px[i]*0.299 + px[i+1]*0.587 + px[i+2]*0.114; px[i+3] = Math.round((255 - lum)*px[i+3]/255); px[i] = px[i+1] = px[i+2] = 255; }   // ink only, as a white stencil
        x.putImageData(d, 0, 0); G.mask = c; G.cache = {};
      }; sticker.src = SRC;
      if("IntersectionObserver" in window) new IntersectionObserver(function(es){ var on = es[0].isIntersecting; if(on && !G.running){ G.running = true; requestAnimationFrame(G.loop); } else if(!on) G.running = false; }, {threshold: 0}).observe(sec);
      else { G.running = true; requestAnimationFrame(G.loop); }
    },
    // growth starts under the pointer: any letter you move over (or near) begins to flower
    probe(){
      if(this.mx == null) return; var now = performance.now(), S = this.S, any = false;
      this.letters.forEach(function(l){
        if(l.els) return;
        if(Math.abs(G.mx - l.x) <= l.tw/2 + 0.12*S && G.my >= l.y - 0.85*S && G.my <= l.y + 0.2*S){ G.bloom(l, now); any = true; }
      });
      if(any) hint.classList.add("gone");
    },
    mkPalette(){
      PAL.forEach(function(p, i){
        var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", p[0]); b.title = p[0]; b.style.background = p[1];
        var d = document.createElement("i"); d.style.background = p[2]; b.appendChild(d);
        b.addEventListener("click", function(e){ e.stopPropagation(); G.setPal(i); }); pal.appendChild(b);
      });
    },
    setPal(i, quiet){
      this.pi = i; var c = this.colors(), bs = pal.children;
      sec.style.setProperty("--mbg", c.bg); sec.style.setProperty("--mfg", c.C.text);
      for(var k = 0; k < bs.length; k++){ var on = k === i; bs[k].style.borderColor = on ? c.C.text : (PAL[k][1] === c.bg ? "rgba(128,128,128,.55)" : "transparent"); bs[k].style.transform = on ? "scale(1.1)" : ""; bs[k].setAttribute("aria-pressed", on ? "true" : "false"); }
    },
    loop(now){ if(!G.running) return; requestAnimationFrame(G.loop); G.paint(now); },
    paint(now){
      if(!this.W) return; var g = el.getContext("2d"), c = this.colors();
      g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); g.fillStyle = c.bg; g.fillRect(0, 0, this.W, this.H);
      var B = this.backend(g), st = {letters: this.letters, S: this.S, C: c.C, boil: !still, speed: 1, face: true,
        drawType: function(){ if(G.mask){ g.drawImage(G.tinted(), G.sx, G.sy, IW*G.k, IH*G.k); } }};
      this.render(B, now, st); this.drawFlies(B, now, c.C);
    }
  };
  G.init();
})();
