// == イベントを定義 =================
// セレクトが変わったときにチェック
$(document).on("change", "#search_content", () => {
  let val = $("#search_content").val();
  serachTask.changeSerachType(val);
});

// タスクの確認
$(document).on("click", ".task_confirmation", () => {
  let show_task_array = $(".task_confirmation").attr("task_array");
  serachTask.showTaskState(show_task_array);
});

// == 関数オブジェクトを定義 =============================
const serachTask = {
  // 検索タイプ変更
  changeSerachType: val => {
    $(".serach_type").hide();
    $("#search_items")
      .children()
      .remove();
    if (val === "name") {
      $("#serach_text_area").show();
    } else if (val === "priority") {
      $("#search_priority_area").show();
    } else if (val === "createdate") {
      $("#serach_date_area").show();
    }
  },
  // 表示を作る
  createTableRow: items => {
    $("#no_item").hide();
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let row = "<tr id='" + item.uuid + "'>";
      // 完了
      if (item.complete === 0) {
        row +=
          "<td>" +
          '<i class="material-icons">check_box_outline_blank</i>' +
          "</td>";
      } else if (item.complete === 1) {
        row += "<td>" + '<i class="material-icons">check_box</i>' + "</td>";
      }
      // TODO名
      row += "<td>" + item.name + "</td>";
      // 締め切り
      row += "<td>" + item.deadline + "</td>";
      // 優先度
      if (item.priority === "high") {
        row += "<td>" + priority_obj.high + "</td>";
      } else if (item.priority === "usually") {
        row += "<td>" + priority_obj.usually + "</td>";
      } else if (item.priority === "low") {
        row += "<td>" + priority_obj.low + "</td>";
      }
      // タスク
      if (item.task.length !== 0) {
        str = item.task;
        row += "<td>";
        row +=
          "<button class='button is-info is-rounded task_confirmation' task_array='" +
          str +
          "'><i class='material-icons'>apps</i>";
        row += "</td>";
      } else {
        row += "<td>" + "タスクなし" + "</td>";
      }
      // 作成日
      row += "<td>" + item.createdate + "</td>";
      // 削除
      row += "<td>";
      row +=
        "<button class='button is-danger is-rounded row_delete' uuid='" +
        item.uuid +
        "'><i class='material-icons'>close</i>";
      row += "</td>";
      row += "</tr>";
      $("#search_items").append(row);
    }
  },
  // タスクを表示
  showTaskState: show_task_array => {
    let task = show_task_array.split(",");
    $("#show_all_task")
      .children()
      .remove();
    for (let i = 0; i < task.length; i++) {
      let item = JSON.parse(Base64.decode(task[i]));
      let row = "<tr>";
      row += "<td>";
      if (item.ischeck === 0) {
        row += '<i class="material-icons">check_box_outline_blank</i>';
      } else {
        row += '<i class="material-icons">check_box</i>';
      }
      row += "</td>";
      row += "<td>" + item.task + "</td>";
      row += "</tr>";
      $("#show_all_task").append(row);
    }
    $("#show_task_modal").addClass("is-active");
  }
};
