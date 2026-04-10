# 에어조나(AIRZONA) 수익 계산기

## Netlify 배포 방법

### 방법 1: GitHub 연동 (추천 - 자동 배포)

```bash
# 1. 압축 해제 후 폴더 진입
cd airzona-calculator

# 2. 패키지 설치
npm install

# 3. 로컬에서 확인 (선택사항)
npm run dev

# 4. GitHub에 올리기
git init
git add .
git commit -m "에어조나 수익 계산기"
git remote add origin https://github.com/본인계정/airzona-calculator.git
git push -u origin main
```

그다음 Netlify 사이트에서:
1. https://app.netlify.com 로그인
2. "Add new site" → "Import an existing project"
3. GitHub 선택 → airzona-calculator 저장소 선택
4. "Deploy site" 클릭 → 끝!

> 이후 GitHub에 push할 때마다 자동으로 재배포됩니다.

### 방법 2: CLI 직접 배포 (빠른 테스트)

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 패키지 설치 + 빌드
npm install
npm run build

# 배포
netlify deploy --prod --dir=dist
```

### 커스텀 도메인 연결
Netlify 대시보드 → Site settings → Domain management → Add custom domain
