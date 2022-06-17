//tasks.test.js
const taskRouter =  require('../www/Routes/taskRoutes.js');
const task =  require('../www/Models/task.js');
test('get tasks', () => {
    const result = taskRouter.get('/tasks');
    expect.objectContaining(task);
})