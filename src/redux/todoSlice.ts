// todoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum StatusEnum {
  Pending,
  Completed,
  Overdue,
  Removed,
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  state: StatusEnum;
}

export interface RootState {
  todo: {
    tasks: Task[];
    selectedTask: Task | null;
  };
}

const initialState: RootState = {
  todo: {
    tasks: [],
    selectedTask: null,
  },
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.todo.tasks.push({ ...action.payload, id: state.todo.tasks.length + 1, state: StatusEnum.Pending });
      state.todo.selectedTask = null;
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const index = state.todo.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.todo.tasks[index] = { ...state.todo.tasks[index], ...action.payload };
        state.todo.selectedTask = null;
      }
    },
    removeTask: (state, action: PayloadAction<number>) => {
      const index = state.todo.tasks.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.todo.tasks[index].state = StatusEnum.Removed;
        state.todo.selectedTask = null;
      }
    },
    completeTask: (state, action: PayloadAction<number>) => {
      const index = state.todo.tasks.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.todo.tasks[index].state = StatusEnum.Completed;
        state.todo.selectedTask = null;
      }
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.todo.selectedTask = action.payload;
    },
    moveTaskToTrash: (state, action: PayloadAction<number>) => {
      const index = state.todo.tasks.findIndex((task) => task.id === action.payload);
      if (index !== -1) {
        state.todo.tasks[index].state = StatusEnum.Removed;
        state.todo.selectedTask = null;
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ taskId: number; newStatus: StatusEnum }>) => {
      const index = state.todo.tasks.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) {
        state.todo.tasks[index].state = action.payload.newStatus;
        state.todo.selectedTask = null;
      }
    },
  },
});

const actions = todoSlice.actions;

export const {
  addTask,
  editTask,
  removeTask,
  completeTask,
  setSelectedTask,
  moveTaskToTrash,
  updateTaskStatus,
} = actions;

export default todoSlice.reducer;
