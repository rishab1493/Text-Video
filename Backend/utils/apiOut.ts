export function success(res: any, result: any, status: any) {
  return res.status(status || 200).json({
    code: status,
    data: result,
  })
}

export function error(res: any, errMessage: any, status: any) {
  return res.status(status || 500).json({
    code: status,
    data: errMessage,
  })
}
