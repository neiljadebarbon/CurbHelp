(() => {
  const screens = ["home","post","helper","complete","tasks","route","profile"];
  const navTabs = ["home","tasks","route","profile"];
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const toast = $("#toast");

  const state = {
    category: localStorage.getItem("curbhelp-category") || "Trash bins",
    posted: localStorage.getItem("curbhelp-posted") === "true",
    completed: localStorage.getItem("curbhelp-completed") === "true"
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function setScreen(name) {
    if (!screens.includes(name)) name = "home";
    $$(".screen").forEach(el => el.classList.toggle("active", el.id === `screen-${name}`));
    $$(".tab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.tab === name || (!navTabs.includes(name) && tab.dataset.tab === "tasks"));
    });
    const active = $("#screen-" + name);
    if (active) active.scrollTop = 0;
    history.replaceState(null, "", "#" + name);
  }

  function setCategory(value) {
    state.category = value;
    localStorage.setItem("curbhelp-category", value);
    const field = $("#category-value");
    if (field) field.textContent = value;
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
    const index = Math.max(0, options.indexOf(state.category));
    setCategory(options[(index + 1) % options.length]);
    showToast("Category changed");
  });

  $("#post-task-btn")?.addEventListener("click", () => {
    state.posted = true;
    localStorage.setItem("curbhelp-posted","true");
    showToast("Task posted");
    setTimeout(() => setScreen("helper"), 550);
  });

  $("#accept-task-btn")?.addEventListener("click", () => {
    showToast("Task accepted");
    setTimeout(() => setScreen("complete"), 500);
  });

  $("#complete-task-btn")?.addEventListener("click", () => {
    state.completed = true;
    localStorage.setItem("curbhelp-completed","true");
    showToast("Completion submitted");
    setTimeout(() => setScreen("tasks"), 650);
  });

  setCategory(state.category);
  const initial = location.hash.replace("#","") || "home";
  setScreen(initial);

  window.addEventListener("hashchange", () => {
    const name = location.hash.replace("#","") || "home";
    if (screens.includes(name)) setScreen(name);
  });
})();