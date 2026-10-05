(() => {
  const screens = ["home","post","helper","complete","tasks","route","profile"];
  const navTabs = ["home","tasks","route","profile"];
  const DEFAULTS = Object.freeze({
    category: "Trash bins"
  });

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const toast = $("#toast");

  let state = {
    category: DEFAULTS.category
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1500);
  }

  function setScreen(name) {
    if (!screens.includes(name)) name = "home";

    $$(".screen").forEach(screen => {
      screen.classList.toggle("active", screen.id === `screen-${name}`);
    });

    $$(".tab").forEach(tab => {
      const activeTab = navTabs.includes(name) ? name : "tasks";
      tab.classList.toggle("active", tab.dataset.tab === activeTab);
    });

    const active = $("#screen-" + name);
    if (active) active.scrollTop = 0;
  }

  function setCategory(value) {
    state.category = value;
    const field = $("#category-value");
    if (field) field.textContent = value;
  }

  function resetSimulator({notify = false} = {}) {
    state = { category: DEFAULTS.category };
    setCategory(DEFAULTS.category);
    setScreen("home");

    // The simulator intentionally stores nothing. Remove any legacy
    // prototype values that may exist from an older version.
    try {
      localStorage.removeItem("curbhelp-category");
      localStorage.removeItem("curbhelp-posted");
      localStorage.removeItem("curbhelp-completed");
      sessionStorage.clear();
    } catch (_) {}

    // Keep a clean URL so refresh always starts at the default Home screen.
    if (location.hash) {
      history.replaceState(null, "", location.pathname + location.search);
    }

    if (notify) showToast("Simulator reset");
  }

  $$("[data-go]").forEach(button => {
    button.addEventListener("click", () => setScreen(button.dataset.go));
  });

  $$("[data-tab]").forEach(button => {
    button.addEventListener("click", () => setScreen(button.dataset.tab));
  });

  $$("[data-fill]").forEach(button => {
    button.addEventListener("click", () => {
      setCategory(button.dataset.fill);
      setScreen("post");
    });
  });

  $("#category-row")?.addEventListener("click", () => {
    const options = ["Trash bins","Sweep walkway","Yard debris","Water plants","Pull weeds"];
    const current = Math.max(0, options.indexOf(state.category));
    setCategory(options[(current + 1) % options.length]);
    showToast("Demo category changed");
  });

  $("#post-task-btn")?.addEventListener("click", () => {
    showToast("Demo task posted");
    setTimeout(() => setScreen("helper"), 420);
  });

  $("#accept-task-btn")?.addEventListener("click", () => {
    showToast("Demo task accepted");
    setTimeout(() => setScreen("complete"), 420);
  });

  $("#complete-task-btn")?.addEventListener("click", () => {
    showToast("Demo completion submitted");
    setTimeout(() => setScreen("tasks"), 500);
  });

  $("#reset-demo-btn")?.addEventListener("click", () => {
    resetSimulator({notify:true});
  });

  // Every page load starts fresh. No account, cookies, local storage,
  // session storage, or backend state is used for the simulator.
  resetSimulator();
})();