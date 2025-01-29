import { httpInstance } from "../services/http/http-client.factory";
import { UserGatewayImpl } from "./user.gateway.impl";

class UserGatewaySingleton {
  private static instance: UserGatewayImpl;

  public static getInstance(): UserGatewayImpl {
    if (!UserGatewaySingleton.instance) {
      UserGatewaySingleton.instance = new UserGatewayImpl(httpInstance);
    }

    return UserGatewaySingleton.instance;
  }
}

export default UserGatewaySingleton;

export const userGateway = UserGatewaySingleton.getInstance();
