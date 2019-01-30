// == イベント定義 ====================

// タスク追加
$(document).on("click", "#add_task", () => {
  const task = $("#input_task").val();
  $("#input_task").val("");
  if (task !== "") {
    inputTask.addTask(task);
  }
});

//タスク確認
$(document).on("click", "#check_task", () => {
  inputTask.showTask();
});

//タスク削除
// アロー関数は this のスコープが違うので event を受け取る必要がある
$(document).on("click", "#delete_subtask_item", event => {
  const index = $(event.target).attr("index");
  inputTask.deleteTask(index);
});

// タスク全件削除
$(document).on("click", "#delete_all_task", () => {
  inputTask.deleteAllTask();
});

// TODO登録
$(document).on("click", "#add_todo", () => {
  // ユニークIDの生成
  let id = UUID.generate();
  // xss対策
  let todo_name = validator.escape($("#input_name").val());
  if (todo_name === "") {
    openErrorModal("TODO名を入力してください。");
  }
  let task = task_array.join(",");
  let deade_line = validator.escape($("#input_date").val());
  let priority = $("#input_priority").val();
  // indexedDBへ登録
  dbUtils.addDb(id, todo_name, task, deade_line, priority);
});

// == 関数オブジェクト定義 =============
const inputTask = {
  // タスク追加
  addTask: task => {
    task = task.trim();
    // xss対策としてエスケープする
    let clean = validator.escape(task);
    console.log("task:" + task);
    console.log("clean:" + clean);
    task_array.push(clean);
    $("#check_task").addClass("badge");
    $("#check_task").attr("data-badge", task_array.length);
  },
  // タスク表示
  showTask: () => {
    $("#all_task")
      .children()
      .remove();
    if (task_array.length !== 0) {
      for (let i = 0; i < task_array.length; i++) {
        let item = task_array[i];
        let task_data = "<tr>";
        task_data += "<td class='task_item'>" + item + "</td>";
        task_data +=
          "<td><button id='delete_subtask_item' class='button is-danger is-rounded' index='" +
          i +
          "'><i class='material-icons'>clear</i></button></td>";
        task_data += "</tr>";
        $("#all_task").append(task_data);
      }
      $("#subtask_modal").addClass("is-active");
    }
  },
  // タスク削除
  deleteTask: index => {
    task_array.splice(index, 1);
    if (task_array.length === 0) {
      $("#check_task").removeClass("badge");
    }
    $("#check_task").attr("data-badge", task_array.length);
    app.closeModal();
  },
  // タスク全件削除
  deleteAllTask: () => {
    task_array = [];
    $("#all_task")
      .children()
      .remove();
    $("#check_task").removeClass("badge");
    $("#check_task").attr("data-badge", task_array.length);
    app.closeModal();
  },
  // TODO登録
  // TODO: HTMLを構築する
  addTodoCard: (id, name, task, deadeline, priority)=>{

  }
};
