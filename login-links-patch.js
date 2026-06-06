/* login-links-patch.js
   로그인 화면 상단 band.png / cafe.png 아이콘 링크 패치
   원본 손상 최소화용
*/

(function () {
  const PATCH_ID = "loginTopIconLinksPatch";

  function byId(id) {
    return document.getElementById(id);
  }

  function normalizeUrl(url) {
    const value = String(url || "").trim();
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    return "https://" + value;
  }

  function addPatchStyle() {
    if (byId(PATCH_ID + "Style")) return;

    const style = document.createElement("style");
    style.id = PATCH_ID + "Style";
    style.textContent = `
      .login-top-icon-links-patch {
        width: min(340px, 92vw);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto 6px;
        padding: 0 4px;
      }

      .login-top-icon-links-patch a {
        width: 38px;
        height: 38px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 11px;
        overflow: hidden;
        text-decoration: none;
      }

      .login-top-icon-links-patch img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .login-link-admin-patch {
        margin-top: 8px;
        display: grid;
        gap: 6px;
      }

      .login-link-admin-patch label {
        font-size: 12px;
        font-weight: 800;
      }

      .login-link-admin-patch input {
        width: 100%;
        height: 30px;
        border: 1px solid #d4d4d4;
        border-radius: 14px;
        padding: 0 10px;
        font-size: 12px;
      }
    `;
    document.head.appendChild(style);
  }

  function getBusInfo() {
    window.state = window.state || {};
    window.state.busInfo = window.state.busInfo || {};
    return window.state.busInfo;
  }

  function renderLoginIcons() {
    const gate = byId("memberAuthGate");
    if (!gate) return;

    if (!byId("loginTopIconLinksPatch")) {
      const wrap = document.createElement("div");
      wrap.id = "loginTopIconLinksPatch";
      wrap.className = "login-top-icon-links-patch";
      wrap.innerHTML = `
        <a id="loginBandIconLinkPatch" href="#" target="_blank" rel="noopener" title="네이버 밴드">
          <img src="band.png" alt="네이버 밴드">
        </a>
        <a id="loginCafeIconLinkPatch" href="#" target="_blank" rel="noopener" title="네이버 카페">
          <img src="cafe.png" alt="네이버 카페">
        </a>
      `;

      const memoBox = byId("memberLoginMainMemoBox");
      if (memoBox && memoBox.parentNode === gate) {
        gate.insertBefore(wrap, memoBox);
      } else {
        gate.insertBefore(wrap, gate.firstChild);
      }
    }

    const busInfo = getBusInfo();
    const bandUrl = normalizeUrl(busInfo.bandLinkUrl || "");
    const cafeUrl = normalizeUrl(busInfo.cafeLinkUrl || "");

    const band = byId("loginBandIconLinkPatch");
    const cafe = byId("loginCafeIconLinkPatch");

    if (band) band.href = bandUrl || "#";
    if (cafe) cafe.href = cafeUrl || "#";
  }

  function renderAdminInputs() {
    const adminPanel = byId("adminPanel");
    if (!adminPanel || byId("loginLinkAdminPatch")) return;

    const box = document.createElement("div");
    box.id = "loginLinkAdminPatch";
    box.className = "card login-link-admin-patch";
    box.innerHTML = `
      <div>
        <label for="patchBandLinkUrl">밴드 링크주소</label>
        <input id="patchBandLinkUrl" type="text" placeholder="예: https://band.us/...">
      </div>
      <div>
        <label for="patchCafeLinkUrl">카페 링크주소</label>
        <input id="patchCafeLinkUrl" type="text" placeholder="예: https://cafe.naver.com/...">
      </div>
    `;

    adminPanel.appendChild(box);

    const busInfo = getBusInfo();
    const bandInput = byId("patchBandLinkUrl");
    const cafeInput = byId("patchCafeLinkUrl");

    if (bandInput) bandInput.value = busInfo.bandLinkUrl || "";
    if (cafeInput) cafeInput.value = busInfo.cafeLinkUrl || "";

    bandInput?.addEventListener("input", async function () {
      busInfo.bandLinkUrl = this.value;
      renderLoginIcons();

      if (window.state?.isFirebaseReady && window.state?.isAdminAuthenticated && typeof window.saveBusInfoRemote === "function") {
        await window.saveBusInfoRemote();
      }
    });

    cafeInput?.addEventListener("input", async function () {
      busInfo.cafeLinkUrl = this.value;
      renderLoginIcons();

      if (window.state?.isFirebaseReady && window.state?.isAdminAuthenticated && typeof window.saveBusInfoRemote === "function") {
        await window.saveBusInfoRemote();
      }
    });
  }

  function runPatch() {
    addPatchStyle();
    renderLoginIcons();
    renderAdminInputs();
  }

  document.addEventListener("DOMContentLoaded", runPatch);
  setTimeout(runPatch, 300);
  setTimeout(runPatch, 1000);

  window.renderLoginTopIconLinksPatch = renderLoginIcons;
})();
