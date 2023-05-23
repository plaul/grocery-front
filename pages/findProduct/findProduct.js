import { handleHttpErrors,makeOptions } from "../../utils.js"
import { SERVER_API } from "../../settings.js"

//Add id to this URL to get a single user
const URL = `${SERVER_API}products`

//Store reference to commonly used nodes
let productIdInput
let productInputName
let productInputPrice
let productInputWeight

export async function initFindEditProduct(match) {
  document.getElementById("btn-fetch-product").onclick = getProductIdFromInputField
  document.getElementById("btn-submit-edited-product").onclick = submitEditedProduct
  document.getElementById("btn-delete-product").onclick = deleteProduct;
  productIdInput = document.getElementById("product-id")
  productInputName = document.getElementById("name")
  productInputPrice = document.getElementById("price")
  productInputWeight = document.getElementById("weight")


  setInfoText("");
  //Check if id is provided as a Query parameter
  if (match?.params?.id) {
    const id = match.params.id
    document.getElementById("product-id-input").value = id

    try {
      fetchProduct(id)
    } catch (err) {
      setStatusMsg("Could not find product: " + id, true)
    }
  } else {
    clearInputFields()
  }
}

/**
 * Delete the product, with the given ID
 */
async function deleteProduct() {
  try {
    const idForProductToDelete = document.getElementById("product-id").value
    if (idForProductToDelete === "") {
      setStatusMsg("No product found to delete", true)
      return
    }
    const options = makeOptions("DELETE",null,true)
    await fetch(URL + "/" + idForProductToDelete, options).then(handleHttpErrors)
    setStatusMsg("Product successfully deleted", false)
    clearInputFields()
  }
  catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    }
    else {
      setStatusMsg(err.message,true)
    }
  }
}

function getProductIdFromInputField() {
  const id = document.getElementById("product-id-input").value
  if (!id) {
    setStatusMsg("Please provide an id", true)
    return
  }
  fetchProduct(id)
}

async function fetchProduct(id) {
  setStatusMsg("", false)
  try {
    const options = makeOptions("GET",null,null)
    const product = await fetch(URL + "/id/" + id,options).then(handleHttpErrors)
    renderProduct(product)
    setInfoText("Edit values and press 'Submit changes' or delete if needed")
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    } else {
      setStatusMsg(err.message, true)
    }
  }
}

/**
 * Set's the status message, either styled as an error, or as a normal message
 * @param {String} msg The status message to display
 * @param {boolean} [isError] true, to style in red
 */
function setStatusMsg(msg, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById("status")
  statusNode.style.color = color
  statusNode.innerText = msg
}

function setInfoText(txt) {
  document.getElementById("info-text").innerText = txt
}

function renderProduct(evt) {
 // productIdInput.value = evt.id
  productInputName.value = evt.name
  productInputPrice.value = evt.price
  productInputWeight.value = evt.weight
}


async function submitEditedProduct(evt) {
  evt.preventDefault()
  try {
    const data = {}
    // data.id  = productIdInput.value
    data.name = productInputName.value
    data.price = productInputPrice.value
    data.weight = productInputWeight.value
    if (data.name === "" || data.price === "" || data.weight == "") {
      setStatusMsg(`Missing fields required for a submit`, false)
      return
    }

    const options = makeOptions("PUT",data,true)
 
    const PUT_URL = URL + "/" + productIdInput.value
    const editedProduct = await fetch(PUT_URL, options).then(handleHttpErrors)
    clearInputFields()
    setStatusMsg(`Product with id '${editedProduct.id}' was successfully edited`)
  } catch (err) {
    if (err.apiError) {
      setStatusMsg(err.apiError.message, true)
    } else {
      console.log(err.message)
    }
  }
}

function clearInputFields() {
  document.getElementById("product-id-input").value = ""
  //********************* */
  //productIdInput.value = "";
  productInputName.value = "";
  productInputPrice.value = "";
  productInputWeight.value = "";
}