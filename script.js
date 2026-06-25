/* =========================
   TNET SPA ENGINE
========================= */

const app = document.getElementById("app");

/* =========================
   ROUTES
========================= */

const routes = {
  home: renderHome,
  scan: renderScan,
  feed: renderFeed,
  analysis: renderAnalysis,
  profile: renderProfile
};

/* =========================
   NAVIGATION
========================= */

function navigate(page) {
  window.location.hash = page;
}

window.navigate = navigate;

/* =========================
   ROUTER
========================= */

function router() {
  const page =
    window.location.hash.replace("#", "") || "home";

  updateActiveNav(page);

  const renderPage =
    routes[page] || renderNotFound;

  renderPage();
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);

/* =========================
   ACTIVE NAV
========================= */

function updateActiveNav(page) {
  document
    .querySelectorAll(".navbar button")
    .forEach(btn => {
      btn.classList.remove("active");
    });

  const target =
    document.querySelector(
      `.navbar button[onclick="navigate('${page}')"]`
    );

  if (target) {
    target.classList.add("active");
  }
}

/* =========================
   HOME PAGE
========================= */

function renderHome() {
  app.innerHTML = `
  <section class="page">

    <div class="hero-card">

      <div class="hero-icon">
        <i class="fa-solid fa-bolt"></i>
      </div>

      <h1 class="hero-title">
        Welcome to TNET
      </h1>

      <p class="hero-text">
        Scan images, analyze text and
        discover trusted content.
      </p>

    </div>

    <h2 class="section-title">
      Quick Actions
    </h2>

    <div class="quick-grid">

      <div class="quick-card" onclick="navigate('scan')">
        <i class="fa-solid fa-camera"></i>
        <span>Image Scan</span>
      </div>

      <div class="quick-card" onclick="navigate('scan')">
        <i class="fa-solid fa-font"></i>
        <span>Text Scan</span>
      </div>

      <div class="quick-card" onclick="navigate('feed')">
        <i class="fa-solid fa-rss"></i>
        <span>Feed</span>
      </div>

      <div class="quick-card" onclick="navigate('analysis')">
        <i class="fa-solid fa-chart-line"></i>
        <span>Analysis</span>
      </div>

    </div>

    <h2 class="section-title">
      Overview
    </h2>

    <div class="stats">

      <div class="stat-box">
        <div class="stat-value">0</div>
        <div class="stat-label">Images Scanned</div>
      </div>

      <div class="stat-box">
        <div class="stat-value">0</div>
        <div class="stat-label">Texts Analyzed</div>
      </div>

      <div class="stat-box">
        <div class="stat-value">0</div>
        <div class="stat-label">Feed Posts</div>
      </div>

      <div class="stat-box">
        <div class="stat-value">0</div>
        <div class="stat-label">AI Reports</div>
      </div>

    </div>

    <h2 class="section-title">
      Recent Activity
    </h2>

    <div class="card">
      <div class="card-title">
        No activity yet
      </div>

      <p>
        Your latest scans and reports
        will appear here.
      </p>
    </div>

    <h2 class="section-title">
      Trending Preview
    </h2>

    <div class="card">
      <div class="card-title">
        Feed is empty
      </div>

      <p>
        Trending content from the
        community will appear here.
      </p>
    </div>

  </section>
  `;
}

/* =========================
   SCAN PAGE
========================= */

function renderScan() {
  app.innerHTML = `
  <section class="page">

    <h1 class="page-title">
      Scan Center
    </h1>

    <p class="page-subtitle">
      Analyze images and text with AI
    </p>

    <!-- SCAN TABS -->
    <div class="scan-tabs">

      <button
        class="scan-tab active"
        onclick="switchScanTab('image')"
      >
        <i class="fa-solid fa-image"></i>
        Image
      </button>

      <button
        class="scan-tab"
        onclick="switchScanTab('text')"
      >
        <i class="fa-solid fa-font"></i>
        Text
      </button>

    </div>

    <!-- IMAGE SCAN -->
    <div id="imageScanPanel">

      <div class="upload-box">

        <i class="fa-solid fa-cloud-arrow-up"></i>

        <h3>Upload Image</h3>

        <p>
          Select an image for AI analysis
        </p>

        <input
          type="file"
          id="imageInput"
          accept="image/*"
        >

      </div>

      <div id="imagePreview"></div>

    </div>

    <!-- TEXT SCAN -->
    <div
      id="textScanPanel"
      style="display:none;"
    >

      <div class="card">

        <textarea
          id="textInput"
          placeholder="Paste text here..."
        ></textarea>

      </div>

    </div>

    <button
      class="btn btn-primary scan-btn"
      onclick="startScan()"
    >
      <i class="fa-solid fa-magnifying-glass"></i>
      Start Scan
    </button>

    <!-- RESULT CARD -->
    <div class="card result-card">

      <div class="card-title">
        Scan Result
      </div>

      <div id="scanResult">

        Waiting for scan...

      </div>

    </div>

    <!-- HISTORY -->
    <div class="card">

      <div class="card-title">
        Recent Scans
      </div>

      <div id="historyList">

        No scans yet.

      </div>

    </div>

  </section>
  `;

  initializeScanPage();
}

