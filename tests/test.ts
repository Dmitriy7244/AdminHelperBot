type Func = (...args: any[]) => any

function b(a1: number, a2: number) {
  return [a1, a2]
}

function rpc<F extends Func>(
  func: F,
): (...args: Parameters<F>) => Promise<ReturnType<F>> {
  const _ = (...args: any[]) => {
    console.log("rpc", func.name, args)
    return func(...args)
  }
  return _ as any
}

const a = rpc(b)

const r = await a(1, 2)
console.log(r)
