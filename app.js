const CATEGORIES = [
  { name: '자동화', icon: '🤖', items: [
    {name:'출퇴근 체크', url:'https://spark.example.com/clock'},
    {name:'크론 잡 관리', url:'https://spark.example.com/cron'},
    {name:'스크립트 실행', url:'https://spark.example.com/scripts'}
  ]},
  { name: '데이터', icon: '📊', items: [
    {name:'골프 데이터 수집', url:'https://spark.example.com/golf-data'},
    {name:'통화/회의 요약', url:'https://spark.example.com/stt'},
    {name:'연예 분석', url:'https://spark.example.com/backtest'}
  ]},
  { name: '생산성', icon: '📋', items: [
    {name:'일일 리뷰', url:'https://spark.example.com/review'},
    {name:'효율성 보고서', url:'https://spark.example.com/efficiency'},
    {name:'작업 메모리', url:'https://spark.example.com/memory'}
  ]},
  { name: '관리', icon: '⚙️', items: [
    {name:'Hermes 설정', url:'https://spark.example.com/settings'},
    {name:'로그 확인', url:'https://spark.example.com/logs'},
    {name:'백업/복원', url:'https://spark.example.com/backup'}
  ]}
];

let currentScreen = 'HOME';
let currentCategoryIndex = -1;

const searchInput   = document.getElementById('search-input');
const categoryGrid  = document.getElementById('category-grid');
const featureList   = document.getElementById('feature-list');
const serviceFrame  = document.getElementById('service-frame');
const backBtn       = document.getElementById('back-btn');
const titleEl       = document.getElementById('title');
const mainContent   = document.getElementById('main-content');

/* ===== 렌더링: 카테고리 그리드 ===== */

function renderCategories(filter) {
  filter = filter || '';
  currentScreen = 'HOME';
  currentCategoryIndex = -1;
  titleEl.textContent = 'Spark Hub';

  featureList.classList.add('hidden');
  serviceFrame.classList.add('hidden');
  backBtn.style.display = 'none';

  const filtered = CATEGORIES.filter(function(cat) {
    return cat.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1 ||
      cat.items.some(function(item) {
        return item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      });
  });

  categoryGrid.innerHTML = '';
  filtered.forEach(function(cat) {
    var card = document.createElement('div');
    card.className = 'category-card';
    card.setAttribute('data-idx', CATEGORIES.indexOf(cat));
    card.innerHTML = '<div class="cat-icon">' + cat.icon + '</div>' +
                     '<div class="cat-name">' + cat.name + '</div>' +
                     '<div class="cat-count">' + cat.items.length + '개</div>';
    (function(c) {
      card.addEventListener('click', function() { renderFeatureList(CATEGORIES.indexOf(c)); });
    })(cat);
    categoryGrid.appendChild(card);
  });

  if (filtered.length === 0) {
    categoryGrid.innerHTML = '<p class="no-results">검색 결과가 없습니다.</p>';
  }
}

/* ===== 렌더링: 기능 목록 ===== */

function renderFeatureList(catIdx) {
  currentScreen = 'LIST';
  currentCategoryIndex = catIdx;
  var cat = CATEGORIES[catIdx];

  titleEl.textContent = cat.icon + ' ' + cat.name;
  backBtn.style.display = '';

  mainContent.classList.add('hidden');
  serviceFrame.classList.add('hidden');
  featureList.classList.remove('hidden');

  featureList.innerHTML = '';
  cat.items.forEach(function(item) {
    var row = document.createElement('div');
    row.className = 'feature-item';
    row.innerHTML = '<span class="feature-name">' + item.name + '</span>' +
                    '<span class="feature-arrow">→</span>';
    row.addEventListener('click', function() { loadService(item.url, item.name); });
    featureList.appendChild(row);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== iframe 로드 ===== */

function loadService(url, name) {
  currentScreen = 'IFRAME';
  titleEl.textContent = name;

  featureList.classList.add('hidden');
  serviceFrame.src = url;
  serviceFrame.classList.remove('hidden');
}

/* ===== 뒤로가기 ===== */

function goBack() {
  if (currentScreen === 'IFRAME') {
    titleEl.textContent = CATEGORIES[currentCategoryIndex].icon + ' ' + CATEGORIES[currentCategoryIndex].name;
    serviceFrame.classList.add('hidden');
    featureList.classList.remove('hidden');
    currentScreen = 'LIST';
  } else if (currentScreen === 'LIST') {
    renderCategories(searchInput.value);
  }
}

/* ===== 이벤트 ===== */

searchInput.addEventListener('input', function(e) {
  renderCategories(e.target.value);
});

backBtn.addEventListener('click', goBack);

var deferredPrompt;
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
  console.log('[Spark Hub] PWA 설치 준비됨');
});

renderCategories();
console.log('[Spark Hub] 초기화 완료');
