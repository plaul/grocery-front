import { SERVER_API } from "../../settings.js"
import { makeOptions, handleHttpErrors } from "../../utils.js"

let initialized
let warehouses = ["warehouse-1", "warehouse-2", "warehouse-3"]  //Given more time, should come from server
let options

export function initDelivery() {

  if (!initialized) {
    options = warehouses.map(warehouseName => `
    <option value="${warehouseName}">${warehouseName}</option>
  `)
    options.unshift("<option selected>Select a warehouse</option>")
    document.getElementById("from-warehouse-selector").innerHTML = DOMPurify.sanitize(options.join(""))
    initialized = true
    document.getElementById("btn-save-delivery").onclick = saveDelivery;
  }
}

async function saveDelivery(evt) {
  evt.preventDefault()

  const body = {}
  body.deliveryDate = document.getElementById("delivery-date").value
  body.fromWareHouse = document.getElementById("from-warehouse-selector").value
  body.destination = document.getElementById("destination").value

  const options = makeOptions("POST", body)
  const delivery = await fetch(SERVER_API + "deliveries", options).then(handleHttpErrors)
  document.getElementById("response").innerText = JSON.stringify(delivery)
  window.router.navigate("/edit-delivery?id=" + delivery.deliveryId)

}