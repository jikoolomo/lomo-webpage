#!/usr/bin/env python3
"""Build crawlable Korean and English variants from the LOMO base document."""
from __future__ import annotations

import json
import re
from copy import deepcopy
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://jikoolomo.github.io/lomo-webpage/"
BASE_HTML = ROOT / "index.html"
LOCALES = ROOT / "locales.json"

META = {
    "ko": {
        "title": "Jikoo On · LOMO Links — 지구시민의 리빙 아카이브",
        "description": "사진, 글, 이동 도구와 미래의 테라리움 하우스를 한 기록에 연결하는 Jikoo On과 LOMO의 한국어 living archive.",
        "og_description": "사진·글·이동 도구·테라리움 하우스를 한 기록에 연결하는 Jikoo On과 LOMO의 living archive.",
        "og_image": "og-image-ko.jpg",
        "og_locale": "ko_KR",
        "name": "Jikoo On · LOMO Links — 지구시민의 리빙 아카이브",
    },
    "en": {
        "title": "Jikoo On · LOMO Links — Earth Citizen Living Archive",
        "description": "A living archive by Jikoo On connecting photographs, writing, movement tools, and a future terrarium house.",
        "og_description": "A living archive connecting photographs, writing, movement tools, and a future terrarium house.",
        "og_image": "og-image-en.jpg",
        "og_locale": "en_US",
        "name": "Jikoo On · LOMO Links — Earth Citizen Living Archive",
    },
}


def jsonld(locale: str, url: str) -> str:
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": f"{SITE}#website",
                "url": SITE,
                "name": "Jikoo On · LOMO Links",
                "description": META[locale]["description"],
                "inLanguage": locale,
            },
            {
                "@type": "WebPage",
                "@id": f"{url}#webpage",
                "url": url,
                "name": META[locale]["name"],
                "description": META[locale]["description"],
                "inLanguage": locale,
                "isPartOf": {"@id": f"{SITE}#website"},
                "about": {"@id": f"{SITE}#person"},
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": f"{SITE}images/hero-earth.webp",
                },
            },
            {
                "@type": "Person",
                "@id": f"{SITE}#person",
                "name": "Jikoo On",
                "alternateName": "지쿠 On",
                "sameAs": [
                    "https://www.instagram.com/lomoworldjk/",
                    "https://brunch.co.kr/@eatfear",
                    "https://eatfear.tistory.com/",
                ],
            },
        ],
    }
    return json.dumps(graph, ensure_ascii=False, indent=2)


def replace_meta(soup: BeautifulSoup, locale: str, url: str) -> None:
    meta = META[locale]
    soup.html["lang"] = locale
    soup.html["data-static-lang"] = locale

    description = soup.find("meta", attrs={"name": "description"})
    if description:
        description["content"] = meta["description"]

    title = soup.find("title")
    if title:
        title.string = meta["title"]

    canonical = soup.find("link", attrs={"rel": "canonical"})
    if canonical:
        canonical["href"] = url

    for link in soup.find_all("link", attrs={"rel": "alternate"}):
        hreflang = link.get("hreflang")
        if hreflang == "ko":
            link["href"] = f"{SITE}ko/"
        elif hreflang == "en":
            link["href"] = f"{SITE}en/"
        elif hreflang == "x-default":
            link["href"] = SITE

    og_values = {
        "og:url": url,
        "og:title": meta["title"],
        "og:description": meta["og_description"],
        "og:image": f"{SITE}images/{meta['og_image']}",
        "og:locale": meta["og_locale"],
        "og:locale:alternate": "en_US" if locale == "ko" else "ko_KR",
        "twitter:title": meta["title"],
        "twitter:description": meta["og_description"],
        "twitter:image": f"{SITE}images/{meta['og_image']}",
    }
    for key, value in og_values.items():
        attrs = {"property": key} if key.startswith("og:") else {"name": key}
        tag = soup.find("meta", attrs=attrs)
        if tag:
            tag["content"] = value

    jsonld_tag = soup.find("script", attrs={"type": "application/ld+json"})
    if jsonld_tag:
        jsonld_tag.string = "\n" + jsonld(locale, url) + "\n"


def translate_document(soup: BeautifulSoup, locale: str, translations: dict) -> None:
    table = translations[locale]
    for element in soup.select("[data-i18n], [data-i18n-html]"):
        key = element.get("data-i18n") or element.get("data-i18n-html")
        if key not in table:
            continue
        if element.has_attr("data-i18n-html"):
            fragment = BeautifulSoup(table[key], "html.parser")
            element.clear()
            for child in list(fragment.contents):
                element.append(deepcopy(child))
        else:
            element.string = table[key]
    for element in soup.select("[data-i18n-aria-label]"):
        key = element["data-i18n-aria-label"]
        if key in table:
            element["aria-label"] = table[key]
    for element in soup.select("[data-i18n-alt]"):
        key = element["data-i18n-alt"]
        if key in table:
            element["alt"] = table[key]


def rewrite_relative_paths(soup: BeautifulSoup, locale: str) -> None:
    for element in soup.find_all(src=True):
        if element["src"].startswith(("images/", "audio/", "script.js", "locales.js")):
            element["src"] = "../" + element["src"]
    for element in soup.find_all(srcset=True):
        candidates = []
        for candidate in element["srcset"].split(","):
            parts = candidate.strip().split()
            if parts and parts[0].startswith(("images/", "audio/", "script.js", "locales.js")):
                parts[0] = "../" + parts[0]
            candidates.append(" ".join(parts))
        element["srcset"] = ", ".join(candidates)
    for element in soup.find_all(href=True):
        href = element["href"]
        if href in {"styles.css", "styles.min.css"} or href.startswith("fonts/"):
            element["href"] = "../" + href
        elif href == "ko/":
            element["href"] = "../ko/"
        elif href == "en/":
            element["href"] = "../en/"
    for element in soup.select('[data-language]'):
        language = element.get("data-language")
        if language == locale:
            element["aria-current"] = "page"
        else:
            element.attrs.pop("aria-current", None)


def locale_from_html(soup: BeautifulSoup) -> str:
    return soup.html.get("data-static-lang", "ko")


def main() -> None:
    translations = json.loads(LOCALES.read_text(encoding="utf-8"))
    source = BASE_HTML.read_text(encoding="utf-8")
    (ROOT / "locales.js").write_text(
        "window.LOMO_TRANSLATIONS = " + json.dumps(translations, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    for locale in ("ko", "en"):
        soup = BeautifulSoup(source, "html.parser")
        url = f"{SITE}{locale}/"
        replace_meta(soup, locale, url)
        translate_document(soup, locale, translations)
        rewrite_relative_paths(soup, locale)
        target = ROOT / locale / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("<!doctype html>\n" + str(soup), encoding="utf-8")
        print(f"wrote {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
