// == グローバル変数 ========================
let input_task = true; // ページ遷移管理フラグ
let search_task = false; // ページ遷移管理フラグ
let setting_task = false; // ページ遷移管理フラグ
let sub_task_array = []; //サブタスク格納オブジェクト
// == イベント定義 ========================
$(document).ready(() => {
  // ページを読み込む
  $("#input_task").load("src/html/input_task.html #input_task_content", () => {
    // タグインプットを定義
   
  });
  $("#search_task").load("src/html/search_task.html #search_task_content");
  $("#setting_task").load("src/html/setting_task.html #setting_task_content");
  $("#load_dialog").load( "src/html/dialogs.html #dialogs" )
  // サイドバー定義
  $("#sidebar").simplerSidebar({
    align: "left",
    selectors: {
      trigger: "#toggle-sidebar",
      quitter: ".close-sidebar"
    }
  });
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
  const url = "https://bulma.io/";
  app.openWindow(url);
});

//モーダルを閉じる
$(document).on("click", ".close_modal", () => {
  app.closeModal();
});

// == 関数オブジェクト定義 =========================
const app = {
  // タスク入力ページ
  changeInputTask: () => {
    if (input_task == false) {
      $("#input_task").show();
      $("#search_task").hide();
      $("#setting_task").hide();
      input_task = true;
      search_task = false;
      setting_task = false;
    }
  },
  // タスク検索ページ
  changeSearchTask: () => {
    if (search_task == false) {
      $("#input_task").hide();
      $("#search_task").show();
      $("#setting_task").hide();
      input_task = false;
      search_task = true;
      setting_task = false;
    }
  },
  // 設定ページ
  changeSettingTask: () => {
    if (setting_task == false) {
      $("#input_task").hide();
      $("#search_task").hide();
      $("#setting_task").show();
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
 closeModal: () => {
  const modal = $("div.modal.is-active");
  if (modal !== null) {
    // モーダルを隠す
    modal.removeClass("is-active");
  }
 }
};
