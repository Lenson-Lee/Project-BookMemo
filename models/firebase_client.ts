import { Auth, getAuth } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
// import {  } from "firebase-admin";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const FirebaseCredentials = {
  apiKey: publicRuntimeConfig.apiKey,
  authDomain: publicRuntimeConfig.authDomain,
  projectId: publicRuntimeConfig.projectId,
};

export default class FirebaseClient {
  private static instance: FirebaseClient;
  private auth: Auth;
  public constructor() {
    const apps = getApps();
    if (apps.length === 0) {
      console.info("app.length === 0 >> firebase client init start");
      initializeApp(FirebaseCredentials);
    }
    this.auth = getAuth();
    console.info("firebase Auth");
  }
  public static getInstance(): FirebaseClient {
    if (FirebaseClient.instance === undefined || FirebaseClient === null) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }
  public get Auth(): Auth {
    return this.auth;
  }
}
