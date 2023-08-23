function log(header: string, data?: object) {
  console.log(`${header}:`, data)
}

function error(header: string, data?: object): never {
  console.error(`${header}:`, data)
  throw new Error(header)
}

export { error, log }
