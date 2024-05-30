import Module from "node:module"

const require = Module.createRequire(import.meta.url)

let piniaModule

try {
    piniaModule = require("pinia")
} catch {}

export default Boolean(piniaModule)
