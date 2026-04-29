import Grid from '@mui/material/Grid2'

import type { TaskType } from '@/types/apps/taskTypes'

import TaskListTable from './TaskListTable'

const TaskList = ({ taskData }: { taskData?: TaskType[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <TaskListTable tableData={taskData} />
      </Grid>
    </Grid>
  )
}

export default TaskList
