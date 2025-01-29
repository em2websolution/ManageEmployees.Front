import { AxiosHttpClient } from "./axios-http-client";

export class HttpSingleton {
  private static instance: AxiosHttpClient;

  public static getInstance(): AxiosHttpClient {
    if (!HttpSingleton.instance) {
      HttpSingleton.instance = new AxiosHttpClient();
    }

    return HttpSingleton.instance;
  }
}

export const httpInstance = HttpSingleton.getInstance();
