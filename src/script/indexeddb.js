// == グローバル変数 ==
const db = new Dexie("AppDB"); // Dexie.jsオブジェクト
// == 関数オブジェクト定義 ==
const dbUtils = {
  // indexedDBを開く
  createDb: () => {
    // プライマリーキー(id)で検索できないので,UUIDを別なテーブルに格納する
    db.version(1).stores({
      tasks:
        "++id,uuid,name,task,deadline,priority,complete,createdate,updatedate"
    });

    db.open().catch(err => {
      console.error(
        "Failed to open db in createDataBase: " + (err.stack || err)
      );
    });
  },
  // 保存されたTODOデータの読み取り(完了フラグが1になっていないものを取り出す)
  getSaveTodo: () => {
    db.transaction("r", db.tasks, async () => {
      await db.tasks
        .where("complete")
        .equals(0)
        .each(item => {
          // カードを描画
          inputTask.addTodoCard(
            item.uuid,
            item.name,
            item.task,
            item.deadline,
            item.priority
          );
        });
    })
      .then(() => {
        console.log("Get save item Complete!");
      })
      .catch(e => {
        console.error("Get save item Failed: " + e);
      });
  },
  // TODOを追加
  addDb: (uuid, name, task, deadeline, priority) => {
    // 日付生成
    let date_string = moment().format("YYYY/MM/DD HH:mm");
    // 非同期処理で更新
    db.transaction("rw", db.tasks, async () => {
      await db.tasks.add({
        uuid: uuid,
        name: name,
        task: task,
        deadline: deadeline,
        priority: priority,
        complete: 0,
        createdate: date_string,
        updatedate: date_string
      });
    })
      .then(() => {
        console.log("Add TODO data Complete!");
        // htmlを描画する
        inputTask.addTodoCard(uuid, name, task, deadeline, priority);
      })
      .catch(e => {
        console.error("Add TODO data Failed: " + e);
      });
  },

  // チェックフラグ更新
  upDateTaskIschek: (uuid, index, check, target) => {
    let date_string = moment().format("YYYY/MM/DD HH:mm");
    // 非同期で取り出す
    db.transaction("rw", db.tasks, async () => {
      // idで検索して更新
      await db.tasks
        .where("uuid")
        .equals(uuid)
        .modify(item => {
          // ischeckフラグ更新
          if (check === "on") {
            item.task[index].ischeck = 0;
          } else if (check === "off") {
            item.task[index].ischeck = 1;
          }
          // updatedateも更新
          item.updatedate = date_string;
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
  upDateComplete: uuid => {
    let date_string = moment().format("YYYY/MM/DD HH:mm");
    // 非同期で取り出す
    db.transaction("rw", db.tasks, async () => {
      // idで検索して更新
      await db.tasks
        .where("uuid")
        .equals(uuid)
        .modify(item => {
          // completeフラグ更新
          item.complete = 1;
          // updatedateも更新
          item.updatedate = date_string;
        });
    })
      .then(() => {
        console.log("Update ischeck flg Complete!");
        // html更新
        inputTask.cardDelete(uuid);
      })
      .catch(e => {
        console.error("Update ischeck flg Failed: " + e);
      });
  },
  // アイテムの削除
  deleteItem: uuid => {
    // 非同期で取り出す
    db.transaction("rw", db.tasks, async () => {
      // idで検索して削除
      await db.tasks
        .where("uuid")
        .equals(uuid)
        .delete();
    })
      .then(() => {
        console.log("Delete item Complete!");
        // html更新
        inputTask.cardDelete(uuid);
      })
      .catch(e => {
        console.error("Delete item Failed: " + e);
      });
  },
  // 全件検索
  getAllTodo: () => {
    db.transaction("r", db.tasks, async () => {
      const all_item = await db.tasks.toArray();
      if (all_item.length !== 0) {
       serachTask.createTableRow( all_item );
      } else {
       $("#no_item").show();
      }
    })
      .then(() => {
        console.log("Get all item Complete!");
      })
      .catch(e => {
        console.error("Get all item Failed: " + e);
      });
  }
};