/* =========================
   FEED PAGE
========================= */

function renderFeed() {

  const posts = [
    {
      user: "Max",
      score: 92,
      image: "https://picsum.photos/600/400?1",
      caption: "AI analysis completed successfully.",
      likes: 24,
      comments: 6
    },
    {
      user: "TNET User",
      score: 88,
      image: "https://picsum.photos/600/400?2",
      caption: "Image verified and uploaded.",
      likes: 17,
      comments: 3
    }
  ];

  app.innerHTML = `
    <section class="page">

      <h1 class="page-title">
        Feed
      </h1>

      <p class="page-subtitle">
        Community posts and AI insights
      </p>

      <div class="feed-list">

        ${posts.map(post => `
          <div class="feed-card">

            <div class="feed-header">

              <div class="feed-user">
                <div class="avatar">
                  ${post.user.charAt(0)}
                </div>

                <div>
                  <div class="feed-name">
                    ${post.user}
                  </div>

                  <div class="feed-score">
                    ${post.score}% Authentic
                  </div>
                </div>
              </div>

            </div>

            <img
              src="${post.image}"
              class="feed-image"
            >

            <div class="feed-body">

              <p class="feed-caption">
                ${post.caption}
              </p>

              <div class="feed-actions">

                <button class="feed-btn">
                  <i class="fa-solid fa-heart"></i>
                  ${post.likes}
                </button>

                <button class="feed-btn">
                  <i class="fa-solid fa-comment"></i>
                  ${post.comments}
                </button>

                <button class="feed-btn">
                  <i class="fa-solid fa-share"></i>
                </button>

              </div>

            </div>

          </div>
        `).join("")}

      </div>

    </section>
  `;
}

/* =========================
   ANALYSIS PAGE
========================= */

function renderAnalysis() {

  const data = {
    imagesScanned: 12,
    textsScanned: 8,
    avgSafety: 87,
    avgAuthenticity: 91,
    riskLevel: "Low"
  };

  app.innerHTML = `
    <section class="page">

      <h1 class="page-title">
        Analysis Dashboard
      </h1>

      <p class="page-subtitle">
        AI performance and content insights
      </p>

      <!-- MAIN STATS -->
      <div class="analysis-grid">

        <div class="analysis-card">
          <i class="fa-solid fa-image"></i>
          <h3>${data.imagesScanned}</h3>
          <p>Images Scanned</p>
        </div>

        <div class="analysis-card">
          <i class="fa-solid fa-font"></i>
          <h3>${data.textsScanned}</h3>
          <p>Texts Scanned</p>
        </div>

        <div class="analysis-card">
          <i class="fa-solid fa-shield"></i>
          <h3>${data.avgSafety}%</h3>
          <p>Avg Safety</p>
        </div>

        <div class="analysis-card">
          <i class="fa-solid fa-bolt"></i>
          <h3>${data.avgAuthenticity}%</h3>
          <p>Authenticity</p>
        </div>

      </div>

      <!-- RISK PANEL -->
      <div class="card risk-card">

        <div class="card-title">
          Risk Level
        </div>

        <div class="risk-status ${data.riskLevel.toLowerCase()}">
          ${data.riskLevel}
        </div>

        <p>
          Based on recent scans and AI evaluation.
        </p>

      </div>

      <!-- INSIGHTS -->
      <div class="card">

        <div class="card-title">
          AI Insights
        </div>

        <ul class="insights">

          <li>Most images are safe and authentic</li>
          <li>Text toxicity levels are low</li>
          <li>Moderation system performing well</li>

        </ul>

      </div>

    </section>
  `;
}

/* =========================
   PROFILE PAGE
========================= */

