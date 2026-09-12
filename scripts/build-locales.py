#!/usr/bin/env python3
"""Build crawlable Korean and English variants from the LOMO base document."""
from __future__ import annotations

import argparse
import json
import re
import shutil
from copy import deepcopy
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://jikoolomo.github.io/lomo-webpage/"

META = {
    "ko": {
        "title": "Jikoo On · Earth Citizen | 여행하며 살아보고 만드는 기록",
        "description": "여러 나라와 도시에서 직접 살아보고 이동하며 배운 것을 기록하는 Jikoo On의 Earth Citizen 아카이브. 여행·한달살기·바다·사진·LOMO Route Studio.",
        "og_description": "여행·사진·바다·LOMO Route Studio를 기록하는 Jikoo On의 Earth Citizen living archive.",
        "og_image": "og-image-ko.jpg",
        "og_locale": "ko_KR",
        "name": "Jikoo On · Earth Citizen | 여행하며 살아보고 만드는 기록",
    },
    "en": {
        "title": "Jikoo On · Earth Citizen | Living, Moving & Making Around the World",
        "description": "Jikoo On's Earth Citizen archive — living across cities, moving across borders, entering the water, recording the journey and building tools from experience.",
        "og_description": "An Earth Citizen archive of living across cities, moving across borders, entering the water, and building from experience.",
        "og_image": "og-image-en.jpg",
        "og_locale": "en_US",
        "name": "Jikoo On · Earth Citizen | Living, Moving & Making Around the World",
    },
}

COPY_ITEMS = ("styles.css", "styles.min.css", "script.js", "locales.json", "robots.txt", "sitemap.xml", "_headers", "audio", "fonts", "images")


def jsonld(locale: str, url: str) -> str:
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "WebSite", "@id": f"{SITE}#website", "url": SITE, "name": "Jikoo On · LOMO Links", "description": META[locale]["description"], "inLanguage": locale},
            {"@type": "WebPage", "@id": f"{url}#webpage", "url": url, "name": META[locale]["name"], "description": META[locale]["description"], "inLanguage": locale, "isPartOf": {"@id": f"{SITE}#website"}, "about": {"@id": f"{SITE}#person"}, "primaryImageOfPage": {"@type": "ImageObject", "url": f"{SITE}images/hero-earth.webp"}},
            {"@type": "Person", "@id": f"{SITE}#person", "name": "Jikoo On", "alternateName": "지쿠 On", "sameAs": ["https://www.instagram.com/jikookim/", "https://brunch.co.kr/@eatfear", "https://eatfear.tistory.com/"]},
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
        link["href"] = {"ko": f"{SITE}ko/", "en": f"{SITE}en/", "x-default": SITE}.get(hreflang, link.get("href"))
    og_values = {"og:url": url, "og:title": meta["title"], "og:description": meta["og_description"], "og:image": f"{SITE}images/{meta['og_image']}", "og:locale": meta["og_locale"], "og:locale:alternate": "en_US" if locale == "ko" else "ko_KR", "twitter:title": meta["title"], "twitter:description": meta["og_description"], "twitter:image": f"{SITE}images/{meta['og_image']}"}
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
    for element in soup.select("[data-language]"):
        if element.get("data-language") == locale:
            element["aria-current"] = "page"
        else:
            element.attrs.pop("aria-current", None)


def prepare_output(output: Path) -> None:
    if output.resolve() == ROOT.resolve():
        return
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    shutil.copy2(ROOT / "index.html", output / "index.html")
    for item in COPY_ITEMS:
        source = ROOT / item
        destination = output / item
        if source.is_dir():
            shutil.copytree(source, destination)
        else:
            shutil.copy2(source, destination)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, default=ROOT, help="Clean output directory; defaults to the repository root")
    args = parser.parse_args()
    output = args.output_dir.resolve()
    prepare_output(output)
    base_html = output / "index.html"
    locales_path = output / "locales.json"
    translations = json.loads(locales_path.read_text(encoding="utf-8"))
    (output / "locales.js").write_text("window.LOMO_TRANSLATIONS = " + json.dumps(translations, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    source = base_html.read_text(encoding="utf-8")
    for locale in ("ko", "en"):
        soup = BeautifulSoup(source, "html.parser")
        url = f"{SITE}{locale}/"
        replace_meta(soup, locale, url)
        translate_document(soup, locale, translations)
        rewrite_relative_paths(soup, locale)
        target = output / locale / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("<!doctype html>\n" + str(soup), encoding="utf-8")
        print(f"wrote {target.relative_to(output)}")


if __name__ == "__main__":
    main()
