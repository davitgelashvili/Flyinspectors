// Next-ის fetch-კეშის ტეგი ბექის მისამართისთვის. serverApi.js ამ ტეგს ანიჭებს მოთხოვნას,
// app/adminpanel/revalidate/route.js კი ადმინში შენახვისას მას აუქმებს.
export const apiTag = (path) => `api:${path}`
