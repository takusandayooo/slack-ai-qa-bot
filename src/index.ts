import { main } from "./app";

/**
 * @file GASエディタから実行できる関数を定義する
 */

declare const global: any;
global.main = main;
