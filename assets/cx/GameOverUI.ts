import { _decorator, Component, Node, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property(Node)
    gameOverPanel: Node = null!; // Game Over 面板节点

    @property(Button)
    restartButton: Button = null; // 重新开始按钮

    @property(Label)
    finalScoreLabel: Label = null; // 最终分数标签

    private _onRestartCallback: Function = null;

    start() {
        // 初始化时隐藏 Game Over 面板
        this.hide();

        // 注册重新开始按钮点击事件
        if (this.restartButton) {
            this.restartButton.node.on(Button.EventType.CLICK, this.onRestartButtonClick, this);
        }
    }

    onDestroy() {
        // 移除事件监听
        if (this.restartButton) {
            this.restartButton.node.off(Button.EventType.CLICK, this.onRestartButtonClick, this);
        }
    }

    /**
     * 设置重新开始回调
     */
    setOnRestartCallback(callback: Function) {
        this._onRestartCallback = callback;
    }

    /**
     * 重新开始按钮点击事件
     */
    onRestartButtonClick() {
        console.log('🔄 点击重新开始按钮');
        
        // 隐藏 Game Over 界面
        this.hide();

        // 调用重新开始回调
        if (this._onRestartCallback) {
            this._onRestartCallback();
        }
    }

    /**
     * 显示 Game Over 画面
     * @param finalScore 最终分数
     */
    show(finalScore: number = 0) {
        if (this.gameOverPanel) {
            this.gameOverPanel.active = true;
            console.log('🎬 显示 Game Over 画面');
            
            // 更新最终分数显示
            if (this.finalScoreLabel) {
                this.finalScoreLabel.string = `最终分数: ${finalScore}`;
                console.log(`📊 最终分数: ${finalScore}`);
            }
        }
    }

    /**
     * 隐藏 Game Over 画面
     */
    hide() {
        if (this.gameOverPanel) {
            this.gameOverPanel.active = false;
            console.log('✅ 隐藏 Game Over 画面');
        }
    }
}

