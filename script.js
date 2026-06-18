const encouragements = [
  "今天学会一个新知识点，再把它讲给别人听。",
  "先把小目标做完，再奖励自己休息一下。",
  "遇到不会的代码，慢慢拆开看就会简单很多。",
  "写网站就像搭积木，一块一块放好就能完成。"
];

const journalStorageKey = "myWebsiteStudyJournal";

const starterPosts = [
  {
    id: "starter-api",
    title: "我开始学习 API",
    content: "今天我知道了 API 就像一个可以被程序询问的窗口。以后天气数据也可以从 API 里拿到。",
    date: "2026-06-17",
    likes: 0,
    liked: false,
    comments: []
  }
];

function updateWeather(city) {
  const weather = getDemoWeather(city);
  document.querySelector("#weather-city").textContent = weather.city;
  document.querySelector("#weather-temp").textContent = weather.temperature;
  document.querySelector("#weather-status").textContent = weather.weatherText;
  document.querySelector("#weather-wind").textContent = weather.windSpeed;
  document.querySelector("#weather-tip").textContent = weather.tip;
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `post-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function getTodayText() {
  return new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

function loadJournalPosts() {
  const saved = localStorage.getItem(journalStorageKey);

  if (!saved) {
    return starterPosts;
  }

  try {
    const parsedPosts = JSON.parse(saved);
    return Array.isArray(parsedPosts) ? parsedPosts : starterPosts;
  } catch (error) {
    return starterPosts;
  }
}

function saveJournalPosts(posts) {
  localStorage.setItem(journalStorageKey, JSON.stringify(posts));
}

function createCommentElement(comment) {
  const commentElement = document.createElement("article");
  commentElement.className = "comment";

  const meta = document.createElement("div");
  meta.className = "comment-meta";

  const author = document.createElement("strong");
  author.textContent = comment.author;

  const date = document.createElement("span");
  date.textContent = comment.date;

  const text = document.createElement("p");
  text.textContent = comment.text;

  meta.append(author, date);
  commentElement.append(meta, text);
  return commentElement;
}

function createPostElement(post) {
  const article = document.createElement("article");
  article.className = "journal-post";
  article.dataset.postId = post.id;

  const meta = document.createElement("div");
  meta.className = "post-meta";

  const date = document.createElement("span");
  date.textContent = post.date;

  const commentCount = document.createElement("span");
  commentCount.textContent = `${post.comments.length} 条评论`;

  const title = document.createElement("h3");
  title.textContent = post.title;

  const content = document.createElement("p");
  content.className = "post-content";
  content.textContent = post.content;

  const actions = document.createElement("div");
  actions.className = "post-actions";

  const likeButton = document.createElement("button");
  likeButton.className = post.liked ? "button secondary like-button is-liked" : "button secondary like-button";
  likeButton.type = "button";
  likeButton.dataset.action = "like";
  likeButton.textContent = `${post.liked ? "已点赞" : "点赞"} ${post.likes}`;

  const comments = document.createElement("div");
  comments.className = "comments";
  post.comments.forEach((comment) => {
    comments.append(createCommentElement(comment));
  });

  const commentForm = document.createElement("form");
  commentForm.className = "comment-form";
  commentForm.dataset.action = "comment";

  commentForm.innerHTML = `
    <label>
      昵称
      <input name="author" type="text" maxlength="12" placeholder="访客" aria-label="评论昵称">
    </label>
    <label>
      评论
      <input name="text" type="text" maxlength="120" placeholder="写一句鼓励或想法" required aria-label="评论内容">
    </label>
    <button class="button primary" type="submit">评论</button>
  `;

  meta.append(date, commentCount);
  actions.append(likeButton);
  article.append(meta, title, content, actions, comments, commentForm);
  return article;
}

function renderJournalPosts(posts) {
  const feed = document.querySelector("#journal-feed");
  feed.textContent = "";

  if (posts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-feed";
    empty.textContent = "还没有学习日志，今天先写第一篇吧。";
    feed.append(empty);
    return;
  }

  posts.forEach((post) => {
    feed.append(createPostElement(post));
  });
}

function setupJournal() {
  const journalForm = document.querySelector("#journal-form");
  const feed = document.querySelector("#journal-feed");
  const formHint = document.querySelector("#journal-form-hint");
  let posts = loadJournalPosts();

  renderJournalPosts(posts);

  journalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(journalForm);
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();

    if (!title || !content) {
      formHint.textContent = "标题和心得都要填写。";
      return;
    }

    posts = [
      {
        id: createId(),
        title,
        content,
        date: getTodayText(),
        likes: 0,
        liked: false,
        comments: []
      },
      ...posts
    ];

    saveJournalPosts(posts);
    renderJournalPosts(posts);
    journalForm.reset();
    formHint.textContent = "发布成功，已经保存在这个浏览器里。";
  });

  feed.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action='like']");
    if (!button) {
      return;
    }

    const postElement = button.closest(".journal-post");
    const post = posts.find((item) => item.id === postElement.dataset.postId);

    if (!post) {
      return;
    }

    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    saveJournalPosts(posts);
    renderJournalPosts(posts);
  });

  feed.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-action='comment']");
    if (!form) {
      return;
    }

    event.preventDefault();
    const postElement = form.closest(".journal-post");
    const post = posts.find((item) => item.id === postElement.dataset.postId);
    const formData = new FormData(form);
    const author = String(formData.get("author") || "访客").trim() || "访客";
    const text = String(formData.get("text") || "").trim();

    if (!post || !text) {
      return;
    }

    post.comments.push({
      author,
      text,
      date: getTodayText()
    });

    saveJournalPosts(posts);
    renderJournalPosts(posts);
  });
}

function addOption(selectElement, value, isSelected = false) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  option.selected = isSelected;
  selectElement.append(option);
}

function fillProvinceOptions(provinceSelect) {
  provinceSelect.textContent = "";

  Object.keys(getCityGroups()).forEach((province) => {
    addOption(provinceSelect, province, province === "直辖市");
  });
}

function fillCityOptions(citySelect, province) {
  const cities = getCityGroups()[province] || [];
  citySelect.textContent = "";

  cities.forEach((city) => {
    addOption(citySelect, city, city === "上海");
  });

  if (!citySelect.value && cities.length > 0) {
    citySelect.value = cities[0];
  }
}

function pickEncouragement() {
  const text = document.querySelector("#encouragement");
  const current = text.textContent;
  const nextOptions = encouragements.filter((item) => item !== current);
  const next = nextOptions[Math.floor(Math.random() * nextOptions.length)];
  text.textContent = next;
}

document.addEventListener("DOMContentLoaded", () => {
  const provinceSelect = document.querySelector("#province-select");
  const citySelect = document.querySelector("#city-select");
  const encouragementButton = document.querySelector("#encouragement-button");

  fillProvinceOptions(provinceSelect);
  fillCityOptions(citySelect, provinceSelect.value);
  updateWeather(citySelect.value);
  setupJournal();

  provinceSelect.addEventListener("change", () => {
    fillCityOptions(citySelect, provinceSelect.value);
    updateWeather(citySelect.value);
  });

  citySelect.addEventListener("change", () => {
    updateWeather(citySelect.value);
  });

  encouragementButton.addEventListener("click", pickEncouragement);
});
