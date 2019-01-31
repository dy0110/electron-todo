// == グローバル変数 ========================
const priority_obj = {
  high: "高い",
  usually: "普通",
  low: "低い"
};
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
    return;
  }
  let task = task_array.join(",");
  let deade_line = validator.escape($("#input_date").val());
  let priority = $("#input_priority").val();
  // indexedDBへ登録
  dbUtils.addDb(id, todo_name, task, deade_line, priority);
  // 初期化
  $("#input_name").val("");
  $("#input_date").val("");
  task_array = [];
  $("#input_priority").val("high");
});

// チェックボックスのコントロール
$(document).on("click", ".is-checkradio", event => {
  const target = $(event.target);
  const check = target.attr("check");
  const array_index = target.attr("array_index");
  const id = target.attr("task_id");
  // indexedDB更新
  dbUtils.upDateTaskIschek(id, array_index, check, target);
});

// 完了ボタン 
$(document).on("click", ".complete_task", event => {
  const id = $(event.target).attr("task_id");
  dbUtils.upDateComplete(id);
});

// 削除ボタン
$(document).on("click", ".delete_task", event => {
  const id = $(event.target).attr("task_id");
  dbUtils.deleteItem(id);
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
  // TODO登録 カードを作製
  addTodoCard: (id, name, task, deadeline, priority) => {
    // 優先度判定
    let priority_text;
    if (priority == "high") {
      priority_text = priority_obj.high;
    } else if (priority == "usually") {
      priority_text = priority_obj.usually;
    } else if ((priority = "low")) {
      priority_text = priority_obj.low;
    }
    // 締め切り
    let deade_line_text;
    if (deadeline === "") {
      deade_line_text = "締め切りなし";
    } else {
      deade_line_text = deadeline + "(締め切り)";
    }
    // カード作製
    let todo_card = '<div class="column is-4">';
    todo_card += '<div class="card" id="' + id + '">';
    todo_card += '<header class="card-header">';
    todo_card += '<p class="card-header-title task_content">' + name + "</p>";
    todo_card += "</header>";
    todo_card += '<div class="card-content">';
    todo_card += '<div class="content">';
    todo_card +=
      '<div class="subtitle task_dead_line">' + deade_line_text + "</div>";
    todo_card +=
      ' <div class="subtitle task_priority">' +
      priority_text +
      "(優先度)</div>";
    if (task !== "") {
      // タスクがあればチェックボックス表示
      let array = task.split(",");
      for (let i = 0; i < array.length; i++) {
        let item_id = UUID.generate();
        todo_card += '<div class="field task">';
        todo_card +=
          '<input class="is-checkradio" type="checkbox" id="' +
          item_id +
          '" array_index="' +
          i +
          '" task_id="' +
          id +
          '" check="off"/>';
        todo_card += '<label for="' + item_id + '">' + array[i] + "</label>";
        todo_card += "</div>";
      }
    }
    todo_card += "</div></div>";
    todo_card += '<footer class="card-footer">';
    todo_card +=
      '<a href="#" class="card-footer-item input_label complete_task" task_id="' +
      id +
      '"><i class="material-icons"> done </i>完了</a>';
    todo_card +=
      '<a href="#" class="card-footer-item input_label delete_task" task_id="' +
      id +
      '"><i class="material-icons"> delete </i>削除</a>';
    todo_card += " </footer></div></div>";
    // HTMLを表示する
    $("#task_card_inline").append(todo_card);
  },
  // チェックボタンの更新
  isChecked: (target, check) => {
    if (check === "on") {
      $(target).attr("check", "off");
    } else if (check === "off") {
      $(target).attr("check", "on");
    }
  },
  // カードの削除
  cardDelete: id => {
    let cloumn = $("#" + id).parent();
    cloumn.remove();
  }
};
