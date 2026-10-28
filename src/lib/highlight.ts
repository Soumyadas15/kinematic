import { codeToHtml } from "shiki"

export async function highlight(code: string, lang = "tsx") {
  "use cache"
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
}
