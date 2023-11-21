// TodoForm.tsx
import React, { useEffect, ChangeEvent, FormEvent } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, editTask, Task, RootState, setSelectedTask, StatusEnum } from '../redux/todoSlice';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  deadline: yup.date(),
});

const TodoForm: React.FC = () => {
  const dispatch = useDispatch();
  const selectedTask = useSelector((state: RootState) => state.todo.selectedTask);

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: '',
      description: '',
      deadline: '',
      state: StatusEnum.Pending,
    } as Task,
    validationSchema,
    onSubmit: (values: Task) => {
      const taskToAdd: Task = { ...values, id: Date.now() };
      if (selectedTask) {
        dispatch(editTask({ ...selectedTask, ...values }));
      } else {
        dispatch(addTask(taskToAdd));
      }
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (selectedTask) {
      formik.setValues({
        id: selectedTask.id,
        title: selectedTask.title,
        description: selectedTask.description || '',
        deadline: selectedTask.deadline || '',
        state: selectedTask.state,
      });
    }
  }, [selectedTask, formik]);

  const handleCancelEditing = () => {
    dispatch(setSelectedTask(null)); // Оставляем null, а не []
  };
  
  return (
    <form onSubmit={formik.handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" onChange={formik.handleChange} value={formik.values.title} />
        {formik.touched.title && formik.errors.title && <div>{formik.errors.title}</div>}
      </label>
      <label>
        Description:
        <textarea name="description" onChange={formik.handleChange} value={formik.values.description} />
      </label>
      <label>
        Deadline:
        <input type="date" name="deadline" onChange={formik.handleChange} value={formik.values.deadline} />
      </label>
      <div>
        <label>Status:</label>
        <select
  name="state"
  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
    formik.handleChange(e);
    formik.setFieldValue('state', e.target.value as unknown as StatusEnum);
  }}
  onBlur={formik.handleBlur}
  value={formik.values.state}
>
  <option value={StatusEnum.Pending}>Pending</option>
  <option value={StatusEnum.Completed}>Completed</option>
  <option value={StatusEnum.Overdue}>Overdue</option>
  <option value={StatusEnum.Removed}>Removed</option>
</select>

      </div>
      <button type="submit">{selectedTask ? 'Edit Task' : 'Add Task'}</button>
      {selectedTask && (
        <button type="button" onClick={handleCancelEditing}>
          Cancel Editing
        </button>
      )}
    </form>
  );
};


export default TodoForm;
