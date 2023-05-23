import { SERVER_API } from "../../settings.js"
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"
import { handleError } from "../pageUtils.js";
//import { makeDeliveryTable } from "../allDeliveries/allDeliveries.js"
import { makeDeliveryTable } from "../../components/deliveryTable.js"

let initialized = false;
let deliveryIdInput
let vanIdText
let deliveryContainer

export function initVans() {
  renderVanTable()
  if (!initialized) {
    document.getElementById("table-rows").onclick = detailsForVan
    document.getElementById("btn-add-delivery").onclick = addDeliveryToVan
    deliveryIdInput = document.getElementById("delivery-id-input")
    deliveryContainer = document.getElementById("delivery-container")
    vanIdText = document.getElementById("van-id")
    initialized = true
  }
  deliveryIdInput.value = ""
  vanIdText.innerText = ""
  deliveryContainer.style.display = "none"
}

async function renderVanTable() {

  const vans = await fetch(SERVER_API + "vans").then(handleHttpErrors)
  //const table = makeDeliveryTable(vans)
  const rows = vans.map(van => `
  <tr>
  <td>${van.vanId}</td>
  <td>${van.brand}</td>
  <td>${van.model}</td>
  <td>${van.capacity}</td>
  <td><button class="btn btn-sm btn-outline-primary" id="btn-details#${van.vanId}">Details</button></td>
  </tr>
  `).join("")
  document.getElementById("table-rows").innerHTML = sanitizeStringWithTableRows(rows)
}

async function detailsForVan(evt) {
  evt.preventDefault()
  if (!evt.target.id.startsWith("btn-details#")) {
    return
  }
  const prevActive = document.getElementById("table-rows").querySelector(".table-active")
  if (prevActive) {
    prevActive.classList.remove("table-active")
  }
  document.getElementById("status-2").innerText = ""
  const tr = evt.target.closest("tr")
  tr.classList.add("table-active")
  const vanId = Number(evt.target.id.split("#")[1])
  deliveryContainer.style.display = "block"
  renderDetailsForVan(vanId)
}

async function renderDetailsForVan(vanId) {
  const van = await fetch(SERVER_API + "vans/" + vanId).then(handleHttpErrors)
  makeDeliveryTable(van.deliveryResponses, "delivery-table")
  document.getElementById("van-id").innerText = vanId
}

async function addDeliveryToVan(evt) {
  evt.preventDefault()
  try {
    document.getElementById("status-2").innerText = ""
    const vanId = vanIdText.innerText
    const deliveryId = deliveryIdInput.value
    const url = SERVER_API + `vans/${vanId}/${deliveryId}`
    const response = await fetch(url, { method: "POST" }).then(handleHttpErrors)
    renderDetailsForVan(vanId)
  } catch (err) {
    handleError(err, "status-2")
  } finally {
    deliveryIdInput.value = ""
  }

}