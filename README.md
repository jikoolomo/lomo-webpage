# LOMO Links — GitHub Pages 소스

이 폴더는 **순수 HTML과 CSS만으로 만든 독립형 링크 페이지**입니다. 별도 빌드 도구나 설치 과정 없이 GitHub Pages에서 작동합니다. 현재 배포본은 인트로·본문·모달 이미지와 자연음을 로컬 자산으로 포함해 외부 이미지 장애의 영향을 줄였습니다.

## 적용 방법

저장소의 배포 루트에 `index.html`, `styles.css`, `script.js`, `robots.txt`, `sitemap.xml`, `audio/`, `images/` 폴더를 함께 올립니다. `.github/workflows/pages.yml`이 `main` 브랜치에 push될 때 GitHub Pages artifact를 만들고 자동 배포합니다. 공개 주소는 **https://jikoolomo.github.io/lomo-webpage/** 입니다.

모든 외부 링크는 이미 설정되어 있습니다. 카피는 `index.html`에서, 색상·여백·사진은 `styles.css`의 `:root` 및 각 이미지 배경 선언에서 바꿀 수 있습니다. 로컬 사진은 `images/` 폴더에서 교체할 수 있으며, `script.js`는 바다·숲·사막·이끼숲 링크의 호버 색 전환, 자연음 전환, LOMO House 상세 모달을 담당합니다. LOMO 페이지를 새로 열면 사운드는 ON 상태로 초기화되고, 페이지가 백그라운드로 전환되거나 다른 페이지로 이동하면 모든 자연음이 즉시 멈춥니다.

현재 사진은 자연의 수분·어둠·흙빛이 느껴지는 사진으로 구성되어 있습니다. LOMO의 진정성과 개인적 기록성을 강화하려면 `IMAGE-BRIEF.md`를 먼저 확인한 뒤, 사용자의 실제 여행·이동·도구·공간 사진으로 `images/` 폴더의 파일을 교체하는 것을 권장합니다. 파일 교체 후에는 `styles.css`의 해당 이미지 경로가 유지되도록 같은 파일명을 사용하면 됩니다.

페이지 최초 진입 시에는 바다·숲·사막·이끼숲을 약 5초 동안 순차적으로 지나가는 인트로가 표시됩니다. 스크립트는 `prefers-reduced-motion` 환경에서는 인트로를 건너뛰고, 이미 본 방문자에게는 즉시 본문을 보여 줍니다. 주소 끝에 `?intro=1`을 붙이면 인트로를 다시 볼 수 있습니다.

인트로에는 바다의 잔잔한 조류, 숲의 바람과 잎, 사막의 얇은 바람, 이끼숲의 물방울을 표현한 짧은 자연음이 순서대로 교차합니다. LOMO 페이지를 새로 열면 사운드는 ON 상태로 준비되며, 브라우저 자동재생 정책에 따라 첫 사용자 상호작용 후 재생됩니다. 페이지가 백그라운드로 전환되거나 다른 웹페이지로 이동하면 자연음은 즉시 멈추고, 다시 LOMO 페이지로 돌아온 뒤 사용자 상호작용이 있으면 재생이 재개됩니다.

`index.html`은 GitHub Pages에서 바로 동작하도록 오디오를 `audio/lomo-...-ambient.mp3` 상대 경로로 참조합니다. 따라서 이 소스와 함께 `audio/` 폴더를 저장소 배포 루트에 올리면 네 개의 자연음이 동작합니다. `기록의 생태계`에는 LOMO가 자연·여행에만 머무르지 않고 이동·생활·만들기·기록·머무르기로 확장될 수 있음을 나타내는 Earth Citizen 실천 영역이 포함되어 있습니다.

헤더 우측의 `한국어 / EN` 버튼으로 화면 언어를 즉시 전환할 수 있습니다. 저장된 언어 선택이 있으면 다음 방문에도 유지되고, 처음 방문해 저장된 선택이 없으면 브라우저 언어가 `ko` 또는 `ko-*`일 때 한국어로 시작하며 그 외에는 영어로 시작합니다. 인트로, 히어로, 생태계 설명, Route Studio, Waypoints, LOMO House 모달과 접근성 라벨을 함께 번역합니다.

검색엔진 노출을 위해 `robots.txt`와 `sitemap.xml`을 실제 GitHub Pages 주소에 연결했습니다. `index.html`에는 canonical, `og:url`, GitHub Pages 절대 경로의 공유 이미지와 `WebSite` 구조화 데이터 URL을 반영했습니다. Open Graph·Twitter 카드·`WebSite`/`Person` JSON-LD도 포함되어 있습니다. 공개 후 Google Search Console과 Bing Webmaster Tools에 sitemap URL을 제출하면 색인 상태를 확인할 수 있습니다.

> 브랜드 문장: **LOMO는 지구 위에 살아가는 지구시민의 태도로, 서로 먼 환경을 한 기록 안에 공존시키는 아카이브입니다.**
