# Jaehyeong Hwang — personal site

고려대학교 AXIS Lab 연구자 Jaehyeong Hwang을 소개하는 정적 웹사이트입니다.

## GitHub Pages 배포

1. GitHub에서 새 public repository를 만듭니다.
2. 이 폴더의 파일을 repository에 push합니다.
3. **Settings → Pages → Source: GitHub Actions** 를 선택합니다.
4. `index.html`의 canonical URL과 Open Graph URL을 실제 GitHub Pages 주소로 확인합니다.

```bash
git init
git add .
git commit -m "Create Jaehyeong Hwang personal website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

커밋 전에 Git 사용자 정보가 없다면 아래처럼 저장소 단위로 설정합니다.

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

## SEO 체크리스트

- `<title>`, description, Open Graph, canonical URL을 포함했습니다.
- `Person` JSON-LD에 이름, 소속, 공개 프로필 링크를 넣었습니다.
- `robots.txt`와 `sitemap.xml`을 포함했습니다.
- 실제 도메인을 정하면 `index.html`, `sitemap.xml`, `robots.txt`의 `jaehyeonghwang.github.io`를 교체하세요.

콘텐츠는 공개된 LinkedIn 프로필과 고려대학교 AXIS Lab 페이지를 기준으로 작성했으며, 학과·이메일 등 확인되지 않은 정보는 넣지 않았습니다.
