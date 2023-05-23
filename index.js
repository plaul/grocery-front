//import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import "./lib/navigo_EditedByLars.js"  //Will create the global Navigo object used below

import {
  loadHtml,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,
} from "./utils.js"

import { initDelivery } from "./pages/delivery/createDelivery.js"
import { initPage } from "./pages/editDelivery/addOrdersToDelivery.js"
import {initFindEditProduct} from "./pages/findProduct/findProduct.js"
import { initAllDeliveries } from "./pages/allDeliveries/allDeliveries.js"
import { initProducts } from "./pages/products/product.js"
import { initAddProduct } from "./pages/addProduct/addProduct.js"
import { initVans } from "./pages/vans/vans.js"
import {initLogin} from "./pages/login_logout/login.js"

window.addEventListener("load", async () => {
  const templateHome = await loadHtml("./pages/home/home.html")
  const templateNewDelivery = await loadHtml("./pages/delivery/createDelivery.html")
  const templateAllDeliveries = await loadHtml("./pages/allDeliveries/allDeliveries.html")
  const templateEditDelivery = await loadHtml("./pages/editDelivery/addOrdersToDelivery.html")
  const templateProducts = await loadHtml("./pages/products/products.html")
  const templateAddProduct = await loadHtml("./pages/addProduct/addProduct.html")
  const templateVans = await loadHtml("./pages/vans/vans.html")
  const templateFindProduct = await loadHtml("./pages/findProduct/findProduct.html")


  const router = new Navigo("/", { hash: true });
  window.router = router

  adjustForMissingHash()
  initLogin()
  router
    .hooks({
      before(done, match) {
        setActiveLink("topnav", match.url)
        done()
      }
    })
    .on({
      "/": () => renderTemplate(templateHome, "content"),
      "/products": () => {
        renderTemplate(templateProducts, "content")
        initProducts()
      },
      "/add-product": () => {
        renderTemplate(templateAddProduct, "content")
        initAddProduct()
      },
      "/find-product": (match) => {
        renderTemplate(templateFindProduct, "content")
        initFindEditProduct(match)
      },


      "/all-deliveries": () => {
        renderTemplate(templateAllDeliveries, "content")
        initAllDeliveries()
      },
      "/make-delivery": () => {
        renderTemplate(templateNewDelivery, "content")
        initDelivery()
      },
      "/edit-delivery": (match) => {
        renderTemplate(templateEditDelivery, "content")
        initPage(match)
      },
      "/vans": () => {
        renderTemplate(templateVans, "content")
        initVans()
      }
    }
    )
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)