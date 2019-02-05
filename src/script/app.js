// == グローバル変数 ========================
let input_task = true; // ページ遷移管理フラグ
let search_task = false; // ページ遷移管理フラグ
let setting_task = false; // ページ遷移管理フラグ
let task_array = []; //タスク格納オブジェクト
let timer = undefined;
// == イベント定義 ========================
$(document).ready(() => {
  // ページを読み込む
  $("#load_input_task").load(
    "src/html/input_task.html #input_task_content",
    () => {
      // カレンダー定義
      $("#input_date").flatpickr({
        enableTime: true,
        dateFormat: "Y/m/d",
        locale: "ja"
      });
      $("#input_start_date").flatpickr({
        enableTime: true,
        dateFormat: "Y/m/d H:i",
        locale: "ja"
      });
      $("#input_end_date").flatpickr({
        enableTime: true,
        dateFormat: "Y/m/d H:i",
        locale: "ja"
      });
      // 保存されたデータの取り出し
      dbUtils.getSaveTodo();
    }
  );
  $("#load_search_task").load(
    "src/html/search_task.html #search_task_content",
    () => {
      // カレンダー定義
      $("#serach_date").flatpickr({
        enableTime: false,
        dateFormat: "Y/m/d",
        locale: "ja"
      });
    }
  );
  $("#load_setting_task").load(
    "src/html/setting_task.html #setting_task_content"
  );
  $("#load_dialog").load("src/html/dialogs.html #dialogs");
  // サイドバー定義
  $("#sidebar").simplerSidebar({
    align: "left",
    selectors: {
      trigger: "#toggle-sidebar",
      quitter: ".close-sidebar"
    }
  });
  // indexedDBへ接続
  dbUtils.createDb();
  // moment.js利用
  moment().format();
  // 通知監視
  app.setTimer();
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
      app.openLoading();
      $("#load_input_task").show();
      $("#load_search_task").hide();
      $("#load_setting_task").hide();
      input_task = true;
      search_task = false;
      setting_task = false;
      // タスクの取り出し
      $("#task_card_inline")
        .children()
        .remove();
      dbUtils.getSaveTodo();
    }
  },
  // タスク検索ページ
  changeSearchTask: () => {
    if (search_task == false) {
      app.openLoading();
      $("#load_input_task").hide();
      $("#load_search_task").show();
      $("#load_setting_task").hide();
      input_task = false;
      search_task = true;
      setting_task = false;
      // DBチェック
      dbUtils.getAllTodo();
    }
  },
  // 設定ページ
  changeSettingTask: () => {
    if (setting_task == false) {
      app.openLoading();
      $("#load_input_task").hide();
      $("#load_search_task").hide();
      $("#load_setting_task").show();
      input_task = false;
      search_task = false;
      setting_task = true;
      app.closeLoading();
    }
  },
  // ブラウザを開く
  openWindow: url => {
    urlopen(url);
  },
  // モーダルを閉じる
  closeModal: () => {
    const modal = $("div.modal.is-active");
    if (modal !== undefined) {
      // モーダルを隠す
      modal.removeClass("is-active");
    }
  },
  // エラーモーダルを開く
  openErrorModal: err_msg => {
    $("#error_message_area").text("");
    $("#error_message_area").text(err_msg);
    $("#error_modal").addClass("is-active");
  },
  // タイマーをセット
  setTimer: () => {
    timer = setTimeout(() => {
      dbUtils.todoNotification();
    }, 60000);
  },
  // タイマーをクリア
  clearTimer: () => {
    window.clearTimeout(timer);
    timer = undefined;
  },
  // トーストを出す
  openToast: (name, start, end, allday) => {
    let msg;
    if (allday === 0) {
      msg = start + " から " + end + " まで " + name + " の予定です";
    } else if (allday === 1) {
      msg = start + " から終日 " + name + " の予定です";
    }
    bulmaToast.toast({
      message: msg,
      type: "is-primary",
      position: "bottom-right",
      dismissible: true
    });
  },
  // ローディング表示
  openLoading: () => {
    $("#loading").addClass("is-active");
  },
  // ローディング非表示
  closeLoading: () => {
    $("#loading").removeClass("is-active");
  }
};
