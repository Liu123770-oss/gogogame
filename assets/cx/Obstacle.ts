import { _decorator, Component, Node, Vec3, find, Collider } from 'cc';
import { NewComponent } from './NewComponent';
const { ccclass, property } = _decorator;

@ccclass('Obstacle')
export class Obstacle extends Component {
    @property
    speedMultiplier: number = 1.5; // 相对于玩家速度的倍数（>1 表示比玩家快，迎面而来更快）

    @property
    destroyDistance: number = 30; // 当障碍物经过玩家后方这个距离时销毁（必须>0）

    private _tempVec3: Vec3 = new Vec3();
    private _playerNode: Node = null;
    private _playerComponent: NewComponent = null;
    private _currentSpeed: number = 0; // 当前实际移动速度
    private _hasScored: boolean = false; // 是否已经得分（避免重复得分）

    start() {
        // 确保销毁距离是正数
        if (this.destroyDistance <= 0) {
            console.warn(`销毁距离必须>0，当前值${this.destroyDistance}已重置为30`);
            this.destroyDistance = 30;
        }

        // 检查碰撞器
        const collider = this.getComponent(Collider);
        if (collider) {
            console.log('========================================');
            console.log('✓ 障碍物碰撞器已找到');
            console.log('  - 碰撞器类型:', collider.constructor.name);
            console.log('  - Is Trigger:', (collider as any).isTrigger);
            console.log('  - 碰撞器已启用:', collider.enabled);
            console.log('  - 节点名称:', this.node.name);
            console.log('  - 节点位置:', this.node.position.toString());
            console.log('========================================');
        } else {
            console.error('✗ 障碍物没有碰撞器组件！请在编辑器中添加 BoxCollider 组件');
        }

        // 检查刚体
        const rb = this.node.getComponent('cc.RigidBody');
        if (rb) {
            console.log('✓ 障碍物刚体已找到，类型:', (rb as any).type);
        } else {
            console.warn('⚠️ 障碍物没有 RigidBody 组件！碰撞可能无法工作');
        }

        // 查找玩家节点（通过名称或标签）
        this._playerNode = find('Player') || find('Canvas/Player');
        if (!this._playerNode) {
            // 如果找不到，尝试通过场景查找带有 NewComponent 的节点
            const scene = this.node.scene;
            if (scene) {
                scene.walk((node: Node) => {
                    const comp = node.getComponent(NewComponent);
                    if (comp) {
                        this._playerNode = node;
                        this._playerComponent = comp;
                        return true; // 停止遍历
                    }
                });
            }
        } else {
            // 找到玩家节点后，获取其组件
            this._playerComponent = this._playerNode.getComponent(NewComponent);
        }

        if (this._playerComponent) {
            console.log(`障碍物找到玩家，当前玩家速度：${this._playerComponent.moveSpeed}`);
        } else {
            console.warn('障碍物未找到玩家组件');
        }
    }

    update(deltaTime: number) {
        // 如果游戏结束，停止移动
        if (this._playerComponent && this._playerComponent.isGameOver()) {
            return;
        }

        // 获取当前位置
        const pos = this.node.position;

        // 如果找到了玩家组件，动态读取玩家速度
        if (this._playerComponent) {
            // 障碍物向X正方向移动（与玩家的负方向移动相对）
            // 速度 = 玩家速度 * 倍数（让障碍物以相对速度迎面而来）
            this._currentSpeed = this._playerComponent.moveSpeed * this.speedMultiplier;
        } else {
            // 如果没找到玩家，使用默认速度
            this._currentSpeed = 5;
        }

        // 向X轴正方向移动（和玩家对向移动，迎面而来）
        this._tempVec3.set(pos.x + this._currentSpeed * deltaTime, pos.y, pos.z);
        this.node.setPosition(this._tempVec3);

        // 如果找到了玩家节点，基于玩家位置判断是否销毁
        if (this._playerNode) {
            const playerPos = this._playerNode.position;
            const distance = pos.x - playerPos.x; // 正数表示障碍物在玩家后方（已经过）
            
            // 当障碍物经过玩家后方（distance > 0）且还没得分时，触发得分
            if (distance > 0 && !this._hasScored && this._playerComponent) {
                this._hasScored = true;
                this._playerComponent.addScore(1);
            }
            
            // 玩家向负方向移动，障碍物向正方向移动（迎面而来）
            // 当障碍物经过玩家后方超过 destroyDistance 时销毁
            if (distance > this.destroyDistance) {
                console.log(`✓ 销毁障碍物 | 障碍物X: ${pos.x.toFixed(2)}, 玩家X: ${playerPos.x.toFixed(2)}, 距离差: ${distance.toFixed(2)}, 销毁阈值: ${this.destroyDistance}`);
                this.node.destroy();
                return;
            }
        }
    }
}


