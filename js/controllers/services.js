import { SERVICE_CATALOG } from "../model/service-catalog.js";

export function initServiceProductTabs() {
  const tabsWrap = document.getElementById("serviceTabs");
  const productsGrid = document.getElementById("serviceProductsGrid");
  const productsTitle = document.getElementById("serviceProductsTitle");
  const productsLead = document.getElementById("serviceProductsLead");
  if (!tabsWrap || !productsGrid || !productsTitle || !productsLead) return;

  const tabs = Array.from(tabsWrap.querySelectorAll(".service-tab"));
  if (tabs.length === 0) return;

  function renderProducts(serviceKey) {
    const selected = SERVICE_CATALOG[serviceKey];
    if (!selected) return;
    productsTitle.textContent = selected.title;
    productsLead.textContent = selected.lead;
    productsGrid.innerHTML = selected.products
      .map(
        (product) => `
        <article class="product-card">
          <div class="product-card-image" style="--product:url('${product.img}');"></div>
          <h5>${product.name}</h5>
          <p>${product.desc}</p>
        </article>
      `
      )
      .join("");
  }

  function setActiveTab(serviceKey) {
    tabs.forEach((tab) => {
      const active = tab.dataset.serviceKey === serviceKey;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    renderProducts(serviceKey);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveTab(tab.dataset.serviceKey || "supply");
    });
  });

  setActiveTab("supply");
}
