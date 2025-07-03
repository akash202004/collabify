const Task = require('../models/Task');

const smartAssign = async () => {
    const tasks = await Task.find({ status: { $ne: 'Done' } });
    const count = {};

    tasks.forEach(task => {
        if (task.assignedTo) {
            const id = task.assignedTo.toString();
            count[id] = (count[id] || 0) + 1;
        }
    });

    const [minUserId] = Object.entries(count).sort((a, b) => a[1] - b[1])[0] || [];
    return minUserId;
};

module.exports = smartAssign;