/**
 * header,footer등등 layout 관련 js파일 입니다.
 */

// 반응형을 위한 화면 사이즈 체크
let screenSize = window.innerWidth;
window.addEventListener("resize", () => (screenSize = window.innerWidth));

const ui = async (callbacks = {}) => {
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

const events = {
    gnbPc: () => {
        // GNB PC이벤트 - mouseenter/mouseleave
        const gnbBtns = document.querySelectorAll(".depth1 > li");

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
        const gnbBtns = document.querySelectorAll(".depth1 > li > a");

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
    mainTitle: () => {
        const titles = document.querySelectorAll("#main .title");
        const titleTops = Array.from(titles).map((v) => window.scrollY + v.getBoundingClientRect().top);
        let scrollTop = window.scrollY;
        const startPoint = window.innerHeight * 0.9; // 화면에 거의 다 보일 때 쯤 발생시키기 위함

        const titleOnOff = () => {
            scrollTop = window.scrollY + startPoint;

            titleTops.forEach((top, i) => {
                if (scrollTop >= top) {
                    titles[i].classList.add("on");
                } else {
                    titles[i].classList.remove("on");
                }
            });
        };

        titleOnOff();
        window.addEventListener("scroll", titleOnOff);
    },
    mainHistory: () => {
        const history = document.querySelector(".main-work .history");
        if (!history) return; // history 요소가 없으면 함수 종료

        const line = history.querySelector(".line");
        const items = Array.from(history.querySelectorAll("ul li"));
        const startPoint = window.innerHeight * 0.8; // 이벤트 시점 기준
        let scrollTop = window.scrollY;

        // 아이템의 Y 좌표값 미리 계산
        const getItemsTop = () => items.map((item) => item.getBoundingClientRect().top + scrollTop);

        // 히스토리의 시작점 계산
        const historyTop = history.getBoundingClientRect().top + scrollTop;

        const scrollEvent = () => {
            scrollTop = window.scrollY;
            const itemsTop = getItemsTop();

            itemsTop.forEach((v, i) => {
                if (scrollTop + startPoint > v) {
                    items[i].classList.add("on");
                } else {
                    items[i].classList.remove("on");
                }
            });

            const lineHeight = Math.max(0, scrollTop + startPoint - historyTop);
            line.style.height = `${lineHeight}px`;
        };

        scrollEvent(); 
        window.addEventListener("scroll", scrollEvent);
        window.addEventListener("resize", scrollEvent);
    },
};

ui(events);
