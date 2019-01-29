// == イベント定義 ====================

// サブタスク追加
$(document).on("click", "#add_sub_task", () => {
  const sub_task = $("#input_sub_task").val();
  $("#input_sub_task").val("");
  console.log(sub_task);
  inputTask.addSubTask(sub_task);
});

//サブタスク確認
$(document).on("click", "#check_sub_task", () => {
  inputTask.showSubTask();
});

//サブタスク削除
// アロー関数は this のスコープが違うので event を受け取る必要がある
$(document).on("click", "#delete_subtask_item", event => {
  const index = $(event.target).attr("index");
  inputTask.deleteSubTask(index);
});

// サブタスク全件削除
$(document).on("click", "#delete_all_subtask", () => {
  inputTask.deleteAllSubTask();
});

// == 関数オブジェクト定義 =============
const inputTask = {
  // サブタスク追加  
  addSubTask: sub_task => {
    sub_task_array.push(sub_task);
    $("#check_sub_task").addClass("badge");
    $("#check_sub_task").attr("data-badge", sub_task_array.length);
  },
  // サブタスク表示
  showSubTask: () => {
    $("#all_sub_task")
      .children()
      .remove();
    if (sub_task_array.length !== 0) {
      for (let i = 0; i < sub_task_array.length; i++) {
        let item = sub_task_array[i];
        let sub_task_data = "<tr>";
        sub_task_data += "<td class='sub_task_item'>" + item + "</td>";
        sub_task_data +=
          "<td><button id='delete_subtask_item' class='button is-danger is-rounded' index='" +
          i +
          "'><i class='material-icons'>clear</i></button></td>";
        sub_task_data += "</tr>";
        $("#all_sub_task").append(sub_task_data);
      }
      $("#subtask_modal").addClass("is-active");
    }
  },
  // サブタスク削除
  deleteSubTask: index => {
    sub_task_array.splice(index, 1);
    if (sub_task_array.length === 0) {
      $("#check_sub_task").removeClass("badge");
    }
    $("#check_sub_task").attr("data-badge", sub_task_array.length);
    app.closeModal();
  },
  // サブタスク全件削除
  deleteAllSubTask: () => {
    sub_task_array = [];
    $("#all_sub_task")
      .children()
      .remove();
    $("#check_sub_task").removeClass("badge");
    $("#check_sub_task").attr("data-badge", sub_task_array.length);
    app.closeModal();
  }
};
