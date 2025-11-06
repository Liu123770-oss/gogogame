import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 分数显示 UI 组件
 */
@ccclass('ScoreUI')
export class ScoreUI extends Component {
    @property(Label)
    scoreLabel: Label = null!; // 分数文字标签

    private _currentScore: number = 0;
    private _frameCount: number = 0; // 用于调试，每隔一段时间输出状态

    start() {
        console.log('🎮 ScoreUI 初始化');
        
        // 游戏开始时显示分数 UI
        this.show();
        
        console.log('  - scoreLabel 是否存在:', !!this.scoreLabel);
        if (this.scoreLabel) {
            console.log('  - scoreLabel 节点名称:', this.scoreLabel.node.name);
        }
    }

    /**
     * 增加分数（游戏过程中实时显示）
     */
    addScore(points: number = 1) {
        this._currentScore += points;
        // 游戏过程中实时更新显示
        this.updateScoreDisplay();
        console.log(`🎯 得分！当前分数: ${this._currentScore}`);
    }

    /**
     * 重置分数（游戏开始时调用）
     */
    resetScore() {
        this._currentScore = 0;
        // 游戏开始时显示分数
        this.updateScoreDisplay();
        this.show();
        console.log('🔄 分数已重置并显示');
    }

    /**
     * 显示最终分数（游戏结束时调用）
     */
    showFinalScore() {
        // 游戏结束时隐藏实时分数，因为 GameOverUI 会显示最终分数
        this.hide();
        console.log(`🏁 隐藏实时分数，最终分数: ${this._currentScore}`);
    }

    /**
     * 显示分数 UI
     */
    show() {
        this.updateScoreDisplay();
        this.node.active = true;
        if (this.scoreLabel) {
            this.scoreLabel.node.active = true;
        }
        console.log('👁️ ScoreUI 已显示');
    }

    /**
     * 隐藏分数 UI
     */
    hide() {
        this.node.active = false;
        console.log('🙈 ScoreUI 已隐藏');
    }

    /**
     * 获取当前分数
     */
    getCurrentScore(): number {
        return this._currentScore;
    }

    /**
     * 更新分数显示
     */
    private updateScoreDisplay() {
        if (this.scoreLabel) {
            this.scoreLabel.string = `分数: ${this._currentScore}`;
            console.log(`📊 更新分数显示: ${this._currentScore}`);
        } else {
            console.error('❌ scoreLabel 未设置！无法显示分数');
        }
    }

    /**
     * 每帧更新 - 用于调试
     */
    update(deltaTime: number) {
        this._frameCount++;
        
        // 每 300 帧（约 5 秒）输出一次状态
        if (this._frameCount % 300 === 0) {
            console.log('🔍 ScoreUI 状态检查:');
            console.log('  - ScoreUI 节点激活:', this.node.active);
            console.log('  - 当前分数:', this._currentScore);
        }
    }
}

