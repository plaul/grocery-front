import { SERVER_API } from "../../settings.js"
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "../../utils.js"
import { handleError } from "../pageUtils.js"

let initialized = false
let deliveryId

let error1
let status1
let deliveryResponse
let deliveryIdInput
let quantityInput
let productIdInput
let productDetailsPar
let tableRows
let procuctContainer

export async function initPage(match) {
  if (!initialized) {
    document.getElementById("btn-fetch-delivery").onclick = fetchDeliveryFromUserInput
    document.getElementById("btn-fetch-product").onclick = fetchProduct
    document.getElementById("btn-add-product").onclick = addProductOrder
    document.getElementById("table-rows").onclick = deleteOrderLine
    error1 = document.getElementById("error-1")
    status1 = document.getElementById("status-1")
    deliveryResponse = document.getElementById("deliveryResponse")
    deliveryIdInput = document.getElementById("delivery-id-input")
    quantityInput = document.getElementById("quantity-input")
    productIdInput = document.getElementById("product-id-input")
    productDetailsPar = document.getElementById("product-details")
    tableRows = document.getElementById("table-rows")
    procuctContainer = document.getElementById("product-container")
  }
  deliveryIdInput.value = ""
  error1.innerText = ""
  status1.innerText = ""
  deliveryResponse.innerText = ""
  product = null
  tableRows.innerHTML = ""
  procuctContainer.style.display = "none"

  //status1.innerText = ""
  if (match?.params?.id) {
    deliveryId = match.params.id
    deliveryIdInput.value = deliveryId
    try {
      await fetchDelivery(deliveryId)
    } catch (err) {
      handleError(err, "status-1")
    } finally {

    }
  }
}

async function fetchDeliveryFromUserInput() {
  deliveryId = document.getElementById("delivery-id-input").value
  try {
    await fetchDelivery(deliveryId)
  } catch (err) {
    handleError(err, "error-1")
  }
}

async function fetchDelivery(id) {
  clearAllStatusFields()
  const delivery = await fetch(SERVER_API + "deliveries/" + id).then(handleHttpErrors)
  procuctContainer.style.display = "block"
  deliveryResponse.innerText = `ID: ${delivery.id}, ${delivery.deliveryDate}, From: ${delivery.fromWareHouse}, Destination: ${delivery.destination}`
  makeProductRows(delivery.products)
}

let product
async function fetchProduct() {
  const productName = productIdInput.value
  try {
    product = await fetch(SERVER_API + "products/name/" + productName).then(handleHttpErrors)
    productDetailsPar.innerText = JSON.stringify(product)
  } catch (err) {
    handleError(err, "error-2")
  }
}

function makeProductRows(data) {
  //Map also handles the calculation of totals, to minimize the required iterations over the data structure
  let totalWeight = 0;
  let totalPrice = 0.0
  const rows = data.map(product => {
    const totalWeightThisOrder = product.weight * product.quantity
    const totalPriceThisOrder = product.price * product.quantity
    totalWeight += totalWeightThisOrder
    totalPrice += totalPriceThisOrder
    return `
  <tr>
    <td>${product.id}</td>
    <td>${product.name}</td>
    <td>${product.quantity}</td>
    <td>${(totalWeightThisOrder / 1000).toFixed(2)} &nbsp;(${((product.weight) / 1000).toFixed(2)} pr. unit)</td>
    <td>${(totalPriceThisOrder).toFixed(2)}</td>
    <td><button id="delete-btn#${product.productOrderId}" class="btn btn-danger btn-sm">Delete order</button></td>
  </tr>
  `}).join("")
  tableRows.innerHTML = sanitizeStringWithTableRows(rows)

  document.getElementById("t-foot-weight").innerText = (totalWeight / 1000).toFixed(2)
  document.getElementById("t-foot-price").innerText = totalPrice.toFixed(2)
}

async function deleteOrderLine(evt) {
  evt.preventDefault()

  if (!evt.target.id.startsWith("delete-btn#")) {
    return
  }
  const productOrderId = evt.target.id.split("#")[1]
  const productOrders = await fetch(SERVER_API + "deliveries/product-order/" + productOrderId, { method: "DELETE" }).then(handleHttpErrors)
  makeProductRows(productOrders)
}

async function addProductOrder() {
  const quantity = quantityInput.value
  try {
    if (quantity === "" || !product) {
      throw new Error("Select a product and Quantity!")
    }
    const dto = {
      productId: product.id,
      quantity: Number(quantityInput.value),
      deliveryId
    }
    const options = makeOptions("POST", dto)

    const delivery = await fetch(SERVER_API + "deliveries/product", options).then(handleHttpErrors)
    makeProductRows(delivery.products)
    quantityInput.value = ""
    productIdInput.value = ""
    productDetailsPar.innerText = ""
    document.getElementById("error-3").innerText = ""
  } catch (err) {
    handleError(err, "error-3")
  }
}

function clearAllStatusFields() {
  document.getElementById("error-1").innerText = ""
  document.getElementById("error-2").innerText = ""
  document.getElementById("status-1").innerText = ""
}