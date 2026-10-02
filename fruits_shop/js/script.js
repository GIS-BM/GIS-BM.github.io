// DOM 요소
const fruitList = document.getElementById("fruitList");
const veggieList = document.getElementById("veggieList");

const searchBox = document.getElementById("searchBox");
const sortSelect = document.getElementById("sortSelect");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let veggiePage = 0;

// 카드 렌더링 함수
function renderProducts(data, container) {
  //data는 과일 또는 야채의 배열
  console.log(data);
  container.innerHTML = "";
  data.forEach((item) => {
    container.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
        <a href="detail.html?id=${item.id}" class="text-decoration-none text-dark">
          <img src="${item.img}" class="card-img-top" alt="${item.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text text-primary fw-bold">${item.price.toLocaleString()}원</p>
          </div>
          </a>
        </div>
      </div>`;
  });
}
////////아래 filterAndSortFruits() 와 loadVeggies() 완성하세요. /////////////////////////////////
/* 
  과일 출력
*/
/*
  ## 전체 동작(html, js)
  기준 사이트에서 동작을 확인해 보니 input 이벤트가 걸려있다.
  searchBox.addEventListener("input", filterAndSortFruits);
  input 시마다 filterAndSortFruits() 메서드가 실행되는데
  메서드의 역할은 해당되는 상품명을 데이터베이스 역할을 하는 js에서 가져와서 카드 렌더링 함수를 이용해서 리렌더링 하는 구조로 보인다.
  ## 메서드 로직
  1. input 데이터 확인(없으면 전체 출력)
  2. input 데이터로 과일 명을 가져와서 리렌더링 해서 출력
  ## 사용해야 되는 데이터&html 요소
  1. fruit.js(과일 정보, 이미지 경로)
  renderProducts 리렌더링에 필요한 데이터
  2. container(<div id="fruitList" class="row g-4"></div>)
  html에 들어가는 데이터
*/
import { fruits } from "./data.js";
// 다른 자바 스크립트 파일에서 객체 변수 가져오기
// 다른 js 파일에서 export 필수

/*
입력받은 데이터를 기준으로 해당되는 데이터만 다시 출력
*/
function filterAndSortFruits() {
  let result = [{}];
  // let result;
  // 결과 저장 변수
  // [{}]

  let searchValue = searchBox.value.trim();
  // html input 요소에서 value 속성값 가져오기(검색창 값 가져오기)
  // trim() : 공백 제거 메서드
  //console.log(searchValue);
  //console.log("검색창 데이터 : " + searchValue);
  //console.log("과일 데이터 : " + fruits);
  //console.log("과일 이름 : " + fruits.map((fruit) => fruit.name));

  if (searchValue === "") {
    result = fruits;
  } else {
    // result = fruits.filter((name) => name === searchValue); // 작동 안하는 코드
    // result = fruits.filter((e) => e.name === searchValue); // 전체 문자열 일치시에만 검색
    result = fruits.filter((e) => e.name.includes(searchValue));
    // filter 메서드 : 배열의 각 요소를 확인하여 지정한 조건(참)을 만족하는 요소들만 모아 새로운 배열로 반환하는 내장 함수
    // fruits 배열에서 이름 속성값 가져와서 검색된 데이터와 비교 후 조건 일치하는 요소들로 다시 배열 생성
    // 객체 배열의 배열의 요소 e의 특정 속성 값 name 가져오기.
    // https://ordinary-code.tistory.com/182
    //console.log("결과 : " + result)
  }
  console.log(sortSelect);

  console.log("sortSelect.value :" + sortSelect.value);
  console.log("sortSelect.value 타입:" + typeof sortSelect.value);

  // sort : https://daleseo.com/js-sort-to-sorted/
  switch (sortSelect.value) {
    case "name": {
      console.log("name 확인");
      result.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      console.log("result :>> ", result);
      break;
    }
    case "low": {
      result.sort((a, b) => a.price - b.price);
      break;
    }
    case "high": {
      result.sort((a, b) => {
        return b.price - a.price;
      });
      break;
    }
  }
  console.log("filterAndSortFruits 실행됨");
  // console.log(result);

  renderProducts(result, fruitList);
  //화면에 다시 출력
  //renderProducts(?, ?)
}

// 채소 출력 (3개씩 증가)
/*
## 전체 동작(html, js)
data.js에서 veggies 데이터를 객체 배열로 가져온다.(export, import 사용)
데이터 3개만 가져와야되므로 3개까지만 가져오고 화면에 렌더링 한다.
버튼이 눌리면 3개씩 데이터를 더 가져와서 리렌더링 한다.

## js 메서드 로직
1. 일단 3개의 데이터만 가져와서 렌더링
2. 버튼이 눌리면 3개씩 가져와서 렌더링
3. 더 이상 가져올 데이터 없으면 상품이 없습니다. alert 출력

## 사용할 html 요소, js 데이터
1. const loadMoreBtn = document.getElementById("loadMoreBtn");
목록 더 나오게하는 html 버튼 요소
2. const veggieList = document.getElementById("veggieList");
채소 목록 출력될 html 요소
3. import { veggies } from "./data.js";
채소 데이터 저장되어 있는 js 객체 배열

*/
import { veggies } from "./data.js";
let veggieClickCount = -1;
let veggieResult = veggies.slice(0, 3);
// slice(0, 3) : 0 번 인덱스부터 3번 인덱스 직전까지
let veggiePlus;

// 클릭마다 push 되게
function loadVeggies() {
  veggieClickCount += 1;
  console.log(veggies.slice(3, 6));
  veggiePlus = veggies.slice(veggieClickCount * 3, (veggieClickCount + 1) * 3);
  if (veggieClickCount >= 1) veggieResult.push(...veggiePlus);
  // 객체 배열 안에 객체 배열 추가할 경우 ... 사용
  // Spread 연산자(...) : 배열(Array)이나 객체(Object)의 요소를 개별 값으로 펼쳐주는 연산자
  if (veggieClickCount >= veggies.length / 3) {
    alert("상품이 없습니다.");
  }
  renderProducts(veggieResult, veggieList);
}
////////////////////////////////////////////////////////

/* import { veggies } from "./data.js";

let veggieClickCount = -1;

function loadVeggies() {
  let result;
  // 결과 저장 변수
  veggieClickCount += 1;

  if (veggieClickCount * 3 + 3 <= veggies.length) {
    // 클릭 횟수와 배열의 길이를 비교
    let veggieNum = veggieClickCount * 3 + 3;
    result = veggies.slice(0, veggieNum);
  } else {
    result = veggies.slice(0, veggies.length);
    alert("상품이 없습니다.");
  }

  console.log("클릭 횟수 세기 : " + veggieClickCount);
  renderProducts(result, veggieList);
  // 데이터 개수에 따라서 렌더링
  //화면에 다시 출력
  //renderProducts(?, ?);
  // 첫번째 인자 : 객체 배열 데이터
  // 두번째 인자 : 데이터가 들어갈 특정 html 요소
}
/////////////////////////////////////////////////////// */

// 이벤트 리스너
searchBox.addEventListener("input", filterAndSortFruits);
sortSelect.addEventListener("change", filterAndSortFruits);
loadMoreBtn.addEventListener("click", loadVeggies);

// 초기 실행
filterAndSortFruits();
loadVeggies();
