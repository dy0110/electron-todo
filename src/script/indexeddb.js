// == グローバル変数 ==
const db = new Dexie("AppDB"); // Dexie.jsオブジェクト
// == 関数オブジェクト定義 ==
const dbUtils = {
  // indexedDBを開く
  createDb: () => {
    // プライマリーキー(id)で検索できないので,UUIDを別なテーブルに格納する
    db.version(1).stores({
      tasks:
        "++id,uuid,name,task,start,end,allday,priority,complete,notification,createdate,updatedate"
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
            item.start,
            item.end,
            item.priority
          );
        });
    })
      .then(() => {
        console.log("Get save item Complete!");
        app.closeLoading();
      })
      .catch(e => {
        console.error("Get save item Failed: " + e);
      });
  },
  // TODOを追加
  addDb: (uuid, name, task, start, end, allday, priority) => {
    // 日付生成
    let date_string = moment().format("YYYY/MM/DD HH:mm");
    // 非同期処理で更新
    db.transaction("rw", db.tasks, async () => {
      await db.tasks.add({
        uuid: uuid,
        name: name,
        task: task,
        start: start,
        end: end,
        allday: allday,
        priority: priority,
        complete: 0,
        notification: 0,
        createdate: date_string,
        updatedate: date_string
      });
    })
      .then(() => {
        console.log("Add TODO data Complete!");
        // htmlを描画する
        inputTask.addTodoCard(uuid, name, task, start, end, priority);
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
          let task = JSON.parse(Base64.decode(item.task[index]));
          if (check === "on") {
            task.ischeck = 0;
          } else if (check === "off") {
            task.ischeck = 1;
          }
          item.task[index] = Base64.encode(JSON.stringify(task));
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
        if (input_task == true) {
          inputTask.cardDelete(uuid);
        } else if (search_task == true) {
          dbUtils.getAllTodo();
        }
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
        serachTask.createTableRow(all_item);
      } else {
        $("#search_items")
          .children()
          .remove();
        $("#no_item").show();
      }
    })
      .then(() => {
        console.log("Get all item Complete!");
        app.closeLoading();
      })
      .catch(e => {
        console.error("Get all item Failed: " + e);
      });
  },
  // 完了フラグ,優先度
  searchItem: (word, type) => {
    // 非同期で取り出す
    let items;
    db.transaction("rw", db.tasks, async () => {
      // idで検索して削除
      items = await db.tasks
        .where(type)
        .equals(word)
        .toArray();
    })
      .then(() => {
        console.log("Serach Item Complete!");
        if (items.length === 0) {
          $("#search_items")
            .children()
            .remove();
          $("#no_item").show();
        } else {
          serachTask.createTableRow(items);
        }
      })
      .catch(e => {
        console.error("Serach Item Failed: " + e);
      });
  },
  // 通知監視
  todoNotification: () => {
    // 非同期で取り出す
    let items;
    let now = moment();
    db.transaction("r", db.tasks, async () => {
      items = await db.tasks.toArray();
    })
      .then(() => {
        console.log("Todo Notification Complete!");
        if (items.length !== 0) {
          for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let start_moment = moment(item.start);
            if (item.allday === 0) {
              // 時刻接待のあるとき
              let diff = now.diff(start_moment, "minutes");
              if (diff <= 0) {
                // トーストを出す
                app.openToast(item.name, item.start, item.end, item.allday);
                dbUtils.updateNotification(item.uuid);
              }
            } else if (item.allday === 1) {
              // 終日
              let diff = now.diff(start_moment, "days");
              if (diff <= 0) {
                // トーストを出す
                app.openToast(item.name, item.start, "", item.allday);
                dbUtils.updateNotification(item.uuid);
              }
            }
          }
        }
      })
      .catch(e => {
        console.error("Todo Notification Failed: " + e);
      });
  },
  // 通知フラグアップデート
  updateNotification: uuid => {
    db.transaction("rw", db.tasks, async () => {
      await db.tasks.update(uuid, {
        notification: 1,
        updatedate: moment().format("YYYY/MM/DD HH:mm")
      });
    })
      .then(() => {
        console.log("Update Notification Complete!");
      })
      .catch(e => {
        console.error("Update Notification Failed: " + e);
      });
  },
  // 全件削除
  clearAllItem: () => {
    db.transaction("r", db.tasks, async () => {
      await db.tasks.clear();
    })
      .then(() => {
        console.log("Clear All Item Complete!");
      })
      .catch(e => {
        console.error("Clear All Item Failed: " + e);
      });
  }
};
