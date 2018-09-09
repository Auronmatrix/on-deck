
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

const getDates = async (opts) => {
  const res = await service.getSheetValues({
    range: opts.className + '!A1:A365'
  })

  return res.data.values ? res.data.values.map(dataRange => dataRange[0]) : []
}

const getDateRow = async (date, opts) => {
  const dates = await getDates(opts)
  const index = dates.indexOf(date)
  return index + 1 // Add 1 because sheet rows start at 1
}

const upsertAttendance = async (opts) => {

  if (!opts.values) {
    throw new Error('No opts.values specified to upsert')
  }

  if (typeof opts.values[0] !== 'string' || opts.values[0].length !== 10) {
    throw new Error('Invalid date specified in first column for opts.values. Instead got ' + opts.values[0])
  }

  const dateRow = await getDateRow(opts.values[0], opts)
  const dateExists = dateRow > 1

  console.log('[Upsert Attendance] Dates exists: %s, Row: %s', dateExists, dateRow)
  const range = dateExists ? `${opts.className}!A${dateRow}:Z${dateRow}` : `${opts.className}!A2:Z`

  const req = {
    range,
    valueInputOption: 'RAW',
    requestBody: { values: [opts.values] }
  }

  const res = dateExists ? await service.updateSheetValues(req) : await service.appendSheetValues(req)

  return res.data.updates
}

module.exports = {
  getInfo,
  getStudents,
  upsertAttendance,
  getDates
}