function renderProfile() {

  const user = {
    name: "TNET User",
    email: "user@tnet.app",
    scans: 34,
    posts: 12,
    level: "Beginner Analyst"
  };

  app.innerHTML = `
    <section class="page">

      <h1 class="page-title">
        Profile
      </h1>

      <p class="page-subtitle">
        Account & activity overview
      </p>

      <!-- PROFILE CARD -->
      <div class="profile-card">

        <div class="avatar-large">
          ${user.name.charAt(0)}
        </div>

        <h2>${user.name}</h2>

        <p class="muted">${user.email}</p>

        <div class="badge">
          ${user.level}
        </div>

      </div>

      <!-- STATS -->
      <div class="stats">

        <div class="stat-box">
          <div class="stat-value">${user.scans}</div>
          <div class="stat-label">Total Scans</div>
        </div>

        <div class="stat-box">
          <div class="stat-value">${user.posts}</div>
          <div class="stat-label">Posts</div>
        </div>

      </div>

      <!-- ACTIONS -->
      <div class="card">

        <div class="card-title">
          Account Actions
        </div>

        <button class="btn btn-secondary full-btn">
          Edit Profile
        </button>

        <button class="btn btn-secondary full-btn">
          Scan History
        </button>

        <button class="btn btn-secondary full-btn danger">
          Logout
        </button>

      </div>

    </section>
  `;
}

/* =========================
   404
========================= */

function renderNotFound() {
  app.innerHTML = `
    <section class="page">

      <h1 class="page-title">
        404
      </h1>

      <p class="page-subtitle">
        Page not found
      </p>

    </section>
  `;
}
let activeScanType = "image";

function switchScanTab(type) {

  activeScanType = type;

  const tabs =
    document.querySelectorAll(".scan-tab");

  tabs.forEach(tab =>
    tab.classList.remove("active")
  );

  if(type === "image") {

    tabs[0].classList.add("active");

    document.getElementById(
      "imageScanPanel"
    ).style.display = "block";

    document.getElementById(
      "textScanPanel"
    ).style.display = "none";

  } else {

    tabs[1].classList.add("active");

    document.getElementById(
      "imageScanPanel"
    ).style.display = "none";

    document.getElementById(
      "textScanPanel"
    ).style.display = "block";
  }
}

window.switchScanTab = switchScanTab;

function initializeScanPage() {

  const imageInput =
    document.getElementById("imageInput");

  if(!imageInput) return;

  imageInput.addEventListener(
    "change",
    function(e){

      const file = e.target.files[0];

      if(!file) return;

      const reader = new FileReader();

      reader.onload = function(event){

        document.getElementById(
          "imagePreview"
        ).innerHTML = `
          <img
            src="${event.target.result}"
            class="preview-image"
          >
        `;
      };

      reader.readAsDataURL(file);
    }
  );
}

async function startScan() {
  const result = document.getElementById("scanResult");
  const btn = document.querySelector(".scan-btn");

  btn.disabled = true;
  result.innerHTML = "🔄 Scanning... please wait...";

  try {
    const file = document.getElementById("imageInput")?.files?.[0];

    if (activeScanType === "image") {
      if (!file) {
        result.innerHTML = "⚠️ Please select an image first";
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const res = await fetch("/api/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image: e.target.result
            })
          });

          const data = await res.json();

          // 🔥 HARD SAFE PARSER (NO FAIL UI)
          if (!data.success) {
            result.innerHTML = `
              ❌ Scan Failed<br><br>
              <pre>${JSON.stringify(data.error || data, null, 2)}</pre>
            `;
            return;
          }

          const ai = data.ai || {};

          result.innerHTML = `
            🧠 <b>Image Scan Result</b><br><br>

            Status: ${ai.status || "unknown"}<br>
            Provider: ${data.provider || "sightengine"}<br><br>

            🔍 Raw Response:<br>
            <pre>${JSON.stringify(ai, null, 2)}</pre>
          `;

        } catch (err) {
          result.innerHTML = `
            ❌ Client Error<br>
            <pre>${err.message}</pre>
          `;
        } finally {
          btn.disabled = false;
        }
      };

      reader.readAsDataURL(file);
      return;
    }

    // =========================
    // TEXT SCAN
    // =========================
    const textVal = document.getElementById("textInput")?.value;

    if (!textVal || !textVal.trim()) {
      result.innerHTML = "⚠️ Please enter text first";
      return;
    }

    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textVal })
    });

    const data = await res.json();

    result.innerHTML = `
      📝 <b>Text Scan Result</b><br><br>
      <pre>${JSON.stringify(data.ai || data, null, 2)}</pre>
    `;

  } catch (err) {
    result.innerHTML = `
      ❌ System Error<br>
      <pre>${err.message}</pre>
    `;
  } finally {
    btn.disabled = false;
  }
}

window.startScan = startScan;