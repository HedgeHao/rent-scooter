export const unixTime = () => Math.round(new Date().getTime() / 1000)
export const isTestMode = () => process.env.MODE === 'test'
export const isDeploy = () => process.env.MODE !== 'dev' && process.env.MODE !== 'test'
export const sleep = async (ms: number): Promise<void> => await new Promise((resolve) => setTimeout(resolve, ms))
