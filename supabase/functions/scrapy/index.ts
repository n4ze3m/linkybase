import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { DOMParser, HTMLDocument } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

function getBaseUrl(url: string): string {
  const regex = /^https?:\/\/([^/?#]+)(?:[/?#]|$)/i;
  const matches = regex.exec(url);
  return matches != null ? matches[1] : "";
}



function _findTitle(doc: HTMLDocument) {
  let title = doc.querySelector("title")?.textContent
  if (!title) {
      const metaTitle = doc.querySelector("meta[property='og:title']")?.getAttribute("content") ||
          doc.querySelector("meta[name='twitter:title']")?.getAttribute("content") ||
          doc.querySelector("meta[name='title']")?.getAttribute("content")
      if (metaTitle) {
          title = metaTitle
      } else {
          const h1 = doc.querySelector("h1")
          if (h1) {
              title = h1.textContent
          } else {
              const h2 = doc.querySelector("h2")
              if (h2) {
                  title = h2.textContent
              } else {
                  return ""
              }
          }
      }
  }
  return title
}

function _findDescription(doc: HTMLDocument) {
  let description = doc.querySelector("meta[name='description']")?.getAttribute("content") || doc.querySelector("meta[property='og:description']")?.getAttribute("content") || doc.querySelector("meta[name='twitter:description']")?.getAttribute("content") 
  if(!description) {
      const p = doc.querySelector("p")
      if(p) {
          description = p.textContent
      } else {
          return ""
      }
  }
  return description
}


function _findImage(doc: HTMLDocument, url: string) {
  let image = doc.querySelector("meta[property='og:image']")?.getAttribute("content") || doc.querySelector("meta[name='twitter:image']")?.getAttribute("content") || doc.querySelector("meta[name='image']")?.getAttribute("content") 
  if(!image) {
      // find first image
      const img = doc.querySelector("img")
      if(img) {
          const src = img.getAttribute("src")
          if(src) {
              image = src
          } else {
              return ""
          }
      }
  }
  if(image?.startsWith("//")) {
      image = url.split("//")[0] + image
  }
  return image
}


const scrapSite = async (doc: HTMLDocument, url: string) => {
  const title = _findTitle(doc)
  const description = _findDescription(doc);
  const image = _findImage(doc, url) || ""

  return {
    title,
    description,
    image,
  }
}


serve(async (req) => {
  try {
    const { url } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'Missing url' }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        },

      )
    }


    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19582",
        "Connection": "keep-alive",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document",

      },
    });

    const html = await response.text();

    const doc = new DOMParser().parseFromString(html, "text/html")!;


    const data = await scrapSite(doc, getBaseUrl(url))

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        }
      },
    )
  } catch (e) {
    const errorResponse = JSON.stringify({
      title: "",
      description: "",
      image: "",
    })


    return new Response(
      errorResponse,
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      },
    )
  }
})
