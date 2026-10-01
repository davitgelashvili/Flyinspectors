import { notFound } from 'next/navigation'

// ღრმა უცნობი მისამართები (/en/a/b/c) სხვაგვარად root-ის ნაგულისხმევ 404-ზე ჩავარდებოდა,
// სადაც საიტის header/footer არ არის. აქ [lang] layout-ის შიგნით ვაჩვენებთ ჩვენს 404-ს.
export default function CatchAll() {
  notFound()
}
