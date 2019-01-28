// == グローバル変数 ========================
let input_task = true;
let search_task = false;
let setting_task = false;
// == イベント定義 ========================
$(document).ready(() => {
  // ページを読み込む
  $("#input_task").load("src/html/input_task.html #input_task_content");
  $("#search_task").load("src/html/search_task.html #search_task_content");
  $("#setting_task").load("src/html/setting_task.html #setting_task_content");
});
// サイドメニューのクリックイベント定義
$(document).on("click", "#input_task_page", () => {
  app.changeInputTask();
});

$(document).on("click", "#search_task_page", () => {
  app.changeSearchTask();
});

$(document).on("click", "#setting_task_page", () => {
  app.changeSettingTask();
});
// エレクトロンのページを開く
$(document).on("click", "#open_window", () => {
  const url = "https://electronjs.org/";
  app.openWindow(url);
});

//dropdownメニュー
$(document).on("click", "#menu_drop", () => {
  app.dropMenu();
});

// == 関数オブジェクト定義 =========================
const app = {
  // タスク入力ページ
  changeInputTask: () => {
    if (input_task == false) {
      $("#input_task").show("slow");
      $("#search_task").hide("slow");
      $("#setting_task").hide("slow");
      input_task = true;
      search_task = false;
      setting_task = false;
    }
  },
  // タスク検索ページ
  changeSearchTask: () => {
    if (search_task == false) {
      $("#input_task").hide("slow");
      $("#search_task").show("slow");
      $("#setting_task").hide("slow");
      input_task = false;
      search_task = true;
      setting_task = false;
    }
  },
  // 設定ページ
  changeSettingTask: () => {
    if (setting_task == false) {
      $("#input_task").hide("slow");
      $("#search_task").hide("slow");
      $("#setting_task").show("slow");
      input_task = false;
      search_task = false;
      setting_task = true;
    }
  },
  // ブラウザを開く
  openWindow: url => {
    urlopen(url);
  },
  // メニューを開く
  dropMenu: () => {
    const menu = $("#drop_flg");
    if (menu.hasClass("is-active")) {
      menu.removeClass("is-active");
    } else {
      menu.addClass("is-active");
    }
  }
};
