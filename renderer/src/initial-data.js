const initialDate = {
    idCount: 3,
    tasks: {
        'task-1': { id: "task-1", content: '歡迎使用PomoTodo', completed: false, ProceedTime: 0},
        'task-2': { id: "task-2", content: '請開始新增您自己的任務', completed: false, ProceedTime: 0}
    },
    columns: {
        'column-1':{
            id: 'column-1',
            type: 'Todo',
            title: 'To do',
            taskIds: ['task-1', 'task-2'],
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
            title: 'trash can',
            taskIds: [],
        },
    },
    columnOrder: ['column-1','column-2','column-3']
};

export default initialDate;