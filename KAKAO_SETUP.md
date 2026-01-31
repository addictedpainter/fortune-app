# 카카오 공유 기능 설정 가이드

## 1. 카카오 개발자 앱 등록

1. [카카오 개발자 사이트](https://developers.kakao.com/)에 접속
2. 로그인 후 "내 애플리케이션" 메뉴로 이동
3. "애플리케이션 추가하기" 클릭
4. 앱 이름 입력 (예: "토정비결 운세")
5. 회사명 입력 (선택사항)

## 2. JavaScript 키 발급

1. 생성한 앱을 선택
2. 좌측 메뉴에서 "앱 키" 선택
3. **JavaScript 키**를 복사

## 3. 플랫폼 등록

1. 좌측 메뉴에서 "플랫폼" 선택
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 입력:
   - 로컬 개발: `http://localhost:5173`
   - 배포 사이트: `https://fortune-app.pages.dev`

## 4. 환경 변수 설정

`.env` 파일을 열고 JavaScript 키를 입력:

```env
VITE_KAKAO_JS_KEY=your_javascript_key_here
```

예시:
```env
VITE_KAKAO_JS_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## 5. 개발 서버 재시작

환경 변수를 변경했으므로 개발 서버를 재시작해야 합니다:

```bash
# 현재 실행 중인 서버 중지 (Ctrl+C)
# 다시 시작
npm run dev
```

## 6. 테스트

1. 앱 실행
2. 운세 결과 페이지에서 "공유하기" 클릭
3. "카카오톡" 버튼 클릭
4. 카카오톡 공유 팝업이 정상적으로 표시되는지 확인

## 주의사항

- JavaScript 키는 절대 GitHub에 커밋하지 마세요 (`.env` 파일은 `.gitignore`에 포함됨)
- 배포 시에는 Cloudflare Pages 환경 변수에 `VITE_KAKAO_JS_KEY`를 추가해야 합니다
- 도메인이 변경되면 카카오 개발자 콘솔에서 플랫폼 도메인도 업데이트해야 합니다

## Cloudflare Pages 환경 변수 설정

1. Cloudflare Pages 대시보드 접속
2. 프로젝트 선택
3. Settings > Environment variables
4. Production 탭에서 "Add variable" 클릭
5. Variable name: `VITE_KAKAO_JS_KEY`
6. Value: (카카오 JavaScript 키 입력)
7. Save

## 문제 해결

### "잘못되었거나 삭제된 앱 키를 사용했습니다" 오류
- `.env` 파일에 올바른 JavaScript 키가 입력되었는지 확인
- 개발 서버를 재시작했는지 확인
- 브라우저 콘솔에서 "Kakao SDK initialized: true" 메시지 확인

### 공유 팝업이 뜨지 않음
- 카카오 개발자 콘솔에서 플랫폼 도메인이 올바르게 등록되었는지 확인
- 브라우저 팝업 차단이 해제되어 있는지 확인
