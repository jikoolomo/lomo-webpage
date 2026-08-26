# LOMO Links SEO 설정 안내

## 현재 적용된 항목

현재 소스에는 고유한 페이지 제목과 한국어 메타 설명, `lang="ko"`, `robots` 메타 태그, Open Graph·Twitter 카드, 작성자 정보, `WebSite`/`Person` JSON-LD, `robots.txt`, 히어로 이미지의 설명형 대체 텍스트가 포함되어 있습니다. Google은 검색 결과의 제목을 `<title>`, 주요 시각 제목, headings, `og:title`, 링크 텍스트, `WebSite` 구조화 데이터 등 여러 신호를 조합해 자동 생성하므로, 이 요소들이 같은 브랜드·페이지 주제를 가리키도록 맞추는 것이 중요합니다. [1]

메타 설명은 검색 결과에 항상 그대로 표시되는 것은 아니며, Google은 검색어와 더 잘 맞는 본문 일부를 스니펫으로 선택할 수 있습니다. 따라서 메타 설명을 키워드 목록으로 만들기보다, 페이지 전체를 한두 문장으로 자연스럽게 요약하고 본문에도 동일한 의미의 실제 콘텐츠를 유지해야 합니다. [2]

JSON-LD는 검색엔진이 페이지 의미를 이해하는 데 도움을 줄 수 있지만, 화면에 없는 사실을 구조화 데이터로 추가해서는 안 됩니다. 현재 `WebSite`와 `Person`만 사용한 이유는 이 페이지가 개인 창작자의 링크 허브이자 living archive이기 때문이며, Product·Review·Article 같은 스키마를 임의로 붙이지 않았습니다. 구조화 데이터는 Rich Results Test로 검증할 수 있습니다. [3]

## 도메인 확정 후 추가할 항목

| 설정 | 추가 위치 | 해야 할 일 |
|---|---|---|
| Canonical URL | `index.html`의 `<head>` | 실제 배포 주소를 확인한 뒤 `<link rel="canonical" href="https://실제-도메인/" />` 추가 |
| Sitemap | 루트의 `sitemap.xml` | 실제 도메인의 홈 URL을 넣어 생성하고 `robots.txt`의 `Sitemap:` 줄에 연결 |
| Search Console | 배포 후 외부 콘솔 | 도메인 또는 URL prefix 소유권을 확인하고 URL Inspection으로 색인 요청 |
| Open Graph absolute URL | `og:image` | 현재처럼 절대 URL을 유지하되, 최종 브랜드 이미지가 정해지면 안정적인 공개 URL로 교체 |
| 성능 | 이미지·폰트 | 실제 사진은 적절한 크기로 압축하고, 첫 화면 이미지는 우선 로딩, 하단 이미지는 지연 로딩 |
| 공유 미리보기 | Facebook Sharing Debugger 등 | 배포 후 실제 URL을 넣어 제목·설명·이미지 카드가 의도대로 보이는지 확인 |

Google은 사이트맵 제출이 필수는 아니지만, 관리하는 URL을 검색엔진에 알리는 수단으로 사용할 수 있다고 설명합니다. 또한 검색 노출은 어떤 메타 태그 하나로 보장되지 않으며, 크롤러가 CSS·JavaScript·이미지 등 사용자가 보는 리소스에 접근할 수 있어야 합니다. [1]

## LOMO Links에 특히 중요한 콘텐츠 SEO

이 사이트는 검색어를 반복하는 것보다 **Jikoo On, LOMO Links, LOMO Route Studio, 여행 기록, 사진 아카이브, 느린 여행 에세이, 지구시민, LOMO House**가 실제 본문과 외부 채널에서 일관되게 연결되는 것이 중요합니다. 각 외부 링크의 현재 설명은 이미 Instagram은 사진, 브런치는 에세이, 티스토리는 도시·체류 기록, Route Studio는 이동 도구라는 차이를 가지고 있으므로 유지하는 편이 좋습니다.

향후 페이지가 여러 개로 늘어나면 각 페이지마다 고유한 `<title>`, 메타 설명, H1, canonical URL을 만들고, LOMO House나 Route Studio에 독립 페이지를 부여하는 것이 좋습니다. 지금처럼 단일 링크 허브라면 과도한 태그나 키워드 페이지를 만드는 것보다 실제 기록을 정기적으로 업데이트하고, 외부 프로필과 상호 연결하며, 자연스러운 앵커 텍스트를 유지하는 편이 더 적합합니다. Google도 고유하고 정확한 제목·설명, 유용하고 최신인 사람 중심 콘텐츠, 설명적인 링크 텍스트를 권장합니다. [1] [2]

## 아직 적용하지 않은 이유

현재는 실제 GitHub Pages 주소가 제공되지 않았습니다. 따라서 존재하지 않는 canonical URL이나 sitemap 호스트를 추측해 넣지 않았습니다. 배포 주소가 정해지면 이 문서의 표에 따라 두 파일을 추가하고 Search Console에서 실제 크롤링·색인 상태를 확인하면 됩니다. Google은 변경 사항이 검색 결과에 반영되기까지 수 시간에서 수개월이 걸릴 수 있다고 안내하므로, 즉시 노출이나 순위 상승을 보장할 수는 없습니다. [1]

## References

[1]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide "Google Search Central — SEO Starter Guide"
[2]: https://developers.google.com/search/docs/appearance/title-link "Google Search Central — Influencing your title links in search results"
[3]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Google Search Central — Introduction to structured data markup"
