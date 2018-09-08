
const service = require('./sheets-api')

const getInfo = async () => {
  const res = await service.getSheetValues({
    range: 'INFO!A:F'
  })

  return res.data.values
}

const getStudents = async (opts) => {
  const res = await service.getSheetValues({
    range: opts.className + '!A1:ZZ1'
  })

  return res.data.values[0]
}

const saveAttendance = async (values, opts) => {
  const res = await service.appendSheetValues({
    range: opts.className + '!A2:Z',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values }
  })

  return res.data.updates
}

module.exports = {
  getInfo,
  getStudents,
  saveAttendance
}
