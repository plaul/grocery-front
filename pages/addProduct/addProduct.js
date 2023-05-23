import { SERVER_API } from "../../settings.js"
import { makeOptions, handleHttpErrors } from "../../utils.js"
import { handleError, setStatusMsg } from "../pageUtils.js"

let initialized
let priceInput
let nameInput
let weightInput

export function initAddProduct() {
  if (!initialized) {
    nameInput = document.getElementById("name")
    priceInput = document.getElementById("price")
    weightInput = document.getElementById("weight")
    document.getElementById("save-product-btn").onclick = saveProduct
    initialized = true
  }
  setStatusMsg("", "status")
}

async function saveProduct(evt) {
  evt.preventDefault()
  const body = {
    name: nameInput.value,
    price: Number(priceInput.value),
    weight: Number(weightInput.value)
  }
  try {
    const product = await fetch(SERVER_API + "products", makeOptions("POST", body)).then(handleHttpErrors)
    setStatusMsg(JSON.stringify(product), "status")
    nameInput.value = ""
    priceInput.value = ""
    weightInput.value = ""
  } catch (err) {
    handleError(err, "status")
  }
}
