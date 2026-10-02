// 초기 데이터 정의
let mockData = [
  { id: 0, isDone: false, content: "React study", date: new Date().getTime() },
  { id: 1, isDone: true, content: "친구만나기", date: new Date().getTime() },
  { id: 2, isDone: false, content: "낮잠자기", date: new Date().getTime() },
];

// 요일 매핑 배열
const day = ["일", "월", "화", "수", "목", "금", "토"];

// 신규 항목 고유 ID 채번용 인덱스 (초기 데이터 0, 1, 2 반영)
let idIndex = 3;

// 초기 로드 처리
window.onload = () => {
  // 상단 현재 날짜 출력 포맷: "YYYY년 M월 D일 O요일"
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayName = day[today.getDay()];

  const headerDateElement = document.querySelector(".Header > h1");
  if (headerDateElement) {
    headerDateElement.textContent = `${year}년 ${month}월 ${date}일 ${dayName}요일`;
  }

  // 초기 리스트 렌더링
  initData(mockData);
};

// 3. 리스트 렌더링 함수
const initData = (printData) => {
  const todosWrapper = document.querySelector(".todos_wrapper");
  if (!todosWrapper) return;

  // 기존 리스트 초기화
  todosWrapper.innerHTML = "";

  // mockData를 순회하며 TodoItem DOM 노드 구성
  printData.forEach((todo) => {
    // 날짜 포맷 (로컬 일시 문자열)
    const formattedDate = new Date(todo.date).toLocaleString();

    const todoItem = document.createElement("div");
    todoItem.className = "TodoItem";

    // 체크박스 속성 및 완료 시 취소선 동적 바인딩
    const isChecked = todo.isDone ? "checked" : "";
    const contentStyle = todo.isDone
      ? "text-decoration: line-through; color: #aaa;"
      : "";

    todoItem.innerHTML = `
      <input type="checkbox" onchange="onUpdate(${todo.id})" ${isChecked} />
      <div class="content" style="${contentStyle}">${todo.content}</div>
      <div class="date">${formattedDate}</div>
      <button name="${todo.id}" onclick="todoDel(this)">삭제</button>
    `;

    todosWrapper.appendChild(todoItem);
  });
};

// 추가(등록) 기능
document
  .querySelector(".Editor > button")
  .addEventListener("click", (event) => {
    event.preventDefault();

    const inputElement = document.querySelector(".Editor > input");
    const content = inputElement.value.trim();

    if (content === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    const newTodo = {
      id: idIndex++,
      isDone: false,
      content: content,
      date: new Date().getTime(),
    };

    mockData.push(newTodo);

    inputElement.value = "";
    initData(mockData);
  });

// 수정(체크박스 상태 변경) 기능
const onUpdate = (targetId) => {
  mockData = mockData.map((todo) =>
    todo.id === targetId ? { ...todo, isDone: !todo.isDone } : todo,
  );

  initData(mockData);
};

// 삭제 기능
const todoDel = (targetButton) => {
  const targetId = Number(targetButton.getAttribute("name"));

  mockData = mockData.filter((todo) => todo.id !== targetId);

  // 화면 재렌더링
  initData(mockData);
};

// 검색 필터링
const getFilterData = (search) => {
  if (search === "") {
    return mockData;
  }

  return mockData.filter((todo) =>
    todo.content.toLowerCase().includes(search.toLowerCase()),
  );
};

const searchInput = document.querySelector(".List > input");
if (searchInput) {
  searchInput.addEventListener("keyup", (event) => {
    const searchedTodos = getFilterData(event.target.value);
    initData(searchedTodos);
  });
}
