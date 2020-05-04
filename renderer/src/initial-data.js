const initialDate = {
    TaskIdCount: 6,
    ColumnIdCount: 4,
    tasks: {
        'task-1': { id: "task-1", content: '歡迎使用PomoTodo', completed: false, ProceedTime: 0},
        'task-2': { id: "task-2", content: '請開始新增您自己的任務', completed: false, ProceedTime: 0},
        'task-3': { id: "task-3", content: '您可以點擊任何區塊的標題對其進行修改', completed: false, ProceedTime: 0},
        'task-4': { id: "task-4", content: '您只能在Trash can區塊刪除任務', completed: false, ProceedTime: 0},
        'task-5': { id: "task-5", content: '將任務放在Pomodoro Clock欄位，可以讓任務累計進行時間', completed: false, ProceedTime: 0},
    },
    columns: {
        'column-1':{
            id: 'column-1',
            type: 'Todo',
            title: 'To do',
            taskIds: ['task-1', 'task-2','task-3','task-4','task-5'],
        },
        'column-2':{
            id: 'column-2',
            type: 'Pomo',
            title: 'Pomodoro Clock',
            taskIds: [],
        },
        'column-3':{
            id: 'column-3',
            type: 'trash',
            title: 'Trash can',
            taskIds: [],
        },
    },
    columnOrder: ['column-1','column-2','column-3']
};

export default initialDate;