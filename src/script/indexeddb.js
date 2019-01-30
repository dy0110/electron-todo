// == グローバル変数 ==
const db = new Dexie("AppDB"); // Dexie.jsオブジェクト
const spawn = db.spawn
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
  // TODOを追加
  addDb: (id, name, task, deadeline, priority) => {
    // ジェネレーター(*)はアロー関数で使えない
    // TODO: トランザクション使った処理
    spawn(function*() {
      const item = yield db.add({
        id: id,
        name: name,
        task: task,
        deadline: deadeline,
        priority: priority,
        complete: 0,
        createdate: new Date(),
        updatedate: new Date()
      });
    }).then(
      () => {
        console.log("Add TODO data Complete!");
        inputTask.addTodoCard(id, name, task, deadeline, priority)
      }
    ).catch( (e) => {
      console.error("Add TODO data Failed: " + e);
    } );
  }
};