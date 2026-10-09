import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { apiTag } from '@/api/tags'

// მთავარი გვერდის სექციები, რომელთა კეშიც ადმინს შეუძლია გააუქმოს
const ALLOWED = new Set(['hero', 'options', 'how', 'why', 'faq', 'meta', 'pages', 'posts', 'offices'])

// ადმინში შენახვის შემდეგ იძახება, რომ საიტზე ცვლილება 60 წამის ლოდინის გარეშე გამოჩნდეს.
// უფლებას ვამოწმებთ ბექის /me-ით (მომხმარებლის cookie-ს გადავცემთ): მხოლოდ admin/editor.
export async function POST(request) {
  const { tag } = await request.json().catch(() => ({}))
  if (!ALLOWED.has(tag)) {
    return NextResponse.json({ error: 'unknown tag' }, { status: 400 })
  }

  let me
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: { cookie: request.headers.get('cookie') || '' },
      cache: 'no-store',
    })
    if (!res.ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    me = await res.json()
  } catch {
    return NextResponse.json({ error: 'auth service unavailable' }, { status: 502 })
  }

  if (!['admin', 'editor'].includes(me?.role)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  revalidateTag(apiTag(`/${tag}`))
  return NextResponse.json({ revalidated: true })
}
