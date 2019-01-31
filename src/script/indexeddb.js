// == グローバル変数 ==
const db = new Dexie("AppDB"); // Dexie.jsオブジェクト
// == 関数オブジェクト定義 ==
const dbUtils = {
  // indexedDBを開く
  createDb: () => {
    db.version(1).stores({
      tasks: "&id,name,task,deadline,priority,complete,createdate,updatedate"
    });

    db.open().catch(err => {
      console.error(
        "Failed to open db in createDataBase: " + (err.stack || err)
      );
    });
  },
  // 保存されたTODOデータの読み取り
  getAllTodo: () => {
    db.transaction("r", db.tasks, async () => {
      const all_item = await db.tasks.toArray();
      if (all_item.length !== 0) {
        // カードを作る
        console.log("task item exist");
        for (let i = 0; i < all_item.length; i++) {
          let item = all_item[i];
          // タスクの取り出し( [] => String )
          let task_text;
          // タスクが存在するとき
          if (item.task.length !== 0) {
            task_text = [];
            for (let j = 0; j < item.task.length; j++) {
              task_text.push(item.task[j].task);
            }
            // 配列を文字列にする
            task_text = task_text.join(",");
          } else {
            task_text = "";
          }
          // 完了済みのタスクは表示しない
          if (item.complete === 0) {
            // カードを描画
            inputTask.addTodoCard(
              item.id,
              item.name,
              task_text,
              item.deadline,
              item.priority
            );
          }
        }
      } else {
        console.log("No task item");
      }
    })
      .then(() => {
        console.log("Get all item Complete!");
      })
      .catch(e => {
        console.error("Get all item Failed: " + e);
      });
  },
  // TODOを追加
  addDb: (id, name, task, deadeline, priority) => {
    // タスク更新フラグを追加
    let array;
    if (task !== "") {
      array = [];
      item_array = task.split(",");
      for (let i = 0; i < item_array.length; i++) {
        obj = {
          task: item_array[i],
          ischeck: 0
        };
        array.push(obj);
      }
    } else {
      array = "";
    }
    // 非同期処理で更新
    db.transaction("rw", db.tasks, async () => {
      await db.tasks.add({
        id: id,
        name: name,
        task: array,
        deadline: deadeline,
        priority: priority,
        complete: 0,
        createdate: new Date(),
        updatedate: new Date()
      });
    })
      .then(() => {
        console.log("Add TODO data Complete!");
        // htmlを描画する
        inputTask.addTodoCard(id, name, task, deadeline, priority);
      })
      .catch(e => {
        console.error("Add TODO data Failed: " + e);
      });
  },

  // チェックフラグ更新
  upDateTaskIschek: (id, index, check, target) => {
    // 非同期で取り出す
    db.transaction("rw", db.tasks, async () => {
      // idで検索して更新
      await db.tasks
        .where("id")
        .equals(id)
        .modify(item => {
          // ischeckフラグ更新
          if (check === "on") {
            item.task[index].ischeck = 0;
          } else if (check === "off") {
            item.task[index].ischeck = 1;
          }
          // updatedateも更新
          item.updatedate = new Date();
        });
    })
      .then(() => {
        console.log("Update ischeck flg Complete!");
        // html更新
        inputTask.isChecked(target, check);
      })
      .catch(e => {
        console.error("Update ischeck flg Failed: " + e);
      });
  },
  // 完了フラグの更新
  upDateComplete: id => {
    // 非同期で取り出す
    db.transaction("rw", db.tasks, async () => {
      // idで検索して更新
      await db.tasks
        .where("id")
        .equals(id)
        .modify(item => {
          // completeフラグ更新
          item.complete = 1;
          // updatedateも更新
          item.updatedate = new Date();
        });
    })
      .then(() => {
        console.log("Update ischeck flg Complete!");
        // html更新
        inputTask.cardDelete(id);
      })
      .catch(e => {
        console.error("Update ischeck flg Failed: " + e);
      });
  },
  // アイテムの削除
  deleteItem: id => {
    // 非同期で取り出す
    db.transaction("rw", db.tasks, async () => {
      // idで検索して削除
      await db.tasks
        .where("id")
        .equals(id)
        .delete();
    })
      .then(() => {
        console.log("Delete item Complete!");
        // html更新
        inputTask.cardDelete(id);
      })
      .catch(e => {
        console.error("Delete item Failed: " + e);
      });
  }
};
