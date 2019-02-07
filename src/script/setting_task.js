// == イベント定義 ========================
// 全件削除
$(document).on("click", "#delete_all", () => {
  settingTask.showDeleteModal();
});

// モーダルはい
$(document).on("click", "#delete_all_item", () => {
  settingTask.deleteAll();
});

// スイッチ
$(document).on("click", "#on_notification", event => {
  let toggle = $(event.target).attr("switch");
  //$(event.target).attr( "checked","" );
  if (toggle == "on") {
    // タイマークリア
    app.clearTimer();
    $(event.target).attr("switch", "off");
  } else if (toggle == "off") {
    // タイマーセット
    app.setTimer();
    $(event.target).attr("switch", "on");
  }
});

// == 関数オブジェクトを定義 ===============
const settingTask = {
  // モーダル
  showDeleteModal: () => {
    $("#all_todo_delete_modal").addClass("is-active");
  },
  // 削除
  deleteAll: () => {
    dbUtils.clearAllItem();
    app.closeModal();
  }
};
