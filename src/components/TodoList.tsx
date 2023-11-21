// TodoList.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, StatusEnum, moveTaskToTrash, updateTaskStatus,setSelectedTask } from '../redux/todoSlice';
import styled from 'styled-components';

const StyledTodoList = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
`;

const StyledTask = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TodoList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const dispatch = useDispatch();

  const handleEditTask = (taskId: number) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      dispatch(setSelectedTask(taskToEdit));
    }
  };

  const handleMoveToTrash = (taskId: number) => {
    dispatch(moveTaskToTrash(taskId));
  };

  const handleRestoreFromTrash = (taskId: number) => {
    dispatch(updateTaskStatus({ taskId, newStatus: StatusEnum.Pending }));
  };

  const handleUpdateStatus = (taskId: number, newStatus: StatusEnum) => {
    dispatch(updateTaskStatus({ taskId, newStatus }));
  };

  return (
    <StyledTodoList>
      <h2>Your Tasks</h2>
      {tasks.map((task) => (
        <StyledTask key={task.id}>
          <div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
          <div>
            <button onClick={() => handleEditTask(task.id)}>Edit</button>
            {task.state === StatusEnum.Removed ? (
              <button onClick={() => handleRestoreFromTrash(task.id)}>Restore</button>
            ) : (
              <>
                <button onClick={() => handleMoveToTrash(task.id)}>Move to Trash</button>
                {task.state !== StatusEnum.Completed && (
                  <div>
                    <label>Status:</label>
                    <select
                      value={task.state}
                      onChange={(e) => handleUpdateStatus(task.id, parseInt(e.target.value, 10))}
                    >
                      <option value={StatusEnum.Pending}>Pending</option>
                      <option value={StatusEnum.Completed}>Completed</option>
                      <option value={StatusEnum.Overdue}>Overdue</option>
                      <option value={StatusEnum.Removed}>Removed</option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
        </StyledTask>
      ))}
    </StyledTodoList>
  );
};

export default TodoList;