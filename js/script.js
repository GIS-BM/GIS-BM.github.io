/**
 * DOM 쿼리 셀렉터 안전 래퍼 함수 (제공된 템플릿 헬퍼 패턴 준수)
 */
const $ = (selector) => ({
  on(event, handler) {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener(event, handler);
    });
  },
});

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     1. 모달 제어 함수 및 이벤트
     ========================================= */
  const modal = document.querySelector("#modal-container");
  const modalTitle = document.querySelector("#modal-title");
  const modalContent = document.querySelector("#modal-content");

  const openModal = (title, content) => {
    if (modal) {
      if (title && modalTitle) modalTitle.textContent = title;
      if (content && modalContent) modalContent.innerHTML = content;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // 배경 스크롤 방지
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  // 커뮤니케이션 제안하기 버튼
  $("#btn-contact-modal").on("click", function () {
    openModal(
      "커뮤니케이션 제안하기",
      "이메일: <strong>contact@domain.dev</strong><br /><br />새로운 프로젝트 기회, 기술 논의, 커피챗 제안 등 편하신 채널로 연락 주시면 24시간 내 성심성의껏 회신드리겠습니다."
    );
  });

  // 모달 닫기 버튼들 (기존 닫기 버튼 + 신규 X 버튼)
  $("#btn-modal-close").on("click", closeModal);
  $("#btn-modal-close-icon").on("click", closeModal);

  // 모달 배경 클릭 시 닫기
  $("#modal-container").on("click", function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // ESC 키보드 입력 시 닫기 지원 (접근성 보강)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  /* =========================================
     2. Featured Projects 링크 인터랙션
     =========================================
     프로젝트 카드는 외부/다른 사이트 이동 링크로 동작하며,
     모달 팝업 기능은 요청에 따라 전면 삭제되었습니다.
  */

  /* =========================================
     3. 기술 스택 클릭 인터랙션 (#id 타깃)
     ========================================= */
  const skillBoxes = document.querySelectorAll(".skill_box, .skill-box");
  const panel = document.querySelector("#skill-detail-panel");
  const panelTitle = document.querySelector("#panel-title");
  const panelDesc = document.querySelector("#panel-desc");

  skillBoxes.forEach((box) => {
    box.addEventListener("click", function () {
      // 선택된 카드 시각적 강조
      skillBoxes.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const skillNameEl = this.querySelector(".name") || this.querySelector("span");
      const skillName = skillNameEl ? skillNameEl.textContent : "";
      const skillDetail = this.getAttribute("data-skill-desc");

      if (panel && panelTitle && panelDesc) {
        panelTitle.textContent = `${skillName} 핵심 실무 역량`;
        panelDesc.textContent = skillDetail;
        panel.classList.add("active");
        
        // 패널로 부드럽게 시선 유도
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  /* =========================================
     4. 휠 스크롤 인터랙션 (Scroll Reveal)
     ========================================= */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            // 한 번 나타난 요소는 관찰 종료 (부드러운 UX)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // 구형 브라우저 폴백
    revealElements.forEach((el) => el.classList.add("is-revealed"));
  }

  /* =========================================
     5. 실시간 스크롤 진행률 & GNB 스크롤스파이
     ========================================= */
  const progressBar = document.querySelector("#scroll-progress");
  const navLinks = document.querySelectorAll(".nav_link, .nav-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // 진행률 계산
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    // 스크롤스파이 (현재 섹션 하이라이트)
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        link.classList.add("active-nav");
      } else {
        link.classList.remove("active-nav");
      }
    });
  }, { passive: true });
});
