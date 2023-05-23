import {sanitizeStringWithTableRows} from "../utils.js"

export function makeDeliveryTable(deliveries, container) {
  const html = String.raw
  const table = html`<table class="table">
    <style>
      .sort-up   {text-decoration:none}
      .sort-down {text-decoration:none}
    </style>
  <thead id="table-header">
    <tr>
      <th id="deliveryId">Delivery Id <a class="sort-up" href="">&#9650;</a><a class="sort-down" href="#">&#9660;</a></th>
      <th id="deliveryDate">Delivery Date <a class="sort-up" href="">&#9650;</a><a class="sort-down" href="#">&#9660;</a></th>
      <th id="totalWeight">Total Weight <a class="sort-up" href="">&#9650;</a><a class="sort-down" href="#">&#9660;</a></th>
      <th id="totalPrice">Total Price <a class="sort-up" href="">&#9650;</a><a class="sort-down" href="#">&#9660;</a></th>
    </tr>
  </thead>
  <tbody id="delivery-table">
    ${deliveries.map(delivery => `
    <tr>
      <td>${delivery.deliveryId}</td>
      <td>${delivery.deliveryDate}</td>
      <td>${delivery.totalWeight}</td>
      <td>${delivery.totalPrice}</td>
    </tr>
    `).join("")}
  </tbody>
</table>`
  document.getElementById(container).innerHTML = sanitizeStringWithTableRows(table)
  document.getElementById("table-header").onclick = (evt) => sortColums(evt, deliveries, container)
}


const sortOrders = {
  id: true,
  deliveryDate: true,
  totalWeight: true,
  totalPrice: true
}

function sortColums(evt, deliveries, container) {
  evt.preventDefault()
  const tableHeader = document.getElementById("table-header")
  tableHeader.removeEventListener("click",sortColums)
  const up = evt.target.classList.contains("sort-up")
  const down = evt.target.classList.contains("sort-down")
  if (!(up || down)) {
    return  //Not a sort-arrow
  }
  const th = evt.target.closest("th")
  const id = th.id
  sortOrders[id] = up

  deliveries.sort((a, b) => {
    if (a[id] === b[id]) {
      return 0
    }
    if (sortOrders[id]) {
      return a[id] > b[id] ? -1 : 1
    } else {
      return a[id] > b[id] ? 1 : -1
    }
  })
  makeDeliveryTable(deliveries, container)
}
