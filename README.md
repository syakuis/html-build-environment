## html include를 구현한 빌드 시스템

html로 디자인 작업을 하다보면 반복적인 영역이 생기기 마련이다. 그럴때 프로그래밍에서 사용하는 include를 사용한다면 보다 효율적인 작업환경을 가질 수 있는 데 이를 구현한 개발환경에 대해 소개하려고 한다.

html에 약속된 문법을 사용하여 이를 빌드과정에서 치환하여 실제 소스가 삽입되게 하는 것이 핵심이다.

1. 반복적으로 사용되는 html 소스를 세부적으로 나눈다.
2. 나눠진 html 소스를 언제든지 include할 수 있다.
3. 빌드를 통해 최종 온전한 html 소스를 얻는 다.

## 빌드 환경 구축

빌드는 Gruntjs를 이용한다. 그래서 npm을 우선 설치하고 Gruntjs를 설치한다. 구글링하면 설치방법은 쉽게 알 수 있으니 생략한다.
그리고 프론트엔드 오픈소스 라이브러리를 쉽게 관리할 수 있게 도와주는 패키지 관지라 bower도 함께 설치한다.

**< / > npm 패키지 및 플러그인 설치**

빌드과정에서 필요한 패키지와 플러그인을 내려받는 다.

```
$ npm update
```

**< / > bower**

필요한 라이브러리를 내려받는 데 꼭 해야하는 작업은 아니다.

```
$ bower update
```

#### Gruntjs 플러그인 설명

grunt-replace : html 소스의 약속된 문법을 치환함 자세한 설명은 `https://github.com/outaTiME/grunt-replace` 참고한다.

grunt-contrib-clean : 빌드된 소스를 제거한다.

grunt-contrib-copy: 빌드 경로에 필요한 소스를 복사한다.

grunt-contrib-symlink: 대량의 폴더를 복사하지 않고 심볼릭 링크를 만들 사용할 수 있게 한다. 빌드 경로에 심볼릭 링크를 생성한다.

grunt-contrib-connect: 웹서버를 구동한다.

#### 경로 설명

- resources : css, js 공용 자원
- fixtures : 분할된 html 소스
- includes : 공통으로 사용된 html 소스
- src : 컴파일될 html 소스
- build : 컴파일 된 html 소스 및 자원

#### 소스설명

**< / > src/index.html**

```html
<!DOCTYPE html>
<html>
	<head>
		@@include.common  // (1)
	</head>

	<body>
		<#include = "header.html","layouts","" /> // (2)

		<#include = "board.list.html","modules","board" /> // (2)

		<#include = "footer.html","layouts","" /> // (2)
	</body>
</html>

```

**< / > Gruntfile.js**

```js
patterns: [
		{
			json: {
				"title": grunt.option('title'),
		
				"include": {
					"common": '<%= grunt.file.read("includes/commons.html") %>' // (1)
				},
		
				"layout": grunt.option('layout'),
				"skin": grunt.option('skin')
		
			}
		},
		{
			// (2)
			match: /<#include\s{0,}=\s{0,}["'](.+)["'],["'](.+)["'],["'](.{0,})["']\s{0,}\/>/ig,
			replacement: function(found) {
				var regx = /<#include\s{0,}=\s{0,}["'](.+)["'],["'](.+)["'],["'](.{0,})["']\s{0,}\/>/i;
				... skip ...
		
			}
		}
	]
},
```

문법 치환에 대한 기능은 https://github.com/outaTiME/grunt-replace 참고하면 된다.

정규식을 이용하여 여러 값을 얻을 수 있게 구현하였다. 현재 예제를 매개변수가 1개만 있어도 되지만 만약 여러개가 필요할 경우를 대비하여 설정되어 있다.

**< / > 빌드된 소스**

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=10">
<title>html build environment</title>
<link rel="stylesheet" href="./resources/fonts/NanumGothic/nanumgothic.css">
<link rel="stylesheet" href="./bower_components/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="./bower_components/font-awesome/css/font-awesome.min.css">

... skip ...

<link rel="stylesheet" href="./resources/css/non-responsive.css">

	</head>

	<body>
		<div class="container">
	<div class="header">
		header
	</div>

	<div class="container">


		게시판


			</div>

	<div class="container">
		<footer class="footer">
			footer
		</footer>
	</div>

</div>

	</body>
</html>

```


### 빌드하기

```
$ grunt init // 딱 한번
$ grunt build // 빌드실행 오류 없으면 build 폴더가 생성됨.
$ grunt server // 서버구동 필요할 경우에만 사용한다.
```





