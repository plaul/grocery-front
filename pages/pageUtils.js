export function handleError(err, statusField) {
  if (err.apiError) {
    console.error("Full API error: ", err.apiError)
    setStatusMsg(err.apiError.message, statusField, true)
  } else {
    const msg = (err.statusCode && err.statusCode == 401) ? " Request could not be authenticated, you might need to login again" : ""
    setStatusMsg(err.message + msg, statusField, true)
    console.error(err.message + msg)
  }
}

export function setStatusMsg(msg, statusField, isError) {
  const color = isError ? "red" : "darkgreen"
  const statusNode = document.getElementById(statusField)
  statusNode.style.color = color
  statusNode.innerText = msg
}

export function showSpinner(target, show) {
  const value = show ? "block" : "none"
  document.getElementById(target).style.display = value
}

