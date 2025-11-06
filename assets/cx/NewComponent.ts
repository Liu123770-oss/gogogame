import { _decorator, Component, Node, Vec3, input, Input, KeyCode, Collider, ICollisionEvent } from 'cc';
import { GameOverUI } from './GameOverUI';
import { Joystick } from './Joystick';
import { StartUI } from './StartUI';
import { ScoreUI } from './ScoreUI';
const { ccclass, property } = _decorator;

@ccclass('NewComponent')
export class NewComponent extends Component {
    @property
    moveSpeed: number = 3; // 初始前进速度，可以在编辑器中调整

    @property
    sideSpeed: number = 5; // 左右移动速度，可以在编辑器中调整

    @property
    minBoundary: number = -4; // 最小边界（可在编辑器中调整）

    @property
    maxBoundary: number = 4; // 最大边界（可在编辑器中调整）

    @property
    speedIncreaseStartTime: number = 8; // 开始加速的时间（秒）

    @property
    speedBoostAtStart: number = 15; // 第8秒时突然提升到的速度

    @property
    speedIncreaseRate: number = 2; // 每秒增加的速度（线性增长率）

    @property
    maxSpeed: number = 50; // 最大速度上限（避免过快）

    @property(GameOverUI)
    gameOverUI: GameOverUI = null!; // Game Over UI 组件

    @property(StartUI)
    startUI: StartUI = null; // 开始界面 UI 组件

    @property(Joystick)
    joystick: Joystick = null; // 虚拟摇杆组件（可选，手机端使用）

    @property(ScoreUI)
    scoreUI: ScoreUI = null; // 分数显示 UI 组件

    private _tempVec3: Vec3 = new Vec3();
    private _moveLeft: boolean = false;  // 是否按下 A 键
    private _moveRight: boolean = false; // 是否按下 D 键
    private _isGameOver: boolean = false; // 游戏是否结束
    private _isGameStarted: boolean = false; // 游戏是否已开始
    private _gameTime: number = 0; // 游戏时长（秒）
    private _currentSpeed: number = 0; // 当前实际速度
    private _baseSpeed: number = 0; // 基础速度（用于重置）

    start() {
        // 保存基础速度
        this._baseSpeed = this.moveSpeed;
        this._currentSpeed = this.moveSpeed;

        // 注册键盘按下事件
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        // 注册键盘抬起事件
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        // 获取碰撞器组件并注册碰撞事件
        const collider = this.getComponent(Collider);
        if (collider) {
            console.log('========================================');
            console.log('✓ 玩家碰撞器已找到');
            console.log('  - 碰撞器类型:', collider.constructor.name);
            console.log('  - Is Trigger:', (collider as any).isTrigger);
            console.log('  - 碰撞器已启用:', collider.enabled);
            console.log('  - 节点名称:', this.node.name);
            console.log('========================================');
            
            collider.on('onCollisionEnter', this.onCollisionEnter, this);
            collider.on('onTriggerEnter', this.onTriggerEnter, this);
        } else {
            console.error('✗ 玩家没有碰撞器组件！');
        }

        // 检查刚体
        const rb = this.node.getComponent('cc.RigidBody');
        if (rb) {
            console.log('✓ 玩家刚体已找到，类型:', (rb as any).type);
        } else {
            console.warn('⚠️ 玩家没有 RigidBody 组件！碰撞可能无法工作');
        }

        // 设置开始界面回调
        if (this.startUI) {
            this.startUI.setOnGameStartCallback(() => {
                this.onGameStart();
            });
        } else {
            // 如果没有开始界面，直接开始游戏
            this.onGameStart();
        }

        // 设置 Game Over UI 的重新开始回调
        if (this.gameOverUI) {
            this.gameOverUI.setOnRestartCallback(() => {
                this.restartGame();
            });
        }
    }

    /**
     * 游戏开始
     */
    onGameStart() {
        this._isGameStarted = true;
        this._gameTime = 0; // 重置游戏时长
        this._currentSpeed = this._baseSpeed; // 重置速度
        console.log('🎮 游戏开始！');
        console.log(`⚡ 初始速度: ${this._currentSpeed.toFixed(2)}`);
        
        // 重置分数
        if (this.scoreUI) {
            console.log('✅ ScoreUI 已找到，正在重置分数...');
            this.scoreUI.resetScore();
        } else {
            console.error('❌ ScoreUI 未设置！请在编辑器中将 ScoreUI 节点拖拽到 Player 的 NewComponent 组件的 Score UI 属性中');
        }
    }

    onDestroy() {
        // 移除事件监听，避免内存泄漏
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);

