/// <reference path=".d/jquery.d.ts"/>

interface JQueryXHR {
  host: string
}
module MODULE {

  export var NAME: string = 'preload';
  export var NAMESPACE: any = jQuery;

  // Model
  export declare class ModelInterface extends StockInterface {
    constructor()
    state_: State
    loaded_: { [index: string]: boolean }
    
    main_(context: ContextInterface, ...args: any[]): ContextInterface
    
    drive_(event: JQueryMouseEventObject, setting: SettingInterface): void
    preload_(event: JQueryMouseEventObject): void
    check_(event: JQueryMouseEventObject, setting: SettingInterface): void
    click_(event: JQueryMouseEventObject, setting: SettingInterface): void
    getURL_(setting: SettingInterface, element: HTMLElement): string
    
    PRELOAD(event: JQueryEventObject): void
    CLICK(event: JQueryMouseEventObject): void
    MOUSEMOVE(event: JQueryMouseEventObject): void
    MOUSEOVER(event: JQueryMouseEventObject): void
    MOUSEOUT(event: JQueryMouseEventObject): void
  }
  export declare class StockInterface {
    stock(key?: string, value?: any, merge?: boolean): any
    stock(key?: Object): any
  }
  // View
  export declare class ViewInterface {
    CONTEXT: ContextInterface
    state_: State

    BIND(uuid: string, event?: Event): ViewInterface
    UNBIND(uuid: string, event?: Event): ViewInterface

    RESET(setting: SettingInterface): ViewInterface

    OBSERVE(uuid: string): ViewInterface
    RELEASE(uuid: string): ViewInterface
  }
  // Controller
  export declare class ControllerInterface {
    constructor()
    state_: State

    EXTEND(context: Object): Object
    EXEC(...args: any[]): any
    exec_(context: ContextInterface, option: SettingInterface): any
    OBSERVE(): void
    
    PRELOAD(event: JQueryEventObject): void
    CLICK(event: JQueryMouseEventObject): void
    MOUSEMOVE(event: JQueryMouseEventObject): void
    MOUSEOVER(event: JQueryMouseEventObject): void
    MOUSEOUT(event: JQueryMouseEventObject): void
  }
  export interface FunctionInterface {
    enable()
    disable()
  }
  export interface MethodInterface {
  }

  // enum
  export enum State { wait = -1, ready, lock, seal }

  // Parameter
  export interface SettingInterface {
    gns: string
    ns: string
    nss: {
      array: string[]
      name: string
      event: string
      data: string
      class4html: string
      click: string
      mousemove: string
      mouseover: string
      mouseout: string
      touchstart: string
      touchmove: string
      touchend: string
    }
    link: string
    filter: ()=>any
    lock: number
    forward?: () => any
    check?: () => any
    balance: {
      host?: () => any
      ajax: JQueryAjaxSettings
    }
    interval: number
    limit: number
    cooldown: number
    skip: number
    query: string
    encode: boolean
    prefetch: string
    ajax: JQueryAjaxSettings
    
    uuid: string
    view: ViewInterface[]
    target: HTMLAnchorElement
    volume: number
    points: {
      pageX: number
      pageY: number
      timeStamp: number
    }[]
    touch: boolean
    xhr: JQueryXHR
    timeStamp: number
    option: any
  }

  // Member
  export interface ContextInterface extends JQuery {
    uuid?: string
  }
  
  export var GEN_UUID: () => string = function () {
    // version 4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16).toUpperCase();
    });
  }

}
