import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 开始界面 UI 组件
 * 游戏开始前显示，点击开始按钮后隐藏并开始游戏
 */
@ccclass('StartUI')
export class StartUI extends Component {
    @property(Button)
    startButton: Button = null!; // 开始按钮

    @property(Node)
    startPanel: Node = null!; // 开始界面面板

    private _onGameStartCallback: Function = null;

    start() {
        // 注册按钮点击事件
        if (this.startButton) {
            this.startButton.node.on(Button.EventType.CLICK, this.onStartButtonClick, this);
        }

        // 显示开始界面
        this.show();
    }

    onDestroy() {
        // 移除事件监听
        if (this.startButton) {
            this.startButton.node.off(Button.EventType.CLICK, this.onStartButtonClick, this);
        }
    }

    /**
     * 设置游戏开始回调
     */
    setOnGameStartCallback(callback: Function) {
        this._onGameStartCallback = callback;
    }

    /**
     * 开始按钮点击事件
     */
    onStartButtonClick() {
        console.log('🎮 点击开始游戏按钮');
        
        // 隐藏开始界面
        this.hide();

        // 调用游戏开始回调
        if (this._onGameStartCallback) {
            this._onGameStartCallback();
        }
    }

    /**
     * 显示开始界面
     */
    show() {
        if (this.startPanel) {
            this.startPanel.active = true;
        }
        console.log('📋 显示开始界面');
    }

    /**
     * 隐藏开始界面
     */
    hide() {
        if (this.startPanel) {
            this.startPanel.active = false;
        }
        // 也隐藏整个 StartUI 节点
        this.node.active = false;
        console.log('✅ 隐藏开始界面');
    }

    /**
     * 检查开始界面是否显示
     */
    isShowing(): boolean {
        return this.startPanel ? this.startPanel.active : false;
    }
}

