import { SERVER_API } from "../../settings.js"
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"
import { handleError } from "../pageUtils.js"

export function initProducts() {
  getRows()
  document.getElementById("table-rows").onclick = navigate 
}

async function getRows() {
  try {
    const products = await fetch(SERVER_API + "products").then(handleHttpErrors)
    const rows = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>${(p.price).toFixed(2)}</td>
      <td>${p.weight}</td>
      <td><button class="btn btn-outline-dark btn-sm" id="btn-navigate-${p.id}">Details</button></td>
    </tr>
    `).join("")
    document.getElementById("table-rows").innerHTML = sanitizeStringWithTableRows(rows)
  } catch (err) {
    handleError(err, "error")
  }
}

function navigate(evt){
  const target = evt.target
  if(!target.id.includes("btn-navigate-")){
    return
  }
  const id = target.id.replace("btn-navigate-","")
  router.navigate("find-product?id="+id)

}