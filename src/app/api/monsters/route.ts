import { NextResponse } from 'next/server'
import Papa from 'papaparse'

export async function GET(request: Request) {
  try {
    const sheetId = process.env.GOOGLE_SHEET_ID
    const gid     = process.env.GOOGLE_SHEET_GID

    if (!sheetId || !gid) {
      console.error('Missing GOOGLE_SHEET_ID or GID')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`Fetch failed with status ${res.status}`)
      return NextResponse.json({ error: 'Fetch failed', status: res.status }, { status: res.status })
    }

    const text = await res.text()
    const { data: rawData, errors } = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // 避免 header 為 null
        if (!header) return null
        const h = header.trim()
        return h === '' ? null : h
      },
    })

    if (errors.length) {
      console.error('CSV parse errors:', errors)
      return NextResponse.json({ error: 'CSV parse error', details: errors }, { status: 500 })
    }

    const cleanedData = (rawData as Record<string, any>[])
      .map(row => {
        const obj: Record<string, any> = {}
        Object.entries(row).forEach(([key, value]) => {
          // 跳過空 key 或 transformHeader 標記的 null
          if (!key || key === 'null') return
          const trimmedKey = key.trim()
          const trimmedValue = typeof value === 'string' ? value.trim() : value
          if (trimmedValue === '') return
          obj[trimmedKey] = trimmedValue
        })
        return obj
      })
      .filter(row => Object.keys(row).length > 0)

    return NextResponse.json(cleanedData)
  } catch (error) {
    console.error('Unexpected error in API route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