        const collider = this.getComponent(Collider);
        if (collider) {
            collider.off('onCollisionEnter', this.onCollisionEnter, this);
            collider.off('onTriggerEnter', this.onTriggerEnter, this);
        }
    }

    onKeyDown(event: any) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this._moveLeft = true;
                break;
            case KeyCode.KEY_D:
                this._moveRight = true;
                break;
        }
    }

    onKeyUp(event: any) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this._moveLeft = false;
                break;
            case KeyCode.KEY_D:
                this._moveRight = false;
                break;
        }
    }

    onCollisionEnter(event: ICollisionEvent) {
        // 物理碰撞（Is Trigger = false）
        console.log('💥 [物理碰撞] 碰到障碍物了！碰撞对象:', event.otherCollider.node.name);
        this.handleCollision(event.otherCollider.node);
    }

    onTriggerEnter(event: ICollisionEvent) {
        // 触发器碰撞（Is Trigger = true）
        console.log('💥 [触发器] 碰到障碍物了！碰撞对象:', event.otherCollider.node.name);
        this.handleCollision(event.otherCollider.node);
    }

    handleCollision(otherNode: Node) {
        // 避免重复触发
        if (this._isGameOver) {
            return;
        }

        this._isGameOver = true;
        console.log('💀 游戏结束！');
        
        // 获取最终分数
        const finalScore = this.scoreUI ? this.scoreUI.getCurrentScore() : 0;
        
        // 显示 ScoreUI 的最终分数
        if (this.scoreUI) {
            this.scoreUI.showFinalScore();
        }
        
        // 显示 Game Over UI（传入最终分数）
        if (this.gameOverUI) {
            this.gameOverUI.show(finalScore);
        }
    }

    restartGame() {
        // 隐藏 Game Over UI
        if (this.gameOverUI) {
            this.gameOverUI.hide();
        }

        // 隐藏并重置分数 UI
        if (this.scoreUI) {
            this.scoreUI.resetScore(); // resetScore 会自动隐藏 ScoreUI
        }

        // 重置玩家位置
        this.node.setPosition(new Vec3(0, 0.5, 0));
        
        // 重置游戏状态
        this._isGameOver = false;
        this._isGameStarted = true; // 重启后继续游戏
        this._moveLeft = false;
        this._moveRight = false;
        this._gameTime = 0; // 重置游戏时长
        this._currentSpeed = this._baseSpeed; // 重置速度
        
        console.log('✅ 游戏已重置！');
        console.log(`⚡ 速度重置为: ${this._currentSpeed.toFixed(2)}`);
    }

    update(deltaTime: number) {
        // 如果游戏未开始或已结束，停止移动
        if (!this._isGameStarted || this._isGameOver) {
            return;
        }

        // 更新游戏时长
        const previousGameTime = this._gameTime;
        this._gameTime += deltaTime;

        // 检测是否刚到达第8秒（突变时刻）
        if (previousGameTime < this.speedIncreaseStartTime && this._gameTime >= this.speedIncreaseStartTime) {
            // 第8秒时突然提升速度！
            this._currentSpeed = this.speedBoostAtStart;
            console.log(`🚀💥 第${this.speedIncreaseStartTime}秒！速度突然提升！`);
            console.log(`⚡ ${this._baseSpeed.toFixed(2)} ➜ ${this._currentSpeed.toFixed(2)} (${((this._currentSpeed / this._baseSpeed - 1) * 100).toFixed(0)}% ⬆️)`);
        }
        // 第8秒之后继续线性增长
        else if (this._gameTime >= this.speedIncreaseStartTime) {
            const timeAfterStart = this._gameTime - this.speedIncreaseStartTime;
            this._currentSpeed = Math.min(
                this.speedBoostAtStart + timeAfterStart * this.speedIncreaseRate,
                this.maxSpeed
            );
            
            // 每秒输出一次速度信息
            if (Math.floor(this._gameTime) !== Math.floor(previousGameTime)) {
                console.log(`⚡ 游戏时长: ${Math.floor(this._gameTime)}s | 当前速度: ${this._currentSpeed.toFixed(2)} (${((this._currentSpeed / this._baseSpeed - 1) * 100).toFixed(0)}% ⬆️)`);
            }
        }

        // 获取当前位置
        const pos = this.node.position;
        
        // 计算新位置（使用动态速度）
        let newX = pos.x - this._currentSpeed * deltaTime; // 自动往前走（X轴负方向）
        let newZ = pos.z;

        // 优先使用摇杆输入（手机端）
        if (this.joystick && this.joystick.isTouching()) {
            const direction = this.joystick.getDirection();
            // 摇杆的 X 对应左右移动（Z轴）
            // 注意：摇杆向右是正值，但游戏中向右是 Z 轴负方向
            newZ -= direction.x * this.sideSpeed * deltaTime;
        } 
        // 如果没有摇杆输入，使用键盘输入（PC端）
        else {
        if (this._moveLeft) {
            newZ += this.sideSpeed * deltaTime; // 按A往左（Z轴正方向）
        }
        if (this._moveRight) {
            newZ -= this.sideSpeed * deltaTime; // 按D往右（Z轴负方向）
            }
        }

        // 限制 Z 轴在边界范围内
        newZ = Math.max(this.minBoundary, Math.min(this.maxBoundary, newZ));

        // 更新位置
        this._tempVec3.set(newX, pos.y, newZ);
        this.node.setPosition(this._tempVec3);
    }

    /**
     * 检查游戏是否已开始
     */
    isGameStarted(): boolean {
        return this._isGameStarted;
    }

    /**
     * 检查游戏是否结束
     */
    isGameOver(): boolean {
        return this._isGameOver;
    }

    /**
     * 增加分数（由障碍物调用）
     */
    addScore(points: number = 1) {
        if (this.scoreUI) {
            this.scoreUI.addScore(points);
        }
    }
}


