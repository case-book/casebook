CASEBOOK
======================

> CASEBOOK은 소프트웨어나 기타 테스트가 필요한 환경에서 테스트 수행과 관련된 테스트케이스의 작성, 테스트의 실행 및 리포트 등의 테스트 수행과 관련된 여러 기능을 보다 편리하게 사용하기 위해 사용할 수 있는 오픈 소스 소프트웨어입니다.
## 주요 기능
> CASEBOOK은 테스트 수행을 위해 필요한 테스트케이스의 작성, 테스트의 수행, E2E 테스트 도구와의 통합, 테스트 결과 리포팅 및 알림 등을 기능을 제공합니다.
* 회사나 조직 혹은 공통의 관심사를 가지는 그룹이 공유할 수 있는 '스페이스'라는 공간을 생성하고, '스페이스'의 참여자를 관리할 수 있습니다.
* '스페이스'에 '프로젝트'를 생성하고, '프로젝트'의 참여자를 관리할 수 있습니다.
* '프로젝트'에 트리 형태의 '테스트케이스 그룹'을 생성하고, '테스트케이스 그룹' 아래에 '테스트케이스'를 작성할 수 있습니다.
* '테스트케이스'에 작성을 위한 '테스트케이스 템플릿'을 추가하거나, 변경하여, '프로젝트' 별로 '테스트케이스' 작성이나, 결과 입력에 필요한 항목을 커스터마이징 할 수 있습니다.
* 작성된 '테스트케이스'를 테스트 수행을 위해 필요한 여러 조건을 선택하여, '테스트런'을 생성한 후, 테스트를 수행할 수 있습니다.
* '테스트런' 생성 시 테스트를 수행할 기간, 테스트 대상이 되는 '테스트케이스 그룹'이나 '테스트케이스', 테스트를 수행할 '테스터'를 자유롭게 선택할 수 있습니다.
* '테스트런'의 시작, 종료, 테스터의 변경 등의 '테스트런'의 상황 변화를 슬랙과 연동할 수 있습니다.
* '테스트런' 진행율을 비롯하여, 테스트 성공, 실패, 테스트 불가 등의 비율, 테스터별 테스트 진행 상황 등을 '대시보드'를 통해 확인할 수 있습니다.
* '테스트런'을 예약하여 특정 시간에 테스트가 수행될 수 있도록 미리 설정할 수 있으며, 혹은 '매일', '매주 월요일' 등 특정 날짜 조건에 따라 반복 수행할 수 있도록 '테스트런' 계획을 수립할 수 있습니다.
* 종료된 '테스트런'에 대한 다양한 지표와 함께 전체 테스트 수행 대상에 대한 결과를 '리포트'를 통해 확인할 수 있습니다.
* 반복 설정된 '테스트런'의 반복 조건에 '휴일 제외' 옵션을 적용할 수 있으며, '스페이스'별로 특성에 맞게 휴일을 설정할 수 있습니다. (매주 마지막 금요일 휴일 등)
* E2E 테스트도구와의 연동을 통해 자동화된 스크립트를 통해 테스트된 결과를 CASEBOOK과 연동할 수 있습니다.

## 라이선스
* Apache License 2.0 
## 설치 방법
* TBD
## 추가 설정
* TBD
## 개발 환경 구성
케이스북은 오픈 소스 프로젝트로 관심이 있는 개발자 누구나 참여할 수 있습니다. 기여하고 싶은 개발자라면 누구나 개발에 참여할 수 있습니다.
개발에 참여하기 위해 아래와 같은 방법으로 개발 환경을 구성할 수 있습니다.

### 프론트 환경 구성
프론트 개발 환경 구성을 위해 먼저 node (>16)을 설치합니다.
프론트 코드는 app 폴더 하위에 구성되어 있습니다. 먼저 app 폴더로 이동 후 관련 패키지를 설치합니다.
```agsl
app] npm install
```
※ 에디터로 사용하는 toast-ui/react-editor 라이브러리가 올바르게 설치되지 않는 경우, 아래 명령어로 의존성 검사를 제외하고 설치합니다.
```agsl
app] npm install --legacy-peer-deps
```
아래 명령어를 통해 프로젝트를 실행합니다.
```agsl
app] npm start
```
### ESLINT 및 PRETTIER 설정
사용하시는 IDE를 이용하여, ESLINT 및 PRETTIER가 동작하도록 설정합니다. 해당 설정들이 코드 변경 시 자동으로 변경되도록 설정하는 것을 권장드립니다.
 - IntelliJ
   - https://www.jetbrains.com/help/idea/eslint.html#ws_js_linters_eslint_install
   - https://www.jetbrains.com/help/idea/prettier.html
 - VSCODE
   - https://www.digitalocean.com/community/tutorials/how-to-format-code-with-prettier-in-visual-studio-code
   - https://www.digitalocean.com/community/tutorials/linting-and-formatting-with-eslint-in-vs-code

### 백엔드 환경 구성



## 릴리스
아래와 같이 릴리스 파일을 생성할 수 있습니다. 단, gradle 7.X 버전을 사용해야 올바르게 릴리스됩니다. gradle 8.0 이상의 버전에서는 현재 올바르게 릴리스 과정이 동작하지 않습니다.
```agsl
gradle release
```
릴리스 과정이 올바르게 처리되면, 프로젝트 파일의 build 파일의 dist 폴더 하위에 zip 파일이 생성됩니다.

이 후 상단의 설치 방법에 따라, 케이스북을 설치 및 사용할 수 있습니다.

설치 파일을 직접사용하지 않고, 빌드 과정에서 생성된 파일들을 이용하여, 일반적인 웹 애플리케이션을 배포하는 방식으로 각 사용자의 상황에 맞게 직접 설치를 진행할 수 있습니다. 이때 아래의 디렉토리에 생성된 파일들을 참고하실 수 있습니다. 
 - build/libs/casebook-api-[version].jar
 - app/build

## API 요청
curl -u (user-email):(user-token) -d "{""result"":""SUCCESS"", ""comment"":""your comment""}" -H "Content-Type: application/json"  -X POST http://casebook-domain/api/automation/projects/(project-token)/testruns/147/testcases/40
curl -u (user-email):3ad56155-6faf-475c-abba-9897fcf6fb56 -d "{""result"":""SUCCESS"", ""comment"":""your comment""}" -H "Content-Type: application/json" -X POST http://localhost:8080/api/automation/projects/d6ae0639-13a5-4f7d-b413-0f63369c94f2/testruns/147/testcases/40