// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { submitLead } from '@/lib/contact/submitLead'
import type { Lead } from '@/types/leads'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Lead

    if (!body.nombre || !body.email || !body.tipo) {
      return NextResponse.json(
        { success: false, error: 'Campos obligatorios faltantes.' },
        { status: 400 }
      )
    }

    if (body.tipo === 'empresa' && !body.nombreEmpresa) {
      return NextResponse.json(
        { success: false, error: 'El nombre de empresa es obligatorio.' },
        { status: 400 }
      )
    }

    const result = await submitLead(body)

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor.' },
      { status: 500 }
    )
  }
}
