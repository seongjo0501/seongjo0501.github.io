/**
 * header,footer등등 layout 관련 js파일 입니다.
 */

// 반응형을 위한 화면 사이즈 체크
let screenSize = window.innerWidth;
window.addEventListener("resize", () => (screenSize = window.innerWidth));

// header,footer 비동기 작성
const layoutInclude = async (callbacks = {}) => {
    const layoutItems = document.querySelectorAll("[data-include-path]");

    for (const item of layoutItems) {
        const path = item.getAttribute("data-include-path");

        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`데이터 불러오기 에러: ${path}`);

            const data = await response.text();
            item.innerHTML = data;
        } catch (error) {
            console.error(`에러 발생: ${error}`);
        }
    }

    // 전달된 layoutEvents를 실행
    for (const key in callbacks) {
        if (callbacks.hasOwnProperty(key) && typeof callbacks[key] === "function") {
            callbacks[key]();
        }
    }
};

const layoutEvents = {
    headerScroll: () => {
        const header = document.querySelector("#header ");
        let scrollTop = window.scrollY;

        window.addEventListener("scroll", () => {
            scrollTop = window.scrollY;

            if (scrollTop > 10) {
                header.classList.add("on");
            } else {
                header.classList.remove("on");
            }
        });
    },
    gnbPc: () => {
        // GNB PC이벤트 - mouseenter/mouseleave
        const gnbBtns = gnb.querySelectorAll(".depth1 > li");

        const hover = (target, action) => {
            if (1280 >= screenSize) return;

            const depth2 = target.querySelector(".depth2");

            if (depth2) depth2.style.maxHeight = action === "show" ? `${depth2.scrollHeight}px` : "0px";
        };

        gnbBtns.forEach((btn) => {
            btn.addEventListener("mouseenter", ({ target }) => hover(target, "show"));
            btn.addEventListener("mouseleave", ({ target }) => hover(target, "hide"));
        });
    },

    gnbMo: () => {
        // GNB Mobile이벤트 - click
        const panel = document.querySelector("#panel");
        const gnb = document.querySelector("#gnb");
        const gnbBtns = gnb.querySelectorAll(".depth1 > li > a");

        // panel 열고 닫기
        panel.addEventListener("click", () => {
            gnb.classList.toggle("on", panel.checked);

            if (panel.checked) document.querySelector("#body-wrap").classList.add("on");
        });

        // Depth2 열고 닫기
        const click = (e) => {
            const depth2 = e.target.closest("li").querySelector(".depth2");

            if (screenSize >= 1280 || !depth2) return; // Depth2가 없으면 함수 종료

            e.preventDefault(); // Depth2 있으면 링크이동 막기

            const isActive = depth2.classList.toggle("on");

            depth2.style.maxHeight = isActive ? `${depth2.scrollHeight}px` : `0px`;
        };

        gnbBtns.forEach((btn) => btn.addEventListener("click", (e) => click(e)));
    },
    footerBtn: () => {
        const footer = document.querySelector("#footer");
        const btn = document.querySelector(".footBtn");
        let onOff = false;

        btn.addEventListener("click", () => {
            onOff = !onOff;

            footer.classList.toggle("on", onOff);
        });
    },
    subTitle: async () => {
        // sub-title을 sub_title.json에서 비동기로 가져온다.
        // header를 공통으로 빼서 비동기로 가져온다.
        const subTitle = document.querySelector(".sub-title");
        const currentPath = window.location.pathname;

        try {
            const response = await fetch("../../assets/js/sub_title.json");
            const data = await response.json();

            for (const path in data) {
                if (currentPath.includes(path)) {
                    const pageInfo = data[path];

                    subTitle.innerHTML = `<p>${pageInfo.title}<span>${pageInfo.description}</span></p>`;
                    return;
                }
            }

            subTitle.innerHTML = "<p>기본 텍스트 입니다. json 설정 해주세요 <span>기본 텍스트 입니다. json 설정 해주세요</span></p>";
        } catch (error) {
            console.error("JSON 파일을 불러오는 데 실패했습니다:", error);
        }
    },
};

layoutInclude(layoutEvents);
