
const service = require('./sheets-api')

const getInfo = async () => {
  const res = await service.getSheetValues({
    range: 'INFO!A:F'
  })

  return res.data.values
}

const getStudentsNames = async (opts) => {
  const res = await service.getSheetValues({
    range: opts.className + '!A1:ZZ1'
  })

  return res.data.values[0]
}

const getRow = async (opts) => {

  if (!opts.row) {
    throw new Error('No row in opts.row specified. Instead got ' + opts.row)
  }
  const res = await service.getSheetValues({
    range: `${opts.className}!A${opts.row}:ZZ${opts.row}`
  })

  return res.data.values[0]
}

const getStudentsData = async (opts) => {
  const names = await getStudentsNames(opts)
  const dateRow = await getRowNumberForDate(opts)
  const dateExists = exists(dateRow)

  let status = new Array(names.length)
  for (let k = 0; k < status.length; k++) {
     status[k] = 0
  }

  if (dateExists) {
     status = await getRow({...opts, row: dateRow})
     console.log('[Get Student Data For Date] %s', JSON.stringify(status))
  }

  const map = {}
  names.forEach((name, i) => {
    if (name) {
      const nameParts = name.split(' ');
      map[i] = {
        shortName: nameParts[0] + ' ' + nameParts[1][0] + '.',
        name,
        status: parseInt(status[i]),
        oldStatus: parseInt(status[i]),
        id: i
      }
    }
  })

   console.log(map)
   return map
}

const getDates = async (opts) => {
  const res = await service.getSheetValues({
    range: opts.className + '!A1:A365'
  })

  return res.data.values ? res.data.values.map(dataRange => dataRange[0]) : []
}

const getRowNumberForDate = async (opts) => {

  if (!opts.date) {
    throw new Error('Invalid opts.date specified. Instead got ' + opts.date)
  }
  const dates = await getDates(opts)
  const index = dates.indexOf(opts.date)
  return index + 1 // Add 1 because sheet rows start at 1
}

const upsertAttendance = async (opts) => {

  if (!opts.values) {
    throw new Error('No opts.values specified to upsert')
  }

  if (typeof opts.date !== 'string' || opts.date.length !== 10) {
    throw new Error('Invalid date specified in first column for opts.date. Instead got ' + opts.date)
  }

  const dateRow = await getRowNumberForDate(opts)
  const dateExists = exists(dateRow)

  console.log('[Upsert Attendance] Dates exists: %s, Row: %s', dateExists, dateRow)
  const range = dateExists ? `${opts.className}!A${dateRow}:Z${dateRow}` : `${opts.className}!A2:Z`

  const req = {
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [opts.values] }
  }

  const res = dateExists ? await service.updateSheetValues(req) : await service.appendSheetValues(req)

  return res.data
}

const exists = (index) => index > 1 // Not in title row

module.exports = {
  getInfo,
  getStudentsNames,
  getStudentsData,
  upsertAttendance,
  getDates
}
