# LOMO Links — GitHub Pages 소스

이 폴더는 **순수 HTML과 CSS만으로 만든 독립형 링크 페이지**입니다. 별도 빌드 도구나 설치 과정 없이 GitHub Pages에서 작동합니다. 현재 배포본은 인트로·본문·모달 이미지와 자연음을 로컬 자산으로 포함해 외부 이미지 장애의 영향을 줄였습니다.

## 적용 방법

저장소의 배포 루트에 `index.html`, `styles.css`, `styles.min.css`, `fonts/`, `script.js`, `locales.json`, `scripts/build-locales.py`, `robots.txt`, `sitemap.xml`, `audio/`, `images/` 폴더를 함께 올립니다. `.github/workflows/pages.yml`이 `main` 브랜치에 push될 때 번역 원본으로 `locales.js`, `/ko/index.html`, `/en/index.html`을 생성한 뒤 GitHub Pages artifact로 자동 배포합니다. 공개 주소는 **https://jikoolomo.github.io/lomo-webpage/** 입니다.

모든 외부 링크는 이미 설정되어 있습니다. 카피와 번역은 `index.html` 및 `locales.json`에서, 색상·여백·사진 크롭은 `styles.css`에서 바꿀 수 있습니다. Route Studio·Waypoint·LOMO House의 의미 있는 사진은 `<img>` 태그로 제공되며, alt·실제 크기·lazy loading이 함께 설정되어 있습니다. `script.js`는 호버 색 전환, 자연음 전환, LOMO House 상세 모달과 언어 런타임 보완을 담당합니다. LOMO 페이지를 새로 열면 사운드는 ON 상태로 초기화되고, 페이지가 백그라운드로 전환되거나 다른 페이지로 이동하면 모든 자연음이 즉시 멈춥니다.

현재 사진은 자연의 수분·어둠·흙빛이 느껴지는 사진으로 구성되어 있습니다. LOMO의 진정성과 개인적 기록성을 강화하려면 `IMAGE-BRIEF.md`를 먼저 확인한 뒤, 사용자의 실제 여행·이동·도구·공간 사진으로 `images/` 폴더의 파일을 교체하는 것을 권장합니다. 파일 교체 후에는 `styles.css`의 해당 이미지 경로가 유지되도록 같은 파일명을 사용하면 됩니다.

페이지 최초 진입 시에는 바다·숲·사막·이끼숲을 약 5초 동안 순차적으로 지나가는 인트로가 표시됩니다. 스크립트는 `prefers-reduced-motion` 환경에서는 인트로를 건너뛰고, 이미 본 방문자에게는 즉시 본문을 보여 줍니다. 주소 끝에 `?intro=1`을 붙이면 인트로를 다시 볼 수 있습니다.

인트로에는 바다의 잔잔한 조류, 숲의 바람과 잎, 사막의 얇은 바람, 이끼숲의 물방울을 표현한 짧은 자연음이 순서대로 교차합니다. LOMO 페이지를 새로 열면 사운드는 ON 상태로 준비되며, 브라우저 자동재생 정책에 따라 첫 사용자 상호작용 후 재생됩니다. 페이지가 백그라운드로 전환되거나 다른 웹페이지로 이동하면 자연음은 즉시 멈추고, 다시 LOMO 페이지로 돌아온 뒤 사용자 상호작용이 있으면 재생이 재개됩니다.

`styles.css`는 관리·수정용 원본이고 `styles.min.css`는 배포용 압축본입니다. 외부 Google Fonts 요청 대신 `fonts/`의 LOMO 전용 WOFF2 서브셋을 사용합니다. 이미지 태그에는 표시 크기별 `srcset`·`sizes`가 포함되어 모바일에서 작은 WebP를 우선 요청합니다.

`index.html`은 GitHub Pages에서 바로 동작하도록 오디오를 `audio/lomo-...-ambient.mp3` 상대 경로로 참조합니다. 따라서 이 소스와 함께 `audio/` 폴더를 저장소 배포 루트에 올리면 네 개의 자연음이 동작합니다. `기록의 생태계`에는 LOMO가 자연·여행에만 머무르지 않고 이동·생활·만들기·기록·머무르기로 확장될 수 있음을 나타내는 Earth Citizen 실천 영역이 포함되어 있습니다.

헤더 우측의 `한국어 / EN` 링크로 `/ko/`와 `/en/` 정적 페이지를 오갈 수 있습니다. 루트 `/`는 방문자의 브라우저 언어에 따라 초기 언어를 선택하는 진입점이며, 검색엔진이 직접 읽을 수 있는 언어별 정적 HTML은 `/ko/`와 `/en/`에 있습니다. 각 언어 페이지는 자기 자신과 상대 언어를 가리키는 canonical·hreflang·언어별 JSON-LD·Open Graph 메타를 가집니다. `images/og-image-ko.jpg`와 `images/og-image-en.jpg`는 각각 1200×630 JPEG이며, 언어별 공유 미리보기에 사용됩니다.

검색엔진 노출을 위해 `robots.txt`와 다국어 `sitemap.xml`을 실제 GitHub Pages 주소에 연결했습니다. sitemap에는 루트·`/ko/`·`/en/`의 `lastmod`, hreflang 대체 링크, 언어별 OG·hero 이미지가 포함됩니다. 루트와 `/ko/`, `/en/`에는 각각 canonical, `og:url`, 1200×630 JPEG 공유 이미지, 언어별 `WebSite`·`WebPage`·`Person` JSON-LD, 양방향 `hreflang`이 포함됩니다. 공개 후 Google Search Console과 Bing Webmaster Tools에 `https://jikoolomo.github.io/lomo-webpage/sitemap.xml`을 제출하면 색인 상태를 확인할 수 있습니다.

## 방문자 통계

Cloudflare Web Analytics의 공개용 beacon을 루트·`/ko/`·`/en/` 페이지에 설치했습니다. 방문자 식별을 위해 IP·브라우저 지문·개인정보를 직접 저장하지 않으며, Cloudflare 대시보드에서 익명 집계된 **순 방문자(Unique visitors)**를 확인합니다. Cloudflare Web Analytics에서 hostname은 `jikoolomo.github.io`로 등록되어 있고, 현재 GitHub Pages 경로 `/lomo-webpage/`의 페이지 방문을 수집합니다.

통계는 사이트에 공개 대시보드를 만들지 않고 Cloudflare 계정 로그인 후 **Web Analytics → `jikoolomo.github.io`** 속성에서 확인합니다. 날짜 범위를 오늘, 최근 7일, 최근 30일 또는 사용자 지정 전체 기간으로 선택할 수 있습니다. 정식 도메인 구매는 방문자 집계에 필요하지 않습니다. Cloudflare에서 생성된 token은 웹페이지에 공개되는 site 식별자이므로 저장소에 포함해도 되지만, Cloudflare API Token이나 비밀번호는 저장소에 넣지 않습니다.

> 브랜드 문장: **LOMO는 지구 위에 살아가는 지구시민의 태도로, 서로 먼 환경을 한 기록 안에 공존시키는 아카이브입니다.**
