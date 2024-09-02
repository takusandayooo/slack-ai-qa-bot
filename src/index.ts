import { main } from "./app";
// import {chatGPT4oMini} from "./openai";

/**
 * @file GASエディタから実行できる関数を定義する
 */

declare const global: any;
global.main = main;
