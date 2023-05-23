import { SERVER_API } from "../../settings.js"
import { handleHttpErrors, sanitizeStringWithTableRows } from "../../utils.js"
import {makeDeliveryTable} from "../../components/deliveryTable.js"

export async function initAllDeliveries() {
  const deliveries = await fetch(SERVER_API + "deliveries").then(handleHttpErrors)
  makeDeliveryTable(deliveries, "delivery-table")
}