import { httpInstance } from '../services/http/http-client.factory'
import { TaskGatewayImpl } from './task.gateway.impl'

class TaskGatewaySingleton {
  private static instance: TaskGatewayImpl

  public static getInstance(): TaskGatewayImpl {
    if (!TaskGatewaySingleton.instance) {
      TaskGatewaySingleton.instance = new TaskGatewayImpl(httpInstance)
    }

    return TaskGatewaySingleton.instance
  }
}

export default TaskGatewaySingleton

export const taskGateway = TaskGatewaySingleton.getInstance()
